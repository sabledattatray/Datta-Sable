'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Zap, 
  ArrowRight,
  ExternalLink,
  Save,
  Sparkles,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceClient() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('surgical_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          items.push({
            id: key.replace('surgical_', ''),
            data,
            timestamp: new Date().toLocaleDateString()
          });
        } catch (e) {}
      }
    }
    setHistory(items);
  }, []);

  const getToolMeta = (id: string) => {
    const meta: Record<string, any> = {
      'linkedin-draft': { name: 'LinkedIn Formatter', href: '/tools/linkedin-formatter', color: '#0077b5' },
      'prompt-state': { name: 'Prompt Engineer', href: '/tools/ai-prompt-generator', color: 'var(--accent)' },
      'seo-meta': { name: 'Meta-Force SEO', href: '/tools/seo-meta-generator', color: '#34a853' },
    };
    return meta[id] || { name: 'Utility Tool', href: '/tools', color: 'var(--muted)' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Stats */}
      <div className="lg:col-span-1">
        <div className="card p-6" style={{ background: 'var(--surface2)' }}>
          <h3 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-6">System_Status</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] mono text-[var(--muted)]">ACTIVE_NODES</span>
              <span className="text-xs font-bold">{history.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] mono text-[var(--muted)]">Uptime</span>
              <span className="text-xs font-bold">100%</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <button className="btn-outline w-full flex items-center justify-center gap-2 text-[10px]">
              <Save size={12} /> SYNC_CLOUDRUN
            </button>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-3">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={16} className="text-[var(--accent)]" />
          <h3 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Recent_Blueprints</h3>
        </div>

        {history.length === 0 ? (
          <div className="card p-12 text-center border-dashed" style={{ background: 'var(--bg)' }}>
            <Sparkles size={32} className="text-[var(--muted)] mx-auto mb-4 opacity-20" />
            <p className="text-[var(--muted)] mono text-xs uppercase tracking-widest">NO_RECENT_SESSIONS_FOUND</p>
            <Link href="/tools" className="text-[var(--accent)] text-xs mt-4 block no-underline hover:underline">Start a new project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item) => {
              const meta = getToolMeta(item.id);
              return (
                <Link key={item.id} href={meta.href} className="no-underline group">
                  <div className="card p-6 h-full hover:border-[var(--accent)] transition-all" style={{ background: 'var(--surface2)' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div 
                        className="px-2 py-1 text-[9px] mono font-bold border rounded" 
                        style={{ color: meta.color, borderColor: meta.color }}
                      >
                        {meta.name.toUpperCase()}
                      </div>
                      <div className="text-[9px] mono text-[var(--muted)] uppercase">{item.timestamp}</div>
                    </div>
                    
                    <p className="text-sm font-bold mb-4 line-clamp-2 text-[var(--text)] group-hover:text-[var(--accent)] transition-all">
                      {item.data.topic || item.data.title || "Untitled Session"}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[10px] mono text-[var(--muted)] mt-auto pt-4 border-t border-[var(--border)]/50">
                      RESUME_SESSION <ArrowRight size={10} className="group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={16} className="text-[var(--accent)]" />
            <h3 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Recommended_Pipelines</h3>
          </div>
          <div className="card p-8 border-dashed" style={{ background: 'var(--bg)' }}>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--surface2)] rounded">
                  <Search size={20} className="text-[#34a853]" />
                </div>
                <ArrowRight size={14} className="text-[var(--muted)]" />
                <div className="p-3 bg-[var(--surface2)] rounded">
                  <ExternalLink size={20} className="text-[#0077b5]" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1 px-4">
                <h4 className="text-sm font-bold mb-1">Blog-to-LinkedIn Pipeline</h4>
                <p className="text-[10px] mono text-[var(--muted)]">Generate SEO meta, then instantly format your LinkedIn announcement.</p>
              </div>
              <button className="btn-primary py-2 px-6 text-xs mono">RUN_AUTOFLOW</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
