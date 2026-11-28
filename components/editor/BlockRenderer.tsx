import { EditorBlock } from '@/store/editorStore';
import { MessageCircle, Globe, Link } from 'lucide-react';
import Image from 'next/image';
import { sanitizeHtml } from '@/lib/sanitize';


interface BlockRendererProps {
  blocks: EditorBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
      {blocks.map((block) => (
        <BlockNode key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockNode({ block }: { block: EditorBlock }) {
  const { type, content } = block;
  const metadata = (block.metadata || {}) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  // Apply contextual styling
  const customStyles: React.CSSProperties = {
    padding: metadata?.padding ? `${metadata.padding}rem` : undefined,
  };
  
  const widthClass = metadata?.width === 'full' ? 'w-full max-w-none' : metadata?.width === 'wide' ? 'max-w-5xl -mx-12' : 'max-w-3xl mx-auto';
  const customClass = metadata?.cssClass || '';
  const alignmentClass = metadata?.align ? `text-${metadata.align}` : '';

  const wrapperClass = `w-full transition-all ${widthClass} ${customClass} ${alignmentClass}`;

  switch (type) {
    case 'image':
      if (!metadata?.url) return null;
      return (
        <div className={wrapperClass} style={{ ...customStyles, position: 'relative', height: '400px' }}>
          <Image 
            src={metadata.url} 
            alt="Post image" 
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-2xl shadow-lg" 
          />
        </div>

      );

    case 'video':
      if (!metadata?.url) return null;
      return (
        <div className={`${wrapperClass} aspect-video`} style={customStyles}>
          <iframe 
            src={metadata.url} 
            className="w-full h-full border-none rounded-2xl shadow-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case 'divider':
      return (
        <div className={`${wrapperClass} py-4`} style={customStyles}>
          <hr className="border-t-2 border-slate-200/60" />
        </div>
      );

    case 'callout':
      const themes = {
        info: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-100',
        warning: 'bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/40 text-yellow-900 dark:text-yellow-100',
        tip: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100',
      };
      const t = themes[(metadata?.theme as keyof typeof themes) || 'info'];
      return (
        <div className={`${wrapperClass} p-6 rounded-2xl border ${t}`} style={customStyles}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed" />
        </div>
      );

    case 'button':
      if (!metadata?.label) return null;
      return (
        <div className={`${wrapperClass} flex`} style={customStyles}>
          <a 
            href={metadata.url || '#'}
            target="_blank"
            rel="noreferrer"
            className={`
              inline-block px-8 py-3.5 font-semibold text-center transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5
              ${metadata.style === 'primary' || !metadata.style ? 'bg-slate-900 text-white rounded-xl' : ''}
              ${metadata.style === 'outline' ? 'bg-transparent border-2 border-slate-900 text-slate-900 rounded-xl' : ''}
              ${metadata.style === 'subtle' ? 'bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200' : ''}
            `}
          >
            {metadata.label}
          </a>
        </div>
      );

    case 'table':
      const rows = metadata?.rows || [];
      if (rows.length === 0) return null;
      return (
        <div className={`${wrapperClass} overflow-x-auto`} style={customStyles}>
          <table className="w-full border-collapse border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
            <tbody>
              {rows.map((row: string[], rIdx: number) => (
                <tr key={rIdx}>
                  {row.map((cell: string, cIdx: number) => (
                    <td key={cIdx} className={`border border-slate-200 p-4 ${rIdx === 0 ? 'bg-slate-50 font-bold text-slate-800' : 'text-slate-600'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'html':
      if (!metadata?.html) return null;
      return (
        <div className={wrapperClass} style={customStyles} dangerouslySetInnerHTML={{ __html: sanitizeHtml(metadata.html) }} />
      );

    case 'embed':
      if (!metadata?.url) return null;
      return (
        <div className={`${wrapperClass} flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl`} style={customStyles}>
          <div className="flex items-center gap-3 mb-2 text-slate-700 font-bold">
            {metadata.platform === 'twitter' && <MessageCircle className="text-blue-400" />}
            {metadata.platform === 'linkedin' && <Link className="text-blue-700" />}
            {metadata.platform === 'github' && <Globe className="text-slate-900" />}
            <span className="capitalize">{metadata.platform} Embed Placeholder</span>
          </div>
          <a href={metadata.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
            {metadata.url}
          </a>
          <p className="text-xs text-slate-400 mt-2">Open graph preview would be generated here</p>
        </div>
      );

    case 'gallery':
      const images = metadata?.images || [];
      if (images.length === 0) return null;
      return (
        <div className={`${wrapperClass} grid grid-cols-2 md:grid-cols-3 gap-4`} style={customStyles}>
          {images.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Image 
                src={img} 
                alt={`Gallery ${idx + 1}`} 
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>

      );

    case 'paragraph':
    case 'heading':
    case 'list':
    case 'quote':
    case 'code':
    default:
      // Text-based blocks handled via generic HTML injection with Tailwind Typography
      return (
        <div className={wrapperClass} style={customStyles}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl" />
        </div>
      );
  }
}
