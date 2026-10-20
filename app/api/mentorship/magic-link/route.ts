import { NextRequest, NextResponse } from 'next/server';
import { createHash, createHmac, randomBytes, randomInt } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/security';
import { emailConfiguration, sendEmail } from '@/lib/email-delivery';
import { escapeHtml } from '@/lib/campaigns/shared';

const inputSchema = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()).optional(),
  token: z.string().regex(/^ml_[a-f0-9]{48}$/).optional(),
  otp: z.string().regex(/^\d{6}$/).optional(),
}).refine(value => !(value.token && value.otp));
const includes = { cohort: true, track: true, progress: { orderBy: { week: 'asc' as const } }, projects: true, feedbackTimeline: { orderBy: { createdAt: 'desc' as const } } };
const digestLink = (token: string) => `ml2_${createHash('sha256').update(token).digest('hex')}`;
function digestOtp(email: string, otp: string) {
  const secret = process.env.MENTORSHIP_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('Verification signing is not configured.');
  return `otp2_${createHmac('sha256', secret).update(`${email}:${otp}`).digest('hex')}`;
}

export async function POST(req: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  const respond = (body: unknown, status = 200) => NextResponse.json(body, { status, headers });
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!rateLimit(`mentorship:ip:${ip}`, 30)) return respond({ error: 'Too many requests. Please wait before trying again.' }, 429);
    const raw = await req.text();
    if (raw.length > 4096) return respond({ error: 'Request is too large.' }, 413);
    const parsed = inputSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return respond({ error: 'Enter a valid email, verification link or six-digit code.' }, 400);
    const { email, token, otp } = parsed.data;

    if (token || otp) {
      if (otp && !email) return respond({ error: 'Email address is required for code verification.' }, 400);
      if (email && !rateLimit(`mentorship:verify:${email}`, 5)) return respond({ error: 'Too many verification attempts. Please wait before trying again.' }, 429);
      const lookup = token ? digestLink(token) : digestOtp(email!, otp!);
      const record = await prisma.mentorshipToken.findUnique({ where: { token: lookup } });
      if (!record || record.expiresAt <= new Date() || (email && record.email !== email)) return respond({ error: 'Verification is invalid or has expired. Request a new code.' }, 400);
      // Claim the single-use credential transactionally, so simultaneous requests cannot both succeed.
      const request = await prisma.$transaction(async tx => {
        const claimed = await tx.mentorshipToken.deleteMany({ where: { token: lookup, email: record.email, expiresAt: { gt: new Date() } } });
        if (claimed.count !== 1) return null;
        await tx.mentorshipToken.deleteMany({ where: { email: record.email } });
        return tx.mentorshipRequest.findUnique({ where: { email: record.email }, include: includes });
      });
      if (!request) return respond({ error: 'Verification is invalid or has expired. Request a new code.' }, 400);
      return respond({ success: true, request });
    }

    if (!email) return respond({ error: 'Email address is required.' }, 400);
    if (!emailConfiguration().configured) return respond({ error: 'Email verification is temporarily unavailable. Please contact support.' }, 503);
    if (!rateLimit(`mentorship:issue:${email}`, 2)) return respond({ error: 'Please wait before requesting another verification email.' }, 429);
    const message = 'If an application exists for this address, a verification email has been sent. Check your inbox and spam folder.';
    const application = await prisma.mentorshipRequest.findUnique({ where: { email } });
    if (!application) return respond({ message });
    const generatedToken = `ml_${randomBytes(24).toString('hex')}`;
    const generatedOtp = randomInt(100000, 1000000).toString();
    const savedTokens = [digestLink(generatedToken), digestOtp(email, generatedOtp)];
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.$transaction(async tx => {
      await tx.mentorshipToken.deleteMany({ where: { email } });
      await tx.mentorshipToken.createMany({ data: savedTokens.map(token => ({ email, token, expiresAt })) });
    });
    // Use the configured application origin, never a caller-supplied Host header.
    const origin = new URL(process.env.NEXTAUTH_URL || 'https://dattasable.com').origin;
    const link = `${origin}/mentorship?token=${encodeURIComponent(generatedToken)}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Your Datta Sable mentorship verification code',
        text: `Your verification code is ${generatedOtp}. It expires in 15 minutes.\n\nOr open: ${link}\n\nIf you did not request access, ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;background:#10151e;color:#e2e8f0;max-width:560px;padding:32px;border-radius:14px;margin:auto"><p style="color:#c9f31d;letter-spacing:2px;font-weight:bold">DATTA SABLE</p><h1 style="font-size:25px;color:#fff">Verify your mentorship access</h1><p>Hello ${escapeHtml(application.fullName)},</p><p>Enter this six-digit code to access your application:</p><p style="font-size:34px;letter-spacing:8px;font-weight:bold;color:#c9f31d">${generatedOtp}</p><p>This code and your verification link expire in 15 minutes and can be used once.</p><p><a href="${escapeHtml(link)}" style="display:inline-block;background:#c9f31d;color:#152000;padding:14px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Verify access</a></p><p style="font-size:12px;color:#a4b2c5">If you did not request access, ignore this email.</p></div>`,
      });
    } catch {
      await prisma.mentorshipToken.deleteMany({ where: { email, token: { in: savedTokens } } });
      return respond({ error: 'The verification email could not be sent. Please try again shortly.' }, 503);
    }
    return respond({ message });
  } catch (error) {
    if (error instanceof SyntaxError) return respond({ error: 'Invalid request.' }, 400);
    console.error('Mentorship verification could not be completed.');
    return respond({ error: 'Verification is temporarily unavailable. Please try again shortly.' }, 503);
  }
}
