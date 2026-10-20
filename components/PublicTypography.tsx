'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { buildTypographyCss, parseStoredTypography, TYPOGRAPHY_DRAFT_KEY, TYPOGRAPHY_PUBLISHED_KEY, type TypographySettings } from '@/lib/site-typography';

export default function PublicTypography({ settings, nonce }: { settings: TypographySettings; nonce?: string }) {
  const pathname = usePathname();
  const [override, setOverride] = useState<TypographySettings | null>(null);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    const isPreview = new URL(window.location.href).searchParams.get('typography-preview') === '1';
    setPreview(isPreview);
    setOverride(null);
    if (pathname?.startsWith('/admin')) return;
    const readDraft = () => {
      try { setOverride(parseStoredTypography(localStorage.getItem(TYPOGRAPHY_DRAFT_KEY))); } catch { /* Browser storage is optional. */ }
    };
    if (isPreview) readDraft();
    const sync = (event: StorageEvent) => {
      if (isPreview && event.key === TYPOGRAPHY_DRAFT_KEY) readDraft();
      else if (!isPreview && event.key === TYPOGRAPHY_PUBLISHED_KEY) {
        const next = parseStoredTypography(event.newValue);
        if (next) setOverride(next);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [pathname, settings]);
  if (pathname?.startsWith('/admin')) return null;
  return <>
    <style id="website-typography" nonce={nonce}>{buildTypographyCss(override ?? settings)}</style>
    {preview && <aside style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10000, maxWidth: 'calc(100vw - 32px)', padding: '12px 18px', borderRadius: 12, background: '#18181b', color: '#fff', border: '1px solid #71717a', font: '13px/1.5 system-ui', boxShadow: '0 8px 30px #0003' }}>
      Typography preview · Not published <a href={pathname || '/'} style={{ color: '#d9f99d', marginLeft: 12 }}>Exit preview</a>
    </aside>}
  </>;
}
