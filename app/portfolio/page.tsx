import type { Metadata } from 'next';
import PortfolioClientPage from './PortfolioClientPage';
import { PortfolioHero, FeaturedProjectShowcase } from '@/components/portfolio/PortfolioShowcase';
import { flagshipProjects } from './data';

const title = 'Datta Sable Portfolio | Microsoft Fabric, Power BI, Excel & AI Automation Projects';
const description = "Explore Datta Sable's engineering portfolio featuring Microsoft Fabric capacity tools, Excel dashboard automation, n8n workflows, SQL Server analytics and Power BI case studies.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: 'https://dattasable.com/portfolio' },
  openGraph: { title, description, type: 'website', url: 'https://dattasable.com/portfolio', images: [{ url: 'https://dattasable.com/images/portfolio/fabric-home.webp', width: 1440, height: 1000, alt: 'Fabric Master engineering platform, a featured Datta Sable project' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['https://dattasable.com/images/portfolio/fabric-home.webp'] },
};
const portfolioStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dattasable.com' }, { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://dattasable.com/portfolio' }] },
    { '@type': 'CollectionPage', '@id': 'https://dattasable.com/portfolio#collection', name: title, description, url: 'https://dattasable.com/portfolio', author: { '@type': 'Person', name: 'Datta Sable', url: 'https://dattasable.com' }, mainEntity: { '@type': 'ItemList', itemListElement: flagshipProjects.map((project,index) => ({ '@type': 'ListItem', position: index+1, item: { '@type': 'CreativeWork', name: project.title, description: project.desc, url: `https://dattasable.com/portfolio/${project.flagship!.slug}` } })) } },
  ],
};
export default function PortfolioPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData).replace(/</g, '\\u003c') }} /><PortfolioClientPage hero={<PortfolioHero />} showcase={<FeaturedProjectShowcase />} /></>;
}
