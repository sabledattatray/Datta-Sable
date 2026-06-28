import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Failed to get page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, content, excerpt, published, focusedKeyword } = body;

    const existingPage = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Verify slug uniqueness if it is changing
    if (slug && slug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: { slug }
      });
      if (slugConflict) {
        return NextResponse.json({ error: 'A page with this URL slug already exists' }, { status: 400 });
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : existingPage.title,
        slug: slug !== undefined ? slug : existingPage.slug,
        content: content !== undefined ? content : existingPage.content,
        excerpt: excerpt !== undefined ? excerpt : existingPage.excerpt,
        published: published !== undefined ? published : existingPage.published,
        focusedKeyword: focusedKeyword !== undefined ? focusedKeyword : existingPage.focusedKeyword,
      }
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error('Failed to update page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await prisma.page.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
