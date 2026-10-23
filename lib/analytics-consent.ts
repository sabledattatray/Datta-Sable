export const CONSENT_KEY = 'analytics-consent-v2';
export const CONSENT_EVENT = 'analytics-consent-change';
export const OPEN_CONSENT_EVENT = 'open-cookie-preferences';

function readCookie(name: string): string | null {
  try {
    if (typeof document === 'undefined' || !document.cookie) return null;
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string, days = 365): void {
  try {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  } catch {
    /* Optional cookie write */
  }
}

export function getStoredConsent(): 'accepted' | 'declined' | null {
  // 1. Check localStorage
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const val = localStorage.getItem(CONSENT_KEY);
      if (val === 'accepted' || val === 'declined') return val;
    }
  } catch {
    /* LocalStorage blocked or restricted */
  }

  // 2. Check document.cookie fallback
  const cookieVal = readCookie(CONSENT_KEY);
  if (cookieVal === 'accepted' || cookieVal === 'declined') return cookieVal;

  // 3. Check sessionStorage fallback
  try {
    if (typeof sessionStorage !== 'undefined' && typeof sessionStorage.getItem === 'function') {
      const sessVal = sessionStorage.getItem(CONSENT_KEY);
      if (sessVal === 'accepted' || sessVal === 'declined') return sessVal;
    }
  } catch {
    /* SessionStorage blocked */
  }

  return null;
}

export function hasAnalyticsConsent(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        const val = localStorage.getItem(CONSENT_KEY);
        if (val === 'accepted') return true;
        if (val === 'declined') return false;
      }
    } catch {
      return false;
    }
    return readCookie(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function saveAnalyticsConsent(accepted: boolean): void {
  const status = accepted ? 'accepted' : 'declined';

  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(CONSENT_KEY, status);
    }
  } catch {
    /* LocalStorage restricted */
  }

  try {
    writeCookie(CONSENT_KEY, status, 365);
  } catch {
    /* Cookie write optional */
  }

  try {
    if (typeof sessionStorage !== 'undefined' && typeof sessionStorage.setItem === 'function') {
      sessionStorage.setItem(CONSENT_KEY, status);
    }
  } catch {
    /* SessionStorage optional */
  }

  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event(CONSENT_EVENT));
    }
  } catch {
    /* Dispatch event fallback */
  }
}

