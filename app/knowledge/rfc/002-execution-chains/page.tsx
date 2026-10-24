'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { FileText, GitBranch, Zap, Activity, Info, AlertTriangle, Code, Download, Share2, Copy, Network } from 'lucide-react';
import Link from 'next/link';

export default function RFC002() {
  const sections = [
    { id: "abstract", title: "Abstract", content: "This RFC defines the Execution Chain Taxonomy (ECT), a technical classification system for agentic workflows. By standardizing the levels of logic persistence and error isolation, ECT provides a framework for building deterministic AI infrastructure at scale." },
    { id: "levels", title: "Execution Levels", content: "Level 1: Stateless (Atomic). Level 2: Stateful (Iterative). Level 3: Validated (Multi-Agent). Level 4: Hardened (Infrastructure-Integrated)." },
    { id: "orchestration", title: "Orchestration Standard", content: "ECT-compliant systems MUST implement clear transition gates between execution nodes and SHOULD utilize a centralized state manager for complex logical branching." }
  ];

  const bibtex = `@techreport{sable2026rfc002,
  author = {Sable, Datta},
  title = {RFC-002: Execution Chain Taxonomy Standard v2.1.0},
  institution = {Surgical AI Workspace},
  year = {2026},
  url = {https://dattasable.com/knowledge/rfc/002-execution-chains}
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Citation copied to clipboard!');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="boxed-wrapper pt-32 pb-24">
        <Crosshair position="tl" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Link href="/knowledge/rfc" className="mono text-[length:var(--text-small)] text-[var(--accent)] hover:underline flex items-center gap-2">
                ← BACK_TO_RFC_HUB
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="mono text-[length:var(--text-small)] opacity-40">PUBLISHED_MAY_2026</div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="label-tech text-blue-500">RFC-002 Specification</div>
              <div className="flex items-center gap-2 mono text-[length:var(--text-small)] px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> STATUS: PROPOSED
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
              Execution Chain <span className="text-blue-500">Taxonomy.</span>
            </h1>
            
            <div className="p-8 border-l-4 border-blue-500 bg-[var(--surface1)] mb-16 italic text-[var(--muted)] leading-relaxed">
              "Logic without structure is entropy. ECT provides the structural integrity required for mission-critical AI operations."
            </div>

            <div className="space-y-16 mb-12">
              {sections.map((section) => (
                <div key={section.id} id={section.id}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-blue-500 mono text-lg">#</span> {section.title}
                  </h2>
                  <div className="prose prose-invert max-w-none text-[var(--muted)] leading-relaxed">
                    <p>{section.content}</p>
                  </div>
                </div>
              ))}

              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-blue-500 mono text-lg">#</span> Architectural Blueprint
                </h2>
                <div className="space-y-8">
                  <div className="bg-[var(--surface1)] border border-[var(--border)] rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
                      <span className="mono text-[length:var(--text-small)] opacity-40">ECT_SCHEMA.json</span>
                      <button 
                        onClick={() => copyToClipboard('{"level": 3, "agents": ["researcher", "editor"], "validator": "supervisor"}')}
                        className="text-[length:var(--text-small)] mono text-blue-500 hover:underline"
                      >
                        COPY_SCHEMA
                      </button>
                    </div>
                    <pre className="p-8 mono text-[length:var(--text-small)] text-blue-500/80 overflow-x-auto">
{`{
  "rfc": "002",
  "pattern": "VALIDATED_MULTI_AGENT",
  "constraints": {
    "node_isolation": true,
    "state_persistence": "REDIS_STORE",
    "timeout_ms": 30000,
    "max_retries": 2
  },
  "topology": "HUB_AND_SPOKE"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 border border-[var(--border)] bg-[var(--surface2)] rounded-sm mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Cite ECT Standard</h2>
                <button 
                  onClick={() => copyToClipboard(bibtex)}
                  className="flex items-center gap-2 mono text-[length:var(--text-small)] text-blue-500 hover:underline"
                >
                  <Copy size={14} /> COPY_BIBTEX
                </button>
              </div>
              <pre className="p-8 bg-[var(--bg)] border border-[var(--border)] mono text-[length:var(--text-small)] text-blue-500/80 overflow-x-auto">
                {bibtex}
              </pre>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="chains" />
      <Footer />
    </div>
  );
}
