import fs from 'fs';
import * as cheerio from 'cheerio';

const ROUTES_404 = [
  '/admin-design-preview',
  '/article-design-preview',
  '/dashboard-design-preview',
  '/lp/executive-reporting-architecture',
  '/lp/power-bi-audit-playbook',
  '/lp/power-bi-dax-mastery',
  '/lp/power-bi-migration-accelerator',
  '/tools/word-counter'
];

async function verify404s() {
  console.log('--- VERIFYING 8 HTTP 404 ROUTES ---');

  // 1. Check sitemap.xml
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml').catch(() => null);
  let sitemapContent = '';
  if (sitemapRes && sitemapRes.ok) {
    sitemapContent = await sitemapRes.text();
  } else {
    // Read source sitemap generator
    sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
  }

  // 2. Scan public page templates for internal links
  const appFiles = fs.readdirSync('app', { recursive: true }) as string[];
  const sourceCodeFiles = appFiles
    .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map(f => ({ path: `app/${f}`, content: fs.readFileSync(`app/${f}`, 'utf8') }));

  let allClean = true;

  for (const route of ROUTES_404) {
    console.log(`\nInspecting route: ${route}`);

    // Check sitemap
    const inSitemap = sitemapContent.includes(route);
    console.log(`  Appears in Sitemap: ${inSitemap ? 'YES (DEFECT)' : 'NO (PASSED)'}`);
    if (inSitemap) allClean = false;

    // Check internal links in codebase
    const referencingFiles: string[] = [];
    for (const file of sourceCodeFiles) {
      if (file.content.includes(`"${route}"`) || file.content.includes(`'${route}'`) || file.content.includes(`href="${route}"`)) {
        // Exclude test or audit scripts
        if (!file.path.includes('test') && !file.path.includes('audit')) {
          referencingFiles.push(file.path);
        }
      }
    }

    console.log(`  Referenced in active app templates: ${referencingFiles.length > 0 ? referencingFiles.join(', ') : 'NONE (PASSED)'}`);
    if (referencingFiles.length > 0) allClean = false;
  }

  if (allClean) {
    console.log('\n✓ ALL 8 404 routes are completely isolated: absent from sitemaps and unlinked in internal navigation.');
  } else {
    console.warn('\n⚠ Some 404 routes are still referenced in active templates.');
  }
}

verify404s();

