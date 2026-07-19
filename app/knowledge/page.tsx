import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { KNOWLEDGE_ARTICLES } from '@/data/knowledge';
import NewsletterCapture from '@/components/home/NewsletterCapture';
import { 
  BookOpen, 
  ChevronRight, 
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Surgical Knowledge Hub | Technical AI & Creator Guides",
  description: "Expert-grade educational resources for high-performance AI engineering, LinkedIn authority systems, and SEO infrastructure.",
  alternates: { canonical: 'https://dattasable.com/knowledge' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Surgical Knowledge Hub | Technical AI & Creator Guides | Datta Sable',
    description: 'Expert-grade educational resources for high-performance AI engineering, LinkedIn authority systems, and SEO infrastructure.',
    url: 'https://dattasable.com/knowledge',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Knowledge Hub — Datta Sable' }],
  },
};

const PRIORITY_KNOWLEDGE_PATHS = [
  {
    title: 'Framework Comparisons',
    href: '/knowledge/comparisons',
    label: 'ANALYSIS'
  },
  {
    title: 'Few-Shot Prompting Strategies',
    href: '/glossary/few-shot-prompting-strategies',
    label: 'GLOSSARY'
  },
  {
    title: 'Interactive Dashboard Demo',
    href: '/dashboards/interactive',
    label: 'DASHBOARD'
  },
  {
    title: 'Sales Pipeline Dashboard',
    href: '/dashboards/sales-pipeline',
    label: 'DASHBOARD'
  },
  {
    title: 'Gemini SEO Pipelines',
    href: '/lp/gemini-seo-pipelines-for-marketers',
    label: 'PLAYBOOK'
  },
  {
    title: 'SaaS Product Schema',
    href: '/templates/saas-product-schema-blueprint',
    label: 'TEMPLATE'
  },
  {
    title: 'B2B Retention Blueprint',
    href: '/templates/b2b-retention-post-blueprint',
    label: 'TEMPLATE'
  },
  {
    title: 'High-CTR Meta Structures',
    href: '/templates/high-ctr-meta-structures',
    label: 'TEMPLATE'
  },
  {
    title: 'Autonomous AI Agent Workflows',
    href: '/blog/mastering-autonomous-ai-agents-workflows-2026',
    label: 'AI'
  },
  {
    title: 'AI Agents Replacing Apps',
    href: '/blog/how-ai-agents-are-replacing-apps-2026',
    label: 'AI'
  },
  {
    title: 'Next.js Performance Manifesto',
    href: '/blog/nextjs-15-react-19-performance-manifesto-2026',
    label: 'WEB'
  },
  {
    title: 'Deep Work Protocol',
    href: '/blog/deep-work-protocol-technical-focus-2026',
    label: 'FOCUS'
  },
  {
    title: 'AI Engineering Standards',
    href: '/knowledge/standards',
    label: 'STANDARDS'
  },
  {
    title: 'Communication Protocols',
    href: '/knowledge/protocols',
    label: 'PROTOCOLS'
  },
  {
    title: 'Execution Patterns',
    href: '/knowledge/patterns',
    label: 'PATTERNS'
  },
  {
    title: 'Topical Taxonomy',
    href: '/knowledge/taxonomy',
    label: 'TAXONOMY'
  },
  {
    title: 'RFC-001: Prompt Hardening',
    href: '/knowledge/rfc/001-prompt-hardening',
    label: 'RFC'
  },
  {
    title: 'RFC-002: Execution Chains',
    href: '/knowledge/rfc/002-execution-chains',
    label: 'RFC'
  },
  {
    title: 'RFC-003: Intent Mapping',
    href: '/knowledge/rfc/003-intent-mapping',
    label: 'RFC'
  }
];

export default function KnowledgeHub() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <BookOpen size={20} />
                </div>
                <div className="label-tech">TOPICAL-AUTHORITY-V1.0</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
                Surgical <span className="hero-title">Knowledge</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                High-fidelity technical guides engineered for creators and builders. Master the architecture of the new AI-driven economy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {KNOWLEDGE_ARTICLES.map((article) => (
                <Link key={article.id} href={`/knowledge/${article.slug}`} className="no-underline group">
                  <div className="card h-full flex flex-col p-8 transition-all duration-300 hover:border-[var(--accent)]" style={{ background: 'var(--surface2)' }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-2 py-1 text-[9px] mono font-bold border border-[var(--border)] rounded opacity-60">
                        {article.category.toUpperCase()}
                      </div>
                      <div className="text-[var(--muted)] opacity-20">
                         <Target size={24} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-[var(--text)] group-hover:text-[var(--accent)] transition-all">
                      {article.title}
                    </h3>
                    
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-8 flex-1">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border)]/30">
                      <div className="flex items-center gap-2 text-[var(--accent)] text-[10px] mono font-bold tracking-widest group-hover:gap-4 transition-all">
                        READ_OPERATOR_GUIDE <ArrowRight size={12} />
                      </div>
                      <span className="text-[10px] mono text-[var(--muted)]">{article.readingTime}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Comparisons Page Link */}
              <Link href="/knowledge/comparisons" className="no-underline group">
                <div className="card h-full flex flex-col p-8 transition-all duration-300 hover:border-[var(--accent)]" style={{ background: 'var(--surface2)' }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-2 py-1 text-[9px] mono font-bold border border-[var(--border)] rounded opacity-60">
                      ENGINEERING ANALYSIS
                    </div>
                    <div className="text-[var(--muted)] opacity-20">
                       <Target size={24} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--text)] group-hover:text-[var(--accent)] transition-all">
                    Surgical AI Framework Comparisons
                  </h3>
                  
                  <p className="text-[var(--muted)] text-sm leading-relaxed mb-8 flex-1">
                    A technical framework analysis positioning Surgical AI precision against conventional recursive autonomous agents.
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border)]/30">
                    <div className="flex items-center gap-2 text-[var(--accent)] text-[10px] mono font-bold tracking-widest group-hover:gap-4 transition-all">
                      COMPARE_FRAMEWORKS <ArrowRight size={12} />
                    </div>
                    <span className="text-[10px] mono text-[var(--muted)]">6 min</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mb-20 border border-[var(--border)] bg-[var(--surface2)] p-6">
              <div className="label-tech mb-5 text-[var(--accent)]">Priority Knowledge Paths</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRIORITY_KNOWLEDGE_PATHS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="no-underline group border border-[var(--border)] bg-[var(--bg)] p-4 hover:border-[var(--accent)] transition-colors"
                  >
                    <span className="mono text-[9px] text-[var(--muted)] uppercase tracking-widest">{item.label}</span>
                    <div className="mt-2 flex items-center justify-between gap-3 text-[var(--text)]">
                      <span className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors">{item.title}</span>
                      <ArrowRight size={13} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Integration */}
            <NewsletterCapture />

            {/* Glossary Entry Point */}
            <div className="mt-20 p-12 card border-dashed text-center" style={{ background: 'var(--bg)' }}>
               <Zap size={32} className="text-[var(--accent)] mx-auto mb-6" />
               <h2 className="text-2xl font-bold mb-4">Master the AI Lexicon</h2>
               <p className="text-[var(--muted)] max-w-xl mx-auto text-sm leading-relaxed mb-8">
                 Master the technical terms of the new creator infrastructure with our surgical glossary. From semantic compression to prompt chaining.
               </p>
               <Link href="/glossary" className="btn-outline inline-flex items-center gap-2 no-underline">
                 OPEN_GLOSSARY <ChevronRight size={14} />
               </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
