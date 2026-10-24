'use client';
import { OPEN_CONSENT_EVENT } from '@/lib/analytics-consent';
export default function CookiePreferencesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    style={{ fontSize: 'var(--text-small)', color: 'var(--muted)' }}>Cookie preferences</button>;
}
