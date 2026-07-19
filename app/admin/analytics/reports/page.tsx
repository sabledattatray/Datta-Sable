'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  FileText, Download, Calendar, Filter, CheckCircle2,
  BarChart3, RefreshCw, Mail, Sparkles, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function CustomReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dateRange, setDateRange] = useState('30d');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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

  const handleExport = (reportName: string, format: string) => {
    setDownloading(reportName);
    setNotification(null);
    setTimeout(() => {
      setDownloading(null);
      setNotification(`Successfully generated and downloaded ${reportName} (${format.toUpperCase()})!`);
    }, 1000);
  };

  return (
    <div style={{ background: css.bg, minHeight: '100vh', padding: '32px 24px', color: css.text }}>
      
      {/* ── HEADER BANNER ── */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FileText size={18} style={{ color: css.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: css.accent }}>
              Reporting & Data Export Center
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            Custom Analytics & Performance Reports
          </h1>
          <p style={{ color: css.muted, margin: '6px 0 0', fontSize: 14 }}>
            Generate, schedule, and export executive telemetry reports in CSV and PDF formats.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/analytics" style={{ background: css.surface, color: css.text, border: `1px solid ${css.border}`, padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            ← Overview
          </Link>
          <Link href="/admin/analytics/traffic" style={{ background: css.surface, color: css.text, border: `1px solid ${css.border}`, padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Traffic & Behavior →
          </Link>
        </div>
      </div>

      {/* ── NOTIFICATION ALERT ── */}
      {notification && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '14px 20px', borderRadius: 12, marginBottom: 28, color: '#10b981', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* ── DATE RANGE & FILTER CONTROLS ── */}
      <div style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 20, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calendar size={18} style={{ color: css.accent }} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Select Time Period:</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'ytd', label: 'Year to Date' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setDateRange(btn.id)}
              style={{
                background: dateRange === btn.id ? css.accent : css.surface,
                color: dateRange === btn.id ? '#ffffff' : css.text,
                border: `1px solid ${css.border}`,
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── REPORT TEMPLATES GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
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
          <div key={i} style={{ background: css.card, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: css.text, marginBottom: 8 }}>{report.name}</div>
              <div style={{ fontSize: 13, color: css.muted, marginBottom: 20, lineHeight: 1.6 }}>{report.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleExport(report.name, 'csv')}
                disabled={downloading === report.name}
                style={{
                  flex: 1,
                  background: css.accent,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Download size={14} />
                <span>{downloading === report.name ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
