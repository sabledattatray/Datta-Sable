import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import { money } from '@/lib/commerce/format';
import SignInNotice from '@/components/commerce/SignInNotice';
import styles from '@/components/commerce/Commerce.module.css';
export default async function OrdersPage() {
  let user; try { user = await customer(); } catch { return <SignInNotice />; }
  const orders = await prisma.commerceOrder.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: 'desc' }, take: 100 }).catch(() => null);
  return <><h1>My orders</h1>{orders === null ? <p role="alert">Orders could not be loaded. Please reload the page.</p> : !orders.length ? <p>You have no orders yet. <Link href="/products">Explore learning resources.</Link></p> : orders.map(order => <article key={order.id} className={styles.panel}><span className={styles.badge}>{order.mode.toUpperCase()} MODE</span><span className={styles.badge}>{order.status}</span><h2>{order.items.map(i => i.title).join(', ')}</h2><p>{order.number}</p><p>{money(order.totalMinor, order.currency)} · {order.createdAt.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p><Link href={`/account/orders/${order.id}`}>View payment, receipt and resources →</Link></article>)}</>;
}
