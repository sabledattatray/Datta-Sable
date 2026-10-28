import { prisma } from '../lib/prisma';
import * as cheerio from 'cheerio';

async function testEbooksProducts() {
  console.log('--- TESTING EBOOKS & PRODUCTS DISCOVERABILITY ---');

  // Fetch sitemap
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  const sitemapXml = await sitemapRes.text();

  // Test eBooks in database
  const ebooks = await prisma.commerceProduct.findMany({
    where: { ebook: { isNot: null } },
    include: { ebook: true }
  });
  console.log(`Found ${ebooks.length} eBooks in database.`);

  let allPassed = true;

  for (const eb of ebooks) {
    const url = `http://localhost:3000/ebooks/${eb.slug}`;
    const inSitemap = sitemapXml.includes(`/ebooks/${eb.slug}`);
    console.log(`\nTesting eBook: /ebooks/${eb.slug} (DB status: ${eb.status})`);
    console.log(`  In Sitemap: ${inSitemap ? 'YES' : 'NO'}`);

    const res = await fetch(url);
    console.log(`  HTTP Status: ${res.status}`);

    if (eb.status === 'PUBLISHED') {
      if (res.status !== 200) {
        console.error(`  FAIL: Published eBook /ebooks/${eb.slug} returned ${res.status}`);
        allPassed = false;
      } else {
        const html = await res.text();
        const $ = cheerio.load(html);
        const robots = $('meta[name="robots"]').attr('content') || '';
        console.log(`  Robots: "${robots}"`);
        if (robots.includes('noindex')) {
          console.error(`  FAIL: Published eBook has noindex!`);
          allPassed = false;
        } else {
          console.log(`  ✓ Published eBook is discoverable and indexed.`);
        }
      }
    } else {
      // DRAFT or ARCHIVED
      if (inSitemap) {
        console.error(`  FAIL: Draft eBook /ebooks/${eb.slug} IS in sitemap!`);
        allPassed = false;
      }
      if (res.status === 200) {
        const html = await res.text();
        const $ = cheerio.load(html);
        const robots = $('meta[name="robots"]').attr('content') || '';
        console.log(`  Robots: "${robots}"`);
        if (!robots.includes('noindex')) {
          console.error(`  FAIL: Draft eBook returned 200 but lacks noindex!`);
          allPassed = false;
        } else {
          console.log(`  ✓ Draft eBook is properly marked noindex.`);
        }
      } else {
        console.log(`  ✓ Draft eBook returns non-200 (${res.status}).`);
      }
    }
  }

  // Test Products (non-ebook commerce products)
  const products = await prisma.commerceProduct.findMany({
    where: { ebook: null }
  });
  console.log(`\nFound ${products.length} standard Products in database.`);
  for (const prod of products) {
    const inSitemap = sitemapXml.includes(`/products/${prod.slug}`);
    console.log(`Product: /products/${prod.slug} (Status: ${prod.status}, In Sitemap: ${inSitemap ? 'YES' : 'NO'})`);
    if (prod.status !== 'PUBLISHED' && inSitemap) {
      console.error(`  FAIL: Non-published product /products/${prod.slug} is in sitemap!`);
      allPassed = false;
    }
  }

  await prisma.$disconnect();

  if (!allPassed) {
    console.error('\nEBook / Product verification FAILED.');
    process.exit(1);
  } else {
    console.log('\nAll EBook / Product verification tests PASSED!');
    process.exit(0);
  }
}

testEbooksProducts();
