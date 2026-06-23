'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { FontSize } from './FontSizeExtension';
import { FontFamily } from './FontFamilyExtension';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Minus,
  Undo, Redo, Type, Palette, Highlighter, Unlink,
  FileCode, Eye,
} from 'lucide-react';

interface FullEditorProps {
  content: string;
  onChange: (html: string) => void;
  isDark: boolean;
}

function ToolbarButton({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`toolbar-btn ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <div className="toolbar-sep" />;
}

export default function FullEditor({ content, onChange, isDark }: FullEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const css = isDark
    ? { bg: '#000000', surface: '#121212', border: '#1a1a1a', text: '#f1f5f9', muted: '#94a3b8', accent: '#6366f1' }
    : { bg: '#ffffff', surface: '#f8fafc', border: '#e2e8f0', text: '#0f172a', muted: '#64748b', accent: '#4f46e5' };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link', style: 'color: #6366f1; text-decoration: underline; cursor: pointer;' },
      }),
      Image.configure({
        HTMLAttributes: { style: 'max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;' },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
      FontSize,
      FontFamily,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'full-editor-content',
        style: `
          outline: none;
          min-height: calc(100vh - 360px);
          font-size: 16px;
          line-height: 1.8;
          color: ${css.text};
        `,
      },
      // Strip background colors and unwanted styles from pasted content
      transformPastedHTML(html: string) {
        // Remove background-color inline styles
        let clean = html.replace(/background-color\s*:\s*[^;"']+;?/gi, '');
        // Remove background shorthand inline styles
        clean = clean.replace(/background\s*:\s*[^;"']+;?/gi, '');
        // Remove data-pm-slice attributes (ProseMirror internal)
        clean = clean.replace(/\s*data-pm-slice="[^"]*"/gi, '');
        // Remove highlight/mark wrapping with backgrounds
        clean = clean.replace(/<mark[^>]*>/gi, '');
        clean = clean.replace(/<\/mark>/gi, '');
        return clean;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setSourceHtml(html);
    },
  });

  // Sync content from parent when loading a post for editing
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
      setSourceHtml(content);
    }
  }, [content, editor]);

  const toggleSourceMode = () => {
    if (isSourceMode) {
      editor?.commands.setContent(sourceHtml);
    } else {
      setSourceHtml(editor?.getHTML() || '');
    }
    setIsSourceMode(!isSourceMode);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      alert('Image upload failed. Please try again.');
    }
  }, [editor]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) return null;

  const Menu = BubbleMenu as any;

  // Compute live statistics for words, characters, paragraphs, and read time
  const getStats = () => {
    let text = '';
    let html = '';
    if (isSourceMode) {
      text = sourceHtml.replace(/<[^>]*>/g, ' ');
      html = sourceHtml;
    } else {
      text = editor.getText();
      html = editor.getHTML();
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    
    // Count paragraphs using block tags
    const paragraphs = (html.match(/<(p|h1|h2|h3|blockquote|pre)[^>]*>/g) || []).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    
    return { words, chars, paragraphs, minutes };
  };

  const { words, chars, paragraphs, minutes } = getStats();

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={isSourceMode || !editor.can().undo()} title="Undo">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={isSourceMode || !editor.can().redo()} title="Redo">
          <Redo size={16} />
        </ToolbarButton>

        <ToolbarSep />

        {/* Text Type */}
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} disabled={isSourceMode} title="Paragraph">
          <Type size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} disabled={isSourceMode} title="Heading 1">
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} disabled={isSourceMode} title="Heading 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} disabled={isSourceMode} title="Heading 3">
          <Heading3 size={16} />
        </ToolbarButton>

        <ToolbarSep />

        {/* Inline Formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} disabled={isSourceMode} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} disabled={isSourceMode} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} disabled={isSourceMode} title="Underline">
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} disabled={isSourceMode} title="Strikethrough">
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} active={editor.isActive('highlight')} disabled={isSourceMode} title="Highlight">
          <Highlighter size={16} />
        </ToolbarButton>

        {/* Font Color */}
        <div style={{ position: 'relative' }}>
          <ToolbarButton onClick={() => colorInputRef.current?.click()} disabled={isSourceMode} title="Font Color">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Palette size={14} />
              <div style={{ width: 14, height: 3, borderRadius: 1, background: fontColor }} />
            </div>
          </ToolbarButton>
          <input
            ref={colorInputRef}
            type="color"
            value={fontColor}
            onChange={e => {
              setFontColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            disabled={isSourceMode}
            style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
        </div>

        {/* Font Style */}
        <select
          value={editor.getAttributes('textStyle').fontFamily || 'default'}
          onChange={e => {
            const family = e.target.value;
            if (family === 'default') {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(family).run();
            }
          }}
          disabled={isSourceMode}
          title="Font Style"
          className="toolbar-select"
        >
          <option value="default" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>Font Style</option>
          <optgroup label="Preloaded Fonts" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#6366f1' : '#4f46e5', fontWeight: 'bold' }}>
            <option value="Inter" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Inter' }}>Default (Inter)</option>
            <option value="Syne" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Syne' }}>Creative (Syne)</option>
            <option value="JetBrains Mono" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'JetBrains Mono' }}>Developer (JetBrains Mono)</option>
          </optgroup>
          <optgroup label="Instant System Sans-Serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#6366f1' : '#4f46e5', fontWeight: 'bold' }}>
            <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'system-ui' }}>System UI (OS Native)</option>
            <option value="'Helvetica Neue', Helvetica, Arial, sans-serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Helvetica' }}>Helvetica / Arial (Classic)</option>
            <option value="'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', sans-serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Trebuchet MS' }}>Trebuchet MS (Geometric)</option>
          </optgroup>
          <optgroup label="Instant System Serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#6366f1' : '#4f46e5', fontWeight: 'bold' }}>
            <option value="Georgia, Cambria, 'Times New Roman', Times, serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Georgia' }}>Georgia (Editorial Serif)</option>
            <option value="'Apple Garamond', Baskerville, 'Times New Roman', Garamond, serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Garamond' }}>Garamond / Baskerville (Elegant)</option>
            <option value="'Courier New', Courier, monospace" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Courier New' }}>Courier New (Typewriter)</option>
          </optgroup>
          <optgroup label="Instant System Display" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#6366f1' : '#4f46e5', fontWeight: 'bold' }}>
            <option value="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Impact' }}>Impact (Bold Heading)</option>
            <option value="'Comic Sans MS', 'Comic Sans', cursive" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', fontFamily: 'Comic Sans MS' }}>Comic Sans (Casual/Dyslexia Friendly)</option>
          </optgroup>
        </select>

        {/* Font Size */}
        <select
          value={editor.getAttributes('textStyle').fontSize || 'default'}
          onChange={e => {
            const size = e.target.value;
            if (size === 'default') {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
          disabled={isSourceMode}
          title="Font Size"
          className="toolbar-select"
        >
          <option value="default" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>Size</option>
          <option value="12px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>12</option>
          <option value="14px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>14</option>
          <option value="16px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>16</option>
          <option value="18px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>18</option>
          <option value="20px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>20</option>
          <option value="24px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>24</option>
          <option value="28px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>28</option>
          <option value="32px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>32</option>
          <option value="36px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>36</option>
          <option value="48px" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>48</option>
        </select>

        <ToolbarSep />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} disabled={isSourceMode} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} disabled={isSourceMode} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} disabled={isSourceMode} title="Quote">
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} disabled={isSourceMode} title="Code Block">
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} disabled={isSourceMode} title="Inline Code">
          <Code size={16} />
        </ToolbarButton>

        <select
          value="default"
          onChange={e => {
            const val = e.target.value;
            if (val === 'mermaid') {
              editor.chain().focus().insertContent('<pre class="mermaid">flowchart TD\n  Start --> Process\n  Process --> End</pre><p></p>').run();
            } else if (val === 'javascript') {
              editor.chain().focus().insertContent('<pre><code class="language-javascript">// JavaScript Code\nfunction greet() {\n  console.log("Hello, World!");\n}</code></pre><p></p>').run();
            } else if (val === 'table') {
              editor.chain().focus().insertContent('<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;"><thead style="background: var(--surface2);"><tr style="border-bottom: 2px solid var(--border);"><th style="padding: 10px; text-align: left; border: 1px solid var(--border);">Column 1</th><th style="padding: 10px; text-align: left; border: 1px solid var(--border);">Column 2</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 10px; border: 1px solid var(--border);">Data A</td><td style="padding: 10px; border: 1px solid var(--border);">Data B</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 10px; border: 1px solid var(--border);">Data C</td><td style="padding: 10px; border: 1px solid var(--border);">Data D</td></tr></tbody></table><p></p>').run();
            } else if (val === 'callout') {
              editor.chain().focus().insertContent('<div class="callout-box" style="background: rgba(99, 102, 241, 0.06); border-left: 4px solid #6366f1; padding: 1.25rem 1.5rem; border-radius: 0 8px 8px 0; margin: 2rem 0; color: var(--text);"><strong>Note:</strong> Enter callout or highlight details here.</div><p></p>').run();
            } else if (val === 'accordion') {
              editor.chain().focus().insertContent('<details style="background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 18px; margin: 1.5rem 0; cursor: pointer;"><summary style="font-weight: 700; outline: none; margin-bottom: 4px;">Click to expand title</summary><p style="margin: 0; color: var(--muted); cursor: default;">This is the hidden details content that is displayed upon expansion.</p></details><p></p>').run();
            } else if (val === 'html') {
              editor.chain().focus().insertContent('<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 1.5rem 0;"><strong>HTML Block:</strong> Place your custom HTML layout here.</div><p></p>').run();
            }
            e.target.value = 'default';
          }}
          disabled={isSourceMode}
          title="Insert custom blocks and templates"
          className="toolbar-select"
        >
          <option value="default" disabled style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>+ Insert Block</option>
          <option value="mermaid" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>📊 Mermaid Diagram</option>
          <option value="javascript" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>⚡ JavaScript Code</option>
          <option value="table" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>📅 Data Table</option>
          <option value="callout" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>💡 Callout Box</option>
          <option value="accordion" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>🔽 Accordion (Details)</option>
          <option value="html" style={{ background: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>🌐 HTML Block</option>
        </select>

        <ToolbarSep />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} disabled={isSourceMode} title="Align Left">
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} disabled={isSourceMode} title="Align Center">
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} disabled={isSourceMode} title="Align Right">
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} disabled={isSourceMode} title="Justify">
          <AlignJustify size={16} />
        </ToolbarButton>

        <ToolbarSep />

        {/* Link */}
        {showLinkInput ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
              autoFocus
              className="toolbar-input"
            />
            <button onClick={setLink} className="toolbar-btn-set">Set</button>
            <button onClick={() => setShowLinkInput(false)} className="toolbar-btn-cancel">✕</button>
          </div>
        ) : (
          <>
            <ToolbarButton onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setShowLinkInput(true); }} active={editor.isActive('link')} disabled={isSourceMode} title="Insert Link">
              <LinkIcon size={16} />
            </ToolbarButton>
            {editor.isActive('link') && (
              <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={isSourceMode} title="Remove Link">
                <Unlink size={16} />
              </ToolbarButton>
            )}
          </>
        )}

        {/* Image */}
        <ToolbarButton onClick={handleImageClick} disabled={isSourceMode} title="Insert Image">
          <ImageIcon size={16} />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        {/* Divider */}
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={isSourceMode} title="Horizontal Rule">
          <Minus size={16} />
        </ToolbarButton>

        <ToolbarSep />

        {/* HTML Source View Toggle */}
        <ToolbarButton onClick={toggleSourceMode} active={isSourceMode} title={isSourceMode ? "Visual Editor" : "HTML Source Code"}>
          {isSourceMode ? <Eye size={16} /> : <FileCode size={16} />}
        </ToolbarButton>
      </div>

      {/* Bubble Menu (appears on text selection) */}
      {!isSourceMode && (
        <Menu editor={editor} tippyOptions={{ duration: 150 }}>
          <div className="bubble-menu-container">
            {[
              { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
              { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
              { icon: <UnderlineIcon size={14} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
              { icon: <Code size={14} />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), title: 'Code' },
              { icon: <LinkIcon size={14} />, action: () => { setLinkUrl(editor.getAttributes('link').href || ''); setShowLinkInput(true); }, active: editor.isActive('link'), title: 'Link' },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                title={btn.title}
                className={`bubble-menu-btn ${btn.active ? 'active' : ''}`}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </Menu>
      )}

      {/* Editor Content */}
      <div style={{
        borderTop: `1px solid ${css.border}`,
        borderLeft: `1px solid ${css.border}`,
        borderRight: `1px solid ${css.border}`,
        borderRadius: '12px 12px 0 0',
        padding: isSourceMode ? '16px' : '24px 32px',
        minHeight: 500,
        background: isSourceMode ? (isDark ? '#020617' : '#fafafa') : css.bg,
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {isSourceMode ? (
          <textarea
            value={sourceHtml}
            onChange={e => {
              const val = e.target.value;
              setSourceHtml(val);
              onChange(val);
            }}
            placeholder="Paste or write raw HTML code here..."
            style={{
              flex: 1,
              width: '100%',
              minHeight: 480,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isDark ? '#38bdf8' : '#0f172a',
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontSize: 14,
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Editor Status Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 18px', border: `1px solid ${css.border}`,
        borderRadius: '0 0 12px 12px', background: css.surface, color: css.muted,
        fontSize: 12, fontWeight: 600,
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span><strong>{words}</strong> words</span>
          <span><strong>{chars}</strong> characters</span>
          <span><strong>{paragraphs}</strong> paragraphs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⏱️ {minutes} min read</span>
        </div>
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        /* Premium Editor Toolbar & Component Styles */
        .editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          margin-bottom: 20px;
          background: ${isDark ? 'rgba(10, 10, 10, 0.75)' : 'rgba(255, 255, 255, 0.8)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'};
          border-radius: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
          color: ${css.muted};
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          box-shadow: ${isDark 
            ? '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
            : '0 4px 30px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.5)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .editor-toolbar:hover {
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)'};
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: ${css.muted};
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)'};
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)'};
          color: ${isDark ? '#f1f5f9' : '#0f172a'};
          transform: translateY(-1px);
        }

        .toolbar-btn:active:not(:disabled) {
          transform: translateY(0);
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)'};
        }

        .toolbar-btn.active:not(:disabled) {
          background: ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'};
          border-color: rgba(99, 102, 241, 0.35);
          color: #6366f1;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
        }

        .toolbar-btn:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }

        .toolbar-sep {
          width: 1px;
          height: 22px;
          background: linear-gradient(to bottom, 
            transparent, 
            ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.1)'} 20%, 
            ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.1)'} 80%, 
            transparent
          );
          margin: 0 6px;
        }

        .toolbar-select {
          height: 34px;
          padding: 0 10px;
          font-size: 13px;
          font-weight: 600;
          background: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.02)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)'};
          border-radius: 8px;
          color: ${isDark ? '#f1f5f9' : '#0f172a'};
          cursor: pointer;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toolbar-select:hover:not(:disabled) {
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)'};
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.15)'};
          color: ${isDark ? '#ffffff' : '#000000'};
        }

        .toolbar-select:focus:not(:disabled) {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .toolbar-select:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }

        .toolbar-input {
          width: 200px;
          padding: 6px 12px;
          font-size: 13px;
          background: ${css.bg};
          border: 1px solid ${css.border};
          border-radius: 8px;
          color: ${css.text};
          outline: none;
          transition: all 0.2s;
        }

        .toolbar-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .toolbar-btn-set {
          padding: 6px 14px;
          font-size: 12px;
          background: ${css.accent};
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
        }

        .toolbar-btn-set:hover {
          background: ${isDark ? '#4f46e5' : '#4338ca'};
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
        }

        .toolbar-btn-cancel {
          padding: 6px 10px;
          font-size: 12px;
          background: transparent;
          color: ${css.muted};
          border: 1px solid ${css.border};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toolbar-btn-cancel:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          color: ${css.text};
        }

        .bubble-menu-container {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: ${isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.95)'};
          border-radius: 10px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .bubble-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
          outline: none;
        }

        .bubble-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .bubble-menu-btn.active {
          background: rgba(99, 102, 241, 0.3);
          border-color: rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
        }

        .full-editor-content .tiptap {
          outline: none;
        }
        .full-editor-content .tiptap p {
          margin: 0.75em 0;
        }
        .full-editor-content .tiptap h1 {
          font-size: 2em;
          font-weight: 800;
          margin: 1.2em 0 0.5em;
          line-height: 1.2;
        }
        .full-editor-content .tiptap h2 {
          font-size: 1.5em;
          font-weight: 700;
          margin: 1em 0 0.4em;
          line-height: 1.3;
        }
        .full-editor-content .tiptap h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.8em 0 0.3em;
          line-height: 1.4;
        }
        .full-editor-content .tiptap ul,
        .full-editor-content .tiptap ol {
          padding-left: 1.5em;
          margin: 0.75em 0;
        }
        .full-editor-content .tiptap li {
          margin: 0.25em 0;
        }
        .full-editor-content .tiptap blockquote {
          border-left: 3px solid ${css.accent};
          padding-left: 1em;
          margin: 1em 0;
          color: ${css.muted};
          font-style: italic;
        }
        .full-editor-content .tiptap pre {
          background: ${isDark ? '#000000' : '#f1f5f9'};
          border-radius: 8px;
          padding: 1em;
          overflow-x: auto;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.9em;
          margin: 1em 0;
        }
        .full-editor-content .tiptap code {
          background: ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'};
          color: ${css.accent};
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }
        .full-editor-content .tiptap pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        .full-editor-content .tiptap hr {
          border: none;
          border-top: 1px solid ${css.border};
          margin: 2em 0;
        }
        .full-editor-content .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        .full-editor-content .tiptap mark {
          background: #fef08a;
          padding: 1px 4px;
          border-radius: 3px;
        }
        .full-editor-content .tiptap table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }
        .full-editor-content .tiptap th,
        .full-editor-content .tiptap td {
          border: 1px solid ${css.border};
          padding: 8px 12px;
          text-align: left;
        }
        .full-editor-content .tiptap th {
          background: ${isDark ? '#1e293b' : '#f8fafc'};
          font-weight: 700;
        }
        .full-editor-content .tiptap details {
          background: ${isDark ? '#0f172a' : '#f8fafc'};
          border: 1px solid ${css.border};
          border-radius: 8px;
          padding: 12px 18px;
          margin: 1.5rem 0;
        }
        .full-editor-content .tiptap summary {
          font-weight: 700;
          cursor: pointer;
          outline: none;
        }
        .full-editor-content .tiptap .callout-box {
          background: rgba(99, 102, 241, 0.06);
          border-left: 4px solid ${css.accent};
          padding: 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
          margin: 1.5rem 0;
        }
        .full-editor-content .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: ${css.muted};
          pointer-events: none;
          height: 0;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
