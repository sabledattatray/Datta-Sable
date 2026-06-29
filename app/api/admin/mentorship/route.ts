import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const requests = await prisma.mentorshipRequest.findMany({
      include: {
        cohort: true,
        track: true,
        progress: { orderBy: { week: 'asc' } },
        projects: true,
        feedbackTimeline: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const cohorts = await prisma.cohort.findMany({ orderBy: { name: 'asc' } });
    const tracks = await prisma.careerTrack.findMany({ orderBy: { name: 'asc' } });

    return NextResponse.json({ requests, cohorts, tracks });
  } catch (error) {
    console.error('API Admin Mentorship GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve mentorship data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      cohortId,
      trackId,
      status,
      mentorNotes,
      feedbackContent,
      progressWeeks // Array of numbers representing completed weeks (e.g. [1, 2, 3])
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const existing = await prisma.mentorshipRequest.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Mentorship request not found' }, { status: 404 });
    }

    // Update progress weeks if provided
    if (progressWeeks && Array.isArray(progressWeeks)) {
      // Set all to completed = false
      await prisma.mentorshipProgress.updateMany({
        where: { mentorshipId: id },
        data: { completed: false }
      });
      
      // Set specified to completed = true
      if (progressWeeks.length > 0) {
        await prisma.mentorshipProgress.updateMany({
          where: {
            mentorshipId: id,
            week: { in: progressWeeks }
          },
          data: { completed: true, completedAt: new Date() }
        });
      }
    }

    // Create a feedback timeline item if feedbackContent is provided
    if (feedbackContent && feedbackContent.trim()) {
      await prisma.mentorshipFeedback.create({
        data: {
          mentorshipId: id,
          content: feedbackContent.trim()
        }
      });
    }

    // Update main request properties
    const updated = await prisma.mentorshipRequest.update({
      where: { id },
      data: {
        cohortId: cohortId !== undefined ? cohortId : existing.cohortId,
        trackId: trackId !== undefined ? trackId : existing.trackId,
        status: status !== undefined ? status : existing.status,
        mentorNotes: mentorNotes !== undefined ? mentorNotes : existing.mentorNotes,
      },
      include: {
        cohort: true,
        track: true,
        progress: { orderBy: { week: 'asc' } },
        projects: true,
        feedbackTimeline: { orderBy: { createdAt: 'desc' } }
      }
    });

    return NextResponse.json({ message: 'Request updated successfully', request: updated });

  } catch (error) {
    console.error('API Admin Mentorship PUT error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
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
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    await prisma.mentorshipRequest.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Mentorship request deleted successfully' });
  } catch (error) {
    console.error('API Admin Mentorship DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
