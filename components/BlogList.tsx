'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, ArrowRight } from 'lucide-react';

import Newsletter from './Newsletter';

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: number;
  date: string;
  color: string | null;
  icon: string | null;
  image: string | null;
}

const PRIORITY_READING_LINKS = [
  {
    title: 'Dashboard Psychology',
    href: '/blog/psychology-of-high-fidelity-dashboard-design',
    context: 'High-fidelity BI design'
  },
  {
    title: 'Execution Chain Infrastructure',
    href: '/blog/execution-chain-infrastructure-explained',
    context: 'Agent workflow systems'
  },
  {
    title: 'Natural Language Query Engines',
    href: '/blog/natural-language-query-engines',
    context: 'Conversational analytics'
  },
  {
    title: 'Autonomous AI Agent Workflows',
    href: '/blog/mastering-autonomous-ai-agents-workflows-2026',
    context: 'AI orchestration'
  },
  {
    title: 'AI Agents Replacing Apps',
    href: '/blog/how-ai-agents-are-replacing-apps-2026',
    context: 'Product architecture'
  },
  {
    title: 'Next.js Performance Manifesto',
    href: '/blog/nextjs-15-react-19-performance-manifesto-2026',
    context: 'Web performance'
  }
];

export default function BlogList({ initialPosts, initialCategory = 'All' }: { initialPosts: Post[], initialCategory?: string }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'updated' | 'popular'>('newest');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Auto-calculate difficulty tag based on title and content keywords
  const getPostDifficulty = (post: Post) => {
    const titleLower = post.title.toLowerCase();
    const excerptLower = post.excerpt?.toLowerCase() || '';
    const contentLower = post.content?.toLowerCase() || '';
    
    if (
      titleLower.includes('advanced') || 
      titleLower.includes('architecting') || 
      titleLower.includes('performance') || 
      titleLower.includes('optimize') ||
      titleLower.includes('optimization') ||
      titleLower.includes('tuning') ||
      titleLower.includes('deep-dive') ||
      titleLower.includes('manifesto') ||
      titleLower.includes('columnstore') ||
      contentLower.includes('advanced patterns')
    ) {
      return 'Advanced';
    }
    
    if (
      titleLower.includes('mastering') || 
      titleLower.includes('framework') || 
      titleLower.includes('guide') ||
      titleLower.includes('roadmap') ||
      titleLower.includes('dp-') ||
      titleLower.includes('comparison') ||
      titleLower.includes('sitemap')
    ) {
      return 'Intermediate';
    }
    
    return 'Beginner';
  };

  const enrichedPosts = initialPosts.map(p => ({
    ...p,
    difficulty: getPostDifficulty(p),
    displayDate: `Updated ${p.date}`
  }));

  const categoryCounts = enrichedPosts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = ['All', ...Object.keys(categoryCounts)];

  let filtered = enrichedPosts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'newest' || sortBy === 'updated') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'popular') {
      return b.readTime - a.readTime; // higher read time implies longer/popular articles
    }
    return 0;
  });

  return (
    <div className="container">
      {/* Blog Landing Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '4rem' }}>
        <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>KNOWLEDGE-HUB</div>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 48px)', 
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Technical <span className="hero-title">Tutorials &amp; Guides</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 640, lineHeight: 1.8, fontSize: '1.05rem' }}>
          <strong>Microsoft Fabric • Power BI • SQL • Next.js • AI</strong> — 190+ Articles and handpicked Curated Learning Paths updated weekly.
        </p>
      </motion.div>

      {/* Handpicked Reading Paths (Shown only when not searching/filtering) */}
      {activeCategory === 'All' && !search && difficultyFilter === 'All' && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: '4.5rem' }}
        >
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="label-tech" style={{ color: 'var(--accent)', letterSpacing: '0.25em' }}>
                PRIORITY READING PATHS
              </span>
              <span style={{
                background: 'rgba(201,243,29,0.1)',
                border: '1px solid rgba(201,243,29,0.25)',
                color: 'var(--accent)',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '2px',
                letterSpacing: '0.08em'
              }}>
                {PRIORITY_READING_LINKS.length} CURATED
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              HANDPICKED · START HERE
            </span>
          </div>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {PRIORITY_READING_LINKS.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                  className="group"
                  style={{
                    background: 'var(--surface2)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    minHeight: '100px',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                  }}
                >
                  {/* Accent bar — slides in on hover */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, var(--accent), #00C9F2)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.25s ease'
                  }} className="priority-bar" />

                  {/* Top row: index badge + context label */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      background: 'rgba(201,243,29,0.08)',
                      border: '1px solid rgba(201,243,29,0.15)',
                      padding: '2px 7px',
                      borderRadius: '2px',
                      letterSpacing: '0.05em',
                      flexShrink: 0,
                      lineHeight: 1.6
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      textAlign: 'right',
                      lineHeight: 1.4,
                      opacity: 0.8
                    }}>
                      {item.context}
                    </span>
                  </div>

                  {/* Title + Arrow */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      lineHeight: 1.35,
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease',
                      flex: 1
                    }} className="group-hover:text-[var(--accent)]">
                      {item.title}
                    </span>
                    <ArrowRight
                      size={14}
                      style={{
                        color: 'var(--accent)',
                        flexShrink: 0,
                        transition: 'transform 0.2s ease',
                        marginBottom: '1px'
                      }}
                      className="group-hover:translate-x-1"
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Featured Log Highlight (Editor's Picks) */}
      {enrichedPosts.length > 0 && activeCategory === 'All' && !search && difficultyFilter === 'All' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginBottom: '4.5rem' }}
        >
          <Link href={`/blog/${enrichedPosts[0].slug}`} style={{ textDecoration: 'none' }}>
            <div className="card group" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 0,
              padding: 0,
              overflow: 'hidden',
              borderLeft: '4px solid var(--accent)'
            }}>
              <div style={{ height: '350px', position: 'relative' }}>
                <Image 
                  src={enrichedPosts[0].image || ''} 
                  alt={enrichedPosts[0].title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)', display: 'none' }} className="lg:block" />
              </div>
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="label-tech mb-4">FEATURED-ANALYSIS</div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{enrichedPosts[0].title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>{enrichedPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="tag">{enrichedPosts[0].category}</div>
                  <div className={`difficulty-badge ${enrichedPosts[0].difficulty.toLowerCase()}`} style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    border: '1px solid rgba(201, 243, 29, 0.3)',
                    color: 'var(--accent)',
                    background: 'rgba(201, 243, 29, 0.05)'
                  }}>{enrichedPosts[0].difficulty}</div>
                  <div className="mono text-[11px] font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform">READ FULL LOG →</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Sticky Search and Sorting Controls Bar */}
      <div 
        className="sticky-controls"
        style={{
          position: 'sticky',
          top: '0px',
          zIndex: 40,
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '1.25rem 0',
          marginBottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <input 
              type="text" 
              placeholder="SEARCH TECHNICAL TUTORIALS..." 
              aria-label="Search logs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem',
                background: 'var(--tag-bg)', border: '1px solid var(--border)',
                borderRadius: '4px', color: 'var(--text)', fontSize: '11px',
                outline: 'none', fontFamily: 'var(--mono)', letterSpacing: '0.05em'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
          </div>

          {/* Sorters and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort by */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  background: 'var(--tag-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '11px',
                  fontFamily: 'var(--mono)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">NEWEST</option>
                <option value="updated">RECENTLY UPDATED</option>
                <option value="popular">POPULAR (READ TIME)</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Level:</span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                style={{
                  background: 'var(--tag-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '11px',
                  fontFamily: 'var(--mono)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">ALL LEVELS</option>
                <option value="Beginner">BEGINNER</option>
                <option value="Intermediate">INTERMEDIATE</option>
                <option value="Advanced">ADVANCED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`} 
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '9px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: activeCategory === cat ? 'var(--accent)' : 'var(--tag-bg)',
                color: activeCategory === cat ? 'var(--btn-primary-text)' : 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
              <span style={{ 
                opacity: 0.6, 
                marginLeft: '5px', 
                fontSize: '8px',
                padding: '0px 4px',
                background: activeCategory === cat ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.06)',
                borderRadius: '8px'
              }}>
                {cat === 'All' ? enrichedPosts.length : categoryCounts[cat]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        {filtered.map((p, i) => (
          <Link 
            href={`/blog/${p.slug}`} 
            key={p.slug} 
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card h-full group"
              style={{ 
                padding: '2rem',
                borderLeft: '2px solid',
                borderImage: 'linear-gradient(to bottom, var(--accent), #00C9F2) 1',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                className="w-full h-48 mb-4 relative overflow-hidden"
                style={{ borderBottom: `1px solid ${p.color}33` }}
              >
                {p.image && (
                  <Image 
                    src={p.image} 
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="group-hover:scale-110"
                  />
                )}

                <div 
                  style={{ position: 'absolute', top: 12, left: 12, background: `linear-gradient(135deg, ${p.color || 'var(--accent)'}, #00C9F2)`, color: '#000', fontSize: '1.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {p.icon}
                </div>
              </div>

              {/* Rich E-E-A-T Metadata Block */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="tag" style={{ color: p.color || 'var(--accent)', borderColor: `${p.color}44`, fontSize: '10px' }}>{p.category}</span>
                <span className={`difficulty-badge ${p.difficulty.toLowerCase()}`} style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: p.difficulty === 'Advanced' ? 'rgba(239, 68, 68, 0.3)' : p.difficulty === 'Intermediate' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                  color: p.difficulty === 'Advanced' ? '#ef4444' : p.difficulty === 'Intermediate' ? '#f59f0b' : '#10b981',
                  background: p.difficulty === 'Advanced' ? 'rgba(239, 68, 68, 0.05)' : p.difficulty === 'Intermediate' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)'
                }}>{p.difficulty}</span>
                <span className="flex items-center gap-1" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                  <Clock size={12} /> {p.readTime} min read
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>By Datta Sable</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '1.25rem', opacity: 0.85 }}>
                <span>{p.displayDate}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', lineHeight: 1.4, color: 'var(--text)' }}>{p.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{p.excerpt}</p>
              
              <div className="flex items-center gap-2 mt-auto" style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>
                READ LOG <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <Newsletter />
    </div>
  );
}
