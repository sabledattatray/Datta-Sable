'use client';
import adminStyles from '@/components/admin/AdminCommon.module.css';
import { useState, useEffect, useRef, Suspense } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronRight, Layers, X, Globe, FileText, Columns, Sparkles, XCircle, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FullEditor from '@/components/editor/FullEditor';
import ThemeToggle from '@/components/ThemeToggle';
import { analyzeSeoContent, countSeoWords } from '@/lib/admin/seo-analysis';

const calculateSeoScore = (title: string, slug: string, content: string, excerpt: string, keyword: string, otherPages: any[] = []) =>
  analyzeSeoContent({
    title,
    slug,
    content,
    excerpt,
    keyword,
    otherKeywords: otherPages.map((page) => page.focusedKeyword || ''),
  });

function EditorContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const css = isDark
    ? { bg: '#000000', surface: '#000000', surface2: '#121212', border: '#1a1a1a', text: '#f1f5f9', muted: '#64748b', accent: '#6366f1', inputBg: '#121212', shadow: '0 4px 24px rgba(0,0,0,0.35)', hoverBg: 'rgba(255,255,255,0.03)' }
    : { bg: '#f0f4ff', surface: '#ffffff', surface2: '#f8faff', border: '#e2e8f0', text: '#0f172a', muted: '#64748b', accent: '#4f46e5', inputBg: '#f8faff', shadow: '0 4px 24px rgba(0,0,0,0.07)', hoverBg: 'rgba(0,0,0,0.015)' };

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [focusedKeyword, setFocusedKeyword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editorMode, setEditorMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'seo'>('settings');
  const [seoTab, setSeoTab] = useState<'basic' | 'additional' | 'title' | 'content'>('basic');
  const [activeKeywordIndex, setActiveKeywordIndex] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [pagesList, setPagesList] = useState<any[]>([]);
  const [slugError, setSlugError] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const wordCount = countSeoWords(content, excerpt);

  // Auto-generate slug from title if not manual
  useEffect(() => {
    if (!editId && title && !isSlugManual) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }, [title, editId, isSlugManual]);

  // Load other pages for uniqueness validations
  useEffect(() => {
    const fetchPagesList = async () => {
      try {
        const res = await fetch('/api/admin/pages');
        if (res.ok) {
          const data = await res.json();
          setPagesList(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPagesList();
  }, []);

  // Validate slug uniqueness client-side
  useEffect(() => {
    if (!slug) {
      setSlugError('');
      return;
    }
    const conflict = pagesList.some(p => p.slug === slug && p.id !== editId);
    if (conflict) {
      setSlugError('This URL slug is already in use by another page.');
    } else {
      setSlugError('');
    }
  }, [slug, pagesList, editId]);

  // Fetch page details if editing
  useEffect(() => {
    if (editId) {
      const fetchPage = async () => {
        try {
          setFetching(true);
          const res = await fetch(`/api/admin/pages/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title);
            setSlug(data.slug);
            setExcerpt(data.excerpt || '');
            setContent(data.content || '');
            setPublished(data.published);
            setFocusedKeyword(data.focusedKeyword || '');
            if (data.focusedKeyword) {
              setSidebarTab('seo');
            }
          } else {
            setMessage({ type: 'error', text: 'Failed to retrieve page data.' });
          }
        } catch (err) {
          console.error(err);
          setMessage({ type: 'error', text: 'Error loading page configuration.' });
        } finally {
          setFetching(false);
        }
      };
      fetchPage();
    }
  }, [editId]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title || !slug || !content) {
      setMessage({ type: 'error', text: 'Title, URL slug, and content are required.' });
      return;
    }
    if (slugError) {
      setMessage({ type: 'error', text: 'Please resolve the URL slug issue before saving.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const endpoint = editId ? `/api/admin/pages/${editId}` : '/api/admin/pages';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          published,
          focusedKeyword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: editId ? 'Page updated successfully!' : 'Page published successfully!' });
        setTimeout(() => {
          router.push('/admin/pages');
        }, 1200);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save custom page.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewContent = () => {
    return (
      <div style={{ width: '100%', maxWidth: 760, paddingBottom: 80 }}>
        {excerpt && (
          <p style={{ fontSize: 16, color: css.muted, marginBottom: 32, fontStyle: 'italic', borderLeft: `3px solid ${css.accent}`, paddingLeft: 14 }}>
            {excerpt}
          </p>
        )}
        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          style={{ fontSize: 15, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: content || '<p style="color:var(--muted)">Write some content to preview it.</p>' }}
        />
      </div>
    );
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    display: 'block', marginBottom: 7,
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '128px 0', color: css.muted, fontSize: 14, fontWeight: 600 }}>
        Retrieving page configurations...
      </div>
    );
  }

  return (
    <div className={adminStyles.editorpage} style={{ display: 'flex', flexDirection: 'column', background: css.bg }}>
      {/* Editor Top Navigation Row */}
      <header
        style={{
          height: 56,
          background: css.surface,
          borderBottom: `1px solid ${css.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.03)' : '0 1px 0 rgba(0,0,0,0.04)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link 
            href="/admin/pages" 
            style={{ 
              background: 'none', border: `1px solid ${css.border}`,
              borderRadius: 9, padding: '7px 12px',
              cursor: 'pointer', color: css.muted,
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--text-small)', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = css.text; (e.currentTarget as HTMLElement).style.background = css.surface2; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.background = 'none'; }}
          >
            <ChevronLeft size={16} /> Back
          </Link>
          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, padding: '3px 10px', background: css.surface2, borderRadius: 8 }}>
            {editId ? 'Editing Page' : 'New Page'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 10, padding: 2, gap: 2
          }}>
            {[
              { id: 'edit', label: 'Edit', icon: <FileText size={13} /> },
              { id: 'split', label: 'Split', icon: <Columns size={13} />, desktopOnly: true },
              { id: 'preview', label: 'Preview', icon: <Eye size={13} /> }
            ].map(tab => {
              const active = editorMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorMode(tab.id as any)}
                  className={tab.desktopOnly ? 'desktop-only-btn' : ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 'var(--text-small)',
                    fontWeight: active ? 700 : 500, background: active ? css.surface : 'transparent', border: 'none',
                    color: active ? css.accent : css.muted, cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>

          <ThemeToggle />

          <button 
            onClick={() => handleSave()}
            disabled={loading}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px', 
              background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 10, 
              fontSize: 14, fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', 
              boxShadow: `0 4px 14px ${css.accent}30`, transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 
            }}
          >
            <Save size={15} /> {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <div className={adminStyles.editorBody} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {editorMode === 'preview' && (
          <div style={{ flex: 1, overflowY: 'auto', background: css.bg, display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
            {renderPreviewContent()}
          </div>
        )}

        {editorMode === 'split' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
            <div style={{ borderRight: `1px solid ${css.border}`, overflowY: 'auto', padding: '40px', background: css.surface }}>
              <textarea
                placeholder="Page title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%', fontSize: '1.8rem', fontWeight: 800, background: 'none', border: 'none',
                  color: css.text, outline: 'none', resize: 'none', fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.3, marginBottom: '1.5rem',
                }}
              />
              <FullEditor content={content} onChange={setContent} isDark={isDark} />
            </div>
            <div style={{ overflowY: 'auto', padding: '60px 40px', background: css.bg, display: 'flex', justifyContent: 'center' }}>
              {renderPreviewContent()}
            </div>
          </div>
        )}

        {editorMode === 'edit' && (
          <>
            {/* Main Writing Workspace */}
            <div style={{ flex: 1, overflowY: 'auto', background: css.bg, display: 'flex', justifyContent: 'center', padding: '60px 40px' }}>
              <div style={{ width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column' }}>
                {message && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: 24,
                    background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                  }}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span style={{ fontSize: 'var(--text-small)', fontWeight: 600 }}>{message.text}</span>
                    <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2 }}><X size={14} /></button>
                  </div>
                )}

                <textarea
                  placeholder="Page title..."
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  ref={el => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                  style={{
                    width: '100%', fontSize: '2.2rem', fontWeight: 800, background: 'none', border: 'none',
                    color: css.text, outline: 'none', resize: 'none', fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '1.5rem',
                    minHeight: '2.8rem', overflow: 'hidden'
                  }}
                />

                <FullEditor content={content} onChange={setContent} isDark={isDark} />
              </div>
            </div>

            {/* Sidebar Controls */}
            <aside style={{ width: 310, background: css.surface, borderLeft: `1px solid ${css.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
              <div style={{ display: 'flex', borderBottom: `1px solid ${css.border}`, flexShrink: 0 }}>
                <button
                  onClick={() => setSidebarTab('settings')}
                  style={{
                    flex: 1, padding: '14px 10px', fontSize: 'var(--text-small)', fontWeight: 700,
                    background: sidebarTab === 'settings' ? css.surface2 : 'transparent',
                    color: sidebarTab === 'settings' ? css.accent : css.muted,
                    border: 'none', borderBottom: sidebarTab === 'settings' ? `2px solid ${css.accent}` : 'none',
                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s'
                  }}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => setSidebarTab('seo')}
                  style={{
                    flex: 1, padding: '14px 10px', fontSize: 'var(--text-small)', fontWeight: 700,
                    background: sidebarTab === 'seo' ? css.surface2 : 'transparent',
                    color: sidebarTab === 'seo' ? css.accent : css.muted,
                    border: 'none', borderBottom: sidebarTab === 'seo' ? `2px solid ${css.accent}` : 'none',
                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s'
                  }}
                >
                  📈 SEO Score
                </button>
              </div>

              {sidebarTab === 'settings' ? (
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 18px' }}>
                    Page Settings
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Status */}
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select 
                        value={published ? 'true' : 'false'} 
                        onChange={e => setPublished(e.target.value === 'true')}
                        style={{
                          width: '100%', background: css.inputBg, border: `1px solid ${css.border}`, color: css.text,
                          padding: '10px 12px', borderRadius: 10, outline: 'none', cursor: 'pointer', fontSize: 'var(--text-small)', fontWeight: 600,
                        }}
                      >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </select>
                    </div>

                    {/* URL Slug */}
                    <div>
                      <label style={labelStyle}>URL Slug</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="url-path-here" 
                        value={slug} 
                        onChange={e => {
                          setIsSlugManual(true);
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'));
                        }}
                        style={{
                          width: '100%', background: css.inputBg, border: `1px solid ${slugError ? '#ef4444' : css.border}`, color: css.text,
                          padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 'var(--text-small)', fontFamily: 'monospace'
                        }}
                      />
                      {slugError && (
                        <p style={{ fontSize: 'var(--text-small)', color: '#ef4444', fontWeight: 600, margin: '6px 0 0' }}>
                          ⚠️ {slugError}
                        </p>
                      )}
                      {isSlugManual && (
                        <button
                          onClick={() => {
                            setIsSlugManual(false);
                            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                          }}
                          style={{
                            background: 'none', border: 'none', color: css.accent, fontSize: 'var(--text-small)', fontWeight: 700,
                            cursor: 'pointer', padding: 0, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}
                        >
                          Auto-generate from title 🔄
                        </button>
                      )}
                      <span style={{ fontSize: 'var(--text-small)', color: css.muted, marginTop: 6, display: 'block', fontWeight: 600 }}>
                        Route: <code>{['about', 'services', 'careers', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer', 'editorial-policy', 'faq', 'portfolio', 'infrastructure', 'start-here'].includes(slug) ? '' : '/p'}/{slug || '...'}</code>
                      </span>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label style={labelStyle}>Excerpt / Meta Description</label>
                      <textarea 
                        placeholder="Brief meta description or lead summary..." 
                        value={excerpt} 
                        onChange={e => setExcerpt(e.target.value)}
                        rows={5}
                        style={{
                          width: '100%', background: css.inputBg, border: `1px solid ${css.border}`, color: css.text,
                          padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 'var(--text-small)', resize: 'none',
                          lineHeight: 1.5, fontFamily: "'Inter', sans-serif"
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      SEO Analyzer
                    </p>
                    <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Globe size={11} /> PRO Enabled
                    </span>
                  </div>

                  <div style={{ padding: '10px 12px', borderRadius: 10, background: css.surface2, color: css.muted, fontSize: 'var(--text-small)', lineHeight: 1.5 }}>
                    Real page word count: <strong style={{ color: css.text }}>{wordCount.toLocaleString()}</strong>. Page text and its search description count; HTML tags, scripts, and styles do not.
                  </div>

                  {/* Focus Keyword Input */}
                  <div>
                    <label style={labelStyle}>Focus Keyword(s)</label>
                    <input
                      type="text"
                      placeholder="Enter keywords (comma separated)..."
                      value={focusedKeyword}
                      onChange={e => setFocusedKeyword(e.target.value)}
                      style={{
                        width: '100%', background: css.inputBg, border: `1px solid ${css.border}`, color: css.text,
                        padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 'var(--text-small)', fontWeight: 600,
                      }}
                    />
                    <span style={{ fontSize: 'var(--text-small)', color: css.muted, marginTop: 4, display: 'block', fontWeight: 500 }}>
                      First keyword acts as the primary focus keyword.
                    </span>
                  </div>

                  {(() => {
                    const keywords = focusedKeyword
                      ? focusedKeyword.split(',').map((k: string) => k.trim()).filter(Boolean)
                      : [];

                    if (keywords.length === 0) {
                      return (
                        <div style={{
                          padding: '30px 20px', textAlign: 'center', border: `1px dashed ${css.border}`,
                          borderRadius: 16, color: css.muted, fontSize: 'var(--text-small)', lineHeight: 1.6
                        }}>
                          Enter a focus keyword to see your SEO score and analyze content in real-time.
                        </div>
                      );
                    }

                    const otherPages = pagesList.filter((p: any) => p.id !== editId);
                    const keywordAnalyses = keywords.map((kw: string) => {
                      return {
                        keyword: kw,
                        analysis: calculateSeoScore(title, slug, content, excerpt, kw, otherPages)
                      };
                    });

                    const activeIdx = activeKeywordIndex >= keywords.length ? 0 : activeKeywordIndex;
                    const activeAnalysis = keywordAnalyses[activeIdx];
                    if (!activeAnalysis) return null;

                    const radius = 26;
                    const circumference = 2 * Math.PI * radius;
                    const score = activeAnalysis.analysis.score ?? 0;
                    const strokeDashoffset = circumference - (score / 100) * circumference;
                    const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

                    return (
                      <>
                        {/* Keyword tags switcher */}
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--text-small)', color: css.muted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Selected Keywords & Scores
                          </label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {keywordAnalyses.map((item, idx) => {
                              const isActive = idx === activeIdx;
                              const itemScore = item.analysis.score ?? 0;
                              const tagScoreColor = itemScore >= 80 ? '#10b981' : itemScore >= 50 ? '#f59e0b' : '#ef4444';
                              const tagBg = isActive ? `${tagScoreColor}20` : css.surface2;
                              const tagBorder = `1px solid ${isActive ? tagScoreColor : css.border}`;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setActiveKeywordIndex(idx)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                                    borderRadius: 8, background: tagBg, border: tagBorder,
                                    color: isActive ? tagScoreColor : css.muted, cursor: 'pointer',
                                    fontSize: 'var(--text-small)', fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
                                  }}
                                >
                                  <span>{item.keyword}</span>
                                  <span style={{ fontSize: 'var(--text-small)', opacity: 0.85, fontWeight: 800 }}>({itemScore})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Circular Score Indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '14px 18px' }}>
                          <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
                            <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="30" cy="30" r={radius} stroke={isDark ? '#1a1a1a' : '#e2e8f0'} strokeWidth="5" fill="transparent" />
                              <circle cx="30" cy="30" r={radius} stroke={scoreColor} strokeWidth="5" fill="transparent"
                                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.35s' }}
                              />
                            </svg>
                            <div style={{
                              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: 'var(--text-small)', fontWeight: 900, color: css.text
                            }}>
                              {score}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: scoreColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {score >= 80 ? 'Good SEO' : score >= 50 ? 'Needs Improvement' : 'Poor SEO'}
                            </span>
                            <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '2px 0 0', lineHeight: 1.35 }}>
                              Your page passed {activeAnalysis.analysis.categories.basic.concat(activeAnalysis.analysis.categories.additional, activeAnalysis.analysis.categories.title, activeAnalysis.analysis.categories.content).filter((check: any) => check.passed).length} of {activeAnalysis.analysis.categories.basic.concat(activeAnalysis.analysis.categories.additional, activeAnalysis.analysis.categories.title, activeAnalysis.analysis.categories.content).length} measurable SEO checks.
                            </p>
                          </div>
                        </div>

                        {/* Checklist Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {/* Tabs */}
                          <div style={{ display: 'flex', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 10, padding: 2, gap: 2 }}>
                            {[
                              { id: 'basic', label: 'Basic' },
                              { id: 'additional', label: 'Additional' },
                              { id: 'title', label: 'Title' },
                              { id: 'content', label: 'Content' }
                            ].map(t => {
                              const active = seoTab === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setSeoTab(t.id as any)}
                                  style={{
                                    flex: 1, padding: '6px 2px', borderRadius: 8, fontSize: 'var(--text-small)',
                                    fontWeight: active ? 700 : 500, background: active ? css.surface : 'transparent',
                                    border: 'none', color: active ? css.accent : css.muted, cursor: 'pointer',
                                    textAlign: 'center', transition: 'all 0.15s'
                                  }}
                                >
                                  {t.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Checks Checklist */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                            {((activeAnalysis.analysis.categories as any)[seoTab] || []).map((check: any) => (
                              <div key={check.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 'var(--text-small)', fontWeight: 500, color: check.passed ? css.text : css.muted }}>
                                <span style={{ marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {check.passed ? (
                                    <CheckCircle2 size={14.5} style={{ color: '#10b981' }} />
                                  ) : (
                                    <XCircle size={14.5} style={{ color: '#ef4444' }} />
                                  )}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <span style={{ lineHeight: 1.25 }}>{check.label}</span>
                                  <span style={{ fontSize: 'var(--text-small)', color: css.muted, fontWeight: 600 }}>
                                    {check.passed ? `Passed (+${check.pts} pts)` : `Missing (-${check.pts} pts)`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </aside>
          </>
        )}
      </div>

      <style>{`
        .desktop-only-btn {
          display: flex !important;
        }
        @media (max-width: 900px) {
          .desktop-only-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PageEditor() {
  return (
    <Suspense fallback={<div style={{ padding: '64px', textAlign: 'center', fontWeight: 600 }}>Loading Page Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
