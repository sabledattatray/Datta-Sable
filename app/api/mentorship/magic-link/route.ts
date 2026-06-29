import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, token, otp } = await req.json();

    // Verification Mode (if token or otp is provided in POST body)
    if (token || otp) {
      if (token) {
        const tokenRecord = await prisma.mentorshipToken.findUnique({
          where: { token }
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Magic link is invalid or has expired.' }, { status: 400 });
        }

        // Fetch request details
        const request = await prisma.mentorshipRequest.findUnique({
          where: { email: tokenRecord.email },
          include: {
            cohort: true,
            track: true,
            progress: { orderBy: { week: 'asc' } },
            projects: true,
            feedbackTimeline: { orderBy: { createdAt: 'desc' } }
          }
        });

        if (!request) {
          return NextResponse.json({ error: 'Application profile not found' }, { status: 404 });
        }

        // Clean token after successful use
        await prisma.mentorshipToken.delete({ where: { token } });

        return NextResponse.json({ success: true, request });
      }

      if (otp && email) {
        // Find by email and verify (in development fallback / demo verification)
        const tokenRecords = await prisma.mentorshipToken.findMany({
          where: { email }
        });

        // Check if any matching active token contains this OTP code (stored as token)
        const matched = tokenRecords.find(r => r.token === otp && r.expiresAt > new Date());
        if (!matched) {
          return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
        }

        const request = await prisma.mentorshipRequest.findUnique({
          where: { email },
          include: {
            cohort: true,
            track: true,
            progress: { orderBy: { week: 'asc' } },
            projects: true,
            feedbackTimeline: { orderBy: { createdAt: 'desc' } }
          }
        });

        await prisma.mentorshipToken.delete({ where: { id: matched.id } });

        return NextResponse.json({ success: true, request });
      }

      return NextResponse.json({ error: 'Missing token or OTP details' }, { status: 400 });
    }

    // Generation Mode
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    // Verify applicant exists
    const request = await prisma.mentorshipRequest.findUnique({
      where: { email }
    });

    if (!request) {
      return NextResponse.json({ error: 'No active mentorship application found for this email address. Please apply first!' }, { status: 404 });
    }

    // Generate token and OTP
    const generatedToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token record (we save the unique generatedToken)
    await prisma.mentorshipToken.create({
      data: {
        email,
        token: generatedToken,
        expiresAt
      }
    });

    // Save OTP code as another record
    await prisma.mentorshipToken.create({
      data: {
        email,
        token: generatedOtp,
        expiresAt
      }
    });

    // Log the Magic Link details to console for Datta Sable's local inspection
    const magicLinkUrl = `${req.nextUrl.origin}/mentorship?token=${generatedToken}`;
    console.log(`\n========================================`);
    console.log(`[SECURITY] Magic Link Auth Request:`);
    console.log(`Learner: ${request.fullName} (${email})`);
    console.log(`OTP Code: ${generatedOtp}`);
    console.log(`URL Link: ${magicLinkUrl}`);
    console.log(`========================================\n`);

    // In local development, return code & link directly for zero-friction testing
    const devPayload = process.env.NODE_ENV !== 'production' ? {
      devMode: true,
      otp: generatedOtp,
      magicLink: magicLinkUrl
    } : { devMode: false };

    return NextResponse.json({
      message: 'A verification link and OTP code have been sent. Check your terminal console logs.',
      ...devPayload
    });

  } catch (error) {
    console.error('API Magic Link error:', error);
    return NextResponse.json({ error: 'Failed to request verification' }, { status: 500 });
  }
}
