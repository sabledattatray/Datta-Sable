import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { prisma } from '../lib/prisma';

const BASE_URL = 'http://localhost:3000';
const CANONICAL_ORIGIN = 'https://dattasable.com';

async function fixFailedItems() {
  const jsonPath = 'docs/adsense/raw-crawl-results.json';
  const data: any[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const sitemapUrls = new Set(data.filter(d => d.inSitemap).map(d => d.url));

  const failedIndices = data.map((d, i) => d.status === 500 && d.evidence.includes('Crawl fetch failed') ? i : -1).filter(i => i !== -1);
  console.log(`Found ${failedIndices.length} items that failed due to dev server restart. Re-auditing sequentially...`);

  for (let step = 0; step < failedIndices.length; step++) {
    const idx = failedIndices[step];
    const item = data[idx];
    const normPath = item.normalizedPath;
    const fetchUrl = `${BASE_URL}${normPath}`;

    try {
      // Retry up to 3 times with small delay
      let res: Response | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          res = await fetch(fetchUrl, { redirect: 'manual', headers: { 'User-Agent': 'AntigravityAudit/1.0' } });
          break;
        } catch {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!res) throw new Error('Fetch failed after 3 attempts');

      item.status = res.status;
      item.xRobotsTag = res.headers.get('x-robots-tag') || '';

      if (res.status >= 300 && res.status < 400) {
        item.finalUrl = res.headers.get('location') || '';
        item.decision = 'REDIRECT';
        item.evidence = `HTTP ${res.status} redirects to ${item.finalUrl}`;
        if (item.inSitemap) {
          item.severity = 'P0';
          item.proposedFix = `Remove redirecting URL from sitemap; replace with final canonical destination ${item.finalUrl}`;
        }
        continue;
      }

      if (res.status === 404) {
        item.decision = 'REMOVE-PENDING-APPROVAL';
        item.evidence = `HTTP 404 Not Found`;
        item.severity = item.inSitemap ? 'P0' : 'P1';
        item.proposedFix = item.inSitemap ? 'Remove dead URL from sitemap' : 'Fix broken route or add 301 redirect';
        continue;
      }

      if (res.status !== 200) {
        item.decision = 'IMPROVE';
        item.evidence = `HTTP ${res.status}`;
        item.severity = 'P0';
        item.proposedFix = `Investigate unhandled HTTP ${res.status}`;
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      item.title = $('title').first().text().replace(/\s+/g, ' ').trim();
      item.titleLength = item.title.length;
      item.description = $('meta[name="description"]').attr('content')?.replace(/\s+/g, ' ').trim() || '';
      item.descLength = item.description.length;
      item.canonical = $('link[rel="canonical"]').attr('href') || '';
      item.canonicalMatch = item.canonical === item.url || (item.canonical === `${item.url}/` && item.url !== CANONICAL_ORIGIN);
      item.robotsMeta = $('meta[name="robots"]').attr('content') || '';

      const h1s = $('h1').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get();
      item.h1Count = h1s.length;
      item.h1Text = h1s.join(' | ');
      item.h2Count = $('h2').length;

      const schemas: string[] = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const raw = $(el).html();
          if (raw) {
            const parsed = JSON.parse(raw);
            const addType = (obj: any) => {
              if (obj && obj['@type']) schemas.push(obj['@type']);
              if (Array.isArray(obj)) obj.forEach(addType);
              if (obj && obj['@graph'] && Array.isArray(obj['@graph'])) obj['@graph'].forEach(addType);
            };
            addType(parsed);
          }
        } catch {
          item.structuredDataValid = false;
        }
      });
      item.structuredDataTypes = schemas.join(', ');

      const cloned$ = cheerio.load(html);
      cloned$('nav, footer, script, style, noscript, aside, form, #theme-init').remove();
      const mainEl = cloned$('.blog-content').length
        ? cloned$('.blog-content')
        : cloned$('main').length
          ? cloned$('main')
          : cloned$('body');
      const mainText = mainEl.text().replace(/\s+/g, ' ').trim();
      item.wordCount = mainText ? mainText.split(/\s+/).length : 0;

      const isNoindex = /noindex/i.test(item.robotsMeta) || /noindex/i.test(item.xRobotsTag);

      if (item.contentType === 'Admin/Private/Preview') {
        item.decision = 'PRIVATE';
        item.severity = isNoindex ? 'None' : 'P0';
        item.evidence = isNoindex ? 'Private route correctly marked noindex' : 'Admin/private/preview page is indexable!';
        continue;
      }

      if (item.contentType === 'Careers' && item.title.includes('Page Not Found')) {
        item.decision = 'NOINDEX';
        item.severity = 'P1';
        item.evidence = `Careers route returns 200 with "Page Not Found" title and thin text`;
        item.proposedFix = `Align /careers with actual hiring status or return 404 / 301 to /about`;
        continue;
      }

      if (isNoindex) {
        if (item.inSitemap) {
          item.severity = 'P0';
          item.evidence = `Page is in sitemap.xml but has robots noindex!`;
          item.proposedFix = `Remove noindexed URL from sitemap.xml to prevent crawler confusion`;
        } else {
          item.decision = 'NOINDEX';
          item.severity = 'None';
          item.evidence = `Correctly marked noindex`;
        }
        continue;
      }

      // Indexable checks
      item.severity = 'None';
      item.decision = 'KEEP';
      item.evidence = 'Healthy canonical indexable page';

      if (item.wordCount < 200 && !['Homepage', 'Contact'].includes(item.contentType)) {
        item.severity = 'P1';
        item.decision = 'IMPROVE';
        item.evidence = `Thin content: rendered main content is only ${item.wordCount} words`;
        item.proposedFix = `Expand with substantive technical explanations or noindex if utility`;
      }

      if (item.h1Count === 0) {
        item.severity = 'P1';
        item.evidence = `Missing H1 heading on page`;
        item.proposedFix = `Add a single descriptive H1 heading`;
      } else if (item.h1Count > 1) {
        item.severity = 'P2';
        item.evidence = `Multiple H1 headings (${item.h1Count})`;
        item.proposedFix = `Consolidate to a single authoritative H1 heading`;
      }

      if (!item.canonicalMatch) {
        item.severity = 'P1';
        item.evidence = `Canonical mismatch: canonical is "${item.canonical}", expected "${item.url}"`;
        item.proposedFix = `Correct alternates.canonical metadata`;
      }

      if (item.titleLength === 0) {
        item.severity = 'P0';
        item.evidence = `Missing page title`;
        item.proposedFix = `Add unique, descriptive title`;
      } else if (item.titleLength > 65) {
        item.severity = 'P2';
        item.evidence = `Title exceeds recommended SERP snippet length (${item.titleLength} chars)`;
      }

      if (item.descLength === 0) {
        item.severity = 'P1';
        item.evidence = `Missing meta description`;
        item.proposedFix = `Add meta description`;
      }

      console.log(`[${step + 1}/${failedIndices.length}] Re-audited ${normPath} -> ${item.status} (words: ${item.wordCount}, decision: ${item.decision}, severity: ${item.severity})`);
    } catch (err: any) {
      console.error(`Failed again on ${normPath}:`, err.message);
    }
  }

  // Rewrite CSV and JSON
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

  const csvHeaders = [
    'URL', 'Normalized Path', 'Content Type', 'Category', 'Owner/Editor',
    'HTTP Status', 'Final URL', 'Canonical', 'Canonical Match', 'Robots Meta',
    'In Sitemap', 'Title', 'Title Length', 'Description Length', 'H1 Count',
    'H1 Text', 'H2 Count', 'Word Count', 'Structured Data Types', 'Structured Data Valid',
    'Missing Images', 'Decision', 'Severity', 'Evidence', 'Proposed Fix', 'Owner Approval Status'
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows = [
    csvHeaders.join(','),
    ...data.map(r => [
      escapeCsv(r.url),
      escapeCsv(r.normalizedPath),
      escapeCsv(r.contentType),
      escapeCsv(r.category),
      escapeCsv(r.ownerEditor),
      escapeCsv(r.status),
      escapeCsv(r.finalUrl),
      escapeCsv(r.canonical),
      escapeCsv(r.canonicalMatch ? 'YES' : 'NO'),
      escapeCsv(r.robotsMeta || r.xRobotsTag || 'index, follow'),
      escapeCsv(r.inSitemap ? 'YES' : 'NO'),
      escapeCsv(r.title),
      escapeCsv(r.titleLength),
      escapeCsv(r.descLength),
      escapeCsv(r.h1Count),
      escapeCsv(r.h1Text),
      escapeCsv(r.h2Count),
      escapeCsv(r.wordCount),
      escapeCsv(r.structuredDataTypes),
      escapeCsv(r.structuredDataValid ? 'YES' : 'NO'),
      escapeCsv(r.missingImagesCount),
      escapeCsv(r.decision),
      escapeCsv(r.severity),
      escapeCsv(r.evidence),
      escapeCsv(r.proposedFix),
      escapeCsv(r.ownerApprovalStatus)
    ].join(','))
  ];

  fs.writeFileSync('docs/adsense/01-route-inventory.csv', csvRows.join('\n'), 'utf-8');
  fs.writeFileSync('docs/adsense/route-inventory.csv', csvRows.join('\n'), 'utf-8');

  const statusCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {};
  const decisionCounts: Record<string, number> = {};

  for (const r of data) {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    severityCounts[r.severity] = (severityCounts[r.severity] || 0) + 1;
    decisionCounts[r.decision] = (decisionCounts[r.decision] || 0) + 1;
  }

  console.log('\n--- FINAL CRAWL AUDIT TOTALS ---');
  console.log('HTTP Statuses:', statusCounts);
  console.log('Severities:', severityCounts);
  console.log('Decisions:', decisionCounts);
}

fixFailedItems().catch(e => console.error(e)).finally(() => prisma.$disconnect());

