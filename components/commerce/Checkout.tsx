'use client';
import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import LoginModal from '@/components/LoginModal';
import styles from './Commerce.module.css';
import { money } from '@/lib/commerce/format';
import { readSessionStorage, writeSessionStorage } from '@/lib/browser-storage';
import { trackBeginCheckout } from '@/lib/commerce/analytics';

type CheckoutResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type CheckoutOptions = { key: string; amount: number; currency: string; order_id: string; name: string; description: string; prefill: { name: string; email: string }; handler: (response: CheckoutResponse) => void; modal: { ondismiss: () => void } };
declare global { interface Window { Razorpay?: new (options: CheckoutOptions) => { open: () => void; on: (name: string, handler: () => void) => void } } }
let scriptPromise: Promise<void> | undefined;
export function loadCheckout() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
  if (existing) {
    if (window.Razorpay) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Checkout could not load. Please check your internet connection or ad blocker.')));
    });
  }
  return scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    const nonceEl = document.querySelector<HTMLScriptElement>('script[nonce]');
    if (nonceEl?.nonce) {
      script.nonce = nonceEl.nonce;
    }
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      scriptPromise = undefined;
      reject(new Error('Checkout could not load. Please check your ad blocker or connection and try again.'));
    };
    document.head.appendChild(script);
  });
}
export default function Checkout({ productId, title, available, requestKey: savedKey, amountMinor, currency, testMode = true }: { productId: string; title: string; available: boolean; requestKey?: string; amountMinor: number; currency: string; testMode?: boolean }) {
  const { status } = useSession(); const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [login, setLogin] = useState(false), [terms, setTerms] = useState(false);
  const attempt = useRef<string | undefined>(savedKey);
  async function buy() {
    if (status !== 'authenticated') { setLogin(true); return; }
    setBusy(true); setMessage('');
    try {
      await loadCheckout();
      const storageKey = `commerce-attempt:${productId}`;
      const requestKey = attempt.current || readSessionStorage(storageKey) || crypto.randomUUID();
      attempt.current = requestKey; writeSessionStorage(storageKey, requestKey);
      const response = await fetch('/api/commerce/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, requestKey }) });
      const order = await response.json(); if (!response.ok) throw new Error(order.error || 'Could not create order.');
      if (order.amount !== amountMinor || order.currency !== currency) { setMessage(`This order uses ${money(order.amount, order.currency)}. Review its exact price in My Orders before continuing.`); setBusy(false); return; }
      const isOrderTest = order.key.startsWith('rzp_test_');
      trackBeginCheckout({ item_id: productId, item_name: title, price: order.amount / 100, currency: order.currency, testOnly: isOrderTest });
      const checkout = new window.Razorpay!({ key: order.key, amount: order.amount, currency: order.currency, order_id: order.razorpayOrderId, name: isOrderTest ? 'Datta Sable · TEST MODE' : 'Datta Sable', description: title, prefill: { name: order.name, email: order.email },
        handler: async result => {
          setMessage('Verifying payment. Please keep this page open.');
          try {
            const verified = await fetch('/api/commerce/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, paymentId: result.razorpay_payment_id, razorpayOrderId: result.razorpay_order_id, signature: result.razorpay_signature }) });
            if (!verified.ok && verified.status !== 202) { const error = await verified.json(); setMessage(error.error || 'Verification is pending.'); }
          } finally { window.location.assign(`/checkout/success?order=${encodeURIComponent(order.id)}`); }
        }, modal: { ondismiss: () => { setBusy(false); setMessage('Checkout closed. Your pending order can be resumed safely from My Orders.'); } } });
      checkout.on('payment.failed', () => { setBusy(false); setMessage('Payment was not confirmed. Check My Orders before retrying.'); }); checkout.open();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Checkout unavailable.'); setBusy(false); }
  }
  return <div className={styles.checkout}>{testMode && <div className={styles.notice}>Test mode only. Live purchases are not enabled.</div>}{available ? <><label><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />I have read the <a href="/terms">terms</a>, <a href="/privacy">privacy policy</a>, <a href="/refund-policy">refund policy</a>, and <a href="/delivery-policy">delivery policy</a>.</label><button className={styles.primary} disabled={busy || !terms || status === 'loading'} onClick={buy}>{busy ? 'Processing…' : status === 'authenticated' ? (testMode ? 'Open test checkout' : 'Buy Now') : 'Sign in to purchase'}</button></> : <p>Purchasing is unavailable while this package or its checkout configuration is being prepared.</p>}{message && <p aria-live="polite" role="status" className={styles.notice}>{message}</p>}<LoginModal isOpen={login} onClose={() => setLogin(false)} callbackUrl={typeof window === 'undefined' ? undefined : window.location.href} /></div>;
}
