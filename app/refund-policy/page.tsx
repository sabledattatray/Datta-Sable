import type { Metadata } from 'next';
import PurchasePolicy from '@/components/commerce/PurchasePolicy';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Refund policy', robots: { index: false, follow: true } };
export default function Page() { return <PurchasePolicy slug="refund-policy" title="Refund policy" />; }
