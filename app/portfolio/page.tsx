import { Metadata } from 'next';
import PortfolioClientPage from './PortfolioClientPage';

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies | Datta Sable',
  description: 'Explore successful BI projects, custom data engineering frameworks, Tableau/Power BI dashboards, and technical automation case studies.',
  alternates: { canonical: 'https://dattasable.com/portfolio' },
  openGraph: {
    title: 'Portfolio & Case Studies | Datta Sable',
    description: 'Explore successful BI projects, custom data engineering frameworks, Tableau/Power BI dashboards, and technical automation case studies.',
    url: 'https://dattasable.com/portfolio',
    type: 'website',
  },
};

export default function PortfolioPage() {
  return <PortfolioClientPage />;
}
