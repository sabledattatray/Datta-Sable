'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ id, nonce }: { id: string; nonce?: string }) {
  // Only load analytics in production unless explicitly enabled for testing
  const isDev = process.env.NODE_ENV === 'development';
  const allowInDev = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DEV === 'true' || 
    (typeof window !== 'undefined' && (window.location.search.includes('test_tracking') || window.location.search.includes('gtm_debug')));

  if (isDev && !allowInDev) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="lazyOnload"
        nonce={nonce}
      />
      <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
