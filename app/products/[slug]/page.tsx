import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import { assertCheckout } from '@/lib/commerce/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from '@/components/commerce/ProductDetailClient';
import { PRODUCT_EXTRAS } from '@/lib/commerce/catalog';
import styles from '@/components/commerce/ProductDetail.module.css';
import { FolderHeart, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.commerceProduct.findUnique({ where: { slug } }).catch(() => null);

  if (!product || product.status !== 'PUBLISHED') {
    return {
      title: 'Resource Unavailable | Datta Sable',
      robots: { index: false, follow: false },
    };
  }

  const title = product.seoTitle || `${product.title} | Datta Sable`;
  const description = product.seoDescription || product.excerpt;
  const canonicalUrl = `https://dattasable.com/products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Datta Sable',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@sabledattatray',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  const product = await prisma.commerceProduct.findUnique({
    where: { slug },
    include: {
      resources: { where: { active: true }, select: { id: true, title: true } },
    },
  }).catch(() => null);

  if (!product) notFound();

  let isAdmin = false;
  if (product.status !== 'PUBLISHED') {
    try {
      const user = await customer(true);
      isAdmin = user.role === 'ADMIN';
    } catch {
      notFound();
    }
  }

  let configured = true;
  try {
    assertCheckout();
  } catch {
    configured = false;
  }

  // Fetch relevant blog guides for learning integration
  let relatedPosts: Array<{ slug: string; title: string; category: string; readTime: number }> = [];
  try {
    relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { category: { contains: 'Fabric', mode: 'insensitive' } },
          { title: { contains: 'DP-700', mode: 'insensitive' } },
          { title: { contains: 'Fabric', mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, category: true, readTime: true },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Failed to load related posts:', err);
  }

  const extra = PRODUCT_EXTRAS[product.slug];

  // Schema.org structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        description: product.excerpt,
        category: product.category,
        url: `https://dattasable.com/products/${product.slug}`,
        offers: {
          '@type': 'Offer',
          price: (product.priceMinor / 100).toFixed(2),
          priceCurrency: product.currency,
          availability: (product.salesEnabled && product.deliveryReady) 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/PreOrder',
          url: `https://dattasable.com/products/${product.slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://dattasable.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Digital Products',
            item: 'https://dattasable.com/products',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.title,
            item: `https://dattasable.com/products/${product.slug}`,
          },
        ],
      },
      ...(extra?.faqs ? [{
        '@type': 'FAQPage',
        mainEntity: extra.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }] : []),
    ],
  };

  return (
    <>
      <Navbar />

      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Top Navigation & Breadcrumbs */}
          <nav className={styles.topNav} aria-label="Breadcrumb navigation">
            <div className={styles.breadcrumbs}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/products">Digital Products</Link>
              <span>/</span>
              <span className={styles.current}>{product.title}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/account/orders" style={{ color: 'var(--muted)', fontSize: '13px' }}>
                My Orders
              </Link>
              <Link href="/account/purchases" style={{ color: 'var(--muted)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FolderHeart size={14} />
                My Purchases
              </Link>
            </div>
          </nav>

          {/* Admin Preview Notice */}
          {product.status !== 'PUBLISHED' && (
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#fef08a',
            }}>
              <strong>Administrator Preview:</strong> Status is <code>{product.status}</code>. This product is hidden from the public index.
            </div>
          )}

          {/* Interactive Product Detail Client Component */}
          <ProductDetailClient
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              excerpt: product.excerpt,
              description: product.description,
              category: product.category,
              image: product.image,
              priceMinor: product.priceMinor,
              currency: product.currency,
              status: product.status,
              salesEnabled: product.salesEnabled,
              deliveryReady: product.deliveryReady,
              features: product.features,
              includedResources: product.includedResources,
              resourcesCount: product.resources.length,
            }}
            isConfigured={configured}
            isAdmin={isAdmin}
          />

          {/* Related Educational Blog Guides */}
          {relatedPosts.length > 0 && (
            <section style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '900px',
              margin: '0 auto',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: 'var(--text)' }}>
                Related Technical Guides & Tutorials
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
                Strengthen your theoretical and architectural knowledge with comprehensive articles from our engineering blog:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {relatedPosts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '18px',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                        {post.category}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '6px 0 10px', color: 'var(--text)' }}>
                        {post.title}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '12px' }}>
                      <span>{post.readTime} min read</span>
                      <span style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Read Guide <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
