import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Contact Datta Sable | BI Consulting & Data Analytics',
  description: 'Get in touch with Datta Sable — Business Intelligence expert available for dashboard development, data analytics consulting, SQL automation, and Python ETL projects. Based in Mumbai, India.',
  keywords: ['contact Datta Sable', 'BI consulting', 'data analytics consultant', 'Power BI developer', 'hire data analyst India'],
  alternates: {
    canonical: 'https://dattasable.com/contact',
  },
  openGraph: {
    title: 'Contact Datta Sable | BI Consulting & Data Analytics',
    description: 'Reach out for dashboard development, data analytics consulting, SQL automation, and Power BI projects. Available for freelance and enterprise engagements.',
    url: 'https://dattasable.com/contact',
    type: 'website',
    images: [{ url: '/images/og-main.webp', width: 1200, height: 630, alt: 'Contact Datta Sable | BI Expert' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Datta Sable | BI Consulting',
    description: 'Available for freelance BI consulting. Dashboard development, SQL automation, Python ETL. Response within 24 hours.',
    images: ['/images/og-main.webp'],
  },
};

export default async function ContactPage() {
  const dynamicPage = await getDynamicPage('contact');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }
  return <ContactPageClient />;
}
