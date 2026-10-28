import { getPublishedBlogPosts } from '../lib/blog-posts';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function inspect36() {
  const scorecardRaw = fs.readFileSync('docs/adsense/09-content-quality-scorecard.csv', 'utf8');
  const lines = scorecardRaw.split('\n').filter(l => l.trim().length > 0);
  const highRiskSlugs: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    const slug = parts[0].replace(/"/g, '');
    const classification = parts[13].replace(/"/g, '');
    if (classification === 'NOINDEX-CANDIDATE' || parts[14].replace(/"/g, '') === 'Critical' || parts[14].replace(/"/g, '') === 'High') {
      highRiskSlugs.push(slug);
    }
  }

  const posts = await getPublishedBlogPosts();
  const postMap = new Map(posts.map(p => [p.slug, p]));

  console.log(`Auditing ${highRiskSlugs.length} articles classified as high-risk / candidate...`);

  const summary = highRiskSlugs.map((slug, idx) => {
    const post = postMap.get(slug);
    if (!post) return { idx: idx + 1, slug, title: 'NOT FOUND', words: 0, preview: '' };
    const $ = cheerio.load(post.content || '');
    const clean = $('body').text().replace(/\s+/g, ' ').trim();
    const words = clean.split(' ').length;
    return {
      idx: idx + 1,
      slug,
      title: post.title,
      category: post.category,
      words,
      preview: clean.slice(0, 150) + '...'
    };
  });

  fs.writeFileSync('docs/adsense/high-risk-36-inspection.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log('Saved to docs/adsense/high-risk-36-inspection.json');

  summary.forEach(s => {
    console.log(`${s.idx}. [${s.words} words] [${s.category}] ${s.slug}: "${s.title}"`);
  });
}

inspect36();

