import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mermaid Forge — Create Diagrams & Flowcharts with Mermaid.js | Datta Sable',
  description:
    'Free Mermaid Forge tool by Datta Sable. Create flowcharts, sequence diagrams, entity-relationship diagrams, Gantt charts, and more using Mermaid.js syntax. Live preview and export-ready output for documentation and presentations.',
  keywords: ['mermaid diagram tool', 'flowchart generator', 'mermaid.js editor', 'diagram creator', 'ER diagram tool', 'sequence diagram generator'],
  alternates: { canonical: 'https://dattasable.com/tools/mermaid-forge' },
  openGraph: {
    title: 'Mermaid Forge — Create Diagrams & Flowcharts with Mermaid.js',
    description: 'Create flowcharts, ER diagrams, Gantt charts, and more with live preview. Free tool by Datta Sable.',
    url: 'https://dattasable.com/tools/mermaid-forge',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
