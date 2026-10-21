import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import { productDetailsMap } from '@/lib/commerce/product-settings';
import { resourceFormatLabel } from '@/lib/commerce/product-details';
import SignInNotice from '@/components/commerce/SignInNotice';
import styles from '@/components/commerce/Commerce.module.css';
export default async function PurchasesPage() {
  let user; try { user = await customer(); } catch { return <SignInNotice />; }
  const purchases = await prisma.commerceEntitlement.findMany({ where: { order: { userId: user.id } }, include: { product: { include: { resources: { where: { active: true }, select: { id: true, title: true, pathname: true } } } }, order: { select: { status: true, mode: true, id: true, paidAt: true } } }, orderBy: { grantedAt: 'desc' } }).catch(() => null);
  const metadata = await productDetailsMap(purchases?.map(p => p.productId) || []).catch(() => new Map());
  return <><h1>My purchases</h1><p>Your verified purchases and currently available files. Use the same account used at checkout.</p>{purchases === null ? <p role="alert">Purchases are temporarily unavailable. Please reload or <a href="mailto:orders@dattasable.com">contact support</a>.</p> : !purchases.length ? <section className={styles.panel}><h2>Your library starts here.</h2><p>Resources appear after verified payment.</p><Link href="/products">Explore published products</Link></section> : purchases.map(p => {
    const details=metadata.get(p.productId), allowed=p.status==='ACTIVE'&&p.order.status==='PAID'&&p.product.deliveryReady;
    return <article key={p.id} className={styles.panel}><span className={styles.badge}>{p.order.mode.toUpperCase()} MODE</span><span className={styles.badge}>{p.order.status}</span><h2>{p.product.title}</h2><p>Purchase date: {(p.order.paidAt||p.grantedAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})}</p>{details?.version&&<p>Available version: {details.version}</p>}<p>{p.order.mode==='test'?'Test entitlement only; this is not a commercial course license.':details?.license||'Contact support for license details.'}</p>
      {allowed && p.product.resources.length ? <ul>{p.product.resources.map(r => <li key={r.id}><a href={'/api/commerce/downloads/'+r.id}>{r.title} · {resourceFormatLabel(r.pathname)} · Download</a></li>)}</ul> : <p>{allowed?'No files are currently available. Contact support with your order reference.':'Download access is currently unavailable. Review payment or refund status below.'}</p>}
      <div className={styles.actions}><Link href={'/account/orders/'+p.order.id}>Order and receipt status</Link><a href="mailto:orders@dattasable.com">Purchase support</a></div><p className={styles.small}>Download links expire shortly after issue. Return here for a fresh authorized link.</p></article>;
  })}</>;
}
