'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Copy, 
  Check, 
  Search, 
  Trash2, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Code,
  Eye,
  AlertCircle,
  Minimize2
} from 'lucide-react';
import Link from 'next/link';

import { useSurgicalPersistence } from '@/lib/hooks/useSurgicalPersistence';
import { useRouter } from 'next/navigation';

export default function SEOMetaGenerator() {
  const router = useRouter();
  const [title, setTitle] = useSurgicalPersistence('seo-title', '');
  const [description, setDescription] = useSurgicalPersistence('seo-description', '');
  const [keywords, setKeywords] = useSurgicalPersistence('seo-keywords', '');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Save global state for workspace
  const [_, setGlobalState] = useSurgicalPersistence('seo-meta', { title: '', description: '' });

  useEffect(() => {
    setGlobalState({ title, description });
  }, [title, description]);

  const shipToLinkedIn = () => {
    // Set the LinkedIn draft state directly
    localStorage.setItem('surgical_linkedin-draft-text', JSON.stringify(title));
    router.push('/tools/linkedin-formatter');
  };

  const [schema, setSchema] = useState('');

  // Auto-generate Schema when inputs change
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title || "Page Title",
      "description": description || "Page Description",
      "author": {
        "@type": "Person",
        "name": "Datta Sable"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Datta Sable",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dattasable.com/logo.webp"
        }
      },
      "datePublished": new Date().toISOString()
    };
    setSchema(JSON.stringify(jsonLd, null, 2));
  }, [title, description]);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const clearAll = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/tools" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_HUB
            </Link>

            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <Search size={20} />
                </div>
                <div className="label-tech">SEO-ORCHESTRATION</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Meta-Force SEO <span className="hero-title">Generator</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Generate professional-grade metadata and JSON-LD schema for your blog posts. Optimized for Google Search Console and maximum Click-Through Rate (CTR).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="flex flex-col gap-8">
                <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Input_Parameters</h4>
                    <button onClick={clearAll} className="text-[var(--muted)] hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs mono uppercase text-[var(--muted)]">Page_Title</label>
                        <span className={`text-xs mono ${title.length > 60 ? 'text-red-400' : 'text-[var(--accent)]'}`}>
                          {title.length}/60
                        </span>
                      </div>
                      <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. How to Improve Website Performance"
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs mono uppercase text-[var(--muted)]">Meta_Description</label>
                        <span className={`text-xs mono ${description.length > 160 ? 'text-red-400' : 'text-[var(--accent)]'}`}>
                          {description.length}/160
                        </span>
                      </div>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a compelling summary of your content..."
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none transition-all h-24 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs mono uppercase text-[var(--muted)] block mb-2">Target_Keywords</label>
                      <input 
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. SEO, Performance, Next.js"
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Audit Panel */}
                <div className="card p-6 border-dashed" style={{ background: 'var(--bg)' }}>
                  <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Surgical_Audit</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      {title.length >= 40 && title.length <= 60 ? <Check size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                      <span className={title.length >= 40 && title.length <= 60 ? 'text-[var(--text)]' : 'text-[var(--muted)]'}>Title Length (40-60)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {description.length >= 120 && description.length <= 160 ? <Check size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                      <span className={description.length >= 120 && description.length <= 160 ? 'text-[var(--text)]' : 'text-[var(--muted)]'}>Description Length (120-160)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Panel */}
              <div className="flex flex-col gap-6">
                <div className="card p-8" style={{ background: 'var(--surface2)', borderLeft: '2px solid var(--accent)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-[var(--accent)]" />
                      <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Google_Preview</h4>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--bg)] rounded border border-[var(--border)]">
                    <div className="text-[#8ab4f8] text-lg mb-1 hover:underline cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                      {title || 'Example Page Title | Datta Sable'}
                    </div>
                    <div className="text-[#34a853] text-sm mb-2">
                      https://dattasable.com › ...
                    </div>
                    <div className="text-[#bdc1c6] text-sm leading-relaxed line-clamp-2">
                      {description || 'This is how your description will appear in Google search results. Make it compelling to increase your click-through rate.'}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={shipToLinkedIn}
                      className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-xs mono tracking-widest group"
                    >
                      SHIP_TO_LINKEDIN_FORMATTER <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.setItem('surgical_context-optimizer-input', JSON.stringify(title));
                        router.push('/tools/context-optimizer');
                      }}
                      className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-xs mono tracking-widest group mt-3"
                    >
                      CONDENSE_FOR_AI <Minimize2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Code size={16} className="text-[var(--accent)]" />
                      <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">JSON-LD_Schema</h4>
                    </div>
                    <button 
                      onClick={() => handleCopy(schema, 'schema')}
                      className="text-[var(--accent)] hover:opacity-80 transition-all"
                    >
                      {copiedType === 'schema' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="p-4 bg-[var(--bg)] rounded border border-[var(--border)] overflow-x-auto text-xs mono text-[var(--muted)] leading-relaxed h-48">
                    {schema}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.25 }}>
            SEO Meta Generator — Write Title Tags and Meta Descriptions That Rank
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            The SEO Meta Generator is a free tool for bloggers, digital marketers, SEO specialists, and web developers who need to write optimized title tags and meta descriptions at scale. Enter your page topic, primary keyword, target audience, and tone, and the generator produces multiple variants — each validated against Google's character limits (title: 50–60 characters, meta description: 150–160 characters) and click-through-rate best practices.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            A well-crafted title tag is the single most important on-page SEO element. It determines your click-through rate in search results, signals your primary keyword to Google's algorithm, and sets user expectations before they land on your page. This generator applies proven copywriting formulas — including question-based hooks, number-driven titles, and benefit-first meta descriptions — to produce variants you can A/B test in Google Search Console.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Character Counter', desc: 'Live character count with green/amber/red status for both fields' },
              { label: 'Keyword Integration', desc: 'Primary keyword placed in the optimal position for ranking' },
              { label: 'CTR Optimization', desc: 'Applies power words, numbers, and emotional triggers that boost clicks' },
              { label: 'Multiple Variants', desc: 'Generates several alternatives so you can pick the strongest option' },
            ].map(f => (
              <div key={f.label} style={{ padding: '1.25rem 1.5rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', minWidth: 0 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.82rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{f.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
