import { revalidatePath } from 'next/cache';
import { marked } from 'marked';
import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';
import { logAiAudit } from './audit';
import { AI_SETTING_KEYS, OPERATING_MODES } from './config';
import { submitUrlToGoogleIndexing } from './google-indexing';

export function injectInternalLinks(
  content: string,
  links: Array<{ text: string; targetSlug: string }>
): string {
  if (!links || !links.length) return content;
  let result = content;

  for (const link of links) {
    if (!link.text || !link.targetSlug) continue;
    const escaped = link.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = result.split(/(```[\s\S]*?```|`[^`]+`|<a\b[^>]*>[\s\S]*?<\/a>|\[[^\]]+\]\([^\)]+\))/gi);
    let replaced = false;

    for (let i = 0; i < parts.length; i++) {
      if (replaced) break;
      const part = parts[i];
      if (
        part.startsWith('```') ||
        part.startsWith('`') ||
        part.startsWith('<a') ||
        part.startsWith('[')
      ) {
        continue;
      }

      const lines = part.split('\n');
      for (let l = 0; l < lines.length; l++) {
        if (lines[l].trim().startsWith('#')) continue;
        const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
        if (regex.test(lines[l])) {
          lines[l] = lines[l].replace(regex, (match) => `<a href="/blog/${link.targetSlug}">${match}</a>`);
          replaced = true;
          break;
        }
      }
      if (replaced) {
        parts[i] = lines.join('\n');
      }
    }
    result = parts.join('');
  }

  return result;
}

export function formatArticleContent(
  rawContent: string,
  internalLinks?: Array<{ text: string; targetSlug: string }>
): string {
  let processed = rawContent || '';

  // If content is wrapped in JSON, extract inner markdown
  if (processed.trim().startsWith('{') && processed.includes('"content":')) {
    try {
      const parsed = JSON.parse(processed);
      if (parsed.content) processed = parsed.content;
    } catch {
      const contentIdx = processed.indexOf('"content":');
      const quoteStart = processed.indexOf('"', contentIdx + 10);
      if (quoteStart !== -1) {
        let extracted = processed.slice(quoteStart + 1);
        extracted = extracted.replace(/"\s*,?\s*"suggestedKeywords"[\s\S]*$/, '');
        extracted = extracted.replace(/["}\]\s]+$/, '');
        processed = extracted
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\t/g, '\t');
      }
    }
  }

  // 1. Parse Markdown to HTML if needed (only if not already HTML)
  const hasHtml = /<(?:p|h[1-6]|div|section|article|pre|ul|ol|blockquote)\b/i.test(processed);
  const isMarkdown = !hasHtml && (/^#{1,6}\s/m.test(processed) || processed.includes('##'));

  if (isMarkdown) {
    processed = marked.parse(processed, { gfm: true, breaks: false }) as string;
    processed = processed.replace(/<p>\s*(\[\[diagram:[a-zA-Z0-9-_]+\]\])\s*<\/p>/g, '$1');
  }

  // 2. Inject internal links into the clean HTML
  if (internalLinks && Array.isArray(internalLinks) && internalLinks.length > 0) {
    processed = injectInternalLinks(processed, internalLinks);
  }

  // 3. Convert any remaining unrendered markdown links [text](url) into proper HTML anchors
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return processed;
}

export async function approveAndPublishDraft({
  draftId,
  actorUserId,
  publishImmediately = true,
}: {
  draftId: string;
  actorUserId?: string;
  publishImmediately?: boolean;
}) {
  await ensureAiStudioSchema();
  const db = prisma as any;

  const draft = await db.aiContentDraft.findUnique({
    where: { id: draftId },
  });

  if (!draft) {
    throw new Error(`Draft with ID ${draftId} not found.`);
  }

  // Idempotency: If already published and promoted post exists, ensure it is active
  if (draft.status === 'PUBLISHED' && draft.promotedPostId) {
    const existingPromoted = await prisma.post.findUnique({
      where: { id: draft.promotedPostId },
    });
    if (existingPromoted && existingPromoted.published === publishImmediately) {
      // Re-trigger cache revalidation to ensure fresh state
      if (publishImmediately) {
        for (const path of ['/', '/blog', `/blog/${existingPromoted.slug}`, '/sitemap.xml', '/rss.xml']) {
          try { revalidatePath(path); } catch {}
        }
      }
      return existingPromoted;
    }
  }

  // Ensure unique slug in Post table
  const finalSlug = draft.slug;
  const existingPost = await prisma.post.findUnique({
    where: { slug: finalSlug },
  });

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Prepare clean semantic HTML with injected internal links
  const finalContent = formatArticleContent(draft.content, draft.internalLinks as any);

  let post: any;

  if (existingPost) {
    // If updating an existing post
    post = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: draft.title,
        excerpt: draft.excerpt,
        content: finalContent,
        category: draft.category,
        readTime: Number(draft.readTime) || 5,
        image: draft.featuredImage || existingPost.image,
        published: publishImmediately,
      },
    });
  } else {
    // Creating brand new post
    post = await prisma.post.create({
      data: {
        title: draft.title,
        slug: finalSlug,
        excerpt: draft.excerpt,
        content: finalContent,
        category: draft.category,
        readTime: Number(draft.readTime) || 5,
        image: draft.featuredImage || null,
        published: publishImmediately,
        date: formattedDate,
      },
    });
  }

  // Update AiContentDraft status
  await db.aiContentDraft.update({
    where: { id: draftId },
    data: {
      status: publishImmediately ? 'PUBLISHED' : 'APPROVED',
      publishedAt: publishImmediately ? (draft.publishedAt || new Date()) : null,
      promotedPostId: post.id,
    },
  });

  // Revalidate public routes
  if (publishImmediately) {
    for (const path of ['/', '/blog', `/blog/${post.slug}`, '/sitemap.xml', '/rss.xml']) {
      try {
        revalidatePath(path);
      } catch (err) {
        console.warn(`Revalidate path warning for ${path}:`, err);
      }
    }

    // Automatically notify Google Indexing API for rapid crawl and indexation
    try {
      submitUrlToGoogleIndexing(`https://dattasable.com/blog/${post.slug}`).catch((err) => {
        console.warn('Google Indexing API notice:', err);
      });
    } catch {}
  }

  await logAiAudit({
    action: publishImmediately ? 'AI_ARTICLE_PUBLISHED' : 'AI_ARTICLE_APPROVED',
    userId: actorUserId,
    details: {
      draftId,
      postId: post.id,
      slug: post.slug,
      publishImmediately,
    },
  });

  return post;
}

export async function scheduleDraftForPublishing({
  draftId,
  scheduledTime,
  timezone = 'Asia/Kolkata',
  actorUserId,
}: {
  draftId: string;
  scheduledTime: Date;
  timezone?: string;
  actorUserId?: string;
}) {
  await ensureAiStudioSchema();
  const db = prisma as any;

  const draft = await db.aiContentDraft.findUnique({
    where: { id: draftId },
  });

  if (!draft) {
    throw new Error(`Draft with ID ${draftId} not found.`);
  }

  const schedule = await db.aiPublishingSchedule.upsert({
    where: { draftId },
    create: {
      draftId,
      scheduledTime,
      timezone,
      status: 'SCHEDULED',
      mode: draft.operatingMode,
    },
    update: {
      scheduledTime,
      timezone,
      status: 'SCHEDULED',
      mode: draft.operatingMode,
      attempts: 0,
      lastError: null,
    },
  });

  await db.aiContentDraft.update({
    where: { id: draftId },
    data: {
      status: 'SCHEDULED',
      scheduledFor: scheduledTime,
    },
  });

  await logAiAudit({
    action: 'AI_ARTICLE_SCHEDULED',
    userId: actorUserId,
    details: {
      draftId,
      scheduledTime: scheduledTime.toISOString(),
      timezone,
    },
  });

  return schedule;
}

export async function processDueSchedules(): Promise<{ publishedCount: number; errors: string[] }> {
  await ensureAiStudioSchema();
  const db = prisma as any;

  // 1. Check emergency pause setting
  const pauseSetting = await prisma.systemSetting.findUnique({
    where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
  });
  if (pauseSetting?.value === 'true') {
    return { publishedCount: 0, errors: ['Emergency pause active. Skipping publishing queue.'] };
  }

  // 2. Check active system operating mode (Requirement 8: Keep Mode C disabled by default)
  const modeSetting = await prisma.systemSetting.findUnique({
    where: { key: AI_SETTING_KEYS.MODE },
  });
  const currentSystemMode = modeSetting?.value || OPERATING_MODES.ASSISTED;

  // 3. Stale PROCESSING lock recovery: recover items stuck in PROCESSING > 10 minutes
  const now = new Date();
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  try {
    await db.aiPublishingSchedule.updateMany({
      where: {
        status: 'PROCESSING',
        updatedAt: { lte: tenMinutesAgo },
        attempts: { lt: 3 },
      },
      data: {
        status: 'SCHEDULED',
        lastError: 'Recovered from timed-out lock',
      },
    });

    await db.aiPublishingSchedule.updateMany({
      where: {
        status: 'PROCESSING',
        updatedAt: { lte: tenMinutesAgo },
        attempts: { gte: 3 },
      },
      data: {
        status: 'FAILED',
        lastError: 'Exceeded maximum publishing retry attempts (3)',
      },
    });
  } catch (recoverErr) {
    console.warn('Stale lock recovery warning:', recoverErr);
  }

  // 4. Query due schedules
  const dueSchedules = await db.aiPublishingSchedule.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledTime: { lte: now },
    },
    take: 5,
  });

  let publishedCount = 0;
  const errors: string[] = [];

  for (const item of dueSchedules) {
    // Mode C autonomous publishing safeguard:
    // If an item is marked AUTONOMOUS, it CANNOT be published unless the system setting is explicitly AUTONOMOUS
    if (item.mode === 'AUTONOMOUS' && currentSystemMode !== 'AUTONOMOUS') {
      const msg = `Skipped draft ${item.draftId}: Autonomous Mode C is disabled in system settings. Administrator review required.`;
      errors.push(msg);
      await db.aiPublishingSchedule.update({
        where: { id: item.id },
        data: {
          status: 'PENDING_APPROVAL',
          lastError: 'Autonomous Mode C disabled in system settings. Admin approval required.',
        },
      }).catch(() => {});
      continue;
    }

    try {
      // Atomic locking: conditional update ensures only one concurrent worker claims the item
      const claimResult = await db.aiPublishingSchedule.updateMany({
        where: {
          id: item.id,
          status: 'SCHEDULED',
        },
        data: {
          status: 'PROCESSING',
          attempts: { increment: 1 },
        },
      });

      if (claimResult.count === 0) {
        // Another concurrent worker acquired this job
        continue;
      }

      const post = await approveAndPublishDraft({
        draftId: item.draftId,
        publishImmediately: true,
      });

      await db.aiPublishingSchedule.update({
        where: { id: item.id },
        data: {
          status: 'PUBLISHED',
          publishedPostSlug: post.slug,
          lastError: null,
        },
      });

      publishedCount++;
    } catch (err: any) {
      const msg = err?.message || 'Unknown publishing failure';
      errors.push(`Failed draft ${item.draftId}: ${msg}`);
      await db.aiPublishingSchedule.update({
        where: { id: item.id },
        data: {
          status: item.attempts >= 2 ? 'FAILED' : 'SCHEDULED', // retry once or fail
          lastError: msg,
        },
      }).catch(() => {});
    }
  }

  return { publishedCount, errors };
}
