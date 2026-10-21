import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { load } from 'cheerio';

const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const excluded = [
  '/knowledge/optimizing-ai-context-windows', '/knowledge/technical-storytelling-for-founders',
  '/knowledge/comparisons', '/knowledge/standards', '/knowledge/protocols',
  '/knowledge/patterns', '/knowledge/taxonomy', '/knowledge/architecture',
  '/knowledge/data-engineering', '/knowledge/rfc', '/knowledge/rfc/001-prompt-hardening',
  '/knowledge/rfc/002-execution-chains', '/knowledge/rfc/003-intent-mapping',
  '/templates/b2b-retention-post-blueprint', '/templates/high-ctr-meta-structures',
  '/templates/saas-product-schema-blueprint', '/tools', '/tools/open-mis', '/chains',
  '/infrastructure', '/dashboards/sales-pipeline', '/dashboards/surgical-ai',
  '/dashboards/blinkit-sales',
];
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < excluded.length) {
    const path = excluded[cursor++];
    try {
      const response = await fetch(base + path, { signal: AbortSignal.timeout(60000) });
      assert.equal(response.status, 200, path);
      const body = await response.text();
      const $ = load(body);
      assert.match($('meta[name="robots"]').attr('content') || '', /noindex/, path);
      assert.equal($('script[src*="pagead2.googlesyndication.com"]').length, 0, 'No advertising script on ' + path);
      assert.equal($('h1').length, 1, 'One primary heading on ' + path);
      results.push({ path, passed: true, robots: $('meta[name="robots"]').attr('content') });
    } catch (error) { results.push({ path, passed: false, error: error.message }); }
  }
}));
for (const path of ['/knowledge', '/robots.txt', '/sitemap.xml']) {
  try {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, path);
    const body = await response.text();
    if (path === '/knowledge') {
      const $ = load(body);
      assert.match($('meta[name="robots"]').attr('content') || '', /index/);
      assert.doesNotMatch($('meta[name="robots"]').attr('content') || '', /noindex/);
      assert.ok($('a[href="/knowledge/comparisons"]').length);
    } else if (path === '/robots.txt') {
      assert.doesNotMatch(body, /Disallow:\s*\/tools/);
      assert.match(body, /User-agent: Mediapartners-Google/);
    } else {
      assert.match(body, /https:\/\/dattasable.com\/knowledge</);
      for (const entry of excluded) assert.ok(!body.includes('https://dattasable.com' + entry + '<'), 'Excluded from sitemap: ' + entry);
    }
    results.push({ path, passed: true });
  } catch (error) { results.push({ path, passed: false, error: error.message }); }
}
await fs.writeFile('docs/audits/local-readiness-2026-10-21.json', JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
console.log(JSON.stringify({ passed: results.filter(result => result.passed).length, failed: results.filter(result => !result.passed) }, null, 2));
if (results.some(result => !result.passed)) process.exitCode = 1;
