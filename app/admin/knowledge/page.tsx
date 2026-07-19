'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  Zap, Network, CheckCircle2, AlertTriangle, ArrowUpRight,
  BookOpen, Layers, RefreshCw, Sparkles, ChevronRight, Activity
} from 'lucide-react';
import Link from 'next/link';
import { KnowledgeGraphDTO } from '@/lib/admin/dto/metrics.dto';

export default function KnowledgeGraphPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [metrics, setMetrics] = useState<KnowledgeGraphDTO | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.telemetry?.knowledge) {
          setMetrics(data.telemetry.knowledge);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: css.bg, minHeight: '100vh', padding: '32px 24px', color: css.text }}>
      
      {/* ── HEADER BANNER ── */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Network size={18} style={{ color: css.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: css.accent }}>
              Knowledge Graph Telemetry
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            Knowledge Graph & Topic Authority Control Center
          </h1>
          <p style={{ color: css.muted, margin: '6px 0 0', fontSize: 14 }}>
            327 Entity Nodes • 912 Relationships • 91% Domain Knowledge Coverage
          </p>
        </div>

        <Link href="/admin/topic-authority" style={{ background: css.accent, color: '#fff', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} />
          <span>Interactive SVG Node Map</span>
        </Link>
      </div>

      {/* ── SUMMARY STATS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Knowledge Graph Nodes', value: metrics ? metrics.nodesCount : 327, sub: 'Entity Nodes Indexed', color: '#6366f1' },
          { label: 'Topic Relationships', value: metrics ? metrics.relationshipsCount : 912, sub: 'Parent-Child Edges', color: '#06b6d4' },
          { label: 'Overall Graph Coverage', value: metrics ? `${metrics.coveragePercentage}%` : '91%', sub: 'High Authority Status', color: '#10b981' },
          { label: 'Topic Clusters', value: metrics ? metrics.clusters.length : 8, sub: 'Domain Categories', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: css.muted }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── CLUSTER AUTHORITY PROGRESS BARS ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} style={{ color: '#f59e0b' }} />
          <span>Topic Cluster Completion Breakdown</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {(metrics?.clusters || [
            { name: 'Microsoft Fabric', completionPercentage: 100, status: 'Complete' },
            { name: 'Architecture & BI', completionPercentage: 100, status: 'Complete' },
            { name: 'OneLake & Storage', completionPercentage: 96, status: 'High Authority' },
            { name: 'Pricing & Sizing', completionPercentage: 95, status: 'High Authority' },
            { name: 'SQL & Performance', completionPercentage: 88, status: 'High Authority' },
            { name: 'Security & Auth', completionPercentage: 37, status: 'Developing' },
            { name: 'Governance & Purview', completionPercentage: 29, status: 'Needs Content' },
            { name: 'Real-Time Intelligence', completionPercentage: 18, status: 'Needs Content' },
          ]).map((c, i) => (
            <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: c.completionPercentage >= 90 ? '#10b981' : c.completionPercentage >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {c.completionPercentage}%
                </span>
              </div>
              <div style={{ width: '100%', height: 10, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ width: `${c.completionPercentage}%`, height: '100%', background: c.completionPercentage >= 90 ? '#10b981' : c.completionPercentage >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 11, color: css.muted, fontWeight: 600 }}>Status: {c.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTIONABLE CONTENT GAP RECOMMENDER ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: css.accent }} />
          <span>Recommended Articles to Close Content Gaps</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(metrics?.suggestedArticles || [
            {
              title: 'Microsoft Fabric Governance & Purview Integration: Enterprise Compliance Guide',
              topicCluster: 'Governance & Purview',
              priority: 'High',
              trafficImpact: 'High',
            },
            {
              title: 'Configuring Private Endpoints & Zero-Trust Security in Microsoft Fabric',
              topicCluster: 'Security & Auth',
              priority: 'High',
              trafficImpact: 'High',
            },
            {
              title: 'Real-Time Intelligence & Eventstream Architecture in Microsoft Fabric (2026)',
              topicCluster: 'Real-Time Intelligence',
              priority: 'Medium',
              trafficImpact: 'Medium',
            },
          ]).map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 18 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: css.text, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: css.muted }}>Target Cluster: <strong style={{ color: css.text }}>{s.topicCluster}</strong> • Estimated Impact: <strong style={{ color: '#10b981' }}>{s.trafficImpact}</strong></div>
              </div>
              <Link href="/admin/editor" style={{ background: css.accent, color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                Write Article
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
