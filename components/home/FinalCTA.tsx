'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '4rem 0' }}>
      <div className="container">
        <div className="relative group">
          {/* Technical Telemetry Markers */}
          <div className="absolute -top-3 -left-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] font-bold">Newsletter // Active</span>
          </div>
          <div className="absolute -bottom-3 -right-3 flex items-center gap-2">
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] font-bold">Format: Email / RSS</span>
            <div className="w-2 h-2 border border-[var(--accent)]" />
          </div>

          <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--cta-bg)] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center min-h-[400px]">
            {/* Blueprint Grid Background - Theme Aware */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10 px-8 py-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
              <h2 style={{ fontSize: '2.5rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Get One Practical <span style={{ color: 'var(--accent)' }}>Tutorial Every Week</span>
              </h2>
              
              <p style={{ color: 'var(--muted)', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 2rem' }}>
                Join 7,000+ developers and BI professionals. Get actionable, high-quality guides on <strong>Microsoft Fabric, Power BI, SQL, and Next.js</strong> delivered directly to your inbox.
              </p>

              {/* Weekly Preview List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '3rem',
                color: 'var(--muted)',
                fontSize: '0.95rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One technical tutorial
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One practical tip
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One new resource
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '0.25rem', fontFamily: 'var(--mono)' }}>
                  No spam · Unsubscribe anytime
                </div>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--accent)] px-8 py-4 text-[var(--accent)] font-bold mono text-[13px] rounded-sm">
                  <CheckCircle size={18} /> YOU ARE SUBSCRIBED TO THE WEEKLY TUTORIAL!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                  <input
                    type="email"
                    required
                    placeholder="Enter your professional email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      padding: '1rem 1.5rem',
                      color: 'var(--text)',
                      fontSize: '14px',
                      fontFamily: "'Syne', sans-serif",
                      outline: 'none',
                    }}
                    className="focus:border-[var(--accent)] transition-colors rounded-sm"
                  />
                  <button
                    type="submit"
                    className="btn-primary flex items-center justify-center gap-3 py-4 px-8"
                  >
                    GET WEEKLY TUTORIAL <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
