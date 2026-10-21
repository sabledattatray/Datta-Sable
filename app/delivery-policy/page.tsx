import type { Metadata } from 'next';
import PurchasePolicy from '@/components/commerce/PurchasePolicy';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Digital product delivery policy', robots: { index: false, follow: true } };
export default function Page() { return <PurchasePolicy slug="delivery-policy" title="Digital product delivery policy" />; }
