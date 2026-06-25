import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkedIn Formatter — Write Viral LinkedIn Posts That Get Engagement | Datta Sable',
  description:
    'Free LinkedIn Formatter by Datta Sable. Format your LinkedIn posts for maximum readability and engagement. Add line breaks, emojis, hooks, and CTAs. Choose from proven post templates for data, tech, and career content.',
  keywords: ['LinkedIn formatter', 'LinkedIn post formatter', 'LinkedIn content tool', 'LinkedIn post generator', 'LinkedIn writing tool', 'viral LinkedIn posts'],
  alternates: { canonical: 'https://dattasable.com/tools/linkedin-formatter' },
  openGraph: {
    title: 'LinkedIn Formatter — Write Viral LinkedIn Posts That Get Engagement',
    description: 'Format LinkedIn posts for maximum readability and engagement. Free tool with proven templates by Datta Sable.',
    url: 'https://dattasable.com/tools/linkedin-formatter',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
