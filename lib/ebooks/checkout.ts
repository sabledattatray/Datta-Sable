import { assertCheckout } from '@/lib/commerce/config';
import { ebookEnabled, ebookPaymentMode, ebookLiveWebhookReady } from './validation';

export function ebookCheckoutReady() {
  if (!ebookEnabled()) return false;
  if (ebookPaymentMode() === 'live' && (
    process.env.EBOOK_LIVE_CHECKOUT_APPROVED !== 'true' ||
    !process.env.COMMERCE_BLOB_READ_WRITE_TOKEN || !ebookLiveWebhookReady()
  )) return false;
  try { assertCheckout(ebookPaymentMode()); return true; } catch { return false; }
}
