import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const cohorts = await prisma.cohort.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cohorts);
  } catch (error) {
    console.error('API Cohorts GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve cohorts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Cohort name is required' }, { status: 400 });
    }

    let cohort;
    if (id) {
      cohort = await prisma.cohort.update({
        where: { id },
        data: { name, status: status || 'ACTIVE' }
      });
    } else {
      cohort = await prisma.cohort.create({
        data: { name, status: status || 'ACTIVE' }
      });
    }

    return NextResponse.json({ message: 'Cohort saved successfully', cohort });
  } catch (error) {
    console.error('API Cohorts POST error:', error);
    return NextResponse.json({ error: 'Failed to save cohort' }, { status: 500 });
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
      return NextResponse.json({ error: 'Cohort ID is required' }, { status: 400 });
    }

    await prisma.cohort.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Cohort deleted successfully' });
  } catch (error) {
    console.error('API Cohorts DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete cohort' }, { status: 500 });
  }
}
