import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getPublishedBlogPosts } from '@/lib/blog-posts';
import FabricHubClient from '@/components/blog/FabricHubClient';
import * as fs from 'fs';
import * as path from 'path';

export const metadata: Metadata = {
  title: 'Microsoft Fabric Hub: Architecture, Pricing & Certification Guides',
  description: 'Master Microsoft Fabric. Complete guides to OneLake, Medallion architecture, capacity planning, cost optimization, and DP-600/700/800 exam preparation.',
  openGraph: {
    title: 'Microsoft Fabric Hub: Architecture, Pricing & Certification Guides',
    description: 'Master Microsoft Fabric. Complete guides to OneLake, Medallion architecture, capacity planning, cost optimization, and DP-600/700/800 exam preparation.',
    url: 'https://dattasable.com/blog/microsoft-fabric',
    type: 'website',
    images: [{ url: '/images/blog/microsoft-fabric-architecture-explained-2026.webp', width: 1200, height: 630, alt: 'Microsoft Fabric Hub' }],
  },
  alternates: { canonical: 'https://dattasable.com/blog/microsoft-fabric' },
};

export const revalidate = 3600;

export default async function MicrosoftFabricHub() {
  const posts = await getPublishedBlogPosts();
  
  // Filter for posts that are explicitly about Microsoft Fabric
  const fabricPosts = posts.filter(post => 
    post.tags?.some((t: string) => t.toLowerCase().includes('fabric') || t.toLowerCase().includes('onelake') || t.toLowerCase().includes('dp-600')) ||
    post.title.toLowerCase().includes('fabric') ||
    post.title.toLowerCase().includes('onelake')
  );

  // Load knowledge graph data
  const graphFilePath = path.join(process.cwd(), 'data', 'knowledge-graph.json');
  const graphData = JSON.parse(fs.readFileSync(graphFilePath, 'utf-8'));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      
      <div className="boxed-wrapper" style={{ position: 'relative', paddingBottom: '80px' }}>
        {/* Top-left Crosshair */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
        </div>

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)', maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          
          {/* Hero Header */}
          <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Topical Knowledge Base</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginTop: '0.5rem', marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif' }}>
              Microsoft Fabric <span style={{ color: 'var(--accent)' }}>Hub</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: '800px', lineHeight: 1.7 }}>
              Welcome to the ultimate learning resource for Microsoft Fabric. This hub-and-spoke directory aggregates our in-depth technical blueprints, capacity planning tools, Reserved Capacity optimizations, and study companions for the DP-600, DP-700, and DP-800 certifications.
            </p>
          </div>

          {/* Quick-Access Spoke Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            
            {/* Spoke 1: Core Architecture */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>🏗️</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Syne, sans-serif' }}>Core Architecture</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                Understand OneLake virtualization, storage files vs. tables, Synapse engines, and the exact query lifecycle inside Direct Lake semantic models.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/blog/microsoft-fabric-architecture-explained-2026" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Architecture Explained (2026 Guide)</Link>
                <Link href="/blog/microsoft-fabric-onelake-architecture-guide" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ OneLake Architecture Guide</Link>
                <Link href="/blog/microsoft-fabric-medallion-architecture-guide" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Medallion Architecture (Bronze/Silver/Gold)</Link>
              </div>
            </div>

            {/* Spoke 2: Sizing & FinOps */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>💰</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Syne, sans-serif' }}>Sizing & FinOps</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                Master Capacity Units (CU), Reserved Capacity economics, pay-as-you-go variables, and strategies to scale F2 up to F2048 pools.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/blog/microsoft-fabric-pricing-guide-2026" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Fabric Pricing & Sizing Explained</Link>
                <Link href="/blog/power-bi-direct-lake-performance-tuning-fabric" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Direct Lake Performance Tuning</Link>
              </div>
            </div>

            {/* Spoke 3: Certifications */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>🎓</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Syne, sans-serif' }}>Certifications & Careers</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                Syllabus breakdowns, study guides, and comparison metrics for DP-600, DP-700, and DP-800 exams.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/blog/dp-600-study-guide-2026" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ DP-600 Study Guide</Link>
                <Link href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Exam Path Comparison (DP-600/700/800)</Link>
                <Link href="/blog/why-microsoft-fabric-skills-will-dominate-the-data-industry-in-2026" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>→ Fabric Career Roadmap</Link>
              </div>
            </div>

          </div>

          {/* Dynamic Knowledge Graph & Semantic Search Platform */}
          <FabricHubClient initialPosts={fabricPosts as any[]} graphData={graphData} />

        </section>
      </div>

      <Footer />
    </div>
  );
}
