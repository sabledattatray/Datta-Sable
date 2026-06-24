import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { posts as staticBlogPosts } from '@/app/blog/data';
import { CHAINS } from '@/data/chains';
import { TEMPLATES } from '@/data/templates';
import { KNOWLEDGE_ARTICLES } from '@/data/knowledge';
import { LANDING_PAGES } from '@/data/landing-pages';
import { GLOSSARY_TERMS } from '@/data/glossary';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dattasable.com';
  const baselineDate = new Date('2026-05-18');

  // 1. Fetch DB blog posts (if any)
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, category: true, updatedAt: true }
  }).catch(() => []);

  const dbBlogUrls = dbPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 1b. Fetch DB custom pages (if any)
  const dbPages = await prisma.page.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  }).catch(() => []);

  const dbCustomPageUrls = dbPages.map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 2. Fetch Static blog posts from data.ts
  const staticBlogUrls = staticBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || baselineDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 2b. Extract unique categories dynamically from DB and Static posts
  const allPostsForCategories = [
    ...dbPosts.map(p => ({ category: p.category || 'General' })),
    ...staticBlogPosts
  ];
  const uniqueCategories = new Set<string>();
  allPostsForCategories.forEach(post => {
    const cat = post.category || 'General';
    uniqueCategories.add(cat.trim().toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'));
  });

  const categoryUrls = Array.from(uniqueCategories).map(catSlug => ({
    url: `${baseUrl}/category/${catSlug}`,
    lastModified: baselineDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Static main pages
  const staticUrls = [
    '',
    '/services',
    '/portfolio',
    '/blog',
    '/dashboards',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/cookies',
    '/faq',
    '/careers',
    '/careers/collection-officer-mumbai',
    '/careers/collection-team-leader-mumbai',
    '/start-here',
    '/analytics-live',
    '/data-forge',
    '/tools',
    '/tools/workspace',
    '/templates',
    '/chains',
    '/knowledge',
    '/knowledge/architecture',
    '/knowledge/data-engineering',
    '/glossary',
    '/tools/linkedin-formatter',
    '/tools/ai-prompt-generator',
    '/tools/seo-meta-generator',
    '/tools/image-blade',
    '/tools/context-optimizer',
    '/tools/word-counter',
    '/tools/schema-generator',
    '/tools/mermaid-forge',
    '/tools/bi-roi-calculator',
    '/tools/prompt-auditor',
    '/tools/demo',
    '/infrastructure',
    '/knowledge/taxonomy',
    '/knowledge/standards',
    '/knowledge/protocols',
    '/knowledge/patterns',
    '/knowledge/rfc',
    '/knowledge/rfc/001-prompt-hardening',
    '/knowledge/rfc/002-execution-chains',
    '/knowledge/rfc/003-intent-mapping',
    '/knowledge/comparisons',
    '/dashboards/global-sales-intelligence',
    '/dashboards/collection-intelligence',
    '/dashboards/revenue-intelligence',
    '/dashboards/interactive',
    '/dashboards/blinkit-sales',
    '/dashboards/sales-pipeline',
    '/dashboards/surgical-ai',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: baselineDate,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : route === '/tools' ? 0.9 : 0.7,
  }));

  // 4. Execution Chains
  const chainUrls = CHAINS.map((chain) => ({
    url: `${baseUrl}/chains/${chain.slug}`,
    lastModified: baselineDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 5. Template Packs
  const templateUrls = TEMPLATES.map((template) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: baselineDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 6. Knowledge Hub
  const knowledgeUrls = KNOWLEDGE_ARTICLES.map((article) => ({
    url: `${baseUrl}/knowledge/${article.slug}`,
    lastModified: baselineDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 7. Micro-Landing Pages
  const landingPageUrls = LANDING_PAGES.map((lp) => ({
    url: `${baseUrl}/lp/${lp.slug}`,
    lastModified: baselineDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 8. Glossary Terms
  const glossaryUrls = GLOSSARY_TERMS.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: baselineDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const allUrls = [
    ...staticUrls, 
    ...dbBlogUrls, 
    ...staticBlogUrls, 
    ...dbCustomPageUrls,
    ...categoryUrls,
    ...chainUrls, 
    ...templateUrls, 
    ...knowledgeUrls,
    ...landingPageUrls,
    ...glossaryUrls
  ];

  // De-duplicate by URL to prevent crawler warnings in Search Console
  const uniqueUrlsMap = new Map<string, typeof allUrls[0]>();
  for (const item of allUrls) {
    if (!uniqueUrlsMap.has(item.url)) {
      uniqueUrlsMap.set(item.url, item);
    } else {
      const existing = uniqueUrlsMap.get(item.url)!;
      // Prefer specific database modification dates over generic baselineDate instances
      const existingIsBaseline = existing.lastModified.getTime() === baselineDate.getTime();
      const itemIsBaseline = item.lastModified.getTime() === baselineDate.getTime();
      
      if (existingIsBaseline && !itemIsBaseline) {
        uniqueUrlsMap.set(item.url, item);
      }
    }
  }

  return Array.from(uniqueUrlsMap.values());
}
