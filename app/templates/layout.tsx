import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Surgical AI Blueprint | Datta Sable',
    default: 'Surgical AI Blueprints & Templates | Datta Sable',
  },
  description: 'Production-ready AI prompt templates, content blueprints, and system prompts for creators, developers, and data professionals. Copy, deploy, and iterate.',
  openGraph: {
    title: 'Surgical AI Blueprints & Templates | Datta Sable',
    description: 'Production-ready AI prompt templates, content blueprints, and system prompts. Copy, deploy, and iterate.',
    url: 'https://dattasable.com/templates',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Surgical AI Blueprints - Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surgical AI Blueprints & Templates | Datta Sable',
    description: 'Production-ready AI templates and blueprints for creators, developers, and data professionals.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/templates' },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
