import { load } from 'cheerio';

const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

export function extractSeoText(content: string): string {
  if (!content) return '';
  const $ = load(content, null, false);
  $('script, style, noscript, template').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

export function countSeoWords(content: string, excerpt = ''): number {
  const text = [extractSeoText(content), extractSeoText(excerpt)].filter(Boolean).join(' ');
  return text.match(WORD_PATTERN)?.length ?? 0;
}

export type SeoCheck = { id: string; label: string; passed: boolean; pts: number };
export type SeoAnalysis = {
  score: number | null;
  wordCount: number;
  categories: Record<'basic' | 'additional' | 'title' | 'content', SeoCheck[]>;
};

export function analyzeSeoContent(input: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  keyword: string;
  otherKeywords?: string[];
}): SeoAnalysis {
  const text = extractSeoText(input.content);
  const words = text.match(WORD_PATTERN) ?? [];
  const wordCount = words.length;
  const totalPageWords = countSeoWords(input.content, input.excerpt);
  const categories: SeoAnalysis['categories'] = { basic: [], additional: [], title: [], content: [] };
  let points = 0;
  let earned = 0;
  const add = (group: keyof SeoAnalysis['categories'], id: string, label: string, passed: boolean, pts: number) => {
    categories[group].push({ id, label, passed, pts });
    points += pts;
    if (passed) earned += pts;
  };
  const keyword = input.keyword.trim().toLocaleLowerCase();
  if (!keyword) return { score: null, wordCount, categories };
  const title = input.title.toLocaleLowerCase();
  const slug = input.slug.toLocaleLowerCase();
  const excerpt = extractSeoText(input.excerpt).toLocaleLowerCase();
  const normalizedKeyword = keyword.replace(/\s+/g, ' ');
  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keywordMatches = text.toLocaleLowerCase().match(new RegExp(`\\b${escaped}\\b`, 'gu')) ?? [];
  const density = wordCount ? (keywordMatches.length / wordCount) * 100 : 0;

  add('basic', 'title_kw', 'Focus keyword in page title', title.includes(keyword), 15);
  add('basic', 'slug_kw', 'Focus keyword in URL slug', slug.includes(keyword.replace(/\s+/g, '-')), 10);
  add('basic', 'excerpt_kw', 'Focus keyword in meta description', excerpt.includes(keyword), 10);
  add('basic', 'beginning_kw', 'Focus keyword near the beginning of content', text.slice(0, 300).toLocaleLowerCase().includes(keyword), 10);
  add('basic', 'word_count', `Page content and description length (${totalPageWords} words; 600+ target)`, totalPageWords >= 600, 10);

  const $ = load(input.content || '', null, false);
  const headingText = $('h1,h2,h3').text().toLocaleLowerCase();
  add('additional', 'subheading_kw', 'Focus keyword in an H1, H2, or H3 heading', headingText.includes(keyword), 10);
  const images = $('img');
  const imageAlt = images.toArray().some((image) => ($(image).attr('alt') || '').toLocaleLowerCase().includes(keyword));
  add('additional', 'image_alt_kw', images.length > 0 && imageAlt ? 'Focus keyword appears in image alt text' : 'Images include descriptive alt text with the focus keyword', images.length > 0 && imageAlt, 5);
  add('additional', 'density', `Focus keyword density (${density.toFixed(2)}%; 0.5–2.5% target)`, density >= 0.5 && density <= 2.5, 5);
  const hrefs = $('a[href]').toArray().map((link) => $(link).attr('href') || '');
  add('additional', 'internal_link', 'Content contains an internal link', hrefs.some((href) => href.startsWith('/') || href.includes('dattasable.com')), 5);
  add('additional', 'external_link', 'Content contains an external link', hrefs.some((href) => /^https?:\/\//i.test(href) && !href.includes('dattasable.com')), 5);
  add('additional', 'unique_kw', 'Focus keyword is not assigned to another page', !(input.otherKeywords ?? []).some((other) => other.toLocaleLowerCase().split(',').map((item) => item.trim()).includes(keyword)), 5);

  add('title', 'title_start', 'Focus keyword appears near the start of the title', title.startsWith(keyword) || (title.includes(keyword) && title.indexOf(keyword) < 15), 5);
  add('title', 'title_length', 'Title length is between 30 and 65 characters', input.title.trim().length >= 30 && input.title.trim().length <= 65, 5);
  add('title', 'title_action', 'Title includes a useful descriptive term', /\b(guide|how|what|why|best|complete|tips|examples|services|policy|faq|portfolio|about|contact|strategy|optimization|analytics)\b/i.test(input.title), 5);
  add('title', 'title_number', 'Title uses a number where useful', /\d+/.test(input.title), 5);

  const hasToc = /table of contents|what we (will|’ll) cover/i.test(text) || ($('a[href^="#"]').length >= 3 && $('ul,ol').length > 0);
  add('content', 'content_toc', 'Content has a table of contents or useful section navigation', hasToc, 5);
  const paragraphs = $('p').toArray().map((p) => ($(p).text().match(WORD_PATTERN) ?? []).length).filter((count) => count > 0);
  const longParagraphs = paragraphs.filter((count) => count > 120).length;
  add('content', 'content_short_paragraphs', 'Most paragraphs are 120 words or fewer', paragraphs.length > 0 && longParagraphs / paragraphs.length <= 0.2, 5);
  add('content', 'content_media', 'Content contains relevant images or embedded media', $('img,video,iframe').length > 0, 5);

  return { score: Math.round((earned / points) * 100), wordCount: totalPageWords, categories };
}
