'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { FileText, GitPullRequest, ShieldCheck, Zap, Activity, ChevronRight, Share2, Download } from 'lucide-react';
import Link from 'next/link';

export default function RFCHub() {
  const rfcs = [
    {
      id: "RFC-001",
      title: "Prompt Hardening Standard",
      status: "STABLE",
      ver: "v1.2.4",
      desc: "Formal specification for deterministic prompt engineering and schema enforcement.",
      href: "/knowledge/rfc/001-prompt-hardening"
    },
    {
      id: "RFC-002",
      title: "Execution Chain Taxonomy",
      status: "PROPOSED",
      ver: "v2.1.0",
      desc: "Classification of AI logic patterns for enterprise-grade orchestration.",
      href: "/knowledge/rfc/002-execution-chains"
    },
    {
      id: "RFC-003",
      title: "Operator Intent Mapping",
      status: "DRAFT",
      ver: "v1.4.2",
      desc: "Protocol for persona alignment and intent decomposition in agentic systems.",
      href: "/knowledge/rfc/003-intent-mapping"
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
              <div className="label-tech text-[var(--accent)]">Standards Ecosystem</div>
              <div className="flex items-center gap-2 mono text-[10px] opacity-40">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> REQUEST_FOR_COMMENTS
              </div>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
              Surgical AI <span className="text-blue-500">RFCs.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '5rem', lineHeight: 1.6 }}>
              A technical directory of Requests for Comments (RFCs) defining the core architecture, 
              protocols, and standards of the Surgical AI Workspace.
            </p>

            <div className="space-y-6 mb-12">
              {rfcs.map((rfc, i) => (
                <motion.div
                  key={rfc.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border border-[var(--border)] bg-[var(--surface1)] rounded-sm overflow-hidden"
                >
                  <Link href={rfc.href} className="block p-8 no-underline hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="mono text-[10px] text-blue-500 px-2 py-1 bg-blue-500/10 border border-blue-500/20">{rfc.id}</span>
                          <span className={`mono text-[10px] px-2 py-1 border ${
                            rfc.status === 'STABLE' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                            rfc.status === 'PROPOSED' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                            'text-amber-500 border-amber-500/20 bg-amber-500/5'
                          }`}>
                            {rfc.status}
                          </span>
                          <span className="mono text-[10px] opacity-40">{rfc.ver}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{rfc.title}</h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xl">{rfc.desc}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--surface2)] border border-[var(--border)] group-hover:border-blue-500/50 transition-colors">
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
              <div className="p-10 border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contribute to RFCs</h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-8">
                    Our standards are open for technical review. Submit your feedback, edge cases, 
                    or implementation examples via our GitHub repository.
                  </p>
                </div>
                <button className="btn-primary py-3 px-8 flex items-center gap-2 w-fit">
                  <GitPullRequest size={16} /> Open Pull Request
                </button>
              </div>
              <div className="p-10 border border-[var(--border)] bg-[var(--surface2)] flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Academic Citations</h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-8">
                    Are you citing our frameworks in a research paper or technical blog? 
                    Download our official citation package for standardized attribution.
                  </p>
                </div>
                <button className="btn-outline py-3 px-8 flex items-center gap-2 w-fit">
                  <Download size={16} /> Citation Package (BIB)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <Footer />
    </div>
  );
}
