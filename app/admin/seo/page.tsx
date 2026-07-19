'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  TrendingUp, CheckCircle2, AlertTriangle, RefreshCw, Globe,
  Search, Link as LinkIcon, FileText, ArrowUpRight, Zap, ShieldCheck, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function SeoIntelligencePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<{ message: string; details?: any } | null>(null);

  const css = isDark
    ? {
        bg: '#000000',
        card: '#0a0a0a',
        border: '#1f1f1f',
        text: '#f8fafc',
        muted: '#64748b',
        accent: '#6366f1',
        success: '#10b981',
      }
    : {
        bg: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: '#4f46e5',
        success: '#059669',
      };

  const handleExecuteAction = async (action: string) => {
    setLoadingAction(action);
    setActionOutput(null);
    try {
      const res = await fetch('/api/admin/seo-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionOutput({ message: data.message, details: data.details });
      } else {
        setActionOutput({ message: data.error || 'Failed to execute action' });
      }
    } catch (err) {
      setActionOutput({ message: 'Network error while executing action' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ background: css.bg, minHeight: '100vh', padding: '32px 24px', color: css.text }}>
      
      {/* ── HEADER BANNER ── */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={18} style={{ color: css.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: css.accent }}>
              Operations & Search Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            SEO Health & Search Console Intelligence
          </h1>
          <p style={{ color: css.muted, margin: '6px 0 0', fontSize: 14 }}>
            Actionable Search Performance, Index Coverage (103/110), and 1-Click Optimization Triggers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleExecuteAction('reindex-site')}
            disabled={loadingAction === 'reindex-site'}
            style={{
              background: css.accent,
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <RefreshCw size={14} className={loadingAction === 'reindex-site' ? 'animate-spin' : ''} />
            {loadingAction === 'reindex-site' ? 'Re-Indexing...' : 'Re-Submit Sitemap'}
          </button>
        </div>
      </div>

      {/* ── ACTION OUTPUT NOTIFICATION ── */}
      {actionOutput && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '16px 20px', borderRadius: 12, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', fontWeight: 700, fontSize: 14 }}>
            <CheckCircle2 size={18} />
            <span>{actionOutput.message}</span>
          </div>
        </div>
      )}

      {/* ── METRICS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Overall SEO Score', value: '98/100', sub: 'High Authority Status', color: '#10b981' },
          { label: 'Google Index Coverage', value: '103 / 110', sub: '93.6% Indexed', color: '#6366f1' },
          { label: 'Thin Content Protected', value: '47 Pages', sub: 'noindex Enforced', color: '#06b6d4' },
          { label: 'Internal Link Density', value: '16.6 avg', sub: '1,824 Total Links', color: '#f59e0b' },
          { label: 'Broken Links', value: '0', sub: 'Clean Health', color: '#10b981' },
        ].map((m, i) => (
          <div key={i} style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: css.muted }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── 1-CLICK OPERATIONAL ACTIONS ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: css.accent }} />
          <span>1-Click SEO Repair & Optimization Triggers</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            {
              title: 'Rebuild Internal Links',
              desc: 'Scan all 110 articles and re-link contextually',
              action: 'rebuild-links',
              btn: 'Run Linking Script',
            },
            {
              title: 'Fix Missing Meta Descriptions',
              desc: 'Generate missing metadata for active routes',
              action: 'fix-meta',
              btn: 'Fix Meta Tags',
            },
            {
              title: 'Generate FAQ Schema',
              desc: 'Inject JSON-LD FAQ schema into top guides',
              action: 'generate-faq',
              btn: 'Generate FAQ',
            },
          ].map((item, i) => (
            <div key={i} style={{ border: `1px solid ${css.border}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: css.muted, marginBottom: 16 }}>{item.desc}</div>
              </div>
              <button
                onClick={() => handleExecuteAction(item.action)}
                disabled={loadingAction === item.action}
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: css.accent,
                  border: `1px solid ${css.accent}`,
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {loadingAction === item.action ? 'Executing...' : item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── HIGH IMPRESSION / LOW CTR OPPORTUNITIES ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} style={{ color: '#f59e0b' }} />
          <span>High-Impression Search Opportunities (Rankings 5–15)</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              title: 'Microsoft Fabric Pricing Explained (2026): Complete Guide to F-SKUs',
              impressions: '1,420',
              clicks: '17',
              ctr: '1.2%',
              position: '11.2',
              recommendation: 'Rewrite meta description to highlight "Complete F-SKU Cost Calculator" for +15% CTR boost.',
            },
            {
              title: 'DP-600 vs DP-700 vs DP-800: Which Microsoft Fabric Certification Should You Choose?',
              impressions: '1,850',
              clicks: '64',
              ctr: '3.4%',
              position: '8.4',
              recommendation: 'Add FAQ section covering Exam Voucher & Study Time to move into Top 5 results.',
            },
            {
              title: 'OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide',
              impressions: '980',
              clicks: '8',
              ctr: '0.8%',
              position: '14.1',
              recommendation: 'Add 4 internal links from Spark & Delta Lake articles to raise authority.',
            },
          ].map((op, i) => (
            <div key={i} style={{ border: `1px solid ${css.border}`, borderRadius: 14, padding: 18, background: isDark ? '#121212' : '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: css.text }}>{op.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600, color: css.muted }}>
                  <span>Impressions: <strong style={{ color: css.text }}>{op.impressions}</strong></span>
                  <span>Clicks: <strong style={{ color: css.text }}>{op.clicks}</strong></span>
                  <span>CTR: <strong style={{ color: '#10b981' }}>{op.ctr}</strong></span>
                  <span>Position: <strong style={{ color: css.accent }}>{op.position}</strong></span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: css.muted, background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)', padding: '8px 12px', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
                💡 <strong>Suggestion:</strong> {op.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
