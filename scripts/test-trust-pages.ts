import * as cheerio from 'cheerio';

const TRUST_PAGES = [
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/cookies',
  '/editorial-policy',
  '/refund-policy',
  '/delivery-policy',
];

async function verifyTrustPages() {
  console.log('--- VERIFYING TRUST AND LEGAL PAGES ---');

  for (const path of TRUST_PAGES) {
    const url = `http://localhost:3000${path}`;
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      const canonical = $('link[rel="canonical"]').attr('href') || '';
      const robots = $('meta[name="robots"]').attr('content') || 'index, follow';
      const cleanBody = $('body').text().replace(/\s+/g, ' ').trim();
      const words = cleanBody.split(' ').length;

      console.log(`\nPage: ${path}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  Title: "${title}"`);
      console.log(`  H1: "${h1}"`);
      console.log(`  Canonical: "${canonical}"`);
      console.log(`  Robots: "${robots}"`);
      console.log(`  Word count: ${words}`);

      if (res.status !== 200) {
        console.error(`  FAIL: Non-200 status for ${path}`);
      }
    } catch (err: any) {
      console.error(`  FAIL: Error fetching ${path}:`, err.message);
    }
  }
}

verifyTrustPages();

