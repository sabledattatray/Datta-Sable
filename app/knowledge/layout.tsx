import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Surgical Knowledge Hub | Datta Sable',
    default: 'Surgical Knowledge Hub | Technical AI & Creator Guides | Datta Sable',
  },
  description: 'Deep technical guides on AI prompt architecture, execution chains, data engineering patterns, and creator infrastructure. The knowledge base behind the Surgical AI system.',
  openGraph: {
    title: 'Surgical Knowledge Hub | Technical AI & Creator Guides | Datta Sable',
    description: 'Deep technical guides on AI prompt architecture, execution chains, data engineering, and creator infrastructure.',
    url: 'https://dattasable.com/knowledge',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Surgical Knowledge Hub - Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surgical Knowledge Hub | Technical AI & Creator Guides',
    description: 'Deep technical guides on AI, prompt architecture, execution chains, and data engineering.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/knowledge' },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
