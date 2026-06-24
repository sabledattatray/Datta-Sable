import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolCard from '@/components/tools/ToolCard';
import { 
  Wand2, 
  Share2, 
  Search, 
  Image as ImageIcon, 
  Type, 
  Zap, 
  FileJson, 
  LayoutDashboard,
  Library,
  Minimize2
} from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Surgical AI Workspace | AI Tools for Creators & Developers' },
  description: 'A precision-engineered AI workspace for creators, developers, and strategists — built to streamline content workflows, SEO execution, and technical optimization.',
  openGraph: {
    title: 'Surgical AI Workspace | AI Tools for Creators & Developers',
    description: 'Precision-engineered AI tools for creators, developers, and strategists. Streamline content workflows, SEO, and technical optimization.',
    url: 'https://dattasable.com/tools',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Surgical AI Workspace — Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surgical AI Workspace | AI Tools for Creators & Developers',
    description: 'AI-powered tools for content workflows, SEO execution, and technical optimization.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/tools' },
};

const TOOLS = [


  {
    id: 'execution-chains',
    title: 'Surgical Execution Chains™',
    description: 'Automated multi-node orchestration. One input, multiple high-authority outputs across LinkedIn, SEO, and AI.',
    icon: <Zap size={24} className="text-[var(--accent)]" />,
    category: 'Orchestration',
    href: '/chains',
    status: 'Elite'
  },
  {
    id: 'ai-workspace',
    title: 'Surgical AI Workspace',
    description: 'The command center for your creative technical workflow. Resume recent sessions and manage cross-tool pipelines.',
    icon: <LayoutDashboard size={24} />,
    category: 'Platform',
    href: '/tools/workspace',
    status: 'Ready'
  },
  {
    id: 'template-packs',
    title: 'Operator Template Packs',
    description: 'Scalable knowledge assets: Viral LinkedIn hooks, AI research pipelines, and SEO blueprints.',
    icon: <Library size={24} />,
    category: 'Knowledge',
    href: '/templates',
    status: 'Ready'
  },
  {
    id: 'linkedin-formatter',
    title: 'LinkedIn Authority Formatter',
    description: 'Transform messy thoughts into viral LinkedIn hooks with professional spacing and surgical precision.',
    icon: <Share2 size={24} />,
    category: 'Social',
    href: '/tools/linkedin-formatter',
    status: 'Ready'
  },
  {
    id: 'ai-prompt-generator',
    title: 'Surgical Prompt Engineer',
    description: 'Generate high-fidelity AI prompts for Gemini, GPT-4, and Claude. Optimized for technical and creative tasks.',
    icon: <Wand2 size={24} />,
    category: 'AI',
    href: '/tools/ai-prompt-generator',
    status: 'Ready'
  },
  {
    id: 'seo-meta-generator',
    title: 'Meta-Force SEO Generator',
    description: 'Generate SEO-optimized titles, meta descriptions, and JSON-LD schema in one click.',
    icon: <Search size={24} />,
    category: 'SEO',
    href: '/tools/seo-meta-generator',
    status: 'Ready'
  },
  {
    id: 'image-blade-compressor',
    title: 'Image-Blade Compressor',
    description: 'Fast, client-side image optimization to WebP/AVIF without losing surgical quality.',
    icon: <ImageIcon size={24} />,
    category: 'Utility',
    href: '/tools/image-blade',
    status: 'Ready'
  },
  {
    id: 'ai-context-optimizer',
    title: 'AI Context Optimizer',
    description: 'Surgically condense long prompts and technical logs to save tokens and fit into context windows.',
    icon: <Minimize2 size={24} />,
    category: 'AI',
    href: '/tools/context-optimizer',
    status: 'Ready'
  },
  {
    id: 'word-reading-time',
    title: 'Precision Word Counter',
    description: 'Detailed analysis of your content: Word count, reading time, and readability score.',
    icon: <Type size={24} />,
    category: 'Content',
    href: '/tools/word-counter',
    status: 'Ready'
  },
  {
    id: 'json-schema-forge',
    title: 'JSON-LD Schema Forge',
    description: 'Create technical structured data for Articles, Products, and Videos to boost Google indexing.',
    icon: <FileJson size={24} />,
    category: 'Developer',
    href: '/tools/schema-generator',
    status: 'Ready'
  },
  {
    id: 'mermaid-diagram-forge',
    title: 'Mermaid Diagram Forge',
    description: 'Transform technical logic and system prompts into high-fidelity visual architecture diagrams.',
    icon: <LayoutDashboard size={24} />,
    category: 'Developer',
    href: '/tools/mermaid-forge',
    status: 'Ready'
  }
];

export default function ToolsHub() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <main className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        {/* Precision Decorators */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '1px', background: 'var(--accent)' }} />
        </div>

        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="label-tech mb-4">SURGICAL-WORKSPACE-V1.1</div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
                AI Workflow <span className="hero-title">Infrastructure</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                A precision-engineered AI workspace for creators, developers, and strategists — built to streamline content workflows, prompt engineering, SEO execution, and technical optimization.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <Zap size={16} className="text-[var(--accent)]" />
              <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Precision_Modules</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Decorator */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '1px', background: 'var(--accent)' }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
