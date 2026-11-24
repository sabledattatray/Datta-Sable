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

  // Optimize token budget: pass only the top posts required by the homepage tabs (latest, bi, ai)
  const biPosts = posts.filter(post => /\bfabric\b|power bi|\bdax\b|\bonelake\b/i.test(`${post.title} ${post.category}`)).slice(0, 6);
  const aiPosts = posts.filter(post => /\bai\b|automation|\bn8n\b|\bllm\b|prompt|agent|workflow/i.test(`${post.title} ${post.category}`)).slice(0, 6);
  const latestPosts = posts.slice(0, 6);

  const selectedPosts = [...new Map([...latestPosts, ...biPosts, ...aiPosts].map(p => [p.slug, p])).values()];

  const insightPosts = selectedPosts.map(({ slug, title, category, excerpt, image, readTime, date }) => ({
    slug,
    title,
    category,
    excerpt: excerpt?.length > 180 ? `${excerpt.slice(0, 180)}...` : excerpt,
    image,
    readTime: typeof readTime === 'number' || typeof readTime === 'string' ? readTime : null,
    date,
  }));

  const homepageOfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Datta Sable',
    url: 'https://dattasable.com',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Datta Sable Services and Digital Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Power BI & Microsoft Fabric Engineering eBooks',
            description: 'Comprehensive digital practical guides on calculation groups, DAX architecture, and semantic models.',
            url: 'https://dattasable.com/ebooks',
          },
          price: '499',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://dattasable.com/pricing',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '1:1 BI & Data Engineering Mentorship',
            description: 'Personalized 60-minute technical session on Power BI, SQL, and Fabric.',
            url: 'https://dattasable.com/mentorship',
          },
          price: '1499',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://dattasable.com/pricing',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Power BI & Microsoft Fabric Architecture Audit',
            description: 'Diagnostic performance and semantic model architecture review.',
            url: 'https://dattasable.com/services',
          },
          price: '14999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://dattasable.com/pricing',
        },
      ],
    },
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageOfferSchema) }}
      />
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
