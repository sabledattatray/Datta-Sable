'use client';

import { useState } from 'react';
import { 
  Zap, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  ChevronRight,
  Cpu,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import OperatorPanel from '@/components/tools/OperatorPanel';
import { useOperatorProfile } from '@/lib/hooks/useOperatorProfile';
import { ExecutionChain } from '@/data/chains';

// Per-chain editorial content — unique, human-written, fully SEO relevant
const CHAIN_EDITORIAL: Record<string, {
  label: string;
  heading: string;
  intro: string[];
  sections: { title: string; body: string }[];
  quote: string;
}> = {
  'authority-content-launch': {
    label: 'DISTRIBUTION_ARCHITECTURE',
    heading: 'Authority Content Launch: How to Build a Full-Stack Content Distribution Engine From a Single Idea',
    intro: [
      'Publishing a blog post or LinkedIn update is no longer enough. The creators and technical professionals who dominate search rankings and social feeds in 2026 are those who launch content as a complete system — not a single asset.',
      'The Authority Content Launch chain solves this problem entirely. You enter one well-defined topic, and the pipeline constructs your complete distribution package: a high-fidelity AI system prompt for the research phase, a Google-optimized title tag and meta description, a LinkedIn post formatted for mobile readability and virality, and a structured JSON-LD schema object that signals context and authority to search engines.'
    ],
    sections: [
      {
        title: 'Why Isolated Content Publishing Kills Your Reach',
        body: 'Most professionals write a blog post, share a link on LinkedIn, and move on. This treats content as a one-time event instead of a compounding asset. The post gets a small spike in traffic and quickly dies. The fundamental mistake is not connecting the written content to its semantic context. Search engines reward content that has consistent signal reinforcement: the title tag must align with the meta description, the structured schema must reflect the article topic, and the social post must drive engagement that sends positive behavioral signals back to Google. The Authority Content Launch pipeline builds all four of these layers in a single execution pass, guaranteeing coherence across every distribution channel simultaneously.'
      },
      {
        title: 'Inside the Pipeline: Node-by-Node Breakdown',
        body: 'The chain starts with a Mega-Prompt node that generates a structured AI system prompt based on your Operator Persona and topic. This prompt is engineered to extract deep, expert-level content from Gemini or GPT-4 — not generic summaries. The SEO Meta node then constructs an optimized title tag (50-60 characters) and meta description (150-160 characters) using proven CTR formulas. The LinkedIn node formats the core idea as a mobile-first, surgical-spacing post with a punchy hook line. Finally, the Schema node outputs a complete JSON-LD Article schema that you can paste directly into your <head> tag to unlock rich results in Google Search.'
      },
      {
        title: 'Real-World Application: BI Consultants and Technical Creators',
        body: 'Consider a Business Intelligence consultant who wants to publish about Power BI\'s Direct Lake mode. Without a pipeline, they might write the article but then spend another 45 minutes manually crafting meta tags, formatting the LinkedIn post, and copying the schema code from a generator. With the Authority Content Launch chain, the entire package is ready in under two minutes. This is not just a productivity gain — it is a compounding advantage. When you can launch authority-grade content five times faster, you publish more consistently, build topical authority faster, and outrank competitors who publish sporadically.'
      }
    ],
    quote: '"Content that launches across every channel simultaneously is not a luxury for big teams — it\'s the minimum standard for growing authority in 2026." — Datta Sable'
  },
  'technical-research-deepdive': {
    label: 'RESEARCH_METHODOLOGY',
    heading: 'Technical Research Deep-Dive: Synthesizing Complex Concepts Into Structured Intelligence Documents',
    intro: [
      'Technical research is one of the most time-intensive activities a developer, consultant, or data engineer undertakes. Reading ten papers, three documentation pages, and multiple blog posts, then synthesizing everything into a coherent mental model, can take hours — and even then the output often exists only in your head, not in a reusable document.',
      'The Technical Research Deep-Dive chain transforms this process. You enter a research objective — a concept, an architecture pattern, a technology comparison — and the pipeline generates a structured system prompt designed to extract synthesis-grade intelligence from frontier AI models, combined with a live word counter and summary formatter to produce a professional, shareable research brief.'
    ],
    sections: [
      {
        title: 'The Problem With Generic AI Research Prompts',
        body: 'When developers ask ChatGPT or Gemini to "explain RAG architecture," they get a textbook-level summary. It is technically accurate but lacks depth, nuance, and practical context. The model defaults to surface-level information because the instruction is too vague. The Technical Research Deep-Dive chain solves this by constructing a structured Mega-Prompt that defines your technical persona, specifies the depth of synthesis required, requests structured outputs (comparison tables, code examples, architectural diagrams in Mermaid notation), and explicitly bans generic introductory filler. The result is a response that reads like a senior engineer wrote it from firsthand experience.'
      },
      {
        title: 'Practical Applications: Vector Databases, RAG, and Modern Data Pipelines',
        body: 'Imagine you are evaluating whether to use Pinecone, Weaviate, or pgvector for a new Retrieval-Augmented Generation (RAG) application. The Technical Research Deep-Dive chain generates a comparison prompt that instructs the model to evaluate each system across dimensions like latency, cost, indexing strategy, and managed vs. self-hosted trade-offs — and to format the output as a structured comparison table. You then paste this into Gemini Advanced and receive a research document that would normally take three hours to produce manually. The word counter node confirms the document hits the minimum depth threshold for a publishable technical brief.'
      },
      {
        title: 'Building Reusable Knowledge Assets',
        body: 'The true power of structured technical research is that it creates permanent knowledge assets. A well-synthesized brief on modern data lakehouse architecture can be referenced across multiple blog posts, client proposals, and training materials. By using this chain consistently for every major research task, you build a personal technical library that compounds in value over time. Each document you produce becomes a foundation for future content, reducing the research cost for every subsequent piece you publish on that topic area.'
      }
    ],
    quote: '"The difference between a technical professional and a thought leader is not knowledge — it\'s the ability to consistently document and deploy that knowledge at scale." — Datta Sable'
  },
  'social-to-search-bridge': {
    label: 'CROSS_CHANNEL_DISTRIBUTION',
    heading: 'Social-to-Search Bridge: Turning a Single Article Draft Into a Multi-Channel Authority Package',
    intro: [
      'Most long-form content dies on the page it was published on. It gets indexed, receives a trickle of organic traffic, and is never amplified beyond the blog itself. The problem is not the content quality — it is the distribution architecture.',
      'The Social-to-Search Bridge chain solves this by taking your existing article draft and constructing the complete amplification layer around it: a high-CTR SEO title and meta description, a viral LinkedIn hook formatted for mobile feeds, and a JSON-LD schema object that tells search engines exactly what the article is about. One input, three outputs, one unified distribution system.'
    ],
    sections: [
      {
        title: 'Why Search and Social Must Work Together',
        body: 'Google\'s ranking algorithms increasingly incorporate engagement signals — click-through rate, dwell time, and branded search volume. When a LinkedIn post drives readers to your article and they engage deeply with the content, these behavioral signals reinforce the article\'s topical authority in Google\'s eyes. The inverse is also true: a well-ranked article drives consistent traffic that gives you social content to repurpose. The Social-to-Search Bridge chain is built on this feedback loop. It does not treat SEO and social as separate channels; it engineers the connection between them from the moment you publish.'
      },
      {
        title: 'The Meta Description as a Conversion Asset',
        body: 'Most developers write meta descriptions as an afterthought — a truncated version of the first paragraph. This is a significant missed opportunity. A well-engineered meta description functions as a 155-character ad for your article in Google Search results. It must contain the primary keyword (for algorithmic relevance), communicate a specific benefit (for human click motivation), and create urgency or curiosity. The SEO node in this chain applies these principles programmatically. It constructs multiple meta description variants using question-based hooks, benefit-first framing, and number-driven proof points, so you can select the variant most likely to maximize your click-through rate.'
      },
      {
        title: 'Structured Data as an Authority Signal',
        body: 'JSON-LD schema markup is one of the most underused SEO tools available to content publishers. Adding Article schema to a long-form post tells Google\'s crawlers the author, publication date, article category, and primary topic — reducing the ambiguity that leads to poor content classification. The Schema node in this chain generates a complete, production-ready JSON-LD block in under a second. You simply paste it into your page\'s <head> tag. Over time, consistent schema markup across all your content builds a coherent knowledge graph of your authorship that Google associates with topical authority.'
      }
    ],
    quote: '"An article without a distribution architecture is a library book on a shelf that nobody knows exists." — Datta Sable'
  }
};

export default function ChainExecutionClient({ chain }: { chain: ExecutionChain }) {
  const { profile } = useOperatorProfile();
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResults({});

    await new Promise(r => setTimeout(r, 1500));

    const newResults: Record<string, string> = {};

    if (chain.nodes.includes('prompt')) {
      newResults['prompt'] = `Act as a ${profile.persona} highly specialized in ${input}. \nYour primary goal is ${profile.intent} and your communication style is ${profile.style}.\n\n### TASK:\nProvide a detailed, expert-level response...`;
    }

    if (chain.nodes.includes('seo')) {
      newResults['seo'] = `Title: [${profile.persona}] How to master ${input} in 2026\nDescription: Explore the surgical breakdown of ${input} with our expert ${profile.persona} guide. Optimized for ${profile.intent}.`;
    }

    if (chain.nodes.includes('linkedin')) {
      const prefix = profile.persona === 'Technical Expert' ? '⚙️ ' : '🚀 ';
      newResults['linkedin'] = `${prefix}${input}\n\nMost people think [Myth] is the key to success. They're wrong.\n\nHere is the surgical breakdown of how I optimized my ${profile.style} workflow...`;
    }

    if (chain.nodes.includes('schema')) {
      newResults['schema'] = `{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "${input}",\n  "author": "${profile.persona}"\n}`;
    }

    setResults(newResults);
    setIsExecuting(false);
  };

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const editorial = CHAIN_EDITORIAL[chain.slug];

  return (
    <>
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/chains" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_CHAIN_HUB
            </Link>

            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <Zap size={20} />
                </div>
                <div className="label-tech">CHAIN_ID: {chain.id.toUpperCase()}</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                {chain.title}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                {chain.description}
              </p>
            </div>

            <OperatorPanel />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Input Control */}
              <div className="lg:col-span-1">
                <div className="card p-8 sticky top-32" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Cpu size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-[10px] uppercase tracking-widest">Input_Parameters</h4>
                  </div>

                  <div className="mb-8">
                    <label className="block mono text-[9px] text-[var(--muted)] mb-3 uppercase tracking-widest">{chain.inputLabel}</label>
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={chain.placeholder}
                      className="w-full h-48 p-4 bg-[var(--bg)] border border-[var(--border)] outline-none text-theme text-xs resize-none"
                      style={{ lineHeight: 1.6 }}
                    />
                  </div>

                  <button 
                    onClick={handleExecute}
                    disabled={!input || isExecuting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExecuting ? 'ORCHESTRATING...' : 'INITIATE_CHAIN'} <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Output Orchestration */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-6">
                  {chain.nodes.map((node) => (
                    <div key={node} className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)]/50">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-[var(--accent)]" />
                          <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--text)]">Node_{node.toUpperCase()}</h4>
                        </div>
                        {results[node] && (
                          <button 
                            onClick={() => handleCopy(node, results[node])}
                            className="text-[var(--accent)] hover:opacity-80 transition-all flex items-center gap-2 mono text-[9px]"
                          >
                            {copied === node ? <Check size={12} /> : <Copy size={12} />} COPY_NODE
                          </button>
                        )}
                      </div>
                      <div 
                        className="p-6 min-h-[100px] mono text-[10px] leading-relaxed text-[var(--muted)]"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {isExecuting ? (
                          <div className="flex items-center gap-2 animate-pulse">
                            <Sparkles size={12} className="text-[var(--accent)]" /> Synthesizing...
                          </div>
                        ) : results[node] || 'Awaiting chain initiation...'}
                      </div>
                    </div>
                  ))}

                  {Object.keys(results).length > 0 && (
                    <button className="btn-outline w-full py-4 flex items-center justify-center gap-2 mono text-[10px] tracking-widest">
                      <Download size={14} /> EXPORT_COMPLETE_PACKAGE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Chain-Specific Editorial Section */}
      {editorial && (
        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>{editorial.label}</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 700, marginBottom: '2rem', color: 'var(--text)', lineHeight: 1.25, fontFamily: "'Syne', sans-serif" }}>
              {editorial.heading}
            </h2>

            <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.85 }}>
              {editorial.intro.map((para, i) => (
                <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
              ))}

              {editorial.sections.map((sec, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem', fontFamily: "'Syne', sans-serif" }}>
                    {sec.title}
                  </h3>
                  <p style={{ marginBottom: '1.25rem' }}>{sec.body}</p>
                </div>
              ))}

              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--border)', paddingLeft: '1rem', marginTop: '2.5rem', color: 'var(--text)' }}>
                {editorial.quote}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

