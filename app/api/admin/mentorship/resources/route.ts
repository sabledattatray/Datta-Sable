import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const resources = await prisma.mentorshipResource.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('API Resources GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve resources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, category, description, downloadUrl, featured } = body;

    if (!title || !category || !downloadUrl) {
      return NextResponse.json({ error: 'Title, category, and download URL are required' }, { status: 400 });
    }

    const targetId = id || title.replace(/\s+/g, '-').toLowerCase();

    const resource = await prisma.mentorshipResource.upsert({
      where: { id: targetId },
      update: {
        title,
        category,
        description: description || '',
        downloadUrl,
        featured: !!featured
      },
      create: {
        id: targetId,
        title,
        category,
        description: description || '',
        downloadUrl,
        featured: !!featured
      }
    });

    return NextResponse.json({ message: 'Resource saved successfully', resource });
  } catch (error) {
    console.error('API Resources POST error:', error);
    return NextResponse.json({ error: 'Failed to save resource' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    await prisma.mentorshipResource.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('API Resources DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
