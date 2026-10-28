import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CommerceError } from '@/lib/commerce/shared';
import { newToken, tokenHash } from './tokens';

export const guestCookie = 'ds-ebook-session';
export async function buyer() {
  const cookieStore = await cookies();
  // A stale client SessionProvider is not proof of identity. Resolve the actual
  // request session; if NextAuth cannot materialise it, validate its encrypted
  // cookie and current database session version before accepting an account.
  const session = await getServerSession(authOptions).catch(() => null);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (id) {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, emailVerified: true } });
    if (user?.email && user.emailVerified && !user.email.endsWith('.placeholder')) return { id: user.id, email: user.email.toLowerCase(), name: user.name };
  }
  if (!id && authOptions.secret) {
    const requestCookies = cookieStore.getAll().filter(c => /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/.test(c.name));
    // In-memory request only: forward auth cookies to NextAuth's JWT decoder.
    const tokenRequest = new NextRequest('https://auth.invalid/');
    for (const cookie of requestCookies) tokenRequest.cookies.set(cookie.name, cookie.value);
    const token = await getToken({
      req: tokenRequest,
      secret: authOptions.secret,
      secureCookie: requestCookies.some(c => c.name === '__Secure-next-auth.session-token' || c.name.startsWith('__Secure-next-auth.session-token.')),
    });
    if (token) {
      const user = token.id
        ? await prisma.user.findUnique({ where: { id: String(token.id) }, select: { id: true, email: true, name: true, emailVerified: true, sessionVersion: true } })
        : token.email ? await prisma.user.findUnique({ where: { email: token.email.toLowerCase() }, select: { id: true, email: true, name: true, emailVerified: true, sessionVersion: true } }) : null;
      if (user?.email && user.emailVerified && !user.email.endsWith('.placeholder') && (token.sessionVersion ?? 0) === user.sessionVersion) {
        return { id: user.id, email: user.email.toLowerCase(), name: user.name };
      }
    }
  }
  const raw = cookieStore.get(guestCookie)?.value;
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
