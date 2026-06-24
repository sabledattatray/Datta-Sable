import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Datta Sable',
  description: 'Cookie Policy for dattasable.com - how we use cookies for analytics, advertising, and site functionality.',
  openGraph: {
    title: 'Cookie Policy | Datta Sable',
    description: 'Cookie Policy for dattasable.com.',
    url: 'https://dattasable.com/cookies',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Cookie Policy | Datta Sable', description: 'Cookie Policy for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/cookies' },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
