import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'AI Prompt Generator — Engineer Perfect Prompts for Any AI | Datta Sable',
  description:
    'Free AI Prompt Generator by Datta Sable. Build precision-engineered prompts for ChatGPT, Claude, Gemini, and more. Choose persona, platform, tone, and style to craft prompts that consistently deliver great results.',
  keywords: ['AI prompt generator', 'ChatGPT prompt', 'prompt engineering', 'Claude prompt', 'Gemini prompt', 'AI writing tool'],
  alternates: { canonical: 'https://dattasable.com/tools/ai-prompt-generator' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'AI Prompt Generator — Engineer Perfect Prompts for Any AI',
    description: 'Build precision-engineered prompts for ChatGPT, Claude, Gemini and more. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/ai-prompt-generator',
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
        "name": "AI Prompt Generator",
        "description": "Build precision-engineered prompts for ChatGPT, Claude, Gemini, and more. Choose persona, platform, tone, and style.",
        "url": "https://dattasable.com/tools/ai-prompt-generator",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "AI Prompt Generation",
          "Persona & Tone Selection",
          "Multi-Platform Support (ChatGPT, Claude, Gemini)",
          "Copy to Clipboard",
          "Prompt Style Customization"
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
