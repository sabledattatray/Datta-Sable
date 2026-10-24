'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, Mail, Loader2 } from 'lucide-react';
import styles from './HomeFinish.module.css';

export default function FinalCTA() {
  const [email,setEmail]=useState('');
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error,setError]=useState('');
  async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(status==='loading') return;
    setStatus('loading');setError('');
    try {
      const response=await fetch('/api/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      if(!response.ok) throw new Error('Subscription could not be saved. Please try again.');
      setStatus('success');setEmail('');
    } catch {setStatus('error');setError('Subscription could not be saved. Please try again.');}
  }
  return <section className={styles.newsletterSection} aria-labelledby="newsletter-title"><div className="container"><div className={styles.newsletter}>
    <div className={styles.newsletterCopy}><span className={styles.eyebrow}><Mail size={14}/> THE NEXT GOOD IDEA</span><h2 id="newsletter-title" className={styles.title}>A little insight.<br/><span>A lot to build on.</span></h2><p>Get practical tutorials, thoughtful technical tips, and useful resources on data, BI, and modern engineering.</p><div className={styles.newsletterBenefits}>{['Technical guides','Practical ideas','Useful resources'].map(t=><span key={t}><Check size={12}/>{t}</span>)}</div>
      {status==='success'?<div className={styles.success} role="status"><CheckCircle2 size={20}/><div><strong>You’re on the list.</strong><span>Thanks for subscribing. Keep exploring while you’re here.</span></div></div>:<form onSubmit={handleSubmit} className={styles.signup}>
        <label htmlFor="home-newsletter-email">Your email address</label><div className={styles.inputRow}><input id="home-newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} aria-describedby="newsletter-privacy newsletter-error" disabled={status==='loading'}/><button type="submit" disabled={status==='loading'}>{status==='loading'?<>Joining <Loader2 size={16} className={styles.spinner}/></>:<>Count me in <ArrowRight size={16}/></>}</button></div><p id="newsletter-error" className={styles.formError} role="alert">{error}</p>
      </form>}
      <p id="newsletter-privacy" className={styles.privacy}>Unsubscribe anytime. Read our <Link href="/privacy">privacy policy</Link>.</p>
    </div>
    <div className={styles.mailArt} aria-hidden="true"><div className={styles.mailArtwork}><div className={styles.mailOrbit}/><div className={styles.letter}><div className={styles.letterTop}><span>DATTA SABLE</span><Mail size={15}/></div><span className={styles.letterLabel}>NOTES FOR THE CURIOUS</span><strong>Good ideas.<br/>Clear thinking.</strong><div className={styles.letterLines}><i/><i/><i/></div><div className={styles.letterBottom}><span>LEARN / BUILD / REPEAT</span><ArrowRight size={14}/></div></div><div className={styles.envelope}/></div><span className={styles.mailCaption}>A thoughtful addition to your inbox.</span></div>
  </div></div></section>;
}
