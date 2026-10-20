import type { Metadata } from 'next';
export const metadata: Metadata = {
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://dattasable.com/dashboards' },
};
export default function DashboardsLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
