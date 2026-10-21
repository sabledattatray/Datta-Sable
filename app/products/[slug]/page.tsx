import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import { assertCheckout } from '@/lib/commerce/config';
import { money } from '@/lib/commerce/format';
import StoreShell from '@/components/commerce/StoreShell';
import Checkout from '@/components/commerce/Checkout';
import styles from '@/components/commerce/Commerce.module.css';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.commerceProduct.findUnique({ where: { slug } }).catch(() => null);
  return product?.status === 'PUBLISHED' ? { title: product.seoTitle || product.title, description: product.seoDescription || product.excerpt, alternates: { canonical: `/products/${slug}` } } : { title: 'Resource unavailable', robots: { index: false, follow: false } };
}
export default async function ProductPage({ params }: Props) {
  const product = await prisma.commerceProduct.findUnique({ where: { slug: (await params).slug }, include: { resources: { where: { active: true }, select: { id: true } } } }).catch(() => null);
  if (!product) notFound();
  if (product.status !== 'PUBLISHED') { try { await customer(true); } catch { notFound(); } }
  let configured = true; try { assertCheckout(); } catch { configured = false; }
  return <StoreShell><p className={styles.kicker}>{product.category}</p>{product.status !== 'PUBLISHED' && <p className={styles.notice}>Administrator preview · {product.status} · hidden from the public catalog</p>}<h1>{product.title}</h1><p>{product.excerpt}</p><div className={styles.grid}><section className={styles.panel}><h2>About this package</h2>{product.image && <Image className={styles.image} src={product.image} alt={product.title} width={720} height={405} sizes="(max-width: 650px) 90vw, 50vw" />}<p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p><h3>What’s planned / included</h3><ul>{product.features.map(f => <li key={f}>{f}</li>)}</ul><h3>Resources</h3><ul>{product.includedResources.map(r => <li key={r}>{r}</li>)}</ul></section><aside className={styles.panel}><span className={styles.badge}>ONE-TIME PURCHASE</span><div className={styles.price}>{money(product.priceMinor, product.currency)}</div><p>The displayed amount and currency are the checkout amount and currency. No automatic currency conversion is applied.</p><Checkout amountMinor={product.priceMinor} currency={product.currency} productId={product.id} title={product.title} available={configured && product.status === 'PUBLISHED' && product.salesEnabled && product.deliveryReady && product.resources.length > 0} /><p className={styles.small}>Independent training. Not affiliated with or endorsed by Microsoft. Microsoft certification examination fees are not included.</p></aside></div></StoreShell>;
}
