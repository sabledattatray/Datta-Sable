'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

export default function PagesManager() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { 
        bg: '#000000', 
        surface: '#000000', 
        surface2: '#121212', 
        border: '#1a1a1a', 
        text: '#f1f5f9', 
        muted: '#64748b', 
        accent: '#6366f1', 
        shadow: '0 4px 24px rgba(0,0,0,0.35)', 
        hoverShadow: '0 8px 32px rgba(0,0,0,0.5)', 
        hoverBg: 'rgba(255,255,255,0.02)' 
      }
    : { 
        bg: '#f0f4ff', 
        surface: '#ffffff', 
        surface2: '#f8faff', 
        border: '#e2e8f0', 
        text: '#0f172a', 
        muted: '#64748b', 
        accent: '#4f46e5', 
        shadow: '0 4px 24px rgba(0,0,0,0.07)', 
        hoverShadow: '0 8px 32px rgba(0,0,0,0.12)', 
        hoverBg: 'rgba(0,0,0,0.015)' 
      };

  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%' }}>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.35)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 24, padding: '32px', width: '100%', maxWidth: 440, boxShadow: css.hoverShadow }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: '0 0 12px' }}>Confirm Delete</h3>
            <p style={{ fontSize: 13, color: css.muted, margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this page? This action cannot be undone, and the page will no longer be accessible.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }} 
                style={{ flex: 1, padding: '12px', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 11, color: css.text, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Layers size={14} color={css.muted} />
            <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Content</p>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Pages</h1>
          <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0' }}>{filtered.length} dynamic page{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <Search size={14} color={css.muted} />
            <input 
              type="text" 
              placeholder="Search custom pages..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, fontWeight: 500, width: 180 }} 
            />
          </div>
          <Link 
            href="/admin/pages/editor" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 14px ${css.accent}40`, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <Plus size={17} /> Add Page
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 12, marginBottom: 20,
          background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span style={{ fontSize: 13, fontWeight: 600 }}>{message.text}</span>
          <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2 }}><X size={14} /></button>
        </div>
      )}

      {/* Table / List View */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px', color: css.muted, fontSize: 14, fontWeight: 600 }}>Loading custom pages...</div>
      ) : (
        <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: css.shadow }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                  {['Page Title', 'URL Route', 'Status', 'Last Updated', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: css.muted, fontSize: 14 }}>No custom pages created yet. Click "Add Page" to create one!</td></tr>
                )}
                {filtered.map((page, i) => {
                  const updateDate = new Date(page.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  });
                  return (
                    <tr key={page.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${css.border}` : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: css.text }}>{page.title}</div>
                        {page.excerpt && <div style={{ fontSize: 11, color: css.muted, marginTop: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 280 }}>{page.excerpt}</div>}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: css.muted }}>
                        <code style={{ fontSize: 12, background: css.surface2, padding: '2px 6px', borderRadius: 6, color: css.accent }}>
                          {['about', 'services', 'careers', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer', 'editorial-policy', 'faq', 'portfolio', 'infrastructure', 'start-here'].includes(page.slug) ? '' : '/p'}/{page.slug}
                        </code>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, 
                          background: page.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                          color: page.published ? '#10b981' : '#f59e0b', 
                          border: `1px solid ${page.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, 
                          padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' 
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: page.published ? '#10b981' : '#f59e0b' }} />
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: css.muted, fontWeight: 500 }}>{updateDate}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link 
                            href={`/admin/pages/editor?id=${page.id}`}
                            title="Edit"
                            style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = css.accent; (e.currentTarget as HTMLElement).style.borderColor = `${css.accent}50`; (e.currentTarget as HTMLElement).style.background = `${css.accent}08`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                          >
                            <Edit2 size={14} />
                          </Link>
                          {page.published && (
                            <a 
                              href={['about', 'services', 'careers', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer', 'editorial-policy', 'faq', 'portfolio', 'infrastructure', 'start-here'].includes(page.slug) ? `/${page.slug}` : `/p/${page.slug}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Page"
                              style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#10b981'; (e.currentTarget as HTMLElement).style.borderColor = `rgba(16,185,129,0.5)`; (e.currentTarget as HTMLElement).style.background = `rgba(16,185,129,0.08)`; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                            >
                              <Eye size={14} />
                            </a>
                          )}
                          <button 
                            onClick={() => { setDeleteId(page.id); setShowDeleteModal(true); }}
                            title="Delete"
                            style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.borderColor = `rgba(239,68,68,0.5)`; (e.currentTarget as HTMLElement).style.background = `rgba(239,68,68,0.08)`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
