import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BI ROI Calculator — Measure the Value of Business Intelligence | Datta Sable',
  description:
    'Free BI ROI Calculator by Datta Sable. Quantify the financial return of your Business Intelligence investments. Input team size, salary, manual hours, and error rates to calculate annual savings, hours reclaimed, and ROI percentage.',
  keywords: ['BI ROI calculator', 'business intelligence ROI', 'data analytics ROI', 'BI investment calculator', 'analytics value calculator'],
  alternates: { canonical: 'https://dattasable.com/tools/bi-roi-calculator' },
  openGraph: {
    title: 'BI ROI Calculator — Measure the Value of Business Intelligence',
    description: 'Quantify the financial return of your BI investments. Free calculator by Datta Sable.',
    url: 'https://dattasable.com/tools/bi-roi-calculator',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
