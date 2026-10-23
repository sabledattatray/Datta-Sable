'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredConsent, OPEN_CONSENT_EVENT, saveAnalyticsConsent } from '@/lib/analytics-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show if user hasn't made a choice yet
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
    const open = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  const choose = (accepted: boolean) => {
    saveAnalyticsConsent(accepted);
    setVisible(false);
  };

  if (!visible || pathname?.startsWith('/admin')) return null;

  return (
    <aside aria-label="Cookie consent banner" className="cookie-banner" role="region">
      <div className="cookie-inner">
        <div className="cookie-content">
          <span className="cookie-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <p className="cookie-text">
            <span>We use cookies to maintain essential functionality and optional analytics to improve your experience.</span>
            <span className="cookie-links">
              <Link href="/cookies">Cookie policy</Link>
              <span className="cookie-sep" aria-hidden="true">·</span>
              <Link href="/privacy">Privacy</Link>
            </span>
          </p>
        </div>

        <div className="cookie-actions">
          <button
            type="button"
            className="cookie-button cookie-accept"
            onClick={() => choose(true)}
          >
            Accept
          </button>
          <button
            type="button"
            className="cookie-button cookie-reject"
            onClick={() => choose(false)}
          >
            Decline
          </button>
        </div>
      </div>
      <style jsx>{`
        .cookie-banner {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          z-index: 9999;
          width: min(840px, calc(100% - 32px));
          padding: 12px 18px;
          border: 1px solid var(--border);
          border-top-color: color-mix(in srgb, var(--accent) 45%, var(--border));
          border-radius: 16px;
          background: color-mix(in srgb, var(--surface) 90%, transparent);
          background: linear-gradient(145deg, color-mix(in srgb, var(--surface2) 92%, transparent), color-mix(in srgb, var(--surface) 95%, transparent));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.12);
          color: var(--text);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 14px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .cookie-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .cookie-content {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .cookie-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, var(--surface));
          border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
        }
        .cookie-text {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.45;
        }
        .cookie-links {
          display: inline-flex;
          align-items: center;
          margin-left: 8px;
          white-space: nowrap;
        }
        .cookie-links :global(a) {
          color: var(--text);
          font-weight: 500;
          text-decoration: underline;
          text-decoration-color: var(--border);
          text-underline-offset: 3px;
          font-size: 12px;
          transition: color 0.15s, text-decoration-color 0.15s;
        }
        .cookie-links :global(a:hover) {
          color: var(--accent);
          text-decoration-color: currentColor;
        }
        .cookie-sep {
          margin: 0 6px;
          color: var(--muted);
          opacity: 0.5;
        }
        .cookie-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .cookie-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 6px 16px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .cookie-accept {
          background: var(--btn-primary-bg, var(--accent));
          color: var(--btn-primary-text, #ffffff);
          border: 1px solid transparent;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .cookie-accept:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .cookie-reject {
          background: color-mix(in srgb, var(--surface2) 75%, transparent);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .cookie-reject:hover {
          border-color: var(--muted);
          background: var(--surface2);
          transform: translateY(-1px);
        }
        .cookie-button:focus-visible,
        .cookie-links :global(a:focus-visible) {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        @media (max-width: 680px) {
          .cookie-banner {
            bottom: calc(12px + env(safe-area-inset-bottom, 0px));
            width: calc(100% - 24px);
            padding: 12px 14px;
            border-radius: 14px;
          }
          .cookie-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .cookie-content {
            gap: 10px;
          }
          .cookie-text {
            font-size: 12px;
          }
          .cookie-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
          .cookie-button {
            width: 100%;
            min-height: 36px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cookie-banner {
            animation: none;
          }
          .cookie-button {
            transition: none;
            transform: none !important;
          }
        }
      `}</style>
    </aside>
  );
}

