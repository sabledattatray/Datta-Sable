import fs from 'node:fs/promises';
import { load } from 'cheerio';

// Read-only live inventory. Counts are triage signals, never approval thresholds.
const origins = ['https://dattasable.com', 'https://fabric.dattasable.com', 'https://excel.dattasable.com'];
const pages = new Set();
const maps = new Map();
async function request(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'DattaSable-EditorialAudit/1.0' } });
  return { response, body: await response.text() };
}
async function sitemap(url) {
  if (maps.has(url)) return;
  maps.set(url, { url });
  try {
    const { response, body } = await request(url);
    const $ = load(body, { xml: true });
    const locations = $('loc').map((_, el) => $(el).text()).get();
    maps.set(url, { url, status: response.status, entries: locations.length });
    if ($('sitemapindex').length) for (const location of locations) await sitemap(location);
    else $('url > loc').each((_, el) => pages.add($(el).text()));
  } catch (error) { maps.set(url, { url, error: error.message }); }
}
await sitemap(origins[0] + '/sitemap-index.xml');
for (const origin of origins) await sitemap(origin + '/sitemap.xml');
async function sourceRoutes(dir = 'app', parts = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !/^(api|admin)$|\[|^\(|^@/.test(entry.name)) await sourceRoutes(dir + '/' + entry.name, [...parts, entry.name]);
    else if (entry.name === 'page.tsx') pages.add(origins[0] + '/' + parts.join('/'));
  }
}
await sourceRoutes();
const results = [];
async function inspect(url, discover = false) {
  try {
    const { response, body } = await request(url);
    const $ = load(body);
    const robots = [$('meta[name="robots"]').attr('content'), $('meta[name="googlebot"]').attr('content'), response.headers.get('x-robots-tag')].filter(Boolean).join('; ');
    const title = $('title').first().text();
    const canonical = $('link[rel="canonical"]').attr('href');
    if (discover) $('a[href]').each((_, el) => {
      try {
        const link = new URL($(el).attr('href'), url); link.hash = '';
        if (origins.includes(link.origin) && !link.search && !/\.(xml|pdf|png|webp|jpg|zip|xlsx|pbix)$/i.test(link.pathname) && !/^\/(api|admin|dashboard)(\/|$)/.test(link.pathname)) pages.add(link.href);
      } catch {}
    });
    $('script,style,noscript,nav,footer,aside,form').remove();
    const main = $('.blog-content').length ? $('.blog-content').first() : $('article').first().length ? $('article').first() : $('main').last().length ? $('main').last() : $('body');
    const text = main.text().replace(/\s+/g, ' ').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const paragraphs = main.find('p').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get().filter(p => p.split(/\s+/).length >= 25);
    results.push({ url, finalUrl: response.url, status: response.status, title, robots, canonical, words, headings: main.find('h1,h2,h3').length, paragraphs, triage: response.status !== 200 ? 'http-review' : /noindex/i.test(robots) ? 'excluded' : words === 0 ? 'render-review' : words < 300 ? 'short-review' : 'editorial-review' });
  } catch (error) { results.push({ url, error: error.message, triage: 'unverified' }); }
}
// Discover all destinations linked by the knowledge hub and public navigation first.
await inspect(origins[0] + '/knowledge', true);
const queue = [...pages].filter(url => url !== origins[0] + '/knowledge');
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < queue.length) {
    const url = queue[cursor++]; await inspect(url);
    if (results.length % 25 === 0) console.log('Inspected', results.length, 'of', queue.length + 1);
  }
}));
const repeated = new Map();
for (const result of results) for (const paragraph of new Set(result.paragraphs || [])) {
  const urls = repeated.get(paragraph) || []; urls.push(result.url); repeated.set(paragraph, urls);
}
const duplicates = [...repeated].filter(([, urls]) => urls.length >= 3).map(([text, urls]) => ({ text, urls }));
const report = { generatedAt: new Date().toISOString(), scope: 'Submitted sitemaps across three hosts, static source routes, and one knowledge/navigation link pass. Initial HTML only; no account access or interactive validation.', sitemaps: [...maps.values()], results: results.sort((a,b) => a.url.localeCompare(b.url)), repeatedParagraphs: duplicates };
await fs.mkdir('docs/audits', { recursive: true });
await fs.writeFile(process.env.AUDIT_REPORT_PATH || 'docs/audits/public-content-2026-10-21.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: results.length, sitemaps: report.sitemaps, triage: results.reduce((counts, result) => ({ ...counts, [result.triage]: (counts[result.triage] || 0) + 1 }), {}), repeatedParagraphs: duplicates.length }, null, 2));
