import { Metadata } from 'next';
import CareersContent from '../CareersContent';

export const metadata: Metadata = {
  title: 'Collection Team Leader Jobs in Mumbai | Datta Sable Careers',
  description: 'Urgent hiring for Collection Team Leaders in Mumbai. Fixed salary of ₹20,000 - ₹30,000 per month + incentives. Minimum 2-5 years collections & team handling experience required.',
  alternates: {
    canonical: 'https://dattasable.com/careers/collection-team-leader-mumbai',
  },
  openGraph: {
    title: 'Collection Team Leader Jobs in Mumbai | Datta Sable Careers',
    description: 'Urgent hiring for Collection Team Leaders in Mumbai. Fixed salary of ₹20,000 - ₹30,000 per month + incentives. Minimum 2-5 years collections & team handling experience required.',
    url: 'https://dattasable.com/careers/collection-team-leader-mumbai',
    type: 'website',
  }
};

export default function CollectionTeamLeaderMumbaiPage() {
  return <CareersContent defaultJobTitle="Collection Team Leader" />;
}
