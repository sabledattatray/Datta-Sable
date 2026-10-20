'use client';
import { useEffect, useState, Suspense } from 'react';
import AnalyticsTracker from './AnalyticsTracker';
import GoogleAnalytics from './GoogleAnalytics';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/analytics-consent';

interface PerformanceOptimizerProps {
  gtmId?: string; googleAnalyticsId?: string; googleSignInClientId?: string; nonce?: string;
}
export default function PerformanceOptimizer({ googleAnalyticsId, nonce }: PerformanceOptimizerProps) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync(); window.addEventListener(CONSENT_EVENT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  if (!allowed) return null;
  return <>
    <Suspense fallback={null}><AnalyticsTracker /></Suspense>
    {googleAnalyticsId ? <GoogleAnalytics id={googleAnalyticsId} nonce={nonce} /> : null}
  </>;
}
