import { Metadata } from 'next';
import CareersContent from './CareersContent';

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
  }
};

export default function CareersPage() {
  return <CareersContent />;
}
