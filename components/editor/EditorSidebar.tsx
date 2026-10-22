'use client';
import { useEditorStore } from '@/store/editorStore';
import { Settings, Image as ImageIcon, Box, LayoutPanelLeft } from 'lucide-react';
import { useState } from 'react';

export default function EditorSidebar() {
  const { postMetadata, updatePostMetadata, blocks, activeBlockId, updateBlock } = useEditorStore();
  const [tab, setTab] = useState<'post' | 'block'>('post');

  const css = { surface: 'var(--surface)', surface2: 'var(--surface2)', border: 'var(--border)', text: 'var(--text)', muted: 'var(--muted)', accent: 'var(--accent)', inputBg: 'var(--bg)' };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: css.inputBg, border: `1.5px solid ${css.border}`,
    borderRadius: 10, fontSize: 13, color: css.text,
    outline: 'none', fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: css.muted,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    display: 'block', marginBottom: 7,
  };

  const focusAccent = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    (e.target as HTMLElement).style.borderColor = css.accent;
  };
  const blurAccent = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    (e.target as HTMLElement).style.borderColor = css.border;
  };

  return (
    <aside style={{ width: 300, flexShrink: 0, borderLeft: `1px solid ${css.border}`, background: css.surface, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${css.border}`, position: 'sticky', top: 0, background: css.surface, zIndex: 10 }}>
        {[{ key: 'post', label: 'Post', Icon: Settings }, { key: 'block', label: 'Block', Icon: Box }].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            style={{
              flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none',
              color: tab === key ? css.text : css.muted,
              borderBottom: tab === key ? `2px solid ${css.accent}` : '2px solid transparent',
              transition: 'color 0.15s',
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {tab === 'post' ? (
          <>
            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              <select value={postMetadata.status} onChange={e => updatePostMetadata({ status: e.target.value as any })}
                style={inputStyle} onFocus={focusAccent} onBlur={blurAccent}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            {/* Slug */}
            <div>
              <label style={labelStyle}>URL Slug</label>
              <input type="text" value={postMetadata.slug} onChange={e => updatePostMetadata({ slug: e.target.value })}
                placeholder="my-awesome-post" style={{ ...inputStyle, fontFamily: 'monospace' }}
                onFocus={focusAccent} onBlur={blurAccent} />
            </div>

            {/* Featured Image */}
            <div>
              <label style={labelStyle}>Featured Image</label>
              <div 
                onClick={() => document.getElementById('sidebar-featured-image-input')?.click()}
                style={{ width: '100%', height: 110, border: `2px dashed ${css.border}`, borderRadius: 12, background: css.inputBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.15s', overflow: 'hidden', position: 'relative' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = css.accent}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = css.border}
              >
                {postMetadata.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={postMetadata.featuredImage} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <ImageIcon size={22} color={css.muted} />
                    <span style={{ fontSize: 11, color: css.muted, marginTop: 6, fontWeight: 500 }}>Click to upload</span>
                  </>
                )}
              </div>
              <input 
                id="sidebar-featured-image-input" 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const form = new FormData();
                      form.append('file', file);
                      const res = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: form,
                      });
                      if (!res.ok) throw new Error('Upload failed');
                      const data = await res.json();
                      updatePostMetadata({ featuredImage: data.url });
                    } catch (err: any) {
                      alert('Image upload failed: ' + err.message);
                    }
                  }
                }} 
              />
            </div>

            {/* Categories */}
            <div>
              <label style={labelStyle}>Categories</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Technology', 'Business', 'Design', 'Data Analytics'].map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: css.text, cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" checked={postMetadata.categories.includes(cat)}
                      onChange={e => updatePostMetadata({ categories: e.target.checked ? [...postMetadata.categories, cat] : postMetadata.categories.filter(c => c !== cat) })}
                      style={{ accentColor: css.accent, width: 15, height: 15 }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label style={labelStyle}>Excerpt</label>
              <textarea value={postMetadata.excerpt} onChange={e => updatePostMetadata({ excerpt: e.target.value })}
                placeholder="Brief summary..." rows={4}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                onFocus={focusAccent} onBlur={blurAccent}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input type="text" placeholder="Next.js, React, Data..." value={postMetadata.tags?.join(', ') || ''}
                onChange={e => updatePostMetadata({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                style={inputStyle} onFocus={focusAccent} onBlur={blurAccent}
              />
            </div>

            {/* SEO section */}
            <div style={{ borderTop: `1px solid ${css.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>SEO Optimization</p>
              <div>
                <label style={labelStyle}>Meta Title</label>
                <input type="text" placeholder="Leave blank to use post title" value={postMetadata.metaTitle || ''}
                  onChange={e => updatePostMetadata({ metaTitle: e.target.value })}
                  style={inputStyle} onFocus={focusAccent} onBlur={blurAccent}
                />
              </div>
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea rows={3} placeholder="Search engine summary..." value={postMetadata.metaDesc || ''}
                  onChange={e => updatePostMetadata({ metaDesc: e.target.value })}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                  onFocus={focusAccent} onBlur={blurAccent}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {!activeBlock ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', textAlign: 'center', gap: 12 }}>
                <LayoutPanelLeft size={32} color={css.muted} />
                <p style={{ fontSize: 13, color: css.muted, margin: 0, lineHeight: 1.6 }}>Select a block on the canvas to edit its properties</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '12px 14px', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, textTransform: 'uppercase' }}>
                    {activeBlock.type.substring(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: css.text, textTransform: 'capitalize' }}>{activeBlock.type} Block</div>
                    <div style={{ fontSize: 11, color: css.muted }}>ID: {activeBlock.id.split('-')[1]}</div>
                  </div>
                </div>
                {[
                  { label: 'Padding (rem)', key: 'padding', type: 'number' },
                  { label: 'Custom CSS Class', key: 'cssClass', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} step={type === 'number' ? '0.5' : undefined}
                      value={(activeBlock.metadata as any)?.[key] || ''}
                      onChange={e => updateBlock(activeBlock.id, { metadata: { ...(activeBlock.metadata as any), [key]: e.target.value } })}
                      style={inputStyle} onFocus={focusAccent} onBlur={blurAccent}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Width</label>
                  <select value={(activeBlock.metadata as any)?.width || 'contained'}
                    onChange={e => updateBlock(activeBlock.id, { metadata: { ...(activeBlock.metadata as any), width: e.target.value } })}
                    style={inputStyle} onFocus={focusAccent} onBlur={blurAccent}
                  >
                    <option value="contained">Contained</option>
                    <option value="full">Full Width</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
