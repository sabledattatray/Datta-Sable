'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, RefreshCw } from 'lucide-react';

const UPDATED_GUIDES = [
  {
    title: 'Microsoft Fabric DP-600 Study Guide & Exam Prep',
    status: 'Updated Today',
    color: '#00C9F2',
    slug: 'dp-600-study-guide-2026'
  },
  {
    title: 'Power BI Direct Lake Mode: Performance Tuning Guide',
    status: 'Updated Yesterday',
    color: 'var(--accent)',
    slug: 'case-study-precision-prompt-architecture-consistency'
  },
  {
    title: 'Next.js App Router SEO: Complete Production Checklist',
    status: 'Updated This Week',
    color: '#ff1744',
    slug: 'case-study-n8n-automated-authority-scaling'
  }
];

export default function RecentlyUpdated() {
  return (
    <section className="section" style={{ background: 'var(--surface)', padding: '2.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--surface2)] text-[var(--accent)] rounded-full animate-spin" style={{ animationDuration: '6s' }}>
              <RefreshCw size={16} />
            </div>
            <div>
              <h3 className="mono text-[11px] uppercase tracking-wider font-bold text-[var(--text)] m-0">Content Freshness</h3>
              <p className="text-[12px] text-[var(--muted)] m-0">Maintained and revised technical assets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-4xl w-full">
            {UPDATED_GUIDES.map((guide, i) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/${guide.slug}`}
                  className="group flex items-center justify-between p-3 border border-[var(--border)] bg-[var(--surface2)] hover:border-[var(--accent)] transition-all rounded-sm no-underline"
                >
                  <div className="truncate pr-4">
                    <h4 className="text-[13px] font-bold text-[var(--text)] truncate m-0 group-hover:text-[var(--accent)] transition-colors">
                      {guide.title}
                    </h4>
                    <span className="text-[10px] text-[var(--muted)] mono flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {guide.status}
                    </span>
                  </div>
                  <div 
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: guide.color }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
