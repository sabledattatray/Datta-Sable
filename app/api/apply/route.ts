import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { rateLimit, logAudit } from '@/lib/security';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

const applySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  alternateMobile: z.string().optional().nullable().or(z.literal("")),
  whatsappNumber: z.string().optional().nullable().or(z.literal("")),
  dateOfBirth: z.string().optional().nullable().or(z.literal("")),
  gender: z.string().optional().nullable().or(z.literal("")),
  currentLocation: z.string().min(1, "Current location is required"),
  currentAddress: z.string().optional().nullable().or(z.literal("")),
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
  university: z.string().optional().nullable().or(z.literal("")),
  passingYear: z.string().optional().nullable().or(z.literal("")),
  cgpa: z.string().optional().nullable().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")).optional().nullable(),
  github: z.string().url("Invalid GitHub URL").or(z.literal("")).optional().nullable(),
  portfolio: z.string().url("Invalid Portfolio URL").or(z.literal("")).optional().nullable(),
  kaggle: z.string().url("Invalid Kaggle URL").or(z.literal("")).optional().nullable(),
  whyJoin: z.string().optional().nullable().or(z.literal("")),
  achievement: z.string().optional().nullable().or(z.literal("")),
  declarationChecked: z.boolean().refine(val => val === true, "You must check the declaration box"),

  // Collections Specific Fields
  is10thPass: z.boolean().optional().nullable(),
  hasCollectionExperience: z.boolean().optional().nullable(),
  hasTeamHandlingExperience: z.boolean().optional().nullable(),
  areaFamiliarity: z.string().optional().nullable(),
  hasTwoWheeler: z.boolean().optional().nullable(),
  hasDrivingLicense: z.boolean().optional().nullable(),
  isImmediateJoiner: z.boolean().optional().nullable(),
  candidateSource: z.string().optional().nullable(),

  // Base64 Uploads
  resumeBase64: z.string().min(1, "Resume file is required"),
  resumeName: z.string().min(1, "Resume file name is required"),
  aadhaarBase64: z.string().optional().nullable(),
  aadhaarName: z.string().optional().nullable(),
  photoBase64: z.string().optional().nullable(),
  photoName: z.string().optional().nullable(),
  portfolioBase64: z.string().optional().nullable(),
  portfolioFileName: z.string().optional().nullable(),
});

// Directory setup helper (using root storage folder)
const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Standard AI Match Score (for non-collections roles)
function calculateMatchScore(candidate: {
  skills: string[];
  totalExperience: string;
  highestQualification: string;
}, job: {
  skillsRequired: string;
  experience: string;
}): number {
  let score = 0;
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
    score += 20;
  }
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

// Collections Specific Match Score
function calculateCollectionsScore(candidate: {
  is10thPass: boolean;
  hasCollectionExperience: boolean;
  hasTeamHandlingExperience: boolean;
  isImmediateJoiner: boolean;
  areaFamiliarity: string;
  hasTwoWheeler: boolean;
  hasDrivingLicense: boolean;
}, jobTitle: string): number {
  let score = 0;
  const title = jobTitle.toLowerCase();

  if (title.includes('team leader')) {
    // Collection Experience: 30, Team Handling: 30, Immediate Joiner: 20, Local Area Familiarity: 10, Driving License: 10
    if (candidate.hasCollectionExperience) score += 30;
    if (candidate.hasTeamHandlingExperience) score += 30;
    if (candidate.isImmediateJoiner) score += 20;
    if (candidate.areaFamiliarity && candidate.areaFamiliarity.trim().length > 2) score += 10;
    if (candidate.hasDrivingLicense) score += 10;
  } else {
    // 10th Pass: 30, Collection Experience: 20, Immediate Joiner: 20, Local Area: 15, Driving License: 15
    if (candidate.is10thPass) score += 30;
    if (candidate.hasCollectionExperience) score += 20;
    if (candidate.isImmediateJoiner) score += 20;
    if (candidate.areaFamiliarity && candidate.areaFamiliarity.trim().length > 2) score += 15;
    if (candidate.hasDrivingLicense) score += 15;
  }
  return score;
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

    // Duplicate Detection Check (Email + Mobile)
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

    // Fetch Target Job
    const job = await prisma.job.findUnique({
      where: { id: validatedData.jobId }
    });

    if (!job) {
      return NextResponse.json({ message: "Selected job position was not found." }, { status: 404 });
    }

    const isCollectionsRole = job.department === 'Collections' || job.title.toLowerCase().includes('collection');

    // Secure Document Save: Store files inside root project folder 'storage/'
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    
    // 1. Save Resume
    const resumeBuffer = Buffer.from(validatedData.resumeBase64.split(',')[1] || validatedData.resumeBase64, 'base64');
    const resumeFileName = `${uniqueSuffix}-${validatedData.resumeName.replace(/\s+/g, '_')}`;
    const resumeRelativePath = `/uploads/resumes/${resumeFileName}`;
    const resumeFullPath = path.join(process.cwd(), 'storage', 'uploads', 'resumes', resumeFileName);
    ensureDirectoryExistence(resumeFullPath);
    fs.writeFileSync(resumeFullPath, resumeBuffer);

    // 2. Save Aadhaar (optional for backward compatibility)
    let aadhaarRelativePath: string | null = null;
    if (validatedData.aadhaarBase64 && validatedData.aadhaarName) {
      const aadhaarBuffer = Buffer.from(validatedData.aadhaarBase64.split(',')[1] || validatedData.aadhaarBase64, 'base64');
      const aadhaarFileName = `${uniqueSuffix}-${validatedData.aadhaarName.replace(/\s+/g, '_')}`;
      aadhaarRelativePath = `/uploads/aadhaar/${aadhaarFileName}`;
      const aadhaarFullPath = path.join(process.cwd(), 'storage', 'uploads', 'aadhaar', aadhaarFileName);
      ensureDirectoryExistence(aadhaarFullPath);
      fs.writeFileSync(aadhaarFullPath, aadhaarBuffer);
    }

    // 3. Save Photo (optional for backward compatibility)
    let photoRelativePath: string | null = null;
    if (validatedData.photoBase64 && validatedData.photoName) {
      const photoBuffer = Buffer.from(validatedData.photoBase64.split(',')[1] || validatedData.photoBase64, 'base64');
      const photoFileName = `${uniqueSuffix}-${validatedData.photoName.replace(/\s+/g, '_')}`;
      photoRelativePath = `/uploads/photos/${photoFileName}`;
      const photoFullPath = path.join(process.cwd(), 'storage', 'uploads', 'photos', photoFileName);
      ensureDirectoryExistence(photoFullPath);
      fs.writeFileSync(photoFullPath, photoBuffer);
    }

    // 4. Save Portfolio (if uploaded)
    let portfolioRelativePath: string | null = null;
    if (validatedData.portfolioBase64 && validatedData.portfolioFileName) {
      const portBuffer = Buffer.from(validatedData.portfolioBase64.split(',')[1] || validatedData.portfolioBase64, 'base64');
      const portFileName = `${uniqueSuffix}-${validatedData.portfolioFileName.replace(/\s+/g, '_')}`;
      portfolioRelativePath = `/uploads/portfolios/${portFileName}`;
      const portFullPath = path.join(process.cwd(), 'storage', 'uploads', 'portfolios', portFileName);
      ensureDirectoryExistence(portFullPath);
      fs.writeFileSync(portFullPath, portBuffer);
    }

    // Generate Application ID: DS-2026-XXXX format
    const applicantCount = await prisma.applicant.count();
    const applicationId = `DS-2026-${String(applicantCount + 1).padStart(4, '0')}`;

    // Scoring calculation
    let calculatedScore = 0;
    if (isCollectionsRole) {
      calculatedScore = calculateCollectionsScore({
        is10thPass: !!validatedData.is10thPass,
        hasCollectionExperience: !!validatedData.hasCollectionExperience,
        hasTeamHandlingExperience: !!validatedData.hasTeamHandlingExperience,
        isImmediateJoiner: !!validatedData.isImmediateJoiner,
        areaFamiliarity: validatedData.areaFamiliarity || '',
        hasTwoWheeler: !!validatedData.hasTwoWheeler,
        hasDrivingLicense: !!validatedData.hasDrivingLicense
      }, job.title);
    } else {
      calculatedScore = calculateMatchScore({
        skills: validatedData.skills,
        totalExperience: validatedData.totalExperience,
        highestQualification: validatedData.highestQualification
      }, job);
    }

    // Create database applicant record
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
        university: validatedData.university || '',
        passingYear: validatedData.passingYear || '',
        cgpa: validatedData.cgpa || '',
        linkedin: validatedData.linkedin || null,
        github: validatedData.github || null,
        portfolio: validatedData.portfolio || null,
        kaggle: validatedData.kaggle || null,
        whyJoin: validatedData.whyJoin || '',
        achievement: validatedData.achievement || '',
        resumeUrl: resumeRelativePath,
        portfolioFileUrl: portfolioRelativePath,
        status: "New",
        matchScore: calculatedScore,

        // New fields
        whatsappNumber: validatedData.whatsappNumber || null,
        dateOfBirth: validatedData.dateOfBirth || null,
        gender: validatedData.gender || null,
        currentAddress: validatedData.currentAddress || null,
        is10thPass: validatedData.is10thPass || false,
        hasCollectionExperience: validatedData.hasCollectionExperience || false,
        hasTeamHandlingExperience: validatedData.hasTeamHandlingExperience || false,
        areaFamiliarity: validatedData.areaFamiliarity || null,
        hasTwoWheeler: validatedData.hasTwoWheeler || false,
        hasDrivingLicense: validatedData.hasDrivingLicense || false,
        aadhaarUrl: aadhaarRelativePath,
        photoUrl: photoRelativePath,
        isImmediateJoiner: validatedData.isImmediateJoiner || false,
        recruitmentStatus: "Application Received",
        candidateSource: validatedData.candidateSource || null,
        applicationScore: calculatedScore,
      }
    });

    await logAudit({ 
      action: 'CAREER_APPLICATION_SUBMIT', 
      status: 'SUCCESS', 
      details: `Successful application ${applicationId} submitted by ${validatedData.email} for ${job.title} (Match Score: ${calculatedScore})`, 
      req 
    });

    // Auto WhatsApp Notification Trigger
    await sendWhatsAppNotification({
      to: validatedData.whatsappNumber || validatedData.mobile,
      applicationId,
      fullName: validatedData.fullName,
      position: job.title
    });

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId,
      matchScore: calculatedScore
    }, { status: 201 });

  } catch (error) {
    console.error("Submission failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
