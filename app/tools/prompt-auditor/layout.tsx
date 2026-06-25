import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prompt Auditor — Score & Improve Your AI Prompts | Datta Sable',
  description:
    'Free Prompt Auditor by Datta Sable. Analyse your AI prompts for clarity, specificity, context, and structure. Get an instant quality score and actionable suggestions to make your prompts more effective for ChatGPT, Claude, and Gemini.',
  keywords: ['prompt auditor', 'AI prompt quality checker', 'prompt analyzer', 'ChatGPT prompt scorer', 'prompt quality score', 'improve AI prompts'],
  alternates: { canonical: 'https://dattasable.com/tools/prompt-auditor' },
  openGraph: {
    title: 'Prompt Auditor — Score & Improve Your AI Prompts',
    description: 'Get an instant quality score and improvement tips for your AI prompts. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/prompt-auditor',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
