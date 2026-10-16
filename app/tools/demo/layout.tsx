import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo — Interactive Tool Demos | Datta Sable',
  description:
    'Explore live interactive demos of Datta Sable\'s AI and data tools. See the AI Prompt Generator, LinkedIn Formatter, SEO Meta Generator, and more in action before diving in.',
  keywords: ['tool demo', 'AI tools demo', 'data tools preview', 'Datta Sable demo', 'interactive demo'],
  alternates: { canonical: 'https://dattasable.com/tools/demo' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Demo — Interactive Tool Demos',
    description: 'See live interactive demos of all Datta Sable AI and data tools in action.',
    url: 'https://dattasable.com/tools/demo',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
