'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  Globe, Eye, Clock, ArrowUpRight, TrendingUp, Layers, MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function TrafficBehaviorPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? {
        bg: '#000000',
        card: '#0a0a0a',
        surface: '#121212',
        border: '#1f1f1f',
        text: '#f8fafc',
        muted: '#64748b',
        accent: '#6366f1',
      }
    : {
        bg: '#f8fafc',
        card: '#ffffff',
        surface: '#f1f5f9',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: '#4f46e5',
      };

  return (
    <div style={{ background: css.bg, minHeight: '100vh', padding: '32px 24px', color: css.text }}>
      
      {/* ── HEADER BANNER ── */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Globe size={18} style={{ color: css.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: css.accent }}>
              User Behavior & Content Engagement
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            Traffic & Content Engagement Telemetry
          </h1>
          <p style={{ color: css.muted, margin: '6px 0 0', fontSize: 14 }}>
            Most Visited Articles, Geographic Breakdown, and Click Depth Analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/analytics" style={{ background: css.surface, color: css.text, border: `1px solid ${css.border}`, padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            ← Overview
          </Link>
          <Link href="/admin/analytics/reports" style={{ background: css.accent, color: '#fff', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Custom Reports →
          </Link>
        </div>
      </div>

      {/* ── TOP VISITED ARTICLES TABLE ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Eye size={18} style={{ color: css.accent }} />
          <span>Top Visited Articles & Content Engagement</span>
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${css.border}`, textAlign: 'left', color: css.muted }}>
                <th style={{ padding: '12px 16px' }}>Article Title & Route</th>
                <th style={{ padding: '12px 16px' }}>Pageviews</th>
                <th style={{ padding: '12px 16px' }}>Unique Visitors</th>
                <th style={{ padding: '12px 16px' }}>Avg Time on Page</th>
                <th style={{ padding: '12px 16px' }}>Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Microsoft Fabric Pricing Explained (2026)', path: '/blog/microsoft-fabric-pricing-guide-2026', views: '1,420', visitors: '980', time: '4m 12s', bounce: '28.4%' },
                { title: 'DP-600 vs DP-700 vs DP-800 Certification Comparison', path: '/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison', views: '1,850', visitors: '1,240', time: '5m 05s', bounce: '24.1%' },
                { title: 'OneLake Explained: Microsoft Fabric OneLake Architecture', path: '/blog/microsoft-fabric-onelake-architecture-guide', views: '980', visitors: '670', time: '3m 54s', bounce: '31.2%' },
                { title: 'Microsoft Fabric Architecture Explained (2026)', path: '/blog/microsoft-fabric-architecture-explained-2026', views: '1,620', visitors: '1,110', time: '6m 18s', bounce: '22.8%' },
                { title: 'Free Microsoft Fabric Certification Voucher Guide 2026', path: '/blog/free-microsoft-certifications-fabric-data-days-2026', views: '1,280', visitors: '890', time: '3m 22s', bounce: '29.7%' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${css.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    <div>{row.title}</div>
                    <div style={{ fontSize: 11, color: css.muted }}>{row.path}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: css.accent }}>{row.views}</td>
                  <td style={{ padding: '14px 16px' }}>{row.visitors}</td>
                  <td style={{ padding: '14px 16px' }}>{row.time}</td>
                  <td style={{ padding: '14px 16px', color: '#10b981' }}>{row.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GEOGRAPHIC TRAFFIC DISTRIBUTION ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} style={{ color: '#10b981' }} />
          <span>Geographic Traffic Distribution</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { country: 'India', share: '58%', flag: '🇮🇳', visitors: '916' },
            { country: 'United States', share: '22%', flag: '🇺🇸', visitors: '347' },
            { country: 'United Kingdom', share: '8%', flag: '🇬🇧', visitors: '126' },
            { country: 'Germany', share: '5%', flag: '🇩🇪', visitors: '79' },
            { country: 'Others', share: '7%', flag: '🌐', visitors: '113' },
          ].map((c, i) => (
            <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{c.flag} <strong style={{ fontSize: 14, marginLeft: 6 }}>{c.country}</strong></span>
                <span style={{ fontSize: 16, fontWeight: 900, color: css.accent }}>{c.share}</span>
              </div>
              <div style={{ fontSize: 12, color: css.muted }}>{c.visitors} Visitors</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
