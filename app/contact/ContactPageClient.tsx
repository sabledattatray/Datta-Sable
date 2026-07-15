'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Crosshair from '@/components/Crosshair';
import { signIn, useSession } from 'next-auth/react';

export default function ContactPageClient() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message');
      }
      setStatus('success');
      setErrorMessage(null);
      setForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { label: 'Email', value: 'info@dattasable.com', href: 'mailto:info@dattasable.com', color: 'var(--accent)', icon: <Mail size={18} /> },
    { label: 'Phone', value: '+91 80108 03756', href: 'tel:+918010803756', color: 'var(--accent2)', icon: <Phone size={18} /> },
    { label: 'Location', value: 'Mumbai, Maharashtra, India', href: '#', color: 'var(--accent3)', icon: <MapPin size={18} /> },
  ];

  const socials = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, label: 'LinkedIn', href: 'https://www.linkedin.com/in/dattasable/', color: '#0077b5' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, label: 'GitHub', href: 'https://github.com/sabledattatray', color: 'var(--text)' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>, label: 'X (Twitter)', href: 'https://x.com/sabledattatray', color: 'var(--text)' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.16.12.1.16.23.18.33.02.11.02.31.01.45z"/></svg>, label: 'Telegram', href: 'https://t.me/sabledatta', color: '#0088cc' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', justifyContent: 'center' }}>ESTABLISH-CONTACT</div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 48px)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                Let&apos;s <span className="hero-title">Connect</span>
              </h1>
              <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
                Have a project in mind, need expert BI consulting, or just want to discuss data strategy? I&apos;m available for freelance projects and consulting engagements. Reach out via the form below or directly by email.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '3rem', alignItems: 'start' }}>
              {/* Left column */}
              <div>
                <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ width: 10, height: 10, background: 'var(--accent3)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent3)' }} />
                    <span style={{ color: 'var(--accent3)', fontWeight: 600, fontSize: '0.9rem' }}>Available for Work</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    Currently accepting freelance projects and consulting engagements. Typical response time: <span style={{ color: 'var(--text)' }}>under 24 hours</span>.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {contactInfo.map(item => (
                    <a key={item.label} href={item.href} className="card flex items-center gap-3" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}22`, color: item.color }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>{item.label}</div>
                        <div style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div className="mono" style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Network-Nodes</div>
                  <div className="flex flex-wrap gap-4">
                    {socials.map(s => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                        className="group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', textDecoration: 'none' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = s.color;
                          (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                          (e.currentTarget as HTMLElement).style.background = `${s.color}15`;
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${s.color}33`;
                          (e.currentTarget as HTMLElement).style.transform = `translateY(-3px)`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                          (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                          (e.currentTarget as HTMLElement).style.transform = `translateY(0)`;
                        }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" style={{ background: `radial-gradient(circle at center, ${s.color}22 0%, transparent 70%)` }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>{s.icon}</div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', background: 'var(--surface2)' }}>
                  <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '1.25rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                    {session ? `Connected as ${session.user?.name}` : 'One-Tap Connect'}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button title="Login with Google" onClick={() => signIn('google')} className="flex items-center justify-center h-10 rounded-none border border-[var(--border)] hover:bg-[var(--tag-bg)] transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </button>
                    <button title="Login with LinkedIn" onClick={() => signIn('linkedin')} className="flex items-center justify-center h-10 rounded-none border border-[var(--border)] hover:bg-[#0077b5]/5 transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </button>
                    <button title="Login with GitHub" onClick={() => signIn('github')} className="flex items-center justify-center h-10 rounded-none border border-[var(--border)] hover:bg-[var(--tag-bg)] transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text)' }}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column / Contact form */}
              <div>
                <div className="card" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Send a Message</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Fill out the form and I&apos;ll get back to you within 24 hours.</p>

                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent3)' }}>
                      <CheckCircle size={18} />
                      <span style={{ fontSize: '0.9rem' }}>Message sent! I&apos;ll reply within 24 hours.</span>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(201, 243, 29, 0.05)', border: '1px solid rgba(201, 243, 29, 0.2)', color: 'var(--accent)' }}>
                      <AlertCircle size={18} />
                      <span style={{ fontSize: '0.9rem' }}>{errorMessage || 'Failed to send message. Please try again.'}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input type="text" name="honeypot" value={form.honeypot} onChange={handleChange} style={{ display: 'none' }} tabIndex={-1} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
                      {[{ name: 'name', label: 'Your Name', type: 'text' }, { name: 'email', label: 'Email Address', type: 'email' }].map(field => (
                        <div key={field.name}>
                          <label htmlFor={`contact-${field.name}`} style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{field.label}</label>
                          <input
                            id={`contact-${field.name}`}
                            type={field.type} name={field.name} value={form[field.name as keyof typeof form]} onChange={handleChange} required
                            style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="contact-subject" style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</label>
                      <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: form.subject ? 'var(--text)' : 'var(--muted)', fontSize: '0.9rem', outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
                        <option value="">Select a topic...</option>
                        <option value="Dashboard Development">Dashboard Development</option>
                        <option value="Data Analytics Consulting">Data Analytics Consulting</option>
                        <option value="Automation Solutions">Automation Solutions</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-message" style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</label>
                      <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required rows={5}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'Space Grotesk, sans-serif', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" disabled={status === 'loading'} className="btn-primary flex items-center justify-center gap-2" style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                      {status === 'loading' ? 'Sending...' : <><Send size={16} /> Send Message</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Crosshair position="br" />
      </div>
      <Footer />
    </div>
  );
}
