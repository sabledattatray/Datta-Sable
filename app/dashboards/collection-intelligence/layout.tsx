import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection Intelligence Dashboard — EMI & Debt Recovery Analytics | Datta Sable',
  description:
    'Interactive EMI collection and debt recovery analytics dashboard. Track collection efficiency, recovery rates, agent performance, bucket-wise analysis, and delinquency trends across loan portfolios.',
  keywords: ['collection intelligence dashboard', 'EMI analytics', 'debt recovery dashboard', 'loan portfolio analytics', 'collection efficiency BI', 'NBFC analytics'],
  alternates: { canonical: 'https://dattasable.com/dashboards/collection-intelligence' },
  openGraph: {
    title: 'Collection Intelligence Dashboard — EMI & Debt Recovery Analytics',
    description: 'Track EMI collection efficiency, recovery rates, agent performance, and delinquency trends in this interactive analytics dashboard.',
    url: 'https://dattasable.com/dashboards/collection-intelligence',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
