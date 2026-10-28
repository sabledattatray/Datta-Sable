import { prisma } from '../lib/prisma';
import { posts as staticPosts } from '../app/blog/data';
import * as fs from 'fs';

async function locateArticles() {
  const scorecardRaw = fs.readFileSync('docs/adsense/09-content-quality-scorecard.csv', 'utf8');
  const lines = scorecardRaw.split('\n').filter(l => l.trim().length > 0);
  const highRiskSlugs: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    const slug = parts[0].replace(/"/g, '');
    const risk = parts[14].replace(/"/g, '');
    if (risk === 'Critical' || risk === 'High') {
      highRiskSlugs.push(slug);
    }
  }

  console.log(`Found ${highRiskSlugs.length} high-risk slugs in scorecard.`);

  const dbPosts = await prisma.post.findMany({
    where: { slug: { in: highRiskSlugs } },
    select: { slug: true, title: true, published: true }
  });

  const dbSlugSet = new Set(dbPosts.map(p => p.slug));
  const staticSlugSet = new Set(staticPosts.map(p => p.slug));

  console.log(`In Database: ${dbPosts.length}/${highRiskSlugs.length}`);
  const inStatic = highRiskSlugs.filter(s => staticSlugSet.has(s));
  console.log(`In static data.ts: ${inStatic.length}/${highRiskSlugs.length}`);

  for (const slug of highRiskSlugs.slice(0, 20)) {
    console.log(`- ${slug}: In DB: ${dbSlugSet.has(slug) ? 'YES' : 'NO'}, In static: ${staticSlugSet.has(slug) ? 'YES' : 'NO'}`);
  }

  await prisma.$disconnect();
}

locateArticles();

