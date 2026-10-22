import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dashboard Gallery — Interactive BI & Excel Projects',
  description: 'Explore Datta Sable’s interactive dashboard demonstrations, downloadable Excel project models, and clearly credited visualization references. Filter by industry and tool.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://dattasable.com/dashboards' },
};
export default function DashboardsLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
