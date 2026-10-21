import fs from 'node:fs/promises';
import { load } from 'cheerio';

const origins = new Set(['https://dattasable.com', 'https://fabric.dattasable.com', 'https://excel.dattasable.com']);
const inventory = JSON.parse(await fs.readFile('docs/audits/production-content-2026-10-21.json', 'utf8'));
const links = new Map();
const failures = [];
async function parallel(items, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (cursor < items.length) await worker(items[cursor++]);
  }));
}
await parallel(inventory.results.filter(page => page.status === 200), async page => {
  try {
    const response = await fetch(page.url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw Error('HTTP ' + response.status);
    const $ = load(await response.text());
    $('a[href]').each((_, el) => {
      const raw = $(el).attr('href');
      if (!raw || raw.startsWith('#')) return;
      try {
        const url = new URL(raw, page.url);
        if (!origins.has(url.origin) || /^\/(api|admin|dashboard|auth)(\/|$)/.test(url.pathname)) return;
        url.hash = '';
        const sources = links.get(url.href) || new Set();
        sources.add(page.url);
        links.set(url.href, sources);
      } catch {}
    });
  } catch (error) { failures.push({ page: page.url, error: error.message }); }
});
console.log('Discovered internal destinations:', links.size);
const results = [];
await parallel([...links], async ([url, sources]) => {
  try {
    let response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
    if (response.status === 405) {
      response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      await response.body?.cancel();
    }
    results.push({ url, status: response.status, finalUrl: response.url, contentType: response.headers.get('content-type'), sources: [...sources] });
  } catch (error) { results.push({ url, error: error.message, sources: [...sources] }); }
});
const report = { generatedAt: new Date().toISOString(), scope: 'Initial HTML anchors on previously inventoried public pages; internal destinations only. HEAD status checks do not verify interactive controls or file contents.', discoveryFailures: failures, results };
await fs.writeFile('docs/audits/public-links-2026-10-21.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checked: results.length, discoveryFailures: failures.length, issues: results.filter(item => !item.status || item.status >= 400) }, null, 2));
