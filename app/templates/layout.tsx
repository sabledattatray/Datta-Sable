import WorkspaceFrame from '@/components/WorkspaceFrame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Templates & Automation Blueprints | Datta Sable',
  description: 'Production-ready technical blueprints, n8n orchestrations, Python data cleaners, and structured data schemas for enterprise workflows.',
  alternates: {
    canonical: 'https://dattasable.com/templates',
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Technical Templates & Automation Blueprints | Datta Sable',
    description: 'Production-ready technical blueprints and automation schemas for enterprise workflows.',
    url: 'https://dattasable.com/templates',
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceFrame>{children}</WorkspaceFrame>;
}
