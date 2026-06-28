import { Metadata } from 'next';
import FAQClientPage from './FAQClientPage';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Datta Sable',
  description: 'Find answers to common questions about Business Intelligence services, Power BI optimization, SQL automation, project timelines, and engagement models.',
  alternates: { canonical: 'https://dattasable.com/faq' },
};

export default async function FAQPage() {
  const dynamicPage = await getDynamicPage('faq');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  return <FAQClientPage />;
}
