import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Prompt Auditor — Score & Improve Your AI Prompts | Datta Sable',
  description:
    'Free Prompt Auditor by Datta Sable. Analyse your AI prompts for clarity, specificity, context, and structure. Get an instant quality score and actionable suggestions to make your prompts more effective for ChatGPT, Claude, and Gemini.',
  keywords: ['prompt auditor', 'AI prompt quality checker', 'prompt analyzer', 'ChatGPT prompt scorer', 'prompt quality score', 'improve AI prompts'],
  alternates: { canonical: 'https://dattasable.com/tools/prompt-auditor' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Prompt Auditor — Score & Improve Your AI Prompts',
    description: 'Get an instant quality score and improvement tips for your AI prompts. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/prompt-auditor',
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
        "name": "Prompt Auditor",
        "description": "Analyse AI prompts for clarity, specificity, context, and structure. Get an instant quality score and actionable improvement suggestions.",
        "url": "https://dattasable.com/tools/prompt-auditor",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Prompt Quality Scoring",
          "Clarity & Specificity Analysis",
          "Structure Evaluation",
          "Actionable Improvement Suggestions",
          "Multi-Model Compatibility Check"
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
