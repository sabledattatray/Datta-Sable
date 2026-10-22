'use client';
import EditorSidebar from '@/components/editor/EditorSidebar';
import FullEditor from '@/components/editor/FullEditor';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, Suspense, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { useEditorStore } from '@/store/editorStore';
import adminStyles from '@/components/admin/AdminCommon.module.css';

function EditorContent() {
  const { postMetadata, updatePostMetadata } = useEditorStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorHtml, setEditorHtml] = useState('');
  const [autoSaveLabel, setAutoSaveLabel] = useState('');

  const css = {
    bg: 'var(--bg)',
    surface: 'var(--surface)',
    surface2: 'var(--surface2)',
    border: 'var(--border)',
    text: 'var(--text)',
    muted: 'var(--muted)',
    accent: 'var(--accent)',
  };

  // Load existing post for editing
  useEffect(() => {
    if (editId) {
      const loadPost = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/blog/${editId}`);
          if (!res.ok) throw new Error('Failed to load post');
          const post = await res.json();
          if (post) {
            updatePostMetadata({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              categories: [post.category || 'Tech Trends'],
              status: post.published ? 'Published' : 'Draft',
              date: post.date,
              featuredImage: post.image || '',
            });
            setEditorHtml(post.content || '');
          }
        } catch (err: any) {
          alert('Error loading post: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [editId]);

  // Auto-save indicator
  const handleEditorChange = useCallback((html: string) => {
    setEditorHtml(html);
    setAutoSaveLabel('Draft saved');
    const timer = setTimeout(() => setAutoSaveLabel(''), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePublish = async (status: 'Draft' | 'Published') => {
    const payload = {
      title: postMetadata.title || 'Untitled Post',
      slug: postMetadata.slug || (postMetadata.title || 'untitled-post').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      category: postMetadata.categories[0] || 'Tech Trends',
      excerpt: postMetadata.excerpt || '',
      content: editorHtml,
      image: postMetadata.featuredImage || '/images/blog/bi-career.webp',
      date: postMetadata.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      published: status === 'Published',
    };

    try {
      setLoading(true);
      const url = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save post');
      }

      router.push('/admin/blog');
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={adminStyles.editorpage} data-standalone="true" style={{ display: 'flex', flexDirection: 'column', background: previewMode ? css.surface : css.bg, color: css.text, transition: 'background 0.3s' }}>

      {/* Top bar */}
      {!previewMode && (
        <header style={{
          height: 56, background: css.surface, borderBottom: `1px solid ${css.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0, zIndex: 20,
          boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.03)' : '0 1px 0 rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/admin/blog" style={{ color: css.muted, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = css.text}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = css.muted}
            >
              <ArrowLeft size={20} />
            </Link>
            <div style={{ width: 1, height: 24, background: css.border }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: css.text }}>
              {editId ? 'Edit Post' : 'New Post'}
            </span>
            {autoSaveLabel && (
              <span style={{ fontSize: 12, color: css.muted, fontStyle: 'italic' }}>
                {autoSaveLabel}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <button onClick={() => setPreviewMode(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Eye size={13} /> Preview
            </button>
            <button onClick={() => handlePublish('Draft')} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: loading ? 0.5 : 1 }}>
              <Save size={13} /> Save Draft
            </button>
            <button onClick={() => handlePublish('Published')} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--accent)', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#000', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: loading ? 0.5 : 1 }}>
              <Send size={13} /> {loading ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </header>
      )}

      {/* Exit preview button */}
      {previewMode && (
        <button onClick={() => setPreviewMode(false)} style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', padding: '10px 24px', background: isDark ? '#1e293b' : '#0f172a', color: '#fff', fontWeight: 700, borderRadius: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 50, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <Eye size={15} /> Exit Preview
        </button>
      )}

      {/* Main workspace */}
      <div className={adminStyles.editorBody} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto', background: css.bg, padding: previewMode ? '60px 40px' : '24px 32px' }}>
          <div style={{ maxWidth: previewMode ? 860 : 1200, margin: '0 auto' }}>
            {/* Title Input */}
            {!previewMode && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${css.border}` }}>
                <input
                  type="text"
                  placeholder="Post Title..."
                  value={postMetadata.title}
                  onChange={e => updatePostMetadata({ title: e.target.value })}
                  style={{ width: '100%', fontSize: '2rem', fontWeight: 800, background: 'none', border: 'none', outline: 'none', color: css.text, letterSpacing: '-0.02em', lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            )}

            {/* Preview Mode - show title + rendered HTML */}
            {previewMode && (
              <div>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em' }}>
                  {postMetadata.title || 'Untitled Post'}
                </h1>
                <div
                  dangerouslySetInnerHTML={{ __html: editorHtml }}
                  style={{ fontSize: 16, lineHeight: 1.8 }}
                />
              </div>
            )}

            {/* Editor */}
            {!previewMode && (
              <FullEditor
                content={editorHtml}
                onChange={handleEditorChange}
                isDark={isDark}
              />
            )}
          </div>
        </main>
        {!previewMode && <EditorSidebar />}
      </div>
    </div>
  );
}

export default function AdvancedEditorPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
