import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Remove from Subscriber table if present
    await prisma.$executeRaw`DELETE FROM "Subscriber" WHERE LOWER(email) = ${cleanEmail}`;

    return NextResponse.json({
      success: true,
      message: `You have been unsubscribed from dattasable.com dispatches.`,
    });
  } catch (error: any) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (email) {
    try {
      const cleanEmail = email.trim().toLowerCase();
      await prisma.$executeRaw`DELETE FROM "Subscriber" WHERE LOWER(email) = ${cleanEmail}`;
    } catch (e) {
      console.error('Unsubscribe GET error:', e);
    }
  }

  return NextResponse.redirect(new URL(`/unsubscribe?confirmed=true&email=${encodeURIComponent(email || '')}`, req.url));
}
