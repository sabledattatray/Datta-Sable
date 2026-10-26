'use client';
import { useEffect, useState, Suspense } from 'react';
import AnalyticsTracker from './AnalyticsTracker';
import GoogleAnalytics from './GoogleAnalytics';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/analytics-consent';
import { usePathname } from 'next/navigation';

interface PerformanceOptimizerProps {
  gtmId?: string; googleAnalyticsId?: string; googleSignInClientId?: string; nonce?: string;
}
export default function PerformanceOptimizer({ googleAnalyticsId, nonce }: PerformanceOptimizerProps) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync(); window.addEventListener(CONSENT_EVENT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  if (!allowed || /^\/ebooks\/(library|access|download|order|checkout)(\/|$)/.test(pathname)) return null;
  return <>
    <Suspense fallback={null}><AnalyticsTracker /></Suspense>
    {googleAnalyticsId ? <GoogleAnalytics id={googleAnalyticsId} nonce={nonce} /> : null}
  </>;
}
