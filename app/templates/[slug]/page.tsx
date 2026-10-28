import { TEMPLATES } from '@/data/templates';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  ChevronRight, 
  Copy, 
  Sparkles,
  Share2,
  Wand2,
  Search,
  Layout,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return TEMPLATES.map((template) => ({
    slug: template.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);
  
  if (!template) return { title: 'Template Not Found' };
  
  // Copyable library entries need an editorial review before search promotion.
  
  return {
    title: `${template.title} | Technical Blueprint | Datta Sable`,
    description: template.description,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://dattasable.com/templates/${template.slug}` },
  };
}

const CATEGORY_ICONS: Record<string, any> = {
  'LinkedIn': <Share2 size={20} />,
  'AI Prompts': <Wand2 size={20} />,
  'SEO': <Search size={20} />,
  'Creator': <Layout size={20} />,
};

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);

  if (!template) notFound();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/templates" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_TEMPLATE_HUB
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div style={{ marginBottom: '4rem' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      {CATEGORY_ICONS[template.category]}
                    </div>
                    <div className="label-tech">BLUEPRINT_ID: {template.id.toUpperCase()}</div>
                  </div>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    {template.title}
                  </h1>
                  <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    {template.description}
                  </p>
                </div>

                <div className="card p-8 mb-8" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-[var(--accent)]" />
                      <h4 className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--text)]">Blueprint_Structure</h4>
                    </div>
                  </div>
                  <pre className="p-6 bg-[var(--bg)] rounded border border-[var(--border)] overflow-x-auto text-xs mono text-[var(--muted)] leading-relaxed min-h-[200px]">
                    {typeof template.content === 'string' ? template.content : JSON.stringify(template.content, null, 2)}
                  </pre>
                </div>

                {/* Rich Details Sections */}
                <div className="knowledge-content text-[var(--text)] leading-relaxed mb-12">
                  <h3 className="text-2xl font-bold mb-6">Architectural Breakdown</h3>
                  <p className="mb-8 opacity-80 leading-relaxed">
                    {template.detailedExplanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-lg font-bold mb-4">Recommended Use Cases</h4>
                      <ul className="list-disc pl-5 space-y-2 opacity-80 text-sm">
                        {template.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-4">Implementation Best Practices</h4>
                      <ul className="list-disc pl-5 space-y-2 opacity-80 text-sm">
                        {template.bestPractices.map((practice, index) => (
                          <li key={index}>{practice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {template.references && <section className="mb-10 space-y-4">
                  <h2 className="text-xl font-bold">Primary references</h2>
                  <ul className="list-disc pl-5 space-y-3">{template.references.map(reference => <li key={reference.href}><a href={reference.href} className="underline">{reference.label}</a></li>)}</ul>
                </section>}

                <div className="flex items-center gap-2 text-xs text-[var(--muted)] mono p-4 border border-dashed border-[var(--border)] mb-12">
                  <Sparkles size={14} className="text-[var(--accent)]" /> 
                  Example starting point: replace placeholders, verify factual claims, and test the result before publishing or using it in production.
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="card p-8 sticky top-32" style={{ background: 'var(--surface2)' }}>
                  <h4 className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)] mb-8">Execution_Target</h4>
                  
                  <div className="mb-8">
                    <div className="text-[length:var(--text-small)] mono text-[var(--muted)] uppercase mb-2">Target_Module</div>
                    <div className="text-sm font-bold text-[var(--text)]">{template.targetModule.replace('/tools/', '').replace('-', ' ').toUpperCase()}</div>
                  </div>

                  <Link 
                    href={`${template.targetModule}?template=${template.id}`}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 no-underline"
                  >
                    OPEN RELATED TOOL <ChevronRight size={14} />
                  </Link>
                  
                  <div className="mt-6 p-4 bg-[var(--bg)] border border-[var(--border)] rounded text-[length:var(--text-small)] mono text-[var(--muted)] leading-relaxed">
                    Open the related tool to adapt this example. Review any populated fields; a template does not validate your claims or publish the result.
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
