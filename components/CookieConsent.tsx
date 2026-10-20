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
  return <section aria-label="Cookie preferences" className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-[var(--border)] bg-[var(--surface2)] p-6 shadow-xl">
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Cookie preferences</h2>
      <p>Essential storage keeps sign-in and your preferences working. Optional analytics helps us understand site use and stays off unless you accept. Advertising choices, when ads are enabled, are managed separately. <Link href="/cookies">Cookie policy</Link> · <Link href="/privacy">Privacy policy</Link></p>
      <div className="flex flex-wrap gap-4 mt-4">
        <button type="button" className="btn-primary" onClick={() => choose(true)}>Accept analytics</button>
        <button type="button" className="btn-primary" onClick={() => choose(false)}>Reject analytics</button>
      </div>
    </div>
  </section>;
}
