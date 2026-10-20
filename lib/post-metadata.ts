export function formatPostDate(value: string | Date | null | undefined): { label: string; dateTime: string } | null {
  if (!value) return null;
  let raw: string | Date = value;
  if (typeof raw === 'string') {
    raw = raw.trim();
    // Treat timezone-free catalog timestamps consistently across server/browser.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(raw)) raw += 'Z';
    else if (/^[A-Za-z]+\s+\d{1,2},?\s+\d{4}$/.test(raw)) raw += ' UTC';
  }
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return null;
  return {
    label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' }),
    dateTime: date.toISOString(),
  };
}

export function formatReadTime(value: number | string | null | undefined): string | null {
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? `${Math.ceil(minutes)} min read` : null;
}
