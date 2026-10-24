'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowDownRight, ArrowUpRight, Check, CheckCircle2, Clock3, Loader2, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './Contact.module.css';

function SocialIcon({ network }: { network: 'github' | 'linkedin' }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={network === 'linkedin' ? 'M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.97V9.2h2.96v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.96v-4.64c0-1.1-.02-2.52-1.54-2.52-1.55 0-1.79 1.2-1.79 2.44v4.72H9.5V9.2h2.84v1.3h.04c.4-.76 1.37-1.55 2.81-1.55 3 0 3.56 1.98 3.56 4.55v5.25Z' : 'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z'} /></svg>;
}

const emptyForm = { name: '', email: '', subject: '', message: '', honeypot: '' };

export default function ContactPageClient() {
  const { data: session, status: sessionStatus } = useSession();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const submitting = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  const accountName = session?.user?.name;
  const accountEmail = session?.user?.email;
  useEffect(() => {
    if (!accountName && !accountEmail) return;
    setForm(current => ({ ...current, name: current.name || accountName || '', email: current.email || accountEmail || '' }));
  }, [accountName, accountEmail]);

  useEffect(() => {
    if (status === 'success' || status === 'error') feedback.current?.focus();
  }, [status]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || form.honeypot) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please add your name, email address, and a short message.');
      setStatus('error');
      return;
    }
    submitting.current = true;
    setStatus('loading');
    setErrorMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), subject: form.subject, message: form.message.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Your message could not be sent. Please try again or email me directly.');
      }
      setStatus('success');
      setForm(current => ({ ...emptyForm, name: current.name, email: current.email }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not connect. Please try again or email me directly.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  return <div className={styles.page}>
    <Navbar />
    <main className={styles.main}>
      <header className={styles.hero}>
        <div><div className={styles.eyebrow}><span /> LET’S CONNECT</div><h1>Good work starts with<br /><span>a conversation.</span></h1><p>A dashboard that tells the right story. A report that runs itself. A clearer view of your business. Tell me what you have in mind.</p><a href="#contact-form" className={styles.heroLink}>Start a conversation <ArrowDownRight size={17} /></a></div>
        <div className={styles.availability}><div className={styles.availabilityTop}><span className={styles.statusDot} /> OPEN TO CONVERSATIONS</div><h2>Your next idea.<br />A practical way forward.</h2><p>Business intelligence, reporting automation, and data solutions built around your goals.</p><div className={styles.availabilityFooter}><Clock3 size={14} /><span>Typically replies within 24 hours</span></div></div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.details} aria-label="Contact details">
          <div className={styles.sectionLabel}>01 / REACH OUT DIRECTLY</div>
          <h2>A direct line.<br />A real conversation.</h2><p className={styles.detailsIntro}>Have a brief ready, or simply exploring an idea? Either is a good place to start.</p>
          <a className={styles.emailCard} href="mailto:info@dattasable.com"><span className={styles.iconTile}><Mail size={20} /></span><span><small>DROP ME A NOTE</small><strong>info@dattasable.com</strong></span><ArrowUpRight size={18} /></a>
          <div className={styles.contactRows}><a href="tel:+918010803756"><Phone size={17} /><span><small>Prefer a call?</small><strong>+91 80108 03756</strong></span><ArrowUpRight size={15} /></a><div><MapPin size={17} /><span><small>Based in</small><strong>Mumbai, Maharashtra, India</strong></span></div></div>
          <div className={styles.socialSection}><div className={styles.sectionLabel}>CONNECT & EXPLORE</div><div className={styles.socialLinks}><a href="https://www.linkedin.com/in/dattasable/" target="_blank" rel="noopener noreferrer"><SocialIcon network="linkedin" /><span>LinkedIn</span><ArrowUpRight size={13} /></a><a href="https://github.com/sabledattatray" target="_blank" rel="noopener noreferrer"><SocialIcon network="github" /><span>GitHub</span><ArrowUpRight size={13} /></a></div><div className={styles.otherSocials}><a href="https://x.com/sabledattatray" target="_blank" rel="noopener noreferrer">Twitter / X <ArrowUpRight size={12} /></a><a href="https://t.me/sabledatta" target="_blank" rel="noopener noreferrer">Telegram <ArrowUpRight size={12} /></a></div></div>
          <div className={styles.approach}><span className={styles.iconTile}><ShieldCheck size={18} /></span><div><strong>Thoughtful from the first message.</strong><p>Your enquiry stays private. No mailing lists, no automated sales follow-ups.</p></div></div>
        </aside>

        <section id="contact-form" className={styles.formCard} aria-labelledby="contact-heading">
          <div className={styles.formHeader}><div><div className={styles.sectionLabel}>02 / TELL ME ABOUT IT</div><h2 id="contact-heading">What can we build together?</h2><p>A few details are all we need to get started.</p></div><span className={styles.formStamp} aria-hidden="true"><Send size={24} strokeWidth={1.3} /></span></div>
          <div className={styles.accountNote}>
            {sessionStatus === 'loading' ? <><Loader2 size={14} className={styles.spinner} /><span>Checking your account…</span></> : session?.user ? <><CheckCircle2 size={16} /><span>Signed in as <strong>{session.user.name || session.user.email}</strong>. Your details are filled in below.</span></> : <><ShieldCheck size={16} /><span>No account needed. <Link href="/sign-in?callbackUrl=%2Fcontact">Sign in to fill your details <ArrowUpRight size={11} /></Link></span></>}
          </div>
          {status === 'success' ? <div ref={feedback} tabIndex={-1} className={styles.success} role="status"><span className={styles.successIcon}><Check size={25} /></span><h3>Your message is in.</h3><p>Thanks for reaching out. I’ll review your note and get back to you at <strong>{form.email}</strong>.</p><span className={styles.responseNote}><Clock3 size={14} /> Typically within 24 hours</span><button type="button" className={styles.secondaryButton} onClick={() => setStatus('idle')}>Send another message <ArrowUpRight size={14} /></button></div> : <>
            {status === 'error' && <div ref={feedback} tabIndex={-1} className={styles.error} role="alert"><strong>Let’s try that again.</strong><p>{errorMessage}</p><a href="mailto:info@dattasable.com">Email me instead <ArrowUpRight size={12} /></a></div>}
            <form onSubmit={handleSubmit} className={styles.form} aria-busy={status === 'loading'}>
              <div hidden aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="honeypot" value={form.honeypot} onChange={handleChange} tabIndex={-1} autoComplete="off" /></div>
              <fieldset disabled={status === 'loading'}>
                <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="How should I address you?" required maxLength={120} /></div><div className={styles.field}><label htmlFor="contact-email">Email address <span>*</span></label><input id="contact-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required maxLength={254} /></div></div>
                <div className={styles.field}><label htmlFor="contact-subject">What’s on your mind? <span className={styles.optional}>Optional</span></label><select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}><option value="">Choose a topic</option><option>Dashboard Development</option><option>Data Analytics Consulting</option><option>Automation Solutions</option><option>Career Opportunities</option><option>Other</option></select></div>
                <div className={styles.field}><label htmlFor="contact-message">Tell me a little more <span>*</span></label><textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="What are you working on, and where could I help? A goal, a challenge, or an idea is a great start." rows={5} required maxLength={10000} aria-describedby="contact-message-help" /><small id="contact-message-help">If you have a timeline or project scope, feel free to include it.</small></div>
                <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>{status === 'loading' ? <><Loader2 size={16} className={styles.spinner} /> Sending your message…</> : <>Send message <ArrowUpRight size={17} /></>}</button>
              </fieldset>
              <p className={styles.privacy}><ShieldCheck size={13} /><span>Only used to respond to your enquiry. <Link href="/privacy">Privacy policy</Link></span></p>
            </form>
          </>}
        </section>
      </div>
      <section className={styles.nextSteps} aria-label="What happens next"><div><div className={styles.sectionLabel}>A SIMPLE WAY FORWARD</div><h2>From first hello<br />to a clear next step.</h2></div><div><span>01</span><h3>Share your idea</h3><p>A short brief, a challenge, or a question. Start wherever you are.</p></div><div><span>02</span><h3>Let’s find the fit</h3><p>We’ll talk through your goals, what’s involved, and how I can help.</p></div><div><span>03</span><h3>Make a plan</h3><p>A practical scope and a clear way forward, before any work begins.</p></div></section>
    </main>
    <Footer />
  </div>;
}
