'use client';

import { useState } from 'react';
import { Send, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulated capture - in a real app, this links to Beehiiv/ConvertKit/Substack
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="section py-20 bg-[var(--surface2)] border-y border-[var(--border)]">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Value Proposition */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[var(--accent)]" />
                <span className="mono text-[length:var(--text-small)] font-bold tracking-widest text-[var(--accent)] uppercase">Audience_Ownership</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Join the <span className="hero-title">Operator Dispatch</span>
              </h2>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-8">
                Weekly surgical insights on AI workflow engineering, technical authority systems, and creator infrastructure. No fluff. Only precision-engineered frameworks.
              </p>
              
              <div className="flex flex-col gap-4">
                 {[
                   'Signature Frameworks™ Weekly',
                   'New Blueprint Alerts',
                   'Workflow Compression Tips',
                   'Zero Spam Policy'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-[length:var(--text-small)] mono text-[var(--muted)]">
                      <Check size={12} className="text-[var(--accent)]" />
                      {item.toUpperCase()}
                   </div>
                 ))}
              </div>
            </div>

            {/* Capture Form */}
            <div className="card p-8 md:p-12" style={{ background: 'var(--bg)' }}>
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">ACCESS_GRANTED</h3>
                  <p className="text-sm text-[var(--muted)] mono">Welcome to the dispatch, Operator.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h4 className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)] mb-8 text-center">Identity_Verification</h4>
                  
                  <div className="relative mb-6">
                    <input 
                      type="email" 
                      placeholder="Enter professional email..."
                      aria-label="Email address for newsletter"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded p-4 text-sm mono focus:border-[var(--accent)] outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                  >
                    {status === 'loading' ? 'VERIFYING...' : (
                      <>
                        SECURE_ACCESS <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </>
                    )}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-[length:var(--text-small)] mono text-[var(--muted)] opacity-60">
                    <ShieldCheck size={12} />
                    ENCRYPTED_SIGNUP // OPERATOR_INFRASTRUCTURE
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
