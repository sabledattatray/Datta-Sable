'use client';
import { useEditorStore } from '@/store/editorStore';
import { useTheme } from '@/components/ThemeProvider';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3,
  Link as LinkIcon, Undo, Redo,
  Palette, Eraser,
} from 'lucide-react';
import { useState } from 'react';

export default function MainToolbar() {
  const { activeEditor } = useEditorStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showColors, setShowColors] = useState(false);

  const editor = activeEditor;
  const colors = ['#0f172a', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

  const btnBase: React.CSSProperties = {
    padding: '6px', borderRadius: 7, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s', background: 'none',
  };

  const Btn = ({ onClick, isActive, title, disabled, children }: { onClick: () => void; isActive?: boolean; title: string; disabled?: boolean; children: React.ReactNode }) => (
    <button
      onClick={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      style={{
        ...btnBase,
        color: isActive ? (isDark ? '#fff' : '#0f172a') : (isDark ? '#64748b' : '#64748b'),
        background: isActive ? (isDark ? 'rgba(99,102,241,0.2)' : 'rgba(79,70,229,0.08)') : 'none',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => { if (!disabled && !isActive) (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'none'; }}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div style={{ width: 1, height: 20, background: isDark ? '#1e293b' : '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, filter: !editor ? 'grayscale(1) opacity(0.5)' : 'none' }}>
      {/* Undo/Redo */}
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().undo().run()} title="Undo"><Undo size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().redo().run()} title="Redo"><Redo size={15} /></Btn>
      <Divider />

      {/* Inline formatting */}
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Bold"><Bold size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Italic"><Italic size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive('underline')} title="Underline"><Underline size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} title="Strike"><Strikethrough size={15} /></Btn>
      <Divider />

      {/* Headings */}
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor?.isActive('heading', { level: 1 })} title="H1"><Heading1 size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive('heading', { level: 2 })} title="H2"><Heading2 size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor?.isActive('heading', { level: 3 })} title="H3"><Heading3 size={15} /></Btn>
      <Divider />

      {/* Alignment */}
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('left').run()} isActive={editor?.isActive({ textAlign: 'left' })} title="Left"><AlignLeft size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('center').run()} isActive={editor?.isActive({ textAlign: 'center' })} title="Center"><AlignCenter size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('right').run()} isActive={editor?.isActive({ textAlign: 'right' })} title="Right"><AlignRight size={15} /></Btn>
      <Divider />

      {/* Lists */}
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Bullet List"><List size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} title="Ordered List"><ListOrdered size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive('blockquote')} title="Quote"><Quote size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} isActive={editor?.isActive('codeBlock')} title="Code Block"><Code size={15} /></Btn>
      <Divider />

      {/* Colors */}
      <div style={{ position: 'relative' }}>
        <Btn disabled={!editor} onClick={() => setShowColors(v => !v)} title="Colors"><Palette size={15} /></Btn>
        {showColors && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: isDark ? '#000000' : '#fff', border: `1px solid ${isDark ? '#1a1a1a' : '#e2e8f0'}`, borderRadius: 14, padding: 14, zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', minWidth: 200 }}>
            <p style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Text Color</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {colors.map(c => (
                <button key={c} onClick={() => { editor?.chain().focus().setColor(c).run(); setShowColors(false); }}
                  style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: `2px solid ${isDark ? '#1e293b' : '#f1f5f9'}`, cursor: 'pointer', transition: 'transform 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Highlight</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['#fef08a', '#bfdbfe', '#bbf7d0', '#fecaca', '#ddd6fe', '#fbcfe8', '#ffedd5', '#e0f2fe'].map(c => (
                <button key={c} onClick={() => { editor?.chain().focus().setHighlight({ color: c }).run(); setShowColors(false); }}
                  style={{ width: 22, height: 22, borderRadius: 6, background: c, border: `2px solid ${isDark ? '#1e293b' : '#f1f5f9'}`, cursor: 'pointer', transition: 'transform 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Btn disabled={!editor} onClick={() => { const url = window.prompt('URL', editor?.getAttributes('link').href); if (url && editor) editor.chain().focus().setLink({ href: url }).run(); }} isActive={editor?.isActive('link')} title="Insert Link"><LinkIcon size={15} /></Btn>
      <Btn disabled={!editor} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"><Eraser size={15} /></Btn>
    </div>
  );
}
