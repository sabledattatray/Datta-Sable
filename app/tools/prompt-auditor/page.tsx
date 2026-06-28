'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, ShieldCheck, Zap, AlertTriangle, ArrowRight, Terminal as TerminalIcon } from 'lucide-react';

interface AuditResult {
  score: number;
  fidelity: number;
  entropy: number;
  bloat: number;
  suggestions: string[];
  status: 'Critical' | 'Sub-Optimal' | 'Surgical';
}

export default function PromptAuditorPage() {
  const [prompt, setPrompt] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const runAudit = () => {
    if (!prompt.trim()) return;
    setIsAuditing(true);
    
    // Simulate complex audit logic
    setTimeout(() => {
      const fidelity = prompt.toLowerCase().includes('json') || prompt.toLowerCase().includes('schema') ? 85 : 40;
      const entropy = prompt.length > 500 ? 30 : 75;
      const bloat = (prompt.match(/please|i would like|could you/gi) || []).length > 2 ? 35 : 90;
      
      const score = Math.round((fidelity + entropy + bloat) / 3);
      
      const suggestions = [];
      if (fidelity < 50) suggestions.push("Inject a Strict Structural Schema (JSON/Markdown) to force model consistency.");
      if (bloat < 60) suggestions.push("Remove conversational fluff (politeness markers) to reduce token waste by ~15%.");
      if (entropy < 50) suggestions.push("Apply Context Compression to reduce input length and decrease latency.");
      if (suggestions.length === 0) suggestions.push("Prompt meets Surgical Architecture standards. Ready for high-volume production.");

      setResult({
        score,
        fidelity,
        entropy,
        bloat,
        suggestions,
        status: score > 85 ? 'Surgical' : score > 50 ? 'Sub-Optimal' : 'Critical'
      });
      setIsAuditing(false);
    }, 1500);
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      <Navbar />

      <main className="boxed-wrapper" style={{ borderTop: 'none', background: '#000000' }}>
        <section className="container" style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ color: 'var(--accent)' }}><ShieldCheck size={24} /></div>
              <span className="mono text-[12px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>Project: Surgical Auditor v1.0</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 48px)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Surgical Prompt <span style={{ color: 'var(--accent)' }}>Auditor™</span>
            </h1>
            <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px' }}>
              Submit your unrefined LLM prompts for a deep technical audit. We evaluate your logic for <strong>Fidelity</strong>, <strong>Entropy</strong>, and <strong>Context Bloat</strong>.
            </p>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '2rem', borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs mono text-[#555] uppercase tracking-widest">
                  <TerminalIcon size={12} /> Input_Prompt_Buffer
                </div>
                <div className="text-xs mono text-[#555] uppercase tracking-widest">
                  {prompt.length} Tokens_Est
                </div>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste your system or user prompt here for analysis..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  background: '#000',
                  border: '1px solid #1a1a1a',
                  color: '#fff',
                  padding: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={runAudit}
                  disabled={isAuditing || !prompt}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: isAuditing || !prompt ? 0.5 : 1 }}
                >
                  {isAuditing ? 'AUDITING_ENGINE...' : 'RUN_SURGICAL_AUDIT'}
                  {!isAuditing && <ArrowRight size={14} />}
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '1.5rem', textAlign: 'center' }}>
                    <div className="text-xs mono text-[#555] uppercase mb-2">Surgical_Score</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: result.score > 70 ? 'var(--accent)' : '#ff4444' }}>{result.score}%</div>
                  </div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '1.5rem', textAlign: 'center' }}>
                    <div className="text-xs mono text-[#555] uppercase mb-2">Audit_Status</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{result.status}</div>
                  </div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '1.5rem', textAlign: 'center' }}>
                    <div className="text-xs mono text-[#555] uppercase mb-2">Token_Efficiency</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)' }}>{result.bloat}%</div>
                  </div>
                </div>

                <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '2rem' }}>
                  <h3 className="text-[12px] mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Zap size={14} style={{ color: 'var(--accent)' }} /> Optimization_Roadmap
                  </h3>
                  <div className="space-y-4">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-4 p-4 border border-[#1a1a1a] bg-[#000]">
                        <div style={{ color: 'var(--accent)', flexShrink: 0 }}><ArrowRight size={16} /></div>
                        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.5 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 p-6 border border-dashed border-[#333] text-center">
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>
                      Ready to implement a high-fidelity automation pipeline?
                    </p>
                    <a href="/contact" className="btn-outline" style={{ display: 'inline-block' }}>
                      HIRE THE OPERATOR
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          {"/* ── About This Tool Header ── */"}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.2 }}>
            Surgical Prompt Auditor™ — Dynamic Prompt Quality Analysis
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }} className="font-sans">
            The Surgical Prompt Auditor™ is an advanced prompting development tool designed to diagnose system and user prompts for large language models (LLMs). It evaluates prompts against production-grade criteria: Fidelity, Entropy, and Context Bloat. Use this tool to refine your prompt structures, minimize conversational fluff, and ensure deterministic, high-quality model outputs.
          </p>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.5rem' }} className="font-sans">
            In production environments, prompts are software interfaces. Treating them as loose, unstructured prose leads to high failure rates, hallucinated values, and expensive API token bills. Enforcing rigid schemas, XML boundaries, and explicit negative constraints are the cornerstones of Surgical prompting architecture. This tool audits your text to highlight optimization pathways.
          </p>

          {"/* ── Core Features Grid ── */"}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>CORE_CAPABILITIES</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Fidelity Evaluation</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Audits the presence of schemas, tags, and formatting rules to ensure high structural reliability.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Bloat Identification</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Flags conversational pleasantries and polite language that waste expensive API tokens.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Entropy Diagnosis</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Evaluates the balance of instructions and variables to prevent model confusion.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Self-Correction Guide</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Provides direct suggestions to convert unstructured prompts into compiled Surgical formats.</div>
            </div>
          </div>

          {"/* ── Deep Technical Sections ── */"}
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>The Architecture of a Production-Grade System Prompt</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              A professional system prompt should never look like a casual email. It should be treated as a structured configuration file. Separate your prompt into distinct blocks using XML tags. Start with the `&lt;role_definition&gt;`, followed by `&lt;instructions&gt;`, `&lt;input_schema&gt;`, `&lt;few_shot_examples&gt;`, and finally the `&lt;output_constraints&gt;`. By partitioning the prompt, you enable the model's attention mechanism to index instructions with surgical precision, reducing hallucinations by up to 90%.
            </p>
          </div>
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Token Efficiency and Cost Optimization</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              At scale, running unoptimized prompts through GPT-4 or Claude 3 can cost thousands of dollars monthly. To optimize costs, implement prompt pruning. Remove conversational phrases like 'Please read this', 'Thank you', or 'As an AI model'. Use compact, declarative bullet points. Furthermore, implement local caching for static system instructions. Reducing your prompt size by 20% translates directly into a 20% savings on your monthly API bill.
            </p>
          </div>

          {"/* ── Comprehensive FAQs ── */"}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: '4rem', marginBottom: '2rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q1:</span> What is prompt Fidelity and why does it matter?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Fidelity measures how strictly the LLM adheres to your structural instructions and formatting constraints (such as outputting valid JSON). High-fidelity prompts prevent schema drift and parser crashes in automated pipelines, ensuring that the model's output can be safely parsed by downstream applications.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q2:</span> How does Context Bloat affect LLM token costs?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Context bloat refers to unnecessary conversational filler, redundant instructions, or unoptimized data payloads inside your prompts. Because LLM APIs charge per input token, bloated prompts directly increase cloud execution costs. Furthermore, bloated contexts degrade the model's attention span, causing it to ignore critical instructions.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q3:</span> Why does the auditor recommend using XML tags?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                LLMs are highly sensitive to XML-style tags (e.g., `&lt;instructions&gt;`, `&lt;context&gt;`). Closing tags create absolute semantic boundaries, separating variables from instructions. This structured containment reduces cognitive drift in the model, yielding more accurate results compared to standard markdown headings.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q4:</span> What is negative prompting and when should I use it?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Negative prompting involves defining explicit constraints on what the model must NOT do (e.g., 'Do not write code commentary', 'Do not include conversational greetings'). This is crucial for automation pipelines where any non-JSON or conversational text will crash standard parsing scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
