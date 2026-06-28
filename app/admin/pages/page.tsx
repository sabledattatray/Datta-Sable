'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

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

  const basicChecks: any[] = [];
  const additionalChecks: any[] = [];
  const titleChecks: any[] = [];
  const contentChecks: any[] = [];
  
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

  const cleanText = textContent.trim();
  const firstParagraph = cleanText.split('\n')[0] || '';
  const first300Chars = cleanText.slice(0, 300);
  const kwInBeginning = isFallback ? true : (firstParagraph.toLowerCase().includes(kw) || first300Chars.toLowerCase().includes(kw));
  addCheck('basic', 'beginning_kw', 'Focus keyword at beginning of content', kwInBeginning, 15);

  const wordCountOk = wordCount >= 600;
  addCheck('basic', 'word_count', `Content length`, wordCountOk, 10);

  const subheadingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let matches;
  let kwInSubheading = false;
  while ((matches = subheadingRegex.exec(content)) !== null) {
    const text = matches[1].replace(/<[^>]*>/g, '').toLowerCase();
    if (text.includes(kw)) {
      kwInSubheading = true;
      break;
    }
  }
  addCheck('additional', 'subheading_kw', 'Focus keyword in subheadings', isFallback ? true : kwInSubheading, 10);

  const imgRegex = /<img([^>]+)>/gi;
  let imgMatch;
  let hasImages = false;
  let kwInAlt = false;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    hasImages = true;
    const attributes = imgMatch[1];
    const altMatch = /alt=["']([^"']*)["']/i.exec(attributes);
    if (altMatch && altMatch[1].toLowerCase().includes(kw)) {
      kwInAlt = true;
    }
  }
  addCheck('additional', 'image_alt_kw', 'Images ALT', isFallback ? true : (hasImages && kwInAlt), 5);

  let densityOk = false;
  if (wordCount > 0 && cleanContent.includes(kw)) {
    const matchesCount = cleanContent.split(kw).length - 1;
    const density = (matchesCount / wordCount) * 100;
    densityOk = density >= 0.5 && density <= 2.5;
  }
  addCheck('additional', 'density', 'Density', isFallback ? true : densityOk, 5);

  const linkRegex = /href=["']([^"']*)["']/gi;
  let hasInternalLink = false;
  let hasExternalLink = false;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const url = linkMatch[1];
    if (url.startsWith('/') || url.includes('dattasable.com') || url.startsWith('#')) {
      if (!url.startsWith('#')) {
        hasInternalLink = true;
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      hasExternalLink = true;
    }
  }
  addCheck('additional', 'internal_link', 'Internal links', hasInternalLink, 5);
  addCheck('additional', 'external_link', 'External links', hasExternalLink, 5);

  const kwStartsTitle = cleanTitle.startsWith(kw) || cleanTitle.indexOf(kw) < 15;
  addCheck('title', 'title_start', 'Focus keyword placement', kwInTitle && kwStartsTitle, 5);

  const sentimentWords = [
    'best', 'great', 'easy', 'simple', 'ultimate', 'perfect', 'top', 'amazing', 'awesome', 'guide',
    'master', 'successful', 'build', 'high', 'performance', 'smart', 'clean', 'power', 'premium',
    'worst', 'bad', 'fix', 'avoid', 'mistake', 'error', 'warning', 'problem', 'fail', 'critical',
    'failure', 'issue', 'bottleneck', 'threat', 'risky', 'hard', 'difficult', 'troubleshooting',
    'tuning', 'comparison', 'choose', 'opportunities', 'career', 'roadmap', 'pass', 'exam', 'certification',
    'how'
  ];
  const hasSentiment = sentimentWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_sentiment', 'Sentiment', hasSentiment, 5);

  const powerWords = [
    'proven', 'guaranteed', 'powerful', 'secret', 'hack', 'ultimate', 'expert', 'advanced',
    'breakthrough', 'shocking', 'magic', 'instant', 'free', 'today', 'now', 'masterclass',
    'professional', 'enterprise', 'production-grade', 'architecting', 'reliability', 'troubleshooting',
    'tuning', 'complete', 'pass', 'preparation', 'questions', 'scenarios', 'certified', 'optimization',
    'guide', 'roadmap', 'mastery', 'manifesto'
  ];
  const hasPowerWord = powerWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_power_word', 'Power word', hasPowerWord, 5);

  const hasNumber = /\d+/.test(title);
  addCheck('title', 'title_number', 'Number in title', hasNumber, 5);

  const hasTocLabel = cleanContent.includes('table of contents') || cleanContent.includes('toc') || cleanContent.includes('what we will cover');
  const hasAnchorLinks = /href=["']#[a-z0-9-_]+["']/i.test(content);
  const hasToc = hasTocLabel || (hasAnchorLinks && (content.includes('<ul>') || content.includes('<ol>')));
  addCheck('content', 'content_toc', 'TOC', hasToc, 5);

  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  let paragraphCount = 0;
  let longParagraphCount = 0;
  while ((pMatch = pRegex.exec(content)) !== null) {
    paragraphCount++;
    const text = pMatch[1].replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words > 120) {
      longParagraphCount++;
    }
  }
  const shortParagraphsOk = paragraphCount === 0 || (longParagraphCount / paragraphCount) <= 0.2;
  addCheck('content', 'content_short_paragraphs', 'Short paragraphs', shortParagraphsOk, 5);

  const hasMedia = content.includes('<img') || content.includes('<video') || content.includes('<iframe');
  addCheck('content', 'content_media', 'Media', hasMedia, 5);

  const score = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
  return { score };
}

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
  const [sortBy, setSortBy] = useState<'title' | 'wordCount' | 'seoScore' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort:</span>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as any)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="updatedAt">Last Updated</option>
              <option value="title">Page Title</option>
              <option value="wordCount">Word Count</option>
              <option value="seoScore">SEO Score</option>
            </select>
            <button 
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', marginLeft: 4 }}
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <Search size={14} color={css.muted} />
            <input 
              type="text" 
              placeholder="Search custom pages..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, fontWeight: 500, width: 150 }} 
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
                  {['Page Title', 'URL Route', 'Word Count', 'SEO Score', 'Status', 'Last Updated', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: css.muted, fontSize: 14 }}>No custom pages created yet. Click "Add Page" to create one!</td></tr>
                )}
                {sorted.map((page, i) => {
                  const updateDate = new Date(page.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  });
                  const wordCount = page.wordCount;
                  const seoScore = page.seoScore;

                  return (
                    <tr key={page.id}
                      style={{ borderBottom: i < sorted.length - 1 ? `1px solid ${css.border}` : 'none', transition: 'background 0.15s' }}
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
                      <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: css.muted }}>
                        {wordCount} words
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, 
                          background: seoScore >= 80 ? 'rgba(16,185,129,0.1)' : seoScore >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: seoScore >= 80 ? '#10b981' : seoScore >= 60 ? '#f59e0b' : '#ef4444', 
                          border: `1px solid ${seoScore >= 80 ? 'rgba(16,185,129,0.25)' : seoScore >= 60 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`, 
                          padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' 
                        }}>
                          {seoScore}/100
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span 
                          onClick={() => togglePublish(page.id, page.published)}
                          title={`Click to ${page.published ? 'Unpublish (set to Draft)' : 'Publish'}`}
                          style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, 
                            background: page.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                            color: page.published ? '#10b981' : '#f59e0b', 
                            border: `1px solid ${page.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, 
                            padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em',
                            cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                        >
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
