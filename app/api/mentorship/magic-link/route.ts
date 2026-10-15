import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, token, otp } = await req.json();
    const email = rawEmail ? rawEmail.toLowerCase().trim() : undefined;

    // Verification Mode (if token or otp is provided in POST body)
    if (token || otp) {
      if (token) {
        // Enforce that a 6-digit OTP cannot be passed as a token (AUD-06)
        if (typeof token !== 'string' || /^\d{1,8}$/.test(token.trim())) {
          return NextResponse.json({ error: 'Invalid token format.' }, { status: 400 });
        }

        const tokenRecord = await prisma.mentorshipToken.findUnique({
          where: { token: token.trim() }
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Magic link is invalid or has expired.' }, { status: 400 });
        }

        // Fetch learner request details
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

        // Invalidate all tokens for this email after successful verification
        await prisma.mentorshipToken.deleteMany({ where: { email: tokenRecord.email } });

        return NextResponse.json({ success: true, request });
      }

      if (otp) {
        if (!email) {
          return NextResponse.json({ error: 'Email address is required for OTP verification.' }, { status: 400 });
        }

        const cleanOtp = otp.toString().trim();
        const tokenRecords = await prisma.mentorshipToken.findMany({
          where: { email }
        });

        // Check if any matching active token contains this OTP code
        const matched = tokenRecords.find(
          r => (r.token === cleanOtp || r.token === `otp_${cleanOtp}`) && r.expiresAt > new Date()
        );

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

        // Invalidate all tokens for this email after successful verification

        await prisma.mentorshipToken.deleteMany({ where: { email } });

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

    // Cryptographically secure token & OTP generation (AUD-06)
    const generatedToken = `ml_${crypto.randomBytes(24).toString('hex')}`;
    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate any previous unused tokens for this email
    await prisma.mentorshipToken.deleteMany({ where: { email } });

    // Save magic link token
    await prisma.mentorshipToken.create({
      data: {
        email,
        token: generatedToken,
        expiresAt
      }
    });

    // Save OTP with explicit prefix to prevent cross-account/cross-purpose reuse
    await prisma.mentorshipToken.create({
      data: {
        email,
        token: `otp_${generatedOtp}`,
        expiresAt
      }
    });

    // Log the Magic Link details to console for local inspection
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

