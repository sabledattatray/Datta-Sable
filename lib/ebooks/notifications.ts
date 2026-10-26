import { createHmac, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, DeliveryError } from '@/lib/email-delivery';
import { siteUrl } from '@/lib/commerce/config';
import { CommerceError, retryAt } from '@/lib/commerce/shared';
import { tokenHash } from './tokens';

function accessToken(id: string) {
  const secret = process.env.EBOOK_ACCESS_SECRET;
  if (!secret || secret.length < 32) throw new CommerceError('Guest email access is not configured.', 503);
  return createHmac('sha256', secret).update(`ebook-access:${id}`).digest('hex');
}
export async function queueAccess(email: string) {
  const id = randomUUID(), raw = accessToken(id);
  await prisma.$transaction(async tx => {
    await tx.ebookAccessToken.create({ data: { hash: tokenHash(raw), email, kind: 'LINK', expiresAt: new Date(Date.now() + 30 * 60000) } });
    await tx.ebookAccessMail.create({ data: { id, email } });
  });
}
export async function accessMailWorker() {
  if (process.env.COMMERCE_SENDER_VERIFIED !== 'true') return;
  await prisma.ebookAccessMail.updateMany({ where: { status: 'SENDING', leaseUntil: { lt: new Date() } }, data: { status: 'UNCERTAIN', lastError: 'Review provider acceptance before resending.' } });
  for (let i = 0; i < 1; i++) {
    const ids = await prisma.$queryRaw<{ id: string }[]>`WITH picked AS (SELECT id FROM "EbookAccessMail" WHERE status IN ('PENDING','RETRY') AND "nextAttemptAt"<=NOW() AND attempts<5 ORDER BY "nextAttemptAt" FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE "EbookAccessMail" m SET status='SENDING',attempts=m.attempts+1,"leaseUntil"=NOW()+INTERVAL '60 seconds' FROM picked WHERE m.id=picked.id RETURNING m.id`;
    if (!ids.length) break;
    const mail = await prisma.ebookAccessMail.findUniqueOrThrow({ where: { id: ids[0].id } });
    let accepted = false;
    try {
      if (Date.now() - mail.createdAt.getTime() > 25 * 60000) throw new CommerceError('Access link expired. Request a new link.');
      const url = `${siteUrl()}/ebooks/access#token=${accessToken(mail.id)}`;
      const result = await sendEmail({ to: mail.email, subject: 'Your Datta Sable eBook library access', text: `Open your private library: ${url}\nThis single-use link expires in 30 minutes. If you did not request it, ignore this email.`, html: `<p>Your private eBook library is ready.</p><p><a href="${url}">Verify email and open library</a></p><p>This single-use link expires in 30 minutes. Ignore this message if you did not request it.</p>` }, mail.id, { namespace: 'commerce' });
      accepted = true;
      await prisma.ebookAccessMail.update({ where: { id: mail.id }, data: { status: 'ACCEPTED', providerId: result.messageId, leaseUntil: null, lastError: null } });
    } catch (error) {
      await prisma.ebookAccessMail.update({ where: { id: mail.id }, data: { status: accepted || error instanceof DeliveryError && error.uncertain ? 'UNCERTAIN' : error instanceof CommerceError || mail.attempts >= 5 ? 'FAILED' : 'RETRY', nextAttemptAt: retryAt(mail.attempts), leaseUntil: null, lastError: 'Access email requires retry or provider review; request a new link if expired.' } });
    }
  }
}
