import { randomUUID } from 'node:crypto';

import { prisma } from '@/lib/prisma';

import { sendEmail, DeliveryError } from '@/lib/email-delivery';

import { escapeHtml } from '@/lib/campaigns/shared';

import { siteUrl } from './config';

import { money, retryAt, CommerceError } from './shared';

import { reconcilePayment } from './payments';



export function receiptContent(order: { number: string; customerName: string; customerEmail: string; status?: string; totalMinor: number; currency: string; paidAt: Date | null; items: { title: string }[]; payments: { providerId: string; status: string }[]; id: string }, admin = false) {

  const url = siteUrl(), e = escapeHtml;

  const details = [['Order', order.number], ['Product', order.items.map(i => i.title).join(', ')], ['Amount paid', money(order.totalMinor, order.currency)], ['Payment date', order.paidAt ? order.paidAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST' : ''], ['Reference', order.payments.find(p => ['CAPTURED', 'REFUNDED'].includes(p.status))?.providerId || ''], ['Status', order.status === 'REFUNDED' ? 'Refunded after capture' : 'Payment captured']];

  if (admin) details.unshift(['Customer', order.customerName], ['Customer email', order.customerEmail]);

  const target = admin ? `${url}/admin/orders?order=${encodeURIComponent(order.id)}` : `${url}/account/orders/${encodeURIComponent(order.id)}`;

  const text = `TEST MODE — No real payment was collected.\n${admin ? 'New purchase' : `Dear ${order.customerName}, thank you for your purchase.`}\n${details.map(([k,v]) => `${k}: ${v}`).join('\n')}\nView order and eligible resources: ${target}\nSupport: ds@dattasable.com\nRefund policy: ${url}/refund-policy\nPayment receipt; not a tax invoice.`;

  const html = `<div style="background:#f4f4f5;padding:24px;font:15px/1.7 Arial,sans-serif;color:#202025"><div style="max-width:600px;margin:auto;background:white;padding:28px;border:1px solid #ddd;border-radius:12px"><p style="font-size:22px;font-weight:bold;color:#0059b3">Datta Sable</p><p style="padding:10px;background:#f4f4f5;font-weight:bold">TEST MODE · No real payment was collected</p><h1 style="font-size:24px">${admin ? 'A new purchase' : 'Payment confirmed'}</h1><p>${admin ? 'A verified payment has been captured.' : `Dear ${e(order.customerName)},<br>Thank you for your purchase.`}</p><table style="width:100%;border-collapse:collapse">${details.map(([k,v]) => `<tr><th style="text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #ddd">${e(k)}</th><td style="padding:9px;border-bottom:1px solid #ddd;overflow-wrap:anywhere">${e(v)}</td></tr>`).join('')}</table><p>View your order for the current availability of purchased resources.</p><p><a href="${e(target)}" style="display:inline-block;background:#0059b3;color:white;padding:12px 18px;border-radius:6px">${admin ? 'Manage order' : 'View purchase'}</a></p><p>Questions? <a href="mailto:ds@dattasable.com">ds@dattasable.com</a></p><p><a href="${e(url)}/refund-policy">Refund policy</a> · <a href="${e(url)}">dattasable.com</a></p><p style="font-size:12px;color:#555">Payment receipt; not a tax invoice. Independent learning materials; Microsoft examination fees are not included.</p></div></div>`;

  return { subject: admin ? `[TEST] New purchase | ${order.number}` : '[TEST] Payment Confirmed | Your Purchase from Datta Sable', html, text };

}



async function processEmails(limit: number, deadline: number) {

  if (process.env.COMMERCE_SENDER_VERIFIED !== 'true') return { processed: 0, blocked: 'Transactional sender verification is required.' };

  let processed = 0;

  // Expired sending leases are ambiguous: never blindly re-send after provider acceptance.

  await prisma.commerceEmail.updateMany({ where: { status: 'SENDING', leaseUntil: { lt: new Date() } }, data: { status: 'UNCERTAIN', lastError: 'Worker stopped without recording provider acceptance. Review provider logs before retry.' } });

  for (let i = 0; i < limit && Date.now() < deadline - 18000; i++) {

    const owner = randomUUID();

    const ids = await prisma.$queryRaw<{ id: string }[]>`WITH picked AS (SELECT id FROM "CommerceEmail" WHERE status IN ('PENDING','RETRY') AND "nextAttemptAt"<=NOW() AND attempts<8 ORDER BY "nextAttemptAt" FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE "CommerceEmail" e SET status='SENDING',"leaseOwner"=${owner},"leaseUntil"=NOW()+INTERVAL '60 seconds',attempts=e.attempts+1,"firstAttemptAt"=COALESCE(e."firstAttemptAt",NOW()) FROM picked WHERE e.id=picked.id RETURNING e.id`;

    if (!ids.length) break;

    const job = await prisma.commerceEmail.findUniqueOrThrow({ where: { id: ids[0].id }, include: { order: { include: { items: true, payments: true } } } });

    let providerAccepted = false;

    try {

      if (!job.order.paidAt || !['PAID', 'REFUNDED'].includes(job.order.status)) throw new CommerceError('Order payment has not been verified.');

      if (Date.now() - job.firstAttemptAt!.getTime() >= 23 * 3600000) throw new DeliveryError('Provider idempotency window is expiring. Review before resending.', true);

      const receipt = receiptContent(job.order, job.kind === 'ADMIN');

      const result = await sendEmail({ to: job.recipient, ...receipt }, job.id, { namespace: 'commerce', from: process.env.COMMERCE_EMAIL_FROM || 'Datta Sable <ds@dattasable.com>' });

      providerAccepted = true;

      await prisma.commerceEmail.updateMany({ where: { id: job.id, leaseOwner: owner, status: 'SENDING' }, data: { status: 'ACCEPTED', providerId: result.messageId, acceptedAt: new Date(), leaseUntil: null, leaseOwner: null, lastError: null } });

    } catch (error) {

      const uncertain = providerAccepted || (error instanceof DeliveryError && error.uncertain);

      await prisma.commerceEmail.updateMany({ where: { id: job.id, leaseOwner: owner }, data: { status: uncertain ? 'UNCERTAIN' : job.attempts >= 8 ? 'FAILED' : 'RETRY', nextAttemptAt: retryAt(job.attempts), ...(uncertain ? {} : { firstAttemptAt: null }), leaseUntil: null, leaseOwner: null, lastError: error instanceof DeliveryError || error instanceof CommerceError ? error.message : 'Email delivery failed.' } });

    }

    processed++;

  }

  return { processed };

}



async function processWebhooks(limit: number, deadline: number) {

  let processed = 0;

  for (let i = 0; i < limit && Date.now() < deadline - 25000; i++) {

    const owner = randomUUID();

    const ids = await prisma.$queryRaw<{ id: string }[]>`WITH picked AS (SELECT id FROM "CommerceWebhook" WHERE ((status IN ('PENDING','RETRY') AND "nextAttemptAt"<=NOW()) OR (status='PROCESSING' AND "leaseUntil"<NOW())) AND attempts<8 ORDER BY "receivedAt" FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE "CommerceWebhook" e SET status='PROCESSING',"leaseOwner"=${owner},"leaseUntil"=NOW()+INTERVAL '90 seconds',attempts=e.attempts+1 FROM picked WHERE e.id=picked.id RETURNING e.id`;

    if (!ids.length) break;

    const job = await prisma.commerceWebhook.findUniqueOrThrow({ where: { id: ids[0].id } });

    try {

      const payload = job.payload as { paymentId?: string };

      if (!payload.paymentId) throw new CommerceError('Webhook lacks a payment reference.');

      await reconcilePayment(payload.paymentId);

      await prisma.commerceWebhook.updateMany({ where: { id: job.id, leaseOwner: owner }, data: { status: 'PROCESSED', processedAt: new Date(), leaseUntil: null, leaseOwner: null, lastError: null } });

    } catch {

      await prisma.commerceWebhook.updateMany({ where: { id: job.id, leaseOwner: owner }, data: { status: job.attempts >= 8 ? 'FAILED' : 'RETRY', nextAttemptAt: retryAt(job.attempts), leaseUntil: null, leaseOwner: null, lastError: 'Provider reconciliation failed. Retry or review the transaction.' } });

    }

    processed++;

  }

  return { processed };

}

export async function processCommerceJobs(limit = 10, budgetMs = 45000) {

  const deadline = Date.now() + budgetMs;

  const webhooks = await processWebhooks(Math.min(limit, 2), deadline), emails = await processEmails(limit, deadline);

  await prisma.commerceLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  return { webhooks, emails };

}

