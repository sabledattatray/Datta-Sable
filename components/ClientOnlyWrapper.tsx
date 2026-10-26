'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const NotificationManager = dynamic(() => import("@/components/NotificationManager"), { ssr: false });
const GoogleOneTap = dynamic(() => import("@/components/GoogleOneTap"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

export default function ClientOnlyWrapper() {
  const pathname = usePathname();
  if (/^\/ebooks\/(library|access|download|order|checkout)(\/|$)/.test(pathname)) return <CookieConsent />;
  if (pathname === '/sign-in' || pathname === '/sign-up') return <CookieConsent />;
  return (
    <>
      <NotificationManager />
      <GoogleOneTap />
      <CookieConsent />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
