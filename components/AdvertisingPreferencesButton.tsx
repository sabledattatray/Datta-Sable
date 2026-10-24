'use client';

import { useEffect, useState } from 'react';

type GooglePrivacy = {
  callbackQueue: Array<{ CONSENT_API_READY: () => void }>;
  showRevocationMessage?: () => void;
};

// Queue readiness locally. This does not load an ad tag or grant consent.
export default function AdvertisingPreferencesButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const scope = window as Window & { googlefc?: GooglePrivacy };
    const privacy = scope.googlefc ||= { callbackQueue: [] };
    privacy.callbackQueue ||= [];
    privacy.callbackQueue.push({ CONSENT_API_READY: () => {
      if (active && typeof privacy.showRevocationMessage === 'function') setReady(true);
    } });
    return () => { active = false; };
  }, []);

  if (!ready) return null;
  return <button type="button" onClick={() => {
    const privacy = (window as Window & { googlefc?: GooglePrivacy }).googlefc;
    privacy?.showRevocationMessage?.();
  }} style={{ fontSize: 'var(--text-small)', color: 'var(--muted)' }}>Advertising privacy choices</button>;
}
