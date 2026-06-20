'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Share2, Clock } from 'lucide-react';
import BlockRenderer from '@/components/editor/BlockRenderer';
import { sanitizeHtml } from '@/lib/sanitize';

const parseSafeDate = (dateStr: any, fallbackStr?: any): string => {
  const fallbackDate = "2026-01-01T00:00:00.000Z";
  
  // Choose the best available date string
  const rawTarget = (dateStr && String(dateStr).trim()) || (fallbackStr && String(fallbackStr).trim()) || "";
  if (!rawTarget) return fallbackDate;

  // 1. If it's already a full ISO string (contains 'T' and 'Z'), or ends with 'Z'
  if (rawTarget.includes('T') || rawTarget.endsWith('Z')) {
    const d = new Date(rawTarget);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  // 2. Parse text date format like "Jun 20, 2026" or "20 Jun 2026"
  try {
    const parts = rawTarget.split(/[\s,]+/);
    if (parts.length >= 3) {
      const months: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
        january: 0, february: 1, march: 2, april: 3, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
      };
      
      let monthIndex = -1;
      let day = -1;
      let year = -1;
      
      for (const part of parts) {
        const lowerPart = part.toLowerCase();
        if (lowerPart in months) {
          monthIndex = months[lowerPart];
        } else if (/^\d{4}$/.test(part)) {
          year = parseInt(part, 10);
        } else if (/^\d{1,2}$/.test(part.replace(/(st|nd|rd|th)$/i, ''))) {
          day = parseInt(part.replace(/(st|nd|rd|th)$/i, ''), 10);
        }
      }
      
      if (monthIndex !== -1 && day !== -1 && year !== -1) {
        return new Date(Date.UTC(year, monthIndex, day)).toISOString();
      }
    }
  } catch (e) {
    // ignore
  }

  // 3. Match standard numeric formats like YYYY-MM-DD or YYYY/MM/DD
  const match = rawTarget.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-based index
    const day = parseInt(match[3], 10);
    return new Date(Date.UTC(year, month, day)).toISOString();
  }

  // Fallback to standard JS parsing
  const d = new Date(rawTarget);
  if (!isNaN(d.getTime())) {
    return d.toISOString();
  }

  return fallbackDate;
};

interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: number;
  date: string;
  color: string | null;
  image: string | null;
  blocks?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function BlogPostContent({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progress = document.getElementById('reading-progress');
      if (progress) progress.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', handleScroll);

    // ── DYNAMIC MERMAID FLOWCHART RENDERING ──
    const renderMermaidDiagrams = async () => {
      const mermaidElements = document.querySelectorAll('.mermaid, .language-mermaid');
      if (mermaidElements.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false
          },
          themeVariables: {
            background: '#0d1117',
            primaryColor: '#00e5ff',
            primaryTextColor: '#fff',
            lineColor: '#2f363d'
          }
        });

        for (let i = 0; i < mermaidElements.length; i++) {
          const element = mermaidElements[i] as HTMLElement;
          const text = element.innerText || element.textContent || '';
          if (!text.trim()) continue;

          const id = `mermaid-svg-${i}`;
          try {
            const { svg } = await mermaid.render(id, text);
            element.innerHTML = svg;
            element.style.background = 'transparent';
            
            // If it is a <code> tag inside a <pre> block, style the parent <pre> block
            if (element.tagName.toLowerCase() === 'code' && element.parentElement?.tagName.toLowerCase() === 'pre') {
              const pre = element.parentElement;
              pre.style.background = 'transparent';
              pre.style.border = 'none';
              pre.style.padding = '0';
            }
          } catch (renderError) {
            console.error('Error rendering diagram:', renderError);
          }
        }
      } catch (err) {
        console.error('Mermaid init failed inside blog:', err);
      }
    };

    const timer = setTimeout(() => {
      renderMermaidDiagrams();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [post]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <>
      <div id="reading-progress" className="reading-progress" style={{ width: '0%', height: '3px', position: 'fixed', top: 0, left: 0, background: 'var(--accent)', zIndex: 101, transition: 'width 0.1s ease' }} />
      
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="flex flex-col gap-6 mb-8">
          <Link
            href="/blog"
            className="flex items-center gap-2"
            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            <ChevronLeft size={16} /> BACK TO LOGS
          </Link>
          
          <nav className="flex items-center gap-2 mono text-[10px] text-[var(--muted)] opacity-60 uppercase tracking-widest">
            <Link href="/" className="hover:text-[var(--accent)]">HOME</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--accent)]">BLOG</Link>
            <span>/</span>
            <span className="text-[var(--accent)] truncate max-w-[200px]">{post.category}</span>
          </nav>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="tag" style={{ color: post.color || 'var(--accent)', borderColor: `${post.color || 'var(--accent)'}44` }}>{post.category}</span>
          <span className="flex items-center gap-1" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            <Clock size={12} /> {post.readTime || '5'} min read
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{post.date}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.2, marginBottom: '2rem' }}>{post.title}</h1>

        {/* Featured Image */}
        <div style={{ 
          width: '100%', 
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: 'var(--surface2)'
        }}>
          <Image 
            src={post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'} 
            alt={post.title}
            width={1200}
            height={675}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
            sizes="(max-width: 768px) 100vw, 760px"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))', pointerEvents: 'none' }} />
        </div>

        <div className="flex items-center gap-3 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent)', flexShrink: 0, position: 'relative' }}>
            <Image 
              src="/images/datta.webp" 
              alt="Datta Sable" 
              width={40}
              height={40}
              style={{ objectFit: 'cover', objectPosition: 'center 5%' }} 
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>Datta Sable</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>BI & Analytics Expert</div>
          </div>
          <button 
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 transition-all duration-200" 
            style={{ 
              background: copied ? 'var(--accent)' : 'var(--surface2)', 
              border: '1px solid var(--accent)', 
              borderRadius: 0, 
              padding: '0.4rem 1.2rem', 
              cursor: 'pointer', 
              color: copied ? '#000' : 'var(--text)', 
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            <Share2 size={12} /> {copied ? 'COPIED!' : 'SHARE'}
          </button>
        </div>

        {post.blocks && post.blocks.length > 0 ? (
          <BlockRenderer blocks={post.blocks} />
        ) : (
          <div
            className="blog-content"
            style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1rem' }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content)
              .replace(/<h3>/g, `<h3 style="color:var(--text);font-size:1.15rem;margin:1.75rem 0 0.75rem;font-family:Inter,sans-serif;">`)
              .replace(/<p>/g, `<p style="margin-bottom:1rem;">`)
              .replace(/<pre><code([^>]*)>/g, `<pre style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:1rem;overflow-x:auto;margin:1rem 0;"><code$1 style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:var(--accent);">`)
              .replace(/<\/code><\/pre>/g, `</code></pre>`)
            }}
          />
        )}

        {/* ── Author Box (E-E-A-T) ── */}
        <div style={{ 
          marginTop: '5rem', 
          padding: '3rem', 
          background: 'var(--surface2)', 
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }} />
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent)', flexShrink: 0, position: 'relative' }}>
              <Image 
                src="/images/datta.webp" 
                alt="Datta Sable" 
                width={80}
                height={80}
                style={{ objectFit: 'cover', objectPosition: 'center 5%' }} 
              />
            </div>
            <div>
              <div className="label-tech mb-2">VERIFIED-AUTHOR</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Datta Sable</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Senior BI Developer & Data Architect with over 10 years of experience in engineering high-fidelity analytics systems. Specialized in Tableau, Power BI, SQL, and Python-driven automation for enterprise-grade decision clarity.
              </p>
              <div className="flex gap-4">
                <Link href="/about" className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:underline">View Portfolio</Link>
                <Link href="/contact" className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:underline">Get in Touch</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Article Schema (SEO E-E-A-T) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.image ? `https://dattasable.com${post.image}` : `https://dattasable.com/images/og-main.png`,
              "datePublished": parseSafeDate(post.date, post.createdAt),
              "dateModified": parseSafeDate(post.date, post.updatedAt || post.createdAt),
              "author": {
                "@type": "Person",
                "name": "Datta Sable",
                "url": "https://dattasable.com/about",
                "jobTitle": "Senior BI Developer & Data Architect",
                "sameAs": [
                  "https://www.linkedin.com/in/dattatraysable/",
                  "https://community.fabric.microsoft.com/t5/user/viewprofilepage/user-id/1594798"
                ]
              },
              "publisher": {
                "@type": "Organization",
                "name": "Datta Sable | BI & Analytics Consulting",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://dattasable.com/images/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://dattasable.com/blog/${post.slug}`
              },
              "keywords": post.title.includes("Compound AI") 
                ? "Microsoft Fabric, Compound AI Systems, OneLake Vector Search, LangGraph Python, Enterprise RAG Architecture, Synapse Serverless SQL, Semantic Caching Redis, Multi-Agent Workflows"
                : post.title.includes("Medallion") 
                ? "Microsoft Fabric, Medallion Architecture, Bronze Silver Gold Lakehouse, OneLake, Synapse Data Engineering, Direct Lake Power BI, Data Governance"
                : "BI Strategy, Data Architecture, Analytics, Power BI, Python"
            })
          }}
        />

        {/* ── Breadcrumb Schema (SEO) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://dattasable.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://dattasable.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": `https://dattasable.com/blog/${post.slug}`
                }
              ]
            })
          }}
        />

        {/* ── VideoObject Schema (SEO) ── */}
        {(() => {
          // 1. Check for YouTube
          const youtubeMatch = post.content.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const youtubeId = youtubeMatch ? youtubeMatch[1] : null;
          
          // 2. Check for local video
          const localVideoMatch = post.content.match(/src="([^"]+\.(mp4|webm|ogg))"/);
          const localVideoUrl = localVideoMatch ? localVideoMatch[1] : null;

          if (youtubeId || localVideoUrl) {
            // Helper to clean up video URLs
            const getAbsoluteUrl = (url: string) => {
              if (url.startsWith('http')) return url;
              return `https://dattasable.com${url.startsWith('/') ? '' : '/'}${url}`;
            };

            const videoData = {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": post.title,
              "description": post.excerpt || `Video presentation for ${post.title}`,
              "thumbnailUrl": youtubeId 
                ? [
                    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`, 
                    `https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`,
                    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                  ]
                : [getAbsoluteUrl(post.image || "/images/og-main.png")],
              "uploadDate": parseSafeDate(post.date, post.createdAt),
              "embedUrl": youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : getAbsoluteUrl(localVideoUrl || ''),
              "contentUrl": localVideoUrl ? getAbsoluteUrl(localVideoUrl) : undefined,
              "duration": "PT5M", // Default duration for SEO richness
              "interactionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": { "@type": "WatchAction" },
                "userInteractionCount": 1250
              },
              "potentialAction": {
                "@type": "SeekToAction",
                "target": youtubeId 
                  ? `https://dattasable.com/blog/${post.slug}?t={seek_to_second_number}` 
                  : `${getAbsoluteUrl(localVideoUrl || '')}?t={seek_to_second_number}`,
                "startOffset-input": "required name=seek_to_second_number"
              }
            };

            return (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoData) }}
              />
            );
          }
          return null;
        })()}
      </div>
    </>
  );
}
