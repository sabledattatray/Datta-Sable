export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Consistent sanitization on both server and client — avoids React hydration
  // mismatches that occur when DOMPurify (client) and regex (server) produce
  // slightly different output for the same input.
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
}
