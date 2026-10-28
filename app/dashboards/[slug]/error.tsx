'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center', border: '1px solid var(--border)', padding: '3rem', borderRadius: '16px', background: 'var(--surface)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Dashboard Temporarily Unavailable</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          We encountered an unexpected issue while loading this interactive dashboard view. Please try refreshing or return to the dashboards gallery.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--accent)', color: 'var(--btn-primary-text)', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Retry Loading
          </button>
          <Link
            href="/dashboards"
            style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
          >
            All Dashboards
          </Link>
        </div>
      </div>
    </div>
  );
}

