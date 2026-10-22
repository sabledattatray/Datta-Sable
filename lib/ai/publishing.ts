import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';
import { logAiAudit } from './audit';
import { AI_SETTING_KEYS, OPERATING_MODES } from './config';

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

  let post: any;

  if (existingPost) {
    // If updating an existing post
    post = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
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
        content: draft.content,
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
