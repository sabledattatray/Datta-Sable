'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, Clock, Database, BookOpen, Zap, LucideIcon } from 'lucide-react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  code: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { value: 120, suffix: '+', label: 'Technical Articles', code: 'ART-CNT', icon: BookOpen },
  { value: 25, suffix: '+', label: 'Interactive Tools', code: 'TOL-CNT', icon: Zap },
  { value: 300, suffix: '+', label: 'Indexed Pages', code: 'IDX-CNT', icon: Database },
  { value: 15, suffix: '', label: 'Technical Categories', code: 'CAT-CNT', icon: BarChart3 },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(ts => step(ts, startTime));
    };
    requestAnimationFrame(ts => step(ts, ts));
  }, [inView, value]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function TechLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="label-tech">{children}</p>
    </div>
  );
}

export default function StatsGrid() {
  return (
    <section className="section" style={{ background: 'var(--surface2)', padding: '3rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="container relative z-10">
        <div className="flex flex-col gap-8 mb-20">
          <TechLabel>PUBLICATIONMETRICS // TELEMETRY</TechLabel>
          
          <div className="max-w-2xl">
            <h2 style={{ fontSize: '2.25rem', lineHeight: 1.2, fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: '-0.01em' }}>
              By the <span style={{ color: 'var(--accent)' }}>Numbers.</span>
            </h2>
            <p className="mt-4" style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              Tracking index reach, tool catalog growth, and editorial tutorials published weekly.
            </p>
          </div>
        </div>

        <div className="metrics-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, borderColor: 'var(--accent)' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="card group"
              style={{ 
                padding: '2.5rem 2rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              {/* Card Header: Icon */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[var(--tag-bg)] rounded-sm group-hover:bg-[var(--accent)] group-hover:text-black transition-colors duration-500">
                  <s.icon size={22} strokeWidth={1.5} />
                </div>
              </div>

              {/* Value & Counter */}
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif" }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[var(--muted)] text-[12px] uppercase tracking-[0.2em] font-bold">
                  {s.label}
                </div>
              </div>

              {/* Bottom Progress Line (Visual only) */}
              <div className="w-full h-[1px] bg-[var(--border)] relative overflow-hidden mt-2">
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '0%' }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  className="absolute inset-0 bg-[var(--accent)] opacity-30" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
