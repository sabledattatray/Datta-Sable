'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Bot, RefreshCw, Play, CheckCircle2, AlertTriangle, ShieldAlert,
  Clock, DollarSign, Cpu, FileText, ArrowRight, ExternalLink, Sliders, Layers,
  Terminal, Search, BookOpen, AlertCircle, Eye, Check, X, Edit3, Save, Globe, List, Code, ChevronRight
} from 'lucide-react';
import { marked } from 'marked';
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

  // Review & Edit Modal state
  const [reviewDraft, setReviewDraft] = useState<any | null>(null);
  const [reviewTab, setReviewTab] = useState<'preview' | 'editor' | 'seo'>('preview');
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editSeoDescription, setEditSeoDescription] = useState('');
  const [editKeywords, setEditKeywords] = useState('');

  // Google Indexing & GSC States
  const [gscModalData, setGscModalData] = useState<{ title: string; data: any; loading?: boolean; url?: string } | null>(null);

  const handleRequestGoogleIndexing = async (slug: string) => {
    setActionLoading('indexing-' + slug);
    try {
      const res = await fetch('/api/admin/google-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', slug }),
      });
      const result = await res.json();
      setGscModalData({
        title: 'Google Web Search Indexing',
        data: result,
        url: `https://dattasable.com/blog/${slug}`,
      });
    } catch (err: any) {
      setGscModalData({
        title: 'Google Indexing Error',
        data: { error: err?.message || 'Network error' },
        url: `https://dattasable.com/blog/${slug}`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleInspectGoogleUrl = async (slug: string) => {
    setActionLoading('inspect-' + slug);
    setGscModalData({
      title: 'Google Search Console URL Inspection',
      data: null,
      loading: true,
      url: `https://dattasable.com/blog/${slug}`,
    });
    try {
      const res = await fetch('/api/admin/google-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'inspect', slug }),
      });
      const result = await res.json();
      setGscModalData({
        title: 'Google Search Console URL Inspection',
        data: result,
        loading: false,
        url: `https://dattasable.com/blog/${slug}`,
      });
    } catch (err: any) {
      setGscModalData({
        title: 'Inspection Error',
        data: { error: err?.message || 'Failed to inspect' },
        loading: false,
        url: `https://dattasable.com/blog/${slug}`,
      });
    } finally {
      setActionLoading(null);
    }
  };

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

  const openReviewModal = (draft: any, defaultTab: 'preview' | 'editor' | 'seo' = 'preview') => {
    setReviewDraft(draft);
    setReviewTab(defaultTab);
    setEditTitle(draft.title || '');
    setEditSlug(draft.slug || '');
    setEditCategory(draft.category || DEFAULT_AI_CATEGORIES[0]);
    setEditExcerpt(draft.excerpt || '');
    setEditContent(draft.content || '');
    setEditSeoTitle(draft.seoTitle || draft.title || '');
    setEditSeoDescription(draft.seoDescription || draft.excerpt || '');
    setEditKeywords(Array.isArray(draft.targetKeywords) ? draft.targetKeywords.join(', ') : '');
  };

  const handleSaveDraftEdits = async () => {
    if (!reviewDraft) return;
    await handleAction('update-draft', {
      draftId: reviewDraft.id,
      title: editTitle,
      slug: editSlug,
      category: editCategory,
      excerpt: editExcerpt,
      content: editContent,
      seoTitle: editSeoTitle,
      seoDescription: editSeoDescription,
      targetKeywords: editKeywords.split(',').map((s: string) => s.trim()).filter(Boolean),
    });
    setReviewDraft((prev: any) => ({
      ...prev,
      title: editTitle,
      slug: editSlug,
      category: editCategory,
      excerpt: editExcerpt,
      content: editContent,
      seoTitle: editSeoTitle,
      seoDescription: editSeoDescription,
      wordCount: editContent.trim().split(/\s+/).filter(Boolean).length,
    }));
  };

  const handleEnrichDraft = async () => {
    if (!reviewDraft) return;
    await handleAction('enrich-draft', { draftId: reviewDraft.id });
    const res = await fetch(`/api/admin/ai-studio?tab=drafts`);
    if (res.ok) {
      const json = await res.json();
      const updated = json.drafts?.find((d: any) => d.id === reviewDraft.id);
      if (updated) {
        openReviewModal(updated, 'preview');
      }
    }
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

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => openReviewModal(d)}
                          style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text)', fontSize: '11px', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} /> Review & Edit
                        </button>
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
                      <button
                        onClick={() => openReviewModal(d, 'preview')}
                        className={adminStyles.secondary}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={13} /> Review & Edit
                      </button>
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
                        <>
                          <button
                            type="button"
                            onClick={() => handleRequestGoogleIndexing(d.slug)}
                            disabled={actionLoading === 'indexing-' + d.slug}
                            className={adminStyles.secondary}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981' }}
                            title="Submit to Google Web Search Indexing API"
                          >
                            <Sparkles size={13} className={actionLoading === 'indexing-' + d.slug ? 'animate-spin' : ''} />
                            {actionLoading === 'indexing-' + d.slug ? 'Submitting...' : 'Request Indexing'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInspectGoogleUrl(d.slug)}
                            disabled={actionLoading === 'inspect-' + d.slug}
                            className={adminStyles.secondary}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}
                            title="Inspect in Google Search Console"
                          >
                            <Search size={13} className={actionLoading === 'inspect-' + d.slug ? 'animate-spin' : ''} />
                            {actionLoading === 'inspect-' + d.slug ? 'Inspecting...' : 'Inspect in GSC'}
                          </button>
                          <a
                            href={`https://search.google.com/search-console/inspect?resource_id=sc-domain%3Adattasable.com&id=${encodeURIComponent(`https://dattasable.com/blog/${d.slug}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={adminStyles.secondary}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            title="Open URL inspection in Google Search Console web portal"
                          >
                            <Globe size={13} /> GSC Portal
                          </a>
                          <a
                            href={`/blog/${d.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={adminStyles.secondary}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <ExternalLink size={13} /> View Live
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 14px' }}>{d.excerpt}</p>

                  {/* Quality Badges */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Overall Quality: 
                      <strong style={{
                        color: (d.qualityScore || 0) >= 80 ? '#10b981' : (d.qualityScore || 0) >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        {d.qualityScore ? `${Math.round(d.qualityScore)}/100` : 'Evaluating'}
                      </strong>
                    </div>
                    <div>·</div>
                    <div>Originality: <strong>{d.originalityScore ? `${Math.round(d.originalityScore)}%` : 'Unique'}</strong></div>
                    <div>·</div>
                    <div>Mode: <strong>{d.operatingMode}</strong></div>
                    <button
                      onClick={() => openReviewModal(d, 'seo')}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Why score is {Math.round(d.qualityScore || 0)}/100? Inspect Breakdown & SEO →
                    </button>
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

      {/* REVIEW, EDIT & SEO MODAL */}
      {reviewDraft && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--surface, #141414)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '1100px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg)',
            }}>
              <div style={{ minWidth: 0, flex: 1, paddingRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: reviewDraft.status === 'PUBLISHED' ? '#10b98120' : '#f59e0b20',
                    color: reviewDraft.status === 'PUBLISHED' ? '#10b981' : '#f59e0b',
                    fontWeight: 700
                  }}>
                    {reviewDraft.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {editCategory} · {editContent.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(3, Math.ceil(editContent.trim().split(/\s+/).filter(Boolean).length / 200))} min read
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {editTitle || 'Untitled Draft'}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Quality:</span>
                  <strong style={{
                    color: (reviewDraft.qualityScore || 0) >= 80 ? '#10b981' : (reviewDraft.qualityScore || 0) >= 60 ? '#f59e0b' : '#ef4444'
                  }}>
                    {reviewDraft.qualityScore ? `${Math.round(reviewDraft.qualityScore)}/100` : 'Evaluating'}
                  </strong>
                </div>

                <button
                  onClick={() => setReviewDraft(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Sub-Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              padding: '12px 24px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              {[
                { id: 'preview', label: 'Visual Article Preview & TOC', icon: Eye },
                { id: 'editor', label: 'Content & Outline Editor', icon: Edit3 },
                { id: 'seo', label: 'SEO & Quality Gate Inspector', icon: Globe },
              ].map(t => {
                const Icon = t.icon;
                const isTabActive = reviewTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setReviewTab(t.id as any)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: isTabActive ? 'var(--accent)' : 'transparent',
                      color: isTabActive ? '#000' : 'var(--text-muted)',
                      border: isTabActive ? '1px solid var(--accent)' : '1px solid transparent',
                    }}
                  >
                    <Icon size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* SUBTAB 1: VISUAL PREVIEW & TOC */}
              {reviewTab === 'preview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
                  {/* Left: Auto-generated Table of Contents */}
                  <div style={{
                    padding: '18px',
                    borderRadius: '12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    height: 'fit-content',
                    position: 'sticky',
                    top: 0,
                  }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <List size={14} color="var(--accent)" /> Table of Contents
                    </div>
                    {(() => {
                      const lines = (editContent || '').split('\n');
                      const headings: { level: number; text: string }[] = [];
                      for (const l of lines) {
                        const m = l.match(/^(#{2,3})\s+(.+)$/);
                        if (m) headings.push({ level: m[1].length, text: m[2].trim() });
                      }
                      if (headings.length === 0) {
                        return <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No H2/H3 headings found in markdown.</div>;
                      }
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {headings.map((h, i) => (
                            <div key={i} style={{
                              fontSize: '12px',
                              paddingLeft: h.level === 3 ? '12px' : '0px',
                              color: h.level === 2 ? 'var(--text)' : 'var(--text-muted)',
                              borderLeft: h.level === 2 ? '2px solid var(--accent)' : '2px solid transparent',
                              lineHeight: 1.4,
                            }}>
                              {h.text}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right: Rendered HTML Post */}
                  <div style={{
                    padding: '28px',
                    borderRadius: '14px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{editCategory}</span>
                      <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px', marginBottom: '12px', lineHeight: 1.25 }}>{editTitle}</h1>
                      <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>{editExcerpt}</p>
                    </div>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          try {
                            return marked.parse(editContent || '') as string;
                          } catch (e) {
                            return editContent;
                          }
                        })(),
                      }}
                      style={{
                        lineHeight: 1.7,
                        fontSize: '14px',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 2: CONTENT EDITOR */}
              {reviewTab === 'editor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Edit title, slug, excerpt, and full markdown body directly.
                    </div>

                    <button
                      type="button"
                      onClick={handleEnrichDraft}
                      disabled={actionLoading === 'enrich-draft'}
                      className={adminStyles.primary}
                      style={{ fontSize: '12px', padding: '8px 14px' }}
                    >
                      <Sparkles size={13} className={actionLoading === 'enrich-draft' ? 'animate-spin' : ''} />
                      {actionLoading === 'enrich-draft' ? 'AI Deepening in progress...' : '✨ AI Deepen / Expand to 2,500 words'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Article Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                      >
                        {DEFAULT_AI_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                      Slug URL (/blog/...)
                    </label>
                    <input
                      type="text"
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Excerpt Summary</label>
                      <span style={{ fontSize: '11px', color: editExcerpt.length > 160 ? '#ef4444' : 'var(--text-muted)' }}>
                        {editExcerpt.length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Full Markdown Content</label>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {editContent.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={16}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px', fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 3: SEO & QUALITY GATE INSPECTOR */}
              {reviewTab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Google SERP Preview Card */}
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '14px' }}>
                      Google Search Result Snippet Preview
                    </div>
                    <div style={{ padding: '16px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a' }}>
                      <div style={{ fontSize: '12px', color: '#8ab4f8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>https://dattasable.com</span>
                        <span>›</span>
                        <span>blog</span>
                        <span>›</span>
                        <span style={{ color: '#aaa' }}>{editSlug}</span>
                      </div>
                      <div style={{ fontSize: '18px', color: '#8ab4f8', fontWeight: 500, margin: '4px 0 6px', cursor: 'pointer' }}>
                        {editSeoTitle || editTitle} | Datta Sable
                      </div>
                      <div style={{ fontSize: '13px', color: '#bdc1c6', lineHeight: 1.5 }}>
                        {editSeoDescription || editExcerpt}
                      </div>
                    </div>
                  </div>

                  {/* SEO Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>SEO Meta Title</label>
                        <span style={{ fontSize: '11px', color: editSeoTitle.length > 60 ? '#f59e0b' : 'var(--text-muted)' }}>
                          {editSeoTitle.length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editSeoTitle}
                        onChange={(e) => setEditSeoTitle(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Target Focus Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        placeholder="e.g. Microsoft Fabric, Data Factory, ETL"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>SEO Meta Description</label>
                      <span style={{ fontSize: '11px', color: editSeoDescription.length > 160 ? '#f59e0b' : 'var(--text-muted)' }}>
                        {editSeoDescription.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editSeoDescription}
                      onChange={(e) => setEditSeoDescription(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px' }}
                    />
                  </div>

                  {/* Quality Gate Breakdown */}
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                        Quality Gate Breakdown & Diagnostics
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: (reviewDraft.qualityScore || 0) >= 80 ? '#10b981' : (reviewDraft.qualityScore || 0) >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        Score: {reviewDraft.qualityScore ? `${Math.round(reviewDraft.qualityScore)}/100` : 'Evaluating'}
                      </div>
                    </div>

                    {/* Quality Gate Checks */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Technical Length</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: editContent.trim().split(/\s+/).filter(Boolean).length >= 600 ? '#10b981' : '#f59e0b' }}>
                          {editContent.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {editContent.trim().split(/\s+/).filter(Boolean).length < 600 ? '⚠️ Under 600w threshold (-30 pts)' : '✓ Depth passed'}
                        </div>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heading Hierarchy</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: (editContent.match(/^##\s+.+$/gm) || []).length >= 3 ? '#10b981' : '#f59e0b' }}>
                          {(editContent.match(/^##\s+.+$/gm) || []).length} H2 sections
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {(editContent.match(/^##\s+.+$/gm) || []).length >= 3 ? '✓ 3+ H2s present' : '⚠️ Need at least 3 H2s'}
                        </div>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Practical Assets</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: editContent.includes('```') ? '#10b981' : '#f59e0b' }}>
                          {editContent.includes('```') ? 'Code snippets present' : 'Missing code snippets'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {editContent.includes('```') ? '✓ Practical DAX/SQL code' : '⚠️ Add code for +10 pts'}
                        </div>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Originality & Duplicate Risk</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: '#10b981' }}>
                          {reviewDraft.originalityScore ? `${Math.round(reviewDraft.originalityScore)}%` : '100%'} Unique
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ✓ 0% duplicate risk
                        </div>
                      </div>
                    </div>

                    {/* Blockers & Recommendations */}
                    {reviewDraft.qualityReports?.[0]?.blockers?.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', marginBottom: '6px' }}>Quality Blockers:</div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#ef4444' }}>
                          {reviewDraft.qualityReports[0].blockers.map((b: string, i: number) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reviewDraft.qualityReports?.[0]?.recommendations?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '6px' }}>Recommendations to boost score:</div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {reviewDraft.qualityReports[0].recommendations.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg)',
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSaveDraftEdits}
                  disabled={actionLoading === 'update-draft'}
                  className={adminStyles.secondary}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} />
                  {actionLoading === 'update-draft' ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={handleEnrichDraft}
                  disabled={actionLoading === 'enrich-draft'}
                  className={adminStyles.secondary}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}
                >
                  <Sparkles size={14} className={actionLoading === 'enrich-draft' ? 'animate-spin' : ''} />
                  {actionLoading === 'enrich-draft' ? 'Deepening...' : 'AI Expand to 2.5k Words'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReviewDraft(null)}
                  className={adminStyles.secondary}
                >
                  Close
                </button>

                {reviewDraft.status !== 'PUBLISHED' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleSaveDraftEdits();
                      await handleAction('publish-draft', { draftId: reviewDraft.id, publishImmediately: true });
                      setReviewDraft(null);
                    }}
                    disabled={actionLoading === 'publish-draft'}
                    className={adminStyles.primary}
                  >
                    <Check size={14} /> Approve & Publish Live
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Google Indexing / GSC Modal */}
      {gscModalData && (
        <div className={adminStyles.modalOverlay} onClick={() => setGscModalData(null)}>
          <div className={adminStyles.modalContent} style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={18} style={{ color: 'var(--accent)' }} />
                {gscModalData.title}
              </h3>
              <button
                type="button"
                onClick={() => setGscModalData(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            {gscModalData.url && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, wordBreak: 'break-all' }}>
                URL: <strong style={{ color: 'var(--text)' }}>{gscModalData.url}</strong>
              </div>
            )}

            {gscModalData.loading ? (
              <div style={{ padding: '36px 0', textAlign: 'center' }}>
                <Sparkles size={24} className="animate-spin" style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Querying Google Search Console API...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {gscModalData.data?.success !== undefined && (
                  <div style={{
                    padding: 14,
                    borderRadius: 10,
                    background: gscModalData.data.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${gscModalData.data.success ? '#10b981' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    {gscModalData.data.success ? (
                      <>
                        <CheckCircle2 size={20} color="#10b981" />
                        <div>
                          <strong style={{ color: '#10b981', display: 'block' }}>Submission Successful</strong>
                          <span style={{ fontSize: 12, color: 'var(--text)' }}>
                            Queued for Googlebot crawling. Notification timestamp: {gscModalData.data.notifiedAt || new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} color="#ef4444" />
                        <div>
                          <strong style={{ color: '#ef4444', display: 'block' }}>Submission Issue</strong>
                          <span style={{ fontSize: 12, color: 'var(--text)' }}>
                            {gscModalData.data.error || 'Failed to submit URL'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Inspection Details */}
                {gscModalData.data?.inspectionResult && (() => {
                  const idx = gscModalData.data.inspectionResult.indexStatusResult || {};
                  const isIndexed = idx.verdict === 'PASS' && idx.coverageState === 'Submitted and indexed';
                  return (
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{
                        padding: 12,
                        borderRadius: 8,
                        background: isIndexed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${isIndexed ? '#10b981' : '#f59e0b'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                      }}>
                        {isIndexed ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f59e0b" />}
                        <div>
                          <strong style={{ color: isIndexed ? '#10b981' : '#f59e0b' }}>
                            Verdict: {idx.verdict || 'PENDING'} · {idx.coverageState || 'Processing'}
                          </strong>
                          {!isIndexed && (
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
                              URL was recently submitted to Googlebot. Google Search Console typically updates its index database within a few hours of publication.
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                        <div style={{ padding: 10, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>Robots.txt</span>
                          <strong>{idx.robotsTxtState || 'ALLOWED'}</strong>
                        </div>
                        <div style={{ padding: 10, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>Page Fetch</span>
                          <strong>{idx.pageFetchState || 'SUCCESSFUL'}</strong>
                        </div>
                        <div style={{ padding: 10, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>Crawled As</span>
                          <strong>{idx.crawledAs || 'MOBILE'}</strong>
                        </div>
                        <div style={{ padding: 10, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>Last Crawled</span>
                          <strong>{idx.lastCrawlTime ? new Date(idx.lastCrawlTime).toLocaleString() : 'Pending Googlebot visit'}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {gscModalData.data?.error && !gscModalData.data?.success && (
                  <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: 12 }}>
                    {typeof gscModalData.data.error === 'string' ? gscModalData.data.error : JSON.stringify(gscModalData.data.error)}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {gscModalData.url && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const slug = gscModalData.url!.split('/blog/')[1];
                      if (slug) handleRequestGoogleIndexing(slug);
                    }}
                    className={adminStyles.primary}
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Sparkles size={13} /> Request Indexing
                  </button>
                  <a
                    href={`https://search.google.com/search-console/inspect?resource_id=sc-domain%3Adattasable.com&id=${encodeURIComponent(gscModalData.url)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={adminStyles.secondary}
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <ExternalLink size={13} /> Open in GSC Portal
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => setGscModalData(null)}
                className={adminStyles.secondary}
                style={{ minWidth: 80 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
