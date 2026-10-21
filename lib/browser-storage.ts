// Storage is optional: browser privacy settings can reject even the getter.
export function readLocalStorage(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {
    // Keep the current in-memory preference when persistence is unavailable.
  }
}

export function readSessionStorage(key: string): string | null {
  try { return typeof window === 'undefined' ? null : window.sessionStorage.getItem(key); } catch { return null; }
}
export function writeSessionStorage(key: string, value: string): void {
  try { if (typeof window !== 'undefined') window.sessionStorage.setItem(key, value); } catch { /* The server still prevents duplicate pending purchases. */ }
}
