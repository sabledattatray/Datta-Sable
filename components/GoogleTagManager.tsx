'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
  nonce?: string;
}

export default function GoogleTagManager({ gtmId, nonce }: GoogleTagManagerProps) {
  const [shouldLoad, setShouldLoad] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      if (
        process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DEV === 'true' ||
        search.includes('gtm_debug') ||
        search.includes('_tagassistant') ||
        search.includes('test_tracking')
      ) {
        setShouldLoad(true);
      }
    }
  }, []);

  if (!gtmId || !shouldLoad) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
