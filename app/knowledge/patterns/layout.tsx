import type { Metadata } from 'next';
// Brief internal references remain available to visitors while editorial work continues.
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default function ReferenceLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
