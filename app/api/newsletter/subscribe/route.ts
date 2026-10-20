import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/security';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`newsletter:${req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'}`, 10)) return NextResponse.json({success:false,error:'Too many requests.'},{status:429});
    const input = z.object({email:z.string().trim().email().max(254).transform(value=>value.toLowerCase())}).safeParse(await req.json());
    if (!input.success) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const {email} = input.data;
    // Upsert or insert new subscriber
    await prisma.subscriber.upsert({
      where: { email },
      update: {}, // No updates if already subscribed
      create: { email }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error instanceof SyntaxError ? 'Invalid request.' : 'Subscription could not be saved. Please try again.' }, { status: error instanceof SyntaxError ? 400 : 503 });
  }
}
