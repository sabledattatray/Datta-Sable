import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { processDueSchedules, approveAndPublishDraft } from '@/lib/ai/publishing';
import { prisma } from '@/lib/prisma';
import { AI_SETTING_KEYS } from '@/lib/ai/config';
import { logAiAudit } from '@/lib/ai/audit';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  // Allow Vercel Cron or authorized bearer token
  if (!isAuthorized(req) && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Process due scheduled drafts
    const scheduleResult = await processDueSchedules();

    // 2. Check if Mode C (Autonomous Publishing) is active
    const modeSetting = await prisma.systemSetting.findUnique({
      where: { key: AI_SETTING_KEYS.MODE },
    });

    let autonomousCount = 0;
    if (modeSetting?.value === 'AUTONOMOUS') {
      // Check emergency pause
      const pauseSetting = await prisma.systemSetting.findUnique({
        where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
      });

      if (pauseSetting?.value !== 'true') {
        // Enforce max 2 autonomous publications per day
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const publishedToday = await prisma.aiContentDraft.count({
          where: {
            status: 'PUBLISHED',
            operatingMode: 'AUTONOMOUS',
            publishedAt: { gte: todayStart },
          },
        });

        if (publishedToday < 2) {
          // Find highest quality pending draft with score >= 80 and zero blockers
          const candidate = await prisma.aiContentDraft.findFirst({
            where: {
              status: 'DRAFT',
              operatingMode: 'AUTONOMOUS',
              qualityScore: { gte: 80 },
              qualityReports: {
                some: {
                  factualVerificationStatus: 'PASSED',
                  duplicateRiskScore: { lt: 30 },
                },
              },
            },
            orderBy: { qualityScore: 'desc' },
          });

          if (candidate) {
            await approveAndPublishDraft({
              draftId: candidate.id,
              publishImmediately: true,
            });
            autonomousCount++;

            await logAiAudit({
              action: 'AI_ARTICLE_PUBLISHED',
              details: {
                mode: 'AUTONOMOUS',
                draftId: candidate.id,
                slug: candidate.slug,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      publishedScheduledCount: scheduleResult.publishedCount,
      publishedAutonomousCount: autonomousCount,
      errors: scheduleResult.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Publisher Cron Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Publisher cron execution failure' },
      { status: 500 }
    );
  }
}
