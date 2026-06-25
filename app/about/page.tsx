import { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';

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

export default function AboutPage() {
  return <AboutContent />;
}
