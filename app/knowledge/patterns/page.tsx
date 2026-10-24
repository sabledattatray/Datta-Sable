'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { LayoutGrid, Share2, Download, Link as LinkIcon, FileJson, Cpu, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function PatternsPage() {
  const handleDownload = () => { window.print(); };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Workflow Patterns | Datta Sable',
        text: 'Explore the canonical reference for deterministic AI execution patterns.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Reference URL copied to clipboard!');
    }
  };

  const patterns = [
    {
      title: "The Validation Loop",
      code: "WP-01",
      desc: "A recursive self-correction pattern where an Auditor Agent validates the output of an Executor Agent before final delivery.",
      useCase: "Data formatting, complex code generation, logical reasoning.",
      benefits: ["Schema checks required", "Recursive Error Correction"]
    },
    {
      title: "The Multi-Agent Swarm",
      code: "WP-02",
      desc: "Parallel execution of specialized nodes (Research, Synthesis, Formatting) managed by a central Orchestrator.",
      useCase: "High-volume content production, enterprise ETL pipelines.",
      benefits: ["Massive Parallelization", "Task-specific checks"]
    },
    {
      title: "Dynamic Context Injection",
      code: "WP-03",
      desc: "An optimization pattern that prunes and injects context based on the current execution node's specific needs.",
      useCase: "Large-scale RAG systems, complex documentation synthesis.",
      benefits: ["Measure token usage", "Increased Logic Density"]
    },
    {
      title: "The State Transition Map",
      code: "WP-04",
      desc: "A pattern that tracks session state across multi-turn interactions, allowing for 'recovery' from logic failures.",
      useCase: "Long-running AI agents, iterative problem solving.",
      benefits: ["State Persistence", "Failure Recovery"]
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
              <div className="label-tech text-cyan-500">Reference Architecture v2.0</div>
              <div className="flex items-center gap-2 mono text-[length:var(--text-small)] opacity-40">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> LIVE_REFERENCE
              </div>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
              AI Workflow <span className="text-cyan-500">Patterns.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '5rem', lineHeight: 1.6 }}>
              A canonical directory of reusable architectural patterns for deterministic AI execution. 
              These patterns provide the foundational logic for scaling high-fidelity workflows.
            </p>

            {/* Semantic Interlinking */}
            <div className="flex flex-wrap gap-4 mb-10 p-6 bg-[var(--surface2)] border border-[var(--border)] rounded-sm">
              <span className="mono text-[length:var(--text-small)] uppercase opacity-40 w-full mb-2">Technical Dependencies:</span>
              <Link href="/knowledge/taxonomy" className="flex items-center gap-2 text-[length:var(--text-small)] mono hover:text-cyan-500 transition-colors">
                <LinkIcon size={12} /> EC_TAXONOMY_V2
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <Link href="/knowledge/standards" className="flex items-center gap-2 text-[length:var(--text-small)] mono hover:text-cyan-500 transition-colors">
                <LinkIcon size={12} /> PH_STANDARDS_V1
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <Link href="/knowledge/protocols" className="flex items-center gap-2 text-[length:var(--text-small)] mono hover:text-cyan-500 transition-colors">
                <LinkIcon size={12} /> OIM_PROTOCOLS_V1
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {patterns.map((p, i) => (
                <motion.div
                  key={p.code}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-[var(--border)] bg-[var(--surface1)] rounded-sm hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="mono text-[length:var(--text-small)] text-cyan-500 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20">{p.code}</span>
                    <Cpu size={18} className="text-cyan-500 opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{p.title}</h3>
                  <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed h-[60px] overflow-hidden">{p.desc}</p>
                  
                  <div className="space-y-4 pt-8 border-t border-[var(--border)]">
                    <div>
                      <span className="mono text-[length:var(--text-small)] uppercase opacity-40 block mb-2">Strategic Benefit</span>
                      <ul className="space-y-1">
                        {p.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[length:var(--text-small)] mono">
                            <Zap size={10} className="text-cyan-500" /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-12 border border-[var(--border)] bg-[var(--surface1)] rounded-sm text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-8 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center">
                <LayoutGrid className="text-cyan-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Architecture Reference Poster</h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
                Download the high-resolution AI Workflow Patterns reference poster for your workspace or dev team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="btn-primary py-3 px-8 flex items-center gap-2"
                >
                  <Download size={16} /> Print reference
                </button>
                <button 
                  onClick={handleShare}
                  className="btn-outline py-3 px-8 flex items-center gap-2"
                >
                  <Share2 size={16} /> Share Pattern Deck
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="patterns" />
      <Footer />
    </div>
  );
}
