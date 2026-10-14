import { Metadata } from 'next';
import PortfolioClientPage from './PortfolioClientPage';

export const metadata: Metadata = {
  title: 'MIS & Power BI Portfolio | Excel Dashboards & Business Reporting — Datta Sable',
  description:
    "Explore Datta Sable's MIS reporting, Advanced Excel, Power BI dashboards, SQL analysis, and business reporting projects. View demonstrable case studies and enquire about a reporting solution.",
  alternates: { canonical: 'https://dattasable.com/portfolio' },
  openGraph: {
    title: 'MIS & Power BI Portfolio | Excel Dashboards & Business Reporting — Datta Sable',
    description:
      'Explore demonstrable projects in Advanced Excel, Power BI, SQL Server, and portfolio risk management by MIS Manager Datta Sable.',
    url: 'https://dattasable.com/portfolio',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://dattasable.com/#person',
      name: 'Datta Sable',
      jobTitle: 'Business Intelligence & MIS Manager',
      url: 'https://dattasable.com',
      sameAs: [
        'https://www.linkedin.com/in/dattasable/',
        'https://github.com/sabledattatray',
      ],
      knowsAbout: [
        'Power BI',
        'Advanced Excel',
        'DAX',
        'SQL Server',
        'Power Query',
        'MIS Reporting',
        'Delinquency Portfolio Management',
        'Financial Close Automation',
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://dattasable.com/portfolio#collection',
      url: 'https://dattasable.com/portfolio',
      name: 'MIS & Power BI Portfolio — Datta Sable',
      description:
        'Demonstrable analytics case studies in Advanced Excel, Power BI, SQL Server, and risk portfolio reporting.',
      author: { '@id': 'https://dattasable.com/#person' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'CreativeWork',
            position: 1,
            name: 'Telecom Collection & Delinquency Intelligence',
            description:
              'Postpaid Portfolio Aging, Roll-Rate Analysis & Tele-Caller Allocation Engine built in Power BI & SQL.',
            url: 'https://dattasable.com/dashboards/collection-intelligence',
          },
          {
            '@type': 'CreativeWork',
            position: 2,
            name: 'Executive B2B Sales Pipeline & Revenue Velocity Dashboard',
            description:
              'Deal Stage Conversion, Sales Velocity Modeling & Risk-Adjusted Revenue Forecasting in Power BI.',
            url: 'https://dattasable.com/dashboards/sales-pipeline',
          },
          {
            '@type': 'CreativeWork',
            position: 3,
            name: 'Enterprise P&L & Financial Close Reconciliation Pack',
            description:
              'Month-End Close Automation, Budget Variance & Executive Time Intelligence (MTD / LMTD) in Excel & Power BI.',
            url: 'https://dattasable.com/portfolio',
          },
        ],
      },
    },
  ],
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClientPage />
    </>
  );
}
