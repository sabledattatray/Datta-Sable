import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export class CommerceError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const productInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  title: z.string().trim().min(5).max(180), excerpt: z.string().trim().min(10).max(600),
  description: z.string().trim().min(20).max(30000), category: z.string().trim().min(1).max(100),
  image: z.string().max(1000).refine(v => !v || /^\/[^/]/.test(v) || (/^https:\/\//.test(v) && (() => { try { const host = new URL(v).hostname; return host === 'images.unsplash.com' || host.endsWith('.public.blob.vercel-storage.com'); } catch { return false; } })())).nullable().optional(),
  priceMinor: z.number().int().positive().max(100000000), currency: z.enum(['USD', 'INR']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']), salesEnabled: z.boolean(), deliveryReady: z.boolean(),
  features: z.array(z.string().trim().min(1).max(300)).max(30),
  includedResources: z.array(z.string().trim().min(1).max(300)).max(30),
  deliveryMethod: z.literal('ACCOUNT_DOWNLOAD'),
  seoTitle: z.string().max(180).nullable().optional(), seoDescription: z.string().max(300).nullable().optional(),
});
export function validSignature(message: string, signature: string, secret: string) {
  if (!secret || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(message).digest();
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}
export function assertCaptured(payment: { id: string; order_id: string; amount: number | string; currency: string; status: string }, order: { razorpayOrderId: string | null; totalMinor: number; currency: string }) {
  if (payment.order_id !== order.razorpayOrderId || Number(payment.amount) !== order.totalMinor || payment.currency !== order.currency) throw new CommerceError('Payment details do not match this order.', 409);
  if (payment.status !== 'captured') throw new CommerceError('Payment is still processing.', 202);
}
export function money(minor: number, currency: string) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(minor / 100); }
export function retryAt(attempts: number, now = Date.now()) { return new Date(now + Math.min(3600000, 30000 * 2 ** Math.min(attempts, 7))); }
export function resourceFormat(filename: string, bytes: Buffer) {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (bytes.length < 5 || bytes.length > 4 * 1024 * 1024) throw new CommerceError('Resources must be between 5 bytes and 4 MB.');
  if (extension === 'pdf' && bytes.subarray(0, 5).toString() === '%PDF-') return { extension, contentType: 'application/pdf' };
  if (['zip', 'xlsx'].includes(extension || '') && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return { extension: extension!, contentType: extension === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/zip' };
  throw new CommerceError('Upload a PDF, ZIP bundle, or XLSX workbook with matching file content.');
}
export const dp700Draft = {
  slug: 'dp-700-study-package', title: 'DP-700 Microsoft Fabric Data Engineer Self-Study Package',
  excerpt: 'A planned 12-week self-study preparation package for Microsoft DP-700.',
  description: 'A structured 12-week self-study preparation package for professionals preparing for Microsoft DP-700. Materials are in preparation and are not yet available. The certification examination fee is not included. This is independent training, not affiliated with or endorsed by Microsoft.',
  category: 'Microsoft Fabric', priceMinor: 4900, currency: 'USD', status: 'DRAFT', salesEnabled: false, deliveryReady: false,
  features: ['Complete 12-week learning roadmap', 'Structured study notes', 'Curated Microsoft Learn resources', 'Lakehouse and Warehouse exercises', 'Data Factory and Dataflows Gen2 exercises', 'Spark, PySpark and Delta Lake exercises', 'Monitoring and optimization guidance', 'Original practice questions', 'Weekly progress checklists', 'Final exam preparation resources'],
  includedResources: ['Planned study notes', 'Planned original exercises', 'Planned progress checklists'], deliveryMethod: 'ACCOUNT_DOWNLOAD',
};
