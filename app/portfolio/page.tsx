'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ExternalLink, GitBranch, X, ChevronRight } from 'lucide-react';

import Crosshair from '@/components/Crosshair';

const categories = ['All', 'Dashboard', 'Report', 'Analysis', 'Automation'];

import { projects as staticProjects, ProjectData } from './data';

function PortfolioContent() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState('All');
  const [projectList, setProjectList] = useState<ProjectData[]>(staticProjects);
  const [selected, setSelected] = useState<ProjectData | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProjectList(data);
          }
        }
      } catch (err) {
        console.error('Failed to load database projects, using static fallback:', err);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setActive(cat);
    }
  }, [searchParams]);

  const filtered = active === 'All' ? projectList : projectList.filter(p => p.category === active);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
            <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>PRO-PROJECTS</div>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 48px)', 
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Project <span className="hero-title">Portfolio</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 560, lineHeight: 1.8, fontSize: '1.05rem' }}>
              High-fidelity analytics, technical automation, and scalable dashboard structures built for enterprise-grade growth.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3" style={{ marginBottom: '2.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
                style={{
                  padding: '0.6rem 1.5rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: active === cat ? 'var(--accent)' : 'var(--tag-bg)',
                  color: active === cat ? 'var(--btn-primary-text)' : 'var(--muted)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid-auto-fill-340"
            style={{ marginBottom: '6rem' }}
          >
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="card group"
                  style={{ 
                    overflow: 'hidden',
                    borderLeft: '2px solid',
                    borderImage: `linear-gradient(to bottom, ${p.color}, #00C9F2) 1`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelected(p)}
                >
                  {/* Image area */}
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                    <Image 
                      src={p.image} 
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                      <span className="tag" style={{ color: p.color, borderColor: `${p.color}44`, background: 'var(--bg)' }}>{p.category}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text)' }}>{p.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      {p.desc.slice(0, 100)}…
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tools.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                      {p.tools.length > 3 && <span className="tag">+{p.tools.length - 3}</span>}
                    </div>
                    <div className="flex items-center gap-1" style={{ color: p.color, fontSize: '0.875rem', fontWeight: 600 }}>
                      View Case Study <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Peer Reviews / System Validation */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ 
              padding: '4rem', 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="label-tech mb-8" style={{ justifyContent: 'center' }}>SYSTEM-VALIDATION</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Senior VP, Operations", company: "RetailMax Corp", text: "The Sales Performance Ecosystem transformed our regional reporting. Data that took days to compile is now available in real-time." },
                { name: "Chief Financial Officer", company: "Fintech Co.", text: "Datta's automation suite reduced our monthly close by 80%. Unprecedented accuracy and technical precision." },
                { name: "HR Director", company: "Tech Ventures", text: "The attrition prediction models allowed us to proactively retain top talent. A game-changer for our workforce strategy." }
              ].map((rev, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--accent)', opacity: 0.2, marginBottom: '-1rem' }}>"</div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>{rev.text}</p>
                  <div className="mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.1em' }}>{rev.name.toUpperCase()}</div>
                  <div className="mono" style={{ fontSize: '9px', color: 'var(--accent)', letterSpacing: '0.05em' }}>// {rev.company}</div>
                </div>
              ))}
            </div>
            {/* Background pattern */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle at top right, var(--accent) 0%, transparent 70%)', opacity: 0.05 }} />
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'var(--navbar-bg)', backdropFilter: 'blur(10px)', zIndex: 1000,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: 'clamp(0.5rem, 3vw, 2rem)',
              overflowY: 'auto',
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 0, padding: 0,
                maxWidth: 900, width: '100%',
                position: 'relative',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute w-10 h-10 flex items-center justify-center z-10"
                style={{ top: 'clamp(0.75rem, 3vw, 1.5rem)', right: 'clamp(0.75rem, 3vw, 1.5rem)', background: 'var(--tag-bg)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ height: 'clamp(180px, 35vw, 300px)', overflow: 'hidden', position: 'relative' }}>
                <Image 
                  src={selected.image} 
                  alt={selected.title} 
                  fill
                  style={{ objectFit: 'cover', opacity: 0.4 }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(12px, 3vw, 30px)', left: 'clamp(12px, 4vw, 30px)', right: '3.5rem' }}>
                  <div className="label-tech mb-2" style={{ color: selected.color }}>{selected.category} CASE_STUDY</div>
                  <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', color: 'var(--text)', fontWeight: 700 }}>{selected.title}</h2>
                  <div className="mono" style={{ color: 'var(--muted)', fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)' }}>Architected for: {selected.client}</div>
                </div>
              </div>

              <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem)' }}>
                <p style={{ color: 'var(--text)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', lineHeight: 1.8, marginBottom: '2.5rem', opacity: 0.9 }}>{selected.desc}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: '🔴 THE CHALLENGE', text: selected.problem, color: 'var(--accent)' },
                    { label: '✅ THE ARCHITECTURE', text: selected.solution, color: 'var(--accent)' },
                  ].map(item => (
                    <div key={item.label} style={{ borderLeft: `2px solid ${item.color}`, paddingLeft: '1.5rem' }}>
                      <div className="mono" style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.8rem', color: item.color, letterSpacing: '0.2em' }}>{item.label}</div>
                      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>{item.text}</p>
                    </div>
                  ))}
                </div>

                <div
                  style={{ background: 'var(--surface2)', border: `1px solid var(--border)`, padding: 'clamp(1rem, 4vw, 2rem)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
                >
                  <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>🎯</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="label-tech" style={{ fontSize: '10px', marginBottom: '0.5rem' }}>BUSINESS_IMPACT</div>
                    <div className="mono" style={{ color: selected.color, fontWeight: 700, fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', wordBreak: 'break-word' }}>{selected.impact}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selected.tools.map(t => <span key={t} className="tag" style={{ padding: '0.4rem 1rem' }}>{t}</span>)}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-3" style={{ textDecoration: 'none', padding: 'clamp(0.65rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)', flex: '1 1 auto', justifyContent: 'center' }}>
                    <GitBranch size={18} /> Documentation
                  </a>
                  {selected.live.startsWith('http') && (
                    <a href={selected.live} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-3" style={{ textDecoration: 'none', padding: 'clamp(0.65rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 1, flex: '1 1 auto', justifyContent: 'center' }}>
                      <ExternalLink size={18} /> Live Deployment
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        <Crosshair position="br" />
      </div>
      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', minHeight: '100vh' }} />}>
      <PortfolioContent />
    </Suspense>
  );
}
