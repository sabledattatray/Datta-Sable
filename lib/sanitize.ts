import cleanHtml from 'sanitize-html';

// Parser-based sanitization handles entity-encoded protocols and malformed HTML.
// Regex replacements alone cannot establish a safe HTML parsing boundary.
const safeStyle = /^(?!.*(?:url\s*\(|expression\s*\(|@import|javascript|vbscript|\\)).*$/i;
const layoutProperties = ['color', 'background', 'background-color', 'border', 'border-color', 'border-width', 'border-style', 'border-radius', 'border-left', 'border-top', 'border-bottom', 'border-right', 'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-align', 'text-decoration', 'text-transform', 'display', 'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'overflow', 'overflow-x', 'white-space', 'word-break', 'overflow-wrap', 'vertical-align', 'grid-template-columns', 'gap', 'align-items', 'justify-content', 'flex-wrap'];

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return cleanHtml(html, {
    allowedTags: [...cleanHtml.defaults.allowedTags, 'img', 'iframe', 'details', 'summary', 'figure', 'figcaption'],
    allowedAttributes: {
      '*': ['class', 'id', 'style', 'title', 'role', 'aria-*', 'data-*'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'loading'],
      th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'],
      ol: ['start'], details: ['open'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'],
    allowedStyles: { '*': Object.fromEntries(layoutProperties.map(property => [property, [safeStyle]])) },
    transformTags: {
      iframe: (tagName, attributes) => {
        let valid = false;
        try {
          const url = new URL(attributes.src || '');
          valid = url.protocol === 'https:' && !url.username && !url.password && !url.port && /^\/embed\/[\w-]+$/.test(url.pathname);
        } catch { /* Invalid sources are discarded. */ }
        return { tagName, attribs: valid ? attributes : {} };
      },
      a: (tagName, attributes) => ({ tagName, attribs: { ...attributes, ...(attributes.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) } }),
    },
    exclusiveFilter: frame => frame.tag === 'iframe' && !frame.attribs.src,
  });
}
