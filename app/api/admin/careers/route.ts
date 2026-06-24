import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logAudit } from '@/lib/security';

// Auth checker helper
async function checkAuth(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || process.env.NODE_ENV === 'development';
  return isAdmin;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAuth(req))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId') || undefined;
    const experience = searchParams.get('experience') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search')?.trim() || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (jobId && jobId !== 'all') {
      whereClause.jobId = jobId;
    }
    if (experience && experience !== 'all') {
      whereClause.totalExperience = experience;
    }
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
        { applicationId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const applicants = await prisma.applicant.findMany({
      where: whereClause,
      include: {
        job: {
          select: {
            title: true,
            department: true,
          }
        }
      },
      orderBy: [
        { matchScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(applicants, { status: 200 });

  } catch (error) {
    console.error("Admin fetch applications failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await checkAuth(req))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, recruitmentStatus, interviewDate, joiningDate, remarks } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing applicant ID." }, { status: 400 });
    }

    const updateData: any = {};
    if (status) {
      const allowedStatuses = ["New", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ message: "Invalid status value." }, { status: 400 });
      }
      updateData.status = status;
    }

    if (recruitmentStatus) {
      const allowedRecruitmentStatuses = [
        "Application Received",
        "Screening Pending",
        "Interview Scheduled",
        "Selected",
        "Document Verification",
        "Joined",
        "Rejected"
      ];
      if (!allowedRecruitmentStatuses.includes(recruitmentStatus)) {
        return NextResponse.json({ message: "Invalid recruitment workflow status value." }, { status: 400 });
      }
      updateData.recruitmentStatus = recruitmentStatus;
    }

    if (interviewDate !== undefined) updateData.interviewDate = interviewDate;
    if (joiningDate !== undefined) updateData.joiningDate = joiningDate;
    if (remarks !== undefined) updateData.remarks = remarks;

    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          select: { title: true }
        }
      }
    });

    await logAudit({
      action: 'CAREER_APPLICATION_STATUS_UPDATE',
      status: 'SUCCESS',
      details: `Application ${updatedApplicant.applicationId} status updated: ${JSON.stringify(updateData)}`,
      req
    });

    return NextResponse.json({
      message: "Application updated successfully",
      applicantId: updatedApplicant.applicationId,
      status: updatedApplicant.status,
      recruitmentStatus: updatedApplicant.recruitmentStatus
    }, { status: 200 });

  } catch (error) {
    console.error("Admin status update failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
