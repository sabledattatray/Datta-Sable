import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | AI Workflow Glossary | Datta Sable',
    default: 'AI Workflow Glossary | Prompting, Agents & Data Terms | Datta Sable',
  },
  description: 'Definitive glossary of AI workflow, prompt engineering, data engineering, and BI terms. Plain-language definitions for technical professionals and creators.',
  openGraph: {
    title: 'AI Workflow Glossary | Prompting, Agents & Data Terms | Datta Sable',
    description: 'Definitive glossary of AI workflow, prompt engineering, data engineering, and BI terms.',
    url: 'https://dattasable.com/glossary',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'AI Workflow Glossary - Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Workflow Glossary | Prompting, Agents & Data Terms',
    description: 'Plain-language definitions for AI workflow, prompt engineering, data engineering, and BI terms.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/glossary' },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
