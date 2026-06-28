import { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: "About Datta Sable | BI & Data Strategy Expert",
  description: "Learn more about Datta Sable, a Business Intelligence Expert specialized in Tableau, Power BI, SQL, and Python. Explore my technical arsenal and career log.",
  alternates: {
    canonical: 'https://dattasable.com/about',
  },
  openGraph: {
    title: "About Datta Sable | BI & Data Strategy Expert",
    description: "Senior BI Developer & Data Architect. Designing high-fidelity automated reporting solutions.",
    url: 'https://dattasable.com/about',
    type: 'profile',
    images: [
      {
        url: "/images/og-main.webp",
        width: 1200,
        height: 630,
        alt: "Datta Sable | BI & Data Strategy Expert",
      },
    ],
  },
};

export default async function AboutPage() {
  const dynamicPage = await getDynamicPage('about');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }
  return <AboutContent />;
}
