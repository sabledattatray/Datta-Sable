'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Checkout from './Checkout';
import { money } from '@/lib/commerce/format';
import styles from './Commerce.module.css';
import { trackVerifiedPurchase } from '@/lib/commerce/analytics';
type Order = { mode: string; id: string; number: string; status: string; totalMinor: number; currency: string; paidAt: string | null; requestKey: string; items: { title: string; productId: string; unitPriceMinor: number }[]; payments: { providerId: string; status: string }[]; emails: { id: string; kind: string; status: string }[] };
export default function OrderStatus({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    let stopped = false, timer: ReturnType<typeof setTimeout>; let checks = 0;
    async function check() {
      try { const r = await fetch(`/api/commerce/orders/${encodeURIComponent(id)}`, { cache: 'no-store' }); const data = await r.json(); if (!r.ok) throw new Error(data.error); if (stopped) return; setOrder(data); trackVerifiedPurchase(data); setError(''); if ((data.status === 'PENDING' || data.emails?.some((e: { status: string }) => ['PENDING', 'RETRY', 'SENDING'].includes(e.status))) && checks++ < 60) timer = setTimeout(check, 3000); }
      catch (e) { if (!stopped) setError(e instanceof Error ? e.message : 'Could not load order.'); }
    }
    check(); return () => { stopped = true; clearTimeout(timer); };
  }, [id]);
  async function reconcile() { setBusy(true); try { const r = await fetch('/api/commerce/reconcile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); window.location.reload(); } catch (e) { setError(e instanceof Error ? e.message : 'Reconciliation failed.'); setBusy(false); } }
  return <>{error && <p role="alert" className={styles.error}>{error}</p>}{!order ? <p role="status">{error ? 'Order details could not be loaded. Please reload or contact support.' : 'Loading verified order details…'}</p> : <><p className={styles.kicker}>{order.mode === 'live' ? 'ORDER DETAILS' : 'TEST MODE · ORDER DETAILS'}</p><h1>{order.status === 'PAID' ? 'Payment confirmed.' : order.status === 'REFUNDED' ? 'Payment refunded.' : 'Payment processing.'}</h1><section className={styles.panel}><h2>{order.items.map(i => i.title).join(', ')}</h2><p>{order.number}</p><div className={styles.price}>{money(order.totalMinor, order.currency)}</div><span className={styles.badge}>{order.status}</span>{order.paidAt && <p>Payment date: {new Date(order.paidAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>}{order.payments.map(p => <p className={styles.small} key={p.providerId}>{p.providerId} · {p.status}</p>)}{order.emails.filter(e => e.kind === 'RECEIPT').map(e => <p key={e.id}>Receipt email: {e.status === 'ACCEPTED' ? 'Accepted by email provider; inbox delivery is not confirmed.' : e.status}</p>)}{order.status === 'PENDING' && <><p>Do not start a second purchase while verification is pending. Check the provider status below, or resume this same order.</p><button disabled={busy} onClick={reconcile}>{busy ? 'Checking…' : 'Check payment status'}</button><Checkout testMode={order.mode !== 'live'} amountMinor={order.totalMinor} currency={order.currency} productId={order.items[0].productId} title={order.items[0].title} available requestKey={order.requestKey} /></>}<div className={styles.actions}><Link href="/account/purchases">Open my purchases →</Link><Link href="/contact">Order support</Link></div><p className={styles.small}>This is a payment receipt, not a tax invoice.</p></section></>}</>;
}
