import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import MarketplaceExplorer, { SerializedProduct } from '@/components/commerce/MarketplaceExplorer';
import { categoryCounts as countCategories } from '@/lib/commerce/discovery';
import { productDetailsMap } from '@/lib/commerce/product-settings';
import { defaultProductDetails, productReadiness, safeJsonLd } from '@/lib/commerce/product-details';
import styles from '@/components/commerce/Marketplace.module.css';
import {
  ArrowRight, FileCheck, CreditCard,
  DownloadCloud, BookOpen, ArrowUpRight, FolderHeart
} from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Digital Products & Practical Learning Resources',
  description: 'Browse published digital resources and clearly labeled test previews from Datta Sable. Learn what is available and what is still in preparation.',
  alternates: {
    canonical: 'https://dattasable.com/products',
  },
  openGraph: {
    title: 'Digital Products & Practical Learning Resources | Datta Sable',
    description: 'Published digital resources and transparent test previews for data professionals.',
    url: 'https://dattasable.com/products',
    siteName: 'Datta Sable',
    locale: 'en_US',
    type: 'website',
    images: ['/products/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/products/opengraph-image'],
    title: 'Digital Products & Practical Learning Resources | Datta Sable',
    description: 'Published digital resources and transparent test previews for data professionals.',
    creator: '@sabledattatray',
  },
};

export default async function ProductsPage() {
  let unavailable = false;
  let serializedProducts: SerializedProduct[] = [];
  let publishedArticles: Array<{ slug: string; title: string; category: string; excerpt: string; readTime: number }> = [];
  try {
    const raw = await prisma.commerceProduct.findMany({ where: { status: 'PUBLISHED' }, select: { id:true, slug:true, title:true, excerpt:true, category:true, image:true, priceMinor:true, currency:true, status:true, salesEnabled:true, deliveryReady:true, createdAt:true, resources: { where: { active: true }, select: { title: true } } }, orderBy: { createdAt: 'desc' } });
    const settings = await productDetailsMap(raw.map(p => p.id));
    serializedProducts = raw.map(p => { const details = settings.get(p.id) || defaultProductDetails(); return {
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, image: p.image,
      priceMinor: p.priceMinor, currency: p.currency, status: p.status, createdAt: p.createdAt.toISOString(),
      technologies: details.technologies.length ? details.technologies : [p.category], readiness: productReadiness(p,details),
    }; });
  } catch { unavailable = true; console.error('Store catalog read failed.'); }
  // Article availability must not determine whether products can be loaded.
  try {
    const topics = [...new Set(serializedProducts.flatMap(p => p.technologies))].slice(0, 8);
    if (topics.length) publishedArticles = await prisma.post.findMany({ where: { published: true, OR: topics.flatMap(topic => [{ title: { contains: topic, mode: 'insensitive' as const } }, { category: { contains: topic, mode: 'insensitive' as const } }]) }, select: { slug: true, title: true, category: true, excerpt: true, readTime: true }, take: 3, orderBy: { createdAt: 'desc' } });
  } catch { console.error('Store educational links unavailable.'); }
  const categoryCounts = countCategories(serializedProducts);
  const featured = serializedProducts[0];

  // Schema.org structured data for the catalog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Digital Products & Practical Learning Resources',
    description: 'Published digital resources and clearly labeled test previews by Datta Sable.',
    url: 'https://dattasable.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: serializedProducts.filter(p => p.readiness === 'READY_FOR_SALE').map((p, index) => ({
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

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

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
            <div className={styles.heroLayout}><div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowPulse} />
              PROFESSIONAL DIGITAL RESOURCES
            </div>

            <h1 id="store-hero-heading" className={styles.heroTitle}>
              Practical Tools. Real Skills.{' '}
              <span className={styles.heroTitleHighlight}>Better Results.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Discover independent resources for working with data. Test previews are clearly labeled; only listed, verified deliverables are included.
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
            <div className={styles.heroFootnote}><span>INDEPENDENT BY DESIGN</span><span>MADE FOR DATA PROFESSIONALS</span></div>
            </div><aside className={styles.resourceDesk} aria-label="Collection preview">
              <div className={styles.deskGrid} aria-hidden="true" />
              <div className={styles.deskHeading}><span>THE RESOURCE DESK</span><BookOpen size={17}/></div>
              <div className={styles.paperBack} aria-hidden="true"/><div className={styles.paperMid} aria-hidden="true"/>
              <div className={styles.paperFront}><div className={styles.paperLabel}><span>DATTA SABLE / FIELD NOTES</span><ArrowUpRight size={18}/></div><div className={styles.paperArtwork} aria-hidden="true"><span/><span/><span/><i/></div><span className={styles.paperCategory}>{featured?.category || 'Independent resources'}</span><h2>{featured?.title || 'Your next chapter starts here.'}</h2><div className={styles.paperBottom}><span>{featured?.readiness === 'TEST_ONLY' ? 'TEST PREVIEW · DUMMY FILE' : featured ? 'EXPLORE THE COLLECTION' : 'IN PREPARATION'}</span><BookOpen size={17}/></div></div>
              <div className={styles.deskFooter}><span>Thoughtfully structured.<br/>Clearly documented.</span>{featured && <Link href={'/products/'+featured.slug} aria-label={'Explore '+featured.title}><ArrowUpRight size={20}/></Link>}</div>
            </aside></div>
          </section>

          {/* ----------------------------------------------------------------
              Trust & Value Pillars (4 Genuine Benefits)
              ---------------------------------------------------------------- */}
          <section className={styles.trustGrid} aria-labelledby="store-commitments"><h2 id="store-commitments" className="sr-only">Store commitments</h2>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <FileCheck size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h3>Practical Learning</h3>
                <p>Review each product’s published contents before deciding whether it fits your needs.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <BookOpen size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h3>Clear Documentation</h3>
                <p>File formats, requirements and delivery information appear on each product page.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <CreditCard size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h3>Secure Checkout</h3>
                <p>Test payments are verified on the server. Live payments are not enabled.</p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <DownloadCloud size={20} />
              </div>
              <div className={styles.trustInfo}>
                <h3>Digital Delivery</h3>
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
            unavailable={unavailable}
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

        <Crosshair position="br" />
      </div>

      <Footer />

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
    </>
  );
}
