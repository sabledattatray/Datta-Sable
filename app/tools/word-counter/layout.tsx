import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Word Counter — Count Words, Characters & Reading Time | Datta Sable',
  description:
    'Free Word Counter by Datta Sable. Instantly count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time. Perfect for blog posts, LinkedIn articles, essays, and SEO content.',
  keywords: ['word counter', 'character counter', 'reading time calculator', 'word count tool', 'text analyzer', 'free word counter'],
  alternates: { canonical: 'https://dattasable.com/tools/word-counter' },
  openGraph: {
    title: 'Word Counter — Count Words, Characters & Reading Time',
    description: 'Count words, characters, sentences and get estimated reading time instantly. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/word-counter',
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
        "name": "Precision Word Counter",
        "description": "Instantly count words, characters, sentences, paragraphs, and estimated reading time for any content.",
        "url": "https://dattasable.com/tools/word-counter",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Word Count",
          "Character Count (with & without spaces)",
          "Sentence & Paragraph Count",
          "Reading Time Estimation",
          "Readability Score"
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
