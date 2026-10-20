'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONSENT_KEY, OPEN_CONSENT_EVENT, saveAnalyticsConsent } from '@/lib/analytics-consent';

// This controls optional analytics only. Advertising consent must use a Google-certified CMP.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    try { setVisible(!['accepted', 'declined'].includes(localStorage.getItem(CONSENT_KEY) || '')); }
    catch { setVisible(true); }
    const open = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);
  const choose = (accepted: boolean) => {
    saveAnalyticsConsent(accepted); setVisible(false);
    // Reload to stop already-executing vendor scripts when consent is withdrawn.
    if (!accepted) window.location.reload();
  };
  if (!visible || pathname?.startsWith('/admin')) return null;
  return <section aria-labelledby="cookie-consent-title" className="cookie-banner">
    <div className="cookie-heading">
      <span className="cookie-icon" aria-hidden="true">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      </span>
      <div>
        <span className="cookie-eyebrow">Your privacy matters</span>
        <h2 id="cookie-consent-title">A little clarity on cookies.</h2>
      </div>
    </div>
    <p className="cookie-copy">Essential storage keeps sign-in and your preferences working. Optional analytics helps us understand site use and stays off unless you accept. Advertising choices, when ads are enabled, are managed separately.</p>
    <div className="cookie-links">
      <Link href="/cookies">Cookie policy</Link>
      <span aria-hidden="true">·</span>
      <Link href="/privacy">Privacy policy</Link>
    </div>
    <div className="cookie-actions">
      <button type="button" className="cookie-button cookie-accept" onClick={() => choose(true)}>Accept analytics <span aria-hidden="true">↗</span></button>
      <button type="button" className="cookie-button cookie-reject" onClick={() => choose(false)}>Reject analytics</button>
    </div>
    <style jsx>{`
      .cookie-banner {
        position: fixed;
        left: 24px;
        bottom: calc(24px + env(safe-area-inset-bottom, 0px));
        z-index: 9999;
        width: min(460px, calc(100% - 48px));
        max-height: calc(100dvh - 48px - env(safe-area-inset-bottom, 0px));
        overflow-y: auto;
        padding: 20px;
        border: 1px solid var(--border);
        border-top-color: color-mix(in srgb, var(--accent) 35%, var(--border));
        border-radius: 24px;
        background: var(--surface);
        background: linear-gradient(145deg, color-mix(in srgb, var(--surface2) 94%, transparent), color-mix(in srgb, var(--surface) 96%, transparent));
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: 0 24px 80px rgba(0, 0, 0, .25), 0 4px 16px rgba(0, 0, 0, .12);
        color: var(--text);
      }
      .cookie-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .cookie-icon {
        display: grid; place-items: center; flex-shrink: 0;
        width: 40px; height: 40px; border-radius: 12px;
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 9%, var(--surface));
        border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
      }
      .cookie-eyebrow { display: block; margin-bottom: 3px; font-size: 10px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); }
      .cookie-heading h2 { margin: 0; font-family: var(--font-syne); font-size: 20px; font-weight: 600; line-height: 1.3; letter-spacing: -.025em; }
      .cookie-copy { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.6; }
      .cookie-links { display: flex; align-items: center; gap: 12px; margin-top: 8px; color: var(--muted); font-size: 12px; }
      .cookie-links :global(a) { color: var(--text); text-decoration: underline; text-decoration-color: var(--border); text-underline-offset: 4px; }
      .cookie-links :global(a:hover) { color: var(--accent); text-decoration-color: currentColor; }
      .cookie-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
      .cookie-button { display: flex; justify-content: center; align-items: center; gap: 10px; min-height: 44px; padding: 10px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; line-height: 1.4; cursor: pointer; transition: background .2s, border-color .2s, box-shadow .2s; }
      .cookie-accept { background: var(--btn-primary-bg); color: var(--btn-primary-text); border: 1px solid transparent; }
      .cookie-accept:hover { box-shadow: 0 4px 18px color-mix(in srgb, var(--accent) 20%, transparent); }
      .cookie-reject { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
      .cookie-reject:hover { border-color: var(--muted); background: var(--surface); }
      .cookie-button:focus-visible, .cookie-links :global(a:focus-visible) { outline: 2px solid var(--accent); outline-offset: 4px; }
      @media (max-width: 540px) {
        .cookie-banner { left: 12px; bottom: calc(12px + env(safe-area-inset-bottom, 0px)); width: calc(100% - 24px); padding: 16px; border-radius: 20px; }
        .cookie-heading h2 { font-size: 18px; }
      }
      @media (max-width: 359px) { .cookie-actions { grid-template-columns: 1fr; } }
      @media (prefers-reduced-motion: reduce) { .cookie-button { transition: none; } }
    `}</style>
  </section>;
}
