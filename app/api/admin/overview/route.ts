import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminOverview } from '@/lib/admin/overview';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  }
  try {
    return NextResponse.json(await getAdminOverview(), { headers });
  } catch {
    return NextResponse.json({ error: 'The workspace metrics could not be loaded.' }, { status: 503, headers });
  }
}
