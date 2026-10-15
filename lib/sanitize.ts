export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return html
    // Remove scripts and dangerous executable tags
    .replace(/<(script|style|object|embed|applet|base|meta|link|form|input|button|textarea)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    .replace(/<(script|style|object|embed|applet|base|meta|link|form|input|button|textarea)\b[^>]*\/?>/gi, '')
    // Allow only legitimate YouTube embed iframes without srcdoc
    .replace(/<iframe\b([^<]*(?:(?!<\/iframe>)<[^<]*)*)(<\/iframe>|\/?>)/gi, (match) => {
      if (/srcdoc\s*=/i.test(match)) return ''; // Strip srcdoc exploitation
      const srcMatch = /src=["']([^"']+)["']/i.exec(match);
      if (srcMatch) {
        const src = srcMatch[1];
        if (
          /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+/i.test(src) ||
          /^https:\/\/(www\.)?youtube-nocookie\.com\/embed\/[a-zA-Z0-9_-]+/i.test(src)
        ) {
          return match; // trusted — keep as-is
        }
      }
      return ''; // untrusted — strip
    })
    // Strip inline javascript/vbscript/data URLs in href/src
    .replace(/(href|src)\s*=\s*["']?\s*(javascript|vbscript|data:text\/html)[^"'>\s]*/gi, '$1=""')
    // Strip all inline event handlers (onclick, onload, onerror, onfocus, etc.)
    .replace(/on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
}

