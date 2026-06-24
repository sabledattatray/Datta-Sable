import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Surgical BI Dashboards',
    default: 'Interactive Analytics Showcases | Surgical BI Dashboards | Datta Sable',
  },
  description: 'Explore high-performance, interactive BI dashboards featuring real-time revenue analytics, EMI collections intelligence, and sales pipeline velocity showcases.',
  openGraph: {
    title: 'Interactive Analytics Showcases | Surgical BI Dashboards',
    description: 'High-performance, interactive BI dashboards — real-time revenue analytics, collections intelligence, and sales pipeline velocity.',
    url: 'https://dattasable.com/dashboards',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Surgical BI Dashboards \u2014 Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Analytics Showcases | Surgical BI Dashboards',
    description: 'High-performance BI dashboards with real-time revenue, collections, and sales intelligence.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/dashboards' },
};


export default function DashboardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
