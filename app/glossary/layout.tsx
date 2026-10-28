import WorkspaceFrame from '@/components/WorkspaceFrame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI & Data Engineering Glossary | Datta Sable',
  description: 'Technical definitions and architectural patterns for Power BI, Microsoft Fabric, SQL, machine learning, and automation workflows.',
  alternates: {
    canonical: 'https://dattasable.com/glossary',
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI & Data Engineering Glossary | Datta Sable',
    description: 'Technical definitions and architectural patterns for Power BI, Microsoft Fabric, SQL, and analytics workflows.',
    url: 'https://dattasable.com/glossary',
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceFrame>{children}</WorkspaceFrame>;
}
