import { Metadata } from 'next';
import CareersContent from '../CareersContent';

export const metadata: Metadata = {
  title: 'Field Collection Officer (FOS) Jobs in Mumbai | Datta Sable Careers',
  description: 'Apply for Field Collection Officer (FOS) jobs in Mumbai, Navi Mumbai, Thane & Kalyan. Freshers welcome, 10th pass minimum. Attractive commissions, immediate joining.',
  alternates: {
    canonical: 'https://dattasable.com/careers/collection-officer-mumbai',
  },
  openGraph: {
    title: 'Field Collection Officer (FOS) Jobs in Mumbai | Datta Sable Careers',
    description: 'Apply for Field Collection Officer (FOS) jobs in Mumbai, Navi Mumbai, Thane & Kalyan. Freshers welcome, 10th pass minimum. Attractive commissions, immediate joining.',
    url: 'https://dattasable.com/careers/collection-officer-mumbai',
    type: 'website',
  }
};

export default function CollectionOfficerMumbaiPage() {
  return <CareersContent defaultJobTitle="Field Collection Officer" />;
}
