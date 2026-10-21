import fs from 'node:fs/promises';
import { load } from 'cheerio';

const hosts = [
  { base: 'https://fabric.dattasable.com', root: 'D:/Datta Sable/Fabric.dattasable' },
  { base: 'https://excel.dattasable.com', root: 'D:/Datta Sable/Excel to Dashboards' },
];
const results = [];
for (const host of hosts) {
  const config = JSON.parse(await fs.readFile(host.root + '/vercel.json', 'utf8'));
  const paths = ['/', ...config.rewrites.filter(rule => rule.destination.endsWith('/index.html') && !rule.source.includes('(')).map(rule => rule.source)];
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < paths.length) {
      const path = paths[cursor++];
      try {
        const expected = load(await fs.readFile(host.root + '/dist' + (path === '/' ? '' : path) + '/index.html', 'utf8'));
        const response = await fetch(host.base + path, { signal: AbortSignal.timeout(45000) });
        const $ = load(await response.text());
        const text = $('main').text().replace(/\s+/g, ' ').trim() || $('#root').text().replace(/\s+/g, ' ').trim();
        const canonical = $('link[rel=canonical]').attr('href') || '';
        const robots = $('meta[name=robots]').attr('content') || '';
        const metadataMatches = canonical === (expected('link[rel=canonical]').attr('href') || '') && robots === (expected('meta[name=robots]').attr('content') || '');
        results.push({ url: host.base + path, status: response.status, headings: $('h1').length, words: text.split(/\s+/).filter(Boolean).length, title: $('title').text(), robots, canonical, metadataMatches, passed: response.status === 200 && $('h1').length >= 1 && text.length > 200 && metadataMatches });
      } catch (error) {
        results.push({ url: host.base + path, passed: false, error: error.message });
      }
    }
  }));
}
results.sort((a, b) => a.url.localeCompare(b.url));
await fs.writeFile('docs/audits/subdomain-deployment-2026-10-21.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n');
console.log(JSON.stringify({ total: results.length, passed: results.filter(row => row.passed).length, failed: results.filter(row => !row.passed).map(({ url, status, headings, metadataMatches }) => ({ url, status, headings, metadataMatches })) }, null, 2));
if (results.some(row => !row.passed)) process.exitCode = 1;
