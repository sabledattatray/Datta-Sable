import type { Metadata } from 'next';

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
  return children;
}
