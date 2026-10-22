'use client';

import React, { useState } from 'react';
import {
  TrendingUp, CheckCircle2, RefreshCw, Globe,
  Search, Link as LinkIcon, FileText, ArrowUpRight, Zap, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function SeoIntelligencePage() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<{ message: string; details?: any } | null>(null);

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
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Operations & Search Intelligence
          </div>
          <h1 className={adminStyles.title}>
            SEO Health & <span className={adminStyles.titleAccent}>Search Console</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Actionable Search Performance, Index Coverage (103/110), and 1-Click Optimization Triggers.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <button
            onClick={() => handleExecuteAction('reindex-site')}
            disabled={loadingAction === 'reindex-site'}
            className={adminStyles.primary}
          >
            <RefreshCw size={14} className={loadingAction === 'reindex-site' ? 'animate-spin' : ''} />
            {loadingAction === 'reindex-site' ? 'Re-Indexing...' : 'Re-Submit Sitemap'}
          </button>
        </div>
      </div>

      {/* Action Output Notification */}
      {actionOutput && (
        <div className={adminStyles.notice} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          <CheckCircle2 size={16} />
          <span>{actionOutput.message}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Overall SEO Score</span>
            <ShieldCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            98<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>/100</span>
          </div>
          <div className={adminStyles.metricBottom}>
            <span>High Authority Status</span>
            <span>Audit benchmark</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Google Index Coverage</span>
            <Globe size={16} />
          </div>
          <div className={adminStyles.metricValue}>103/110</div>
          <div className={adminStyles.metricBottom}>
            <span>93.6% Indexed URLs</span>
            <span>Live sitemap</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Thin Content Protected</span>
            <FileText size={16} />
          </div>
          <div className={adminStyles.metricValue}>47</div>
          <div className={adminStyles.metricBottom}>
            <span>noindex Directives Enforced</span>
            <span>Protected paths</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Internal Link Density</span>
            <LinkIcon size={16} />
          </div>
          <div className={adminStyles.metricValue}>16.6</div>
          <div className={adminStyles.metricBottom}>
            <span>1,824 total graph links</span>
            <span>Avg per article</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Broken Link Errors</span>
            <CheckCircle2 size={16} />
          </div>
          <div className={adminStyles.metricValue}>0</div>
          <div className={adminStyles.metricBottom}>
            <span>100% Clean Health</span>
            <span>Zero 404s</span>
          </div>
        </div>
      </div>

      {/* 1-Click Operational Actions */}
      <div className={adminStyles.panel}>
        <div className={adminStyles.panelHeading}>
          <h2>1-Click SEO Repair & Optimization Triggers</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 14 }}>
          {[
            {
              title: 'Rebuild Internal Links',
              desc: 'Scan all 110 articles and re-link contextually using semantic heuristics.',
              action: 'rebuild-links',
              btn: 'Run Linking Script',
            },
            {
              title: 'Fix Missing Meta Descriptions',
              desc: 'Generate missing metadata summaries for active blog and service routes.',
              action: 'fix-meta',
              btn: 'Fix Meta Tags',
            },
            {
              title: 'Generate FAQ Schema',
              desc: 'Inject JSON-LD FAQ structured schema markup into high-priority guides.',
              action: 'generate-faq',
              btn: 'Generate FAQ Schema',
            },
          ].map((item, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 18, background: 'var(--surface2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>{item.desc}</div>
              </div>
              <button
                onClick={() => handleExecuteAction(item.action)}
                disabled={loadingAction === item.action}
                className={adminStyles.secondary}
                style={{ width: '100%', minHeight: 34, fontSize: 11 }}
              >
                {loadingAction === item.action ? 'Executing...' : item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* High-Impression Search Opportunities */}
      <div className={adminStyles.panel} style={{ marginBottom: 0 }}>
        <div className={adminStyles.panelHeading}>
          <h2>High-Impression Search Opportunities (Rankings 5–15)</h2>
        </div>
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
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, background: 'var(--surface2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{op.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>
                  <span>Impressions: <strong style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{op.impressions}</strong></span>
                  <span>Clicks: <strong style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{op.clicks}</strong></span>
                  <span>CTR: <strong style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{op.ctr}</strong></span>
                  <span>Position: <strong style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{op.position}</strong></span>
                </div>
              </div>
              <div className={adminStyles.notice} style={{ marginBottom: 0, padding: '8px 12px', fontSize: 11 }}>
                <span>💡 <strong>Optimization Tip:</strong> {op.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
