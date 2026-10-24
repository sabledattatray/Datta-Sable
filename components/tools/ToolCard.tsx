'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  href: string;
  status: string;
  external?: boolean;
}

export default function ToolCard({ title, description, icon, category, href, status, external }: ToolCardProps) {
  const isComingSoon = status === 'Coming Soon';
  const target = external ? '_blank' : undefined;
  const rel = external ? 'noopener noreferrer' : undefined;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href={isComingSoon ? '#' : href} 
        target={target}
        rel={rel}
        className={`group no-underline block h-full ${isComingSoon ? 'cursor-not-allowed' : ''}`}
      >
        <div 
          className="card h-full flex flex-col p-8 transition-all duration-300" 
          style={{ 
            borderLeft: '2px solid var(--border)',
            background: 'var(--surface)',
            borderColor: isComingSoon ? 'var(--border)' : 'var(--border)'
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div 
              style={{ 
                color: isComingSoon ? 'var(--muted)' : 'var(--accent)',
                padding: '12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            >
              {icon}
            </div>
            <div 
              className="tag mono" 
              style={{ 
                fontSize: 'var(--text-small)',
                opacity: 0.6,
                letterSpacing: '0.1em'
              }}
            >
              {category}
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: isComingSoon ? 'var(--muted)' : 'var(--text)' }}>
            {title}
          </h3>
          
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
            {description}
          </p>

          <div className="flex items-center justify-between">
            {isComingSoon ? (
              <div className="flex items-center gap-2 text-[length:var(--text-small)] mono text-[var(--muted)] opacity-50">
                <Lock size={12} /> INITIALIZING_NODE
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[length:var(--text-small)] mono tracking-widest group-hover:gap-4 transition-all">
                ACCESS_UTILITY <ArrowRight size={14} />
              </div>
            )}
            
            {!isComingSoon && (
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
