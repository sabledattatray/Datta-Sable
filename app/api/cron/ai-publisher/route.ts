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

    // 2. Mode C (Autonomous Publishing) is permanently disabled per editorial quality policy.
    // All AI-assisted articles require human editorial review and approval before publication.
    const autonomousCount = 0;

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
