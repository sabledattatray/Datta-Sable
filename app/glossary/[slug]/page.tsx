import { GLOSSARY_TERMS } from '@/data/glossary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchemaScript from '@/components/SchemaScript';
import { 
  ArrowLeft, 
  ChevronRight, 
  BookMarked, 
  Zap, 
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((term) => ({
    slug: term.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
  
  if (!term) return { title: 'Term Not Found' };
  
  return {
    title: `${term.term} | AI Workflow Glossary | Datta Sable`,
    description: term.definition,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://dattasable.com/glossary/${term.slug}` },
    openGraph: {
      title: `${term.term} | AI Workflow Glossary`,
      description: term.definition,
      url: `https://dattasable.com/glossary/${term.slug}`,
      type: 'article',
    },
  };
}

export default async function GlossaryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);

  if (!term) notFound();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/glossary" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_GLOSSARY
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Main Content Area */}
              <div className="lg:col-span-2">
                <div style={{ marginBottom: '4rem' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="label-tech">{term.category.toUpperCase()}_LEXICON</span>
                    <span className="text-[10px] mono text-[var(--muted)]">TERM_ID: {term.id.toUpperCase()}</span>
                  </div>
                  <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
                    {term.term}
                  </h1>
                  <div className="p-8 card" style={{ background: 'var(--surface2)', borderLeft: '4px solid var(--accent)' }}>
                    <p className="text-xl leading-relaxed text-[var(--text)] italic opacity-90">
                      "{term.definition}"
                    </p>
                  </div>
                </div>

                <div className="knowledge-content text-[var(--text)] leading-relaxed mb-12">
                   <h3 className="text-2xl font-bold mb-6">Operator's Perspective</h3>
                   <p className="mb-6 opacity-80 leading-relaxed">
                      {term.operatorsPerspective}
                   </p>
                   
                   <h3 className="text-xl font-bold mt-12 mb-6">Technical Application</h3>
                   <p className="mb-6 opacity-80 leading-relaxed">
                      {term.technicalApplication}
                   </p>
                </div>

                {/* Founder Insight - E-E-A-T Signal */}
                <div className="p-8 bg-[var(--accent)]/5 border border-[var(--border)] rounded-sm mb-12">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--surface2)] border border-[var(--accent)]/30 flex items-center justify-center">
                         <span className="text-[10px] mono font-bold text-[var(--accent)]">DS</span>
                      </div>
                      <h5 className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">Founder_Note</h5>
                   </div>
                   <p className="text-sm italic text-[var(--text)] leading-relaxed">
                      "{term.founderNote}"
                   </p>
                </div>
              </div>

              {/* Sidebar: Internal Flywheel */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 flex flex-col gap-8">
                  <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-8">Execute_Now</h4>
                    <Link 
                      href="/tools"
                      className="group flex flex-col gap-4 no-underline p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-all bg-[var(--bg)]"
                    >
                      <div className="flex justify-between items-center">
                        <Zap size={18} className="text-[var(--accent)]" />
                        <ArrowUpRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                      </div>
                      <div className="font-bold text-sm">OPEN_WORKPLACE</div>
                      <div className="text-[10px] mono text-[var(--muted)]">Apply this concept immediately</div>
                    </Link>
                  </div>

                  <div className="card p-8 border-dashed" style={{ background: 'var(--bg)' }}>
                     <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={16} className="text-[var(--accent)]" />
                        <h4 className="mono text-[10px] uppercase tracking-widest">Authority_Metrics</h4>
                     </div>
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] mono text-[var(--muted)] uppercase">Index_Priority:</span>
                        <span className="text-[10px] mono text-[var(--accent)]">HIGH</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] mono text-[var(--muted)] uppercase">Traffic_Node:</span>
                        <span className="text-[10px] mono text-[var(--text)]">ACTIVE</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {/* DefinedTerm schema — rendered server-side, no hydration cost */}
      <SchemaScript schema={{
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term!.term,
        "description": term!.definition,
        "url": `https://dattasable.com/glossary/${term!.slug}`,
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "name": "AI Workflow Glossary",
          "url": "https://dattasable.com/glossary",
          "publisher": { "@id": "https://dattasable.com/#organization" }
        },
        "isPartOf": { "@id": "https://dattasable.com/#website" }
      }} />
    </div>
  );
}
