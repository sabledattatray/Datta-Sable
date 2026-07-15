import { KNOWLEDGE_ARTICLES } from '@/data/knowledge';
import { TEMPLATES } from '@/data/templates';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  Target,
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return KNOWLEDGE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = KNOWLEDGE_ARTICLES.find((a) => a.slug === slug);
  
  if (!article) return { title: 'Article Not Found' };
  
  const finalTitle = article.title.length > 50 ? article.title : `${article.title} | Datta Sable`;
  
  // Holistic evaluation of indexability (word count, utility role, search intent)
  const wordCount = (article.content || '').split(/\s+/).filter(Boolean).length;
  const isUtility = (article as any).isUtility ?? false; 
  const hasUniqueValue = (article as any).hasUniqueValue ?? true;
  const hasSearchIntent = (article as any).hasSearchIntent ?? true;
  const isLandingPage = (article as any).isLandingPage ?? true;
  
  const noindex = (article as any).noindex === true || (
    isUtility && wordCount < 200 && !isLandingPage && !hasSearchIntent
  );
  
  return {
    title: { absolute: finalTitle },
    description: article.description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = KNOWLEDGE_ARTICLES.find((a) => a.slug === slug);

  if (!article) notFound();

  const blueprint = article.associatedBlueprint 
    ? TEMPLATES.find(t => t.slug === article.associatedBlueprint)
    : null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/knowledge" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_KNOWLEDGE_HUB
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <article>
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="label-tech">{article.category.toUpperCase()}</span>
                      <span className="flex items-center gap-1 text-[10px] mono text-[var(--muted)]">
                        <Clock size={12} /> {article.readingTime} READ
                      </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
                      {article.title}
                    </h1>
                  </div>

                  <div className="knowledge-content text-[var(--text)] leading-relaxed mb-16">
                     {/* In a real app we'd use a markdown renderer, but for this MVP we use a simple structure */}
                     <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} style={{ fontSize: '1.1rem', opacity: 0.9 }} />
                  </div>

                  {/* Founder Layer: Operator Note */}
                  {article.operatorNote && (
                    <div className="p-8 bg-[var(--accent)]/5 border-l-4 border-[var(--accent)] mb-12">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface2)] border border-[var(--accent)]/30 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <span className="text-xs mono font-bold text-[var(--accent)]">DS</span>
                        </div>
                        <div>
                          <h5 className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">Founder_Breakdown</h5>
                          <p className="text-[9px] mono text-[var(--muted)]">Expert Commentary by Datta Sable</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--text)] italic opacity-90">
                        "{article.operatorNote}"
                      </p>
                    </div>
                  )}
                </article>

                {/* Internal Flywheel: Blueprint CTA */}
                {blueprint && (
                  <div className="mt-16 p-8 card" style={{ background: 'var(--surface2)', border: '1px solid var(--accent)' }}>
                    <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
                      <Target size={20} />
                      <span className="mono text-[10px] font-bold tracking-widest uppercase">Direct_Blueprint_Injection</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Deploy the {blueprint.title}</h3>
                    <p className="text-sm text-[var(--muted)] mb-8">
                      Ready to execute this guide? Inject the optimized blueprint directly into your workspace node.
                    </p>
                    <Link 
                      href={`/templates/${blueprint.slug}`}
                      className="btn-primary inline-flex items-center gap-2 py-3 px-8 no-underline"
                    >
                      VIEW_BLUEPRINT <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Sidebar: Recommended Tools & Related */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 flex flex-col gap-8">
                  <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-8">Execution_Target</h4>
                    <Link 
                      href={article.associatedTool}
                      className="group flex flex-col gap-4 no-underline p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <Zap size={18} className="text-[var(--accent)]" />
                        <ArrowUpRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                      </div>
                      <div className="font-bold text-sm">LAUNCH_WORKPLACE_NODE</div>
                      <div className="text-[10px] mono text-[var(--muted)]">Recommended for this guide</div>
                    </Link>
                  </div>

                  <div className="card p-8 border-dashed" style={{ background: 'var(--bg)' }}>
                     <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={16} className="text-[var(--accent)]" />
                        <h4 className="mono text-[10px] uppercase tracking-widest">Authority_Loop</h4>
                     </div>
                     <p className="text-[10px] mono text-[var(--muted)] leading-relaxed mb-6">
                        This guide is part of a Topical Cluster. Master the entire domain to secure dominant organic authority.
                     </p>
                     <Link href="/knowledge" className="text-[10px] mono font-bold text-[var(--accent)] no-underline flex items-center gap-1">
                        VIEW_CLUSTER_NODES <ChevronRight size={12} />
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
