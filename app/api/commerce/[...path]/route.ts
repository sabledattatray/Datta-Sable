import { after, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { put, head, issueSignedToken, presignUrl } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/security';
import { customer, ownedOrder, sameOrigin, workerAuth } from '@/lib/commerce/access';
import { jsonBody, errorResponse } from '@/lib/commerce/http';
import { paymentConfig, provider, providerCall, checkoutConfigurationChecks } from '@/lib/commerce/config';
import { productDetailsSchema, defaultProductDetails } from '@/lib/commerce/product-details';
import { productDetailsMap, productSettingKey } from '@/lib/commerce/product-settings';
import { CommerceError, dp700Draft, productInput, validSignature, resourceFormat } from '@/lib/commerce/shared';
import { initiate, verifyCallback, reconcileOrder, transaction } from '@/lib/commerce/payments';
import { processCommerceJobs } from '@/lib/commerce/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
type Context = { params: Promise<{ path: string[] }> };
const ok = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const kick = () => after(async () => { try { await processCommerceJobs(); } catch { console.error('Commerce worker deferred; durable jobs remain queued.'); } });

export async function GET(req: Request, context: Context) {
  try {
    const path = (await context.params).path;
    if (path.join('/') === 'worker') {
      workerAuth(req);
      const commerce = await processCommerceJobs();
      let aiPublisher: { publishedCount: number; errors: string[] } | null = null;
      try {
        const { processDueSchedules } = await import('@/lib/ai/publishing');
        aiPublisher = await processDueSchedules();
      } catch (aiErr) {
        console.error('AI publishing scheduler deferred in commerce worker:', aiErr);
      }
      return ok({ commerce, aiPublisher });
    }
    if (path[0] === 'orders' && path[1]) {
      const order = await ownedOrder(path[1]);
      if (order.status === 'PENDING' || order.emails.some(e => ['PENDING', 'RETRY', 'SENDING'].includes(e.status))) kick();
      return ok(order);
    }
    if (path[0] === 'downloads' && path[1]) {
      const user = await customer();
      const resource = await prisma.commerceResource.findFirst({ where: { id: path[1], active: true, product: { deliveryReady: true, entitlements: { some: { status: 'ACTIVE', order: { userId: user.id, status: 'PAID' } } } } } });
      if (!resource) throw new CommerceError('Download not available.', 404);
      const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
      if (!token) throw new CommerceError('Private storage is not configured.', 503);
      if (!/^products\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/.test(resource.pathname) || resource.pathname.includes('..')) throw new CommerceError('Download not available.', 404);
      const key = `download:${user.id}:${Math.floor(Date.now() / 60000)}`;
      const quota = await prisma.commerceLimit.upsert({ where: { key }, create: { key, expiresAt: new Date(Date.now() + 120000) }, update: { count: { increment: 1 } } });
      if (quota.count > 20) throw new CommerceError('Too many download requests. Please wait a minute.', 429);
      try { await head(resource.pathname, { token }); } catch { throw new CommerceError('This file is temporarily unavailable. Please try again later or contact orders@dattasable.com.', 503); }
      const validUntil = Date.now() + 120000;
      const signed = await issueSignedToken({ token, pathname: resource.pathname, operations: ['get'], validUntil });
      const { presignedUrl } = await presignUrl(signed, { access: 'private', operation: 'get', pathname: resource.pathname, validUntil });
      await prisma.commerceDownload.create({ data: { resourceId: resource.id, userId: user.id } });
      return new NextResponse(null, { status: 303, headers: { Location: presignedUrl, 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' } });
    }
    if (path.join('/') === 'admin') {
      await customer(true);
      const query = new URL(req.url).searchParams;
      const q = (query.get('q') || '').slice(0, 200);
      const status = z.enum(['', 'PENDING', 'PAID', 'REFUNDED']).parse(query.get('status') || '');
      const page = z.coerce.number().int().min(0).max(10000).parse(query.get('page') || 0);
      const where = { ...(status ? { status } : {}), ...(q ? { OR: [
        { number: { contains: q, mode: 'insensitive' as const } }, { customerEmail: { contains: q, mode: 'insensitive' as const } },
        { customerName: { contains: q, mode: 'insensitive' as const } }, { items: { some: { title: { contains: q, mode: 'insensitive' as const } } } },
      ] } : {}) };
      const [products, orders, events, emails, refunds, orderCount] = await Promise.all([
        prisma.commerceProduct.findMany({ include: { resources: true }, orderBy: { createdAt: 'desc' } }),
        prisma.commerceOrder.findMany({ where, take: 50, skip: page * 50, include: { items: true, payments: { include: { refunds: true } } }, orderBy: { createdAt: 'desc' } }),
        prisma.commerceWebhook.findMany({ take: 50, orderBy: { receivedAt: 'desc' }, select: { id: true, eventId: true, type: true, status: true, attempts: true, lastError: true } }),
        prisma.commerceEmail.findMany({ take: 100, orderBy: { createdAt: 'desc' } }),
        prisma.commerceRefund.findMany({ take: 100, orderBy: { createdAt: 'desc' }, include: { payment: { select: { currency: true } } } }),
        prisma.commerceOrder.count({ where }),
      ]);
      const totals = await prisma.commerceOrder.groupBy({ by: ['currency', 'status'], _sum: { totalMinor: true }, _count: true });
      const paymentCounts = await prisma.commercePayment.groupBy({ by: ['status'], _count: true });
      const refundTotals = await prisma.commerceRefund.findMany({ where: { status: 'PROCESSED' }, select: { amountMinor: true, payment: { select: { currency: true } } } });
      if (emails.some(e => ['PENDING', 'RETRY', 'SENDING'].includes(e.status))) kick();
      const details = await productDetailsMap(products.map(p => p.id));
      const publishedPolicies = await prisma.page.count({ where: { slug: { in: ['refund-policy', 'delivery-policy'] }, published: true } });
      return ok({ products: products.map(p => ({ ...p, details: details.get(p.id) || defaultProductDetails() })), orders, events, emails, refunds, orderCount, totals, refundTotals, paymentCounts, testMode: true, configurationChecks: [...checkoutConfigurationChecks(), { key: 'PUBLISHED_POLICIES', label: 'Both purchase policies published', ready: publishedPolicies === 2 }] });
    }
    throw new CommerceError('Not found.', 404);
  } catch (error) { return errorResponse(error); }
}

export async function POST(req: Request, context: Context) {
  try {
    const path = (await context.params).path.join('/');
    if (path === 'webhook') {
      paymentConfig(); // This release rejects live configuration.
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret) throw new CommerceError('Webhook secret is not configured.', 503);
      const raw = await req.text();
      if (Buffer.byteLength(raw) > 262144) throw new CommerceError('Payload too large.', 413);
      if (!validSignature(raw, req.headers.get('x-razorpay-signature') || '', secret)) throw new CommerceError('Invalid webhook signature.', 400);
      const event = z.object({ event: z.string(), payload: z.object({ payment: z.object({ entity: z.object({ id: z.string() }) }).optional(), refund: z.object({ entity: z.object({ payment_id: z.string() }) }).optional() }) }).parse(JSON.parse(raw));
      if (!['payment.captured', 'payment.failed', 'refund.created', 'refund.processed', 'refund.failed'].includes(event.event)) return ok({ ignored: true });
      const eventId = z.string().min(1).max(200).parse(req.headers.get('x-razorpay-event-id'));
      const paymentId = event.payload.payment?.entity.id || event.payload.refund?.entity.payment_id;
      if (!paymentId) throw new CommerceError('Missing payment reference.');
      // Persist before acknowledging. A duplicate never resets an event's processing state.
      await prisma.commerceWebhook.upsert({ where: { eventId }, create: { eventId, type: event.event, payload: { paymentId } }, update: {} });
      kick(); return ok({ received: true });
    }
    sameOrigin(req);
    const user = await customer(path.startsWith('admin'));
    if (path === 'orders') {
      const input = z.object({ productId: z.string().min(1).max(100), requestKey: z.string().uuid() }).parse(await jsonBody(req));
      const order = await initiate(user, input.productId, input.requestKey);
      return ok({ id: order.id, number: order.number, razorpayOrderId: order.razorpayOrderId, amount: order.totalMinor, currency: order.currency, key: paymentConfig().key, email: order.customerEmail, name: order.customerName });
    }
    if (path === 'verify') {
      const input = z.object({ orderId: z.string().min(1), paymentId: z.string().regex(/^pay_[a-zA-Z0-9]+$/), razorpayOrderId: z.string(), signature: z.string().length(64) }).parse(await jsonBody(req));
      const id = await verifyCallback(input.orderId, user.id, input.paymentId, input.razorpayOrderId, input.signature);
      kick(); return ok({ id });
    }
    if (path === 'reconcile') {
      const { id } = z.object({ id: z.string().min(1) }).parse(await jsonBody(req));
      await ownedOrder(id); await reconcileOrder(id); kick(); return ok({ success: true });
    }
    if (path === 'admin/upload') {
      const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
      if (!token) throw new CommerceError('Private Blob storage is not configured.', 503);
      const form = await req.formData(), file = form.get('file');
      const productId = z.string().min(1).parse(form.get('productId'));
      const title = z.string().trim().min(1).max(180).parse(form.get('title'));
      if (!(file instanceof File) || file.size < 5 || file.size > 4 * 1024 * 1024) throw new CommerceError('Upload a resource of up to 4 MB.');
      if (!(await prisma.commerceProduct.findUnique({ where: { id: productId } }))) throw new CommerceError('Product not found.', 404);
      const bytes = Buffer.from(await file.arrayBuffer());
      const format = resourceFormat(file.name, bytes);
      const blob = await put(`products/${productId}/${randomUUID()}.${format.extension}`, bytes, { access: 'private', token, contentType: format.contentType, addRandomSuffix: false });
      const resource = await prisma.commerceResource.create({ data: { productId, title, pathname: blob.pathname } });
      await logAudit({ userId: user.id, action: 'COMMERCE_RESOURCE_UPLOAD', status: 'SUCCESS', details: resource.id });
      return ok({ id: resource.id });
    }
    if (path !== 'admin') throw new CommerceError('Not found.', 404);
    const body = await jsonBody(req);
    const action = z.enum(['product', 'seed', 'reconcile', 'retry-event', 'resend', 'refund', 'resource', 'work']).parse(body.action);
    let result: unknown = { success: true };
    if (action === 'product') {
      const data = productInput.parse(body.product), id = z.string().optional().parse(body.id);
      if (id) {
        const existingProduct = await prisma.commerceProduct.findUniqueOrThrow({ where: { id }, select: { slug: true } });
        if (existingProduct.slug !== data.slug) throw new CommerceError('Existing product URLs are preserved. Create a new draft instead of changing this slug.');
      }
      const detailsInput = (body.product as Record<string, unknown>).details;
      const details = detailsInput === undefined && id ? (await productDetailsMap([id])).get(id) || defaultProductDetails() : productDetailsSchema.parse(detailsInput || {});
      if (data.salesEnabled && (data.status !== 'PUBLISHED' || !data.deliveryReady)) throw new CommerceError('Sales require a published, ready product.');
      if (data.salesEnabled && (!id || !await prisma.commerceResource.count({ where: { productId: id, active: true } }))) throw new CommerceError('Upload actual resources before enabling sales.');
      if (details.readiness === 'READY_FOR_SALE') {
        const resources = id ? await prisma.commerceResource.findMany({ where: { productId: id, active: true }, select: { title: true } }) : [];
        if (!resources.length || resources.some(r => /test[ -]only|dummy/i.test(r.title)) || /test[ -]only|dummy/i.test(data.excerpt) || !details.license || !details.version || !data.deliveryReady) throw new CommerceError('Commercial readiness requires actual non-dummy files, a version, license and confirmed delivery.');
      }
      result = await transaction(async tx => {
        const product = id ? await tx.commerceProduct.update({ where: { id }, data }) : await tx.commerceProduct.create({ data });
        await tx.systemSetting.upsert({ where: { key: productSettingKey(product.id) }, create: { key: productSettingKey(product.id), value: JSON.stringify(details) }, update: { value: JSON.stringify(details) } });
        return { id: product.id };
      });
    }
    if (action === 'seed') result = await prisma.commerceProduct.upsert({ where: { slug: dp700Draft.slug }, create: dp700Draft, update: {} });
    if (action === 'resource') {
      const input = z.object({ id: z.string(), active: z.boolean() }).parse(body);
      await prisma.commerceResource.update({ where: { id: input.id }, data: { active: input.active } });
    }
    if (action === 'reconcile') { await reconcileOrder(z.string().parse(body.id)); kick(); }
    if (action === 'retry-event') {
      await prisma.commerceWebhook.updateMany({ where: { id: z.string().parse(body.id), status: { in: ['FAILED', 'RETRY'] } }, data: { status: 'PENDING', attempts: 0, nextAttemptAt: new Date() } }); kick();
    }
    if (action === 'resend') {
      const input = z.object({ id: z.string(), confirmedProviderReview: z.literal(true) }).parse(body);
      const job = await prisma.commerceEmail.findUniqueOrThrow({ where: { id: input.id } });
      if (['PENDING', 'RETRY', 'SENDING'].includes(job.status)) throw new CommerceError('This email is already queued.', 409);
      // A deliberate resend is a new audited delivery, never a reset of an accepted receipt.
      await prisma.commerceEmail.create({ data: { orderId: job.orderId, dedupeKey: job.kind === 'REFUND' ? `${job.dedupeKey}:resend:${randomUUID()}` : `resend:${randomUUID()}`, kind: job.kind, recipient: job.recipient } }); kick();
    }
    if (action === 'refund') {
      paymentConfig();
      const input = z.object({ paymentId: z.string(), reason: z.string().min(5).max(500), requestKey: z.string().uuid(), confirmation: z.literal('REFUND TEST PAYMENT') }).parse(body);
      const refund = await transaction(async tx => {
        const payment = await tx.commercePayment.findUniqueOrThrow({ where: { id: input.paymentId }, include: { refunds: true } });
        if (payment.status !== 'CAPTURED' || payment.refunds.some(r => r.status !== 'FAILED')) throw new CommerceError('Refund already exists or payment is not captured.', 409);
        return tx.commerceRefund.create({ data: { paymentId: payment.id, amountMinor: payment.amountMinor, requestKey: input.requestKey, actorId: user.id, reason: input.reason } });
      });
      const payment = await prisma.commercePayment.findUniqueOrThrow({ where: { id: refund.paymentId } });
      try {
        const remote = await providerCall(provider().payments.refund(payment.providerId, { amount: refund.amountMinor, receipt: refund.id }));
        await prisma.commerceRefund.update({ where: { id: refund.id }, data: { providerId: remote.id, status: remote.status.toUpperCase() } });
        await reconcileOrder(payment.orderId);
      } catch { throw new CommerceError('Refund outcome requires reconciliation. Do not issue another refund.', 503); }
    }
    if (action === 'work') result = await processCommerceJobs();
    await logAudit({ userId: user.id, action: `COMMERCE_${action.toUpperCase()}`, status: 'SUCCESS', details: typeof body.id === 'string' ? body.id : undefined });
    return ok(result);
  } catch (error) { return errorResponse(error); }
}
