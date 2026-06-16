import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Web Apps, Dashboards & Automation Projects',
  description: "Explore Datta Sable's full-stack web development, Power BI dashboards, Python automation, and SEO projects. Real case studies with measurable business impact.",
  alternates: { canonical: 'https://dattasable.com/portfolio' },
  openGraph: {
    type: 'website',
    title: 'Portfolio | Datta Sable — Web Dev, BI & Automation Projects',
    description: 'Full-stack web apps, Power BI dashboards, Python automation, and SEO case studies with real-world impact.',
    url: 'https://dattasable.com/portfolio',
    images: [{ url: 'https://dattasable.com/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable — Portfolio of Web Dev, BI & Automation Projects' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Datta Sable',
    description: 'Web apps, dashboards, automation and SEO case studies.',
    images: ['https://dattasable.com/images/dattasable.com.webp'],
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

