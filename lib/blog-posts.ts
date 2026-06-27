import { prisma } from '@/lib/prisma';
import { posts as staticPosts } from '@/app/blog/data';

type BlogPost = (typeof staticPosts)[number] | Record<string, any>;

function getPostTimestamp(post: BlogPost) {
  const date = (post as any).date || (post as any).createdAt || (post as any).updatedAt;
  const timestamp = new Date(date || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function serializeDbPost(dbPost: any) {
  if (!dbPost) return null;
  return {
    ...dbPost,
    createdAt: dbPost.createdAt instanceof Date ? dbPost.createdAt.toISOString() : dbPost.createdAt,
    updatedAt: dbPost.updatedAt instanceof Date ? dbPost.updatedAt.toISOString() : dbPost.updatedAt,
  };
}

function isPlaceholderPost(post: any) {
  if (!post) return true;
  const content = post.content || '';
  return content.includes('In the rapidly evolving world of digital infrastructure and technology');
}

export async function getPublishedBlogPosts() {
  let dbPosts: any[] = [];

  try {
    const rawDbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    dbPosts = rawDbPosts.map(serializeDbPost);
  } catch (error) {
    console.warn('Database unavailable for blog posts; using static posts only.', error);
  }

  const postsBySlug = new Map<string, BlogPost>();
  // Static posts in data.ts are always included — they are manually curated
  // and must never be filtered by the placeholder guard (which targets DB drafts only).
  staticPosts.forEach((post) => {
    postsBySlug.set(post.slug, post);
  });
  dbPosts.forEach((post) => {
    if (!isPlaceholderPost(post)) {
      postsBySlug.set(post.slug, post);
    }
  });

  return Array.from(postsBySlug.values()).sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

export async function getPublishedBlogPost(slug: string) {
  try {
    const dbPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (dbPost?.published && !isPlaceholderPost(dbPost)) {
      return serializeDbPost(dbPost);
    }
  } catch (error) {
    console.warn(`Database unavailable for blog post "${slug}"; checking static posts.`, error);
  }

  // Static posts are always returned — placeholder guard is DB-only.
  const staticPost = staticPosts.find((post) => post.slug === slug);
  return staticPost ?? null;
}

export async function getPublishedBlogSlugs() {
  let dbSlugs: string[] = [];

  try {
    const dbPosts = await prisma.post.findMany({
      select: { slug: true, content: true },
      where: { published: true },
    });
    dbSlugs = dbPosts
      .filter((post) => !isPlaceholderPost(post))
      .map((post) => post.slug);
  } catch (error) {
    console.warn('Database unavailable for blog slugs; using static slugs only.', error);
  }

  // All static slugs are valid — only DB posts need the placeholder filter.
  const filteredStaticSlugs = staticPosts.map((post) => post.slug);

  return Array.from(new Set([...filteredStaticSlugs, ...dbSlugs]));
}

export function filterPostsByCategory(posts: BlogPost[], categoryName: string, slug: string) {
  const targetSlug = slug.toLowerCase();
  
  return posts.filter((post) => {
    // 1. Exact match on category
    const category = ((post as any).category || '').toLowerCase();
    const cleanCategorySlug = category.replace(/\s+/g, '-').replace(/&/g, 'and');
    if (category === categoryName.toLowerCase() || 
        category.replace(/\s+/g, '-') === targetSlug ||
        cleanCategorySlug === targetSlug) {
      return true;
    }

    // 2. Keyword fallback matching for broader content clusters
    const title = ((post as any).title || '').toLowerCase();
    const excerpt = ((post as any).excerpt || '').toLowerCase();
    const tags = Array.isArray((post as any).tags) 
      ? (post as any).tags.map((t: string) => t.toLowerCase()) 
      : [];
    
    const matchesKeyword = (kw: string) => {
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Use boundaries with optional trailing 's' for short keywords
      const useBoundary = kw.length <= 4 || kw === 'power bi' || kw === 'next.js';
      const pattern = useBoundary ? `\\b${escapedKw}s?\\b` : escapedKw;
      const regex = new RegExp(pattern, 'i');

      return regex.test(title) || 
             regex.test(excerpt) || 
             tags.some((t: string) => regex.test(t)) ||
             regex.test(category);
    };

    if (targetSlug === 'microsoft-fabric') {
      return matchesKeyword('fabric') || matchesKeyword('onelake') || matchesKeyword('dp-600') || matchesKeyword('dp-700');
    }
    if (targetSlug === 'power-bi') {
      return matchesKeyword('power bi') || matchesKeyword('dax') || matchesKeyword('powerquery');
    }
    if (targetSlug === 'sql') {
      return matchesKeyword('sql') || matchesKeyword('database') || matchesKeyword('postgres') || matchesKeyword('mysql') || matchesKeyword('sqlite') || matchesKeyword('duckdb') || matchesKeyword('rdbms') || matchesKeyword('query tuning') || matchesKeyword('query optimization') || matchesKeyword('joins') || matchesKeyword('window functions') || matchesKeyword('deadlock') || matchesKeyword('columnstore') || matchesKeyword('snowflake') || matchesKeyword('nosql');
    }
    if (targetSlug === 'python') {
      return matchesKeyword('python') || matchesKeyword('pandas') || matchesKeyword('numpy') || matchesKeyword('data engineering') || matchesKeyword('etl');
    }
    if (targetSlug === 'nextjs') {
      return matchesKeyword('next.js') || matchesKeyword('react') || matchesKeyword('vercel') || matchesKeyword('tailwind') || matchesKeyword('typescript') || matchesKeyword('server components') || matchesKeyword('rsc') || matchesKeyword('frontend engineering') || matchesKeyword('web performance') || matchesKeyword('spa') || matchesKeyword('nextjs');
    }
    if (targetSlug === 'seo') {
      return matchesKeyword('seo') || matchesKeyword('search engine') || matchesKeyword('adsense') || matchesKeyword('marketing') || matchesKeyword('pagespeed');
    }
    if (targetSlug === 'ai-automation') {
      return matchesKeyword('ai') || matchesKeyword('automation') || matchesKeyword('n8n') || matchesKeyword('prompt') || matchesKeyword('llm') || matchesKeyword('agent');
    }

    return false;
  });
}
