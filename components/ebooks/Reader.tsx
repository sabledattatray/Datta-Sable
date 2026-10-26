'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { loadCheckout } from '@/components/commerce/Checkout';
import { money } from '@/lib/commerce/format';
import { readSessionStorage, writeSessionStorage } from '@/lib/browser-storage';
import s from './Books.module.css';

async function api(path: string, data?: unknown) {
  const response = await fetch(`/api/ebooks/${path}`, data === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Please try again shortly.'); return result;
}
export function GuestAccess() {
  const [email,setEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  return <form className={s.form} onSubmit={async e=>{e.preventDefault();setBusy(true);try{const result=await api('access/request',{email});setMessage(result.message);}catch(error){setMessage(error instanceof Error?error.message:'Access unavailable.');}finally{setBusy(false);}}}><p>Verify your email to purchase as a guest or retrieve previous purchases. No account is required.</p><label className={s.field}>Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><button className={s.button} disabled={busy}>{busy?'Requesting…':'Email me an access link'}</button><p className={s.note}>Links expire after 30 minutes. Your email is used for purchase access and receipts.</p>{message&&<p className={s.notice} role="status">{message}</p>}<Link href="/sign-in?callbackUrl=%2Febooks%2Flibrary">Sign in with an existing account</Link></form>;
}
export function AccessLink() {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),token=useRef('');
  useEffect(()=>{token.current=new URLSearchParams(window.location.hash.slice(1)).get('token')||'';window.history.replaceState(null,'','/ebooks/access');},[]);
  return <div className={s.form}><p>Confirm below to verify your email and open a private library session on this device.</p><button disabled={busy} className={s.button} onClick={async()=>{setBusy(true);try{await api('access/consume',{token:token.current});window.location.replace('/ebooks/library');}catch(error){setMessage(error instanceof Error?error.message:'Access unavailable.');setBusy(false);}}}>Verify email and open library</button>{message&&<p className={s.notice} role="alert">{message}</p>}<Link href="/ebooks/library">Request a fresh link</Link></div>;
}
export function BuyBook({ productId, title, amount, available, testMode = true }: { productId: string; title: string; amount: number; available: boolean; testMode?: boolean }) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[terms,setTerms]=useState(false);
  return <div id="purchase" className={s.form} style={{scrollMarginTop:100}}><div className={s.notice}>{testMode ? "Test checkout · no real payment is collected." : "Secure payment through Razorpay. Access follows verified payment."}</div>{available?<><label className={s.check}><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)}/><span>I accept the <Link href="/terms">terms</Link>, <Link href="/privacy">privacy</Link>, <Link href="/delivery-policy">delivery</Link> and <Link href="/refund-policy">refund policies</Link>.</span></label><button className={s.button} disabled={!terms||busy} onClick={async()=>{
    setBusy(true);setMessage('');
    try{
      const key=`ebook-attempt:${productId}`;const requestKey=readSessionStorage(key)||crypto.randomUUID();writeSessionStorage(key,requestKey);
      const order=await api('orders',{productId,requestKey});
      if(order.key.startsWith('rzp_test_')!==testMode)throw new Error('Payment mode changed. Reload this page before continuing.');
      if(order.amount!==amount||order.currency!=='INR')throw new Error('The price has changed. Reload this page and review it before continuing.');
      await loadCheckout();
      const checkout=new window.Razorpay!({key:order.key,amount:order.amount,currency:order.currency,order_id:order.razorpayOrderId,name:testMode?'Datta Sable · TEST MODE':'Datta Sable',description:title,prefill:{name:order.name,email:order.email},handler:async result=>{setMessage('Payment processing. Checking with the payment provider…');try{await api('verify',{orderId:order.id,paymentId:result.razorpay_payment_id,razorpayOrderId:result.razorpay_order_id,signature:result.razorpay_signature});}catch{setMessage('Verification is pending. Check your library before retrying.');}finally{window.location.assign('/ebooks/library');}},modal:{ondismiss:()=>{setBusy(false);setMessage('Checkout closed. Check your library to reconcile this order before retrying.');}}});checkout.on('payment.failed',()=>{setBusy(false);setMessage('Payment not confirmed. Check the order in your library before retrying.');});checkout.open();
    }catch(error){setMessage(error instanceof Error?error.message:'Checkout unavailable.');setBusy(false);}
  }}>{busy?'Processing…':`Buy for ${money(amount,'INR')}${testMode ? ' · test' : ''}`}</button><Link href="/ebooks/library">Verify guest email or open your library</Link></>:<><button className={s.button} disabled aria-describedby="purchase-unavailable">Buy for {money(amount,'INR')}</button><p id="purchase-unavailable" role="status">Currently unavailable. Purchasing will open after this edition is approved.</p></>}{message&&<p role="status" className={s.notice}>{message}</p>}</div>;
}
type Order = {id:string;number:string;requestKey:string;status:string;totalMinor:number;currency:string;items:{title:string;productId:string;product:{slug:string}}[];entitlements:{id:string;productId:string;status:string}[]};
export function Library() {
  const [orders,setOrders]=useState<Order[]|null>(null),[message,setMessage]=useState(''),[access,setAccess]=useState(false),[busy,setBusy]=useState(false);
  async function load(){try{const data=await api('library');setOrders(data.orders);setAccess(true);setMessage('');}catch(error){setMessage(error instanceof Error?error.message:'Library unavailable.');}}
  useEffect(()=>{let active=true;api('library').then(data=>{if(active){setOrders(data.orders);setAccess(true);}}).catch(error=>{if(active)setMessage(error.message);});return()=>{active=false;};},[]);
  async function action(path:string,data:unknown){setBusy(true);try{const result=await api(path,data);if(result.url)window.location.assign(result.url);else await load();}catch(error){setMessage(error instanceof Error?error.message:'Please try again.');}finally{setBusy(false);}}
  return <>{message&&<p className={s.notice} role="status">{message}</p>}{!access?<GuestAccess/>:<><div className={s.actions}><button className={s.secondary} onClick={load}>Refresh library</button><button className={s.secondary} onClick={async()=>{await api('logout',{});window.location.reload();}}>End guest session</button></div>{orders?.length===0&&<p className={s.empty}>Your library is empty. <Link href="/ebooks">Explore eBooks</Link>.</p>}<div className={s.grid}>{orders?.map(order=><article className={s.card} key={order.id}><p className={s.eyebrow}>{order.status==='PAID'?'PAYMENT CONFIRMED':order.status==='PENDING'?'PAYMENT PROCESSING':order.status}</p><h2>{order.items.map(i=>i.title).join(', ')}</h2><p>{money(order.totalMinor,order.currency)}</p><p className={s.note}>{order.number}</p>{order.status==='PENDING'&&order.items[0]&&<Link className={s.secondary} href={'/ebooks/'+order.items[0].product.slug} onClick={()=>writeSessionStorage('ebook-attempt:'+order.items[0].productId,order.requestKey)}>Resume checkout</Link>}{order.status==='PENDING'&&<button className={s.secondary} disabled={busy} onClick={()=>action('reconcile',{id:order.id})}>Check payment status</button>}{order.entitlements.filter(e=>e.status==='ACTIVE'&&order.status==='PAID').map(e=><button key={e.id} className={s.button} disabled={busy} onClick={()=>action('grant',{id:e.id})}>Access PDF</button>)}</article>)}</div></>}</>;
}
export function Download({ token }: { token: string }) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const grant=useRef('');
  useEffect(()=>{grant.current=token==='access'?new URLSearchParams(window.location.hash.slice(1)).get('token')||'':token;window.history.replaceState(null,'','/ebooks/download/access');},[token]);
  return <div className={s.form}><p>Your private link expires after five minutes. The file opens through a signed link valid for one minute.</p><button className={s.button} disabled={busy} onClick={async()=>{setBusy(true);try{const result=await api('download',{token:grant.current});window.location.assign(result.url);}catch(error){setMessage(error instanceof Error?error.message:'Download unavailable.');}finally{setBusy(false);}}}>Open PDF</button>{message&&<p role="status" className={s.notice}>{message}</p>}<Link href="/ebooks/library">Return to library</Link></div>;
}


