import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';

export interface DuplicateMatch {
  title: string;
  slug: string;
  similarity: number; // 0 to 100
  isPublished: boolean;
  type: 'POST' | 'DRAFT';
}

export interface DuplicateDetectionResult {
  hasDuplicateRisk: boolean;
  maxSimilarity: number;
  matches: DuplicateMatch[];
  recommendation: 'PROCEED' | 'REFRESH_EXISTING' | 'BLOCK_DUPLICATE';
  suggestedActionMessage?: string;
}

function tokenize(text: string): Set<string> {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'in', 'on', 'with', 'for', 'of', 'at', 'by', 'from', 'to', 'is', 'how', 'what', 'guide', 'tutorial']);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w))
  );
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return Math.round((intersection / union) * 100);
}

export async function detectDuplicateContent({
  title,
  slug,
  category,
}: {
  title: string;
  slug: string;
  category?: string;
}): Promise<DuplicateDetectionResult> {
  await ensureAiStudioSchema();

  const titleTokens = tokenize(title);

  const db = prisma as any;

  // Check existing published posts
  const existingPosts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, published: true },
  });

  // Check pending drafts
  const existingDrafts: Array<{ id: string; title: string; slug: string }> = await db.aiContentDraft.findMany({
    where: { status: { in: ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'SCHEDULED'] } },
    select: { id: true, title: true, slug: true },
  });

  const matches: DuplicateMatch[] = [];

  // Exact slug collision check
  const slugCollisionPost = existingPosts.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  if (slugCollisionPost) {
    matches.push({
      title: slugCollisionPost.title,
      slug: slugCollisionPost.slug,
      similarity: 100,
      isPublished: slugCollisionPost.published,
      type: 'POST',
    });
  }

  const slugCollisionDraft = existingDrafts.find(d => d.slug.toLowerCase() === slug.toLowerCase());
  if (slugCollisionDraft) {
    matches.push({
      title: slugCollisionDraft.title,
      slug: slugCollisionDraft.slug,
      similarity: 100,
      isPublished: false,
      type: 'DRAFT',
    });
  }

  // Token similarity on existing posts
  for (const post of existingPosts) {
    if (post.slug.toLowerCase() === slug.toLowerCase()) continue;
    const postTokens = tokenize(post.title);
    const sim = calculateJaccardSimilarity(titleTokens, postTokens);
    if (sim >= 35) {
      matches.push({
        title: post.title,
        slug: post.slug,
        similarity: sim,
        isPublished: post.published,
        type: 'POST',
      });
    }
  }

  // Token similarity on drafts
  for (const draft of existingDrafts) {
    if (draft.slug.toLowerCase() === slug.toLowerCase()) continue;
    const draftTokens = tokenize(draft.title);
    const sim = calculateJaccardSimilarity(titleTokens, draftTokens);
    if (sim >= 35) {
      matches.push({
        title: draft.title,
        slug: draft.slug,
        similarity: sim,
        isPublished: false,
        type: 'DRAFT',
      });
    }
  }

  matches.sort((a, b) => b.similarity - a.similarity);

  const maxSimilarity = matches.length > 0 ? matches[0].similarity : 0;

  if (maxSimilarity >= 80) {
    return {
      hasDuplicateRisk: true,
      maxSimilarity,
      matches,
      recommendation: 'BLOCK_DUPLICATE',
      suggestedActionMessage: `A very similar or identical article already exists ("${matches[0].title}"). Creation blocked to prevent keyword cannibalization. Consider updating the existing article.`,
    };
  }

  if (maxSimilarity >= 45) {
    return {
      hasDuplicateRisk: true,
      maxSimilarity,
      matches,
      recommendation: 'REFRESH_EXISTING',
      suggestedActionMessage: `High topic overlap detected with "${matches[0].title}" (${maxSimilarity}% similarity). Recommended: Refresh or expand existing article rather than publishing competing content.`,
    };
  }

  return {
    hasDuplicateRisk: false,
    maxSimilarity,
    matches,
    recommendation: 'PROCEED',
  };
}
