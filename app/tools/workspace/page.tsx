import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LayoutDashboard } from 'lucide-react';
import WorkspaceClient from './WorkspaceClient';

export const metadata: Metadata = {
  title: 'AI Workspace — Your Command Center for Data & AI Tools | Datta Sable',
  description:
    'The AI Workspace by Datta Sable is your personal command center for data analytics, AI prompt engineering, and LinkedIn content workflows. Access saved sessions, cross-tool pipelines, and recent blueprints all in one place.',
  keywords: [
    'AI workspace',
    'data analytics tools',
    'AI prompt engineering',
    'LinkedIn content tools',
    'SEO meta generator workspace',
    'cross-tool pipeline',
    'Datta Sable tools',
  ],
  alternates: {
    canonical: 'https://dattasable.com/tools/workspace',
  },
  openGraph: {
    title: 'AI Workspace — Your Command Center for Data & AI Tools',
    description:
      'Access all your AI and data tools in one place. Resume saved sessions, run cross-tool pipelines, and power up your workflow with the Datta Sable Workspace.',
    url: 'https://dattasable.com/tools/workspace',
    siteName: 'Datta Sable',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Workspace — Command Center for Data & AI Tools',
    description:
      'Resume AI sessions, run cross-tool pipelines, and manage your workflows from a single workspace.',
  },
};

export default function AIWorkspacePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">

            {/* Static header — fully indexable by Google */}
            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <LayoutDashboard size={20} />
                </div>
                <div className="label-tech">CORE-ORCHESTRATION-V1.0</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
                Surgical <span className="hero-title">Workspace</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                The command center for your creative technical workflow. Access recent sessions, saved blueprints,
                and cross-tool pipelines — all in one place. Built for data analysts, AI practitioners, and
                professionals who want to move fast without losing context.
              </p>
            </div>

            {/* Static description for SEO */}
            <div style={{ maxWidth: 800, marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                What is the AI Workspace?
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                The AI Workspace is a unified hub that connects all of Datta Sable&apos;s tools — from the{' '}
                <a href="/tools/ai-prompt-generator" style={{ color: 'var(--accent)' }}>AI Prompt Generator</a> to the{' '}
                <a href="/tools/seo-meta-generator" style={{ color: 'var(--accent)' }}>SEO Meta Generator</a> and{' '}
                <a href="/tools/linkedin-formatter" style={{ color: 'var(--accent)' }}>LinkedIn Formatter</a>. Resume
                saved sessions instantly, chain tools together in intelligent pipelines, and stay focused on what matters.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7 }}>
                Sessions are saved locally in your browser, so your work is always private, always available, and never
                requires an account. Use the Blog-to-LinkedIn pipeline to go from an SEO-optimised draft to a polished
                LinkedIn announcement in minutes.
              </p>
            </div>

            {/* Interactive client component (recent sessions, pipelines, etc.) */}
            <WorkspaceClient />

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
