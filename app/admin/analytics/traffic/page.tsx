'use client';

import React from 'react';
import {
  Globe, Eye, MapPin
} from 'lucide-react';
import Link from 'next/link';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function TrafficBehaviorPage() {
  return (
    <div className={adminStyles.page}>
      
      {/* ── HEADER BANNER ── */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> USER BEHAVIOR &amp; ENGAGEMENT
          </div>
          <h1 className={adminStyles.title}>
            Traffic &amp; Content Engagement <span className={adminStyles.titleAccent}>Telemetry</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Most visited articles, geographic breakdown, and audience engagement retention.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <Link href="/admin/analytics" className={adminStyles.secondary}>
            ← Overview
          </Link>
          <Link href="/admin/analytics/reports" className={adminStyles.primary}>
            Custom Reports →
          </Link>
        </div>
      </div>

      {/* ── TOP VISITED ARTICLES TABLE ── */}
      <div className={adminStyles.panel}>
        <div className={adminStyles.panelHeading}>
          <h2>
            <Eye size={17} style={{ color: 'var(--accent)', marginRight: 8, verticalAlign: 'middle' }} />
            Top Visited Articles &amp; Content Engagement
          </h2>
        </div>
        
        <div className={adminStyles.tableWrapper} style={{ marginTop: 0 }}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th className={adminStyles.th}>Article Title &amp; Route</th>
                <th className={adminStyles.th}>Pageviews</th>
                <th className={adminStyles.th}>Unique Visitors</th>
                <th className={adminStyles.th}>Avg Time on Page</th>
                <th className={adminStyles.th}>Bounce Rate</th>
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
                <tr key={i} className={adminStyles.tr}>
                  <td className={adminStyles.td}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{row.path}</div>
                  </td>
                  <td className={adminStyles.td} style={{ fontWeight: 600, color: 'var(--accent)' }}>{row.views}</td>
                  <td className={adminStyles.td}>{row.visitors}</td>
                  <td className={adminStyles.td}>{row.time}</td>
                  <td className={adminStyles.td}>
                    <span className={adminStyles.badge}>{row.bounce}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GEOGRAPHIC TRAFFIC DISTRIBUTION ── */}
      <div className={adminStyles.panel}>
        <div className={adminStyles.panelHeading}>
          <h2>
            <MapPin size={17} style={{ color: 'var(--accent)', marginRight: 8, verticalAlign: 'middle' }} />
            Geographic Traffic Distribution
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 14 }}>
          {[
            { country: 'India', share: '58%', flag: '🇮🇳', visitors: '916' },
            { country: 'United States', share: '22%', flag: '🇺🇸', visitors: '347' },
            { country: 'United Kingdom', share: '8%', flag: '🇬🇧', visitors: '126' },
            { country: 'Germany', share: '5%', flag: '🇩🇪', visitors: '79' },
            { country: 'Others', share: '7%', flag: '🌐', visitors: '113' },
          ].map((c, i) => (
            <div key={i} className={adminStyles.metricCard}>
              <div className={adminStyles.metricTop}>
                <span>{c.flag} {c.country}</span>
                <span className={adminStyles.badge}>{c.share}</span>
              </div>
              <span className={adminStyles.metricValue} style={{ margin: '14px 0 8px', fontSize: 24 }}>{c.visitors}</span>
              <div className={adminStyles.metricBottom}>
                <span>Visitors</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
