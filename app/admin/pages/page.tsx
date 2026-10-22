'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Layers, AlertCircle, CheckCircle2, Globe, EyeOff, FileText, CheckCheck, BookOpen } from 'lucide-react';
import Link from 'next/link';
import adminStyles from '@/components/admin/AdminCommon.module.css';

function calculateWordCount(content: string): number {
  if (!content) return 0;
  let textContent = '';
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  } else {
    textContent = content.replace(/<[^>]*>/g, ' ');
  }
  return textContent.trim().split(/\s+/).filter(Boolean).length;
}

function getFallbackKeyword(title: string, slug: string): string {
  const cleanTitle = title.toLowerCase();
  const cleanSlug = slug.toLowerCase();

  if (cleanTitle.includes('dp-600')) return 'DP-600';
  if (cleanTitle.includes('dp-700')) return 'DP-700';
  if (cleanTitle.includes('dp-800')) return 'DP-800';
  if (cleanTitle.includes('microsoft fabric') || cleanSlug.includes('fabric')) return 'Microsoft Fabric';
  if (cleanTitle.includes('power bi') || cleanSlug.includes('power-bi')) return 'Power BI';
  if (cleanTitle.includes('columnstore')) return 'Columnstore Indexes';
  if (cleanTitle.includes('sql server') || cleanSlug.includes('sql-server')) return 'SQL Server';
  if (cleanTitle.includes('sql') || cleanSlug.includes('sql')) return 'SQL';
  if (cleanTitle.includes('n8n') || cleanSlug.includes('n8n')) return 'n8n';
  if (cleanTitle.includes('next.js') || cleanSlug.includes('nextjs')) return 'Next.js';
  if (cleanTitle.includes('ai agent') || cleanTitle.includes('ai-agent') || cleanSlug.includes('ai-agent')) return 'AI Agents';
  if (cleanTitle.includes('generative ai') || cleanTitle.includes('gen ai')) return 'Generative AI';
  if (cleanTitle.includes('compound ai')) return 'Compound AI Systems';
  if (cleanTitle.includes('ai') || cleanSlug.includes('ai')) return 'AI';
  if (cleanTitle.includes('python') || cleanSlug.includes('python')) return 'Python';
  if (cleanTitle.includes('prompt architecture')) return 'Prompt Architecture';
  if (cleanTitle.includes('context compression')) return 'Context Compression';
  if (cleanTitle.includes('intent mapping')) return 'Intent Mapping';
  if (cleanTitle.includes('data mesh') || cleanSlug.includes('data-mesh')) return 'Data Mesh';
  if (cleanTitle.includes('data privacy')) return 'Data Privacy';
  if (cleanTitle.includes('dashboard') || cleanSlug.includes('dashboard')) return 'Dashboard';
  if (cleanTitle.includes('tableau') || cleanSlug.includes('tableau')) return 'Tableau';
  if (cleanTitle.includes('saas') || cleanSlug.includes('saas')) return 'SaaS';
  if (cleanTitle.includes('wordpress') || cleanSlug.includes('wordpress')) return 'WordPress';
  if (cleanTitle.includes('keyboard') || cleanSlug.includes('keyboard')) return 'Keyboard';

  const words = title.split(/\s+/).filter(w => {
    const lw = w.toLowerCase();
    return lw.length > 2 && !['the', 'and', 'for', 'with', 'your', 'how', 'why', 'what', 'here', 'from'].includes(lw);
  });
  if (words.length >= 2) {
    return words.slice(0, 2).join(' ');
  }
  return title;
}

function calculateSeoScore(title: string, slug: string, content: string, excerpt: string, keyword: string, isFallback: boolean = true) {
  if (!keyword) return { score: 0 };

  let earnedPoints = 0;
  let maxPoints = 0;
  
  const kw = keyword.toLowerCase().trim();
  const cleanTitle = title.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  
  let textContent = '';
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  } else {
    textContent = content.replace(/<[^>]*>/g, '');
  }
  const cleanContent = textContent.toLowerCase();
  const cleanExcerpt = excerpt.toLowerCase();
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  
  const addCheck = (category: 'basic' | 'additional' | 'title' | 'content', id: string, label: string, passed: boolean, pts: number) => {
    maxPoints += pts;
    if (passed) earnedPoints += pts;
  };

  const kwInTitle = cleanTitle.includes(kw);
  addCheck('basic', 'title_kw', 'Focus keyword in SEO title', kwInTitle, 15);

  const formattedKwSlug = kw.replace(/\s+/g, '-');
  const kwInSlug = isFallback ? true : cleanSlug.includes(formattedKwSlug);
  addCheck('basic', 'slug_kw', 'Focus keyword in URL slug', kwInSlug, 10);

  const kwInExcerpt = isFallback ? true : cleanExcerpt.includes(kw);
  addCheck('basic', 'excerpt_kw', 'Focus keyword in meta description', kwInExcerpt, 10);

  const kwCount = (cleanContent.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const kwDensity = wordCount > 0 ? (kwCount / wordCount) * 100 : 0;
  addCheck('basic', 'kw_density', 'Focus Keyword Density', kwDensity >= 0.8 && kwDensity <= 2.5, 10);

  addCheck('content', 'word_count', 'Content Word Count', wordCount >= 600, 15);

  return {
    score: maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0,
  };
}

export default function PagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'wordCount' | 'seoScore' | 'published' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSort = (field: 'title' | 'wordCount' | 'seoScore' | 'published' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const togglePublish = async (pageId: string, currentPublished: boolean) => {
    try {
      const pageToUpdate = pages.find(p => p.id === pageId);
      if (!pageToUpdate) return;

      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageToUpdate.title,
          slug: pageToUpdate.slug,
          excerpt: pageToUpdate.excerpt || '',
          content: pageToUpdate.content,
          published: !currentPublished
        })
      });

      if (res.ok) {
        setPages(ps => ps.map(p => p.id === pageId ? { ...p, published: !currentPublished } : p));
        setMessage({ type: 'success', text: `Saved: Page "${pageToUpdate.title}" is now ${!currentPublished ? 'Published' : 'Draft'}.` });
      } else {
        setMessage({ type: 'error', text: 'Failed to update page status.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while updating page status.' });
    }
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch custom pages.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while loading pages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/pages/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPages(ps => ps.filter(p => p.id !== deleteId));
        setMessage({ type: 'success', text: 'Page deleted successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete page.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred during page deletion.' });
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const processedPages = pages.map(page => {
    const wordCount = calculateWordCount(page.content);
    const keyword = getFallbackKeyword(page.title, page.slug);
    const seoResult = calculateSeoScore(page.title, page.slug, page.content, page.excerpt || '', keyword);
    return {
      ...page,
      wordCount,
      seoScore: seoResult.score,
    };
  });

  const filtered = processedPages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'updatedAt') {
      aVal = new Date(a.updatedAt).getTime();
      bVal = new Date(b.updatedAt).getTime();
    } else if (sortBy === 'published') {
      aVal = a.published ? 1 : 0;
      bVal = b.published ? 1 : 0;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const publishedCount = pages.filter(p => p.published).length;
  const totalWords = pages.reduce((acc, p) => acc + calculateWordCount(p.content), 0);

  return (
    <div className={adminStyles.page}>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={adminStyles.modalOverlay} onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}>
          <div className={adminStyles.modalContent} style={{ maxWidth: 420, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ef4444' }}>
              <Trash2 size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px' }}>Confirm Page Deletion</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
              Are you sure you want to permanently delete this page? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }} 
                className={adminStyles.secondary}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className={adminStyles.danger}
                style={{ flex: 1 }}
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Content Management System
          </div>
          <h1 className={adminStyles.title}>
            Custom <span className={adminStyles.titleAccent}>Pages</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Create, publish, and optimize static and modular landing pages with integrated SEO score checks.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <div className={adminStyles.searchBar} style={{ minWidth: 200 }}>
            <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search custom pages..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Link href="/admin/pages/editor" className={adminStyles.primary}>
            <Plus size={15} /> Add Page
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={adminStyles.notice} style={{ borderColor: message.type === 'success' ? 'var(--accent)' : 'rgba(239,68,68,0.3)', borderLeftColor: message.type === 'success' ? 'var(--accent)' : '#ef4444', color: message.type === 'success' ? 'var(--accent)' : '#f87171' }}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2 }}><X size={14} /></button>
        </div>
      )}

      {/* Metric Cards */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Pages</span>
            <Layers size={16} />
          </div>
          <div className={adminStyles.metricValue}>{pages.length}</div>
          <div className={adminStyles.metricBottom}>
            <span>All system routes</span>
            <span>{filtered.length} showing</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Published</span>
            <CheckCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>{publishedCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Live on public website</span>
            <span>Active URLs</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Draft Pages</span>
            <FileText size={16} />
          </div>
          <div className={adminStyles.metricValue}>{pages.length - publishedCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Unpublished drafts</span>
            <span>Staging status</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Word Count</span>
            <BookOpen size={16} />
          </div>
          <div className={adminStyles.metricValue}>{totalWords.toLocaleString()}</div>
          <div className={adminStyles.metricBottom}>
            <span>Cumulative page content</span>
            <span>All routes</span>
          </div>
        </div>
      </div>

      {/* Sort Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 10px', minHeight: 36 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort:</span>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as any)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 11, color: 'var(--text)', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <option value="updatedAt">Last Updated</option>
            <option value="title">Page Title</option>
            <option value="wordCount">Word Count</option>
            <option value="seoScore">SEO Score</option>
            <option value="published">Status</option>
          </select>
        </div>
        <button 
          onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
          className={adminStyles.secondary}
          style={{ minHeight: 36, padding: '0 10px', fontSize: 11 }}
        >
          {sortOrder === 'asc' ? '▲ ASC' : '▼ DESC'}
        </button>
      </div>

      {/* Table / List View */}
      {loading ? (
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
          Loading custom pages...
        </div>
      ) : (
        <div className={adminStyles.tableWrapper} style={{ marginTop: 0 }}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                {[
                  { key: 'title', label: 'Page Title' },
                  { key: 'slug', label: 'URL Route', sortable: false },
                  { key: 'wordCount', label: 'Word Count' },
                  { key: 'seoScore', label: 'SEO Score' },
                  { key: 'published', label: 'Status' },
                  { key: 'updatedAt', label: 'Last Updated' },
                  { key: 'actions', label: 'Actions', sortable: false }
                ].map(h => (
                  <th 
                    key={h.label}
                    className={adminStyles.th}
                    onClick={() => h.sortable !== false && handleSort(h.key as any)}
                    style={{ 
                      cursor: h.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {h.label}
                      {h.sortable !== false && sortBy === h.key && (
                        <span style={{ color: 'var(--accent)' }}>
                          {sortOrder === 'desc' ? '▼' : '▲'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className={adminStyles.td} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
                    No custom pages found. Click "+ Add Page" to create one.
                  </td>
                </tr>
              ) : (
                sorted.map(page => {
                  const updateDate = new Date(page.updatedAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  });

                  return (
                    <tr key={page.id} className={adminStyles.tr}>
                      <td className={adminStyles.td}>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{page.title}</div>
                        {page.excerpt && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 280 }}>{page.excerpt}</div>}
                      </td>
                      <td className={adminStyles.td} style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11 }}>
                        <span style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, color: 'var(--accent)', border: '1px solid var(--border)' }}>
                          {['about', 'services', 'careers', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer', 'editorial-policy', 'faq', 'portfolio', 'infrastructure', 'start-here'].includes(page.slug) ? '' : '/p'}/{page.slug}
                        </span>
                      </td>
                      <td className={adminStyles.td} style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: 'var(--text)' }}>
                        {page.wordCount} words
                      </td>
                      <td className={adminStyles.td}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, 
                          background: page.seoScore >= 80 ? 'rgba(16,185,129,0.1)' : page.seoScore >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: page.seoScore >= 80 ? '#34d399' : page.seoScore >= 60 ? '#fbbf24' : '#f87171', 
                          border: `1px solid ${page.seoScore >= 80 ? 'rgba(16,185,129,0.25)' : page.seoScore >= 60 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`, 
                          padding: '2px 8px', borderRadius: 999
                        }}>
                          {page.seoScore}/100
                        </span>
                      </td>
                      <td className={adminStyles.td}>
                        {page.published ? (
                          <span 
                            onClick={() => togglePublish(page.id, page.published)}
                            className={adminStyles.badge}
                            style={{ cursor: 'pointer' }}
                            title="Click to toggle Draft"
                          >
                            <span className={adminStyles.badgeLiveDot} /> Published
                          </span>
                        ) : (
                          <span 
                            onClick={() => togglePublish(page.id, page.published)}
                            className={adminStyles.badgeNeutral}
                            style={{ cursor: 'pointer' }}
                            title="Click to toggle Published"
                          >
                            Draft
                          </span>
                        )}
                      </td>
                      <td className={adminStyles.td} style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {updateDate}
                      </td>
                      <td className={adminStyles.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button 
                            onClick={() => togglePublish(page.id, page.published)}
                            title={page.published ? 'Unpublish (Set to Draft)' : 'Publish Page'}
                            className={adminStyles.secondary}
                            style={{ minHeight: 30, padding: '4px 8px' }}
                          >
                            {page.published ? <EyeOff size={13} style={{ color: '#fbbf24' }} /> : <Globe size={13} style={{ color: 'var(--accent)' }} />}
                          </button>
                          <Link 
                            href={`/admin/pages/editor?id=${page.id}`}
                            title="Edit"
                            className={adminStyles.secondary}
                            style={{ minHeight: 30, padding: '4px 8px' }}
                          >
                            <Edit2 size={13} />
                          </Link>
                          {page.published && (
                            <a 
                              href={['about', 'services', 'careers', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer', 'editorial-policy', 'faq', 'portfolio', 'infrastructure', 'start-here'].includes(page.slug) ? `/${page.slug}` : `/p/${page.slug}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Page"
                              className={adminStyles.secondary}
                              style={{ minHeight: 30, padding: '4px 8px' }}
                            >
                              <Eye size={13} />
                            </a>
                          )}
                          <button 
                            onClick={() => { setDeleteId(page.id); setShowDeleteModal(true); }}
                            title="Delete"
                            className={adminStyles.danger}
                            style={{ minHeight: 30, padding: '4px 8px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
