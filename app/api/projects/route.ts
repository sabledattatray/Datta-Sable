import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    // Map database properties (imageUrl, description) back to the keys expected by the frontend (image, desc)
    const mapped = projects.map(p => ({
      id: isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      category: p.category,
      image: p.imageUrl || '/images/portfolio/surgical_forge.webp',
      color: p.color || 'var(--accent)',
      tools: p.tools,
      client: p.client || '',
      desc: p.description,
      problem: p.problem || '',
      solution: p.solution || '',
      impact: p.impact || '',
      github: p.github || '',
      live: p.live || '',
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch public projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
