import { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';


export const metadata: Metadata = {
  title: "About Datta Sable | BI & Data Strategy Expert",
  description: "Meet Datta Sable, a Mumbai-based business intelligence and data strategy professional. Explore his approach, career journey, technical focus, and learning archive.",
  alternates: {
    canonical: 'https://dattasable.com/about',
  },
  openGraph: {
    title: "About Datta Sable | BI & Data Strategy Expert",
    description: "Business context, analytical thinking, and thoughtful design. Meet the person behind the data systems and technical guides.",
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
