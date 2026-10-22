import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { submitUrlToGoogleIndexing, inspectUrlInGoogleSearchConsole } from '@/lib/ai/google-indexing';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, url, slug } = body;

    const targetUrl = url || (slug ? `https://dattasable.com/blog/${slug}` : null);
    if (!targetUrl) {
      return NextResponse.json({ error: 'url or slug is required' }, { status: 400 });
    }

    if (action === 'submit') {
      const result = await submitUrlToGoogleIndexing(targetUrl);
      return NextResponse.json(result);
    }

    if (action === 'inspect') {
      const result = await inspectUrlInGoogleSearchConsole(targetUrl);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action. Must be "submit" or "inspect"' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Google Indexing API error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
