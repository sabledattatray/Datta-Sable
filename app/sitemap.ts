import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { posts as staticBlogPosts } from '@/app/blog/data';
import { CHAINS } from '@/data/chains';
import { TEMPLATES } from '@/data/templates';
import { KNOWLEDGE_ARTICLES } from '@/data/knowledge';
import { LANDING_PAGES } from '@/data/landing-pages';
import { GLOSSARY_TERMS } from '@/data/glossary';

function isPlaceholderPost(post: { content?: string }) {
  if (!post) return true;
  const content = post.content || '';
  return content.includes('In the rapidly evolving world of digital infrastructure and technology');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dattasable.com';
  const baselineDate = new Date('2026-06-25');

  // 1. Fetch DB blog posts (if any)
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, category: true, updatedAt: true, content: true }
  }).catch(() => []);

  const filteredDbPosts = dbPosts.filter(post => !isPlaceholderPost(post as any));

  const dbBlogUrls = filteredDbPosts.map((post) => ({
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
  const filteredStaticBlogPosts = staticBlogPosts.filter(post => !isPlaceholderPost(post));

  const staticBlogUrls = filteredStaticBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || baselineDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 2b. Extract unique categories dynamically from DB and Static posts
  const allPostsForCategories = [
    ...filteredDbPosts.map(p => ({ category: p.category || 'General' })),
    ...filteredStaticBlogPosts
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

  // 3. Static main pillar pages (High-value content pages only)
  const staticUrls = [
    '',
    '/blog',
    '/about',
    '/portfolio',
    '/services',
    '/contact',
    '/start-here',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: baselineDate,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
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
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const allUrls = [
    ...staticUrls,
    ...dbBlogUrls,
    ...staticBlogUrls,
    ...dbCustomPageUrls,
    ...categoryUrls,
    // chainUrls, templateUrls, knowledgeUrls, landingPageUrls, glossaryUrls excluded — utility/thin pages
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
