// Keep query values, fragments and account/private paths out of visit telemetry.
export function analyticsPath(value: string): string | null {
  const path = value.split(/[?#]/, 1)[0];
  if (!path.startsWith('/') || path.startsWith('//') || /@|%40/i.test(path)) return null;
  if (/^\/ebooks\/(library|access|download|order|checkout)(\/|$)/i.test(path)) return null;
  if (/^\/(admin|api|auth|login|register|dashboard|preview|unsubscribe|profile|settings)(\/|$)/i.test(path)) return null;
  return path;
}

export function referrerOrigin(value: string): string {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.origin : '';
  } catch { return ''; }
}
