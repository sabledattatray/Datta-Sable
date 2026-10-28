import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { prisma } from '../lib/prisma';
import { getPublishedBlogPosts } from '../lib/blog-posts';
import { EXCEL_PROJECTS } from '../data/excelProjects';
import { KNOWLEDGE_ARTICLES } from '../data/knowledge';
import { TEMPLATES } from '../data/templates';
import { GLOSSARY_TERMS } from '../data/glossary';
import { LANDING_PAGES } from '../data/landing-pages';
import { CHAINS } from '../data/chains';

const BASE_URL = 'http://localhost:3000';
const CANONICAL_ORIGIN = 'https://dattasable.com';

interface AuditItem {
  url: string;
  normalizedPath: string;
  contentType: string;
  category: string;
  ownerEditor: string;
  pubDate: string;
  updatedDate: string;
  status: number;
  finalUrl: string;
  canonical: string;
  canonicalMatch: boolean;
  robotsMeta: string;
  xRobotsTag: string;
  inSitemap: boolean;
  title: string;
  titleLength: number;
  description: string;
  descLength: number;
  h1Count: number;
  h1Text: string;
  h2Count: number;
  wordCount: number;
  structuredDataTypes: string;
  structuredDataValid: boolean;
  brokenLinksCount: number;
  brokenLinks: string[];
  missingImagesCount: number;
  missingImages: string[];
  originalValueEvidence: string;
  targetAudience: string;
  searchIntent: string;
  duplicationRisk: string;
  authorInfo: string;
  ctaRelevance: string;
  decision: string; // KEEP | IMPROVE | MERGE | REDIRECT | NOINDEX | REMOVE-PENDING-APPROVAL | PRIVATE
  severity: string; // P0 | P1 | P2 | None
  evidence: string;
  proposedFix: string;
  ownerApprovalStatus: string;
}

async function collectAllUrls(): Promise<{ urls: Set<string>; sitemapUrls: Set<string> }> {
  const sitemapUrls = new Set<string>();
  const allUrls = new Set<string>();

  // 1. Fetch sitemap.xml
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
    for (const loc of locs) {
      sitemapUrls.add(loc);
      allUrls.add(loc.replace(CANONICAL_ORIGIN, ''));
    }
    console.log(`Discovered ${sitemapUrls.size} URLs from sitemap.xml`);
  } catch (err) {
    console.error('Failed to fetch sitemap.xml:', err);
  }

  // 2. Discover static routes
  const staticPaths = [
    '/', '/about', '/contact', '/portfolio', '/certification', '/start-here',
    '/dashboards', '/dashboards/world-business', '/dashboards/aura-capital-sales', '/dashboards/rider-ops',
    '/dashboards/blinkit-sales', '/dashboards/collection-intelligence', '/dashboards/global-sales-intelligence',
    '/dashboards/interactive', '/dashboards/revenue-intelligence', '/dashboards/sales-pipeline', '/dashboards/surgical-ai',
    '/services', '/services/consulting', '/services/dashboards', '/services/web-solutions',
    '/services/graphic-design', '/services/seo-optimization', '/services/automation', '/services/web-design',
    '/privacy', '/terms', '/disclaimer', '/cookies', '/editorial-policy', '/refund-policy', '/delivery-policy',
    '/faq', '/sitemap', '/knowledge', '/knowledge/architecture', '/knowledge/comparisons',
    '/knowledge/data-engineering', '/knowledge/patterns', '/knowledge/protocols', '/knowledge/rfc',
    '/knowledge/rfc/001-prompt-hardening', '/knowledge/rfc/002-execution-chains', '/knowledge/rfc/003-intent-mapping',
    '/knowledge/standards', '/knowledge/taxonomy',
    '/tools', '/tools/ai-prompt-generator', '/tools/bi-roi-calculator', '/tools/context-optimizer',
    '/tools/demo', '/tools/image-blade', '/tools/linkedin-formatter', '/tools/mermaid-forge',
    '/tools/open-mis', '/tools/prompt-auditor', '/tools/schema-generator', '/tools/seo-meta-generator',
    '/tools/word-counter', '/tools/workspace',
    '/chains', '/templates', '/glossary', '/careers', '/hiring', '/mentorship', '/data-forge', '/infrastructure',
    '/analytics-live', '/admin-design-preview', '/article-design-preview', '/campaign-design-preview',
    '/sign-in', '/sign-up', '/products', '/ebooks'
  ];

  for (const p of staticPaths) allUrls.add(p);

  // 3. Dynamic routes from data & DB
  // Blog posts
  const posts = await getPublishedBlogPosts();
  for (const post of posts) allUrls.add(`/blog/${post.slug}`);
  allUrls.add('/blog/microsoft-fabric');

  // Products
  const products = await prisma.commerceProduct.findMany({ select: { slug: true } });
  for (const pr of products) allUrls.add(`/products/${pr.slug}`);

  // Excel projects
  for (const proj of EXCEL_PROJECTS) allUrls.add(`/dashboards/${proj.slug}`);

  // Knowledge articles
  for (const ka of KNOWLEDGE_ARTICLES) allUrls.add(`/knowledge/${ka.slug}`);

  // Templates
  for (const tm of TEMPLATES) allUrls.add(`/templates/${tm.slug}`);

  // Glossary terms
  for (const gt of GLOSSARY_TERMS) allUrls.add(`/glossary/${gt.slug}`);

  // Landing pages
  for (const lp of LANDING_PAGES) allUrls.add(`/lp/${lp.slug}`);

  // Chains
  for (const ch of CHAINS) allUrls.add(`/chains/${ch.slug}`);

  // Ebooks
  const ebooks = await prisma.commerceProduct.findMany({
    where: { ebook: { isNot: null } },
    select: { slug: true }
  });
  for (const eb of ebooks) allUrls.add(`/ebooks/${eb.slug}`);

  const ebookCategories = await prisma.ebookCategory.findMany({ select: { slug: true } });
  for (const ec of ebookCategories) allUrls.add(`/ebooks/category/${ec.slug}`);

  console.log(`Total unique paths to audit: ${allUrls.size}`);
  return { urls: allUrls, sitemapUrls };
}

async function auditPath(relPath: string, sitemapUrls: Set<string>): Promise<AuditItem> {
  const normPath = relPath.startsWith('/') ? relPath : `/${relPath}`;
  const fullCanonicalUrl = `${CANONICAL_ORIGIN}${normPath === '/' ? '' : normPath}`;
  const fetchUrl = `${BASE_URL}${normPath}`;

  const item: AuditItem = {
    url: fullCanonicalUrl,
    normalizedPath: normPath,
    contentType: 'Unknown',
    category: 'General',
    ownerEditor: 'Datta Sable',
    pubDate: '',
    updatedDate: '',
    status: 0,
    finalUrl: '',
    canonical: '',
    canonicalMatch: false,
    robotsMeta: '',
    xRobotsTag: '',
    inSitemap: sitemapUrls.has(fullCanonicalUrl) || sitemapUrls.has(`${fullCanonicalUrl}/`),
    title: '',
    titleLength: 0,
    description: '',
    descLength: 0,
    h1Count: 0,
    h1Text: '',
    h2Count: 0,
    wordCount: 0,
    structuredDataTypes: '',
    structuredDataValid: true,
    brokenLinksCount: 0,
    brokenLinks: [],
    missingImagesCount: 0,
    missingImages: [],
    originalValueEvidence: '',
    targetAudience: '',
    searchIntent: '',
    duplicationRisk: 'Low',
    authorInfo: 'Datta Sable',
    ctaRelevance: 'High',
    decision: 'KEEP',
    severity: 'None',
    evidence: '',
    proposedFix: '',
    ownerApprovalStatus: 'Pending Review'
  };

  // Classify Content Type
  if (normPath === '/') item.contentType = 'Homepage';
  else if (normPath.startsWith('/blog/')) item.contentType = 'Blog Article';
  else if (normPath === '/blog') item.contentType = 'Blog Index';
  else if (normPath.startsWith('/dashboards/')) item.contentType = 'Dashboard';
  else if (normPath === '/dashboards') item.contentType = 'Dashboard Index';
  else if (normPath.startsWith('/services/')) item.contentType = 'Service Detail';
  else if (normPath === '/services') item.contentType = 'Services Index';
  else if (normPath.startsWith('/products/')) item.contentType = 'Product Detail';
  else if (normPath === '/products') item.contentType = 'Products Index';
  else if (normPath.startsWith('/ebooks/category/')) item.contentType = 'eBook Category';
  else if (normPath.startsWith('/ebooks/')) item.contentType = 'eBook Detail';
  else if (normPath === '/ebooks') item.contentType = 'eBook Index';
  else if (normPath.startsWith('/tools/')) item.contentType = 'Interactive Tool';
  else if (normPath === '/tools') item.contentType = 'Tools Index';
  else if (normPath.startsWith('/knowledge/')) item.contentType = 'Knowledge Note';
  else if (normPath === '/knowledge') item.contentType = 'Knowledge Hub';
  else if (normPath.startsWith('/templates/')) item.contentType = 'Template Detail';
  else if (normPath === '/templates') item.contentType = 'Templates Index';
  else if (normPath.startsWith('/glossary/')) item.contentType = 'Glossary Term';
  else if (normPath === '/glossary') item.contentType = 'Glossary Index';
  else if (normPath.startsWith('/chains/')) item.contentType = 'Workflow Chain';
  else if (normPath === '/chains') item.contentType = 'Chains Index';
  else if (normPath.startsWith('/lp/')) item.contentType = 'Landing Page';
  else if (['/privacy', '/terms', '/disclaimer', '/cookies', '/editorial-policy', '/refund-policy', '/delivery-policy'].includes(normPath)) {
    item.contentType = 'Legal/Trust Policy';
  } else if (['/about', '/contact', '/portfolio', '/certification', '/start-here', '/faq', '/sitemap'].includes(normPath)) {
    item.contentType = 'Core Public Page';
  } else if (normPath.startsWith('/admin') || normPath.startsWith('/account') || normPath.startsWith('/checkout') || normPath.includes('-preview')) {
    item.contentType = 'Admin/Private/Preview';
  } else if (['/careers', '/hiring'].includes(normPath)) {
    item.contentType = 'Careers';
  }

  try {
    const res = await fetch(fetchUrl, { redirect: 'manual', headers: { 'User-Agent': 'AntigravityAudit/1.0' } });
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
      return item;
    }

    if (res.status === 404) {
      item.decision = 'REMOVE-PENDING-APPROVAL';
      item.evidence = `HTTP 404 Not Found`;
      item.severity = item.inSitemap ? 'P0' : 'P1';
      item.proposedFix = item.inSitemap ? 'Remove dead URL from sitemap' : 'Fix broken route or add 301 redirect';
      return item;
    }

    if (res.status !== 200) {
      item.decision = 'IMPROVE';
      item.evidence = `HTTP ${res.status}`;
      item.severity = 'P0';
      item.proposedFix = `Investigate unhandled HTTP ${res.status}`;
      return item;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Title
    item.title = $('title').first().text().replace(/\s+/g, ' ').trim();
    item.titleLength = item.title.length;

    // Description
    item.description = $('meta[name="description"]').attr('content')?.replace(/\s+/g, ' ').trim() || '';
    item.descLength = item.description.length;

    // Canonical
    item.canonical = $('link[rel="canonical"]').attr('href') || '';
    item.canonicalMatch = item.canonical === item.url || (item.canonical === `${item.url}/` && item.url !== CANONICAL_ORIGIN);

    // Robots meta
    item.robotsMeta = $('meta[name="robots"]').attr('content') || '';

    // Headings
    const h1s = $('h1').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get();
    item.h1Count = h1s.length;
    item.h1Text = h1s.join(' | ');
    item.h2Count = $('h2').length;

    // Extract JSON-LD
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

    // Calculate main content word count
    const cloned$ = cheerio.load(html);
    cloned$('nav, footer, script, style, noscript, aside, form, #theme-init').remove();
    const mainEl = cloned$('.blog-content').length
      ? cloned$('.blog-content')
      : cloned$('main').length
        ? cloned$('main')
        : cloned$('body');
    const mainText = mainEl.text().replace(/\s+/g, ' ').trim();
    item.wordCount = mainText ? mainText.split(/\s+/).length : 0;

    // Check missing images
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (!src || src.startsWith('data:')) return;
      if (src.includes('undefined') || src.includes('null')) {
        item.missingImages.push(src);
      }
    });
    item.missingImagesCount = item.missingImages.length;

    // Triage decisions & Low-Value Content checks
    const isNoindex = /noindex/i.test(item.robotsMeta) || /noindex/i.test(item.xRobotsTag);

    if (item.contentType === 'Admin/Private/Preview') {
      item.decision = 'PRIVATE';
      item.severity = 'None';
      if (!isNoindex) {
        item.severity = 'P0';
        item.evidence = 'Admin/private/preview page is indexable!';
        item.proposedFix = 'Add robots noindex to admin/preview route';
      }
      return item;
    }

    if (item.contentType === 'Careers' && item.title.includes('Page Not Found')) {
      item.decision = 'NOINDEX';
      item.severity = 'P1';
      item.evidence = `Careers route returns 200 with "Page Not Found" title and thin text`;
      item.proposedFix = `Align /careers with actual hiring status or return 404 / 301 to /about`;
      return item;
    }

    if (isNoindex) {
      if (item.inSitemap) {
        item.severity = 'P0';
        item.evidence = `Page is in sitemap.xml but has robots noindex!`;
        item.proposedFix = `Remove noindexed URL from sitemap.xml to prevent crawler confusion`;
      } else {
        item.decision = 'NOINDEX';
        item.evidence = `Correctly marked noindex`;
      }
      return item;
    }

    // Indexable pages checks:
    if (item.wordCount < 200 && !['Homepage', 'Contact'].includes(item.contentType)) {
      item.severity = 'P1';
      item.decision = 'IMPROVE';
      item.evidence = `Thin content: rendered main content is only ${item.wordCount} words`;
      item.proposedFix = `Expand with substantive technical explanations, examples, or noindex if utility page`;
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

  } catch (err: any) {
    item.status = 500;
    item.severity = 'P0';
    item.evidence = `Crawl fetch failed: ${err.message}`;
    item.proposedFix = `Fix runtime crash / server error on ${item.normalizedPath}`;
  }

  return item;
}

async function runAudit() {
  console.log('--- STARTING COMPLETE REPOSITORY & RUNTIME CRAWL AUDIT ---');
  const { urls, sitemapUrls } = await collectAllUrls();

  const results: AuditItem[] = [];
  const urlList = Array.from(urls);

  const concurrency = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < urlList.length) {
      const idx = cursor++;
      const path = urlList[idx];
      const item = await auditPath(path, sitemapUrls);
      results.push(item);
      if (results.length % 20 === 0 || results.length === urlList.length) {
        console.log(`Audited ${results.length} / ${urlList.length} URLs...`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // Sort by URL
  results.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));

  // Write CSV
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
    ...results.map(r => [
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

  const docsDir = 'docs/adsense';
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  fs.writeFileSync(path.join(docsDir, '01-route-inventory.csv'), csvRows.join('\n'), 'utf-8');
  fs.writeFileSync(path.join(docsDir, 'route-inventory.csv'), csvRows.join('\n'), 'utf-8');

  // Write JSON for baseline compilation
  fs.writeFileSync(path.join(docsDir, 'raw-crawl-results.json'), JSON.stringify(results, null, 2), 'utf-8');

  console.log(`\nCrawl complete! Audited ${results.length} URLs.`);
  console.log(`Results written to docs/adsense/01-route-inventory.csv and docs/adsense/route-inventory.csv`);

  // Summary counts
  const statusCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {};
  const decisionCounts: Record<string, number> = {};

  for (const r of results) {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    severityCounts[r.severity] = (severityCounts[r.severity] || 0) + 1;
    decisionCounts[r.decision] = (decisionCounts[r.decision] || 0) + 1;
  }

  console.log('HTTP Statuses:', statusCounts);
  console.log('Severities:', severityCounts);
  console.log('Decisions:', decisionCounts);
}

runAudit()
  .catch(err => {
    console.error('Audit script failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

