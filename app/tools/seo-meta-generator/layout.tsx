import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'SEO Meta Generator — Create Titles, Descriptions & Schema | Datta Sable',
  description:
    'Free SEO Meta Generator by Datta Sable. Generate SEO-optimized titles, meta descriptions, and JSON-LD schema in one click. Built for bloggers, developers, and content creators targeting Google rich results.',
  keywords: ['SEO meta generator', 'meta description generator', 'title tag generator', 'JSON-LD generator', 'SEO tool', 'structured data generator'],
  alternates: { canonical: 'https://dattasable.com/tools/seo-meta-generator' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'SEO Meta Generator — Create Titles, Descriptions & Schema',
    description: 'Generate SEO-optimized titles, meta descriptions, and JSON-LD schema in one click. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/seo-meta-generator',
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
        "name": "Meta-Force SEO Generator",
        "description": "Generate SEO-optimized titles, meta descriptions, and JSON-LD schema in one click for Google rich results.",
        "url": "https://dattasable.com/tools/seo-meta-generator",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Title Tag Generation",
          "Meta Description Generation",
          "JSON-LD Schema Output",
          "Google Rich Results Preview",
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
