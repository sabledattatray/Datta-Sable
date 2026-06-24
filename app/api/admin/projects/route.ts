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

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch admin projects:', error);
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
    const {
      title,
      category,
      description,
      desc,
      impact,
      tools,
      color,
      imageUrl,
      image,
      client,
      problem,
      solution,
      github,
      live,
      published,
      status,
    } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and Category are required' }, { status: 400 });
    }

    // Determine status / published mapping
    let isPublished = true;
    if (published !== undefined) {
      isPublished = !!published;
    } else if (status !== undefined) {
      isPublished = status === 'Published';
    }

    // Parse tools as string array if it's passed as a single string
    let parsedTools: string[] = [];
    if (Array.isArray(tools)) {
      parsedTools = tools;
    } else if (typeof tools === 'string') {
      parsedTools = tools.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const project = await prisma.project.create({
      data: {
        title,
        category,
        description: description || desc || '',
        impact: impact || '',
        tools: parsedTools,
        color: color || '#c9f31d',
        imageUrl: imageUrl || image || null,
        client: client || '',
        problem: problem || '',
        solution: solution || '',
        github: github || '',
        live: live || '',
        published: isPublished,
        views: 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create admin project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
