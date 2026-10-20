import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostContent from '@/components/BlogPostContent';
import draft from '@/content/editorial/microsoft-fabric-real-time-intelligence-guide/draft.json';

export const metadata: Metadata = {
  title: 'Draft preview — Fabric Real-Time Intelligence',
  robots: { index: false, follow: false },
};

export default function Page() {
  if (process.env.NODE_ENV !== 'development' || process.env.CAMPAIGN_DESIGN_PREVIEW !== '1') notFound();
  return <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <Navbar />
    <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: 40 }}>
      <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
        <p style={{ color: 'var(--accent)', paddingBottom: 24 }}>UNPUBLISHED EDITORIAL PREVIEW · No subscriber emails sent</p>
        <BlogPostContent post={{ ...draft, blocks: undefined }} relatedPosts={[]} />
      </section>
    </div>
    <Footer />
  </div>;
}
