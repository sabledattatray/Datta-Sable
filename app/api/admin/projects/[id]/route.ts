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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch admin project:', error);
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
    const existing = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

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
      views,
    } = body;

    // Handle status mapping
    let isPublished = existing.published;
    if (published !== undefined) {
      isPublished = !!published;
    } else if (status !== undefined) {
      isPublished = status === 'Published';
    }

    // Handle tools mapping
    let parsedTools = existing.tools;
    if (Array.isArray(tools)) {
      parsedTools = tools;
    } else if (typeof tools === 'string') {
      parsedTools = tools.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : existing.title,
        category: category !== undefined ? category : existing.category,
        description: description !== undefined ? description : (desc !== undefined ? desc : existing.description),
        impact: impact !== undefined ? impact : existing.impact,
        tools: parsedTools,
        color: color !== undefined ? color : existing.color,
        imageUrl: imageUrl !== undefined ? imageUrl : (image !== undefined ? image : existing.imageUrl),
        client: client !== undefined ? client : existing.client,
        problem: problem !== undefined ? problem : existing.problem,
        solution: solution !== undefined ? solution : existing.solution,
        github: github !== undefined ? github : existing.github,
        live: live !== undefined ? live : existing.live,
        published: isPublished,
        views: views !== undefined ? Number(views) : existing.views,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update admin project:', error);
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

    const existing = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete admin project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
