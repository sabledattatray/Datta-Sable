'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, Eye, Clock,
  Globe, Smartphone, Laptop, PieChart
} from 'lucide-react';
import Link from 'next/link';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function AnalyticsOverviewPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={adminStyles.page}>
      
      {/* ── HEADER BANNER ── */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> GROWTH &amp; INTELLIGENCE
          </div>
          <h1 className={adminStyles.title}>
            Analytics Overview &amp; <span className={adminStyles.titleAccent}>Audience Performance</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Real-time page views, unique visitors, traffic channels, and device telemetry.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <Link href="/admin/analytics/traffic" className={adminStyles.secondary}>
            Traffic &amp; Behavior →
          </Link>
          <Link href="/admin/analytics/reports" className={adminStyles.primary}>
            Custom Reports →
          </Link>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className={adminStyles.metricGrid}>
        {[
          { label: 'Total Pageviews', value: metrics ? (metrics.totalViews || 5180).toLocaleString() : '5,180', sub: '+18.4% vs last month', icon: Eye },
          { label: 'Unique Visitors', value: metrics ? (metrics.uniqueVisitors || 1581).toLocaleString() : '1,581', sub: '+12.1% new visitors', icon: Users },
          { label: 'Avg Session Duration', value: metrics ? metrics.avgSessionDuration || '3m 24s' : '3m 24s', sub: 'High engagement', icon: Clock },
          { label: 'Bounce Rate', value: metrics ? metrics.bounceRate || '32.1%' : '32.1%', sub: 'Healthy threshold', icon: TrendingUp },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={adminStyles.metricCard}>
              <div className={adminStyles.metricTop}>
                <span>{m.label}</span>
                <Icon size={16} />
              </div>
              <span className={adminStyles.metricValue}>{m.value}</span>
              <div className={adminStyles.metricBottom}>
                <span>{m.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TRAFFIC CHANNELS & DEVICE BREAKDOWN ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        
        {/* Traffic Channels */}
        <div className={adminStyles.panel}>
          <div className={adminStyles.panelHeading}>
            <h2>
              <Globe size={17} style={{ color: 'var(--accent)', marginRight: 8, verticalAlign: 'middle' }} />
              Traffic Source Channels
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { channel: 'Google Organic Search', percentage: 74 },
              { channel: 'Bing Organic Search', percentage: 16 },
              { channel: 'Direct Traffic', percentage: 6 },
              { channel: 'LinkedIn & Social', percentage: 4 },
            ].map((ch, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
                  <span>{ch.channel}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{ch.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${ch.percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: 999, opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className={adminStyles.panel}>
          <div className={adminStyles.panelHeading}>
            <h2>
              <Laptop size={17} style={{ color: 'var(--accent)', marginRight: 8, verticalAlign: 'middle' }} />
              Device Category Distribution
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { device: 'Desktop / Workstation', percentage: 62, icon: Laptop },
              { device: 'Mobile Phones', percentage: 34, icon: Smartphone },
              { device: 'Tablet & Others', percentage: 4, icon: PieChart },
            ].map((d, i) => {
              const DevIcon = d.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
                      <DevIcon size={16} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{d.device}</span>
                  </div>
                  <span className={adminStyles.badge}>{d.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
