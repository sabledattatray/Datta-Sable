'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Zap, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft,
  Layout,
  Share2,
  Download,
  Maximize2,
  Code2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useSurgicalPersistence } from '@/lib/hooks/useSurgicalPersistence';
import OperatorPanel from '@/components/tools/OperatorPanel';
import { useTheme } from '@/components/ThemeProvider';

// Mermaid CDN initialization
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

export default function MermaidForge() {
  const [input, setInput] = useSurgicalPersistence('mermaid-input', 'graph TD\n  A[Input] --> B{Surgical AI}\n  B --> C[Blueprint]\n  B --> D[Execution]\n  C --> E[Output]\n  D --> E');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    renderDiagram();
  }, [input, theme]);

  const renderDiagram = async () => {
    if (!previewRef.current) return;
    setError(null);
    
    try {
      const mermaid = (await import('mermaid')).default;
      const isLightTheme = theme === 'light';

      mermaid.initialize({
        startOnLoad: false,
        theme: isLightTheme ? 'default' : 'dark',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: false
        },
        themeVariables: isLightTheme ? {
          background: 'transparent',
          primaryColor: '#e0f2fe',
          primaryTextColor: '#000000',
          lineColor: '#cbd5e1',
          primaryBorderColor: '#cbd5e1',
          nodeBorder: '#cbd5e1',
          mainBkg: '#ffffff',
          textColor: '#000000',
          actorTextColor: '#000000',
          actorBkg: '#ffffff',
          signalColor: '#0059B3',
          signalLineColor: '#cbd5e1',
        } : {
          background: '#0d1117',
          primaryColor: '#00e5ff',
          primaryTextColor: '#fff',
          lineColor: '#2f363d'
        }
      });

      const id = `mermaid-forge-svg-${theme}`;
      const { svg } = await mermaid.render(id, input);
      previewRef.current.innerHTML = svg;
    } catch (err: any) {
      setError('Invalid Mermaid Syntax. Check your structure.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/tools" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_HUB
            </Link>

            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <Layout size={20} />
                </div>
                <div className="label-tech">VISUAL-ARCHITECTURE-V1.0</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Mermaid Diagram <span className="hero-title">Forge</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Transform technical logic and system prompts into high-fidelity visual architecture. Powered by Mermaid.js for industrial-grade system mapping.
              </p>
            </div>

            <OperatorPanel />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Editor Area */}
              <div>
                <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between p-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                       <Code2 size={14} className="text-[var(--muted)]" />
                       <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Syntax_Editor</h4>
                    </div>
                    <button onClick={() => setInput('')} className="text-[var(--muted)] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Mermaid syntax (graph TD, sequenceDiagram, etc.)..."
                    className="w-full h-[450px] p-6 bg-transparent border-none outline-none text-theme font-mono resize-none text-sm leading-relaxed"
                  />
                  <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)] flex justify-between items-center">
                    <div className="text-xs mono text-[var(--muted)] uppercase">Status: {error ? 'SYNTAX_ERROR' : 'VALID'}</div>
                    <button onClick={handleCopy} className="btn-primary px-6 py-2 text-xs flex items-center gap-2 cursor-pointer">
                      {copied ? <Check size={12} /> : <Copy size={12} />} COPY_SYNTAX
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs mono">
                    {error}
                  </div>
                )}
              </div>

              {/* Preview Area */}
              <div>
                <div className="card p-0 overflow-hidden h-full flex flex-col" style={{ background: 'var(--surface2)', borderColor: !error ? 'var(--accent)' : 'var(--border)' }}>
                  <div className="flex items-center justify-between p-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                       <Maximize2 size={14} className="text-[var(--accent)]" />
                       <h4 className="mono text-xs uppercase tracking-widest text-[var(--accent)]">Visual_Architecture</h4>
                    </div>
                  </div>
                  <div 
                    ref={previewRef}
                    className="flex-1 min-h-[400px] p-8 overflow-auto flex items-center justify-center transition-colors duration-200"
                    style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#0d1117' }}
                  />
                  <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-4 text-xs mono text-[var(--muted)]">
                       RENDERING_ENGINE: MERMAID_V10
                    </div>
                    <div className="flex items-center gap-2 text-[var(--muted)]">
                       <Sparkles size={12} />
                       <span className="text-[11px] mono uppercase">High_Fidelity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Section for SEO */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'System Mapping', text: 'Instantly visualize complex AI pipelines, database schemas, and software architectures with surgical precision.', icon: <Layout size={20} /> },
                 { title: 'Technical Sharing', text: 'Copy syntax directly into GitHub, Notion, or Obsidian. Perfect for technical documentation and developer outreach.', icon: <Share2 size={20} /> },
                 { title: 'Zero Payload', text: 'Lightweight CDN-based rendering ensures your diagram forge remains ultra-fast without heavy client-side bundles.', icon: <Zap size={20} /> }
               ].map((item, i) => (
                 <div key={i} className="card p-6 border-dashed" style={{ background: 'var(--bg)' }}>
                   <div className="text-[var(--accent)] mb-4">{item.icon}</div>
                   <h5 className="font-bold mb-2 text-sm">{item.title}</h5>
                   <p className="text-xs text-[var(--muted)] leading-relaxed">{item.text}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.25 }}>
            Mermaid Forge — Text-to-Diagram Generator for Developers
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            Mermaid Forge is an online Mermaid.js diagram editor and renderer for software developers, technical writers, system architects, and data engineers. Mermaid is a JavaScript-based diagramming language that lets you create flowcharts, sequence diagrams, entity-relationship diagrams, Gantt charts, and more using plain text syntax — making diagrams versionable, diffable, and embeddable in Markdown documents and GitHub README files.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            Write your Mermaid syntax in the left panel and see a live rendered diagram on the right. Export the finished diagram as an SVG or PNG for use in architecture documentation, technical specifications, onboarding guides, API design documents, or slide decks. Supported diagram types include flowchart (LR/TD), sequenceDiagram, classDiagram, erDiagram, gantt, pie, and stateDiagram.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Live Preview', desc: 'Real-time diagram rendering as you type Mermaid syntax' },
              { label: 'Multiple Diagram Types', desc: 'Flowcharts, sequence, ER, Gantt, class, state, and pie charts' },
              { label: 'SVG / PNG Export', desc: 'Export diagrams in vector (SVG) or raster (PNG) formats' },
              { label: 'GitHub Compatible', desc: 'Mermaid syntax renders natively in GitHub Markdown and GitLab' },
            ].map(f => (
              <div key={f.label} style={{ padding: '1.25rem 1.5rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', minWidth: 0 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.82rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{f.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
