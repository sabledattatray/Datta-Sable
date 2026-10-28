import { createHash } from 'node:crypto';
import { editorialRevisions } from '@/content/editorial/revisions';
const revisions = new Map(editorialRevisions.map(revision => [revision.slug, revision]));
type EditorialPost = { slug: string; content?: string | null; title?: string; updatedAt?: string | Date | null };
export function applyEditorialRevision<T extends EditorialPost>(post: T): T {
  const revision = revisions.get(post.slug);
  if (!revision || !post.content || !post.title || !revision.sourceTitles.includes(post.title)) return post;
  const hash = createHash('sha256').update(post.content).digest('hex');
  if (!revision.sourceHashes.includes(hash)) return post;
  const updated = new Date(post.updatedAt || 0);
  const revised = new Date(revision.reviewedAt);
  return { ...post, title: revision.title, excerpt: revision.excerpt, content: revision.content,
    image: (post as any).image ?? null, readTime: revision.readTime,
    category: 'Practical Guides',
    updatedAt: Number.isFinite(updated.getTime()) && updated > revised ? post.updatedAt : revision.reviewedAt };
}
