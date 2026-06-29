import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    const tracks = await prisma.careerTrack.findMany({
      orderBy: { name: 'asc' }
    });
    const cohorts = await prisma.cohort.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ tracks, cohorts });
  } catch (error) {
    console.error('API Mentorship GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve metadata' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const linkedin = formData.get('linkedin') as string | null;
    const experience = formData.get('experience') as string | null;
    const targetRole = formData.get('targetRole') as string | null;
    const challenge = formData.get('challenge') as string | null;
    const trackId = formData.get('trackId') as string | null;
    const isComebackProgram = formData.get('isComebackProgram') === 'true';
    const file = formData.get('resume') as File | null;

    if (!fullName || !email || !linkedin || !experience || !targetRole || !challenge || !trackId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Verify email uniqueness
    const existing = await prisma.mentorshipRequest.findUnique({
      where: { email }
    });
    if (existing) {
      return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 400 });
    }

    // Find the track
    const track = await prisma.careerTrack.findUnique({
      where: { id: trackId }
    });
    if (!track) {
      return NextResponse.json({ error: 'Selected Career Track is invalid.' }, { status: 400 });
    }

    // Find active cohort
    const activeCohort = await prisma.cohort.findFirst({
      where: { status: 'ACTIVE' }
    });

    let resumeUrl = null;
    if (file) {
      // Validate PDF file size (Max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Resume PDF exceeds 5MB size limit.' }, { status: 400 });
      }
      
      const fileExt = path.extname(file.name) || '.pdf';
      const cleanName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `resume-${cleanName}-${Date.now()}${fileExt}`;

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(filename, file, { access: 'public' });
        resumeUrl = blob.url;
      } else {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        resumeUrl = `/uploads/resumes/${filename}`;
      }
    }

    // Save request
    const request = await prisma.mentorshipRequest.create({
      data: {
        fullName,
        email,
        linkedin,
        experience,
        targetRole,
        challenge,
        resumeUrl,
        trackId,
        cohortId: activeCohort?.id || null,
        isComebackProgram,
        status: 'Applied'
      }
    });

    // Initialize 9-week progress
    const modules = [
      'SQL Fundamentals',
      'Python Scripting',
      'PySpark & Spark SQL',
      'Azure Data Factory (ADF)',
      'Azure Databricks & Delta Lake',
      'Microsoft Fabric Orchestration',
      'GitHub Portfolio Setup',
      'ATS Resume Optimization',
      'Technical Mock Interview'
    ];

    for (let i = 0; i < modules.length; i++) {
      await prisma.mentorshipProgress.create({
        data: {
          mentorshipId: request.id,
          week: i + 1,
          moduleName: modules[i],
          completed: false
        }
      });
    }

    return NextResponse.json({
      message: 'Application submitted successfully!',
      requestId: request.id
    });

  } catch (error) {
    console.error('API Mentorship POST error:', error);
    return NextResponse.json({ error: 'An error occurred during submission' }, { status: 500 });
  }
}
