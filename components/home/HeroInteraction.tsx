'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function HeroInteraction() {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    if ((window as any).Capacitor?.isNative) setIsApp(true);
  }, []);

  return (
    <>
      {/* App-specific overlay (client-side only) */}
      {isApp && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, var(--accent) 0%, var(--accent) 50%, transparent 85%)',
          zIndex: 1,
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
      )}

      <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-4">
        <Link href="/blog" className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2" style={{ textDecoration: 'none' }}>
          READ ARTICLES
        </Link>
        <Link href="/about" className="btn-outline w-full sm:w-auto text-center" style={{ textDecoration: 'none' }}>
          ABOUT ME
        </Link>
        <Link href="/tools" className="btn-minimal w-full sm:w-auto text-center" style={{ textDecoration: 'none' }}>
          EXPLORE TOOLS →
        </Link>
      </div>

      <div className="flex items-center gap-3 opacity-60" style={{ marginTop: '3.5rem' }}>
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse flex-shrink-0" />
        <p className="text-[10px] mono uppercase tracking-widest">
          AI Tutorials · Next.js · SEO · Digital Marketing · Power BI · Web Dev
        </p>
      </div>
    </>
  );
}
