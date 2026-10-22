'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProviders, signIn } from 'next-auth/react';
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import styles from '@/components/admin/AdminLogin.module.css';

type Mode = 'login' | 'request' | 'reset' | 'complete';
export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('mode') === 'reset') setMode('request');
    if (query.has('error')) setError('Sign-in could not be completed. Check your credentials or try another sign-in method.');
    getProviders().then(result => setProviders(Object.values(result || {}).filter(provider => provider.id !== 'credentials'))).catch(() => {});
  }, []);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  function switchMode(next: Mode) { setMode(next); setError(''); setMessage(''); setPassword(''); setConfirmation(''); setCode(''); setVisible(false); }
  async function requestCode() {
    const response = await fetch('/api/auth/admin-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request', email }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not request a code.');
    setMessage(result.success); setCooldown(60); setMode('reset');
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true);
    try {
      if (mode === 'login') {
        const result = await signIn('credentials', { email, password, callbackUrl: '/admin', redirect: false });
        if (!result?.ok || result.error) throw new Error(result?.error === 'CredentialsSignin' ? 'Email or password is incorrect.' : 'Sign-in failed. Verify your email and try again, or use password recovery.');
        window.location.assign('/admin');
      } else if (mode === 'request') await requestCode();
      else if (mode === 'reset') {
        const response = await fetch('/api/auth/admin-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset', email, code, newPassword: password, confirmPassword: confirmation }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not reset your password.');
        setPassword(''); setConfirmation(''); setCode(''); setMode('complete'); setMessage(result.success);
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not reach the server. Please try again.'); }
    finally { setBusy(false); }
  }
  const recovery = mode !== 'login';
  const heading = mode === 'login' ? 'Welcome back.' : mode === 'request' ? 'A fresh start.' : mode === 'reset' ? 'Check your inbox.' : 'You’re all set.';
  return <main className={styles.login}>
    <section className={styles.story}>
      <Link href="/" className={styles.brand}>datta sable<span>.</span></Link>
      <div className={styles.storyCopy}><div className={styles.eyebrow}><span /> YOUR PRIVATE WORKSPACE</div><h1>Great things.<br /><em>Thoughtfully<br />managed.</em></h1><p>One place for your ideas, your audience, and everything you’re building next.</p></div>
      <div className={styles.storyFooter}><ShieldCheck size={15} /><span>Datta Sable · Administration</span><span>01 / ACCESS</span></div>
    </section>
    <section className={styles.formSide}>
      <div className={styles.card}>
        <span className={styles.icon}>{recovery ? <Mail size={24} strokeWidth={1.5} /> : <LockKeyhole size={24} strokeWidth={1.5} />}</span>
        <div className={styles.eyebrow}>{recovery ? 'ACCOUNT RECOVERY' : 'ADMIN SIGN IN'}</div>
        <h2>{heading}</h2>
        <p className={styles.intro}>{mode === 'login' ? 'Sign in to your admin workspace.' : mode === 'request' ? 'Enter your administrator email to request a one-time password reset code.' : mode === 'reset' ? `Enter the six-digit code sent to your admin email (${email}). Codes expire after 10 minutes.` : 'Your password has been updated. Continue to sign in.'}</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {message && <p role="status" className={styles.message}>{message}</p>}
        {mode !== 'complete' && <form onSubmit={submit}>
          <fieldset disabled={busy}>
            {(mode === 'login' || mode === 'request') && <label htmlFor="admin-email">Email address<input id="admin-email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} /></label>}
            {mode === 'reset' && <label htmlFor="admin-code">Email verification code<input id="admin-code" className={styles.code} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} /></label>}
            {(mode === 'login' || mode === 'reset') && <label htmlFor="admin-password">{mode === 'reset' ? 'New password' : 'Password'}<div className={styles.password}><input id="admin-password" type={visible ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'reset' ? 12 : undefined} required placeholder={mode === 'reset' ? 'At least 12 characters' : 'Enter your password'} value={password} onChange={event => setPassword(event.target.value)} /><button type="button" onClick={() => setVisible(value => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}
            {mode === 'reset' && <><label htmlFor="admin-confirm">Confirm new password<input id="admin-confirm" type="password" autoComplete="new-password" required minLength={12} value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder="Enter the new password again" /></label><p className={styles.hint}>12 characters minimum · 72 UTF-8 bytes maximum. All existing sessions will be signed out.</p></>}
            {mode === 'login' && <button type="button" className={styles.textButton} onClick={() => switchMode('request')}>Forgot your password?</button>}
            <button className={styles.primary} type="submit">{busy ? <Loader2 size={16} className={styles.spinning} /> : null}{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to workspace' : mode === 'request' ? 'Send email code' : 'Reset password'}{!busy && <ArrowUpRight size={16} />}</button>
          </fieldset>
        </form>}
        {mode === 'login' && providers.length > 0 && <><div className={styles.divider}>or continue with</div><div className={styles.socials}>{providers.map(provider => <button disabled={busy} key={provider.id} onClick={async () => { setBusy(true); setError(''); try { await signIn(provider.id, { callbackUrl: '/admin' }); } catch { setError('Social sign-in is unavailable. Please try again.'); setBusy(false); } }}>{provider.name}</button>)}</div></>}
        {mode === 'reset' && <div className={styles.recoveryActions}><button className={styles.textButton} disabled={busy || cooldown > 0} onClick={async () => { setBusy(true); setError(''); try { await requestCode(); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not send code.'); } finally { setBusy(false); } }}>{cooldown ? `Resend in ${cooldown}s` : 'Resend code'}</button><button className={styles.textButton} disabled={busy} onClick={() => switchMode('request')}>Change email</button></div>}
        {recovery && <button disabled={busy} className={mode === 'complete' ? styles.primary : styles.back} onClick={() => switchMode('login')}><ArrowLeft size={14} /> Back to sign in</button>}
        <div className={styles.security}><ShieldCheck size={13} /> Private access · Administrator accounts only</div>
      </div>
    </section>
  </main>;
}
