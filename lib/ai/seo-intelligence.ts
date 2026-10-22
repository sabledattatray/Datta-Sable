import { prisma } from '../prisma';
import { executeAiCompletion } from './provider';

export interface InternalLinkSuggestion {
  text: string;
  targetSlug: string;
  targetTitle: string;
  reason: string;
}

export interface SeoIntelligenceResult {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  targetKeywords: string[];
  suggestedInternalLinks: InternalLinkSuggestion[];
  jsonLd: Record<string, any>;
  checks: {
    titleLengthValid: boolean;
    descriptionLengthValid: boolean;
    hasProperSlug: boolean;
    hasInternalLinks: boolean;
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateSeoIntelligence({
  title,
  slug,
  category,
  content,
  excerpt,
}: {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
}): Promise<SeoIntelligenceResult> {
  const baseUrl = 'https://dattasable.com';
  const cleanSlug = generateSlug(slug || title);
  const canonicalUrl = `${baseUrl}/blog/${cleanSlug}`;

  // 1. Fetch existing published posts to identify internal linking targets
  const existingPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true },
    take: 40,
    orderBy: { createdAt: 'desc' },
  });

  const availableLinks = existingPosts
    .filter(p => p.slug !== cleanSlug)
    .map(p => ({ slug: p.slug, title: p.title, category: p.category }));

  const prompt = `Generate technical SEO metadata and internal link recommendations for this article:
Title: "${title}"
Category: "${category}"
Excerpt: "${excerpt}"
Content snippet: "${content.slice(0, 1500)}"

Available existing articles on the site for internal linking:
${availableLinks.slice(0, 15).map(l => `- [${l.category}] ${l.title} (slug: ${l.slug})`).join('\n')}

Requirements:
1. seoTitle: 50–60 characters. Engaging, clear, with primary keyword early.
2. seoDescription: 145–160 characters. Accurate summary of benefits, compelling meta description.
3. targetKeywords: 3–6 relevant search keywords/phrases.
4. suggestedInternalLinks: 2–4 recommended contextual link anchors from the available articles list, explaining the reason for the link. CRITICAL: "text" MUST be an exact verbatim substring present in the provided article content snippet, so that it can be automatically hyperlinked.

Respond ONLY with valid JSON:
{
  "seoTitle": "string",
  "seoDescription": "string",
  "targetKeywords": ["string"],
  "suggestedInternalLinks": [
    {
      "text": "anchor text in content",
      "targetSlug": "existing-slug",
      "targetTitle": "Existing Article Title",
      "reason": "Contextual reason"
    }
  ]
}`;

  try {
    const aiResult = await executeAiCompletion({
      prompt,
      systemPrompt: 'You are a technical SEO specialist specializing in search intent, metadata optimization, and internal link architecture.',
      task: 'SEO_INTELLIGENCE',
      jsonMode: true,
    });

    let cleaned = aiResult.text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(cleaned);

    const seoTitle = (parsed.seoTitle || title).slice(0, 70);
    const seoDescription = (parsed.seoDescription || excerpt).slice(0, 170);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      author: {
        '@type': 'Person',
        name: 'Datta Sable',
        url: 'https://dattasable.com',
        jobTitle: 'Senior Data Engineer & BI Architect',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Datta Sable',
        logo: {
          '@type': 'ImageObject',
          url: 'https://dattasable.com/images/dattasable.com.webp',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };

    return {
      seoTitle,
      seoDescription,
      canonicalUrl,
      targetKeywords: parsed.targetKeywords || [category],
      suggestedInternalLinks: parsed.suggestedInternalLinks || [],
      jsonLd,
      checks: {
        titleLengthValid: seoTitle.length >= 40 && seoTitle.length <= 65,
        descriptionLengthValid: seoDescription.length >= 120 && seoDescription.length <= 165,
        hasProperSlug: cleanSlug.length >= 3,
        hasInternalLinks: (parsed.suggestedInternalLinks || []).length > 0,
      },
    };
  } catch (err) {
    console.warn('SEO Intelligence AI completion fallback used:', err);

    const fallbackTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
    const fallbackDesc = excerpt.length > 155 ? `${excerpt.slice(0, 152)}...` : excerpt;

    return {
      seoTitle: fallbackTitle,
      seoDescription: fallbackDesc,
      canonicalUrl,
      targetKeywords: [category, 'Tutorial', 'Best Practices'],
      suggestedInternalLinks: availableLinks.slice(0, 2).map(l => ({
        text: l.title,
        targetSlug: l.slug,
        targetTitle: l.title,
        reason: `Related topic in ${l.category}`,
      })),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: fallbackTitle,
        description: fallbackDesc,
        url: canonicalUrl,
      },
      checks: {
        titleLengthValid: fallbackTitle.length >= 30,
        descriptionLengthValid: fallbackDesc.length >= 80,
        hasProperSlug: cleanSlug.length >= 3,
        hasInternalLinks: availableLinks.length > 0,
      },
    };
  }
}
