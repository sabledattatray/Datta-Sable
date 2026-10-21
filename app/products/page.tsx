import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarketplaceExplorer, { SerializedProduct } from '@/components/commerce/MarketplaceExplorer';
import { PRODUCT_CATEGORIES } from '@/lib/commerce/catalog';
import styles from '@/components/commerce/Marketplace.module.css';
import { 
  Sparkles, ArrowRight, ShieldCheck, FileCheck, CreditCard, 
  DownloadCloud, BookOpen, ArrowUpRight, FolderHeart
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digital Products & Practical Learning Resources | Datta Sable',
  description: 'Original Microsoft Fabric study packages, Power BI dashboards, SQL analytics templates, and automated tools for data professionals.',
  alternates: {
    canonical: 'https://dattasable.com/products',
  },
  openGraph: {
    title: 'Digital Products & Practical Learning Resources | Datta Sable',
    description: 'Practical data engineering roadmaps, analytics dashboards, and professional automation tools.',
    url: 'https://dattasable.com/products',
    siteName: 'Datta Sable',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Products & Practical Learning Resources | Datta Sable',
    description: 'Practical data engineering roadmaps, analytics dashboards, and professional automation tools.',
    creator: '@sabledattatray',
  },
};

export default async function ProductsPage() {
  // Query published products safely
  let rawProducts: Awaited<ReturnType<typeof prisma.commerceProduct.findMany>> = [];
  let publishedArticles: Array<{ slug: string; title: string; category: string; excerpt: string; readTime: number }> = [];

  try {
    const [prods, posts] = await Promise.all([
      prisma.commerceProduct.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, title: true, category: true, excerpt: true, readTime: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    rawProducts = prods;
    publishedArticles = posts;
  } catch (error) {
    console.error('Failed to load store data:', error);
  }

  // Compute actual published category counts
  const categoryCounts: Record<string, number> = {};
  PRODUCT_CATEGORIES.forEach(cat => {
    categoryCounts[cat.slug] = 0;
  });

  const serializedProducts: SerializedProduct[] = rawProducts.map(p => {
    // Map to categories
    PRODUCT_CATEGORIES.forEach(cat => {
      if (
        p.category.toLowerCase().includes(cat.title.toLowerCase()) ||
        p.category.toLowerCase().includes(cat.id.toLowerCase()) ||
        (cat.id === 'certifications' && (p.category.toLowerCase().includes('fabric') || p.category.toLowerCase().includes('certification')))
      ) {
        categoryCounts[cat.slug] = (categoryCounts[cat.slug] || 0) + 1;
      }
    });

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      image: p.image,
      priceMinor: p.priceMinor,
      currency: p.currency,
      status: p.status,
      salesEnabled: p.salesEnabled,
      deliveryReady: p.deliveryReady,
      features: p.features,
      includedResources: p.includedResources,
      createdAt: p.createdAt.toISOString(),
    };
  });

  // Schema.org structured data for the catalog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Digital Products & Practical Learning Resources',
    description: 'Original Microsoft Fabric study roadmaps, Power BI dashboards, and automation templates by Datta Sable.',
    url: 'https://dattasable.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: serializedProducts.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://dattasable.com/products/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <Navbar />

      <main className={styles.pageWrapper}>
        <div className={styles.ambientGlow} />

        <div className={styles.container}>
          {/* Breadcrumbs & User Shortcut */}
          <nav className={styles.topNav} aria-label="Breadcrumb navigation">
            <div className={styles.breadcrumbs}>
              <Link href="/">Home</Link>
              <span>/</span>
              <span className={styles.current}>Digital Products</span>
            </div>

            <div className={styles.userLinks}>
              <Link href="/account/orders">
                My Orders
              </Link>
              <Link href="/account/purchases">
                <FolderHeart size={14} />
                My Purchases
              </Link>
            </div>
          </nav>

          {/* ----------------------------------------------------------------
              Hero Section
              ---------------------------------------------------------------- */}
          <section className={styles.hero} aria-labelledby="store-hero-heading">
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowPulse} />
              PROFESSIONAL DIGITAL RESOURCES
            </div>

            <h1 id="store-hero-heading" className={styles.heroTitle}>
              Practical Tools. Real Skills.{' '}
              <span className={styles.heroTitleHighlight}>Better Results.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Explore original learning resources, analytics templates, dashboards, and practical tools designed to help data professionals learn faster and work smarter.
            </p>

            <div className={styles.heroActions}>
              <a href="#products" className={styles.btnPrimary}>
                Explore Products
                <ArrowRight size={16} />
              </a>
              <Link href="/portfolio" className={styles.btnSecondary}>
                View My Portfolio
              </Link>
            </div>
          </section>

          {/* ----------------------------------------------------------------
              Trust & Value Pillars (4 Genuine Benefits)
              ---------------------------------------------------------------- */}
          <section className={styles.trustGrid} aria-label="Platform commitments">
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <FileCheck size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h4>Practical Learning</h4>
                <p>Engineered around realistic data engineering workloads and production scenarios.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <BookOpen size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h4>Clear Documentation</h4>
                <p>Structured roadmaps, topic-wise study notes, and hands-on implementation checklists.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <CreditCard size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h4>Secure Checkout</h4>
                <p>Processed through trusted payment methods with verified signature authentication.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <DownloadCloud size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h4>Digital Delivery</h4>
                <p>Direct download access via your account library for eligible, ready resources.</p>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------
              Marketplace Interactive Explorer (Categories, Search, Grid)
              ---------------------------------------------------------------- */}
          <MarketplaceExplorer 
            initialProducts={serializedProducts} 
            categoryCounts={categoryCounts} 
          />

          {/* ----------------------------------------------------------------
              Educational Content Integration ("Learn Before You Buy")
              ---------------------------------------------------------------- */}
          {publishedArticles.length > 0 && (
            <section className={styles.educationalSection} aria-labelledby="learn-first-title">
              <div className={styles.sectionHeader} style={{ marginBottom: 0 }}>
                <div>
                  <span className={styles.eyebrow} style={{ marginBottom: '8px' }}>
                    EDUCATIONAL FOUNDATIONS
                  </span>
                  <h2 id="learn-first-title" className={styles.sectionTitle}>
                    Learn Before You Buy
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Read comprehensive technical tutorials and architecture guides directly from the DattaSable publication.
                  </p>
                </div>
                <Link href="/blog" className={styles.btnSecondary}>
                  Browse All Articles
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className={styles.educationalGrid}>
                {publishedArticles.map(article => (
                  <Link 
                    key={article.slug} 
                    href={`/blog/${article.slug}`} 
                    className={styles.articleCard}
                  >
                    <span className={styles.articleCategory}>{article.category}</span>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <div className={styles.articleFooter}>
                      <span>{article.readTime} min read</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
                        Read Article <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ----------------------------------------------------------------
              Closing Call to Action
              ---------------------------------------------------------------- */}
          <section className={styles.closingCta}>
            <h2 className={styles.closingCtaTitle}>Build Skills. Create Better Work.</h2>
            <p className={styles.closingCtaDesc}>
              Practical resources developed for professionals working with data, analytics, and business intelligence.
            </p>
            <a href="#products" className={styles.btnPrimary}>
              Browse All Products
              <ArrowRight size={16} />
            </a>
          </section>
        </div>
      </main>

      <Footer />

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
