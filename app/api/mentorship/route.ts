import { randomUUID } from 'node:crypto';
import { validateUpload, UploadValidationError } from '@/lib/upload-validation';
import { z } from 'zod';
import { rateLimit } from '@/lib/security';
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
  if (!rateLimit(`mentorship:apply:${req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'}`, 5)) return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429});
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string | null;
    const address = z.string().trim().email().max(254).safeParse(formData.get('email'));
    if (!address.success) return NextResponse.json({error:'Enter a valid email address.'},{status:400});
    const email = address.data.toLowerCase();
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
      const validated = await validateUpload(file, 'resume');
      const filename = `resume-${randomUUID()}.${validated.extension}`;
      if (process.env.VERCEL === '1' && !process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({error:'Resume storage is temporarily unavailable.'},{status:503});

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
    if (error instanceof UploadValidationError) return NextResponse.json({error:error.message},{status:400});
    console.error('API Mentorship POST error:', error);
    return NextResponse.json({ error: 'An error occurred during submission' }, { status: 500 });
  }
}
