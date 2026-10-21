import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import type { PublicBlogPost } from '@/lib/blog-posts';
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
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://dattasable.com/blog' },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'All';

  let posts: PublicBlogPost[] = [];
  try {
    posts = await getPublishedBlogPosts();
  } catch (error) {
    console.error('Failed to retrieve blog posts:', error);
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper" style={{ overflow: 'clip', minHeight: '80vh' }}>
        <BlogList key={category} initialPosts={posts.map(post => ({
          slug: post.slug, title: post.title, category: post.category, excerpt: post.excerpt,
          image: post.image, tags: post.tags, date: post.date,
          readTime: typeof post.readTime === 'number' || typeof post.readTime === 'string' ? post.readTime : null,
        }))} initialCategory={category} />
      </main>
      <Footer />
    </div>
  );
}
