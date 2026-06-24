import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostContent from '@/components/BlogPostContent';
import { getPublishedBlogPost, getPublishedBlogSlugs } from '@/lib/blog-posts';

export const revalidate = 3600; // Revalidate every 1 hour

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://dattasable.com';
  let post = null;
  try {
    post = await getPublishedBlogPost(slug);
  } catch (error) {
    console.error(`Failed to retrieve blog post metadata for ${slug}:`, error);
  }

  if (!post) return { title: 'Post Not Found' };

  const rawImage = (post as any).image;
  const ogImage = rawImage
    ? rawImage.startsWith('http://') || rawImage.startsWith('https://')
      ? rawImage
      : `${baseUrl}${rawImage}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}&date=${encodeURIComponent(post.date || '')}`;
    
  let publishDate = new Date().toISOString();
  if ((post as any).createdAt) {
    publishDate = typeof (post as any).createdAt.toISOString === 'function'
      ? (post as any).createdAt.toISOString()
      : (post as any).createdAt;
  } else if ((post as any).date) {
    const parsed = new Date((post as any).date);
    if (!isNaN(parsed.getTime())) {
      publishDate = parsed.toISOString();
    } else {
      try {
        const parts = (post as any).date.split(/[\s,]+/);
        if (parts.length >= 3) {
          const months: Record<string, number> = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
          };
          const monthStr = parts[0].toLowerCase().substring(0, 3);
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          if (monthStr in months && !isNaN(day) && !isNaN(year)) {
            publishDate = new Date(year, months[monthStr], day).toISOString();
          }
        }
      } catch (e) {}
    }
  }

  // " | Datta Sable" = 14 chars. Google truncates titles > 60 chars total.
  // Only append suffix if the combined result will be ≤ 60 chars.
  const finalTitle = post.title.length > 46 ? post.title : `${post.title} | Datta Sable`;
  let seoDesc = post.excerpt || '';
  if (seoDesc.length < 120) {
    seoDesc = `${seoDesc} Read the full technical breakdown, system architecture benchmarks, and implementation strategies.`.slice(0, 155);
  }

  return {
    title: { absolute: finalTitle },
    description: seoDesc,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: seoDesc,
      images: [ogImage],
      type: 'article',
      publishedTime: publishDate,
      authors: ['Datta Sable'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: seoDesc,
      images: [ogImage],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post = null;
  try {
    post = await getPublishedBlogPost(slug);
  } catch (error) {
    console.error(`Failed to retrieve blog post details for ${slug}:`, error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        {/* ── Top-left Precision Crosshair ── */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
          <BlogPostContent post={post as any} />
        </section>

        {/* ── Bottom-right Precision Crosshair ── */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
