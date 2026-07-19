import { Metadata } from 'next';
import Link from 'next/link';
import CareersContent from './CareersContent';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Urgent Hiring Collection Officers & Team Leaders | Datta Sable Careers',
  description: 'Apply for Collection Officer and Collection Team Leader jobs. Freshers welcome. 10th pass eligible. Immediate joining. Mumbai and surrounding areas.',
  alternates: {
    canonical: 'https://dattasable.com/careers',
  },
  openGraph: {
    title: 'Urgent Hiring Collection Officers & Team Leaders | Datta Sable Careers',
    description: 'Apply for Collection Officer and Collection Team Leader jobs. Freshers welcome. 10th pass eligible. Immediate joining. Mumbai and surrounding areas.',
    url: 'https://dattasable.com/careers',
    type: 'website',
  },
  robots: { index: false, follow: true },
};

export default async function CareersPage() {
  const dynamicPage = await getDynamicPage('careers');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }
  return (
    <>
      {/* Crawlable job listing links for SEO — resolves orphan page issues */}
      <nav aria-label="Job Listings" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <Link href="/careers/collection-officer-mumbai">Field Collection Officer Jobs Mumbai</Link>
        <Link href="/careers/collection-team-leader-mumbai">Collection Team Leader Jobs Mumbai</Link>
      </nav>
      <CareersContent />
    </>
  );
}

