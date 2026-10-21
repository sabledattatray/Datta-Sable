import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import Hero from '@/components/home/Hero';
import BelowTheFold from '@/components/home/BelowTheFold';
import { getPublishedBlogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Datta Sable — BI Expert, Data Engineer & Content Creator',
  description: 'Datta Sable — Business Intelligence Expert based in Mumbai. Tutorials on Power BI, Tableau, SQL, Python data engineering, Microsoft Fabric, and AI workflows.',
  openGraph: {
    title: 'Datta Sable — BI Expert, Data Engineer & Content Creator',
    description: 'Business Intelligence Expert based in Mumbai. Power BI, Tableau, SQL, Python data engineering, Microsoft Fabric, and AI workflows.',
    url: 'https://dattasable.com',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable — BI Expert & Content Creator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datta Sable — BI Expert, Data Engineer & Content Creator',
    description: 'Business Intelligence Expert. Power BI, Tableau, SQL, Python, Microsoft Fabric & AI workflows.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com' },
};

export default async function HomePage() {
  const posts = await getPublishedBlogPosts().catch(() => []);
  // Send card metadata only; category tabs need more than the latest six posts.
  const insightPosts = posts.map(({ slug, title, category, excerpt, image, readTime, date }) => ({
    slug, title, category, excerpt, image,
    readTime: typeof readTime === 'number' || typeof readTime === 'string' ? readTime : null,
    date,
  }));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

        {/* ── 1. HERO SECTION ── */}
        <Hero />

        {/* ── 2. BELOW THE FOLD COMPONENTS (DEFERRED HYDRATION) ── */}
        <BelowTheFold posts={insightPosts} articleCount={posts.length} categoryCount={new Set(posts.map(post => post.category)).size} />

        <Crosshair position="br" />
      </div>
      
      <Footer />
    </div>
  );
}
