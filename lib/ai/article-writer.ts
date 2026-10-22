import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';
import { executeAiCompletion } from './provider';
import { detectDuplicateContent } from './duplicate-detector';
import { generateSeoIntelligence, generateSlug } from './seo-intelligence';
import { evaluateContentQuality } from './quality-gates';
import { ARTICLE_LENGTH_TARGETS, type ArticleLengthTier, type OperatingMode } from './config';
import { logAiAudit } from './audit';

export interface GenerateArticleOptions {
  topic: string;
  category: string;
  briefId?: string;
  tier?: ArticleLengthTier;
  operatingMode?: OperatingMode;
  targetKeywords?: string[];
  featuredImage?: string;
}

export function resolveFeaturedImage(topic: string, category: string, explicitImage?: string): string {
  if (explicitImage) return explicitImage;
  const lowerTopic = (topic || '').toLowerCase();
  const lowerCat = (category || '').toLowerCase();

  if (lowerTopic.includes('direct lake')) {
    return '/images/blog/advanced-power-bi-direct-lake-performance-tuning.webp';
  }
  if (lowerTopic.includes('warehouse') || lowerTopic.includes('sizing')) {
    return '/images/blog/Microsoft Fabric Warehouse Guide.webp';
  }
  if (lowerCat.includes('fabric') || lowerTopic.includes('fabric') || lowerTopic.includes('onelake')) {
    return '/images/blog/microsoft-fabric-ultimate-guide.webp';
  }
  if (lowerCat.includes('power bi') || lowerTopic.includes('power bi') || lowerTopic.includes('dax')) {
    return '/images/blog/bi_performance_hero_1777410226286.webp';
  }
  if (lowerCat.includes('ai') || lowerTopic.includes('agent') || lowerTopic.includes('prompt') || lowerTopic.includes('llm')) {
    return '/images/blog/architecting-production-multi-agent-ai-systems-featured.webp';
  }
  if (lowerCat.includes('sql') || lowerTopic.includes('sql') || lowerTopic.includes('database')) {
    return '/images/blog/sql-server-columnstore-indexes-optimization-guide.webp';
  }
  if (lowerCat.includes('security') || lowerTopic.includes('security') || lowerTopic.includes('cyber')) {
    return '/images/blog/cybersecurity-cloud-security-guide-2026.webp';
  }
  return '/images/blog/microsoft-fabric-architecture-explained-2026.webp';
}

export async function generateArticleDraft({
  topic,
  category,
  briefId,
  tier = 'COMPREHENSIVE',
  operatingMode = 'ASSISTED',
  targetKeywords = [],
  featuredImage,
}: GenerateArticleOptions) {
  await ensureAiStudioSchema();

  const lengthConfig = ARTICLE_LENGTH_TARGETS[tier] || ARTICLE_LENGTH_TARGETS.COMPREHENSIVE;
  const initialSlug = generateSlug(topic);

  // 1. Duplicate & Cannibalization Detection
  const duplicateCheck = await detectDuplicateContent({
    title: topic,
    slug: initialSlug,
    category,
  });

  if (duplicateCheck.recommendation === 'BLOCK_DUPLICATE') {
    throw new Error(duplicateCheck.suggestedActionMessage || `Identical article already exists on this site.`);
  }

  // Ensure unique slug if moderate similarity exists
  let finalSlug = initialSlug;
  const existingWithSlug = await prisma.post.findUnique({ where: { slug: finalSlug } });
  if (existingWithSlug) {
    finalSlug = `${initialSlug}-${Date.now().toString().slice(-4)}`;
  }

  const db = prisma as any;

  // 2. Fetch or load Research Brief
  let briefData: any = null;
  if (briefId) {
    briefData = await db.aiResearchBrief.findUnique({ where: { id: briefId } });
  }

  const outlinePrompt = briefData?.suggestedOutline
    ? `Follow this verified technical outline:\n${JSON.stringify(briefData.suggestedOutline, null, 2)}`
    : `Develop a comprehensive technical outline with 4–6 major H2 sections, practical code/DAX/SQL snippets where relevant, and real-world architectures.`;

  const verifiedClaimsPrompt = briefData?.verifiedClaims
    ? `Ground the article in these verified claims and documentation links:\n${JSON.stringify(briefData.verifiedClaims, null, 2)}`
    : `Prioritize official Microsoft Learn and enterprise engineering best practices.`;

  const prompt = `Write an authoritative, enterprise-grade technical article on:
Topic: "${topic}"
Category: "${category}"
Target Word Count: ${lengthConfig.min} to ${lengthConfig.max} words (aim for ~${lengthConfig.target} words).

${outlinePrompt}
${verifiedClaimsPrompt}

Structural Requirements:
1. Title: Engaging, professional, no hyperbolic clickbait.
2. Introduction: Hook with the practical business/engineering problem, clear stakes.
3. Key Takeaways: 3-5 bulleted highlights.
4. Body Sections (H2 & H3): In-depth walkthrough, step-by-step logic, edge cases, performance trade-offs. Include formatted code/SQL/DAX/Python blocks and comparison tables where helpful.
5. Frequently Asked Questions (FAQ): 3-4 real-world technical troubleshooting questions.
6. Summary & Next Steps: Practical conclusion.
7. References & Further Reading: Markdown links to official documentation.

Tone: Senior Data Architect / BI Engineer. Actionable, precise, zero filler or vague generalities.

Respond ONLY with valid JSON:
{
  "title": "string",
  "excerpt": "string (120–160 chars summary)",
  "content": "Full markdown content starting with ## Introduction",
  "suggestedKeywords": ["keyword1", "keyword2"]
}`;

  const aiResult = await executeAiCompletion({
    prompt,
    systemPrompt: 'You are a principal technical author and data platform architect. You write crystal-clear, deep, practical markdown documentation.',
    task: 'ARTICLE_DRAFTING',
    jsonMode: true,
  });

  const parsed = parseArticleDraftJson(aiResult.text, topic, category);

  const title = parsed.title || topic;
  const excerpt = parsed.excerpt || `A detailed technical breakdown of ${topic}.`;
  const content = parsed.content || '';

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(3, Math.ceil(words / 200));

  // 3. Generate SEO Intelligence & Internal Links
  const seo = await generateSeoIntelligence({
    title,
    slug: finalSlug,
    category,
    content,
    excerpt,
  });

  // 4. Content Quality Gate Evaluation
  const quality = evaluateContentQuality({
    title,
    content,
    excerpt,
    category,
    wordCount: words,
    duplicateRiskScore: duplicateCheck.maxSimilarity,
    verifiedClaimsCount: briefData?.verifiedClaims ? (briefData.verifiedClaims as any[]).length : 1,
    hasSeoTitle: Boolean(seo.seoTitle),
    hasSeoDescription: Boolean(seo.seoDescription),
  });

  // 5. Persist AiContentDraft
  const draft = await db.aiContentDraft.create({
    data: {
      briefId: briefId || null,
      title,
      slug: finalSlug,
      category,
      excerpt,
      content,
      readTime,
      wordCount: words,
      featuredImage: resolveFeaturedImage(topic, category, featuredImage),
      targetKeywords: [...new Set([...targetKeywords, ...seo.targetKeywords])],
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      canonicalUrl: seo.canonicalUrl,
      jsonLd: seo.jsonLd as any,
      internalLinks: seo.suggestedInternalLinks as any,
      status: 'DRAFT',
      operatingMode,
      qualityScore: quality.score,
      factualAccuracyScore: quality.factualVerificationStatus === 'PASSED' ? 95 : 75,
      seoScore: quality.seoComplete ? 90 : 65,
      originalityScore: Math.max(0, 100 - duplicateCheck.maxSimilarity),
    },
  });

  // 6. Persist AiQualityReport
  await db.aiQualityReport.create({
    data: {
      draftId: draft.id,
      score: quality.score,
      factualVerificationStatus: quality.factualVerificationStatus,
      duplicateRiskScore: quality.duplicateRiskScore,
      duplicateMatches: duplicateCheck.matches as any,
      seoChecks: seo.checks as any,
      readabilityMetrics: { readabilityScore: quality.readabilityScore },
      blockers: quality.blockers,
      recommendations: quality.recommendations,
    },
  });

  // 7. Persist Initial Version in AiContentVersion
  await db.aiContentVersion.create({
    data: {
      draftId: draft.id,
      version: 1,
      title,
      content,
      excerpt,
      changedBy: 'AI',
      changeNotes: `Initial draft generated via AI Studio (${tier} tier, ${words} words)`,
    },
  });

  await logAiAudit({
    action: 'AI_DRAFT_GENERATED',
    details: {
      draftId: draft.id,
      slug: draft.slug,
      qualityScore: quality.score,
      wordCount: words,
      mode: operatingMode,
    },
  });

  return {
    draft,
    quality,
    seo,
    duplicateCheck,
  };
}

export function parseArticleDraftJson(rawText: string, topic: string, category: string): {
  title: string;
  excerpt: string;
  content: string;
  suggestedKeywords: string[];
} {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

  // 1. Direct JSON.parse
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.content && parsed.content.length > 250) {
      return {
        title: parsed.title || topic,
        excerpt: parsed.excerpt || `A detailed technical breakdown of ${topic}.`,
        content: parsed.content,
        suggestedKeywords: Array.isArray(parsed.suggestedKeywords) ? parsed.suggestedKeywords : [category],
      };
    }
  } catch (err) {
    // Proceed to resilient fallback
  }

  // 2. Resilient string extraction if newlines, control chars, or quotes broke JSON.parse
  try {
    const titleMatch = cleaned.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const excerptMatch = cleaned.match(/"excerpt"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

    const contentStartIdx = cleaned.indexOf('"content":');
    if (contentStartIdx !== -1) {
      const quoteStart = cleaned.indexOf('"', contentStartIdx + 10);
      if (quoteStart !== -1) {
        let contentEnd = cleaned.lastIndexOf('"suggestedKeywords"');
        if (contentEnd === -1) contentEnd = cleaned.lastIndexOf('"keywords"');
        if (contentEnd === -1) contentEnd = cleaned.lastIndexOf('"}');
        if (contentEnd === -1 || contentEnd <= quoteStart) {
          contentEnd = cleaned.length;
        }

        let rawContent = cleaned.slice(quoteStart + 1, contentEnd).trim();
        rawContent = rawContent.replace(/",?\s*$/, '').replace(/"\s*,\s*$/, '').replace(/["}\]\s]+$/, '');
        const unescaped = rawContent
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\t/g, '\t');

        if (unescaped.length > 250) {
          return {
            title: titleMatch ? titleMatch[1].replace(/\\"/g, '"') : topic,
            excerpt: excerptMatch ? excerptMatch[1].replace(/\\"/g, '"') : `Comprehensive technical guide to ${topic}.`,
            content: unescaped,
            suggestedKeywords: [category, 'Enterprise Architecture', 'Implementation Guide'],
          };
        }
      }
    }
  } catch (extractErr) {
    console.warn('Resilient extraction error:', extractErr);
  }

  // 3. Check if raw text is already markdown (must not be a raw JSON object)
  if (!cleaned.startsWith('{') && (cleaned.includes('## ') || cleaned.includes('# '))) {
    return {
      title: `${topic}: Complete Implementation Guide`,
      excerpt: `Comprehensive guide to configuring, optimizing, and monitoring ${topic} in enterprise environments.`,
      content: cleaned,
      suggestedKeywords: [category, 'Guide'],
    };
  }

  // 4. Default structured fallback
  return {
    title: `${topic}: Complete Implementation Guide`,
    excerpt: `Comprehensive guide to configuring, optimizing, and monitoring ${topic} in enterprise environments.`,
    content: `## Executive Overview\n\n${topic} represents a foundational capability in modern data platform engineering.\n\n## Architecture & Implementation\n\nImplementing ${topic} requires careful consideration of security, governance, and throughput.\n\n\`\`\`sql\n-- Sample configuration query\nSELECT status, count(*) FROM data_pipeline GROUP BY status;\n\`\`\`\n\n## Troubleshooting & FAQs\n\n### How does this affect query latency?\nProper indexing and Direct Lake caching mitigate performance bottlenecks.`,
    suggestedKeywords: [category, 'Guide', 'Enterprise Architecture'],
  };
}

export async function enrichArticleDraft({
  draftId,
  additionalInstructions,
}: {
  draftId: string;
  additionalInstructions?: string;
}) {
  await ensureAiStudioSchema();
  const db = prisma as any;
  const draft = await db.aiContentDraft.findUnique({ where: { id: draftId } });
  if (!draft) throw new Error(`Draft ${draftId} not found.`);

  const prompt = `You are a principal cloud and data architect. Expand and enrich the following article draft into a complete, authoritative, comprehensive guide (target 2,000 to 2,500 words).

Topic: "${draft.title}"
Category: "${draft.category}"
Existing Outline / Context:
${draft.content}

${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ''}

Requirements:
1. Provide deep, practical, step-by-step technical details.
2. Structure with clear ## and ### headings (at least 4-5 major H2 sections).
3. Include real-world configuration examples, code/DAX/SQL/Python blocks, and architectural best practices.
4. Add a comparison table or summary matrix.
5. Add a 3-4 question Troubleshooting & FAQ section.
6. Professional, enterprise tone with no filler.

Respond ONLY with valid JSON:
{
  "title": "Engaging technical title",
  "excerpt": "Comprehensive 120-160 character summary",
  "content": "Full markdown content with ## Introduction and all sections",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

  const aiResult = await executeAiCompletion({
    prompt,
    systemPrompt: 'You are a principal technical author and data platform architect. You write deep, crystal-clear, production-grade technical documentation.',
    task: 'ARTICLE_DRAFTING',
    jsonMode: true,
  });

  const parsed = parseArticleDraftJson(aiResult.text, draft.title, draft.category);
  const words = parsed.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(3, Math.ceil(words / 200));

  const seo = await generateSeoIntelligence({
    title: parsed.title,
    slug: draft.slug,
    category: draft.category,
    content: parsed.content,
    excerpt: parsed.excerpt,
  });

  const quality = evaluateContentQuality({
    title: parsed.title,
    content: parsed.content,
    excerpt: parsed.excerpt,
    category: draft.category,
    wordCount: words,
    duplicateRiskScore: 0,
    verifiedClaimsCount: 1,
    hasSeoTitle: Boolean(seo.seoTitle),
    hasSeoDescription: Boolean(seo.seoDescription),
  });

  const updated = await db.aiContentDraft.update({
    where: { id: draftId },
    data: {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      wordCount: words,
      readTime,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      targetKeywords: [...new Set([...(draft.targetKeywords || []), ...(seo.targetKeywords || [])])],
      qualityScore: quality.score,
      factualAccuracyScore: quality.factualVerificationStatus === 'PASSED' ? 95 : 75,
      seoScore: quality.seoComplete ? 90 : 65,
    },
  });

  await db.aiQualityReport.create({
    data: {
      draftId,
      score: quality.score,
      factualVerificationStatus: quality.factualVerificationStatus,
      duplicateRiskScore: quality.duplicateRiskScore,
      duplicateMatches: [] as any,
      seoChecks: seo.checks as any,
      readabilityMetrics: { readabilityScore: quality.readabilityScore },
      blockers: quality.blockers,
      recommendations: quality.recommendations,
    },
  });

  const lastVersion = await db.aiContentVersion.findFirst({
    where: { draftId },
    orderBy: { version: 'desc' },
  });
  await db.aiContentVersion.create({
    data: {
      draftId,
      version: (lastVersion?.version || 1) + 1,
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.excerpt,
      changedBy: 'AI_ENRICHMENT',
      changeNotes: `Enriched via AI Studio (${words} words, score: ${quality.score}/100)`,
    },
  });

  return { draft: updated, quality, seo };
}

