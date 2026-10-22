import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailConfiguration } from '@/lib/email-delivery';
import { logAudit } from '@/lib/security';

export const RESET_MESSAGE = 'If this email belongs to an administrator, a six-digit code will be sent. Check your inbox and spam folder. Wait 60 seconds before requesting another code.';
const INVALID_CODE = 'The code is invalid, expired, or has reached its attempt limit. Request a new code.';
const TEN_MINUTES = 10 * 60 * 1000;

function hashCode(email: string, nonce: string, code: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('Password recovery requires NEXTAUTH_SECRET.');
  return createHmac('sha256', secret).update(`${email}\n${nonce}\n${code}`).digest('hex');
}

export async function requestAdminPasswordReset(email: string) {
  if (!emailConfiguration().configured || !process.env.NEXTAUTH_SECRET) {
    throw new Error('Password recovery email is unavailable.');
  }
  const now = new Date();
  const code = String(randomInt(100000, 1000000));
  const nonce = randomUUID();
  const codeHash = hashCode(email, nonce, code);
  const challenge = await prisma.$transaction(async tx => {
    const user = await tx.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' }, role: 'ADMIN' } });
    if (!user?.email) return null;
    const previous = await tx.adminPasswordReset.findUnique({ where: { userId: user.id } });
    const sameWindow = previous && now.getTime() - previous.requestWindowStartedAt.getTime() < 60 * 60 * 1000;
    if (previous && (now.getTime() - previous.requestedAt.getTime() < 60000 || (sameWindow && previous.requestCount >= 5))) return null;
    const data = {
      codeHash, nonce, attempts: 0, expiresAt: new Date(now.getTime() + TEN_MINUTES), requestedAt: now,
      requestWindowStartedAt: sameWindow ? previous.requestWindowStartedAt : now,
      requestCount: sameWindow ? previous.requestCount + 1 : 1,
    };
    await tx.adminPasswordReset.upsert({ where: { userId: user.id }, create: { userId: user.id, ...data }, update: data });
    return { userId: user.id, email: user.email };
  }, { isolationLevel: 'Serializable' });
  if (!challenge) return;
  try {
    await sendEmail({
      to: challenge.email,
      subject: 'Your admin password reset code — Datta Sable',
      text: `Your admin password reset code is ${code}. It expires in 10 minutes and can be used once. If you did not request this, ignore this email. Never share this code.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#101110;color:#f4f4f4;border-radius:16px"><p style="color:#c9f31d;font-size:11px;letter-spacing:2px">DATTA SABLE · ADMIN ACCESS</p><h1 style="font-size:26px">Reset your password</h1><p style="color:#bbb;line-height:1.8">Enter this code on the admin password recovery page.</p><p style="font-size:36px;letter-spacing:10px;color:#c9f31d;padding:20px 0">${code}</p><p style="color:#bbb;line-height:1.8">Expires in 10 minutes. This code works once. Never share it.</p><p style="color:#999;font-size:12px">If you did not request a reset, ignore this email.</p></div>`,
    }, nonce, { namespace: 'admin-reset' });
  } catch {
    // Preserve the durable resend limits, but invalidate an undelivered challenge.
    await prisma.adminPasswordReset.updateMany({ where: { userId: challenge.userId, nonce }, data: { expiresAt: new Date(0) } });
    console.error('Admin password recovery email could not be delivered. Check email provider logs.');
    // Keep the same public response for existing and unknown addresses.
  }
}

export async function resetAdminPassword(email: string, code: string, newPassword: string) {
  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' }, role: 'ADMIN' } });
  if (!user) return { error: INVALID_CODE };
  const reset = await prisma.adminPasswordReset.findUnique({ where: { userId: user.id } });
  if (!reset || reset.expiresAt <= new Date() || reset.attempts >= 5) return { error: INVALID_CODE };
  const expected = Buffer.from(reset.codeHash, 'hex');
  const actual = Buffer.from(hashCode(email, reset.nonce, code), 'hex');
  const valid = expected.length === actual.length && timingSafeEqual(expected, actual);
  // Compare-and-swap the attempt count: concurrent submissions cannot reuse a snapshot.
  const result = await prisma.$transaction(async tx => {
    const claimed = await tx.adminPasswordReset.updateMany({
      where: { userId: user.id, nonce: reset.nonce, attempts: reset.attempts, expiresAt: { gt: new Date() } },
      data: { attempts: { increment: 1 } },
    });
    if (claimed.count !== 1 || !valid) return { error: INVALID_CODE };
    const password = await bcrypt.hash(newPassword, 12);
    const changed = await tx.user.updateMany({
      where: { id: user.id, role: 'ADMIN' },
      data: { password, emailVerified: new Date(), sessionVersion: { increment: 1 } },
    });
    if (changed.count !== 1) throw new Error('Administrator access changed.');
    // Retain request counters and consume the challenge atomically with the password change.
    await tx.adminPasswordReset.update({ where: { userId: user.id }, data: { attempts: 5, expiresAt: new Date(0) } });
    return { success: 'Password reset. Sign in with your new password.' };
  });
  if ('success' in result) await logAudit({ userId: user.id, action: 'RESET_ADMIN_PASSWORD', status: 'SUCCESS', details: 'Password reset with email OTP. Existing sessions revoked.' });
  return result;
}
