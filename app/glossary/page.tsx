'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { Book, Search, Hash, Link as LinkIcon, ExternalLink, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GLOSSARY_TERMS } from '@/data/glossary';

const RELATED_LEXICON_PATHS = [
  {
    title: 'Few-Shot Prompting Strategies',
    href: '/glossary/few-shot-prompting-strategies',
    label: 'PROMPTING'
  },
  {
    title: 'Gemini SEO Pipelines',
    href: '/templates/gemini-research-pipeline',
    label: 'SEO'
  },
  {
    title: 'High-CTR Meta Structures',
    href: '/templates/high-ctr-meta-structures',
    label: 'META'
  },
  {
    title: 'AI & Analytics Architecture Comparisons',
    href: '/knowledge/comparisons',
    label: 'ANALYSIS'
  }
];

export default function GlossaryIndex() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="boxed-wrapper pt-32 pb-24">
        <Crosshair position="tl" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/knowledge" className="mono text-[length:var(--text-small)] text-[var(--accent)] hover:underline flex items-center gap-2">
                ← BACK_TO_KNOWLEDGE_HUB
              </Link>
            </div>

            <div className="label-tech mb-8 text-[var(--accent)]">Technical Dictionary</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
              Infrastructure <span style={{ color: 'var(--accent)' }}>Glossary.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '5rem', lineHeight: 1.6 }}>
              A definitive index of the terminology, acronyms, and protocols defining the 
              Surgical AI Workspace.
            </p>

            <div className="mb-16 border border-[var(--border)] bg-[var(--surface2)] p-6">
              <div className="label-tech mb-5 text-[var(--accent)]">Related Lexicon Paths</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RELATED_LEXICON_PATHS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="no-underline group border border-[var(--border)] bg-[var(--bg)] p-4 hover:border-[var(--accent)] transition-colors"
                  >
                    <span className="mono text-[length:var(--text-small)] text-[var(--muted)] uppercase tracking-widest">{item.label}</span>
                    <div className="mt-2 flex items-center justify-between gap-3 text-[var(--text)]">
                      <span className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors">{item.title}</span>
                      <ChevronRight size={13} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative mb-16">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={20} />
              <input 
                type="text" 
                placeholder="Search terminology, acronyms, or categories..."
                className="w-full bg-[var(--surface1)] border border-[var(--border)] rounded-sm py-5 pl-16 pr-6 text-sm focus:border-[var(--accent)] transition-colors outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-32">
              {filteredTerms.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 border border-[var(--border)] bg-[var(--surface1)] rounded-sm group hover:border-[var(--accent)]/30 transition-colors"
                >
                  <Link href={`/glossary/${t.slug}`} className="no-underline">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Hash size={14} className="text-[var(--accent)]" />
                        <h3 className="text-xl font-bold group-hover:text-[var(--accent)] transition-colors">{t.term}</h3>
                        <span className="mono text-[length:var(--text-small)] px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full">{t.category}</span>
                      </div>
                      <span className="mono text-[length:var(--text-small)] opacity-40">ID: {t.id}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{t.definition}</p>
                    <div className="flex items-center gap-2 text-[var(--accent)] text-[length:var(--text-small)] mono font-bold tracking-widest group-hover:gap-4 transition-all uppercase">
                      VIEW_DETAILED_LEXICON <ChevronRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              ))}
              {filteredTerms.length === 0 && (
                <div className="p-20 text-center border border-dashed border-[var(--border)] rounded-sm">
                  <p className="text-[var(--muted)]">No matching terminology found in the current index.</p>
                </div>
              )}
            </div>

            <div className="p-12 border border-[var(--border)] bg-[var(--surface2)] rounded-sm text-center">
              <h2 className="text-2xl font-bold mb-4">Request Terminology Addition</h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
                Is there a framework component missing from our technical dictionary? Submit a request for term indexing.
              </p>
              <button className="btn-primary py-3 px-8 flex items-center gap-2 mx-auto">
                <ExternalLink size={16} /> Submit Term Proposal
              </button>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <Footer />
    </div>
  );
}
