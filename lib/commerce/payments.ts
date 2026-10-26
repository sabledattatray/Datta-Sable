import type { Refunds } from 'razorpay/dist/types/refunds';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { assertCheckout, paymentConfig, provider, providerCall } from './config';
import { assertCaptured, CommerceError, validSignature } from './shared';

export async function transaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(work, { isolationLevel: 'Serializable', timeout: 15000 }); }
    catch (error) { if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2034' || attempt >= 3) throw error; }
  }
}
export async function initiate(user: { id: string | null; email: string | null; name: string | null }, productId: string, requestKey: string, checkoutMode?: 'test' | 'live') {
  assertCheckout(checkoutMode);
  const policies = await prisma.page.count({ where: { slug: { in: ['refund-policy', 'delivery-policy'] }, published: true } });
  if (policies !== 2) throw new CommerceError('Approved purchase policies must be published before checkout.', 503);
  const existing = await prisma.commerceOrder.findUnique({ where: { requestKey }, include: { items: true } });
  if (existing) {
    if (existing.userId !== user.id || existing.customerEmail !== user.email || existing.items[0]?.productId !== productId) throw new CommerceError('Checkout request conflict.', 409);
    if (checkoutMode && existing.mode !== checkoutMode) throw new CommerceError('This pending order uses another payment mode. Review it before starting a new payment.', 409);
    const currentProduct = await prisma.commerceProduct.findUnique({ where: { id: productId }, include: { resources: { where: { active: true } } } });
    if (!currentProduct || currentProduct.status !== 'PUBLISHED' || !currentProduct.salesEnabled || !currentProduct.deliveryReady || !currentProduct.resources.length) throw new CommerceError('This product is not available for purchase.', 409);
    if (!(process.env.COMMERCE_APPROVED_CURRENCIES || '').split(',').map(c => c.trim()).includes(existing.currency)) throw new CommerceError('Checkout currency is awaiting account confirmation.', 503);
    if (existing.status !== 'PENDING') throw new CommerceError('This order has already been processed.', 409);
    if (!existing.razorpayOrderId) throw new CommerceError('Order creation needs review. Do not pay again; contact support with your order number.', 409);
    return existing;
  }
  const order = await transaction(async tx => {
    // Shared fixed-window quota, not per-instance memory.
    const key = `checkout:${user.id || user.email}:${Math.floor(Date.now() / 60000)}`;
    const limit = await tx.commerceLimit.upsert({ where: { key }, create: { key, expiresAt: new Date(Date.now() + 120000) }, update: { count: { increment: 1 } } });
    if (limit.count > 5) throw new CommerceError('Too many checkout attempts. Please wait a minute.', 429);
    const product = await tx.commerceProduct.findUnique({ where: { id: productId }, include: { resources: { where: { active: true } } } });
    if (!product || product.status !== 'PUBLISHED' || !product.salesEnabled || !product.deliveryReady || !product.resources.length) throw new CommerceError('This product is not available for purchase.', 409);
    const approved = (process.env.COMMERCE_APPROVED_CURRENCIES || '').split(',').map(c => c.trim());
    if (!approved.includes(product.currency)) throw new CommerceError('Checkout currency is awaiting account confirmation.', 503);
    // Both account and guest identities have verified email ownership. Avoid a
    // second purchase when a guest later signs in with the same address.
    const ownership = { customerEmail: user.email! };
    if (await tx.commerceEntitlement.findFirst({ where: { productId, status: 'ACTIVE', order: ownership } })) throw new CommerceError('You already own this product. Open your library.', 409);
    if (await tx.commerceOrder.findFirst({ where: { ...ownership, status: 'PENDING', items: { some: { productId } } } })) throw new CommerceError('A pending order already exists. Resume or reconcile it from your library before starting another.', 409);
    const mode = checkoutMode || (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live' : 'test');
    return tx.commerceOrder.create({ data: {
      number: `DS-${new Date().getUTCFullYear()}-${randomUUID()}`, userId: user.id, customerEmail: user.email!, customerName: user.name || 'Customer', requestKey,
      mode,
      totalMinor: product.priceMinor, currency: product.currency, displayedMinor: product.priceMinor, displayedCurrency: product.currency,
      items: { create: { productId, title: product.title, unitPriceMinor: product.priceMinor, currency: product.currency, resourceIdSnapshot: product.resources[0]?.id } },
    } });
  });
  try {
    const remote = await providerCall(provider(order.mode === 'live' ? 'live' : 'test').orders.create({ amount: order.totalMinor, currency: order.currency, receipt: order.id, notes: { internalOrderId: order.id } }));
    if (Number(remote.amount) !== order.totalMinor || remote.currency !== order.currency) throw new Error('Provider order mismatch');
    return await prisma.commerceOrder.update({ where: { id: order.id }, data: { razorpayOrderId: remote.id } });
  } catch {
    await prisma.commerceOrder.update({ where: { id: order.id }, data: { lastError: 'Provider order creation was not confirmed. Reconcile before retrying.' } });
    throw new CommerceError('Order creation could not be confirmed. Contact support before trying another purchase.', 503);
  }
}

export async function verifyCallback(orderId: string, userId: string | null, paymentId: string, razorpayOrderId: string, signature: string) {
  const order = await prisma.commerceOrder.findFirst({ where: { id: orderId, userId } });
  if (!order || order.razorpayOrderId !== razorpayOrderId) throw new CommerceError('Order not found.', 404);
  if (!validSignature(`${order.razorpayOrderId}|${paymentId}`, signature, paymentConfig(order.mode === 'live' ? 'live' : 'test').secret)) throw new CommerceError('Invalid payment signature.', 400);
  await reconcilePayment(paymentId, order.id);
  return order.id;
}

export async function reconcilePayment(paymentId: string, expectedOrderId?: string, webhookMode?: 'test' | 'live') {
  const knownPayment = await prisma.commercePayment.findUnique({ where: { providerId: paymentId } });
  const knownOrder = expectedOrderId || knownPayment?.orderId ? await prisma.commerceOrder.findUnique({ where: { id: expectedOrderId || knownPayment!.orderId } }) : null;
  if (knownOrder && webhookMode && knownOrder.mode !== webhookMode) throw new CommerceError('Webhook payment mode does not match the order.', 409);
  const mode = knownOrder?.mode === 'live' ? 'live' : knownOrder ? 'test' : webhookMode || (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live' : 'test');
  const payment = await providerCall(provider(mode).payments.fetch(paymentId));
  const order = await prisma.commerceOrder.findUnique({ where: { razorpayOrderId: payment.order_id || '' }, include: { items: true } });
  if (!order || order.mode !== mode) throw new CommerceError('Payment order not found in this payment mode.', 404);
  if (expectedOrderId && order.id !== expectedOrderId) throw new CommerceError('Payment belongs to another order.', 409);
  if (Number(payment.amount) !== order.totalMinor || payment.currency !== order.currency) throw new CommerceError('Payment amount or currency mismatch.', 409);
  if (payment.status === 'failed') {
    await prisma.commercePayment.upsert({ where: { providerId: payment.id }, create: { orderId: order.id, providerId: payment.id, amountMinor: Number(payment.amount), currency: payment.currency, status: 'FAILED', method: payment.method }, update: {} });
    return;
  }
  if (payment.status !== 'captured' && payment.status !== 'refunded') throw new CommerceError('Payment is still processing.', 202);
  if (payment.status === 'captured') assertCaptured(payment, order);
  const remoteRefunds: Refunds.RazorpayRefund[] = [];
  for (let skip = 0; ; skip += 100) {
    const page = await providerCall(provider(mode).payments.fetchMultipleRefund(payment.id, { count: 100, skip }));
    remoteRefunds.push(...page.items);
    if (page.items.length < 100) break;
    if (skip >= 9900) throw new CommerceError('Refund history requires operator review.', 409);
  }
  const providerDate = new Date(Number(payment.created_at) * 1000);
  const paidAt = Number.isFinite(providerDate.getTime()) ? providerDate : new Date();
  await transaction(async tx => {
    const current = await tx.commerceOrder.findUniqueOrThrow({ where: { id: order.id } });
    const previousPayment = await tx.commercePayment.findUnique({ where: { providerId: payment.id } });
    const row = await tx.commercePayment.upsert({ where: { providerId: payment.id }, create: { orderId: order.id, providerId: payment.id, amountMinor: Number(payment.amount), currency: payment.currency, status: 'CAPTURED', method: payment.method, verifiedAt: new Date() }, update: { status: payment.status === 'refunded' || previousPayment?.status === 'REFUNDED' ? 'REFUNDED' : 'CAPTURED', verifiedAt: new Date() } });
    if (row.orderId !== order.id) throw new CommerceError('Payment ownership mismatch.', 409);
    for (const refund of remoteRefunds) {
      if (refund.receipt) await tx.commerceRefund.updateMany({ where: { id: refund.receipt, paymentId: row.id, providerId: null }, data: { providerId: refund.id, status: refund.status.toUpperCase() } });
      await tx.commerceRefund.upsert({ where: { providerId: refund.id }, create: { paymentId: row.id, providerId: refund.id, requestKey: `provider:${refund.id}`, amountMinor: Number(refund.amount), status: refund.status.toUpperCase(), reason: 'Provider reconciliation' }, update: { status: refund.status.toUpperCase() } });
      if (refund.status === 'processed') await tx.commerceEmail.upsert({ where: { dedupeKey: `refund:${refund.id}` }, create: { orderId: order.id, dedupeKey: `refund:${refund.id}`, kind: 'REFUND', recipient: order.customerEmail }, update: {} });
    }
    const processedRefundTotal = remoteRefunds.filter(r => r.status === 'processed').reduce((total, r) => total + Number(r.amount), 0);
    const fullRefund = processedRefundTotal >= order.totalMinor || (payment.status === 'refunded' && Number(payment.amount_refunded) >= order.totalMinor);
    if (fullRefund || current.status === 'REFUNDED') {
      await tx.commercePayment.update({ where: { id: row.id }, data: { status: 'REFUNDED' } });
      await tx.commerceOrder.update({ where: { id: order.id }, data: { status: 'REFUNDED', paidAt: current.paidAt || paidAt } });
      await tx.commerceEntitlement.updateMany({ where: { orderId: order.id }, data: { status: 'REVOKED', revokedAt: new Date() } });
      return;
    }
    await tx.commerceOrder.update({ where: { id: order.id }, data: { status: 'PAID', paidAt: current.paidAt || paidAt, lastError: null } });
    for (const item of order.items) await tx.commerceEntitlement.upsert({ where: { orderId_productId: { orderId: order.id, productId: item.productId } }, create: { orderId: order.id, productId: item.productId }, update: {} });
    await tx.commerceEmail.upsert({ where: { dedupeKey: `receipt:${order.id}` }, create: { orderId: order.id, dedupeKey: `receipt:${order.id}`, kind: 'RECEIPT', recipient: order.customerEmail }, update: {} });
    const admin = process.env.COMMERCE_ADMIN_EMAIL;
    if (admin) await tx.commerceEmail.upsert({ where: { dedupeKey: `admin:${order.id}` }, create: { orderId: order.id, dedupeKey: `admin:${order.id}`, kind: 'ADMIN', recipient: admin }, update: {} });
  });
}

export async function reconcileOrder(id: string) {
  const order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id } });
  if (!order.razorpayOrderId) throw new CommerceError('Provider order creation is ambiguous. Review Razorpay using the internal order ID; do not create another charge.', 409);
  const payments = await providerCall(provider(order.mode === 'live' ? 'live' : 'test').orders.fetchPayments(order.razorpayOrderId));
  for (const payment of payments.items) if (['captured', 'refunded', 'failed'].includes(payment.status)) await reconcilePayment(payment.id, order.id);
}
