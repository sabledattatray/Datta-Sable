import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CommerceError } from '@/lib/commerce/shared';
import { newToken, tokenHash } from './tokens';

export const guestCookie = 'ds-ebook-session';
export async function buyer() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (id) {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, emailVerified: true } });
    if (user?.email && user.emailVerified) return { id: user.id, email: user.email.toLowerCase(), name: user.name };
  }
  const raw = (await cookies()).get(guestCookie)?.value;
  if (raw && /^[a-f0-9]{64}$/.test(raw)) {
    const token = await prisma.ebookAccessToken.findFirst({ where: { hash: tokenHash(raw), kind: 'SESSION', consumedAt: null, expiresAt: { gt: new Date() } } });
    if (token) return { id: null, email: token.email, name: 'Reader' };
  }
  throw new CommerceError('Sign in or verify your email to access your library.', 401);
}
export function buyerWhere(user: { id: string | null; email: string }) {
  return user.id ? { OR: [{ userId: user.id }, { userId: null, customerEmail: user.email }] } : { userId: null, customerEmail: user.email };
}
export async function createSession(link: string) {
  if (!/^[a-f0-9]{64}$/.test(link)) throw new CommerceError('This access link is invalid or expired.', 410);
  const raw = newToken();
  await prisma.$transaction(async tx => {
    const token = await tx.ebookAccessToken.findUnique({ where: { hash: tokenHash(link) } });
    if (!token || token.kind !== 'LINK' || token.consumedAt || token.expiresAt <= new Date()) throw new CommerceError('This access link is invalid or expired.', 410);
    const consumed = await tx.ebookAccessToken.updateMany({ where: { hash: token.hash, consumedAt: null, expiresAt: { gt: new Date() } }, data: { consumedAt: new Date() } });
    if (consumed.count !== 1) throw new CommerceError('This access link has already been used.', 410);
    await tx.ebookAccessToken.create({ data: { hash: tokenHash(raw), email: token.email, kind: 'SESSION', expiresAt: new Date(Date.now() + 24 * 3600000) } });
  });
  return raw;
}
