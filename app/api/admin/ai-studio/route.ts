import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureAiStudioSchema } from '@/lib/ai/schema';
import { discoverTopicOpportunities } from '@/lib/ai/topic-discovery';
import { createResearchBrief } from '@/lib/ai/research-engine';
import { generateArticleDraft } from '@/lib/ai/article-writer';
import { approveAndPublishDraft, scheduleDraftForPublishing } from '@/lib/ai/publishing';
import { AI_SETTING_KEYS, DEFAULT_AI_SETTINGS } from '@/lib/ai/config';
import { logAiAudit } from '@/lib/ai/audit';

export const maxDuration = 120;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await ensureAiStudioSchema();

    const url = new URL(req.url);
    const tab = url.searchParams.get('tab') || 'overview';

    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    if (tab === 'topics') {
      const topics = await prisma.aiTopicOpportunity.findMany({
        orderBy: { opportunityScore: 'desc' },
        take: 50,
      });
      return NextResponse.json({ topics });
    }

    if (tab === 'drafts') {
      const drafts = await prisma.aiContentDraft.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          qualityReports: { take: 1, orderBy: { checkedAt: 'desc' } },
        },
        take: 50,
      });
      return NextResponse.json({ drafts });
    }

    if (tab === 'logs') {
      const [usage, audits] = await Promise.all([
        prisma.aiProviderUsage.findMany({ take: 30, orderBy: { createdAt: 'desc' } }),
        prisma.auditLog.findMany({
          where: { action: { startsWith: 'AI_' } },
          take: 30,
          orderBy: { createdAt: 'desc' },
        }),
      ]);
      return NextResponse.json({ usage, audits });
    }

    // Default: Complete Overview Dashboard Data
    const [
      topicsCount,
      draftsCount,
      publishedCount,
      schedulesCount,
      usageAgg,
      pauseSetting,
      budgetSetting,
      modeSetting,
      recentDrafts,
      recentTopics,
    ] = await Promise.all([
      prisma.aiTopicOpportunity.count(),
      prisma.aiContentDraft.count({ where: { status: 'DRAFT' } }),
      prisma.aiContentDraft.count({ where: { status: 'PUBLISHED' } }),
      prisma.aiPublishingSchedule.count({ where: { status: 'SCHEDULED' } }),
      prisma.aiProviderUsage.aggregate({
        where: { createdAt: { gte: startOfMonth }, success: true },
        _sum: { estimatedCostUsd: true, totalTokens: true },
      }),
      prisma.systemSetting.findUnique({ where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE } }),
      prisma.systemSetting.findUnique({ where: { key: AI_SETTING_KEYS.MONTHLY_BUDGET } }),
      prisma.systemSetting.findUnique({ where: { key: AI_SETTING_KEYS.MODE } }),
      prisma.aiContentDraft.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { qualityReports: { take: 1 } },
      }),
      prisma.aiTopicOpportunity.findMany({
        take: 5,
        orderBy: { opportunityScore: 'desc' },
      }),
    ]);

    return NextResponse.json({
      stats: {
        topicsCount,
        draftsCount,
        publishedCount,
        schedulesCount,
        currentMonthSpend: usageAgg._sum.estimatedCostUsd || 0,
        currentMonthTokens: usageAgg._sum.totalTokens || 0,
        monthlyBudget: budgetSetting ? Number(budgetSetting.value) || DEFAULT_AI_SETTINGS.monthlyBudgetUsd : DEFAULT_AI_SETTINGS.monthlyBudgetUsd,
        emergencyPaused: pauseSetting?.value === 'true',
        operatingMode: modeSetting?.value || 'ASSISTED',
      },
      recentDrafts,
      recentTopics,
    });
  } catch (error: any) {
    console.error('AI Studio GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch AI Studio data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await ensureAiStudioSchema();
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'discover-topics': {
        const topics = await discoverTopicOpportunities({
          category: payload?.category,
          limit: Number(payload?.limit) || 5,
        });
        return NextResponse.json({ success: true, topics });
      }

      case 'generate-brief': {
        const brief = await createResearchBrief({
          topic: payload.topic,
          category: payload.category,
          topicId: payload.topicId,
        });
        return NextResponse.json({ success: true, brief });
      }

      case 'generate-draft': {
        const result = await generateArticleDraft({
          topic: payload.topic,
          category: payload.category,
          briefId: payload.briefId,
          tier: payload.tier || 'COMPREHENSIVE',
          operatingMode: payload.operatingMode || 'ASSISTED',
        });
        return NextResponse.json({ success: true, ...result });
      }

      case 'publish-draft': {
        const post = await approveAndPublishDraft({
          draftId: payload.draftId,
          actorUserId: (session.user as any)?.id,
          publishImmediately: payload.publishImmediately ?? true,
        });
        return NextResponse.json({ success: true, post });
      }

      case 'schedule-draft': {
        const schedule = await scheduleDraftForPublishing({
          draftId: payload.draftId,
          scheduledTime: new Date(payload.scheduledTime),
          timezone: payload.timezone || 'Asia/Kolkata',
          actorUserId: (session.user as any)?.id,
        });
        return NextResponse.json({ success: true, schedule });
      }

      case 'update-settings': {
        if (payload.operatingMode) {
          await prisma.systemSetting.upsert({
            where: { key: AI_SETTING_KEYS.MODE },
            create: { key: AI_SETTING_KEYS.MODE, value: payload.operatingMode },
            update: { value: payload.operatingMode },
          });
        }
        if (payload.monthlyBudget !== undefined) {
          await prisma.systemSetting.upsert({
            where: { key: AI_SETTING_KEYS.MONTHLY_BUDGET },
            create: { key: AI_SETTING_KEYS.MONTHLY_BUDGET, value: String(payload.monthlyBudget) },
            update: { value: String(payload.monthlyBudget) },
          });
        }
        if (payload.emergencyPause !== undefined) {
          await prisma.systemSetting.upsert({
            where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
            create: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE, value: String(payload.emergencyPause) },
            update: { value: String(payload.emergencyPause) },
          });
        }

        await logAiAudit({
          action: 'AI_BUDGET_UPDATED',
          userId: (session.user as any)?.id,
          details: payload,
        });

        return NextResponse.json({ success: true, message: 'Settings saved successfully.' });
      }

      case 'toggle-emergency-pause': {
        const pauseValue = String(payload.paused);
        await prisma.systemSetting.upsert({
          where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
          create: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE, value: pauseValue },
          update: { value: pauseValue },
        });

        await logAiAudit({
          action: 'AI_EMERGENCY_PAUSE_TOGGLED',
          userId: (session.user as any)?.id,
          details: { paused: payload.paused },
        });

        return NextResponse.json({ success: true, emergencyPaused: payload.paused });
      }

      default:
        return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI Studio POST error:', error);
    return NextResponse.json({ error: error?.message || 'Action execution failed' }, { status: 500 });
  }
}
