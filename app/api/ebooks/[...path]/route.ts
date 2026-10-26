import { after, NextResponse } from 'next/server';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { head, put, issueSignedToken, presignUrl } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { customer, sameOrigin, workerAuth } from '@/lib/commerce/access';
import { jsonBody, errorResponse } from '@/lib/commerce/http';
import { CommerceError, productInput, resourceFormat } from '@/lib/commerce/shared';
import { initiate, verifyCallback, reconcileOrder, transaction } from '@/lib/commerce/payments';
import { paymentConfig } from '@/lib/commerce/config';
import { processCommerceJobs } from '@/lib/commerce/jobs';
import { logAudit } from '@/lib/security';
import { assertEbookSale, seedEbooks } from '@/lib/ebooks/service';
import { categoryInput, profileInput, ebookEnabled, ebookPaymentMode } from '@/lib/ebooks/validation';
import { tokenHash, newToken } from '@/lib/ebooks/tokens';
import { buyer, buyerWhere, createSession, guestCookie } from '@/lib/ebooks/access';
import { queueAccess, accessMailWorker } from '@/lib/ebooks/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
type Context = { params: Promise<{ path: string[] }> };
const ok = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' } });
function enabled() { if (!ebookEnabled()) throw new CommerceError('The eBook store is not enabled.', 404); }
async function limit(key: string, max: number, minutes = 1) {
  const window = Math.floor(Date.now() / (minutes * 60000));
  const quota = await prisma.commerceLimit.upsert({ where: { key: `ebook:${key}:${window}` }, create: { key: `ebook:${key}:${window}`, expiresAt: new Date(Date.now() + (minutes + 1) * 60000) }, update: { count: { increment: 1 } } });
  if (quota.count > max) throw new CommerceError('Please wait before trying again.', 429);
}
async function ownOrder(id: string) {
  const user = await buyer();
  const order = await prisma.commerceOrder.findFirst({ where: { id, ...buyerWhere(user), items: { some: { product: { ebook: { isNot: null } } } } }, include: { items: true } });
  if (!order) throw new CommerceError('Order not found.', 404);
  return { order, user };
}
export async function GET(req: Request, context: Context) {
  try {
    const path = (await context.params).path;
    if (path.join('/') === 'worker') {
      workerAuth(req); await accessMailWorker();
      const orders = await prisma.commerceOrder.findMany({ where: { status: 'PENDING', razorpayOrderId: { not: null }, createdAt: { lt: new Date(Date.now() - 5 * 60000) }, items: { some: { product: { ebook: { isNot: null } } } } }, select: { id: true }, take: 1, orderBy: { updatedAt: 'asc' } });
      for (const order of orders) { try { await reconcileOrder(order.id); } catch { console.error('Ebook order reconciliation deferred.'); } await prisma.commerceOrder.update({ where: { id: order.id }, data: { updatedAt: new Date() } }); }
      // Expired secrets have no recovery purpose; financial/download records remain intact.
      await prisma.ebookAccessToken.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 86400000) } } });
      await prisma.ebookDownloadGrant.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 30 * 86400000) } } });
      await prisma.ebookAccessMail.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 30 * 86400000) } }, });
      return ok({ processed: true });
    }
    if (path[0] === 'admin') {
      await customer(true);
      const [books, categories, grants, mail] = await Promise.all([
        prisma.commerceProduct.findMany({ where: { ebook: { isNot: null } }, include: { ebook: { include: { categories: true } }, resources: { include: { asset: true } } }, orderBy: { createdAt: 'desc' } }),
        prisma.ebookCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.commerceEntitlement.findMany({ where: { product: { ebook: { isNot: null } } }, include: { product: { select: { title: true } }, order: { select: { number: true, customerEmail: true, status: true } } }, take: 100, orderBy: { grantedAt: 'desc' } }),
        prisma.ebookAccessMail.groupBy({ by: ['status'], _count: true }),
      ]);
      return ok({ books, categories, grants: grants.map(g => ({ ...g, order: { ...g.order, customerEmail: g.order.customerEmail.replace(/(^.).*(@.*$)/, '$1***$2') } })), mail, enabled: ebookEnabled(), testMode: ebookPaymentMode() === 'test' });
    }
    enabled();
    if (path[0] === 'library') {
      const user = await buyer();
      const orders = await prisma.commerceOrder.findMany({ where: { ...buyerWhere(user), items: { some: { product: { ebook: { isNot: null } } } } }, select: { id: true, number: true, requestKey: true, status: true, totalMinor: true, currency: true, createdAt: true, items: { select: { title: true, productId: true, product: { select: { slug: true } } } }, entitlements: { select: { id: true, status: true, productId: true } } }, orderBy: { createdAt: 'desc' }, take: 100 });
      return ok({ orders });
    }
    throw new CommerceError('Not found.', 404);
  } catch (error) { return errorResponse(error); }
}
export async function POST(req: Request, context: Context) {
  try {
    sameOrigin(req);
    const path = (await context.params).path.join('/');
    if (path.startsWith('admin')) {
      const admin = await customer(true);
      if (path === 'admin/upload') {
        const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
        if (!token) throw new CommerceError('Private storage is not configured.', 503);
        const form = await req.formData(), file = form.get('file');
        const productId = z.string().min(1).max(100).parse(form.get('productId'));
        const profile = await prisma.ebookProfile.findUniqueOrThrow({ where: { productId } });
        if (!(file instanceof File) || file.size > 4 * 1024 * 1024 || file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) throw new CommerceError('Choose a PDF up to 4 MB.');
        const bytes = Buffer.from(await file.arrayBuffer()); resourceFormat(file.name, bytes);
        const sha256 = createHash('sha256').update(bytes).digest('hex');
        const blob = await put(`products/${productId}/${randomUUID()}.pdf`, bytes, { access: 'private', token, contentType: 'application/pdf', addRandomSuffix: false });
        await transaction(async tx => {
          await tx.commerceResource.updateMany({ where: { productId }, data: { active: false } });
          await tx.commerceResource.create({ data: { productId, title: `${profile.edition} PDF`, pathname: blob.pathname, asset: { create: { sha256, byteSize: bytes.length, filename: file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180), version: profile.version } } } });
          await tx.ebookProfile.update({ where: { productId }, data: { approved: false } });
          await tx.commerceProduct.update({ where: { id: productId }, data: { status: 'DRAFT', salesEnabled: false, deliveryReady: false } });
          await tx.auditLog.create({ data: { userId: admin.id, action: 'EBOOK_ASSET_VERSION', status: 'SUCCESS', details: JSON.stringify({ productId, sha256, byteSize: bytes.length, version: profile.version }) } });
        });
        await logAudit({ userId: admin.id, action: 'EBOOK_UPLOAD', status: 'SUCCESS', details: `${productId}:${sha256}` });
        return ok({ uploaded: true, sha256 });
      }
      const body = await jsonBody(req);
      const action = z.enum(['seed', 'save', 'category', 'delete-category', 'revoke', 'resend']).parse(body.action);
      let result: unknown = { saved: true };
      if (action === 'seed') result = { id: (await seedEbooks()).id };
      if (action === 'category') {
        const data = categoryInput.parse(body.category), id = z.string().optional().parse(body.id);
        result = id ? await prisma.ebookCategory.update({ where: { id }, data }) : await prisma.ebookCategory.create({ data });
      }
      if (action === 'delete-category') {
        const id = z.string().parse(body.id);
        if (await prisma.ebookCategoryLink.count({ where: { categoryId: id } })) throw new CommerceError('Reassign books before deleting this category.', 409);
        await prisma.ebookCategory.delete({ where: { id } });
      }
      if (action === 'save') {
        const data = productInput.parse(body.product), profile = profileInput.parse(body.profile), id = z.string().optional().parse(body.id);
        if (['category', 'search', 'checkout', 'order', 'library', 'download', 'access', 'help', 'terms', 'privacy', 'refund-policy'].includes(data.slug)) throw new CommerceError('This slug is reserved for a store route.');
        const categoryIds = z.array(z.string().min(1)).min(1).max(8).parse(body.categoryIds);
        if (data.currency !== 'INR') throw new CommerceError('eBook prices must use INR.');
        if (id) { const previous = await prisma.commerceProduct.findUniqueOrThrow({ where: { id }, select: { slug: true, ebook: true } }); if (!previous.ebook) throw new CommerceError('Use the existing product editor for non-eBook products.'); if (previous.slug !== data.slug) throw new CommerceError('Existing book URLs are preserved.'); }
        if (data.status === 'PUBLISHED') {
          const asset = id && await prisma.ebookAsset.findFirst({ where: { resource: { productId: id, active: true }, version: profile.version } });
          if (!profile.approved || !data.image || !asset || !data.deliveryReady || !data.salesEnabled) throw new CommerceError('Publishing requires the approved final PDF, actual cover, delivery readiness and sales enabled.');
        }
        result = await transaction(async tx => {
          if (await tx.ebookCategory.count({ where: { id: { in: categoryIds }, published: true } }) !== new Set(categoryIds).size) throw new CommerceError('Choose active categories.');
          const before = id ? await tx.commerceProduct.findUnique({ where: { id }, select: { status: true, priceMinor: true, currency: true, salesEnabled: true, deliveryReady: true } }) : null;
          const book = id ? await tx.commerceProduct.update({ where: { id }, data }) : await tx.commerceProduct.create({ data });
          await tx.ebookProfile.upsert({ where: { productId: book.id }, create: { productId: book.id, ...profile }, update: profile });
          await tx.ebookCategoryLink.deleteMany({ where: { productId: book.id } });
          await tx.ebookCategoryLink.createMany({ data: [...new Set(categoryIds)].map((categoryId, i) => ({ productId: book.id, categoryId, isPrimary: i === 0 })) });
          await tx.auditLog.create({ data: { userId: admin.id, action: 'EBOOK_CATALOG_SAVE', status: 'SUCCESS', details: JSON.stringify({ productId: book.id, before, after: { status: data.status, pricePaise: data.priceMinor, currency: data.currency, version: profile.version, approved: profile.approved, categoryIds } }) } });
          return { id: book.id };
        });
      }
      if (action === 'revoke') {
        const { id, reason } = z.object({ id: z.string(), reason: z.string().trim().min(10).max(500) }).parse(body);
        await transaction(async tx => { await tx.commerceEntitlement.update({ where: { id }, data: { status: 'REVOKED', revokedAt: new Date() } }); await tx.ebookDownloadGrant.updateMany({ where: { entitlementId: id }, data: { revokedAt: new Date() } }); await tx.auditLog.create({ data: { userId: admin.id, action: 'EBOOK_ACCESS_REVOKED', status: 'SUCCESS', details: JSON.stringify({ entitlementId: id, reason }) } }); });
        await logAudit({ userId: admin.id, action: 'EBOOK_REVOKE', status: 'SUCCESS', details: `${id}: ${reason}` });
      }
      if (action === 'resend') {
        const grant = await prisma.commerceEntitlement.findUniqueOrThrow({ where: { id: z.string().parse(body.id) }, include: { order: true } });
        await limit(`resend:${grant.orderId}`, 3, 30); await queueAccess(grant.order.customerEmail); after(accessMailWorker);
      }
      await logAudit({ userId: admin.id, action: `EBOOK_${action.toUpperCase()}`, status: 'SUCCESS', details: typeof body.id === 'string' ? body.id : undefined });
      return ok(result);
    }
    enabled();
    if (path === 'access/request') {
      const { email } = z.object({ email: z.string().email().max(254).transform(v => v.trim().toLowerCase()) }).parse(await jsonBody(req));
      const ip = tokenHash(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown');
      await limit(`ip:${ip}`, 10, 30); await limit(`email:${tokenHash(email)}`, 3, 30);
      // This verifies new guest buyers too. Response never reveals purchase/account existence.
      await queueAccess(email); after(accessMailWorker);
      return ok({ message: 'If email delivery is configured, an access link will arrive shortly. Check your inbox and spam folder.' });
    }
    if (path === 'access/consume') {
      const { token } = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) }).parse(await jsonBody(req));
      const raw = await createSession(token); const response = ok({ verified: true });
      response.cookies.set(guestCookie, raw, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 86400, path: '/' }); return response;
    }
    if (path === 'logout') {
      const raw = req.headers.get('cookie')?.match(/(?:^|; )ds-ebook-session=([a-f0-9]{64})/)?.[1];
      if (raw) await prisma.ebookAccessToken.updateMany({ where: { hash: tokenHash(raw) }, data: { consumedAt: new Date() } });
      const response = ok({ signedOut: true }); response.cookies.delete(guestCookie); return response;
    }
    if (path === 'orders') {
      const user = await buyer();
      const { productId, requestKey } = z.object({ productId: z.string().min(1).max(100), requestKey: z.string().uuid() }).parse(await jsonBody(req));
      await assertEbookSale(productId);
      if (!await prisma.ebookProfile.findUnique({ where: { productId } })) throw new CommerceError('Book not found.', 404);
      const order = await initiate(user, productId, requestKey, ebookPaymentMode());
      return ok({ id: order.id, number: order.number, amount: order.totalMinor, currency: order.currency, razorpayOrderId: order.razorpayOrderId, key: paymentConfig(order.mode === 'live' ? 'live' : 'test').key, email: order.customerEmail, name: order.customerName });
    }
    if (path === 'verify') {
      const input = z.object({ orderId: z.string(), paymentId: z.string().regex(/^pay_[a-zA-Z0-9]+$/), razorpayOrderId: z.string(), signature: z.string().length(64) }).parse(await jsonBody(req));
      const { order } = await ownOrder(input.orderId);
      await verifyCallback(order.id, order.userId, input.paymentId, input.razorpayOrderId, input.signature);
      after(async () => { try { await processCommerceJobs(); } catch { console.error('Commerce receipt remains queued for retry.'); } });
      return ok({ verified: true });
    }
    if (path === 'reconcile') { const { order } = await ownOrder(z.string().parse((await jsonBody(req)).id)); await limit(`reconcile:${order.id}`, 3); await reconcileOrder(order.id); return ok({ reconciled: true }); }
    if (path === 'grant') {
      const user = await buyer(), { id } = z.object({ id: z.string() }).parse(await jsonBody(req));
      await limit(`grant:${tokenHash(user.email)}`, 20);
      const entitlement = await prisma.commerceEntitlement.findFirst({ where: { id, status: 'ACTIVE', order: { status: 'PAID', ...buyerWhere(user) }, product: { ebook: { isNot: null }, deliveryReady: true } } });
      if (!entitlement) throw new CommerceError('Download not available.', 404);
      const raw = newToken(); await prisma.ebookDownloadGrant.create({ data: { hash: tokenHash(raw), entitlementId: id, expiresAt: new Date(Date.now() + 5 * 60000) } });
      return ok({ url: `/ebooks/download/access#token=${raw}` });
    }
    if (path === 'download') {
      const raw = z.string().parse((await jsonBody(req)).token);
      if (!/^[a-f0-9]{64}$/.test(raw)) throw new CommerceError('Download link invalid.', 410);
      const grant = await prisma.ebookDownloadGrant.findUnique({ where: { hash: tokenHash(raw) }, include: { entitlement: { include: { order: { include: { items: true } }, product: { include: { resources: { include: { asset: true } } } } } } } });
      if (!grant || grant.revokedAt || grant.expiresAt <= new Date() || grant.usedCount >= grant.maxUses || grant.entitlement.status !== 'ACTIVE' || grant.entitlement.order.status !== 'PAID' || !grant.entitlement.product.deliveryReady) throw new CommerceError('Download link expired or access revoked.', 410);
      const snapshot = grant.entitlement.order.items.find(i => i.productId === grant.entitlement.productId)?.resourceIdSnapshot;
      const resource = grant.entitlement.product.resources.find(r => r.asset && r.id === snapshot);
      const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
      if (!resource || !token || !/^products\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+\.pdf$/.test(resource.pathname)) throw new CommerceError('File temporarily unavailable.', 503);
      await head(resource.pathname, { token });
      const consumed = await prisma.ebookDownloadGrant.updateMany({ where: { hash: grant.hash, revokedAt: null, expiresAt: { gt: new Date() }, usedCount: { lt: grant.maxUses }, entitlement: { status: 'ACTIVE', order: { status: 'PAID' } } }, data: { usedCount: { increment: 1 } } });
      if (consumed.count !== 1) throw new CommerceError('Download link expired.', 410);
      const validUntil = Date.now() + 60000;
      const signed = await issueSignedToken({ token, pathname: resource.pathname, operations: ['get'], validUntil });
      const { presignedUrl } = await presignUrl(signed, { access: 'private', operation: 'get', pathname: resource.pathname, validUntil });
      await prisma.commerceDownload.create({ data: { resourceId: resource.id, userId: grant.entitlement.order.userId || `guest:${tokenHash(grant.entitlement.order.customerEmail)}` } });
      return ok({ url: presignedUrl });
    }
    throw new CommerceError('Not found.', 404);
  } catch (error) { return errorResponse(error); }
}
