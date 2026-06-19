import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, referrer } = body;
    
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || '127.0.0.1';
    
    // Hash IP for privacy compliance (GDPR)
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    // Try to save to database using model or raw SQL fallback
    try {
      if ((prisma as any).pageView) {
        await (prisma as any).pageView.create({
          data: {
            url,
            referrer,
            userAgent,
            ipHash,
          }
        });
      } else {
        // Fallback: Use raw SQL because the Prisma client is out of sync with the schema
        const id = 'pv_' + Math.random().toString(36).substring(2, 15);
        const refVal = referrer || null;
        await prisma.$executeRaw`INSERT INTO "PageView" (id, url, referrer, "userAgent", "ipHash", "createdAt") VALUES (${id}, ${url}, ${refVal}, ${userAgent}, ${ipHash}, NOW())`;
      }
    } catch (dbError) {
      console.warn('Tracking database write failed (silent fallback):', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Tracking endpoint exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
