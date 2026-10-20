export const CONSENT_KEY = 'analytics-consent-v2';
export const CONSENT_EVENT = 'analytics-consent-change';
export const OPEN_CONSENT_EVENT = 'open-cookie-preferences';
export function hasAnalyticsConsent() {
  try { return typeof window !== 'undefined' && localStorage.getItem(CONSENT_KEY) === 'accepted'; }
  catch { return false; }
}
export function saveAnalyticsConsent(accepted: boolean) {
  try { localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined'); } catch { /* Fail closed on next visit. */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
