import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Meta Generator — Create Perfect Title & Description Tags | Datta Sable',
  description:
    'Free SEO Meta Generator by Datta Sable. Generate optimised title tags and meta descriptions for any page. Preview exactly how your page will appear in Google search results and get character count warnings in real time.',
  keywords: ['SEO meta generator', 'meta description generator', 'title tag generator', 'SEO title tool', 'meta tag tool', 'Google snippet preview'],
  alternates: { canonical: 'https://dattasable.com/tools/seo-meta-generator' },
  openGraph: {
    title: 'SEO Meta Generator — Create Perfect Title & Description Tags',
    description: 'Generate optimised title tags and meta descriptions with live Google SERP preview. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/seo-meta-generator',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
