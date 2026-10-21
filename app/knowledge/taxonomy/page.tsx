'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { Network, Zap, Shield, Cpu, Terminal, GitBranch, Database, Activity, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function TaxonomyPage() {
  const taxonomyNodes = [
    {
      code: "EC-01",
      title: "Stateless Execution",
      desc: "Atomic operations with no memory persistence between cycles. High-speed, low-overhead triggers.",
      useCase: "Basic intent classification, single-pass formatting.",
      latency: "Measure per workload"
    },
    {
      code: "EC-02",
      title: "Stateful Iteration",
      desc: "Recursive logic loops that maintain session context. Necessary for multi-turn reasoning chains.",
      useCase: "Deep research, iterative code debugging.",
      latency: "Measure per workload"
    },
    {
      code: "EC-03",
      title: "Validated Multi-Agent",
      desc: "Parallel execution across specialized nodes with a central validation supervisor.",
      useCase: "Enterprise-grade content engines, complex ETL.",
      latency: "Measure per workload"
    },
    {
      code: "EC-04",
      title: "Hardened Pipeline",
      desc: "Execution chains integrated with external DBs and APIs via strict structural constraints.",
      useCase: "Automated MIS, Real-time telemetry.",
      latency: "Model dependent"
    }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="boxed-wrapper pt-32 pb-24">
        <Crosshair position="tl" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="label-tech text-[var(--accent)]">Technical Reference v2.1.0</div>
              <div className="flex items-center gap-2 mono text-[10px] opacity-40">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /> LIVE_STANDARD
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
              Execution Chain <span style={{ color: 'var(--accent)' }}>Taxonomy.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '5rem', lineHeight: 1.6 }}>
              A definitive structural classification of AI execution patterns. This taxonomy serves as the 
              architectural standard for deterministic workflow engineering.
            </p>

            {/* Semantic Links */}
            <div className="flex flex-wrap gap-4 mb-10 p-6 bg-[var(--surface2)] border border-[var(--border)] rounded-sm">
              <span className="mono text-[10px] uppercase opacity-40 w-full mb-2">Linked Frameworks:</span>
              <Link href="/knowledge/standards" className="flex items-center gap-2 text-[11px] mono hover:text-[var(--accent)] transition-colors">
                <LinkIcon size={12} /> PROMPT_HARDENING_V1
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <Link href="/knowledge/patterns" className="flex items-center gap-2 text-[11px] mono hover:text-[var(--accent)] transition-colors">
                <LinkIcon size={12} /> WORKFLOW_PATTERNS_V2
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-24">
              {taxonomyNodes.map((node, i) => (
                <motion.div
                  key={node.code}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-[var(--border)] bg-[var(--surface1)] rounded-sm flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className="flex-shrink-0">
                    <span className="mono text-[10px] px-3 py-1 border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5">
                      {node.code}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{node.title}</h3>
                    <p className="text-[var(--muted)] mb-6 text-sm leading-relaxed">{node.desc}</p>
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
                      <div>
                        <span className="mono text-[9px] uppercase opacity-40 block mb-2">Primary Use Case</span>
                        <span className="text-[11px] mono">{node.useCase}</span>
                      </div>
                      <div>
                        <span className="mono text-[9px] uppercase opacity-40 block mb-2">Target Latency</span>
                        <span className="text-[11px] mono text-cyan-500">{node.latency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <Activity size={16} className="text-[var(--border)]" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-12 border-2 border-dashed border-[var(--border)] bg-[var(--surface2)]/30 rounded-sm mb-12">
              <h2 className="text-2xl font-bold mb-6">Standardizing the AI Interface</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  Without a standard taxonomy, AI integration remains a "black box" operation. By classifying 
                  execution chains into these four distinct tiers, builders can identify the state and validation needs
                  they must test before setting latency, cost, or reliability targets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-6 bg-[var(--bg)] border border-[var(--border)]">
                    <h4 className="mono text-[10px] text-[var(--accent)] uppercase mb-4">Structural Moats</h4>
                    <p className="text-[12px] opacity-70">Taxonomy-driven design ensures that your AI infrastructure remains portable and modular across model upgrades.</p>
                  </div>
                  <div className="p-6 bg-[var(--bg)] border border-[var(--border)]">
                    <h4 className="mono text-[10px] text-[var(--accent)] uppercase mb-4">Citation Standards</h4>
                    <p className="text-[12px] opacity-70">These are local conventions. No external certification or standards compatibility has been established.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="label-tech mb-4">Call for Collaboration</div>
              <p className="text-[var(--muted)] mb-8">Have a correction or implementation question? Send it through the contact page.</p>
              <Link href="/contact" className="btn-primary py-3 px-8 inline-flex items-center">
                <GitBranch size={16} className="inline mr-2" /> Discuss these design notes
              </Link>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="taxonomy" />
      <Footer />
    </div>
  );
}
