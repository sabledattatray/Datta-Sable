'use client';

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoIcon from './LogoIcon';
import ThemeToggle from './ThemeToggle';
import { signInReturnPath } from '@/lib/sign-in-path';
import styles from './SignInExperience.module.css';

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'google') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.61 4.61 0 0 1-2 3.03v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.38Z"/>
        <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.39l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H3.07v2.6A10 10 0 0 0 12 22Z"/>
        <path fill="#FBBC05" d="M6.41 13.95a6 6 0 0 1 0-3.9v-2.6H3.07a10 10 0 0 0 0 9.1l3.34-2.6Z"/>
        <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.93 5.45l3.34 2.6A5.98 5.98 0 0 1 12 5.95Z"/>
      </svg>
    );
  }
  if (provider === 'github') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/>
      </svg>
    );
  }
  if (provider === 'linkedin') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.97V9.2h2.96v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.96v-4.64c0-1.1-.02-2.52-1.54-2.52-1.55 0-1.79 1.2-1.79 2.44v4.72H9.5V9.2h2.84v1.3h.04c.4-.76 1.37-1.55 2.81-1.55 3 0 3.56 1.98 3.56 4.55v5.25Z"/>
      </svg>
    );
  }
  return <LockKeyhole size={17} aria-hidden="true" />;
}

export default function SignInExperience({
  callbackUrl,
  mode = 'sign-in',
}: {
  callbackUrl?: string;
  mode?: 'sign-in' | 'sign-up';
}) {
  const signingUp = mode === 'sign-up';
  const [busy, setBusy] = useState<string | null>(null);
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [returnTo, setReturnTo] = useState('/');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setReturnTo(signInReturnPath(callbackUrl, window.location.origin));
    let active = true;
    setLoading(true);
    setError('');
    getProviders()
      .then(result => {
        if (!active) return;
        const available = Object.values(result || {}).filter(provider => provider.type === 'oauth');
        available.sort((a, b) => Number(b.id === 'google') - Number(a.id === 'google'));
        setProviders(available);
      })
      .catch(() => {
        if (active) setError('Could not load sign-in options. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [callbackUrl, retry]);

  async function loginSocial(provider: string) {
    setBusy(provider);
    setError('');
    try {
      await signIn(provider, { callbackUrl: returnTo });
    } catch {
      setError('Sign-in could not be started. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (signingUp) {
      const cleanFirst = firstName.trim();
      const cleanLast = lastName.trim();
      if (!cleanFirst || !cleanLast) {
        setError('Please enter both your first and last name.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (Buffer.byteLength(password, 'utf8') > 72) {
        setError('Password cannot exceed 72 bytes.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setBusy('email');
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: cleanFirst,
            lastName: cleanLast,
            email: cleanEmail,
            password,
          }),
        });
        const data = await response.json();
        if (!response.ok || data.error) {
          setError(data.error || 'Registration could not be completed. Please try again.');
        } else {
          setSuccessMessage(data.message || 'Verification email sent! Please check your inbox.');
          setSuccess(true);
        }
      } catch {
        setError('Unable to reach the server. Please check your connection and try again.');
      } finally {
        setBusy(null);
      }
    } else {
      // Sign in with credentials
      if (!password) {
        setError('Please enter your password.');
        return;
      }
      setBusy('email');
      try {
        const result = await signIn('credentials', {
          email: cleanEmail,
          password,
          callbackUrl: returnTo,
          redirect: false,
        });
        if (!result?.ok || result.error) {
          if (result?.error?.toLowerCase().includes('verify') || result?.error === 'EMAIL_NOT_VERIFIED') {
            setError('Please verify your email address before logging in. Check your inbox for the confirmation link.');
          } else {
            setError('Incorrect email or password. Please try again.');
          }
        } else {
          window.location.assign(returnTo);
        }
      } catch {
        setError('Sign-in failed. Please try again.');
      } finally {
        setBusy(null);
      }
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Datta Sable home">
          <span className={styles.brandIcon}><LogoIcon /></span>
          <span><strong>Datta Sable</strong><small>DATA / DESIGN / ENGINEERING</small></span>
        </Link>
        <div className={styles.topActions}>
          <ThemeToggle />
          <Link href={returnTo} className={styles.back}><ArrowLeft size={14} /> Back to website</Link>
        </div>
      </header>
      <div className={styles.layout}>
        <section className={styles.introduction} aria-labelledby="signin-introduction">
          <div className={styles.introInner}>
            <div className={styles.eyebrow}><span /> A SPACE FOR CURIOUS MINDS</div>
            <h1 id="signin-introduction">
              {signingUp ? 'Start curious.' : 'Good ideas.'}
              <br />
              <span>{signingUp ? 'Go further.' : 'Great company.'}</span>
            </h1>
            <p className={styles.lead}>
              {signingUp
                ? 'A space for practical thinking, useful resources, and your next step in data and engineering.'
                : 'Practical knowledge. Thoughtful tools. A clearer path from curiosity to what comes next.'}
            </p>
            <div className={styles.art} aria-hidden="true">
              <svg viewBox="0 0 480 170" fill="none">
                <path d="M22 85h436M240 5v160" stroke="currentColor" strokeOpacity=".14" strokeDasharray="3 7"/>
                <ellipse cx="240" cy="85" rx="175" ry="52" stroke="currentColor" strokeOpacity=".22" transform="rotate(-15 240 85)"/>
                <ellipse cx="240" cy="85" rx="175" ry="52" stroke="currentColor" strokeOpacity=".12" transform="rotate(15 240 85)"/>
                <circle cx="240" cy="85" r="58" stroke="currentColor" strokeOpacity=".15"/>
                <path d="m212 80 28-15 28 15-28 15-28-15Zm0 13 28 15 28-15m-56-26 28-15 28 15" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="70" cy="130" r="4" fill="currentColor"/>
                <circle cx="410" cy="40" r="4" fill="currentColor"/>
                <circle cx="240" cy="5" r="3" fill="currentColor" fillOpacity=".5"/>
                <circle cx="240" cy="165" r="3" fill="currentColor" fillOpacity=".5"/>
              </svg>
              <span>EXPLORE / LEARN / BUILD</span>
            </div>
            <div className={styles.features}>
              <div><BookOpen size={17} /><span><strong>Keep your curiosity moving.</strong><small>Explore guides on data, engineering, and AI.</small></span></div>
              <div><Layers size={17} /><span><strong>Your resources, within reach.</strong><small>Access purchases from your account library.</small></span></div>
            </div>
          </div>
        </section>
        <section className={styles.access} aria-labelledby="signin-title">
          <div className={styles.accessInner}>
            <div className={styles.headerBlock}>
              <span className={styles.lock}>
                {signingUp ? <UserPlus size={20} strokeWidth={1.5} /> : <LockKeyhole size={20} strokeWidth={1.5} />}
              </span>
              <div>
                <div className={styles.eyebrow}>{signingUp ? 'MAKE YOURSELF AT HOME' : 'SIGN IN TO DATTA SABLE'}</div>
                <h2 id="signin-title">{signingUp ? 'Create your account.' : 'Welcome back.'}</h2>
              </div>
            </div>
            <p className={styles.description}>
              {signingUp
                ? 'Sign up with your email or connect a social account.'
                : 'Choose your preferred sign-in method to continue.'}
            </p>

            {success ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}><CheckCircle2 size={34} /></div>
                <h3>Check your email</h3>
                <p>{successMessage}</p>
                <Link
                  href={`/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`}
                  className={styles.submitBtn}
                >
                  <span>Proceed to Sign In</span>
                  <ArrowUpRight size={15} />
                </Link>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => { setSuccess(false); setPassword(''); setConfirmPassword(''); }}
                >
                  Need to use a different email?
                </button>
              </div>
            ) : (
              <>
                <form className={styles.authForm} onSubmit={handleSubmit}>
                  {signingUp && (
                    <div className={styles.nameRow}>
                      <div className={styles.field}>
                        <label htmlFor="signup-firstname" className={styles.label}>First name</label>
                        <input
                          id="signup-firstname"
                          type="text"
                          required
                          autoComplete="given-name"
                          maxLength={80}
                          placeholder="Datta"
                          className={styles.input}
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          disabled={!!busy}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="signup-lastname" className={styles.label}>Last name</label>
                        <input
                          id="signup-lastname"
                          type="text"
                          required
                          autoComplete="family-name"
                          maxLength={80}
                          placeholder="Sable"
                          className={styles.input}
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          disabled={!!busy}
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.field}>
                    <label htmlFor={signingUp ? 'signup-email' : 'signin-email'} className={styles.label}>Email address</label>
                    <input
                      id={signingUp ? 'signup-email' : 'signin-email'}
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={254}
                      placeholder="you@example.com"
                      className={styles.input}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={!!busy}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor={signingUp ? 'signup-password' : 'signin-password'} className={styles.label}>Password</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        id={signingUp ? 'signup-password' : 'signin-password'}
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete={signingUp ? 'new-password' : 'current-password'}
                        minLength={signingUp ? 8 : undefined}
                        maxLength={72}
                        placeholder={signingUp ? 'At least 8 characters' : 'Enter your password'}
                        className={`${styles.input} ${styles.passwordInput}`}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={!!busy}
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signingUp && <p className={styles.passwordHint}>8 characters minimum (up to 72 characters).</p>}
                  </div>

                  {signingUp && (
                    <div className={styles.field}>
                      <label htmlFor="signup-confirmpassword" className={styles.label}>Confirm password</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          id="signup-confirmpassword"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          minLength={8}
                          maxLength={72}
                          placeholder="Repeat your password"
                          className={`${styles.input} ${styles.passwordInput}`}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          disabled={!!busy}
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className={styles.submitBtn} disabled={!!busy}>
                    {busy === 'email' ? <Loader2 size={16} className={styles.spinning} /> : null}
                    <span>
                      {busy === 'email'
                        ? (signingUp ? 'Creating account…' : 'Signing in…')
                        : (signingUp ? 'Create account' : 'Sign in')}
                    </span>
                    {busy !== 'email' && <ArrowUpRight size={15} aria-hidden="true" />}
                  </button>
                </form>

                {error && (
                  <div className={styles.error} role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={() => { setError(''); setRetry(value => value + 1); }}>Dismiss</button>
                  </div>
                )}

                <div className={styles.divider}>
                  <span>or {signingUp ? 'sign up' : 'continue'} with</span>
                </div>

                <div className={styles.providers} aria-busy={loading || !!busy}>
                  {loading ? (
                    <div className={styles.loading} role="status"><Loader2 size={16} /> Loading options…</div>
                  ) : providers.map(provider => (
                    <button
                      key={provider.id}
                      type="button"
                      className={styles.provider}
                      disabled={!!busy}
                      onClick={() => loginSocial(provider.id)}
                      aria-label={(signingUp ? 'Sign up with ' : 'Continue with ') + provider.name}
                    >
                      <span className={styles.providerIcon}>
                        {busy === provider.id ? <Loader2 size={16} className={styles.spinning} /> : <ProviderIcon provider={provider.id} />}
                      </span>
                      <span className={styles.providerName}>{provider.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className={styles.accountSwitch}>
              {signingUp ? 'Already have an account?' : 'New to Datta Sable?'}{' '}
              <Link href={`${signingUp ? '/sign-in' : '/sign-up'}?callbackUrl=${encodeURIComponent(returnTo)}`}>
                {signingUp ? 'Sign in' : 'Create an account'} <ArrowUpRight size={12} />
              </Link>
            </p>
            <div className={styles.reassurance}>
              <ShieldCheck size={14} />
              <p>Your privacy is protected with end-to-end security.</p>
            </div>
            <p className={styles.legal}>
              By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
            <div className={styles.admin}>
              <span>Managing the website?</span>
              <Link href="/admin/login">Admin sign-in <ArrowUpRight size={11} /></Link>
            </div>
          </div>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Datta Sable</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Need help? <ArrowUpRight size={11} /></Link>
        </div>
      </footer>
    </div>
  );
}
