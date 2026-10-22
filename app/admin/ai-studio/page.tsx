'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Bot, RefreshCw, Play, CheckCircle2, AlertTriangle, ShieldAlert,
  Clock, DollarSign, Cpu, FileText, ArrowRight, ExternalLink, Sliders, Layers,
  Terminal, Search, BookOpen, AlertCircle, Eye, Check, X
} from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';
import { DEFAULT_AI_CATEGORIES } from '@/lib/ai/config';

export default function AiStudioPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'discovery' | 'generator' | 'drafts' | 'mcp' | 'settings' | 'logs'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [genTopic, setGenTopic] = useState('');
  const [genCategory, setGenCategory] = useState<string>(DEFAULT_AI_CATEGORIES[0]);
  const [genTier, setGenTier] = useState<'STANDARD' | 'COMPREHENSIVE' | 'DEEP_TECHNICAL'>('COMPREHENSIVE');
  const [genMode, setGenMode] = useState<'MANUAL' | 'ASSISTED' | 'AUTONOMOUS'>('ASSISTED');

  // Settings form states
  const [settingsMode, setSettingsMode] = useState<string>('ASSISTED');
  const [settingsBudget, setSettingsBudget] = useState<number>(25);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/ai-studio?tab=${activeTab}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.stats) {
          setSettingsMode(json.stats.operatingMode || 'ASSISTED');
          setSettingsBudget(json.stats.monthlyBudget || 25);
        }
      }
    } catch (err) {
      console.error('Failed to load AI Studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAction = async (action: string, payload: any = {}) => {
    setActionLoading(action);
    setNotification(null);
    try {
      const res = await fetch('/api/admin/ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const result = await res.json();

      if (res.ok) {
        setNotification({ type: 'success', message: result.message || 'Action executed successfully.' });
        await fetchData();
      } else {
        setNotification({ type: 'error', message: result.error || 'Action failed.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Network error executing action.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickDiscover = async () => {
    await handleAction('discover-topics', { category: genCategory, limit: 5 });
    setActiveTab('discovery');
  };

  const handleQuickDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;
    await handleAction('generate-draft', {
      topic: genTopic,
      category: genCategory,
      tier: genTier,
      operatingMode: genMode,
    });
    setGenTopic('');
    setActiveTab('drafts');
  };

  return (
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            AI Content Intelligence & Automation
          </div>
          <h1 className={adminStyles.title}>
            AI Content Studio & <span className={adminStyles.titleAccent}>Publishing Platform</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Factual technical research, deep long-form article drafting, SEO metadata automation, duplicate protection, and MCP connectivity.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <button
            onClick={() => handleAction('toggle-emergency-pause', { paused: !data?.stats?.emergencyPaused })}
            disabled={actionLoading === 'toggle-emergency-pause'}
            className={data?.stats?.emergencyPaused ? adminStyles.primary : adminStyles.secondary}
            style={{ borderColor: data?.stats?.emergencyPaused ? 'var(--danger, #ef4444)' : undefined }}
          >
            {data?.stats?.emergencyPaused ? <ShieldAlert size={15} /> : <AlertTriangle size={15} />}
            {data?.stats?.emergencyPaused ? 'RESUME AUTOMATION' : 'EMERGENCY PAUSE'}
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className={adminStyles.secondary}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div style={{
          padding: '14px 18px',
          marginBottom: '24px',
          borderRadius: '12px',
          background: notification.type === 'success' ? '#10b98115' : '#ef444415',
          border: `1px solid ${notification.type === 'success' ? '#10b98140' : '#ef444440'}`,
          color: notification.type === 'success' ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'discovery', label: 'Topic Discovery', icon: Search },
          { id: 'generator', label: 'Article Generator', icon: Sparkles },
          { id: 'drafts', label: 'Drafts & Approvals', icon: FileText },
          { id: 'mcp', label: 'MCP Server', icon: Terminal },
          { id: 'settings', label: 'Settings & Budget', icon: Sliders },
          { id: 'logs', label: 'Telemetry & Logs', icon: Cpu },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: isActive ? 'var(--accent)' : 'var(--surface)',
                color: isActive ? '#000' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} color="var(--accent)" /> Content Opportunities
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{data?.stats?.topicsCount ?? '—'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Identified technical topics</div>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#f59e0b" /> Pending Approvals
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{data?.stats?.draftsCount ?? '—'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting editorial review</div>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#10b981" /> Published via AI
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{data?.stats?.publishedCount ?? '—'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Promoted to public catalog</div>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="var(--accent)" /> Monthly Spend
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>${(data?.stats?.currentMonthSpend ?? 0).toFixed(3)}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Cap: ${(data?.stats?.monthlyBudget ?? 25).toFixed(2)} / month</div>
            </div>
          </div>

          {/* Quick Actions & Recent Drafts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent)" /> Quick Article Creator
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Launch a research-backed generation job immediately.
              </p>

              <form onSubmit={handleQuickDraft}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Topic Title</label>
                  <input
                    type="text"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    placeholder="e.g. Real-Time Data Streaming with Microsoft Fabric Eventhouse"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Category</label>
                    <select
                      value={genCategory}
                      onChange={(e) => setGenCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                    >
                      {DEFAULT_AI_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Tier</label>
                    <select
                      value={genTier}
                      onChange={(e) => setGenTier(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                    >
                      <option value="STANDARD">Standard (1.2k words)</option>
                      <option value="COMPREHENSIVE">Comprehensive (2.4k words)</option>
                      <option value="DEEP_TECHNICAL">Deep Technical (3.5k+ words)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={actionLoading === 'generate-draft'}
                    className={adminStyles.primary}
                    style={{ flex: 1 }}
                  >
                    <Sparkles size={14} className={actionLoading === 'generate-draft' ? 'animate-spin' : ''} />
                    {actionLoading === 'generate-draft' ? 'Drafting Article...' : 'Generate Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickDiscover}
                    disabled={actionLoading === 'discover-topics'}
                    className={adminStyles.secondary}
                  >
                    <Search size={14} />
                    Discover Topics
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Pending Drafts */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Drafts & Approvals</h3>
                <button onClick={() => setActiveTab('drafts')} style={{ fontSize: '12px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ArrowRight size={12} />
                </button>
              </div>

              {(!data?.recentDrafts || data.recentDrafts.length === 0) ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No drafts created yet. Launch your first generation above!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.recentDrafts.map((d: any) => (
                    <div key={d.id} style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {d.category} · {d.wordCount} words · Score: {d.qualityScore ? `${Math.round(d.qualityScore)}/100` : 'Evaluating'}
                        </div>
                      </div>

                      {d.status === 'PUBLISHED' ? (
                        <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', background: '#10b98120', color: '#10b981', fontWeight: 600 }}>PUBLISHED</span>
                      ) : (
                        <button
                          onClick={() => handleAction('publish-draft', { draftId: d.id, publishImmediately: true })}
                          disabled={actionLoading === 'publish-draft'}
                          style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--accent)', color: '#000', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                        >
                          Approve & Publish
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC DISCOVERY */}
      {activeTab === 'discovery' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px' }}>Content Opportunities & Gaps</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Identified through competitive gap analysis and search intent evaluation.</p>
            </div>

            <button
              onClick={() => handleAction('discover-topics', { category: genCategory, limit: 5 })}
              disabled={actionLoading === 'discover-topics'}
              className={adminStyles.primary}
            >
              <Search size={14} className={actionLoading === 'discover-topics' ? 'animate-spin' : ''} />
              Scan Opportunities
            </button>
          </div>

          {(!data?.topics || data.topics.length === 0) ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '14px' }}>No topic opportunities saved yet.</p>
              <button onClick={() => handleAction('discover-topics', { category: 'Microsoft Fabric', limit: 5 })} className={adminStyles.primary}>
                Discover First 5 Topics
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {data.topics.map((t: any) => (
                <div key={t.id} style={{ padding: '18px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', fontWeight: 600 }}>{t.category}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Intent: {t.searchIntent}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{t.topic}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.contentGapRationale}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>{t.opportunityScore}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OPPORTUNITY</div>
                    </div>

                    <button
                      onClick={() => {
                        setGenTopic(t.topic);
                        setGenCategory(t.category);
                        setActiveTab('generator');
                      }}
                      className={adminStyles.primary}
                    >
                      <Sparkles size={13} /> Draft Article
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GENERATOR */}
      {activeTab === 'generator' && (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>Autonomous Technical Article Generator</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Generates deep, practical documentation citing official Microsoft Learn / tech sources with verified outline and SEO metadata.
          </p>

          <form onSubmit={handleQuickDraft}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Topic / Subject</label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. End-to-End Real-Time Intelligence in Microsoft Fabric"
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Category</label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                >
                  {DEFAULT_AI_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Target Word Count Tier</label>
                <select
                  value={genTier}
                  onChange={(e) => setGenTier(e.target.value as any)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                >
                  <option value="STANDARD">Standard (1,000–1,800 words)</option>
                  <option value="COMPREHENSIVE">Comprehensive (1,800–3,000 words)</option>
                  <option value="DEEP_TECHNICAL">Deep Technical (3,000+ words)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Operating Mode for this Draft</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'MANUAL', label: 'Mode A: Manual', desc: 'Manual generation only' },
                  { id: 'ASSISTED', label: 'Mode B: Assisted (Default)', desc: 'Auto-draft, manual approval' },
                  { id: 'AUTONOMOUS', label: 'Mode C: Autonomous', desc: 'Auto-publish if score >= 80' },
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => setGenMode(m.id as any)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: `1px solid ${genMode === m.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: genMode === m.id ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading === 'generate-draft'}
              className={adminStyles.primary}
              style={{ width: '100%', padding: '14px', fontSize: '14px' }}
            >
              <Sparkles size={16} className={actionLoading === 'generate-draft' ? 'animate-spin' : ''} />
              {actionLoading === 'generate-draft' ? 'Executing Research & Writing...' : 'Generate Technical Article'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: DRAFTS & APPROVALS */}
      {activeTab === 'drafts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px' }}>Editorial Drafts & Approvals</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Review AI drafts, examine factual scores, and approve for publication.</p>
            </div>
          </div>

          {(!data?.drafts || data.drafts.length === 0) ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '14px' }}>No drafts available.</p>
              <button onClick={() => setActiveTab('generator')} className={adminStyles.primary}>Create a Draft</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {data.drafts.map((d: any) => (
                <div key={d.id} style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: d.status === 'PUBLISHED' ? '#10b98120' : '#f59e0b20', color: d.status === 'PUBLISHED' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{d.status}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.category} · {d.wordCount} words · {d.readTime} min read</span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{d.title}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Slug: /blog/{d.slug}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {d.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handleAction('publish-draft', { draftId: d.id, publishImmediately: true })}
                          disabled={actionLoading === 'publish-draft'}
                          className={adminStyles.primary}
                        >
                          <Check size={14} /> Approve & Publish
                        </button>
                      )}
                      {d.status === 'PUBLISHED' && (
                        <a
                          href={`/blog/${d.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className={adminStyles.secondary}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <ExternalLink size={13} /> View Live
                        </a>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 14px' }}>{d.excerpt}</p>

                  {/* Quality Badges */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '12px' }}>
                    <div>Overall Quality: <strong>{d.qualityScore ? `${Math.round(d.qualityScore)}/100` : 'Passed'}</strong></div>
                    <div>·</div>
                    <div>Originality: <strong>{d.originalityScore ? `${Math.round(d.originalityScore)}%` : 'Unique'}</strong></div>
                    <div>·</div>
                    <div>Mode: <strong>{d.operatingMode}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MCP SERVER */}
      {activeTab === 'mcp' && (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="var(--accent)" /> Model Context Protocol (MCP) Server
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Connect external AI agents (like Claude Desktop, Antigravity IDE, Cursor, or CLI) directly to your Content Studio services.
            </p>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: '18px', fontFamily: 'monospace', fontSize: '13px' }}>
              <div><strong>Endpoint:</strong> <code>https://dattasable.com/api/mcp</code></div>
              <div style={{ marginTop: '6px' }}><strong>Protocol:</strong> JSON-RPC 2.0 (MCP 2024-11-05)</div>
              <div style={{ marginTop: '6px' }}><strong>Authentication:</strong> <code>Authorization: Bearer &lt;MCP_API_KEY&gt;</code></div>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Exposed MCP Tools</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {[
                { name: 'discover_topics', desc: 'Scan content gaps & demand' },
                { name: 'create_research_brief', desc: 'Generate verified citation brief' },
                { name: 'generate_article_draft', desc: 'Draft full technical markdown' },
                { name: 'detect_duplicate_article', desc: 'Cannibalization detection' },
                { name: 'generate_seo_metadata', desc: 'SEO title, desc, schema & links' },
                { name: 'publish_approved_article', desc: 'Promote draft to live Post' },
                { name: 'schedule_approved_article', desc: 'Enqueue into publishing calendar' },
                { name: 'get_automation_status', desc: 'Status, budget & spend telemetry' },
                { name: 'pause_automation', desc: 'Emergency pause killswitch' },
              ].map(tool => (
                <div key={tool.name} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent)' }}>{tool.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & BUDGET */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '750px', margin: '0 auto', padding: '28px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>Automation Settings & Spending Limits</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Configure default operating modes, monthly budget guardrails, and safety parameters.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleAction('update-settings', {
              operatingMode: settingsMode,
              monthlyBudget: Number(settingsBudget),
            });
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Default Operating Mode</label>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { id: 'MANUAL', label: 'Mode A: Manual Approval', desc: 'Admin starts every workflow and reviews every piece of content.' },
                  { id: 'ASSISTED', label: 'Mode B: Assisted Automation (Recommended)', desc: 'AI automatically researches and drafts articles; admin manually approves publication.' },
                  { id: 'AUTONOMOUS', label: 'Mode C: Autonomous Publishing', desc: 'Articles meeting quality score >= 80 are scheduled and published automatically (Max 2/day).' },
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSettingsMode(m.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: `1px solid ${settingsMode === m.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: settingsMode === m.id ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Monthly AI Hard Budget (USD)</label>
              <input
                type="number"
                min="5"
                max="500"
                step="1"
                value={settingsBudget}
                onChange={(e) => setSettingsBudget(Number(e.target.value))}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '14px' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                If monthly spending reaches this threshold, all automated generations will be paused.
              </div>
            </div>

            <button type="submit" disabled={actionLoading === 'update-settings'} className={adminStyles.primary}>
              Save Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: LOGS */}
      {activeTab === 'logs' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Telemetry & Activity Stream</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {(!data?.usage || data.usage.length === 0) ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs recorded yet.</div>
            ) : (
              data.usage.map((u: any) => (
                <div key={u.id} style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div>
                    <strong>[{u.task}]</strong> via {u.provider} ({u.model})
                    <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>{new Date(u.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <span>{u.totalTokens} tokens</span> · <span>${Number(u.estimatedCostUsd).toFixed(5)}</span> · <span style={{ color: u.success ? '#10b981' : '#ef4444' }}>{u.success ? 'Success' : 'Failed'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
