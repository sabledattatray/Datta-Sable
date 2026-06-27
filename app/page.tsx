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
  const recentPosts = posts.slice(0, 6);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

        {/* ── 1. HERO SECTION ── */}
        <Hero />

        {/* ── 2. BELOW THE FOLD COMPONENTS (DEFERRED HYDRATION) ── */}
        <BelowTheFold posts={recentPosts} />

        <Crosshair position="br" />
      </div>
      
      <Footer />
    </div>
  );
}
