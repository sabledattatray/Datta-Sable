'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Layers, BarChart3, Code2, Cpu } from 'lucide-react';

const TRACKS = [
  {
    title: 'New to Microsoft Fabric?',
    action: 'Read the Fundamentals Guide',
    desc: 'Deep-dive into OneLake architecture, Direct Lake mode, capacity provisioning, and DP-600 study tracks.',
    href: '/blog/microsoft-fabric-certification-roadmap-2026',
    icon: <Layers size={20} />,
    color: '#00C9F2',
    badge: 'FABRIC'
  },
  {
    title: 'Learning Power BI?',
    action: 'Start with the Beginner Series',
    desc: 'Master dashboard psychology, advanced DAX performance models, query folding, and enterprise architecture.',
    href: '/blog/psychology-of-high-fidelity-dashboard-design',
    icon: <BarChart3 size={20} />,
    color: 'var(--accent)',
    badge: 'POWER BI'
  },
  {
    title: 'Interested in Next.js SEO?',
    action: 'Follow the 12-part Guide',
    desc: 'Learn React Server Components, metadata optimization, crawler indexing, and Core Web Vitals profiling.',
    href: '/blog/nextjs-15-react-19-performance-manifesto-2026',
    icon: <Code2 size={20} />,
    color: '#ff1744',
    badge: 'NEXT.JS'
  },
  {
    title: 'Exploring AI Automation?',
    action: 'Begin with MCP & n8n Tutorials',
    desc: 'Build self-healing n8n orchestrators, custom Model Context Protocol (MCP) servers, and autonomous agent workflows.',
    href: '/blog/case-study-n8n-automated-authority-scaling',
    icon: <Cpu size={20} />,
    color: '#a855f7',
    badge: 'AI AUTOMATION'
  }
];

export default function StartHere() {
  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '5rem 0 2.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div style={{ maxWidth: 550 }}>
            <div className="label-tech mb-4 text-[var(--accent)]">GUIDED PATHWAYS // START HERE</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              Where Should You <span className="hero-title">Start?</span>
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Select your engineering domain below to access structured roadmap check-lists, core pillars, and curated tutorial streams.
            </p>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link href={t.href} className="group block no-underline h-full">
                <div 
                  className="card h-full flex flex-col justify-between" 
                  style={{ 
                    padding: '2rem 1.5rem', 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${t.color}`,
                    borderRadius: '4px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                    (e.currentTarget as HTMLElement).style.borderColor = t.color + '55';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-2.5 bg-[var(--surface2)] rounded-sm" style={{ color: t.color }}>
                        {t.icon}
                      </div>
                      <span className="mono text-[8px] uppercase font-bold tracking-widest text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-sm bg-[var(--tag-bg)]">
                        {t.badge}
                      </span>
                    </div>
                    
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)', lineHeight: 1.4 }}>
                      {t.title}
                    </h3>
                    
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem', minHeight: '4.8rem' }}>
                      {t.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[11px] mono tracking-widest group-hover:translate-x-1 transition-transform mt-auto" style={{ color: t.color }}>
                    {t.action.toUpperCase()} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
