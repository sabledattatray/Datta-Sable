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
                      <span className="mono text-[10px] uppercase text-[var(--text)]">Editor_Draft</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={handleCopy} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button onClick={() => setText('')} className="text-[var(--muted)] hover:text-red-500 transition-colors">
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
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Telemetry_Report</h4>
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
                    <h4 className="mono text-[10px] uppercase tracking-widest">Read_Speed</h4>
                  </div>
                  <div className="text-3xl font-bold mb-2">~{stats.readingTime} <span className="text-xs mono font-normal text-[var(--muted)]">MIN</span></div>
                  <p className="text-[10px] mono text-[var(--muted)]">Based on average reading speed of 225 words per minute.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <div className="container" style={{ maxWidth: '860px', padding: '4rem 1.5rem' }}>
          <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', fontSize: '0.65rem' }}>ABOUT_THIS_TOOL</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Free Online Word Counter &amp; Text Analyzer</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            The Word Counter tool by Datta Sable is a free, instant text analysis utility for content creators, bloggers, SEO professionals, students, and technical writers. Paste or type any text to instantly see your word count, character count (with and without spaces), sentence count, and estimated reading time — all calculated in real time without sending your data to any server.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Whether you are writing a LinkedIn post (optimal length: 150–300 words), a blog article (1,500–2,500 words for SEO), a college essay with a strict word limit, or a technical specification document, this tool gives you immediate feedback on your content length and readability metrics.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { label: 'Word Count', desc: 'Accurate real-time word count for any length of text' },
              { label: 'Character Count', desc: 'Total characters with and without spaces' },
              { label: 'Sentence Count', desc: 'Counts full stops, exclamation marks, and question marks' },
              { label: 'Reading Time', desc: 'Estimated at 225 words per minute (average adult reading speed)' },
            ].map(f => (
              <div key={f.label} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{f.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
