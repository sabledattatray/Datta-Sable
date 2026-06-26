export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Consistent sanitization on both server and client — avoids React hydration
  // mismatches that occur when DOMPurify (client) and regex (server) produce
  // slightly different output for the same input.
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Allow YouTube / YouTube-nocookie iframes; strip everything else
    .replace(/<iframe\b([^<]*(?:(?!<\/iframe>)<[^<]*)*)(<\/iframe>|\/?>)/gi, (match) => {
      const srcMatch = /src=["']([^"']+)["']/i.exec(match);
      if (srcMatch) {
        const src = srcMatch[1];
        if (
          /^https:\/\/(www\.)?youtube\.com\/embed\//i.test(src) ||
          /^https:\/\/(www\.)?youtube-nocookie\.com\/embed\//i.test(src)
        ) {
          return match; // trusted — keep as-is
        }
      }
      return ''; // untrusted — strip
    })
    .replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
}
