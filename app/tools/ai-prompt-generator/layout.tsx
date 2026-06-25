import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Prompt Generator — Engineer Perfect Prompts for Any AI | Datta Sable',
  description:
    'Free AI Prompt Generator by Datta Sable. Build precision-engineered prompts for ChatGPT, Claude, Gemini, and more. Choose persona, platform, tone, and style to craft prompts that consistently deliver great results.',
  keywords: ['AI prompt generator', 'ChatGPT prompt', 'prompt engineering', 'Claude prompt', 'Gemini prompt', 'AI writing tool'],
  alternates: { canonical: 'https://dattasable.com/tools/ai-prompt-generator' },
  openGraph: {
    title: 'AI Prompt Generator — Engineer Perfect Prompts for Any AI',
    description: 'Build precision-engineered prompts for ChatGPT, Claude, Gemini and more. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/ai-prompt-generator',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
