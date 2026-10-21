import { z } from 'zod';

export const independentEducationalDisclaimer = [
  'This study package is independently developed and published by Datta Sable for educational and exam preparation purposes.',
  'Microsoft, Microsoft Fabric, and related product names are trademarks of Microsoft Corporation.',
  'This product is not affiliated with, endorsed by, sponsored by, or officially approved by Microsoft.',
  'All practice questions, explanations, examples, and exercises are independently developed and do not reproduce actual Microsoft certification examination content.',
  'Purchase of this resource does not include an examination voucher, official certification, or guarantee of passing any Microsoft examination.',
];

const list = z.array(z.string().trim().min(1).max(300)).max(30).default([]);
const publicAsset = z.string().max(1000).refine(value => !value || /^\/(?!\/)[^\\]*$/.test(value) || (() => {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && (u.hostname === 'images.unsplash.com' || u.hostname.endsWith('.public.blob.vercel-storage.com')); } catch { return false; }
})());
export const productDetailsSchema = z.object({
  readiness: z.enum(['TEST_ONLY', 'COMING_SOON', 'READY_FOR_SALE']).default('TEST_ONLY'),
  technologies: list, productType: z.string().trim().max(100).default(''),
  version: z.string().trim().max(80).default(''), prerequisites: list, audience: list, outcomes: list,
  license: z.string().trim().max(2000).default(''), updatePolicy: z.string().trim().max(1000).default(''),
  previewUrl: publicAsset.default(''), gallery: z.array(publicAsset).max(6).default([]),
  faqs: z.array(z.object({ question: z.string().trim().min(1).max(200), answer: z.string().trim().min(1).max(2000) })).max(12).default([]),
});
export type ProductDetails = z.infer<typeof productDetailsSchema>;
export const defaultProductDetails = (): ProductDetails => productDetailsSchema.parse({});
export function parseProductDetails(value: unknown): ProductDetails {
  try { return productDetailsSchema.parse(typeof value === 'string' ? JSON.parse(value) : value || {}); } catch { return defaultProductDetails(); }
}
export type PublicResource = { id: string; title: string; format: string };
export type ProductSafety = { status: string; salesEnabled: boolean; deliveryReady: boolean; excerpt: string; resources?: { title: string }[] };
export function productReadiness(product: ProductSafety, details: ProductDetails) {
  if (details.readiness === 'TEST_ONLY' || /test[ -]only|dummy/i.test(product.excerpt) || product.resources?.some(r => /test[ -]only|dummy/i.test(r.title))) return 'TEST_ONLY' as const;
  if (details.readiness === 'READY_FOR_SALE' && product.status === 'PUBLISHED' && product.salesEnabled && product.deliveryReady && !!product.resources?.length) return 'READY_FOR_SALE' as const;
  return 'COMING_SOON' as const;
}
export function resourceFormatLabel(pathname: string) {
  const ext = pathname.split('.').pop()?.toLowerCase();
  return ['pdf', 'zip', 'xlsx', 'csv', 'sql', 'pbix', 'ipynb'].includes(ext || '') ? ext!.toUpperCase() : 'File';
}
export function safeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
