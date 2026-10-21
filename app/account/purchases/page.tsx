import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import SignInNotice from '@/components/commerce/SignInNotice';
import styles from '@/components/commerce/Commerce.module.css';
export default async function PurchasesPage() {
  let user; try { user = await customer(); } catch { return <SignInNotice />; }
  const purchases = await prisma.commerceEntitlement.findMany({ where: { order: { userId: user.id } }, include: { product: { include: { resources: { where: { active: true }, select: { id: true, title: true } } } }, order: { select: { status: true, id: true } } }, orderBy: { grantedAt: 'desc' } }).catch(() => null);
  return <><h1>My purchases</h1>{purchases === null ? <p role="alert">Purchases are temporarily unavailable. Please reload the page.</p> : !purchases.length ? <p>Your purchased resources will appear here after verified payment.</p> : purchases.map(p => <article key={p.id} className={styles.panel}><h2>{p.product.title}</h2><span className={styles.badge}>{p.status}</span>{p.status === 'ACTIVE' && p.order.status === 'PAID' && p.product.deliveryReady ? <ul>{p.product.resources.map(r => <li key={r.id}><a href={`/api/commerce/downloads/${r.id}`}>{r.title} · Download</a></li>)}</ul> : <p>Resource access is currently unavailable. <Link href={`/account/orders/${p.order.id}`}>View order status and support.</Link></p>}</article>)}</>;
}
