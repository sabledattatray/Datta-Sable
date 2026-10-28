import * as fs from 'fs';

const raw = fs.readFileSync('docs/adsense/09-content-quality-scorecard.csv', 'utf8');
const lines = raw.split('\n').filter(l => l.trim().length > 0);

console.log('--- ALL ARTICLES CLASSIFIED AS NOINDEX-CANDIDATE OR RISK CRITICAL/HIGH ---');
const items: any[] = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const slug = parts[0].replace(/"/g, '');
  const title = parts[1].replace(/"/g, '');
  const words = parseInt(parts[4].replace(/"/g, ''), 10);
  const score = parseInt(parts[12].replace(/"/g, ''), 10);
  const classification = parts[13].replace(/"/g, '');
  const risk = parts[14].replace(/"/g, '');

  if (classification === 'NOINDEX-CANDIDATE' || risk === 'Critical' || risk === 'High' || words < 500) {
    items.push({ slug, title, words, score, classification, risk });
  }
}

console.log(`Total identified: ${items.length}`);
items.sort((a, b) => a.words - b.words);
items.forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.words}w, score=${it.score}] ${it.slug} ("${it.title}")`);
});

