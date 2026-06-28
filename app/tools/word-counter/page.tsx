'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Type, 
  Trash2, 
  ArrowLeft,
  Clock,
  BookOpen,
  BarChart,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const getStats = () => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(words / 225); // Average reading speed

    return { words, characters, charactersNoSpaces, sentences, readingTime };
  };

  const stats = getStats();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  <Type size={20} />
                </div>
                <div className="label-tech">CONTENT-ANALYSIS</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Precision Word <span className="hero-title">Counter</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Analyze your content with surgical detail. Track word counts, character density, and estimated reading time for professional editorial standards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor area */}
              <div className="lg:col-span-2">
                <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-[var(--accent)]" />
                      <span className="mono text-xs uppercase text-[var(--text)]">Editor_Draft</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={handleCopy} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors bg-transparent border-none cursor-pointer">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button onClick={() => setText('')} className="text-[var(--muted)] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your content here..."
                    className="w-full h-[500px] p-8 bg-transparent border-none outline-none text-theme font-sans resize-none"
                    style={{ lineHeight: 1.7, fontSize: '1.05rem' }}
                  />
                </div>
              </div>

              {/* Metrics sidebar */}
              <div className="flex flex-col gap-6">
                <div className="card p-8" style={{ background: 'var(--bg)', borderLeft: '2px solid var(--accent)' }}>
                  <div className="flex items-center gap-2 mb-8">
                    <BarChart size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Telemetry_Report</h4>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] mono">WORDS</span>
                      <span className="text-xl font-bold">{stats.words}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] mono">CHARACTERS</span>
                      <span className="text-xl font-bold">{stats.characters}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] mono">CHAR_NO_SPACE</span>
                      <span className="text-xl font-bold">{stats.charactersNoSpaces}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] mono">SENTENCES</span>
                      <span className="text-xl font-bold">{stats.sentences}</span>
                    </div>
                  </div>
                </div>

                <div className="card p-8" style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
                    <Clock size={16} />
                    <h4 className="mono text-xs uppercase tracking-widest">Read_Speed</h4>
                  </div>
                  <div className="text-3xl font-bold mb-2">~{stats.readingTime} <span className="text-xs mono font-normal text-[var(--muted)]">MIN</span></div>
                  <p className="text-xs mono text-[var(--muted)]" style={{ fontSize: '0.78rem' }}>Based on average reading speed of 225 words per minute.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          {"/* ── About This Tool Header ── */"}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.2 }}>
            Precision Word Counter & Content Density Analyzer
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }} className="font-sans">
            The Word Counter by Datta Sable is a professional-grade text analysis utility built for content developers, technical copywriters, SEO architects, and web publishers who require granular formatting metadata. It runs entirely client-side, ensuring data privacy and zero network delay while computing metrics like total word count, character footprint (with and without whitespace), sentence count, and reading duration.
          </p>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.5rem' }} className="font-sans">
            In modern SEO and digital publishing, text length and structure are critical factors for keyword relevance, readability, and user engagement. High-quality content must be written with the right density and length constraints to optimize search visibility without keyword stuffing. This counter serves as an immediate validator for metadata lengths, blog structures, and script drafts.
          </p>

          {"/* ── Core Features Grid ── */"}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>CORE_CAPABILITIES</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>LSI Keyword Balancing</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Helps keep track of text length so you can balance core topic coverage with semantic search terms.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Reading Pace Metrics</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Provides estimated reading times to help structure blog posts for optimal reader retention.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Metadata Constraints</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Perfect for checking title tags and meta descriptions against search engine characters limits.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Zero Server Tracking</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Data is processed entirely inside your local browser sandbox, providing absolute security for draft copy.</div>
            </div>
          </div>

          {"/* ── Deep Technical Sections ── */"}
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>SEO Content Architecture & Length Strategies</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              When writing for the web, structuring your content determines how Google's crawler interprets hierarchy. Begin with a single H1 tag, followed by a logical progression of H2 and H3 tags. Word count should follow the complexity of the topic. If you are writing a comprehensive tutorial, aim for 2,000+ words to ensure all user search intents are met. For a simple FAQ, 600 words with structured schemas is ideal. Always prioritize semantic completeness over arbitrary word goals.
            </p>
          </div>
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Topical Authority and GSC Benchmarks</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              Google Search Console (GSC) metrics show that pages with comprehensive coverage of a topic receive significantly more impressions and higher click-through rates (CTR). To build topical authority, group your articles into semantic clusters. Link short-form glossary entries back to long-form pillar articles. Use this word counter to verify that your pillar pages have the required depth (1,500+ words) to compete for high-volume keywords.
            </p>
          </div>

          {"/* ── Comprehensive FAQs ── */"}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: '4rem', marginBottom: '2rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q1:</span> Does content length directly affect Google rankings?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Google has repeatedly stated that word count is not a direct ranking factor. However, there is a strong correlation between long-form content (1,500 - 3,000 words) and higher search engine rankings. This is because longer articles tend to cover topics in greater depth, answer more user queries, and naturally incorporate a wider range of relevant LSI (Latent Semantic Indexing) keywords, building stronger topical authority.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q2:</span> What are the optimal word counts for different digital platforms?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                For standard SEO blog posts, aim for 1,500 to 2,500 words. For short news articles, 500 to 800 words is sufficient. LinkedIn posts perform best when they are concise and readable, usually between 100 and 300 words. Meta descriptions should stay under 150-160 characters (approximately 25 words) to avoid truncation on the search engine results page (SERP).
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q3:</span> How is the reading time metric calculated?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                The estimated reading time is calculated based on the average adult reading speed of 225 words per minute (WPM) for technical or business content. If your text contains highly complex formulas or code samples, the actual reading time may be higher, but this metric provides a solid baseline for editorial planning and user experience optimization.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q4:</span> What is keyword density and how do I prevent stuffing?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Keyword density represents the percentage of times a target keyword appears relative to the total word count. SEO best practices suggest maintaining a keyword density between 1% and 2%. Exceeding this range is considered keyword stuffing, which triggers search engine spam filters and harms rankings. Focus on writing natural, user-centric copy instead.
              </p>
            </div>
          </div>
        </div>
      </section>


      <Footer />

    </div>
  );
}
