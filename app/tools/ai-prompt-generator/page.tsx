'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Copy, 
  Check, 
  Wand2, 
  Trash2, 
  Sparkles, 
  ArrowLeft,
  Cpu,
  Target,
  ShieldCheck,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

import { useSurgicalPersistence } from '@/lib/hooks/useSurgicalPersistence';

const PERSONAS = [
  { id: 'engineer', label: 'Product Engineer', icon: '🛠️' },
  { id: 'seo', label: 'SEO Specialist', icon: '📈' },
  { id: 'writer', label: 'Expert Copywriter', icon: '✍️' },
  { id: 'scientist', label: 'Data Scientist', icon: '🧪' },
];

const PLATFORMS = [
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'gpt4', label: 'ChatGPT / GPT-4' },
  { id: 'claude', label: 'Claude 3' },
];

import { TEMPLATES } from '@/data/templates';

import { useOperatorProfile } from '@/lib/hooks/useOperatorProfile';
import OperatorPanel from '@/components/tools/OperatorPanel';

import { Suspense } from 'react';

function PromptGeneratorContent() {
  const { profile } = useOperatorProfile();
  const [topic, setTopic] = useSurgicalPersistence('prompt-topic', '');
  
  // Local persona state that syncs with Operator Profile
  const [persona, setPersona] = useState('engineer');
  const [platform, setPlatform] = useSurgicalPersistence('prompt-platform', 'gemini');
  const [noFluff, setNoFluff] = useState(true);
  const [includeSteps, setIncludeSteps] = useState(true);

  // Sync with Global Operator Profile
  useEffect(() => {
    const mapping: Record<string, string> = {
      'Founder': 'engineer',
      'Technical Expert': 'engineer',
      'Data Strategist': 'scientist',
      'Creator': 'writer',
      'Educator': 'scientist'
    };
    setPersona(mapping[profile.persona] || 'engineer');
  }, [profile.persona]);
  
  // Save global state for workspace
  const [_, setGlobalState] = useSurgicalPersistence('prompt-state', { topic: '', persona: '', platform: '' });

  useEffect(() => {
    // Check for template injection via native URL search params to avoid build-time CSR bailout
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get('template');
      if (templateId) {
        const template = TEMPLATES.find(t => t.id === templateId);
        if (template && template.content) {
          if (template.content.topic) setTopic(template.content.topic);
          if (template.content.persona) setPersona(template.content.persona);
          if (template.content.platform) setPlatform(template.content.platform);
        }
      }
    }
  }, []);

  useEffect(() => {
    setGlobalState({ topic, persona, platform });
  }, [topic, persona, platform]);

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!topic) {
      setGeneratedPrompt('');
      return;
    }

    const personaLabel = PERSONAS.find(p => p.id === persona)?.label;
    const platformLabel = PLATFORMS.find(p => p.id === platform)?.label;

    let prompt = `Act as a ${personaLabel} highly specialized in my request. `;
    prompt += `Your primary goal is ${profile.intent} and your communication style is ${profile.style}. `;
    
    if (platform === 'gemini') {
      prompt += `Optimize this response for Google Gemini's reasoning capabilities. `;
    } else if (platform === 'claude') {
      prompt += `Follow instructions exactly as a Claude model would. `;
    }

    prompt += `\n\n### CONTEXT/TOPIC:\n${topic}\n\n### TASK:\nProvide a detailed, expert-level response regarding the topic above.`;

    if (includeSteps) {
      prompt += `\n\n### FORMAT:\n1. Break your response into clear, actionable steps.\n2. Use technical terminology appropriate for a ${personaLabel}.\n3. Provide code snippets or specific examples where applicable.`;
    }

    if (noFluff || profile.style === 'Surgical') {
      prompt += `\n\n### CONSTRAINTS:\n- DO NOT include conversational filler (e.g., "I'd be happy to help", "Here is the information").\n- Start directly with the answer.\n- Maintain a ${profile.style.toLowerCase()}, professional, and authoritative tone.`;
    }

    setGeneratedPrompt(prompt);
  }, [topic, persona, platform, noFluff, includeSteps, profile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
                <Wand2 size={20} />
              </div>
              <div className="label-tech">NEURAL-ORCHESTRATION</div>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Surgical Prompt <span className="hero-title">Engineer</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Transform simple ideas into high-fidelity "Mega-Prompts" that extract elite-tier performance from AI models like Gemini, Claude, and GPT-4.
            </p>
          </div>

          <OperatorPanel />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="flex flex-col gap-6">
              <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Model_Architecture</h4>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-3 text-xs font-mono border transition-all cursor-pointer rounded-sm ${platform === p.id ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 font-semibold' : 'border-transparent text-[var(--muted)] bg-white/5 hover:bg-white/10 hover:text-[var(--text)]'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} className="text-[var(--accent)]" />
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--text)]">Target_Persona</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`flex items-center gap-3 p-4 border transition-all text-left cursor-pointer rounded-sm ${persona === p.id ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className={`text-xs font-bold ${persona === p.id ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>{p.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-[var(--accent)]" />
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--text)]">Constraints</h4>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between p-3 border border-transparent bg-white/5 rounded-sm cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-xs">Surgical Precision (No Fluff)</span>
                    <input type="checkbox" checked={noFluff} onChange={(e) => setNoFluff(e.target.checked)} className="accent-[var(--accent)]" />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-transparent bg-white/5 rounded-sm cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-xs">Actionable Steps</span>
                    <input type="checkbox" checked={includeSteps} onChange={(e) => setIncludeSteps(e.target.checked)} className="accent-[var(--accent)]" />
                  </label>
                </div>

                <Link 
                  href="/templates" 
                  className="mt-8 p-4 border border-[var(--accent)]/30 rounded flex items-center justify-between group no-underline"
                >
                  <div>
                    <h5 className="text-xs font-mono font-bold text-[var(--accent)]">OPERATOR_TEMPLATES</h5>
                    <p className="text-[11px] text-[var(--muted)] font-mono">Load deep research & agent blueprints</p>
                  </div>
                  <ArrowUpRight size={14} className="text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Input/Output */}
            <div className="flex flex-col gap-6">
              <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                  <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Core_Concept</h4>
                  <button onClick={() => setTopic('')} className="text-[var(--muted)] hover:text-red-500"><RotateCcw size={14} /></button>
                </div>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your idea or task here (e.g. Write a script for a data dashboard)..."
                  className="w-full h-40 p-6 bg-transparent border-none outline-none text-theme resize-none text-sm"
                  style={{ lineHeight: 1.6 }}
                />
              </div>

              <div className="card p-0 overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--accent)' }}>
                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Surgical_Prompt_Output</h4>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="text-[var(--accent)] hover:opacity-80 transition-all flex items-center gap-2 mono text-xs"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />} COPY_PROMPT
                  </button>
                </div>
                <div 
                  className="p-6 h-[250px] overflow-y-auto mono text-xs leading-relaxed text-[var(--muted)]"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {generatedPrompt || 'Your surgical prompt will appear here once you enter a concept...'}
                </div>
              </div>

              {/* Export Node */}
              <div className="card p-6" style={{ background: 'var(--surface2)' }}>
                <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Export_Node</h4>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedPrompt], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'surgical_prompt.md';
                      a.click();
                    }}
                    className="btn-outline flex-1 py-2 text-xs mono"
                    disabled={!generatedPrompt}
                  >
                    EXPORT_MD
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([JSON.stringify({ prompt: generatedPrompt, platform, persona }, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'surgical_prompt.json';
                      a.click();
                    }}
                    className="btn-outline flex-1 py-2 text-xs mono"
                    disabled={!generatedPrompt}
                  >
                    EXPORT_JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Engineering Guide Section */}
          <div className="mt-16 border-t border-[var(--border)] pt-12 max-w-4xl">
            <h3 className="text-xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Advanced Prompt Engineering & Neural Orchestration Guide</h3>
            <div className="space-y-6 text-xs text-[var(--muted)] leading-relaxed">
              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">1. The Structural Prompt Blueprint</strong>
                <p>
                  To get consistent, high-fidelity outputs from large language models (LLMs), prompts must be engineered with clear separation of concerns. This tool automatically compiles your input topic into a structured "Mega-Prompt" composed of four primary blocks: **Target Persona** (establishing context and expertise), **System Intent & Style** (defining formatting guidelines and tone), **Core Concept** (your raw input), and **Hard Constraints** (preventing common failures like conversational filler).
                </p>
              </div>

              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">2. Model-Specific Optimization</strong>
                <p>
                  Different frontier models have varying engineering requirements. Google Gemini responds best to explicit instructions concerning its logical reasoning paths, while Anthropic's Claude prioritizes XML-like structure and strict markdown parsing. This generator automatically appends specialized instructions targeting your selected platform's neural behavior, maximizing response consistency.
                </p>
              </div>

              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">3. Token Economy & Constraint Enforcement</strong>
                <p>
                  Every conversational filler word (such as "Certainly, I can help with that!") wastes context tokens and degrades model reasoning efficiency. By enforcing a strict "Surgical Precision / No Fluff" constraint in the generated system block, this tool instructs the model to omit conversational padding and start directly with the answer, preserving token space and ensuring programmatic stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AIPromptGenerator() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Suspense fallback={<div className="container py-20 mono text-xs animate-pulse">INITIATING_NEURAL_ENGINE...</div>}>
        <PromptGeneratorContent />
      </Suspense>
      
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>DEEP_DIVE_GUIDE</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '2rem', color: 'var(--text)', lineHeight: 1.2, fontFamily: "'Syne', sans-serif" }}>
            The Science of Advanced Prompt Engineering: Eliminating Neural Noise for Production AI
          </h2>

          <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.85 }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Most professionals interact with Large Language Models (LLMs) like Gemini, GPT-4, and Claude using casual, conversational queries. While this works for simple lookups, it fails completely in production environments. Conversational inputs introduce "neural noise"—unnecessary words, ambiguous phrasing, and lack of context boundaries that lead to unpredictable outputs, hallucinations, and high token costs.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              This <strong>Advanced AI Prompt Generator</strong> bridges the gap between conversational ideas and production-grade system prompts. It uses a structured prompt architecture designed to enforce strict logical boundaries, define precise expert roles, adjust output styles dynamically based on your platform, and programmatically eliminate token waste.
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>
              Why Structured System Prompts Outperform Casual Chat
            </h3>
            
            <p style={{ marginBottom: '1.5rem' }}>
              LLMs are probabilistic engines that predict the next logical token based on the input context. When you provide a structured prompt, you constrain the model's probability distribution. By defining a specific <strong>Persona</strong> (such as a Product Engineer or Data Scientist) and enforcing <strong>Hard Constraints</strong> (like banning introductory filler phrases), you guide the attention mechanisms of the model to prioritize functional logic over conversational politeness.
            </p>

            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '2rem' }}>
              {[
                { title: 'Deterministic Personas', desc: 'Instead of saying "write a script," we define the persona\'s professional constraints, ensuring the model adopts the exact formatting standards, coding patterns, and jargon of the target industry.' },
                { title: 'Neural Response Envelopes', desc: 'By setting boundary parameters (such as instructing Gemini to outline its reasoning or demanding that Claude use XML tags for input separation), you create a predictable structure for downstream parsing.' },
                { title: 'Token-Efficient Pruning', desc: 'Removing conversational fluff (e.g., "Sure, here is the information you requested:") is not just about aesthetics—it directly reduces latency and lowers API costs by keeping the prompt density high.' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent)' }}>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.95rem' }}>{item.desc}</span>
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>
              Optimizing Prompts for Google Gemini vs. Claude vs. GPT-4
            </h3>

            <p style={{ marginBottom: '1.5rem' }}>
              Different models are trained on different datasets and reinforcement patterns, meaning a prompt that works for one model might fail on another:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <h4 style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Google Gemini</h4>
                <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Gemini excels at reasoning when prompts are explicitly divided into structural sections using markdown headings. Appending explicit logical instructions (like "Verify each step before displaying the output") helps direct its massive context processing capability.
                </p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <h4 style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Anthropic Claude</h4>
                <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Claude is trained to respond extremely well to XML tags (e.g., <code>&lt;rules&gt;...&lt;/rules&gt;</code>) to isolate system instructions, inputs, and output schemas, preventing instructions from bleeding into the target content.
                </p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <h4 style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>OpenAI GPT-4</h4>
                <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
                  GPT-4 requires clear task hierarchy. Putting rules in the system prompt and using delimiters like triple backticks (```) to separate data sections ensures it respects the absolute priority of system guidelines.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--border)', paddingLeft: '1rem', marginTop: '2rem' }}>
              "The quality of your output is a direct reflection of the constraints you build into your instructions. A perfect prompt does not request creativity; it maps a sandbox." — Datta Sable
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
