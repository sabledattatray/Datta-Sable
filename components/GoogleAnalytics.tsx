'use client';
import Script from 'next/script';
import { buildAnalyticsInitialization } from '@/lib/google-consent';

// Mounted only after the analytics choice is accepted in PerformanceOptimizer.
export default function GoogleAnalytics({ id, nonce }: { id: string; nonce?: string }) {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DEV !== 'true') return null;
  return <>
    <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}
      dangerouslySetInnerHTML={{ __html: buildAnalyticsInitialization(id) }} />
    <Script src={'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id)}
      strategy="afterInteractive" nonce={nonce} />
  </>;
}
