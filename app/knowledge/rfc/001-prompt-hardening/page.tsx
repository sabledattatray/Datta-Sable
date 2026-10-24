'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Zap, Activity, Info, AlertTriangle, Code, Download, Share2, Copy } from 'lucide-react';
import Link from 'next/link';

export default function RFC001() {
  const sections = [
    { id: "abstract", title: "Abstract", content: "This site-authored proposal describes output contracts, independent validation, bounded retries, and context preparation. It does not make a model deterministic or guarantee factual accuracy." },
    { id: "terminology", title: "Terminology", content: "Validation node: an application stage that checks an output contract. Evidence gate: a source check with an unresolved outcome when support is missing. Neither check proves every field correct." },
    { id: "specification", title: "Specification", content: "Systems MUST enforce output schemas via structural markers. Systems SHOULD implement recursive self-audit cycles. Systems MAY prune redundant semantic tokens for latency optimization." }
  ];

  const bibtex = `@techreport{sable2026rfc001,
  author = {Sable, Datta},
  title = {RFC-001: Prompt Hardening Standard v1.2.4},
  institution = {Surgical AI Workspace},
  year = {2026},
  url = {https://dattasable.com/knowledge/rfc/001-prompt-hardening}
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
              <div className="label-tech text-blue-500">RFC-001 Specification</div>
              <div className="flex items-center gap-2 mono text-[length:var(--text-small)] px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> STATUS: STABLE
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
              Prompt <span className="text-blue-500">Hardening</span> Standard.
            </h1>
            
            <div className="p-8 border-l-4 border-blue-500 bg-[var(--surface1)] mb-16 italic text-[var(--muted)] leading-relaxed">
              "To scale AI infrastructure, we must treat the prompt not as a request, but as an engineered circuit."
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
                  <span className="text-blue-500 mono text-lg">#</span> Implementation Kit
                </h2>
                <div className="space-y-8">
                  <div className="bg-[var(--surface1)] border border-[var(--border)] rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
                      <span className="mono text-[length:var(--text-small)] opacity-40">SURGICAL_CONFIG.json</span>
                      <button 
                        onClick={() => copyToClipboard('{"enforce_schema": true, "hallucination_gate": "RECURSIVE"}')}
                        className="text-[length:var(--text-small)] mono text-blue-500 hover:underline"
                      >
                        COPY_CONFIG
                      </button>
                    </div>
                    <pre className="p-8 mono text-[length:var(--text-small)] text-blue-500/80 overflow-x-auto">
{`{
  "version": "1.2.4",
  "protocol": "PH-S01",
  "enforcement": {
    "strict_schema": true,
    "hallucination_gate": "RECURSIVE_VALIDATION",
    "validation_nodes": 3,
    "retry_logic": "EXPONENTIAL_BACKOFF"
  },
  "markers": {
    "intent_start": "[[SURGICAL_INTENT]]",
    "logic_end": "[[SURGICAL_FINALIZE]]"
  }
}`}
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-[var(--border)] bg-[var(--surface2)]">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Code size={14} className="text-blue-500" /> Starter Template
                      </h4>
                      <p className="text-[length:var(--text-small)] text-[var(--muted)] leading-relaxed mb-4">
                        A pre-configured system prompt template with structural markers and logical boundaries.
                      </p>
                      <Link href="/templates/token-saving-system-prompt" className="text-[length:var(--text-small)] mono text-[var(--accent)] font-bold underline">
                        VIEW PROMPT EXAMPLE
                      </Link>
                    </div>
                    <div className="p-6 border border-[var(--border)] bg-[var(--surface2)]">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Zap size={14} className="text-blue-500" /> Reference App
                      </h4>
                      <p className="text-[length:var(--text-small)] text-[var(--muted)] leading-relaxed mb-4">
                        A worked guide to preparing source context and checking the result.
                      </p>
                      <Link href="/knowledge/optimizing-ai-context-windows" className="text-[length:var(--text-small)] mono text-[var(--accent)] font-bold underline">
                        READ WORKED GUIDE
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-blue-500 mono text-lg">#</span> Security Considerations
                </h2>
                <div className="p-8 border border-amber-500/20 bg-amber-500/5 rounded-sm">
                  <div className="flex items-center gap-3 mb-4 text-amber-500">
                    <AlertTriangle size={18} />
                    <span className="mono text-[length:var(--text-small)] uppercase font-bold tracking-widest">Advisory</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    Improper schema enforcement can lead to injection vulnerabilities where malformed AI 
                    outputs are executed by downstream systems. Always implement a secondary validation gate.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-12 border border-[var(--border)] bg-[var(--surface2)] rounded-sm mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Cite This Specification</h2>
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
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => window.print()} className="btn-primary py-2 px-6 flex items-center gap-2 text-[length:var(--text-small)] mono">
                  <Download size={14} /> PRINT_REFERENCE
                </button>
                <button onClick={() => copyToClipboard(window.location.href)} className="btn-outline py-2 px-6 flex items-center gap-2 text-[length:var(--text-small)] mono">
                  <Share2 size={14} /> COPY_LINK
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="hardening" />
      <Footer />
    </div>
  );
}
