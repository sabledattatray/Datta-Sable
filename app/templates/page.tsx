'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Download, FileText, Layout, Database, Zap, Search, Filter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { TEMPLATES as interactiveTemplates } from '@/data/templates';
import { LANDING_PAGES as landingPages } from '@/data/landing-pages';

const TEMPLATES = [
  {
    id: 'n8n-agentic-workflow-01',
    title: "Multi-Agent AI Orchestrator",
    type: "n8n JSON",
    icon: <Zap className="text-yellow-500" size={24} />,
    desc: "Example n8n workflow for a content-processing pipeline. Inspect its nodes, configure your own service credentials and test in a separate workspace before use. No distribution or engagement result is guaranteed.",
    size: "5.95 KB",
    category: "Automation",
    downloadUrl: "/templates/multi-agent-orchestrator.json"
  },
  {
    id: 'py-data-cleaner-ultra',
    title: "Data Sanitization Engine",
    type: "Python",
    icon: <Database className="text-cyan-500" size={24} />,
    desc: "Example Python data-cleaning script. Review dependencies and transformation rules, keep an original copy of your input and validate the output on a small non-sensitive sample before adapting it.",
    size: "13.25 KB",
    category: "Data Engineering",
    downloadUrl: "/templates/data-cleaner.py"
  }
];

const PRIORITY_TEMPLATE_PATHS = [
  {
    title: 'Gemini SEO Pipelines',
    href: '/lp/gemini-seo-pipelines-for-marketers',
    label: 'SEO PLAYBOOK'
  },
  {
    title: 'B2B Retention Blueprint',
    href: '/templates/b2b-retention-post-blueprint',
    label: 'LINKEDIN'
  },
  {
    title: 'SaaS Product Schema',
    href: '/templates/saas-product-schema-blueprint',
    label: 'JSON-LD'
  },
  {
    title: 'High-CTR Meta Structures',
    href: '/templates/high-ctr-meta-structures',
    label: 'SEO'
  }
];

export default function TemplatesPage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <main className="container py-32" style={{ paddingTop: '160px' }}>
        <header className="mb-16">
          <div className="label-tech mb-6 text-[var(--accent)]">Asset Library / V1.0</div>
          <h1 style={{ fontSize: '48px', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '1.5rem' }}>
            Technical <span style={{ color: 'var(--accent)' }}>Templates.</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Download production-grade infrastructure blueprints for your automation and intelligence workflows.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="max-w-2xl" style={{ marginBottom: '2rem' }}>
          <div className="relative w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={20} />
            <input 
              type="text"
              placeholder="Search templates (e.g. n8n, Power BI)..."
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-sm text-white mono focus:outline-none focus:border-[var(--accent)] transition-colors shadow-inner"
              style={{ padding: '1.25rem 1.5rem 1.25rem 3.5rem', height: '64px', fontSize: '0.95rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface2)]" style={{ marginBottom: '4rem', padding: '1.5rem' }}>
          <div className="label-tech mb-5 text-[var(--accent3)]">Priority Asset Paths</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRIORITY_TEMPLATE_PATHS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline group border border-[var(--border)] bg-[var(--bg)] p-4 hover:border-[var(--accent3)] transition-colors"
              >
                <span className="mono text-[length:var(--text-small)] text-[var(--muted)] uppercase tracking-widest">{item.label}</span>
                <div className="mt-2 flex items-center justify-between gap-3 text-[var(--text)]">
                  <span className="text-sm font-bold group-hover:text-[var(--accent3)] transition-colors">{item.title}</span>
                  <ArrowRight size={13} className="text-[var(--accent3)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TEMPLATES.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase())).map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group flex flex-col h-full shadow-lg hover:border-[var(--accent)] transition-all duration-300"
              style={{ padding: '2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-[var(--bg)] rounded-sm border border-[var(--border)] shadow-inner">
                  {template.icon}
                </div>
                <div className="tag mono text-[length:var(--text-small)] tracking-[0.2em] font-bold px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm">{template.type}</div>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }} className="group-hover:text-[var(--accent)] transition-colors">
                {template.title}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>
                {template.desc}
              </p>

              <div className="pt-6 border-t border-[var(--border)] border-opacity-60 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="mono text-[length:var(--text-small)] text-[var(--muted)] opacity-60 uppercase mb-1 font-bold">Filesize</span>
                   <span className="mono text-[length:var(--text-small)] font-bold text-[var(--accent)]">{template.size}</span>
                </div>
                <a 
                  href={template.downloadUrl} 
                  download 
                  className="btn-outline px-6 py-3 flex items-center gap-2.5 group/dl no-underline font-bold text-[length:var(--text-small)]"
                >
                   <Download size={15} className="group-hover/dl:translate-y-0.5 transition-transform text-[var(--accent)]" />
                   <span className="mono text-[length:var(--text-small)] font-bold tracking-wider">DOWNLOAD</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Tool Blueprints & Presets Section */}
        <div style={{ marginTop: '8rem' }}>
          <header className="mb-10">
            <div className="label-tech mb-4 text-[var(--accent2)]">Interactive Presets / AI & Marketing</div>
            <h2 style={{ fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '1rem' }}>
              Interactive <span style={{ color: 'var(--accent2)' }}>Blueprints.</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Directly load these blueprints and precision structures into our Surgical Workspace tools.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {interactiveTemplates.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card flex flex-col h-full shadow-lg hover:border-[var(--accent2)] transition-all duration-300"
                style={{ padding: '2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="tag mono text-[length:var(--text-small)] tracking-[0.2em] font-bold px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm">
                    {item.category.toUpperCase()}
                  </div>
                  <div className="tag mono text-[length:var(--text-small)] tracking-[0.1em] px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm opacity-60">
                    {item.targetModule.split('/').pop()}
                  </div>
                </div>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>
                  {item.title}
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>
                  {item.description}
                </p>

                <div className="pt-6 border-t border-[var(--border)] border-opacity-60 flex items-center justify-between">
                  <Link href={`/templates/${item.slug}`} className="mono text-[length:var(--text-small)] font-bold text-[var(--accent2)] hover:text-white transition-colors no-underline flex items-center gap-1.5">
                    VIEW BLUEPRINT <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Growth Playbooks (Landing Pages) */}
        <div style={{ marginTop: '8rem' }}>
          <header className="mb-10">
            <div className="label-tech mb-4 text-[var(--accent3)]">Growth Frameworks & Playbooks</div>
            <h2 style={{ fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '1rem' }}>
              Growth <span style={{ color: 'var(--accent3)' }}>Playbooks.</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Deep-dive marketing and authority execution strategies tailored for data experts and SaaS builders.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {landingPages.filter(lp => lp.title.toLowerCase().includes(search.toLowerCase()) || lp.persona.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card flex flex-col h-full shadow-lg hover:border-[var(--accent3)] transition-all duration-300"
                style={{ padding: '2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="tag mono text-[length:var(--text-small)] tracking-[0.2em] font-bold px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm">
                    {item.persona.toUpperCase()}
                  </div>
                  <div className="tag mono text-[length:var(--text-small)] tracking-[0.1em] px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm opacity-60">
                    {item.intent.toUpperCase()}
                  </div>
                </div>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>
                  {item.title}
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>
                  {item.description}
                </p>

                <div className="pt-6 border-t border-[var(--border)] border-opacity-60 flex items-center justify-between">
                  <Link href={`/lp/${item.slug}`} className="mono text-[length:var(--text-small)] font-bold text-[var(--accent3)] hover:text-white transition-colors no-underline flex items-center gap-1.5">
                    READ PLAYBOOK <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lead Capture Overlay (Coming soon / CTA) */}
        <div className="border-2 border-dashed border-[var(--border)] rounded-sm text-center shadow-xl bg-[var(--surface1)]" style={{ marginTop: '8rem', padding: '4.5rem 2rem' }}>
           <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>Need a custom architecture?</h3>
           <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>We build bespoke automation systems tailored to your specific business logic.</p>
           <a href="/contact" className="btn-primary inline-flex py-4 px-12 font-bold tracking-wider text-[length:var(--text-small)]">REQUEST ARCHITECTURE BUILD</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
