import React from 'react';
import { Metadata } from 'next';
import { EXCEL_PROJECTS } from '@/data/excelProjects';
import ExcelProjectShowcase from '@/components/ExcelProjectShowcase';

export const metadata: Metadata = {
  title: 'Aura Capital & FinTech Group — Executive Sales Dashboard | Advanced Excel BI Project | Datta Sable',
  description:
    'Institutional FinTech commercial performance dashboard engineered in Microsoft Excel. Features dynamic multi-region slicers, gross profit analysis, and 1,036 sample transaction records. Available for direct .xlsx download.',
  keywords: [
    'Excel Dashboard',
    'FinTech BI Project',
    'Financial Modeling',
    'Aura Capital',
    'Advanced Excel',
    'Datta Sable',
    'Downloadable Excel Model',
    'Sales Analytics',
  ],
  openGraph: {
    title: 'Aura Capital & FinTech Group — Executive Sales Dashboard | Datta Sable',
    description:
      'Institutional FinTech commercial sales intelligence dashboard in Microsoft Excel with interactive regional slicers, run-rate tables, and sample transaction data. Download .xlsx file.',
    url: 'https://dattasable.com/dashboards/aura-capital-sales',
    siteName: 'Datta Sable — BI Expert & Enterprise Architect',
    type: 'article',
  },
};

export default function AuraCapitalSalesDashboardPage() {
  const project = EXCEL_PROJECTS.find((p) => p.slug === 'aura-capital-sales') || EXCEL_PROJECTS[0];
  return <ExcelProjectShowcase project={project} />;
}
