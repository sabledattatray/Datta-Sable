import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CommerceError } from './shared';
import { timingSafeEqual } from 'node:crypto';

export async function customer(admin = false) {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new CommerceError('Please sign in to continue.', 401);
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, emailVerified: true, role: true } });
  if (!user?.email || !user.emailVerified || user.email.endsWith('.placeholder')) throw new CommerceError('A verified account is required.', 403);
  if (admin && user.role !== 'ADMIN') throw new CommerceError('Administrator access required.', 403);
  return user;
}
export function sameOrigin(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) throw new CommerceError('Invalid request origin.', 403);
}
export function workerAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new CommerceError('Worker authentication is not configured.', 503);
  const a = Buffer.from(`Bearer ${secret}`), b = Buffer.from(req.headers.get('authorization') || '');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new CommerceError('Unauthorized.', 401);
}
export async function ownedOrder(id: string) {
  const user = await customer();
  const order = await prisma.commerceOrder.findFirst({ where: { id, ...(user.role === 'ADMIN' ? {} : { userId: user.id }) }, include: { items: true, payments: { include: { refunds: true } }, emails: { select: { id: true, kind: true, status: true, acceptedAt: true, deliveredAt: true } }, entitlements: { include: { product: { include: { resources: { where: { active: true }, select: { id: true, title: true } } } } } } } });
  if (!order) throw new CommerceError('Order not found.', 404);
  return order;
}
