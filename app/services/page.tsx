import type { Metadata } from 'next';
import ServicesContent from '@/components/ServicesContent';

export const metadata: Metadata = {
  title: 'Enterprise BI, Dashboard & Data Automation Services | Datta Sable',
  description: 'Senior Business Intelligence consultant & data engineer specializing in Power BI, Tableau, Python ETL pipelines, SQL optimization, and full-stack data platforms. 100% mathematical reconciliation guaranteed.',
  alternates: { canonical: 'https://dattasable.com/services' },
  openGraph: {
    title: 'Enterprise BI, Dashboard & Data Automation Services | Datta Sable',
    description: 'Senior Business Intelligence consultant & data engineer specializing in Power BI, Tableau, Python ETL pipelines, and SQL optimization.',
    url: 'https://dattasable.com/services',
    type: 'website',
    images: [
      {
        url: '/images/dattasable.com.webp',
        width: 1200,
        height: 630,
        alt: 'Datta Sable — Enterprise BI & Data Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise BI, Dashboard & Data Automation Services | Datta Sable',
    description: 'Senior BI consultant & data engineer specializing in Power BI, Tableau, and automated Python pipelines.',
    images: ['/images/dattasable.com.webp'],
  },
};

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Datta Sable — BI & Data Engineering Consulting',
    url: 'https://dattasable.com/services',
    image: 'https://dattasable.com/images/dattasable.com.webp',
    description: 'Enterprise Business Intelligence consulting, Power BI and Tableau dashboard engineering, Python ETL pipelines, and database optimization.',
    provider: {
      '@type': 'Person',
      name: 'Datta Sable',
      jobTitle: 'Enterprise BI Architect & Full-Stack Engineer',
      url: 'https://dattasable.com',
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Business Intelligence & Data Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dashboard Development (Power BI & Tableau)',
            description: 'Custom interactive dashboards, DAX measures, automated gateway refreshes, and financial balance sheet reconciliation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Data Analytics & BI Consulting',
            description: 'Data hygiene audits, unified KPI governance, SQL query tuning, and dimensional star-schema modeling.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Reporting & Data Automation Solutions',
            description: 'Python ETL pipelines, scheduled email dispatch, automated error logging, and API integrations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise Web Solutions',
            description: 'Full-stack Next.js and custom WordPress platforms tailored for data-heavy organizations.',
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  );
}
