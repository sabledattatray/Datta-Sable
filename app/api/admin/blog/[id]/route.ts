import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notifySubscribersOfNewPost } from '@/lib/mail';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Blog GET single error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Prevent overriding the ID in prisma updates
    const { id: _, createdAt: __, updatedAt: ___, ...updateData } = body;

    // Convert readTime to number if it is provided
    if (updateData.readTime !== undefined) {
      updateData.readTime = Number(updateData.readTime) || 3;
    }

    const prevPost = await prisma.post.findUnique({
      where: { id },
    });

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    if (post.published && (!prevPost || !prevPost.published)) {
      notifySubscribersOfNewPost(post.title, post.slug, post.excerpt || '', post.image).catch(err => {
        console.error('Failed to notify subscribers on post update publish:', err);
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Blog PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Blog DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
