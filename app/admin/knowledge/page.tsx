'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap, Network, Activity, Sparkles, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { KnowledgeGraphDTO } from '@/lib/admin/dto/metrics.dto';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function KnowledgeGraphPage() {
  const [metrics, setMetrics] = useState<KnowledgeGraphDTO | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Knowledge Graph Telemetry
          </div>
          <h1 className={adminStyles.title}>
            Knowledge Graph & <span className={adminStyles.titleAccent}>Topic Authority</span>
          </h1>
          <p className={adminStyles.subtitle}>
            327 Entity Nodes • 912 Semantic Relationships • 91% Domain Knowledge Coverage
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <Link href="/admin/topic-authority" className={adminStyles.primary}>
            <Activity size={14} /> Interactive Node Map
          </Link>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Indexed Nodes</span>
            <Network size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics ? metrics.nodesCount : 327}</div>
          <div className={adminStyles.metricBottom}>
            <span>Entity nodes in graph</span>
            <span>Total indexed</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Topic Relationships</span>
            <Activity size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics ? metrics.relationshipsCount : 912}</div>
          <div className={adminStyles.metricBottom}>
            <span>Parent-child graph edges</span>
            <span>Bidirectional links</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Graph Coverage</span>
            <Zap size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics ? `${metrics.coveragePercentage}%` : '91%'}</div>
          <div className={adminStyles.metricBottom}>
            <span>High authority domain status</span>
            <span>SEO footprint</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Topic Clusters</span>
            <Sparkles size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics ? metrics.clusters.length : 8}</div>
          <div className={adminStyles.metricBottom}>
            <span>Domain core verticals</span>
            <span>Knowledge pillars</span>
          </div>
        </div>
      </div>

      {/* Cluster Authority Progress Bars */}
      <div className={adminStyles.panel}>
        <div className={adminStyles.panelHeading}>
          <h2>Topic Cluster Completion Breakdown</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
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
            <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.completionPercentage >= 90 ? '#34d399' : c.completionPercentage >= 50 ? '#fbbf24' : '#f87171', fontVariantNumeric: 'tabular-nums' }}>
                  {c.completionPercentage}%
                </span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--surface)', borderRadius: 999, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--border)' }}>
                <div style={{ width: `${c.completionPercentage}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>Status: {c.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Content Gap Recommender */}
      <div className={adminStyles.panel} style={{ marginBottom: 0 }}>
        <div className={adminStyles.panelHeading}>
          <h2>Recommended Articles to Close Content Gaps</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Target Cluster: <strong style={{ color: 'var(--text)' }}>{s.topicCluster}</strong> &bull; Estimated Impact: <strong style={{ color: 'var(--accent)' }}>{s.trafficImpact}</strong>
                </div>
              </div>
              <Link href="/admin/editor" className={adminStyles.primary} style={{ minHeight: 32, padding: '4px 14px' }}>
                Write Story <ArrowUpRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
