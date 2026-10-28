import { prisma } from '../lib/prisma';
import * as fs from 'fs';

async function inspectDuplicates() {
  const slugs = [
    'azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive',
    'microsoft-fabric-data-factory-vs-azure-data-factory-feature-parity-cost-migration-strategy-in-2026',
    'power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026',
    'power-bi-calculation-groups-in-2026-enterprise-dax-architecture-dynamic-formatting-model-optimization'
  ];

  const posts = await prisma.post.findMany({
    where: { slug: { in: slugs } }
  });

  const comparison = posts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    readTime: p.readTime,
    excerptLength: p.excerpt?.length,
    excerpt: p.excerpt,
    contentLength: p.content?.length,
    headings: (p.content?.match(/<h[2-4][^>]*>.*?<\/h[2-4]>|^#{2,4}\s+.*$/gm) || []).slice(0, 10),
  }));

  console.log(JSON.stringify(comparison, null, 2));
}

inspectDuplicates().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
