'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: number;
  date: string;
  image: string;
}

const LATEST_POSTS: Post[] = [
  {
    id: 'case-study-n8n-automation-2026',
    slug: 'case-study-n8n-automated-authority-scaling',
    title: "Case Study: Architecting the 'Auto-Operator' via n8n Orchestration",
    category: 'Case Study',
    excerpt: "How we scaled technical distribution for technical creator workflows using n8n and multi-agent AI pipelines.",
    readTime: 12,
    date: 'May 14, 2026',
    image: '/images/blog/case_study_n8n_automation.webp'
  },
  {
    id: 'surgical-prompt-architecture-v1',
    slug: 'surgical-prompt-architecture-framework',
    title: 'Surgical Prompt Architecture™: The Blueprint for Precision AI',
    category: 'Framework',
    excerpt: 'Master the core technical structure for production-grade LLM outputs. Learn how to eliminate hallucination through structural precision.',
    readTime: 15,
    date: 'May 14, 2026',
    image: '/images/blog/surgical_prompt_hero.webp'
  },
  {
    id: 'case-study-prompt-precision-2026',
    slug: 'case-study-surgical-prompt-architecture-consistency',
    title: 'Case Study: Achieving 99.8% Output Consistency via Surgical Architecture™',
    category: 'Case Study',
    excerpt: 'How we eliminated hallucination and stabilized output schemas for a high-volume content automation pipeline.',
    readTime: 12,
    date: 'May 14, 2026',
    image: '/images/blog/case_study_prompt_architecture.webp'
  }
];

export default function LatestInsights() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)', paddingBottom: '6rem' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div style={{ maxWidth: 500 }}>
            <div className="label-tech mb-4">OPERATOR-INTEL-V1.0</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Workflow <span className="hero-title">Engineering</span>
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              Proprietary frameworks and technical intel for the new era of scalable creator automation systems.
            </p>
          </div>
          
          <Link href="/blog" className="flex items-center gap-2 group no-underline" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            VIEW KNOWLEDGE HUB <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LATEST_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`} className="group no-underline block h-full">
                <div className="card h-full flex flex-col" style={{ padding: '1.5rem', borderLeft: '2px solid var(--border)', transition: 'border-color 0.3s ease' }}>
                  <div className="relative aspect-video mb-6 overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3">
                      <div className="tag" style={{ background: 'var(--bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
                        {post.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] mono">
                      <Clock size={12} className="text-[var(--accent)]" /> {post.readTime} MIN READ
                    </span>
                    <span className="text-[10px] text-[var(--muted)] mono opacity-50 uppercase tracking-widest">{post.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', lineHeight: 1.3, marginBottom: '1rem', color: 'var(--text)' }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[11px] mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    READ FULL LOG <ArrowRight size={14} />
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
