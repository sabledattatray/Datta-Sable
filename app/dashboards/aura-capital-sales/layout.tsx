import WorkspaceFrame from '@/components/WorkspaceFrame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aura Capital & FinTech Group — Executive Sales Dashboard | Advanced Excel BI Project',
  description:
    'Explore the interactive FinTech commercial intelligence model for Aura Capital & FinTech Group ($15.95M gross volume, 1,037 sample transactions). Download the master Excel workbook (.xlsx).',
  alternates: { canonical: 'https://dattasable.com/dashboards/aura-capital-sales' },
  openGraph: {
    title: 'Aura Capital FinTech Executive Sales Dashboard | Advanced Excel Model',
    description:
      'Interactive enterprise financial run-rate, regional quota attainment, channel mix, and sample transaction ledger. Download complete Excel (.xlsx).',
    url: 'https://dattasable.com/dashboards/aura-capital-sales',
    type: 'website',
  },
};

export default function AuraCapitalLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceFrame>{children}</WorkspaceFrame>;
}
