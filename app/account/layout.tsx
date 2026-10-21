import type { Metadata } from 'next';
import StoreShell from '@/components/commerce/StoreShell';
export const metadata: Metadata = { title: 'Your purchases', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default function AccountLayout({ children }: { children: React.ReactNode }) { return <StoreShell>{children}</StoreShell>; }
