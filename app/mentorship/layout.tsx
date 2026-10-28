import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering & Data Analytics Mentorship | Datta Sable',
  description: '1-on-1 technical mentorship, portfolio architecture reviews, and career coaching across Power BI, SQL, Python, and cloud data platforms.',
  alternates: {
    canonical: 'https://dattasable.com/mentorship',
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Engineering & Data Analytics Mentorship | Datta Sable',
    description: '1-on-1 technical mentorship and career coaching across Power BI, SQL, Python, and cloud data platforms.',
    url: 'https://dattasable.com/mentorship',
  },
};

export default function MentorshipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
