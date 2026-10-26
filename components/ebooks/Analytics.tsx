'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { trackViewItem, trackViewItemList, trackSelectItem, type EcommerceItem } from '@/lib/commerce/analytics';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/analytics-consent';
export function BookAnalytics({ items, detail = false }: { items: EcommerceItem[]; detail?: boolean }) {
  useEffect(() => {
    let sent = false;
    const send = () => { if (sent || !hasAnalyticsConsent()) return; sent = true; if (detail && items[0]) trackViewItem(items[0]); else trackViewItemList(items); };
    send(); window.addEventListener(CONSENT_EVENT, send); return () => window.removeEventListener(CONSENT_EVENT, send);
  }, [items, detail]);
  return null;
}
export function BookLink({ href, item, className, children }: { href: string; item: EcommerceItem; className?: string; children: React.ReactNode }) {
  return <Link href={href} className={className} onClick={() => trackSelectItem(item)}>{children}</Link>;
}
