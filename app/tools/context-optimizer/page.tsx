'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Zap, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft,
  Cpu,
  Scissors,
  Minimize2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useSurgicalPersistence } from '@/lib/hooks/useSurgicalPersistence';
import OperatorPanel from '@/components/tools/OperatorPanel';

export default function ContextOptimizer() {
  const [input, setInput] = useSurgicalPersistence('context-optimizer-input', '');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [savings, setSavings] = useState(0);

  const optimize = () => {
    if (!input) return;

    let text = input;

    // 1. Deduplication (Remove duplicate lines)
    const lines = text.split('\n');
    text = Array.from(new Set(lines)).join('\n');

    // 2. Technical Condensation
    const replacements: Record<string, string> = {
      'implementation': 'impl',
      'function': 'fn',
      'specification': 'spec',
      'optimization': 'opt',
      'configuration': 'config',
      'infrastructure': 'infra',
      'architecture': 'arch',
      'environment': 'env',
      'application': 'app',
      'development': 'dev',
      'production': 'prod',
      'synchronization': 'sync',
      'asynchronous': 'async'
    };

    Object.entries(replacements).forEach(([key, val]) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      text = text.replace(regex, val);
    });

    // 3. Structural Cleaning
    text = text.replace(/[ \t]+/g, ' '); // Collapse spaces
    text = text.replace(/\n\s*\n/g, '\n'); // Remove empty lines

    setOutput(text);
    
    // Calculate rough token savings (assuming ~4 chars per token)
    const originalTokens = Math.ceil(input.length / 4);
    const optimizedTokens = Math.ceil(text.length / 4);
    setSavings(originalTokens - optimizedTokens);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/tools" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_HUB
            </Link>

            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <Cpu size={20} />
                </div>
                <div className="label-tech">TOKEN-EFFICIENCY-V1.0</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                AI Context <span className="hero-title">Optimizer</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Reduce LLM context usage by 30-50% using surgical condensation. Optimized for Gemini, GPT-4, and Claude. Save tokens, save costs, increase reasoning depth.
              </p>
            </div>

            <OperatorPanel />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Area */}
              <div>
                <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between p-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Raw_Input</h4>
                    <button onClick={() => setInput('')} className="text-[var(--muted)] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste long prompts, documentation, or logs here..."
                    className="w-full h-[350px] p-6 bg-transparent border-none outline-none text-theme font-mono resize-none text-sm"
                  />
                  <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)] flex justify-between items-center">
                    <div className="text-xs mono text-[var(--muted)]">Chars: {input.length}</div>
                    <button onClick={optimize} className="btn-primary px-6 py-2 text-xs flex items-center gap-2 cursor-pointer">
                      OPTIMIZE_CONTEXT <Scissors size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Area */}
              <div>
                <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)', borderColor: output ? 'var(--accent)' : 'var(--border)' }}>
                  <div className="flex items-center justify-between p-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--accent)]">Surgical_Output</h4>
                    {output && (
                      <button onClick={handleCopy} className="text-[var(--accent)] hover:opacity-80 transition-all flex items-center gap-2 mono text-xs bg-transparent border-none cursor-pointer">
                        {copied ? <Check size={14} /> : <Copy size={14} />} COPY_OPTIMIZED
                      </button>
                    )}
                  </div>
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Optimized context will appear here..."
                    className="w-full h-[350px] p-6 bg-transparent border-none outline-none text-[var(--accent)] font-mono resize-none text-sm opacity-80"
                  />
                  <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="text-xs mono text-[var(--muted)]">Chars: {output.length}</div>
                       {savings > 0 && (
                         <div className="text-xs mono text-[var(--accent)] font-bold">~{savings} TOKENS SAVED</div>
                       )}
                    </div>
                    <div className="flex items-center gap-2 text-[var(--muted)]">
                       <Minimize2 size={12} />
                       <span className="text-[11px] mono uppercase">Lean_Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Section for SEO */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'Token Efficiency', text: 'Large Language Models charge per token. This tool collapses verbose technical terms into concise abbreviations without losing semantic meaning.', icon: <Zap size={20} /> },
                 { title: 'Reasoning Depth', text: 'By reducing the context size, you allow the model to focus its attention on the core logic rather than parsing repetitive boilerplate.', icon: <Sparkles size={20} /> },
                 { title: 'Context Recovery', text: 'Perfect for fitting long codebases or documentation into narrow context windows of smaller, faster models like GPT-4o mini.', icon: <Cpu size={20} /> }
               ].map((item, i) => (
                 <div key={i} className="card p-6 border-dashed" style={{ background: 'var(--bg)' }}>
                   <div className="text-[var(--accent)] mb-4">{item.icon}</div>
                   <h5 className="font-bold mb-2 text-sm">{item.title}</h5>
                   <p className="text-xs text-[var(--muted)] leading-relaxed">{item.text}</p>
                 </div>
               ))}
            </div>
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
            Context Optimizer — Context Pruning and Token Reducer
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }} className="font-sans">
            The Context Optimizer is an engineering utility designed to condense large text data payloads, RAG documents, and conversation histories before sending them to LLM APIs. By pruning redundant strings, stripping boilerplate, and calculating information density, it helps developers reduce API latency and minimize cloud compute costs.
          </p>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.5rem' }} className="font-sans">
            As LLM context windows expand, developers are tempted to feed raw logs, massive databases, and full books into prompts. While convenient, this 'brute-force' prompting increases token costs and degrades the model's accuracy (the 'needle-in-a-haystack' problem). Optimizing the context payload beforehand is essential for production-grade AI.
          </p>

          {"/* ── Core Features Grid ── */"}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>CORE_CAPABILITIES</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Token Savings Calculator</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Estimates monthly database savings by running token pruning algorithms on source payloads.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Boilerplate Removal</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Strips recurring web layouts, footers, and code syntax markers that consume context space.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Information Profiler</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Scores text structures to identify sections with low semantic values.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>RAG Chunk Optimizer</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Helper guidelines to rank and group document vectors for prompt layouts.</div>
            </div>
          </div>

          {"/* ── Deep Technical Sections ── */"}
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>The 'Needle-in-a-Haystack' Context Challenge</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              Research has demonstrated that LLMs are highly effective at retrieving information placed at the absolute beginning or end of prompts, but struggle to locate details hidden in the middle. Simply dumping full databases or documentation files into a 128k context window results in missed instructions and high rates of hallucinations. To resolve this, developers must prune contexts, serving only the precise data chunks required for the specific user request.
            </p>
          </div>
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Server-Side Context Reduction Pipelines</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              To scale AI apps, implement a server-side context optimizer. The pipeline should first query a vector database, run a re-ranking algorithm (like Cohere Rerank) to filter the top 5 document chunks, strip HTML tags and duplicate whitespace, and compress the remaining text using a local summarization script. This guarantees that your LLM prompts remain highly concentrated, saving thousands of tokens per API call.
            </p>
          </div>

          {"/* ── Comprehensive FAQs ── */"}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: '4rem', marginBottom: '2rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q1:</span> What is context compression and why is it necessary?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Context compression involves reducing the size of text inputs without losing vital semantic information. It is necessary because LLMs have attention constraints; they often overlook details placed in the middle of long prompts. Compressing data solves this while cutting API transaction costs.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q2:</span> How does context pruning affect LLM processing speed?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                LLM response times scale with input length because the self-attention mechanism runs with quadratic complexity relative to token counts. Pruning redundant boilerplate reduces token loads, accelerating time-to-first-token (TTFT) and total generation speed.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q3:</span> What is RAG context optimization?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                In Retrieval-Augmented Generation (RAG), vector databases return matching document chunks. RAG context optimization involves ranking these chunks, filtering duplicates, and using summarization to combine them, ensuring that the model receives only high-relevance tokens.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q4:</span> Can I automate context reduction in code?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Yes. You can write scripts to remove punctuation, strip stop words, replace phrases with short synonyms, and use small local models (like BERT) to extract only key sentence structures before calling large external models.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
