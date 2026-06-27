import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Schema Generator — Create JSON-LD Structured Data for SEO | Datta Sable',
  description:
    'Free Schema Generator by Datta Sable. Generate valid JSON-LD structured data markup for Articles, FAQs, How-To guides, Breadcrumbs, and more. Improve your Google rich results and click-through rates instantly.',
  keywords: ['schema generator', 'JSON-LD generator', 'structured data tool', 'schema markup', 'rich results generator', 'SEO schema tool'],
  alternates: { canonical: 'https://dattasable.com/tools/schema-generator' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Schema Generator — Create JSON-LD Structured Data for SEO',
    description: 'Generate valid JSON-LD schema markup for Articles, FAQs, How-To guides and more. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/schema-generator',
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
        "name": "JSON-LD Schema Forge",
        "description": "Generate valid JSON-LD structured data markup for Articles, FAQs, How-To guides, Breadcrumbs, and more to improve Google rich results.",
        "url": "https://dattasable.com/tools/schema-generator",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Article Schema Generation",
          "FAQ Schema Generation",
          "How-To Schema Generation",
          "BreadcrumbList Schema",
          "JSON-LD Validation",
          "Copy to Clipboard"
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
