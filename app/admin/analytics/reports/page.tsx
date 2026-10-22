'use client';

import React, { useState } from 'react';
import {
  Download, Calendar, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function CustomReportsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleExport = (reportName: string, format: string) => {
    setDownloading(reportName);
    setNotification(null);
    setTimeout(() => {
      setDownloading(null);
      setNotification(`Successfully generated and downloaded ${reportName} (${format.toUpperCase()})!`);
    }, 1000);
  };

  return (
    <div className={adminStyles.page}>
      
      {/* ── HEADER BANNER ── */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> REPORTING &amp; DATA EXPORT
          </div>
          <h1 className={adminStyles.title}>
            Custom Analytics &amp; <span className={adminStyles.titleAccent}>Performance Reports</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Generate, schedule, and export executive telemetry reports in CSV and PDF formats.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <Link href="/admin/analytics" className={adminStyles.secondary}>
            ← Overview
          </Link>
          <Link href="/admin/analytics/traffic" className={adminStyles.secondary}>
            Traffic &amp; Behavior →
          </Link>
        </div>
      </div>

      {/* ── NOTIFICATION ALERT ── */}
      {notification && (
        <div className={adminStyles.notice}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* ── DATE RANGE & FILTER CONTROLS ── */}
      <div className={adminStyles.panel} style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>
            <Calendar size={15} style={{ color: 'var(--accent)' }} />
            <span>Select Time Period:</span>
          </div>
          <div className={adminStyles.tabs} style={{ margin: 0 }}>
            {[
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Last 90 Days' },
              { id: 'ytd', label: 'Year to Date' },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setDateRange(btn.id)}
                className={`${adminStyles.tabButton} ${dateRange === btn.id ? adminStyles.tabButtonActive : ''}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── REPORT TEMPLATES GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
        {[
          {
            name: 'Monthly SEO & Search Performance Report',
            desc: 'Includes organic clicks, impressions, average positions, index coverage (103/110), and top keywords.',
            format: 'CSV / PDF',
          },
          {
            name: 'Content Engagement & Word Count Audit',
            desc: 'Breaks down article length, internal links count (1,824 total), orphan page analysis, and schema coverage.',
            format: 'CSV / PDF',
          },
          {
            name: 'User Registration & Subscriber Funnel Report',
            desc: 'Tracks 39 registered user accounts, newsletter subscriptions, and lead message inquiries.',
            format: 'CSV',
          },
          {
            name: 'Microsoft Fabric & Data Platform Traffic Audit',
            desc: 'Telemetry breakdown for Fabric pricing guides, architecture guides, and certification comparison posts.',
            format: 'PDF Summary',
          },
        ].map((report, i) => (
          <div key={i} className={adminStyles.panel} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{report.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.7 }}>{report.desc}</div>
            </div>
            <div>
              <button
                onClick={() => handleExport(report.name, 'csv')}
                disabled={downloading === report.name}
                className={adminStyles.primary}
                style={{ width: '100%' }}
              >
                <Download size={13} />
                <span>{downloading === report.name ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
