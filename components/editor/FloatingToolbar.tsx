import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon, Underline as UnderlineIcon, Highlighter, Palette, AlignLeft, AlignCenter, AlignRight, Superscript as SuperIcon, Subscript as SubIcon, Eraser } from 'lucide-react';
import { useState } from 'react';

interface FloatingToolbarProps {
  editor: Editor;
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [showColors, setShowColors] = useState(false);

  if (!editor) {
    return null;
  }

  const colors = ['#0f172a', '#c9f31d', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

  const Menu = BubbleMenu as any;

  return (
    <Menu editor={editor} tippyOptions={{ duration: 100, placement: 'top' }} className="flex flex-col gap-1 overflow-visible animate-in fade-in zoom-in-95 duration-100">
      {showColors && (
        <div className="flex gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl w-max relative z-50">
          {colors.map(c => (
            <button 
              key={c} 
              onClick={(e) => { e.preventDefault(); editor.chain().focus().setColor(c).run(); setShowColors(false); }}
              className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform" 
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          {colors.map(c => (
            <button 
              key={`bg-${c}`} 
              onClick={(e) => { e.preventDefault(); editor.chain().focus().setHighlight({ color: c }).run(); setShowColors(false); }}
              className="w-5 h-5 rounded border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform flex items-center justify-center text-[length:var(--text-small)] text-white"
              style={{ backgroundColor: c }}
            >
              H
            </button>
          ))}
        </div>
      )}

      <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl w-max items-center relative z-50">
        {/* Basic formatting */}
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('bold') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <Bold size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('italic') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <Italic size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('underline') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <UnderlineIcon size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('strike') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <Strikethrough size={15} />
        </button>
        
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Colors */}
        <button onClick={(e) => { e.preventDefault(); setShowColors(!showColors) }} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Palette size={15} />
        </button>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Alignment */}
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <AlignLeft size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <AlignCenter size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <AlignRight size={15} />
        </button>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Script & Code */}
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleSuperscript().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('superscript') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <SuperIcon size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleSubscript().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('subscript') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <SubIcon size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run() }} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('code') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
          <Code size={15} />
        </button>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Links & Clear */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
          className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${editor.isActive('link') ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <LinkIcon size={15} />
        </button>
        <button onClick={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().clearNodes().run() }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 hover:text-[var(--accent)] dark:hover:text-[var(--accent)]">
          <Eraser size={15} />
        </button>
      </div>
    </Menu>
  );
}
