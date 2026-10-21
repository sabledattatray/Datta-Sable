import type { Metadata } from 'next';
import Link from 'next/link';
import StoreShell from '@/components/commerce/StoreShell';
export const metadata: Metadata = { title: 'Checkout incomplete', robots: { index: false, follow: false } };
export default function FailedPage() { return <StoreShell><h1>Checkout was not completed.</h1><p>If your bank shows a debit, check your order before trying again. A closed browser does not determine payment status.</p><Link href="/account/orders">Review My Orders →</Link></StoreShell>; }
