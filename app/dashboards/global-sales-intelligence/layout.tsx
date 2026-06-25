import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Sales Intelligence Dashboard — International Revenue Analytics | Datta Sable',
  description:
    'Interactive global sales intelligence dashboard tracking international revenue performance, regional market share, cross-border deal analytics, currency-adjusted growth metrics, and territory-level KPIs.',
  keywords: ['global sales dashboard', 'international revenue analytics', 'global BI dashboard', 'sales intelligence tool', 'territory analytics', 'cross-border sales BI'],
  alternates: { canonical: 'https://dattasable.com/dashboards/global-sales-intelligence' },
  openGraph: {
    title: 'Global Sales Intelligence Dashboard — International Revenue Analytics',
    description: 'Track international revenue, regional market share, cross-border deals, and territory KPIs in this interactive global analytics dashboard.',
    url: 'https://dattasable.com/dashboards/global-sales-intelligence',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
