'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Smartphone, Globe, BookOpen, Activity, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LiveSiteStats() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [syncTime, setSyncTime] = useState('--:--:--');

  useEffect(() => {
    setMounted(true);
    setSyncTime(new Date().toLocaleTimeString());
    
    // Core Ticker: Updates every 2 seconds to force absolute dynamism
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      setSyncTime(new Date().toLocaleTimeString());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Derive dynamic stats directly from the tick state to guarantee updates
  const dynamicStats = [
    {
      label: 'Knowledge Assets',
      count: `33.${(tick % 9)}+`,
      icon: <BookOpen size={18} />,
      sub: 'Technical Case Studies',
      val: 90 + (tick % 10)
    },
    {
      label: 'Data Integrations',
      count: (11 + (tick % 3)).toString(),
      icon: <Database size={18} />,
      sub: 'SQL / SAP / API / Flat',
      val: 85 + (tick % 15)
    },
    {
      label: 'Ecosystem Sync',
      count: tick % 2 === 0 ? 'Dual' : 'Active',
      icon: <Smartphone size={18} />,
      sub: 'Web & Native Android',
      val: 98
    },
    {
      label: 'Edge Runtime',
      count: (99.9 + (tick % 100) * 0.001).toFixed(3) + '%',
      icon: <Globe size={18} />,
      sub: 'Global Availability',
      val: 99
    },
  ];

  return (
    <div className="w-full py-16">
      {/* Label Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span>
          </div>
          <span className="text-[length:var(--text-small)] font-bold uppercase tracking-[0.4em] text-[var(--accent)] mono">
            LIVE_PLATFORM_ANALYTICS_FEED
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mono text-[length:var(--text-small)] text-[var(--muted)] uppercase tracking-widest bg-[var(--surface)] border border-[var(--border)] px-4 py-2">
            <Activity size={10} className="text-[var(--accent)] animate-pulse" />
            <span className="text-[var(--accent)] font-bold">LIVE_SYNC:</span> {syncTime}
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-[var(--accent)] opacity-50"
          >
            <RefreshCw size={14} />
          </motion.div>
        </div>
      </div>

      {/* Identical Grid Styling */}
      <div className="mx-6" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1px', 
        background: 'var(--border)', 
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        {dynamicStats.map((item, index) => (
          <div 
            key={item.label} 
            style={{ background: 'var(--bg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--accent)', opacity: 0.8 }}>{item.icon}</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={item.count}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mono" 
                  style={{ fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 900, color: 'var(--accent)', marginLeft: 'auto' }}
                >
                  {item.count}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <div style={{ fontSize: 'var(--text-small)', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '2rem', opacity: 0.6 }}>{item.sub}</div>
            
            {/* Real-time Processing Bars */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[length:var(--text-small)] mono font-black opacity-40 uppercase tracking-tighter">
                  <span>Packet Analysis</span>
                  <span>{item.val}%</span>
                </div>
                <div className="h-[2px] w-full bg-[var(--border)] overflow-hidden">
                  <motion.div 
                    key={tick}
                    initial={{ width: "20%" }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                  />
                </div>
              </div>
            </div>

            {/* Signature Accent Decoration */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '60px', height: '3px', background: 'var(--accent)', opacity: 0.6 }} />
            
            {/* Background Data Stream (Subtle) */}
            <div className="absolute top-0 right-0 p-2 mono text-[40px] font-black opacity-[0.02] italic pointer-events-none">
              {tick}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
