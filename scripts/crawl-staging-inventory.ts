import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

interface CrawlResult {
  url: string;
  normalizedPath: string;
  contentType: string;
  status: number;
  finalUrl: string;
  canonical: string;
  canonicalMatch: string;
  robots: string;
  inSitemap: string;
  title: string;
  titleLength: number;
  h1Count: number;
  h1Text: string;
  h2Count: number;
  wordCount: number;
  decision: string;
  severity: string;
  notes: string;
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
  return `"${str}"`;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

async function runStagingCrawl() {
  console.log('--- EXECUTING STAGING ROUTE CRAWL ---');

  // 1. Fetch sitemap
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  const sitemapXml = await sitemapRes.text();
  console.log('Fetched sitemap.xml, length:', sitemapXml.length);

  // 2. Read existing 01-route-inventory.csv
  const rawCsv = fs.readFileSync('docs/adsense/01-route-inventory.csv', 'utf-8');
  const lines = rawCsv.split('\n').filter(l => l.trim().length > 0);
  const header = parseCsvLine(lines[0]);
  console.log(`Loaded ${lines.length - 1} routes from 01-route-inventory.csv`);

  const results: CrawlResult[] = [];
  const statusCounts: Record<string, number> = {};
  let total500s = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const originalUrl = cols[0] || '';
    const normalizedPath = cols[1] || '';
    const contentType = cols[2] || '';
    const priorDecision = cols[19] || 'KEEP';

    const testUrl = `http://localhost:3000${normalizedPath}`;
    const expectedCanonical = `https://dattasable.com${normalizedPath}`;
    const inSitemap = sitemapXml.includes(`<loc>${expectedCanonical}</loc>`) || sitemapXml.includes(`<loc>https://dattasable.com${normalizedPath}/</loc>`);

    try {
      // First fetch without manual follow to catch 301/308 redirects
      const resInitial = await fetch(testUrl, { redirect: 'manual' });
      let status = resInitial.status;
      let finalUrl = testUrl;
      let html = '';

      if (status >= 300 && status < 400) {
        const location = resInitial.headers.get('location') || '';
        finalUrl = location.startsWith('http') ? location : `http://localhost:3000${location}`;
        // Follow redirect to inspect destination
        const resFollowed = await fetch(finalUrl);
        html = await resFollowed.text();
      } else {
        html = await resInitial.text();
      }

      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status >= 500) total500s++;

      const $ = cheerio.load(html);
      const title = ($('title').text() || '').trim();
      const canonicalTag = $('link[rel="canonical"]').attr('href') || '';
      const robotsMeta = $('meta[name="robots"]').attr('content') || (status === 200 ? 'index, follow' : 'noindex');
      const h1Count = $('h1').length;
      const h1Text = ($('h1').first().text() || '').trim();
      const h2Count = $('h2').length;
      const cleanBody = $('body').text().replace(/\s+/g, ' ').trim();
      const wordCount = cleanBody.length > 0 ? cleanBody.split(' ').length : 0;

      const canonicalMatch = (canonicalTag === expectedCanonical || canonicalTag === `https://dattasable.com${normalizedPath}/`) ? 'YES' : 'NO';

      let decision = priorDecision;
      let severity = 'None';
      let notes = 'Verified on production build';

      if (status === 308 || status === 301) {
        decision = 'REDIRECT';
        notes = `Redirects to ${finalUrl}`;
      } else if (status === 404) {
        decision = 'REMOVE-PENDING-APPROVAL';
        severity = 'P2';
        notes = 'Route returns HTTP 404 Not Found';
      } else if (robotsMeta.includes('noindex')) {
        decision = 'NOINDEX';
        notes = 'Marked noindex per policy';
      }

      results.push({
        url: originalUrl,
        normalizedPath,
        contentType,
        status,
        finalUrl: finalUrl.replace('http://localhost:3000', 'https://dattasable.com'),
        canonical: canonicalTag,
        canonicalMatch,
        robots: robotsMeta,
        inSitemap: inSitemap ? 'YES' : 'NO',
        title,
        titleLength: title.length,
        h1Count,
        h1Text,
        h2Count,
        wordCount,
        decision,
        severity,
        notes,
      });

      if (i % 25 === 0 || i === lines.length - 1) {
        console.log(`  Processed ${i}/${lines.length - 1} routes...`);
      }
    } catch (err: any) {
      console.error(`Error crawling ${testUrl}:`, err.message);
      statusCounts['ERR'] = (statusCounts['ERR'] || 0) + 1;
      results.push({
        url: originalUrl,
        normalizedPath,
        contentType,
        status: 500,
        finalUrl: testUrl,
        canonical: '',
        canonicalMatch: 'NO',
        robots: 'noindex',
        inSitemap: inSitemap ? 'YES' : 'NO',
        title: '',
        titleLength: 0,
        h1Count: 0,
        h1Text: '',
        h2Count: 0,
        wordCount: 0,
        decision: 'INVESTIGATE',
        severity: 'P0',
        notes: `Crawl error: ${err.message}`,
      });
      total500s++;
    }
  }

  // 3. Write docs/adsense/08-staging-route-crawl.csv
  const csvHeaders = [
    'url',
    'normalizedPath',
    'contentType',
    'status',
    'finalUrl',
    'canonical',
    'canonicalMatch',
    'robots',
    'inSitemap',
    'title',
    'titleLength',
    'h1Count',
    'h1Text',
    'h2Count',
    'wordCount',
    'decision',
    'severity',
    'notes'
  ];

  const csvRows = [
    csvHeaders.join(','),
    ...results.map(r => [
      escapeCsv(r.url),
      escapeCsv(r.normalizedPath),
      escapeCsv(r.contentType),
      escapeCsv(r.status),
      escapeCsv(r.finalUrl),
      escapeCsv(r.canonical),
      escapeCsv(r.canonicalMatch),
      escapeCsv(r.robots),
      escapeCsv(r.inSitemap),
      escapeCsv(r.title),
      escapeCsv(r.titleLength),
      escapeCsv(r.h1Count),
      escapeCsv(r.h1Text),
      escapeCsv(r.h2Count),
      escapeCsv(r.wordCount),
      escapeCsv(r.decision),
      escapeCsv(r.severity),
      escapeCsv(r.notes)
    ].join(','))
  ];

  fs.writeFileSync('docs/adsense/08-staging-route-crawl.csv', csvRows.join('\n'), 'utf-8');
  console.log('\n✓ Successfully wrote docs/adsense/08-staging-route-crawl.csv');
  console.log(`Total URLs crawled: ${results.length}`);
  console.log('Status code distribution:', statusCounts);
  console.log(`Total HTTP 500 errors: ${total500s}`);

  if (total500s > 0) {
    console.error('FAIL: Unexpected HTTP 500 errors detected!');
    process.exit(1);
  }
}

runStagingCrawl().catch(err => {
  console.error('Staging crawl failed:', err);
  process.exit(1);
});
