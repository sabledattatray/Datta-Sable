import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StoreShell from '@/components/commerce/StoreShell';
import styles from '@/components/commerce/Commerce.module.css';
import { money } from '@/lib/commerce/format';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Learning resources', description: 'Independent learning resources by Datta Sable.', alternates: { canonical: '/products' } };
export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof prisma.commerceProduct.findMany>> = []; let unavailable = false;
  try { products = await prisma.commerceProduct.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } }); } catch { unavailable = true; }
  return <StoreShell><p className={styles.kicker}>THE LEARNING COLLECTION</p><h1>Build your next capability.</h1><p>Independent guides and practical resources for your data journey.</p>{unavailable ? <p role="status" className={styles.notice}>The product catalog is being prepared. Please check back soon.</p> : !products.length ? <div className={styles.panel}><h2>Something useful is taking shape.</h2><p>New learning resources will appear here when they are ready.</p></div> : <div className={styles.grid}>{products.map(p => <article key={p.id} className={styles.panel}><span className={styles.badge}>{p.category}</span><h2><Link href={`/products/${p.slug}`}>{p.title}</Link></h2><p>{p.excerpt}</p><div className={styles.price}>{money(p.priceMinor, p.currency)}</div><Link href={`/products/${p.slug}`}>Explore the package →</Link></article>)}</div>}</StoreShell>;
}
