'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsPath, referrerOrigin } from '@/lib/analytics-url';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track local dev visits in the database to keep logs clean
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const trackView = async () => {
      try {
        const url = analyticsPath(pathname);
        
        // Don't track admin pages or API routes to keep data clean
        if (!url) {
          return;
        }

        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            referrer: referrerOrigin(document.referrer) || null,
          }),
        });
      } catch (err) {
        // Silently fail to not disrupt user experience
        console.error('Analytics failed:', err);
      }
    };

    // Use requestIdleCallback to ensure tracking doesn't block critical rendering
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => trackView());
    } else {
      setTimeout(trackView, 1000);
    }
  }, [pathname]);

  return null;
}
