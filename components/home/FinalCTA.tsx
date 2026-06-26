'use client';


import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '6rem 0' }}>
      <div className="container">
        <div className="relative group">
          {/* Technical Telemetry Markers */}
          <div className="absolute -top-3 -left-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] font-bold">System Status: Active Infrastructure</span>
          </div>
          <div className="absolute -bottom-3 -right-3 flex items-center gap-2">
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] font-bold">NodeID: 0x892F</span>
            <div className="w-2 h-2 border border-[var(--accent)]" />
          </div>

          <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--cta-bg)] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center min-h-[450px]">
            {/* Blueprint Grid Background - Theme Aware */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10 px-8 py-20 lg:py-24 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">

              <h2 style={{ fontSize: '3rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, lineHeight: 1.1, marginBottom: '2.5rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Ready to build your <span style={{ color: 'var(--accent)' }}>AI system?</span>
              </h2>
              
              <p style={{ color: 'var(--muted)', fontSize: '1.25rem', marginBottom: '4rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 4rem' }}>
                Stop guessing. Start engineering. Deploy your own <strong>reliable workflow orchestration</strong> in minutes.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link href="/tools" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-4 py-5 px-12 group/btn">
                  START BUILDING WORKFLOWS <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href="/tools/demo" className="btn-outline w-full sm:w-auto flex items-center justify-center py-5 px-12">
                  VIEW DEMO SYSTEM
                </Link>
              </div>

              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="h-[1px] w-24 bg-[var(--border)]" />
                <p className="mono text-[10px] text-[var(--muted)] tracking-[0.5em] uppercase opacity-40">
                  System Thinking • System Logic • Reliable Workflow Orchestration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
