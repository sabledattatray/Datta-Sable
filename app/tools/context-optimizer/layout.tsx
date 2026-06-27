import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Context Optimizer — Maximize Your AI Context Window | Datta Sable',
  description:
    'Free Context Optimizer tool by Datta Sable. Trim, structure, and prioritize your input to fit within AI model context limits. Get more out of ChatGPT, Claude, and Gemini by optimizing token usage without losing meaning.',
  keywords: ['context optimizer', 'AI context window', 'token optimizer', 'ChatGPT context', 'LLM token limit', 'AI prompt optimizer'],
  alternates: { canonical: 'https://dattasable.com/tools/context-optimizer' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Context Optimizer — Maximize Your AI Context Window',
    description: 'Trim and structure your AI input to fit context limits without losing meaning. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/context-optimizer',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Context Optimizer",
        "description": "Trim, structure, and prioritize your input to fit within AI model context limits without losing meaning.",
        "url": "https://dattasable.com/tools/context-optimizer",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Token Usage Optimization",
          "Context Window Fitting",
          "Prompt Structure Analysis",
          "Multi-Model Support (ChatGPT, Claude, Gemini)",
          "Copy to Clipboard"
        ],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "author": { "@id": "https://dattasable.com/#person" },
        "publisher": { "@id": "https://dattasable.com/#organization" },
        "isPartOf": { "@id": "https://dattasable.com/#website" }
      }} />
      {children}
    </>
  );
}
