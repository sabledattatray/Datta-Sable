import Razorpay from 'razorpay';
import { z } from 'zod';
import { CommerceError } from './shared';

// This release deliberately has no live-payment activation path.
export function paymentConfig() {
  const key = process.env.RAZORPAY_KEY_ID || '', secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key.startsWith('rzp_test_') || !secret) throw new CommerceError('Razorpay test credentials are not configured. Live payments are disabled.', 503);
  return { key, secret };
}
export function provider() { const { key, secret } = paymentConfig(); return new Razorpay({ key_id: key, key_secret: secret }); }
export async function providerCall<T>(request: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([request, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new CommerceError('Provider response timed out; reconcile before retrying.', 503)), 10000);
    })]);
  } finally { if (timer) clearTimeout(timer); }
}
export function assertCheckout() {
  paymentConfig();
  if (process.env.COMMERCE_TEST_CHECKOUT_ENABLED !== 'true') throw new CommerceError('Checkout is not enabled.', 503);
  if (process.env.COMMERCE_SENDER_VERIFIED !== 'true' || !z.string().email().safeParse(process.env.COMMERCE_ADMIN_EMAIL).success) throw new CommerceError('Transactional email setup is incomplete.', 503);
  if (process.env.COMMERCE_POLICIES_APPROVED !== 'true') throw new CommerceError('Purchase policies are awaiting approval.', 503);
}
// Admin diagnostics expose presence/validity only, never environment values.
export function checkoutConfigurationChecks() {
  return [
    { key: 'RAZORPAY_TEST_KEYS', label: 'Razorpay test credentials', ready: Boolean(process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && process.env.RAZORPAY_KEY_SECRET) },
    { key: 'COMMERCE_TEST_CHECKOUT_ENABLED', label: 'Test checkout enabled', ready: process.env.COMMERCE_TEST_CHECKOUT_ENABLED === 'true' },
    { key: 'COMMERCE_SENDER_VERIFIED', label: 'Receipt sender verified', ready: process.env.COMMERCE_SENDER_VERIFIED === 'true' },
    { key: 'COMMERCE_ADMIN_EMAIL', label: 'Admin receipt email', ready: z.string().email().safeParse(process.env.COMMERCE_ADMIN_EMAIL).success },
    { key: 'COMMERCE_POLICIES_APPROVED', label: 'Purchase policies approved', ready: process.env.COMMERCE_POLICIES_APPROVED === 'true' },
    { key: 'COMMERCE_BLOB_READ_WRITE_TOKEN', label: 'Private storage configured', ready: Boolean(process.env.COMMERCE_BLOB_READ_WRITE_TOKEN && process.env.COMMERCE_BLOB_READ_WRITE_TOKEN !== 'your_private_store_token') },
    { key: 'RAZORPAY_WEBHOOK_SECRET', label: 'Webhook secret configured', ready: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET) },
    { key: 'CRON_SECRET', label: 'Recovery worker authentication', ready: Boolean(process.env.CRON_SECRET) },
  ];
}
export function siteUrl() {
  const url = new URL(process.env.COMMERCE_SITE_URL || process.env.NEXTAUTH_URL || 'https://dattasable.com');
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new CommerceError('A secure site URL is required.', 503);
  return url.origin;
}
