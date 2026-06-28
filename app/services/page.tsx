import { Metadata } from 'next';
import ServicesContent from '@/components/ServicesContent';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: "Professional BI & Data Analytics Services | Datta Sable",
  description: "Specialized Business Intelligence services including Dashboard Development (Tableau/Power BI), SQL Automation, Python Data Engineering, and SEO Optimization.",
  alternates: {
    canonical: 'https://dattasable.com/services',
  },
  openGraph: {
    title: "Professional BI & Data Analytics Services | Datta Sable",
    description: "High-fidelity analytics, technical automation, and scalable dashboard structures built for enterprise-grade growth.",
    url: 'https://dattasable.com/services',
    type: 'website',
    images: [
      {
        url: "/images/datta.webp",
        width: 1200,
        height: 630,
        alt: "Datta Sable Services",
      },
    ],
  },
};

export default async function ServicesPage() {
  const dynamicPage = await getDynamicPage('services');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }
  return <ServicesContent />;
}
