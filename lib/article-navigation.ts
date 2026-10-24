import { load } from 'cheerio';
import { marked } from 'marked';

export type ArticleHeading = { id: string; text: string; level: 2 | 3 };
type ContentBlock = { type: string; content: string; [key: string]: unknown };
type ArticleInput = { content: string; blocks?: ContentBlock[] };

function headingSlug(text: string) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'section';
}

function isContentsTitle(text: string) {
  const clean = text.replace(/^[^\p{L}]+/u, '').replace(/\s+/g, ' ').trim();
  return /^(?:master\s+|article\s+|guide\s+)?(table of contents|contents|on this page|in this article|in this guide)(?:\s|—|-|:|$)/i.test(clean);
}

// Normalize the rendered copy only. Stored articles and their authored anchors
// are retained; the navigator is derived from the headings actually displayed.
export function prepareArticleNavigation<T extends ArticleInput>(post: T): T & { headings: ArticleHeading[] } {
  const hasBlocks = Boolean(post.blocks?.length);
  let rawContent = post.content || '';

  // Only parse markdown if the content is NOT already HTML.
  // If the content already contains HTML tags (<p, <h2, <div, <section, <pre), never re-parse with marked.
  const hasHtml = /<(?:p|h[1-6]|div|section|article|pre|ul|ol|blockquote)\b/i.test(rawContent);
  const isMarkdown = !hasBlocks && !hasHtml && (
    /^#{1,6}\s/m.test(rawContent) || rawContent.includes('##')
  );

  if (isMarkdown) {
    rawContent = marked.parse(rawContent, { gfm: true, breaks: false }) as string;
    rawContent = rawContent.replace(/<p>\s*(\[\[diagram:[a-zA-Z0-9-_]+\]\])\s*<\/p>/g, '$1');
  }

  const renderedBlocks = new Set(['paragraph', 'heading', 'list', 'quote', 'html', 'callout']);
  const fragments = hasBlocks
    ? post.blocks!.map((block, index) => ({ index, html: renderedBlocks.has(block.type) ? block.content || '' : '' }))
    : [{ index: -1, html: rawContent }];
  const documents = fragments.map(fragment => ({ ...fragment, $: load(fragment.html, null, false) }));

  for (const { $ } of documents) {
    // Older CMS articles can contain inline caption sizes below the shared
    // minimum. Adjust rendered text only; leave display headings and code alone.
    $('[style]').each((_, element) => {
      const text = $(element);
      if (text.is('h1,h2,h3,h4,h5,h6,pre,code,script,style') || text.parents('h1,h2,h3,h4,h5,h6,pre,code,script,style').length) return;
      const style = text.attr('style') || '';
      text.attr('style', style.replace(/(^|;)\s*font-size\s*:\s*(\d*\.?\d+)(px|rem|em)\s*(!important)?(?=;|$)/gi, (declaration, separator, number, unit, important) => {
        const value = Number(number);
        if (!value || (unit.toLowerCase() !== 'em' && value * (unit.toLowerCase() === 'rem' ? 16 : 1) >= 14)) return declaration;
        const size = unit.toLowerCase() === 'em' ? `max(0.875rem, ${number}em)` : 'var(--text-small)';
        return `${separator}font-size:${size}${important ? ' !important' : ''}`;
      }));
    });
    $('.blog-toc, .table-of-contents, nav[aria-label="Table of contents"], nav[aria-label="Table of Contents"]').each((_, element) => {
      const wrapper = $(element);
      // Avoid removing a similarly named container that contains article prose.
      const hasArticleHeadings = wrapper.find('h1,h2,h3').toArray().some(heading => !isContentsTitle($(heading).text()));
      if (wrapper.find('a[href*="#"]').length && !hasArticleHeadings) wrapper.remove();
    });
    $('h1,h2,h3,h4,h5,h6').each((_, element) => {
      const heading = $(element);
      const isTocHeading = isContentsTitle(heading.text()) || heading.attr('id') === 'toc' || heading.attr('id') === 'table-of-contents';
      if (!isTocHeading) return;
      const next = heading.next();
      if (next.is('ul,ol,nav') && (next.find('a[href*="#"]').length || isTocHeading)) {
        const parent = heading.parent();
        const prev = heading.prev();
        if (prev.is('hr')) prev.remove();
        const afterNext = next.next();
        if (afterNext.is('hr')) afterNext.remove();
        // Remove only the contents title and its adjacent link list.
        next.remove(); heading.remove();
        if (parent.is('div,nav,section,aside') && !parent.text().trim() && !parent.children().not('hr').length) parent.remove();
      }
    });
  }

  const usedIds = new Set<string>();
  for (const { $ } of documents) {
    $('[id]').not('h2,h3').each((_, element) => { const id = $(element).attr('id'); if (id) usedIds.add(id); });
  }
  // Reserve authored heading IDs before generating new ones to avoid collisions.
  const authoredIds = new Set<string>();
  for (const { $ } of documents) $('h2[id],h3[id]').each((_, element) => { authoredIds.add($(element).attr('id')!); });
  const headings: ArticleHeading[] = [];
  for (const { $ } of documents) {
    $('h2,h3').each((_, element) => {
      const heading = $(element);
      if (heading.parents('pre,code,script,style,[data-toc-ignore]').length || heading.is('[data-toc-ignore]')) return;
      const text = heading.text().replace(/\s+/g, ' ').trim();
      const isTocHeading = isContentsTitle(text) || heading.attr('id') === 'toc' || heading.attr('id') === 'table-of-contents';
      if (!text || isTocHeading) return;
      const original = heading.attr('id');
      const base = original || headingSlug(text);
      let id = base;
      let suffix = 2;
      while (usedIds.has(id) || (id !== original && authoredIds.has(id))) id = `${base}-${suffix++}`;
      heading.attr('id', id);
      usedIds.add(id);
      headings.push({ id, text, level: element.tagName.toLowerCase() === 'h2' ? 2 : 3 });
    });
  }
  if (!hasBlocks) return { ...post, content: documents[0].$.root().html() || '', headings };
  const blocks = post.blocks!.map((block, index) => renderedBlocks.has(block.type)
    ? { ...block, content: documents[index].$.root().html() || '' }
    : block);
  return { ...post, blocks, headings };
}
