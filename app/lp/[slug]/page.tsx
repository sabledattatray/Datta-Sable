import { LANDING_PAGES } from '@/data/landing-pages';
import { TEMPLATES } from '@/data/templates';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  ChevronRight, 
  Target, 
  Zap, 
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return LANDING_PAGES.map((lp) => ({
    slug: lp.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lp = LANDING_PAGES.find((p) => p.slug === slug);
  
  if (!lp) return { title: 'Landing Page Not Found' };
  
  const finalTitle = lp.title.length > 50 ? lp.title : `${lp.title} | Datta Sable`;
  
  return {
    title: { absolute: finalTitle },
    description: lp.description,
    robots: { index: false, follow: true },
  };
}

export default async function LandingPageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lp = LANDING_PAGES.find((p) => p.slug === slug);

  if (!lp) notFound();

  const template = lp.associatedTemplate 
    ? TEMPLATES.find(t => t.slug === lp.associatedTemplate)
    : null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="label-tech">{lp.intent.toUpperCase()}_NODE</span>
                <span className="text-[10px] mono text-[var(--muted)]">TARGET_PERSONA: {lp.persona.toUpperCase()}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                {lp.title}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                {lp.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Main Landing Copy */}
              <div className="lg:col-span-2">
                <div className="card p-12 mb-12" style={{ background: 'var(--surface2)' }}>
                  <h3 className="text-xl font-bold mb-8">Why this Framework works for {lp.persona}:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {lp.benefitPoints.map((point, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle2 size={18} className="text-[var(--accent)] flex-shrink-0" />
                        <span className="text-sm leading-relaxed text-[var(--muted)]">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="knowledge-content text-[var(--text)] leading-relaxed mb-12">
                   <h3 className="text-2xl font-bold mb-6">The Surgical Strategy</h3>
                   <p className="mb-6 opacity-80 leading-relaxed">
                      {lp.detailedStrategy}
                   </p>
                   
                   <h3 className="text-xl font-bold mt-12 mb-6">Real-World Scenario</h3>
                   <p className="mb-6 opacity-80 leading-relaxed">
                      {lp.realWorldScenario}
                   </p>
                </div>

                {/* The "DEPLOY" CTA - High ROI Conversion */}
                {template && (
                  <div className="mt-12 p-8 card border-dashed" style={{ background: 'var(--bg)', borderColor: 'var(--accent)' }}>
                    <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
                      <Target size={20} />
                      <span className="mono text-[10px] font-bold tracking-widest uppercase">DEPLOY_THIS_SYSTEM</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Launch the {template.title}</h3>
                    <p className="text-sm text-[var(--muted)] mb-8">
                      Ready to execute? One click will inject this blueprint into your workspace.
                    </p>
                    <Link 
                      href={`/templates/${template.slug}`}
                      className="btn-primary inline-flex items-center gap-2 py-3 px-8 no-underline"
                    >
                      EXECUTE_BLUEPRINT <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Sidebar: Tool Access & Metrics */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 flex flex-col gap-8">
                  <div className="card p-8" style={{ background: 'var(--surface2)' }}>
                    <h4 className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-8">Related_Module</h4>
                    <Link 
                      href={lp.associatedTool}
                      className="group flex flex-col gap-4 no-underline p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <Zap size={18} className="text-[var(--accent)]" />
                        <ArrowUpRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                      </div>
                      <div className="font-bold text-sm">OPEN_WORKPLACE_NODE</div>
                      <div className="text-[10px] mono text-[var(--muted)]">Direct access to tools</div>
                    </Link>
                  </div>

                  <div className="card p-8" style={{ background: 'var(--bg)' }}>
                     <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={16} className="text-[var(--accent)]" />
                        <h4 className="mono text-[10px] uppercase tracking-widest">Indexing_Status</h4>
                     </div>
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] mono text-[var(--muted)] uppercase">Traffic_Node:</span>
                        <span className="text-[10px] mono text-[var(--accent)]">ACTIVE</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] mono text-[var(--muted)] uppercase">Discovery_Depth:</span>
                        <span className="text-[10px] mono text-[var(--text)]">HIGH_PRIORITY</span>
                     </div>
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
