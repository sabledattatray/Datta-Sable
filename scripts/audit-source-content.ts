import fs from 'node:fs';
import { load } from 'cheerio';
import { posts } from '../app/blog/data';
import { KNOWLEDGE_ARTICLES } from '../data/knowledge';
import { TEMPLATES } from '../data/templates';
import { GLOSSARY_TERMS } from '../data/glossary';
import { CHAINS } from '../data/chains';
import { correctEditorialContent } from '../lib/editorial-content';
import { isPlaceholderPost } from '../lib/blog-catalog';

const count = (html: string) => load(html).text().replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
const rows = [
  ...posts.filter(post => !isPlaceholderPost(post)).map(post => ({ route: '/blog/' + post.slug, words: count(correctEditorialContent(post).content || ''), kind: 'source-fallback-article' })),
  ...KNOWLEDGE_ARTICLES.map(item => ({ route: '/knowledge/' + item.slug, words: count(item.content), kind: 'noindex-guide' })),
  ...TEMPLATES.map(item => ({ route: '/templates/' + item.slug, words: count([item.description, item.detailedExplanation, ...item.bestPractices, ...item.useCases].join(' ')), kind: 'noindex-library-entry' })),
  ...GLOSSARY_TERMS.map(item => ({ route: '/glossary/' + item.slug, words: count([item.definition, item.operatorsPerspective, item.founderNote, item.technicalApplication].join(' ')), kind: 'noindex-glossary' })),
  ...CHAINS.map(item => ({ route: '/chains/' + item.slug, words: count(item.description), kind: 'noindex-interactive-chain' })),
];
const sourceFiles: string[] = [];
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = dir + '/' + entry.name;
    if (entry.isDirectory()) walk(file);
    else if (/\.tsx?$/.test(entry.name)) sourceFiles.push(file);
  }
}
walk('app');
const pages = sourceFiles.filter(file => /\/page\.tsx$/.test(file));
fs.mkdirSync('docs/audits', { recursive: true });
fs.writeFileSync('docs/audits/source-content-2026-10-21.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  scope: 'All app page source paths and source-managed dynamic libraries. Blog counts use the public editorial correction pipeline. Live CMS overrides and subdomain source projects are outside this inventory. Counts are triage, not Google requirements.',
  pageSources: pages,
  dynamicContent: rows,
}, null, 2));
console.log(JSON.stringify({ pageSources: pages.length, dynamicEntries: rows.length, knowledge: rows.filter(row => row.kind === 'noindex-guide'), shortSourceArticles: rows.filter(row => row.kind === 'source-fallback-article' && row.words < 300) }, null, 2));
