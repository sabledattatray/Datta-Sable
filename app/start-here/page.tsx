import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Target, Zap, BarChart3, Database, BrainCircuit, ArrowRight } from 'lucide-react';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Start Your Data Journey | BI & Analytics Knowledge Hub | Datta Sable',
  description: 'A structured learning pathway from data fundamentals to advanced enterprise orchestration. Explore modern BI stacks, automation pipelines, and executive dashboards.',
  openGraph: {
    title: 'Start Your Data Journey | BI & Analytics Knowledge Hub',
    description: 'Your roadmap to mastering Business Intelligence, Automation, and Data Architecture.',
    url: 'https://dattasable.com/start-here',
    type: 'website',
    images: [{ url: '/images/blog/bi_performance_hero_1777410226286.webp', width: 1200, height: 630, alt: 'Start Your Data Journey — Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start Your Data Journey | BI & Analytics Knowledge Hub',
    description: 'Your roadmap to mastering Business Intelligence, Automation, and Data Architecture.',
    images: ['/images/blog/bi_performance_hero_1777410226286.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/start-here' },
};

export default async function StartHerePage() {
  const dynamicPage = await getDynamicPage('start-here');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  const paths = [
    {
      title: "Data Architecture & Infrastructure",
      desc: "Learn how to build the foundation of a modern data stack that scales with your enterprise.",
      icon: <Database size={24} />,
      color: "var(--accent)",
      links: [
        { name: "The 2026 Modern Data Stack", href: "/blog/modern-bi-stack-2026" },
        { name: "PostgreSQL vs Snowflake Benchmarks", href: "/blog/postgres-vs-snowflake-speed" },
      ]
    },
    {
      title: "Advanced BI & Visualization",
      desc: "Master the art of high-stakes executive reporting using industry-leading tools.",
      icon: <BarChart3 size={24} />,
      color: "var(--accent)",
      links: [
        { name: "Mastering Tableau LOD Expressions", href: "/blog/tableau-lods-tutorial" },
        { name: "7 UX Principles for Dashboards", href: "/blog/dashboard-ux-principles" },
        { name: "Power BI Performance Tuning", href: "/blog/bi-performance-tuning" },
      ]
    },
    {
      title: "Automation & Intelligence",
      desc: "Leverage Python and AI to automate the mundane and focus on strategic insights.",
      icon: <BrainCircuit size={24} />,
      color: "var(--accent)",
      links: [
        { name: "Building Pipelines with Python & Prefect", href: "/blog/python-automation-pipelines" },
        { name: "Integrating GenAI into Tableau", href: "/blog/generative-ai-bi-dashboards" },
        { name: "Building a BI Scraper with Selenium", href: "/blog/python-selenium-bi-scraper" },
      ]
    }

  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', justifyContent: 'center' }}>LEARNING-PATHWAY</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 56px)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Start Your <span className="hero-title">Data Journey</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 640, margin: '0 auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
              Welcome to the Knowledge Hub. This structured guide is designed to take you from data fundamentals to advanced enterprise orchestration.
            </p>
          </div>

          {/* Featured Legacy Workshop */}
          <div className="card" style={{ marginTop: '5rem', padding: '3rem', borderLeft: '4px solid var(--accent)', background: 'var(--surface2)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="label-tech mb-4" style={{ color: 'var(--accent)' }}>LEGACY-WORKSHOP // 2021</div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Full-Stack Web Orchestration Masterclass</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                  A comprehensive, 35-minute workshop demonstrating the engineering fundamentals of scalable digital infrastructure. This legacy session has helped over 9,000+ engineers establish their first web-based data environments.
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>9K+</div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.1em' }}>VIEWS_LOGGED</div>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
                  <div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>1K+</div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.1em' }}>SUBSCRIBERS</div>
                  </div>
                </div>
              </div>
              <div className="dashboard-container">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/5sXT6HuV61w" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="dashboard-fallback">
                <a href="https://youtu.be/5sXT6HuV61w" target="_blank">WATCH_MASTERCLASS_DIRECT // SECURE_EXTERNAL_LINK</a>
              </div>
            </div>
            
            {/* Community Pulse - Social Proof */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)' }}>COMMUNITY_ENGAGEMENT: <span style={{ color: 'var(--accent)' }}>ACTIVE</span></div>
                  <div className="mono" style={{ fontSize: '9px', color: 'var(--muted)' }}>WEEKLY_POLLS // STUDENT_INTERACTION</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flex: 1, minWidth: '300px' }}>
                Beyond the videos, our YouTube community actively participates in architectural polls and technical discussions, ensuring the curriculum remains responsive to real-world engineering challenges.
              </p>
            </div>
          </div>

          {/* 2025 Technical Series */}
          <div style={{ marginTop: '5rem' }}>
            <div className="label-tech mb-8">CURRENT-SERIES // 2025_DEPLOYMENTS</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8 border-l-4 border-[var(--accent)]">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Modern Web Orchestration (2025)</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  A step-by-step 2025 series on establishing professional domains, WordPress environments, and custom theme engineering for high-performance deployments.
                </p>
                <Link href="https://youtu.be/PtrHTCjT-6I" target="_blank" className="mono text-[10px] text-[var(--accent)] tracking-widest hover:underline uppercase">Watch Full Series //</Link>
              </div>
              <div className="card p-8 border-l-4 border-[var(--accent)]">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Portfolio Architecture Walkthrough</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  A detailed design showcase and technical walkthrough of the very platform you are currently browsing. Engineering clarity in action.
                </p>
                <Link href="https://youtu.be/5sXT6HuV61w" target="_blank" className="mono text-[10px] text-[var(--accent)] tracking-widest hover:underline uppercase">Watch Walkthrough //</Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '5rem' }}>
            {paths.map((path, idx) => (
              <div key={path.title} className="card h-full" style={{ padding: '2.5rem', borderTop: `4px solid ${path.color}` }}>
                <div style={{ color: path.color, marginBottom: '1.5rem' }}>{path.icon}</div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{path.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>{path.desc}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">Recommended Reading:</div>
                  {path.links.map(link => (
                    <Link key={link.href} href={link.href} className="flex items-center justify-between group p-3 hover:bg-[var(--surface2)] border border-transparent hover:border-[var(--border)] transition-all" style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{link.name}</span>
                      <ArrowRight size={14} style={{ color: 'var(--accent)', transition: 'transform 0.2s' }} className="group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--surface2) 0%, transparent 100%)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Need a Custom BI Roadmap?</h3>
            <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '0 auto 2rem' }}>
              I help organizations architect high-performance data systems and automated analytics workflows.
            </p>
            <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              GET A CONSULTATION <Target size={18} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Full-Stack Web Orchestration Masterclass",
            "description": "A comprehensive workshop demonstrating the engineering fundamentals of scalable digital infrastructure for BI and Data environments.",
            "thumbnailUrl": [
              "https://img.youtube.com/vi/5sXT6HuV61w/maxresdefault.jpg",
              "https://img.youtube.com/vi/5sXT6HuV61w/sddefault.jpg",
              "https://img.youtube.com/vi/5sXT6HuV61w/hqdefault.jpg"
            ],
            "uploadDate": "2021-01-15T00:00:00Z",
            "duration": "PT35M",
            "embedUrl": "https://www.youtube.com/embed/5sXT6HuV61w",
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": { "@type": "WatchAction" },
              "userInteractionCount": 9200
            }
          })
        }}
      />
    </div>
  );
}
