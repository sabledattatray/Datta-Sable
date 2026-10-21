'use client';

import Navbar from '@/components/Navbar';
import KnowledgePractice from '@/components/KnowledgePractice';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { motion } from 'framer-motion';
import { FileText, UserCog, Zap, Activity, Info, AlertTriangle, Code, Download, Share2, Copy, Target } from 'lucide-react';
import Link from 'next/link';

export default function RFC003() {
  const sections = [
    { id: "abstract", title: "Abstract", content: "Operator Intent Mapping (OIM) is a protocol for aligning Large Language Model (LLM) execution with professional human persona and tactical goals. This RFC specifies the standards for persona injection, intent decomposition, and output alignment in expert-tier AI systems." },
    { id: "protocol", title: "Alignment Protocol", content: "Phase 1: Persona Calibration. Phase 2: Intent Decomposition (Hierarchical). Phase 3: Actionable Node Mapping. Phase 4: Feedback Loop Integration." },
    { id: "compliance", title: "Compliance Standards", content: "OIM-compliant prompts MUST include a defined 'Operator Persona' and SHOULD utilize 'Tactical Constraints' to prevent intent drift." }
  ];

  const bibtex = `@techreport{sable2026rfc003,
  author = {Sable, Datta},
  title = {RFC-003: Operator Intent Mapping Protocol v1.4.2},
  institution = {Surgical AI Workspace},
  year = {2026},
  url = {https://dattasable.com/knowledge/rfc/003-intent-mapping}
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
              <Link href="/knowledge/rfc" className="mono text-[10px] text-[var(--accent)] hover:underline flex items-center gap-2">
                ← BACK_TO_RFC_HUB
              </Link>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="mono text-[10px] opacity-40">PUBLISHED_MAY_2026</div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="label-tech text-blue-500">RFC-003 Specification</div>
              <div className="flex items-center gap-2 mono text-[10px] px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> STATUS: DRAFT
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
              Operator Intent <span className="text-blue-500">Mapping.</span>
            </h1>
            
            <div className="p-8 border-l-4 border-blue-500 bg-[var(--surface1)] mb-16 italic text-[var(--muted)] leading-relaxed">
              "The gap between human thought and machine execution is where value is lost. OIM bridges this gap through rigorous persona alignment."
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
                  <span className="text-blue-500 mono text-lg">#</span> Implementation Blueprint
                </h2>
                <div className="space-y-8">
                  <div className="bg-[var(--surface1)] border border-[var(--border)] rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
                      <span className="mono text-[10px] opacity-40">INTENT_MAP.json</span>
                      <button 
                        onClick={() => copyToClipboard('{"persona": "SURGICAL_ANALYST", "intent_depth": 3}')}
                        className="text-[10px] mono text-blue-500 hover:underline"
                      >
                        COPY_INTENT_MAP
                      </button>
                    </div>
                    <pre className="p-8 mono text-[12px] text-blue-500/80 overflow-x-auto">
{`{
  "rfc": "003",
  "persona_profile": {
    "role": "TECHNICAL_FOUNDER",
    "authority_tone": "SURGICAL",
    "bias": "DETERMINISTIC_LOGIC"
  },
  "intent_vectors": [
    { "goal": "DATA_SYNTHESIS", "granularity": "HIGH" },
    { "goal": "SYSTEM_AUDIT", "granularity": "CRITICAL" }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 border border-[var(--border)] bg-[var(--surface2)] rounded-sm mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Cite OIM Protocol</h2>
                <button 
                  onClick={() => copyToClipboard(bibtex)}
                  className="flex items-center gap-2 mono text-[10px] text-blue-500 hover:underline"
                >
                  <Copy size={14} /> COPY_BIBTEX
                </button>
              </div>
              <pre className="p-8 bg-[var(--bg)] border border-[var(--border)] mono text-[11px] text-blue-500/80 overflow-x-auto">
                {bibtex}
              </pre>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <KnowledgePractice topic="intent" />
      <Footer />
    </div>
  );
}
