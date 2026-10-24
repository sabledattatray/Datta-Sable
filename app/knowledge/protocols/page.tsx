'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { UserCog, Target, Fingerprint, GitMerge, FileCheck, Layers, Link as LinkIcon, Download, CheckCircle2, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ProtocolsPage() {
  const handleDownload = () => { window.print(); };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Operator Intent Mapping Protocol | Datta Sable',
        text: 'Review the technical protocol for professional AI intent alignment.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Protocol URL copied to clipboard!');
    }
  };

  const steps = [
    {
      title: "Persona Extraction",
      code: "IM-01",
      desc: "Identifying the professional identity and technical authority of the operator to align system tone.",
      details: ["Authority Level: Expert", "Language: Technical/Academic", "Goal: Precision Output"]
    },
    {
      title: "Intent Decomposition",
      code: "IM-02",
      desc: "Breaking down unstructured human goals into discrete, actionable logic nodes.",
      details: ["Primary Intent", "Secondary Constraints", "Validation Requirements"]
    },
    {
      title: "Structural Alignment",
      code: "IM-03",
      desc: "Mapping the extracted intent to a specific Execution Chain pattern (EC-01 to EC-04).",
      details: ["Logic Path Selection", "Latency Optimization", "Error Handlers"]
    },
    {
      title: "Fidelity Verification",
      code: "IM-04",
      desc: "Automated audit of the AI output against the original human intent schema.",
      details: ["Hallucination Gate", "Schema Matching", "Intent Drift Audit"]
    }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="boxed-wrapper" style={{ padding: '12rem 2rem 8rem 2rem' }}>
        <Crosshair position="tl" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="label-tech text-[var(--accent)]" style={{ fontSize: 'var(--text-small)', fontWeight: 700, letterSpacing: '0.1em' }}>Protocol Specification v1.4.2</div>
              <div className="flex items-center gap-2 mono text-[length:var(--text-small)] opacity-60 font-bold tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /> STABLE_RELEASE
              </div>
            </div>
            
            <h1 style={{ fontSize: '48px', fontFamily: "'Syne', sans-serif", fontWeight: 400, marginBottom: '2rem', lineHeight: 1.1 }}>
              Operator Intent <span style={{ color: 'var(--accent)' }}>Mapping™.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.25rem', marginBottom: '5rem', lineHeight: 1.7 }}>
              The definitive protocol for aligning Large Language Model execution with professional 
              human persona and authority. This framework eliminates the "Intent Gap" in enterprise AI.
            </p>

            {/* Semantic Links */}
            <div className="flex flex-wrap items-center gap-6 rounded-sm shadow-md" style={{ padding: '1.75rem 2.5rem', marginBottom: '6rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <span className="mono text-[length:var(--text-small)] uppercase opacity-50 w-full mb-1 font-bold tracking-widest">Related Standards:</span>
              <Link href="/knowledge/taxonomy" className="flex items-center gap-2.5 text-[length:var(--text-small)] mono font-bold hover:text-[var(--accent)] transition-colors no-underline">
                <LinkIcon size={14} className="text-[var(--accent)]" /> EXECUTION_CHAIN_TAXONOMY_V2
              </Link>
              <div className="w-px h-4 bg-[var(--border)] hidden sm:block" />
              <Link href="/knowledge/standards" className="flex items-center gap-2.5 text-[length:var(--text-small)] mono font-bold hover:text-[var(--accent)] transition-colors no-underline">
                <LinkIcon size={14} className="text-[var(--accent)]" /> PROMPT_HARDENING_STANDARDS_V1
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginBottom: '8rem' }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-1/4">
                      <div className="sticky top-32 pt-2">
                        <span className="mono text-[length:var(--text-small)] text-[var(--accent)] block mb-3 font-bold tracking-widest">{step.code}</span>
                        <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{step.title}</h3>
                        <div className="w-16 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-700 shadow-[0_0_8px_var(--accent)]" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-sm shadow-lg hover:border-[var(--accent)] transition-all duration-300" style={{ padding: '3rem', background: 'var(--surface1)', border: '1px solid var(--border)' }}>
                      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>{step.desc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[var(--border)] border-opacity-60">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle2 size={15} className="text-[var(--accent)] flex-shrink-0" />
                            <span className="mono text-[length:var(--text-small)] font-bold opacity-80 uppercase tracking-wider">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '3rem', marginBottom: '8rem' }}>
              <div className="rounded-sm shadow-xl flex flex-col justify-between" style={{ padding: '3.5rem 3rem', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Technical Moat Analysis</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
                    The OIM Protocol creates a "Technical Moat" by encoding your unique professional reasoning 
                    into the system's logic loop. AI-generated assets still require subject-matter review, factual checks and clear disclosure.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-6 border-t border-[var(--border)] border-opacity-60">
                  <button 
                    onClick={handleDownload}
                    className="btn-primary flex items-center gap-2.5 font-bold tracking-wider"
                    style={{ padding: '1rem 1.75rem', fontSize: 'var(--text-small)' }}
                  >
                    <Download size={16} /> PRINT REFERENCE
                  </button>
                  <button 
                    onClick={handleShare}
                    className="btn-outline flex items-center gap-2.5 font-bold tracking-wider"
                    style={{ padding: '1rem 1.75rem', fontSize: 'var(--text-small)' }}
                  >
                    <Share2 size={16} /> SHARE
                  </button>
                </div>
              </div>
              <div className="rounded-sm shadow-xl flex flex-col justify-center" style={{ padding: '3.5rem 3rem', border: '1px solid var(--border)', background: 'var(--surface2)' }}>
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-[var(--border)] border-opacity-60">
                  <Fingerprint size={36} className="text-[var(--accent)] flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xl mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Persona Integrity</h4>
                    <p className="text-[length:var(--text-small)] mono uppercase font-bold text-[var(--accent)] tracking-widest">System Security Layer</p>
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8 }} className="italic font-light">
                  "Intent Mapping is the difference between a tool that 'chats' and a tool that 'executes' on your behalf."
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="protocols" />
      <Footer />
    </div>
  );
}
