import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Context Optimizer — Maximize Your AI Context Window | Datta Sable',
  description:
    'Free Context Optimizer tool by Datta Sable. Trim, structure, and prioritize your input to fit within AI model context limits. Get more out of ChatGPT, Claude, and Gemini by optimizing token usage without losing meaning.',
  keywords: ['context optimizer', 'AI context window', 'token optimizer', 'ChatGPT context', 'LLM token limit', 'AI prompt optimizer'],
  alternates: { canonical: 'https://dattasable.com/tools/context-optimizer' },
  openGraph: {
    title: 'Context Optimizer — Maximize Your AI Context Window',
    description: 'Trim and structure your AI input to fit context limits without losing meaning. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/context-optimizer',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
