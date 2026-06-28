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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="flex flex-col gap-8">
                <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center gap-2 mb-8">
                    <Settings size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Schema_Configuration</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {SCHEMA_TYPES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setType(s.id)}
                        className={`flex items-center gap-3 p-4 border transition-all text-left cursor-pointer rounded-sm ${type === s.id ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className={`text-xs font-mono font-bold uppercase ${type === s.id ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-xs mono uppercase text-[var(--muted)] block mb-2">Headline / Name</label>
                      <input 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs mono uppercase text-[var(--muted)] block mb-2">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded text-sm focus:border-[var(--accent)] outline-none h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs mono uppercase text-[var(--muted)] block mb-2">Image URL</label>
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
                      <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">JSON-LD_Output</h4>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="text-[var(--accent)] hover:opacity-80 transition-all flex items-center gap-2 mono text-xs"
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
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Rich_Snippet_Impact</h4>
                  </div>
                  <p className="text-xs mono text-[var(--muted)] leading-relaxed">
                    Structured data helps Google crawlers index your content with more context, often leading to visual enhancements (Rich Snippets) in search results which significantly improve Click-Through Rate.
                  </p>
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
            Schema Generator — JSON-LD Structured Data Builder
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }} className="font-sans">
            The Schema Generator by Datta Sable is a technical SEO utility designed to generate valid, structured data markup in JSON-LD format. It supports Article, VideoObject, and Product schemas, creating compliant script blocks that can be pasted directly into Next.js, HTML headers, or CMS databases to qualify for Google Rich Results.
          </p>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.5rem' }} className="font-sans">
            Search engines use schema.org vocabulary to understand the entities, relationships, and context of your web pages. Implementing correct JSON-LD schemas does not improve rankings directly, but it enables Google to display visual enhancements (Rich Snippets) like star ratings, review cards, FAQ accordions, and breadcrumbs on the search page, boosting click-through rates (CTR) by up to 30%.
          </p>

          {"/* ── Core Features Grid ── */"}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>CORE_CAPABILITIES</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Standard Compliant</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Generates schema objects that match schema.org and Google's official developer specifications.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Pre-formatted Blocks</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Outputs complete `&lt;script type="application/ld+json"&gt;` blocks ready for copy-pasting.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Responsive Setup</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Updates schemas instantly as you type data, minimizing errors and syntax typos.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Dynamic Schema Support</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Enables creation of Article, Product, and VideoObject schemas from a single UI.</div>
            </div>
          </div>

          {"/* ── Deep Technical Sections ── */"}
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Entity SEO & Semantic Web Architectures</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              Modern search engine optimization has shifted from keyword matching to entity relationships. Google builds a Knowledge Graph to map entities (people, places, concepts, organizations). Schema markup serves as the metadata that explicitly defines these entities and their properties (e.g., who wrote an article, what organization published it, when it was updated). By providing this data, you make it easier for search algorithms to crawl, index, and match your pages with complex queries.
            </p>
          </div>
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Avoiding Schema Spam and Penalties</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              Google has strict guidelines regarding structured data. Never generate schema markup for content that is not visible to the user on the page. Generating product reviews for non-existent items or FAQ schemas that do not match the visible text is considered schema spam. If detected, Google may issue a manual action penalty, removing all rich results from your domain and de-indexing your pages.
            </p>
          </div>

          {"/* ── Comprehensive FAQs ── */"}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: '4rem', marginBottom: '2rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q1:</span> What is JSON-LD and why does Google prefer it?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                JSON-LD (JavaScript Object Notation for Linked Data) is a lightweight format for structuring data. Google recommends JSON-LD because it can be injected dynamically into the page headers or body without altering the user-visible HTML markup, unlike legacy microdata or RDFa formats.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q2:</span> How do I verify that my generated schema is correct?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Copy the generated script block and paste it into Google's official Rich Results Test or the Schema Markup Validator. These tools will flag any missing required properties (such as author fields or publication dates) and confirm if your page qualifies for rich search results.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q3:</span> Will schema markup guarantee Rich Snippets on Google?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                No. Implementing correct schema markup is a prerequisite, but Google's algorithms ultimately decide whether to render Rich Snippets based on factors like site authority, user search intent, query context, and overall page quality.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q4:</span> How do I implement JSON-LD dynamically in Next.js?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                In Next.js, you can inject JSON-LD by rendering a script tag inside your layout or page file: `&lt;script type="application/ld+json" dangerouslySetInnerHTML={'{'}{'{'} __html: JSON.stringify(schemaObj) {'}'}{'}'} /&gt;`. This ensures the structured data is pre-rendered on the server and indexed by search bots.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
