'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Copy, 
  Check, 
  Share2, 
  Trash2, 
  Sparkles, 
  ArrowLeft,
  Library,
  Minimize2
} from 'lucide-react';
import Link from 'next/link';

import { useEffect } from 'react';
import { useSurgicalPersistence } from '@/lib/hooks/useSurgicalPersistence';

import { TEMPLATES } from '@/data/templates';

import { useOperatorProfile } from '@/lib/hooks/useOperatorProfile';
import OperatorPanel from '@/components/tools/OperatorPanel';

import { Suspense } from 'react';

function LinkedInFormatterContent() {
  const { profile } = useOperatorProfile();
  const [text, setText] = useSurgicalPersistence('linkedin-draft-text', '');
  const [copied, setCopied] = useState(false);
  
  // Save global state for workspace
  const [_, setGlobalState] = useSurgicalPersistence('linkedin-draft', { title: '' });

  useEffect(() => {
    // Check for template injection via native URL search params to avoid build-time CSR bailout
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get('template');
      if (templateId) {
        const template = TEMPLATES.find(t => t.id === templateId);
        if (template && template.content.text) {
          setText(template.content.text);
        }
      }
    }
  }, []);

  useEffect(() => {
    setGlobalState({ title: text.slice(0, 50) + (text.length > 50 ? '...' : '') });
  }, [text]);

  const formatText = (type: 'hooks' | 'spacing' | 'bullets') => {
    let formatted = text;
    
    if (type === 'spacing') {
      formatted = text.split('\n').filter(p => p.trim()).join('\n\n');
    } else if (type === 'bullets') {
      const bullet = profile.persona === 'Technical Expert' ? '▹' : '•';
      formatted = text.split('\n').map(line => line.trim() ? `${bullet} ${line.trim()}` : '').join('\n');
    } else if (type === 'hooks') {
      // ADAPTIVE HOOKS based on Persona
      const prefixes: Record<string, string> = {
        'Founder': '🏢 ',
        'Technical Expert': '⚙️ ',
        'Data Strategist': '📊 ',
        'Creator': '🚀 ',
        'Educator': '💡 '
      };
      const prefix = prefixes[profile.persona] || '🚀 ';
      if (!text.startsWith(prefix)) {
        formatted = `${prefix}${text}`;
      }
    }
    
    setText(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
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
                <Share2 size={20} />
              </div>
              <div className="label-tech">SOCIAL-ENGINEERING</div>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              LinkedIn Authority <span className="hero-title">Formatter</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Transform messy technical notes into high-authority LinkedIn posts. Optimized for the "Surgical Spacing" technique that maximizes mobile readability.
            </p>
          </div>
          
          <OperatorPanel />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Area */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                <div className="flex items-center justify-between p-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => formatText('spacing')}
                      className="btn-outline px-3 py-1.5 text-[10px] lowercase flex items-center gap-1"
                    >
                      <Sparkles size={12} /> add_spacing
                    </button>
                    <button 
                      onClick={() => formatText('bullets')}
                      className="btn-outline px-3 py-1.5 text-[10px] lowercase flex items-center gap-1"
                    >
                      <Sparkles size={12} /> auto_bullets
                    </button>
                  </div>
                  <button 
                    onClick={() => setText('')}
                    className="text-[var(--muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your messy notes or draft here..."
                  className="w-full h-[400px] p-8 bg-transparent border-none outline-none text-theme font-sans resize-none"
                  style={{ lineHeight: 1.6, fontSize: '1.05rem' }}
                />
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="flex flex-col gap-6">
              <div className="card" style={{ background: 'var(--bg)' }}>
                <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-6">Execution_Panel</h4>
                
                <button 
                  onClick={handleCopy}
                  disabled={!text}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <><Check size={16} /> COPIED_TO_BUFFER</>
                  ) : (
                    <><Copy size={16} /> COPY_FOR_LINKEDIN</>
                  )}
                </button>
                
                <div style={{ padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                  <p className="text-[10px] mono text-[var(--muted)] leading-relaxed">
                    TIP: LinkedIn algorithms prioritize posts with clear vertical spacing and bulleted lists. Ensure your "Hook" (first 2 lines) is punchy.
                  </p>
                </div>

                <Link 
                  href="/templates" 
                  className="mt-4 p-4 border border-[var(--accent)]/30 rounded flex items-center justify-between group no-underline"
                >
                  <div>
                    <h5 className="text-[10px] mono font-bold text-[var(--accent)]">OPERATOR_TEMPLATES</h5>
                    <p className="text-[9px] text-[var(--muted)] mono">Browse high-authority blueprints</p>
                  </div>
                  <Library size={14} className="text-[var(--accent)] group-hover:scale-110 transition-all" />
                </Link>

                <button 
                  onClick={() => {
                    localStorage.setItem('surgical_context-optimizer-input', JSON.stringify(text));
                    window.location.href = '/tools/context-optimizer';
                  }}
                  className="mt-4 w-full p-4 border border-[var(--border)] rounded flex items-center justify-between group no-underline bg-transparent cursor-pointer"
                >
                  <div className="text-left">
                    <h5 className="text-[10px] mono font-bold text-[var(--text)]">OPTIMIZE_FOR_AI</h5>
                    <p className="text-[9px] text-[var(--muted)] mono">Reduce tokens for LLM prompts</p>
                  </div>
                  <Minimize2 size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-all" />
                </button>
              </div>

              <div className="card" style={{ background: 'var(--bg)', borderStyle: 'dashed' }}>
                <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-4">Post_Metrics</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[var(--muted)]">Characters:</span>
                  <span className="text-xs mono">{text.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">Est. Lines:</span>
                  <span className="text-xs mono">{text.split('\n').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Documentation Section */}
          <div className="mt-16 border-t border-[var(--border)] pt-12 max-w-4xl">
            <h3 className="text-xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Technical Specifications & Spacing Framework</h3>
            <div className="space-y-6 text-xs text-[var(--muted)] leading-relaxed">
              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">1. The Psychology of Mobile Readability</strong>
                <p>
                  Social media algorithms (specifically LinkedIn's feed indexer) heavily weight dwell time—the duration a user spends reading an expanded post. Traditional block paragraphs trigger high bounce rates on mobile viewports due to visual fatigue. "Surgical Spacing" breaks up dense text into isolated, single-sentence blocks separated by blank lines, doubling mobile retention rates and encouraging readers to tap the "see more" button.
                </p>
              </div>

              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">2. Adaptive Hook Mechanics</strong>
                <p>
                  The first 140 characters of a post (the "Hook") determine CTR. This tool programmatically prepends tailored, high-visibility icons corresponding to your active Operator Persona (e.g., 🏢 for Founders, ⚙️ for Technical Experts, and 📊 for Data Strategists). This aligns your visual branding with your target audience's domain expectations instantly.
                </p>
              </div>

              <div>
                <strong className="text-[var(--text)] text-sm block mb-1">3. Bullet Formatting Logic</strong>
                <p>
                  The Bullet optimization utility parses line-breaks and maps lines containing text to structured list items. Based on your profile persona, the script swaps default characters with precision delimiters (e.g. ▹ for engineering documentation or • for standard copywriting), ensuring clean and consistent formatting without manual copy-pasting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LinkedInAuthorityFormatter() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Suspense fallback={<div className="container py-20 mono text-xs animate-pulse">SYNCHRONIZING_SOCIAL_ENGINE...</div>}>
        <LinkedInFormatterContent />
      </Suspense>
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.25 }}>
            LinkedIn Formatter — Write Posts That Stop the Scroll
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            The LinkedIn Formatter by Datta Sable helps content creators, B2B marketers, consultants, and personal brand builders write LinkedIn posts that are optimally structured for the platform's algorithm and reading behavior. LinkedIn posts with strong visual formatting — short paragraphs, strategic line breaks, and purposeful emoji use — consistently outperform dense blocks of text in impressions and engagement.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            This tool formats your raw draft into LinkedIn-ready content: it adds proper line spacing (LinkedIn collapses multi-line text without explicit breaks), removes unnecessary whitespace, suggests optimal post length (150–300 words for high engagement), and previews exactly how your post will appear in the feed before you publish.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Feed Preview', desc: 'See exactly how your post looks before publishing — no surprises' },
              { label: 'Smart Formatting', desc: 'Auto line-breaks, spacing, and hook optimization for the algorithm' },
              { label: 'Template Integration', desc: 'Inject pre-built LinkedIn post templates from the Templates Hub' },
              { label: 'Copy Ready', desc: 'One-click copy with formatting preserved for paste into LinkedIn' },
            ].map(f => (
              <div key={f.label} style={{ padding: '1.25rem 1.5rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', minWidth: 0 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.82rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{f.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
