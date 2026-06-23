import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId')?.trim();
    const email = searchParams.get('email')?.trim();

    if (!applicationId || !email) {
      return NextResponse.json({ message: "Application ID and Email are required." }, { status: 400 });
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        applicationId,
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
      include: {
        job: {
          select: {
            title: true,
            department: true
          }
        }
      }
    });

    if (!applicant) {
      return NextResponse.json({ message: "No application found matching the provided details." }, { status: 404 });
    }

    return NextResponse.json({
      applicationId: applicant.applicationId,
      fullName: applicant.fullName,
      position: applicant.job.title,
      department: applicant.job.department,
      status: applicant.status,
      appliedAt: applicant.createdAt.toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error("Tracking query failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
