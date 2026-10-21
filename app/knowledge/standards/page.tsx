'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Terminal, CheckCircle2, Zap, AlertTriangle, FileCode, Cpu, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function StandardsPage() {
  const standards = [
    {
      title: "Structural Schema Enforcement",
      code: "PH-S01",
      desc: "Mandatory JSON or Markdown schema definition within the system prompt to force structural fidelity.",
      impact: "Validate the output against a parser and reject invalid records."
    },
    {
      title: "Deterministic Constraint Mapping",
      code: "PH-S02",
      desc: "Defining absolute boundaries and 'No-Go' zones to prevent model drift and creative hallucination.",
      impact: "Check outputs against task constraints; prompts cannot guarantee absence of drift."
    },
    {
      title: "Recursive Validation Nodes",
      code: "PH-S03",
      desc: "Self-correction loops where the model audits its own logic before finalizing the output string.",
      impact: "Use an independent labelled evaluation set to measure whether a revision helps."
    },
    {
      title: "Context Window Compression",
      code: "PH-S04",
      desc: "Semantic pruning of redundant tokens to increase information density and reduce latency.",
      impact: "Measure token usage and task accuracy before and after compression."
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
              <div className="label-tech text-emerald-500">Internal design notes</div>
              <div className="flex items-center gap-2 mono text-[10px] opacity-40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> DEPLOYED_STABLE
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
              Prompt <span className="text-emerald-500">Hardening™</span> Standards.
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '5rem', lineHeight: 1.6 }}>
              Local conventions for defining output contracts, testing task constraints, and handling
              failures. These notes are design guidance, not an industry certification.
            </p>

            {/* Semantic Links */}
            <div className="flex flex-wrap gap-4 mb-10 p-6 bg-[var(--surface2)] border border-[var(--border)] rounded-sm">
              <span className="mono text-[10px] uppercase opacity-40 w-full mb-2">Technical References:</span>
              <Link href="/knowledge/taxonomy" className="flex items-center gap-2 text-[11px] mono hover:text-emerald-500 transition-colors">
                <LinkIcon size={12} /> EXECUTION_TAXONOMY_V2
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <Link href="/knowledge/protocols" className="flex items-center gap-2 text-[11px] mono hover:text-emerald-500 transition-colors">
                <LinkIcon size={12} /> INTENT_PROTOCOLS_V1
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {standards.map((s, i) => (
                <motion.div
                  key={s.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-[var(--border)] bg-[var(--surface1)] rounded-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="mono text-[10px] text-emerald-500 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20">{s.code}</span>
                    <ShieldCheck size={18} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">{s.desc}</p>
                  <div className="p-4 bg-[var(--surface2)] border-l-2 border-emerald-500">
                    <p className="text-[11px] mono uppercase tracking-wider opacity-60 mb-1">Measured Impact</p>
                    <p className="text-[12px] font-bold">{s.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: 'Syne, sans-serif' }}>Implementation <span className="text-emerald-500">Blueprint</span></h2>
              <div className="bg-[var(--surface1)] border border-[var(--border)] rounded-sm overflow-hidden">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="mono text-[10px] opacity-40">SURGICAL_HARDENING_PROTOCOL.yaml</span>
                </div>
                <div className="p-8 overflow-x-auto">
                  <pre className="text-[13px] mono text-emerald-500/90 leading-relaxed">
{`protocol:
  version: 2.1.4
  id: PH-S01-ENFORCER
  constraints:
    output_format: JSON_STRICT
    hallucination_gate: RECURSIVE_VALIDATION
    context_window: COMPRESSED_SEMANTIC
  schema:
    required_keys: [intent, execution_path, output_fidelity]
    validation_loop:
      on_fail: REGENERATE_WITH_HINT
      max_retries: 3
  intent_mapping:
    persona: SURGICAL_ANALYST
    authority_tone: TECHNICAL_PRECISION`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Standards Matter</h2>
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  In the early days of AI, "better prompts" were considered an art. In the enterprise era, 
                  <strong>Prompt Hardening</strong> is an engineering discipline. Without strict standards, 
                  AI outputs suffer from entropy, leading to high failure rates and unmanageable technical debt.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-emerald-500">Measure</span>
                    <span className="mono text-[10px] uppercase opacity-40">Failure rate</span>
                  </div>
                  <div className="w-px h-10 bg-[var(--border)]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-emerald-500">Validate</span>
                    <span className="mono text-[10px] uppercase opacity-40">Schema conformance</span>
                  </div>
                </div>
              </div>
              <div className="p-8 border border-[var(--border)] bg-[var(--surface2)] rounded-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Lock size={20} className="text-[var(--accent)]" />
                  <h4 className="font-bold">Citation Reference</h4>
                </div>
                <p className="text-sm text-[var(--muted)] mb-6 italic leading-relaxed">
                  "Sable, D. (2026). Prompt Hardening™: A Structural Framework for Deterministic AI. 
                  Surgical AI Workspace Standards v2.1."
                </p>
                <button onClick={() => navigator.clipboard.writeText("Sable, D. (2026). Prompt hardening: internal design notes. https://dattasable.com/knowledge/standards")} className="w-full btn-outline py-3 text-[12px] mono uppercase tracking-widest">
                  Copy Citation (APA)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="standards" />
      <Footer />
    </div>
  );
}
