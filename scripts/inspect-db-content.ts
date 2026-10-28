import { prisma } from '../lib/prisma';
import * as cheerio from 'cheerio';

const TOP_20_SLUGS = [
  'dp-600-study-guide-2026',
  'microsoft-fabric-certification-roadmap-2026',
  'edge-first-era-web-performance-2026',
  'death-of-static-dashboards-decision-intelligence',
  'video-fabric-end-to-end',
  'global-data-privacy-regulations-2026',
  'scaling-data-culture-enterprise',
  'cdo-playbook-2026-strategy',
  'real-time-streaming-analytics-power-bi',
  'video-building-c-suite-dashboard',
  'case-study-context-compression-token-waste',
  'cybersecurity-bi-data-vault-hardening',
  'data-driven-product-management-roi',
  'how-to-improve-website-performance-100-gtmetrix',
  'financial-bi-impact',
  'sales-performance-ecosystem-2026',
  'live-performance-benchmarking-2025',
  'saas-liquidity-trap-ai-strategy-2026',
  'zero-trust-2-autonomous-cybersecurity',
  'agentic-shift-autonomous-intelligence-2026'
];

async function inspectDbContent() {
  console.log('--- INSPECTING DATABASE CONTENT FOR TOP 20 ARTICLES ---');

  const posts = await prisma.post.findMany({
    where: { slug: { in: TOP_20_SLUGS } },
    select: { slug: true, title: true, content: true, published: true, updatedAt: true }
  });

  const postMap = new Map(posts.map(p => [p.slug, p]));

  for (const slug of TOP_20_SLUGS) {
    const p = postMap.get(slug);
    if (!p) {
      console.log(`[NOT IN DB] ${slug}`);
      continue;
    }
    const $ = cheerio.load(p.content || '');
    const clean = $('body').text().replace(/\s+/g, ' ').trim();
    const words = clean.split(' ').length;
    const h2s = $('h2').length;
    const code = $('pre, code').length;
    console.log(`\nSlug: ${slug}`);
    console.log(`  Title: "${p.title}"`);
    console.log(`  DB Words: ${words}, H2s: ${h2s}, Code blocks: ${code}`);
    console.log(`  Preview: ${clean.slice(0, 120)}...`);
  }

  await prisma.$disconnect();
}

inspectDbContent();

