import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { getPublishedBlogPosts } from '../lib/blog-posts';

interface ArticleScore {
  slug: string;
  title: string;
  category: string;
  pubDate: string;
  wordCount: number;
  readTime: string;
  codeBlocksCount: number;
  diagramsCount: number;
  h2Count: number;
  h3Count: number;
  internalLinksCount: number;
  practicalExamplesCount: number;
  genericPatternsFound: number;
  score: number;
  classification: 'KEEP' | 'IMPROVE' | 'CONSOLIDATE' | 'NOINDEX-CANDIDATE';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  issues: string[];
  remediationPlan: string;
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
  return `"${str}"`;
}

// Patterns that suggest thin, boilerplate, or generic content
const GENERIC_PATTERNS = [
  /in today's rapidly evolving digital landscape/i,
  /it is important to note that/i,
  /without further ado/i,
  /in conclusion, it can be said/i,
  /let's dive right in/i,
  /delve into/i,
  /test paragraph for automated publisher/i,
  /lorem ipsum/i,
];

async function scoreAllArticles() {
  console.log('--- SCORING ALL PUBLISHED BLOG POSTS ---');

  const posts = await getPublishedBlogPosts();
  console.log(`Analyzing ${posts.length} published posts...`);

  const scoredArticles: ArticleScore[] = [];

  for (const post of posts) {
    const content = post.content || '';
    const $ = cheerio.load(content);

    // Text content & word count
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = cleanText.length > 0 ? cleanText.split(' ').length : 0;

    // Code blocks
    const codeBlocks = $('pre, code').length;

    // Diagrams & visuals
    const imgCount = $('img').length;
    const diagramDirectives = (content.match(/\[\[diagram:/g) || []).length;
    const mermaidBlocks = (content.match(/mermaid/gi) || []).length;
    const diagramsCount = imgCount + diagramDirectives + (mermaidBlocks > 0 ? 1 : 0);

    // Headings
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;

    // Internal links
    let internalLinksCount = 0;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('/') || href.includes('dattasable.com')) {
        internalLinksCount++;
      }
    });

    // Practical examples (formulas, tables, step lists, calculation steps)
    const tableCount = $('table').length;
    const orderedLists = $('ol').length;
    const practicalExamplesCount = tableCount + orderedLists + (codeBlocks > 1 ? 1 : 0);

    // Generic patterns check
    let genericPatternsFound = 0;
    for (const pat of GENERIC_PATTERNS) {
      if (pat.test(content)) genericPatternsFound++;
    }

    // Scoring algorithm (0-100)
    let score = 50; // base score
    const issues: string[] = [];

    // Word count scoring
    if (words >= 1500) {
      score += 20;
    } else if (words >= 1000) {
      score += 15;
    } else if (words >= 700) {
      score += 10;
    } else if (words >= 450) {
      score += 5;
    } else {
      score -= 20;
      issues.push(`Thin content: only ${words} words (minimum recommended is 600+)`);
    }

    // Code & technical artifacts
    if (codeBlocks >= 3) {
      score += 15;
    } else if (codeBlocks >= 1) {
      score += 10;
    } else {
      // For technical articles in Fabric, DAX, SQL, Power BI, missing code is a concern
      if (['Power BI', 'Microsoft Fabric', 'SQL Server', 'Data Engineering', 'Advanced Excel'].includes(post.category)) {
        score -= 5;
        issues.push('Technical article lacks runnable code snippets or DAX/SQL patterns');
      }
    }

    // Visuals & diagrams
    if (diagramsCount >= 2) {
      score += 10;
    } else if (diagramsCount >= 1) {
      score += 5;
    } else {
      issues.push('No visual diagrams, architectural schematics, or screenshots');
    }

    // Headings hierarchy
    if (h2Count >= 3) {
      score += 5;
    } else if (h2Count === 0) {
      score -= 10;
      issues.push('Missing H2 section headings; unformatted content block');
    }

    // Internal links
    if (internalLinksCount >= 3) {
      score += 5;
    } else if (internalLinksCount === 0) {
      score -= 5;
      issues.push('Zero internal links to related guides, tools, or portfolio projects');
    }

    // Practical worked examples
    if (practicalExamplesCount >= 2) {
      score += 10;
    } else if (practicalExamplesCount === 0) {
      issues.push('Lacks concrete worked examples, case tables, or step-by-step procedures');
    }

    // Generic wording penalties
    if (genericPatternsFound > 0) {
      score -= genericPatternsFound * 8;
      issues.push(`Contains ${genericPatternsFound} generic boilerplate / AI transition phrases`);
    }

    // Bound score
    score = Math.max(10, Math.min(98, score));

    // Classification & Risk
    let classification: 'KEEP' | 'IMPROVE' | 'CONSOLIDATE' | 'NOINDEX-CANDIDATE' = 'KEEP';
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    let remediationPlan = 'Content meets high-value technical standards. Maintain regular freshness updates.';

    // Check known merged duplicates
    if (post.slug === 'azure-data-factory-vs-fabric-data-factory' || post.slug === 'power-bi-calculation-groups-enterprise-guide') {
      classification = 'CONSOLIDATE';
      riskLevel = 'Low';
      remediationPlan = 'Consolidated into authoritative guide via 301 redirect.';
    } else if (score < 45 || words < 400) {
      classification = 'NOINDEX-CANDIDATE';
      riskLevel = 'Critical';
      remediationPlan = 'Expand with hands-on enterprise tutorial, worked code, and diagrams; or mark noindex if topic is superseded.';
    } else if (score < 70 || issues.length >= 2) {
      classification = 'IMPROVE';
      riskLevel = score < 60 ? 'High' : 'Medium';
      remediationPlan = `Address identified gaps: ${issues.join('; ')}.`;
    }

    scoredArticles.push({
      slug: post.slug,
      title: post.title,
      category: post.category,
      pubDate: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : '2026-01-01',
      wordCount: words,
      readTime: (post as any).readTime || `${Math.ceil(words / 200)} min read`,
      codeBlocksCount: codeBlocks,
      diagramsCount,
      h2Count,
      h3Count,
      internalLinksCount,
      practicalExamplesCount,
      genericPatternsFound,
      score,
      classification,
      riskLevel,
      issues,
      remediationPlan,
    });
  }

  // Sort by score ascending (lowest score / highest risk first)
  scoredArticles.sort((a, b) => a.score - b.score);

  // Write docs/adsense/09-content-quality-scorecard.csv
  const csvHeaders = [
    'slug',
    'title',
    'category',
    'pubDate',
    'wordCount',
    'readTime',
    'codeBlocksCount',
    'diagramsCount',
    'h2Count',
    'h3Count',
    'internalLinksCount',
    'practicalExamplesCount',
    'score',
    'classification',
    'riskLevel',
    'issues',
    'remediationPlan'
  ];

  const csvRows = [
    csvHeaders.join(','),
    ...scoredArticles.map(a => [
      escapeCsv(a.slug),
      escapeCsv(a.title),
      escapeCsv(a.category),
      escapeCsv(a.pubDate),
      escapeCsv(a.wordCount),
      escapeCsv(a.readTime),
      escapeCsv(a.codeBlocksCount),
      escapeCsv(a.diagramsCount),
      escapeCsv(a.h2Count),
      escapeCsv(a.h3Count),
      escapeCsv(a.internalLinksCount),
      escapeCsv(a.practicalExamplesCount),
      escapeCsv(a.score),
      escapeCsv(a.classification),
      escapeCsv(a.riskLevel),
      escapeCsv(a.issues.join(' | ')),
      escapeCsv(a.remediationPlan)
    ].join(','))
  ];

  fs.writeFileSync('docs/adsense/09-content-quality-scorecard.csv', csvRows.join('\n'), 'utf-8');
  console.log(`\n✓ Generated docs/adsense/09-content-quality-scorecard.csv for ${scoredArticles.length} articles.`);

  // Print distribution
  const classCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = {};
  for (const a of scoredArticles) {
    classCounts[a.classification] = (classCounts[a.classification] || 0) + 1;
    riskCounts[a.riskLevel] = (riskCounts[a.riskLevel] || 0) + 1;
  }
  console.log('Classification breakdown:', classCounts);
  console.log('Risk level breakdown:', riskCounts);

  // Top 20 highest-risk articles
  console.log('\nTop 20 Highest-Risk Articles for Remediation:');
  const top20 = scoredArticles.slice(0, 20);
  top20.forEach((a, idx) => {
    console.log(`${idx + 1}. [${a.riskLevel}] (Score ${a.score}, Words: ${a.wordCount}) ${a.slug}: ${a.title}`);
  });
}

scoreAllArticles().catch(err => {
  console.error('Scoring failed:', err);
  process.exit(1);
});
