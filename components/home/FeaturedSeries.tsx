'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Award, Layers } from 'lucide-react';

const SERIES = [
  {
    title: 'Learn Microsoft Fabric',
    parts: '15 / 20 Guides',
    desc: 'Master Microsoft Fabric. Walk through OneLake architecture, capacity optimization, Direct Lake mode, and data pipelines.',
    color: '#00C9F2',
    icon: <Layers size={20} />,
    slug: 'microsoft-fabric'
  },
  {
    title: 'Master Power BI',
    parts: '22 Tutorials · Updated Weekly',
    desc: 'Advanced DAX modeling, query folding optimizations, incremental refreshes, and enterprise scale architectures.',
    color: 'var(--accent)',
    icon: <Award size={20} />,
    slug: 'power-bi'
  },
  {
    title: 'Next.js 15 SEO & Performance',
    parts: '18 Guides · Updated Weekly',
    desc: 'Complete developer guide to React Server Components, metadata management, fast indexing, and PageSpeed optimizations.',
    color: '#ff1744',
    icon: <BookOpen size={20} />,
    slug: 'nextjs'
  }
];

export default function FeaturedSeries() {
  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div style={{ maxWidth: 550 }}>
            <div className="label-tech mb-4 text-[var(--accent)]">CURATED // LEARNING JOURNEYS</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              Curated <span className="hero-title">Learning Series</span>
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Follow structured paths designed to take you from core concepts to practical execution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERIES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/category/${s.slug}`} className="group block no-underline h-full">
                <div 
                  className="card h-full flex flex-col justify-between" 
                  style={{ 
                    padding: '2.5rem 2rem', 
                    background: 'var(--surface2)', 
                    border: '1px solid var(--border)',
                    borderTop: `3px solid ${s.color}`,
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-[var(--surface)] rounded-sm" style={{ color: s.color }}>
                        {s.icon}
                      </div>
                      <span className="mono text-[10px] uppercase font-bold text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-0.5 rounded-sm bg-[var(--surface)]">
                        {s.parts}
                      </span>
                    </div>
                    
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                      {s.title}
                    </h3>
                    
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                      {s.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[11px] mono tracking-widest group-hover:translate-x-1 transition-transform">
                    START SERIES <ArrowRight size={14} />
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
