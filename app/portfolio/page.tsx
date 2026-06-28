import { Metadata } from 'next';
import PortfolioClientPage from './PortfolioClientPage';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies | Datta Sable',
  description: 'Explore successful BI projects, custom data engineering frameworks, Tableau/Power BI dashboards, and technical automation case studies.',
  alternates: { canonical: 'https://dattasable.com/portfolio' },
};

export default async function PortfolioPage() {
  const dynamicPage = await getDynamicPage('portfolio');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  return <PortfolioClientPage />;
}
