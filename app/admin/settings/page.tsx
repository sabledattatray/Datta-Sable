'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Save, LockKeyhole, ShieldCheck, Mail, ArrowUpRight, Loader2 } from 'lucide-react';
import { updateAdminPassword } from './actions';
import styles from '@/components/admin/AdminCommon.module.css';

type PasswordFields = { currentPassword: string; newPassword: string; confirmPassword: string };
const fields: { id: keyof PasswordFields; label: string; hint: string }[] = [
  { id: 'currentPassword', label: 'Current password', hint: 'Enter your current password' },
  { id: 'newPassword', label: 'New password', hint: 'At least 12 characters' },
  { id: 'confirmPassword', label: 'Confirm new password', hint: 'Enter your new password again' },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<PasswordFields>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const result = await updateAdminPassword(form);
      if (result.error) setMessage({ type: 'error', text: result.error });
      else if (result.success) {
        setMessage({ type: 'success', text: result.success });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not reach the server. Please try again.' });
    } finally { setLoading(false); }
  }

  return <div className={styles.page}>
    <header className={styles.header}>
      <div className={styles.headerCopy}>
        <div className={styles.eyebrow}><span className={styles.eyebrowDot} /> SYSTEM CONFIGURATION</div>
        <h1 className={styles.title}>Your workspace.<br /><span className={styles.titleAccent}>Your peace of mind.</span></h1>
        <p className={styles.subtitle}>Manage your admin password and keep a reliable way back into your account.</p>
      </div>
      <span className={styles.badge}><ShieldCheck size={13} /> Administrator settings</span>
    </header>
    <div className={styles.detailGrid}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div className={styles.sectionTitle}><span className={styles.sectionIcon}><LockKeyhole size={19} /></span><div><h2>Change password</h2><p>Protect your administrator account.</p></div></div></div>
        {message && <div role={message.type === 'error' ? 'alert' : 'status'} className={styles.notice}>{message.text}</div>}
        {message?.type === 'success' ? <button className={styles.primary} onClick={() => signOut({ callbackUrl: '/admin/login' })}>Sign in with your new password <ArrowUpRight size={15} /></button> : <form onSubmit={submit}>
          <fieldset disabled={loading} className={styles.fieldset}>
            {fields.map(field => <div className={styles.field} key={field.id}>
              <label htmlFor={field.id} className={styles.label}>{field.label}</label>
              <input id={field.id} type="password" required autoComplete={field.id === 'currentPassword' ? 'current-password' : 'new-password'} minLength={field.id === 'currentPassword' ? undefined : 12} value={form[field.id]} onChange={event => setForm(current => ({ ...current, [field.id]: event.target.value }))} placeholder={field.hint} className={styles.input} />
            </div>)}
            <p className={styles.helperText}>Use at least 12 characters and at most 72 UTF-8 bytes. Changing your password signs out existing sessions.</p>
            <button type="submit" className={styles.primary}>{loading ? <Loader2 size={15} className={styles.spinning} /> : <Save size={15} />}{loading ? 'Updating password…' : 'Update password'}</button>
          </fieldset>
        </form>}
      </section>
      <aside>
        <section className={styles.panel}>
          <span className={styles.sectionIcon}><Mail size={20} /></span>
          <div className={styles.eyebrow} style={{ marginTop: 24 }}>A WAY BACK IN</div>
          <h2>Forgot your password?</h2>
          <p className={styles.helperText}>Request a one-time code at your administrator email address. Verify the code to reset your password, including accounts that previously used social sign-in.</p>
          <Link className={styles.secondary} href="/admin/login?mode=reset">Reset with email OTP <ArrowUpRight size={14} /></Link>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><h2>Sign-in protection</h2><ShieldCheck size={17} /></div>
          <p className={styles.helperText}>Email recovery codes expire after 10 minutes and work once. Password recovery does not enable two-factor authentication.</p>
          <span className={styles.badgeNeutral}>Authenticator MFA is not configured</span>
        </section>
      </aside>
    </div>
  </div>;
}
