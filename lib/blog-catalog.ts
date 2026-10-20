export type CatalogPost = { slug: string; content?: string | null; published?: boolean; date?: string | Date | null; createdAt?: string | Date | null; updatedAt?: string | Date | null; [key: string]: unknown };

export function isPlaceholderPost(post: Pick<CatalogPost, 'content'> | null | undefined) {
  return !post?.content?.trim() || post.content.includes('In the rapidly evolving world of digital infrastructure and technology');
}

export function mergePublishedPosts<T extends CatalogPost>(staticPosts: T[], databasePosts: CatalogPost[]): (T | CatalogPost)[] {
  const posts = new Map<string, T | CatalogPost>();
  for (const post of staticPosts) if (post.published !== false && !isPlaceholderPost(post)) posts.set(post.slug, post);
  // Every database record is authoritative, including draft and placeholder records.
  for (const post of databasePosts) {
    if (post.published && !isPlaceholderPost(post)) posts.set(post.slug, post);
    else posts.delete(post.slug);
  }
  const timestamp = (post: CatalogPost) => {
    const value = new Date(post.date || post.createdAt || post.updatedAt || 0).getTime();
    return Number.isFinite(value) ? value : 0;
  };
  return [...posts.values()].sort((a, b) => timestamp(b) - timestamp(a));
}
