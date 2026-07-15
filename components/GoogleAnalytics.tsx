'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ id, nonce }: { id: string; nonce?: string }) {
  // Only load analytics in production to avoid tracking developer visits
  if (process.env.NODE_ENV === 'development') {
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
