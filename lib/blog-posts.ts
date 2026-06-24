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
  staticPosts.forEach((post) => {
    if (!isPlaceholderPost(post)) {
      postsBySlug.set(post.slug, post);
    }
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

  const staticPost = staticPosts.find((post) => post.slug === slug);
  if (staticPost && !isPlaceholderPost(staticPost)) {
    return staticPost;
  }
  return null;
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

  const filteredStaticSlugs = staticPosts
    .filter((post) => !isPlaceholderPost(post))
    .map((post) => post.slug);

  return Array.from(new Set([...filteredStaticSlugs, ...dbSlugs]));
}

export function filterPostsByCategory(posts: BlogPost[], categoryName: string, slug: string) {
  return posts.filter((post) => {
    const category = ((post as any).category || '').toLowerCase();
    const cleanCategorySlug = category.replace(/\s+/g, '-').replace(/&/g, 'and');
    return category === categoryName.toLowerCase() || 
           category.replace(/\s+/g, '-') === slug.toLowerCase() ||
           cleanCategorySlug === slug.toLowerCase();
  });
}
