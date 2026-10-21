import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { KNOWLEDGE_ARTICLES } from '@/data/knowledge';

export const metadata: Metadata = {
  title: 'Technical Knowledge: AI Workflows and Engineering Decisions | Datta Sable',
  description: 'Practical reading paths for preparing AI context, choosing workflow architecture, and explaining engineering work with evidence.',
  alternates: { canonical: 'https://dattasable.com/knowledge' },
  robots: { index: true, follow: true },
};

const references = [
  ['AI engineering standards', '/knowledge/standards'],
  ['Communication protocols', '/knowledge/protocols'],
  ['Execution patterns', '/knowledge/patterns'],
  ['Topical taxonomy', '/knowledge/taxonomy'],
  ['RFC-001: Prompt hardening', '/knowledge/rfc/001-prompt-hardening'],
  ['RFC-002: Execution chains', '/knowledge/rfc/002-execution-chains'],
  ['RFC-003: Intent mapping', '/knowledge/rfc/003-intent-mapping'],
];

export default function KnowledgeHub() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper pt-32 pb-24">
        <div className="container max-w-5xl space-y-12">
          <header className="space-y-6 max-w-3xl">
            <div className="label-tech">Knowledge base</div>
            <h1 className="text-4xl md:text-5xl font-bold">Technical knowledge</h1>
            <p className="text-lg leading-relaxed text-[var(--muted)]">Choose a practical task, work through its example, and check the result. These guides focus on preparing useful AI context, choosing a workflow architecture, and explaining an engineering decision with evidence.</p>
          </header>
          <section aria-labelledby="choose-path" className="space-y-6 leading-relaxed">
            <h2 id="choose-path" className="text-2xl font-bold">Choose a path by the problem you have</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 space-y-4"><h3 className="text-xl font-bold">The assistant keeps missing requirements</h3><p>Prepare a small context packet with exact constraints, relevant source excerpts, and acceptance checks. Compare the shortened packet with a baseline before using it for a larger task.</p><Link className="underline" href="/knowledge/optimizing-ai-context-windows">Build and test a context packet</Link></div>
              <div className="card p-6 space-y-4"><h3 className="text-xl font-bold">You are deciding how much autonomy to allow</h3><p>Compare a fixed sequence with a model-directed loop using the same invoice example. Consider permissions, recovery, stopping rules, and evaluation cases before adding exploration.</p><Link className="underline" href="/knowledge/comparisons">Compare workflows and agent loops</Link></div>
              <div className="card p-6 space-y-4"><h3 className="text-xl font-bold">You need to explain what your team built</h3><p>Turn a technical change into a useful account of the problem, decision, tradeoff, and evidence. Use the publication checklist to avoid unsupported results and confidential details.</p><Link className="underline" href="/knowledge/technical-storytelling-for-founders">Draft an evidence-based engineering post</Link></div>
            </div>
          </section>
          <section aria-labelledby="guides" className="space-y-6">
            <h2 id="guides" className="text-2xl font-bold">Worked guides</h2>
            <div className="grid md:grid-cols-2 gap-6">{KNOWLEDGE_ARTICLES.map(article => <div key={article.id} className="card p-6 space-y-4"><span className="label-tech">{article.category}</span><h3 className="text-xl font-bold"><Link href={`/knowledge/${article.slug}`} className="underline">{article.title}</Link></h3><p className="leading-relaxed text-[var(--muted)]">{article.description}</p><span className="text-sm">{article.readingTime} read</span></div>)}</div>
          </section>
          <section className="space-y-5 leading-relaxed" aria-labelledby="practice">
            <h2 id="practice" className="text-2xl font-bold">Use the guides as a small practice project</h2>
            <p>Pick a change you can verify locally. Write the expected behavior before asking an assistant to implement it. Keep a short record of the evidence you supplied, the proposed change, and the checks you ran. If the result fails, identify the missing constraint or incorrect assumption instead of treating a confident explanation as proof.</p>
            <p>The examples here are illustrative. They do not report measured client outcomes or guarantee model accuracy, cost savings, audience growth, or production reliability. Adapt the checklists to your own source code, data permissions, and deployment process.</p>
            <p>For broader implementation articles, visit the <Link className="underline" href="/blog">technical blog</Link> or <Link className="underline" href="/blog/microsoft-fabric">Microsoft Fabric collection</Link>. For reusable starting text, the <Link className="underline" href="/templates">template library</Link> provides examples that still require adaptation and testing.</p>
          </section>
          <section className="space-y-5 leading-relaxed" aria-labelledby="references">
            <h2 id="references" className="text-2xl font-bold">Short internal references</h2>
            <p>These compact notes describe terminology and design conventions used on this site. They are working references, not independent industry standards, benchmark reports, or complete implementation tutorials. Read them alongside the worked examples above.</p>
            <ul className="grid md:grid-cols-2 gap-3 list-disc pl-6">{references.map(([title, href]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul>
            <p>Look up unfamiliar terms in the <Link className="underline" href="/glossary">glossary</Link>. See the <Link className="underline" href="/editorial-policy">editorial policy</Link> for how this site treats examples, evidence, and corrections.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
