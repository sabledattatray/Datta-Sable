import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue Intelligence Dashboard — Enterprise Financial Analytics | Datta Sable',
  description:
    'Interactive enterprise revenue intelligence dashboard with real-time financial analytics. Monitor MRR, ARR, churn, customer lifetime value, revenue by segment, and growth trends powered by advanced BI.',
  keywords: ['revenue intelligence dashboard', 'enterprise revenue analytics', 'MRR ARR dashboard', 'financial analytics BI', 'SaaS revenue dashboard', 'revenue tracking tool'],
  alternates: { canonical: 'https://dattasable.com/dashboards/revenue-intelligence' },
  openGraph: {
    title: 'Revenue Intelligence Dashboard — Enterprise Financial Analytics',
    description: 'Real-time enterprise revenue analytics: MRR, ARR, churn, CLV, and growth trends in an interactive BI dashboard.',
    url: 'https://dattasable.com/dashboards/revenue-intelligence',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
