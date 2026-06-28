import { Metadata } from 'next';
import Link from 'next/link';
import { Layers, Zap, GitBranch, Share2, Download, Code2, Database, Workflow } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Creator Infrastructure Hub | Surgical AI Systems | Datta Sable',
  description: 'The definitive hub for automation systems, AI content pipelines, and execution chains for modern technical creators.',
  openGraph: {
    title: 'Creator Infrastructure Hub | Surgical AI Systems',
    description: 'Automation systems, AI content pipelines, and execution chains for modern technical creators.',
    url: 'https://dattasable.com/infrastructure',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Creator Infrastructure Hub \u2014 Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator Infrastructure Hub | Surgical AI Systems',
    description: 'Automation systems, AI pipelines, and execution chains for technical creators.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/infrastructure' },
};


const INFRA_SECTIONS = [
  {
    title: 'Automation Systems',
    description: 'Autonomous workflows that handle everything from data collection to final publishing.',
    icon: <Zap className="text-yellow-500" />,
    link: '/chains',
    color: 'yellow'
  },
  {
    title: 'AI Content Pipelines',
    description: 'Modular pipelines for high-fidelity technical writing and asset generation.',
    icon: <Layers className="text-indigo-500" />,
    link: '/templates',
    color: 'indigo'
  },
  {
    title: 'Execution Chains',
    description: 'Serialized logic structures for repeatable business and technical outcomes.',
    icon: <GitBranch className="text-cyan-500" />,
    link: '/knowledge/architecture',
    color: 'cyan'
  }
];

export default async function InfrastructureHub() {
  const dynamicPage = await getDynamicPage('infrastructure');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      
      <section className="section pt-32 pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="label-tech mb-6 text-[var(--accent)] mx-auto">Infrastructure Hub</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontFamily: 'Syne, sans-serif' }} className="mb-8">
              Surgical <span className="text-[var(--accent)]">Infrastructure</span> for Creators
            </h1>
            <p className="text-xl text-[var(--muted)] mb-12 max-w-2xl mx-auto">
              Open-source frameworks, automation blueprints, and execution systems designed for builders who value precision over volume.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/knowledge/architecture" className="btn-primary flex items-center gap-2">
                <Workflow size={18} /> Explore Architectures
              </Link>
              <Link href="/dashboards" className="btn-outline flex items-center gap-2">
                <Database size={18} /> Preview Dashboards
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--surface1)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INFRA_SECTIONS.map((section) => (
              <div key={section.title} className="p-8 border border-[var(--border)] bg-[var(--surface2)] hover:border-[var(--accent)] transition-all group">
                <div className="w-12 h-12 rounded-sm mb-6 flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                <p className="text-[var(--muted)] mb-8 text-sm leading-relaxed">{section.description}</p>
                <Link href={section.link} className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:underline flex items-center gap-2">
                  View Specifications <Share2 size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <div className="label-tech mb-6 text-cyan-500">Asset 1</div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Downloadable <span className="text-cyan-500">Frameworks</span></h2>
              <p className="text-[var(--muted)] mb-8 text-lg">
                Access our library of n8n blueprints, Python automation scripts, and prompt chain JSON files ready for immediate deployment.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm">
                  <Download size={16} className="text-cyan-500" /> Multi-Agent Publishing Chain (v2.1)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Download size={16} className="text-cyan-500" /> Revenue Intelligence SQL Schema
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Download size={16} className="text-cyan-500" /> Dynamic Prompt Injector Script
                </li>
              </ul>
              <Link href="/knowledge/architecture" className="btn-minimal">Browse Full Library</Link>
            </div>
            <div className="flex-1 w-full p-4 bg-[var(--surface2)] border border-[var(--border)] rounded-sm">
              <div className="flex items-center gap-2 mb-4 p-3 bg-[var(--bg)] border border-[var(--border)]">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="mono text-[10px] ml-4 opacity-50">workflow.json</span>
              </div>
              <pre className="text-[12px] mono text-cyan-500 overflow-x-auto p-4 leading-6">
{`{
  "name": "Surgical Workflow",
  "version": "1.0",
  "nodes": [
    { "type": "webhook", "position": [100, 200] },
    { "type": "ai_agent", "position": [300, 200] },
    { "type": "formatter", "position": [500, 200] }
  ],
  "connections": { ... }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
