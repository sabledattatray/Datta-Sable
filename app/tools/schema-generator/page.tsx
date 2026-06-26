'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  FileJson, 
  Copy, 
  Check, 
  ArrowLeft,
  Settings,
  Code,
  Globe,
  Database,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

const SCHEMA_TYPES = [
  { id: 'article', label: 'Article / Blog', icon: '📝' },
  { id: 'video', label: 'Video Object', icon: '🎬' },
  { id: 'product', label: 'Product', icon: '📦' },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: '📂' },
];

export default function SchemaForge() {
  const [type, setType] = useState('article');
  const [formData, setFormData] = useState<Record<string, string>>({
    title: '',
    description: '',
    url: '',
    author: 'Datta Sable',
    imageUrl: '',
    datePublished: new Date().toISOString().split('T')[0]
  });
  const [schema, setSchema] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const jsonLd: any = {
      "@context": "https://schema.org"
    };

    if (type === 'article') {
      jsonLd["@type"] = "Article";
      jsonLd["headline"] = formData.title || "Your Blog Title";
      jsonLd["description"] = formData.description || "Article description...";
      jsonLd["author"] = { "@type": "Person", "name": formData.author };
      jsonLd["url"] = formData.url;
      jsonLd["image"] = formData.imageUrl;
      jsonLd["datePublished"] = formData.datePublished;
    } else if (type === 'video') {
      jsonLd["@type"] = "VideoObject";
      jsonLd["name"] = formData.title || "Video Name";
      jsonLd["description"] = formData.description;
      jsonLd["thumbnailUrl"] = formData.imageUrl;
      jsonLd["uploadDate"] = formData.datePublished;
    } else if (type === 'product') {
      jsonLd["@type"] = "Product";
      jsonLd["name"] = formData.title;
      jsonLd["description"] = formData.description;
      jsonLd["image"] = formData.imageUrl;
    }

    setSchema(JSON.stringify(jsonLd, null, 2));
  }, [type, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${schema}\n</script>`);
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
                  <FileJson size={20} />
                </div>
                <div className="label-tech">TECHNICAL-SEO</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                JSON-LD Schema <span className="hero-title">Forge</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Generate high-fidelity structured data to boost Google search rich snippets. Supports Articles, Videos, and Products with surgical technical accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Configuration Panel */}
              <div className="flex flex-col gap-8">
                <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center gap-2 mb-8">
                    <Settings size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Schema_Configuration</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {SCHEMA_TYPES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setType(s.id)}
                        className={`flex items-center gap-3 p-4 border transition-all text-left ${type === s.id ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)]'}`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className={`text-[10px] mono font-bold uppercase ${type === s.id ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-[10px] mono uppercase text-[var(--muted)] block mb-2">Headline / Name</label>
                      <input 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] mono uppercase text-[var(--muted)] block mb-2">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] mono uppercase text-[var(--muted)] block mb-2">Image URL</label>
                      <input 
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Panel */}
              <div className="flex flex-col gap-6">
                <div className="card p-0 overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--accent)' }}>
                  <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
                    <div className="flex items-center gap-2">
                      <Code size={16} className="text-[var(--accent)]" />
                      <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">JSON-LD_Output</h4>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="text-[var(--accent)] hover:opacity-80 transition-all flex items-center gap-2 mono text-[10px]"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} COPY_SCRIPT_TAG
                    </button>
                  </div>
                  <pre className="p-6 h-[400px] overflow-y-auto mono text-xs leading-relaxed text-[var(--muted)] bg-transparent">
                    {schema}
                  </pre>
                </div>

                <div className="card p-6 border-dashed" style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={14} className="text-[var(--accent)]" />
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Rich_Snippet_Impact</h4>
                  </div>
                  <p className="text-[10px] mono text-[var(--muted)] leading-relaxed">
                    Structured data helps Google crawlers index your content with more context, often leading to visual enhancements (Rich Snippets) in search results which significantly improve Click-Through Rate.
                  </p>
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
            Schema Generator — Create JSON-LD Structured Data for Google Rich Results
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            The Schema Generator by Datta Sable creates valid JSON-LD structured data markup for SEO professionals, web developers, content managers, and bloggers who want their web pages to qualify for Google's rich results — including article star ratings, FAQ accordions, How-To cards, breadcrumbs, product prices, event listings, and local business panels in Google Search.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            Structured data (schema.org markup in JSON-LD format) is the primary signal Google uses to understand content type and decide whether to render rich results. Supported schema types include Article, BlogPosting, TechArticle, FAQPage, HowTo, SoftwareApplication, Product, LocalBusiness, Person, and BreadcrumbList — validated against Google's Rich Results Test standards.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Article / BlogPosting', desc: 'Structured data for blog posts and technical articles' },
              { label: 'FAQPage', desc: 'FAQ accordion schema that appears directly in Google search results' },
              { label: 'SoftwareApplication', desc: 'App schema with ratings, pricing, and platform details' },
              { label: 'LocalBusiness', desc: 'NAP (Name, Address, Phone) schema for local SEO visibility' },
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
