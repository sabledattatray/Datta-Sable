import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Analytics Demo — Live BI Dashboard Playground | Datta Sable',
  description:
    'Explore an interactive live BI dashboard playground by Datta Sable. Experiment with data visualisations, filter controls, drill-through analytics, and real-time chart interactions in this hands-on analytics demo.',
  keywords: ['interactive BI demo', 'live analytics dashboard', 'BI playground', 'data visualisation demo', 'interactive charts', 'analytics prototype'],
  alternates: { canonical: 'https://dattasable.com/dashboards/interactive' },
  openGraph: {
    title: 'Interactive Analytics Demo — Live BI Dashboard Playground',
    description: 'Hands-on interactive BI dashboard playground with live charts, drill-through analytics, and real-time data visualisations.',
    url: 'https://dattasable.com/dashboards/interactive',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
