import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('Failed to fetch pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, content, excerpt, published, focusedKeyword } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Verify slug uniqueness
    const existing = await prisma.page.findUnique({
      where: { slug }
    });
    if (existing) {
      return NextResponse.json({ error: 'A page with this URL slug already exists' }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || '',
        published: published !== undefined ? published : true,
        focusedKeyword: focusedKeyword || '',
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
