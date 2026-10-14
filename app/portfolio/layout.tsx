import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MIS & Power BI Portfolio | Excel Dashboards & Business Reporting — Datta Sable',
  description:
    "Explore Datta Sable's MIS reporting, Advanced Excel, Power BI dashboards, SQL analysis, and business reporting projects. View demonstrable case studies and enquire about a reporting solution.",
  keywords: [
    'MIS reporting portfolio',
    'Power BI dashboard developer',
    'Advanced Excel reporting automation',
    'SQL reporting analyst',
    'delinquency aging dashboard',
    'sales velocity Power BI',
    'financial close Excel model',
    'Datta Sable portfolio',
    'business intelligence Mumbai',
  ],
  alternates: { canonical: 'https://dattasable.com/portfolio' },
  openGraph: {
    type: 'website',
    title: 'MIS & Power BI Portfolio | Excel Dashboards & Business Reporting — Datta Sable',
    description:
      'Explore demonstrable projects in Advanced Excel, Power BI, SQL Server, and portfolio risk management by MIS Manager Datta Sable.',
    url: 'https://dattasable.com/portfolio',
    images: [{ url: 'https://dattasable.com/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable — MIS & Power BI Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIS & Power BI Portfolio — Datta Sable',
    description: 'Practical work in Advanced Excel, Power BI, SQL reporting, and business performance analysis.',
    images: ['https://dattasable.com/images/dattasable.com.webp'],
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
