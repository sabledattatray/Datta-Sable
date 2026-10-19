import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Certifications & Verified Credentials | Datta Sable',
  description: 'Verified professional accreditations in Google Analytics 4, Artificial Intelligence, Business Intelligence, and Data Engineering from Google Skillshop and LinkedIn Learning.',
  alternates: { canonical: 'https://dattasable.com/certification' },
  openGraph: {
    title: 'Official Certifications & Verified Credentials | Datta Sable',
    description: 'Verified professional accreditations in GA4, AI, BI, and Data Engineering from Google and LinkedIn.',
    url: 'https://dattasable.com/certification',
    type: 'profile',
  },
};

export default function CertificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
