'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, Database, Target, Activity, ArrowRight, Shield } from 'lucide-react';

const projects = [
  {
    title: 'Precision Prompt Auditor™',
    category: 'Interactive Tool',
    desc: 'Live technical auditor for LLM prompts. Evaluates Fidelity, Entropy, and Context Bloat with maximum accuracy.',
    tools: ['Next.js', 'AI Logic', 'Telemetry'],
    impact: 'Audit in < 1.5s',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Shield size={20} />,
    href: '/tools/prompt-auditor'
  },
  {
    title: 'Precision Analytics Forge',
    category: 'Big Data Engine',
    desc: 'Autonomous BI infrastructure capable of auditing 1M+ records in real-time with optimized query engines.',
    tools: ['Python', 'DuckDB', 'Next.js'],
    impact: 'Scalable Pipeline Architecture',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Activity size={20} />,
  },
  {
    title: 'Sales Performance Dashboard',
    category: 'Dashboard',
    desc: 'Real-time Tableau dashboard tracking $12M+ in revenue with drill-down KPIs and trend forecasting.',
    tools: ['Tableau', 'SQL', 'Python'],
    impact: '+28% decision speed',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <BarChart3 size={20} />,
  },
  {
    title: 'Supply Chain Analytics',
    category: 'Analysis',
    desc: 'End-to-end SQL + Power BI solution reducing inventory costs by 18% through predictive analytics.',
    tools: ['Power BI', 'SQL', 'DAX'],
    impact: '-18% inventory cost',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Database size={20} />,
  },
  {
    title: 'HR Workforce Insights',
    category: 'Report',
    desc: 'Python + Excel automation that transforms 40-hour manual reporting into a 10-minute refresh.',
    tools: ['Python', 'Excel', 'Tableau'],
    impact: '97% time saved',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Target size={20} />,
  },
  {
    title: 'Financial KPI Automation',
    category: 'Automation',
    desc: 'Python-powered financial reporting suite that reduced monthly close cycle from 5 days to 4 hours.',
    tools: ['Python', 'SQL', 'Excel'],
    impact: '-80% close time',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Activity size={20} />,
  },
];

function TechLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="label-tech">{children}</p>
    </div>
  );
}

export default function ProjectsGrid() {
  return (
    <section className="section" style={{ background: 'var(--surface2)', padding: '4rem 0' }}>
      <div className="container">
        <div className="mb-12">
          <TechLabel>Active Deployments</TechLabel>
          <h2 className="sr-only">Featured BI Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card"
              style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                opacity: 0.95,
                borderLeftWidth: '2px',
                borderLeftStyle: 'solid'
              }}
            >
              <div 
                className="dark:block hidden"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${p.color}, ${p.color2})`, opacity: 0.5 }} 
              />
              <div className="flex justify-between items-start mb-8" style={{ marginTop: '0.5rem' }}>
                <div style={{ color: 'var(--accent)' }}>{p.icon}</div>
                <span className="mono text-[12px] py-1 px-3 border text-[var(--muted)]"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--surface2)' }}>
                  {p.category.toUpperCase()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{p.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', height: '3.2rem', overflow: 'hidden' }}>{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {p.tools.map(t => (
                  <span key={t} className="mono text-[12px] py-1 px-2 border"
                    style={{ color: 'var(--accent)', background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-6">
                <div className="flex items-center gap-2">
                  <Target size={14} style={{ color: 'var(--accent)' }} />
                  <span className="mono text-[11px] font-normal" style={{ color: 'var(--accent)' }}>{p.impact}</span>
                </div>
                <Link 
                  href={p.href || "/portfolio"} 
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  aria-label={`View details for ${p.title}`}
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
