import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Analytics Dashboard | Real-Time Site Metrics | Datta Sable',
  description: 'Real-time analytics dashboard for dattasable.com. Monitor live visitor data, traffic sources, and performance metrics.',
  openGraph: {
    title: 'Live Analytics Dashboard | Real-Time Site Metrics',
    description: 'Real-time analytics dashboard monitoring live visitor data, traffic sources, and performance metrics.',
    url: 'https://dattasable.com/analytics-live',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Live Analytics - Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Analytics Dashboard | Real-Time Site Metrics',
    description: 'Real-time analytics monitoring live visitor data and performance metrics.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/analytics-live' },
};

export default function AnalyticsLiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
