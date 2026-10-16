import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'BI ROI Calculator — Measure the Value of Business Intelligence | Datta Sable',
  description:
    'Free BI ROI Calculator by Datta Sable. Quantify the financial return of your Business Intelligence investments. Input team size, salary, manual hours, and error rates to calculate annual savings, hours reclaimed, and ROI percentage.',
  keywords: ['BI ROI calculator', 'business intelligence ROI', 'data analytics ROI', 'BI investment calculator', 'analytics value calculator'],
  alternates: { canonical: 'https://dattasable.com/tools/bi-roi-calculator' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'BI ROI Calculator — Measure the Value of Business Intelligence',
    description: 'Quantify the financial return of your BI investments. Free calculator by Datta Sable.',
    url: 'https://dattasable.com/tools/bi-roi-calculator',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "BI ROI Calculator",
        "description": "Quantify the financial return of Business Intelligence investments. Calculate annual savings, hours reclaimed, and ROI percentage.",
        "url": "https://dattasable.com/tools/bi-roi-calculator",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "ROI Percentage Calculation",
          "Annual Savings Estimate",
          "Hours Reclaimed Analysis",
          "Team Size & Salary Inputs",
          "Manual Hours & Error Rate Modelling"
        ],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "author": { "@id": "https://dattasable.com/#person" },
        "publisher": { "@id": "https://dattasable.com/#organization" },
        "isPartOf": { "@id": "https://dattasable.com/#website" }
      }} />
      {children}
    </>
  );
}
