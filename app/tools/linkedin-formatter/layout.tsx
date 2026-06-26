import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'LinkedIn Formatter — Write Viral LinkedIn Posts That Get Engagement | Datta Sable',
  description:
    'Free LinkedIn Formatter by Datta Sable. Format your LinkedIn posts for maximum readability and engagement. Add line breaks, emojis, hooks, and CTAs. Choose from proven post templates for data, tech, and career content.',
  keywords: ['LinkedIn formatter', 'LinkedIn post formatter', 'LinkedIn content tool', 'LinkedIn post generator', 'LinkedIn writing tool', 'viral LinkedIn posts'],
  alternates: { canonical: 'https://dattasable.com/tools/linkedin-formatter' },
  openGraph: {
    title: 'LinkedIn Formatter — Write Viral LinkedIn Posts That Get Engagement',
    description: 'Format LinkedIn posts for maximum readability and engagement. Free tool with proven templates by Datta Sable.',
    url: 'https://dattasable.com/tools/linkedin-formatter',
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
        "name": "LinkedIn Authority Formatter",
        "description": "Format LinkedIn posts for maximum readability and engagement. Add hooks, line breaks, emojis, and CTAs using proven templates.",
        "url": "https://dattasable.com/tools/linkedin-formatter",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "LinkedIn Post Formatting",
          "Hook & CTA Templates",
          "Emoji & Line Break Insertion",
          "Engagement Optimization",
          "Copy to Clipboard",
          "Data & Tech Post Templates"
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
