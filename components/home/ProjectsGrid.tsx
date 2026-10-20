
import Link from 'next/link';
import { BarChart3, Database, Target, Activity, ArrowRight, Shield } from 'lucide-react';

const projects = [
  {
    title: 'Sales Reporting Design Exercise',
    category: 'Guide',
    desc: 'Work through targets, returns and source reconciliation in a small sales model.',
    tools: ['Power BI', 'DAX', 'Fabric'],
    impact: 'Worked reporting example',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <BarChart3 size={20} />,
    href: '/blog/sales-performance-ecosystem-2026'
  },
  {
    title: 'Structured AI Extraction',
    category: 'Guide',
    desc: 'Separate JSON validity, schema conformance and factual accuracy in an extraction evaluation.',
    tools: ['Next.js', 'AI Logic', 'Zod'],
    impact: 'Schema and fact checks',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Shield size={20} />,
    href: '/blog/case-study-precision-prompt-architecture-consistency'
  },
  {
    title: 'SQL Columnstore Design Guide',
    category: 'Guide',
    desc: 'Explore columnstore concepts and validate query choices against your own workload.',
    tools: ['SQL Server', 'ETL', 'T-SQL'],
    impact: 'Query design guidance',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Database size={20} />,
    href: '/blog/sql-server-columnstore-indexes-optimization-guide'
  },
  {
    title: 'n8n Editorial Review Workflow',
    category: 'Guide',
    desc: 'Design a source-tracked draft queue with explicit editorial review and controlled publication.',
    tools: ['Python', 'n8n', 'AI Agents'],
    impact: 'Draft, review, publish',
    color: 'var(--accent)',
    color2: '#00C9F2',
    icon: <Activity size={20} />,
    href: '/blog/case-study-n8n-automated-authority-scaling'
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
          <TechLabel>PRACTICAL IMPLEMENTATION GUIDES</TechLabel>
          <h2 className="sr-only">Featured implementation guides</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <div
              key={p.title}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[var(--border)] pt-6 gap-3">
                <div className="flex items-center gap-2">
                  <Target size={14} style={{ color: 'var(--accent)' }} />
                  <span className="mono text-[11px] font-normal" style={{ color: 'var(--accent)' }}>{p.impact}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href={p.href || "/portfolio"} 
                    className="mono text-[10px] font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline uppercase"
                    aria-label={`View architecture for ${p.title}`}
                  >
                    View Architecture
                  </Link>
                  <span style={{ color: 'var(--border)', fontSize: '10px' }}>|</span>
                  <Link 
                    href={p.href || "/portfolio"} 
                    className="mono text-[10px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1 no-underline uppercase"
                    aria-label={`Read case study for ${p.title}`}
                  >
                    Read Case Study <ArrowRight size={12} className="flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
