import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { rateLimit, logAudit } from '@/lib/security';

const applySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  alternateMobile: z.string().optional().nullable().or(z.literal("")),
  currentLocation: z.string().min(1, "Current location is required"),
  preferredLocation: z.string().optional().nullable().or(z.literal("")),
  currentCompany: z.string().optional().nullable().or(z.literal("")),
  currentDesignation: z.string().optional().nullable().or(z.literal("")),
  totalExperience: z.string().min(1, "Total experience is required"),
  relevantExperience: z.string().min(1, "Relevant experience is required"),
  currentSalary: z.string().optional().nullable().or(z.literal("")),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  noticePeriod: z.string().min(1, "Notice period is required"),
  availableFrom: z.string().optional().nullable().or(z.literal("")),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  highestQualification: z.string().min(1, "Highest qualification is required"),
  university: z.string().min(1, "University/College name is required"),
  passingYear: z.string().min(4, "Passing year is required"),
  cgpa: z.string().min(1, "CGPA/Percentage is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")).optional().nullable(),
  github: z.string().url("Invalid GitHub URL").or(z.literal("")).optional().nullable(),
  portfolio: z.string().url("Invalid Portfolio URL").or(z.literal("")).optional().nullable(),
  kaggle: z.string().url("Invalid Kaggle URL").or(z.literal("")).optional().nullable(),
  whyJoin: z.string().min(10, "Please explain why you want to join us (minimum 10 characters)"),
  achievement: z.string().min(10, "Please describe your achievement (minimum 10 characters)"),
  resumeBase64: z.string().min(1, "Resume file is required"),
  resumeName: z.string().min(1, "Resume file name is required"),
  portfolioBase64: z.string().optional().nullable(),
  portfolioFileName: z.string().optional().nullable(),
  declarationChecked: z.boolean().refine(val => val === true, "You must check the declaration box"),
});

// Directory setup helper
const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Calculate AI Candidate Match Score
function calculateMatchScore(candidate: {
  skills: string[];
  totalExperience: string;
  highestQualification: string;
}, job: {
  skillsRequired: string;
  experience: string;
}): number {
  let score = 0;

  // 1. Skills Match (up to 40 points)
  const jobSkills = job.skillsRequired.split(',').map(s => s.trim().toLowerCase());
  const candSkills = candidate.skills.map(s => s.trim().toLowerCase());
  if (jobSkills.length > 0) {
    let matches = 0;
    for (const skill of candSkills) {
      if (jobSkills.some(js => js.includes(skill) || skill.includes(js))) {
        matches++;
      }
    }
    const ratio = candSkills.length > 0 ? matches / jobSkills.length : 0;
    score += Math.min(40, Math.round(ratio * 40));
  }

  // 2. Experience Match (up to 30 points)
  // Job: "5+ Years", "2-4 Years", "4+ Years"
  // Candidate: "0-2 Years", "3-5 Years", "5+ Years"
  const jobExp = job.experience.toLowerCase();
  const candExp = candidate.totalExperience.toLowerCase();
  if (candExp.includes('5+') && (jobExp.includes('5+') || jobExp.includes('4+'))) {
    score += 30;
  } else if (candExp.includes('3-5') && jobExp.includes('2-4')) {
    score += 30;
  } else if (candExp.includes('3-5') && (jobExp.includes('5+') || jobExp.includes('4+'))) {
    score += 15;
  } else if (candExp.includes('0-2') && jobExp.includes('2-4')) {
    score += 15;
  } else if (candExp.includes('0-2') && (jobExp.includes('5+') || jobExp.includes('4+'))) {
    score += 5;
  } else {
    score += 20; // baseline
  }

  // 3. Education Match (up to 30 points)
  const qual = candidate.highestQualification.toLowerCase();
  if (qual.includes('master') || qual.includes('m.tech') || qual.includes('mca') || qual.includes('mba') || qual.includes('m.sc')) {
    score += 30;
  } else if (qual.includes('bachelor') || qual.includes('b.tech') || qual.includes('bca') || qual.includes('b.sc') || qual.includes('b.e')) {
    score += 25;
  } else {
    score += 15;
  }

  return Math.min(100, score);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate Limit: 3 submissions per IP per minute
    if (!rateLimit(ip, 3)) {
      await logAudit({ action: 'CAREER_APPLICATION_ABUSE', status: 'FAILURE', details: `Rate limit exceeded for IP: ${ip}`, req });
      return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = applySchema.parse(body);

    // 1. Duplicate Detection Check (Check Email + Mobile)
    const existingApplicant = await prisma.applicant.findFirst({
      where: {
        email: validatedData.email,
        mobile: validatedData.mobile,
      }
    });

    if (existingApplicant) {
      await logAudit({ 
        action: 'CAREER_APPLICATION_DUPLICATE', 
        status: 'FAILURE', 
        details: `Duplicate application blocked for email: ${validatedData.email}`, 
        req 
      });
      return NextResponse.json({ message: "You have already applied with this email and mobile number." }, { status: 409 });
    }

    // 2. Fetch the Target Job
    const job = await prisma.job.findUnique({
      where: { id: validatedData.jobId }
    });

    if (!job) {
      return NextResponse.json({ message: "Selected job position was not found." }, { status: 404 });
    }

    // 3. Save Resume file (Base64) to public/uploads/resumes
    const resumeBuffer = Buffer.from(validatedData.resumeBase64.split(',')[1] || validatedData.resumeBase64, 'base64');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const resumeFileName = `${uniqueSuffix}-${validatedData.resumeName.replace(/\s+/g, '_')}`;
    const resumeRelativePath = `/uploads/resumes/${resumeFileName}`;
    const resumeFullPath = path.join(process.cwd(), 'public', 'uploads', 'resumes', resumeFileName);

    ensureDirectoryExistence(resumeFullPath);
    fs.writeFileSync(resumeFullPath, resumeBuffer);

    // Save Portfolio file if uploaded
    let portfolioRelativePath: string | null = null;
    if (validatedData.portfolioBase64 && validatedData.portfolioFileName) {
      const portBuffer = Buffer.from(validatedData.portfolioBase64.split(',')[1] || validatedData.portfolioBase64, 'base64');
      const portFileName = `${uniqueSuffix}-${validatedData.portfolioFileName.replace(/\s+/g, '_')}`;
      portfolioRelativePath = `/uploads/portfolios/${portFileName}`;
      const portFullPath = path.join(process.cwd(), 'public', 'uploads', 'portfolios', portFileName);
      ensureDirectoryExistence(portFullPath);
      fs.writeFileSync(portFullPath, portBuffer);
    }

    // 4. Generate Auto-Incrementing Application ID: DS-2026-XXXX
    const applicantCount = await prisma.applicant.count();
    const applicationId = `DS-2026-${String(applicantCount + 1).padStart(4, '0')}`;

    // 5. Calculate AI Match Score
    const matchScore = calculateMatchScore({
      skills: validatedData.skills,
      totalExperience: validatedData.totalExperience,
      highestQualification: validatedData.highestQualification
    }, job);

    // 6. Create database applicant record
    const applicant = await prisma.applicant.create({
      data: {
        applicationId,
        jobId: validatedData.jobId,
        fullName: validatedData.fullName,
        email: validatedData.email,
        mobile: validatedData.mobile,
        alternateMobile: validatedData.alternateMobile || null,
        currentLocation: validatedData.currentLocation,
        preferredLocation: validatedData.preferredLocation || null,
        currentCompany: validatedData.currentCompany || null,
        currentDesignation: validatedData.currentDesignation || null,
        totalExperience: validatedData.totalExperience,
        relevantExperience: validatedData.relevantExperience,
        currentSalary: validatedData.currentSalary || null,
        expectedSalary: validatedData.expectedSalary,
        noticePeriod: validatedData.noticePeriod,
        availableFrom: validatedData.availableFrom || null,
        skills: validatedData.skills.join(', '),
        highestQualification: validatedData.highestQualification,
        university: validatedData.university,
        passingYear: validatedData.passingYear,
        cgpa: validatedData.cgpa,
        linkedin: validatedData.linkedin || null,
        github: validatedData.github || null,
        portfolio: validatedData.portfolio || null,
        kaggle: validatedData.kaggle || null,
        whyJoin: validatedData.whyJoin,
        achievement: validatedData.achievement,
        resumeUrl: resumeRelativePath,
        portfolioFileUrl: portfolioRelativePath,
        status: "New",
        matchScore
      }
    });

    await logAudit({ 
      action: 'CAREER_APPLICATION_SUBMIT', 
      status: 'SUCCESS', 
      details: `Successful application ${applicationId} submitted by ${validatedData.email} for ${job.title} (Match Score: ${matchScore})`, 
      req 
    });

    // Email Auto-responder simulation (log output in development, or use nodemailer if configured)
    console.log(`[EMAIL AUTOMATION] Sending email to ${validatedData.email}. Subject: Application Received. Body: Thank you for applying to Datta Sable Careers. Application ID: ${applicationId}`);
    console.log(`[EMAIL AUTOMATION] Sending admin notification to careers@dattasable.com. Candidate: ${validatedData.fullName}, Position: ${job.title}, Resume: ${resumeRelativePath}`);

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId,
      matchScore
    }, { status: 201 });

  } catch (error) {
    console.error("Submission failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
