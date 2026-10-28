import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Open MIS — Interactive Executive MIS & Analytics Simulation Engine | Datta Sable',
  description:
    'Free executive MIS reporting and simulation tool by Datta Sable. Explore live corporate datasets, automated KPI modeling, revenue variance analysis, and audit trails.',
  keywords: ['MIS reporting tool', 'management information system', 'corporate analytics simulation', 'KPI reporting dashboard', 'business intelligence simulation'],
  alternates: { canonical: 'https://dattasable.com/tools/open-mis' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Open MIS — Executive Analytics & Reporting Engine | Datta Sable',
    description: 'Explore live corporate datasets, automated KPI modeling, and audit trails in browser.',
    url: 'https://dattasable.com/tools/open-mis',
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
        "name": "Open MIS",
        "description": "Executive MIS reporting and simulation tool featuring live corporate datasets, KPI modeling, and audit trails.",
        "url": "https://dattasable.com/tools/open-mis",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Live Corporate Dataset Exploration",
          "Automated KPI Calculations",
          "Revenue Variance Diagnostics",
          "Multi-Department Simulation",
          "Executive Export Ready Reports"
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
