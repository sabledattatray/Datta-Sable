'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Zap, BookOpen, Layers, Code, Search, Cpu } from 'lucide-react';

const CATEGORIES = [
  { slug: 'microsoft-fabric', name: 'Microsoft Fabric', count: 18, icon: <Layers size={20} />, color: '#00C9F2' },
  { slug: 'power-bi', name: 'Power BI', count: 24, icon: <Zap size={20} />, color: 'var(--accent)' },
  { slug: 'sql', name: 'SQL & Databases', count: 15, icon: <Database size={20} />, color: '#00d4ff' },
  { slug: 'python', name: 'Python Engineering', count: 20, icon: <Cpu size={20} />, color: '#ffd54f' },
  { slug: 'nextjs', name: 'Next.js 15', count: 17, icon: <Code size={20} />, color: '#ff1744' },
  { slug: 'seo', name: 'SEO Strategy', count: 14, icon: <Search size={20} />, color: '#00c853' },
  { slug: 'ai-automation', name: 'AI & Automation', count: 19, icon: <BookOpen size={20} />, color: '#a855f7' }
];

export default function BrowseCategories() {
  return (
    <section className="section" style={{ background: 'var(--surface2)', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="mb-12">
          <div className="label-tech mb-4">CONTENT_CLUSTERS // TOPICS</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Browse by <span className="hero-title">Technical Topic</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Explore deep-dive technical architectures, benchmarks, and optimization tutorials organized by core engineering stacks.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group block no-underline h-full"
              >
                <div
                  className="card h-full flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-opacity-100"
                  style={{
                    padding: '2rem 1rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    borderColor: 'var(--border)',
                    height: '100%',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cat.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div 
                    className="p-3 rounded-full mb-4 flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: 'var(--surface2)',
                      color: cat.color
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                      {cat.name}
                    </h3>
                    <span 
                      className="mono text-[10px] uppercase font-bold"
                      style={{ color: 'var(--muted)' }}
                    >
                      {cat.count} Guides
                    </span>
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
