import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import { getPublishedBlogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog — Power BI, SQL, AI & Data Engineering Articles',
  description: 'In-depth articles on Power BI, Tableau, SQL, Microsoft Fabric, Python data engineering, and AI workflows. Technical breakdowns for data professionals.',
  openGraph: {
    title: 'Blog — Power BI, SQL, AI & Data Engineering Articles | Datta Sable',
    description: 'In-depth articles on Power BI, Tableau, SQL, Microsoft Fabric, Python data engineering, and AI workflows.',
    url: 'https://dattasable.com/blog',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable Blog — BI & Data Engineering' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Power BI, SQL, AI & Data Engineering | Datta Sable',
    description: 'Technical articles on Power BI, Tableau, SQL, Microsoft Fabric, Python & AI.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/blog' },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'All';

  let posts: any[] = [];
  try {
    posts = await getPublishedBlogPosts();
  } catch (error) {
    console.error('Failed to retrieve blog posts:', error);
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        {/* ── Top-left Precision Crosshair ── */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
          <BlogList initialPosts={posts as any} initialCategory={category} />
        </section>

        {/* ── Bottom-right Precision Crosshair ── */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
