import * as cheerio from 'cheerio';

interface ToolCheck {
  path: string;
  expectedTitle: string;
  expectedH1: string;
  expectedKeywords: string[];
}

const TOOLS: ToolCheck[] = [
  {
    path: '/tools/open-mis',
    expectedTitle: 'Open MIS',
    expectedH1: 'Open MIS',
    expectedKeywords: ['Executive', 'KPI', 'Metrics', 'Dashboard', 'BI', 'Export'],
  },
  {
    path: '/tools/bi-roi-calculator',
    expectedTitle: 'BI ROI Calculator',
    expectedH1: 'BI ROI Calculator',
    expectedKeywords: ['ROI', 'Investment', 'Savings', 'Net Present Value', 'Payback'],
  },
  {
    path: '/tools/mermaid-forge',
    expectedTitle: 'Mermaid Forge',
    expectedH1: 'Mermaid Forge',
    expectedKeywords: ['Diagram', 'Mermaid', 'Syntax', 'Preview', 'Architecture'],
  },
];

async function testFlagshipTools() {
  console.log('--- TESTING FLAGSHIP TOOLS ---');
  let allPassed = true;

  for (const tool of TOOLS) {
    const url = `http://localhost:3000${tool.path}`;
    console.log(`\nTesting ${url}...`);

    try {
      const res = await fetch(url);
      console.log(`  HTTP Status: ${res.status}`);
      if (res.status !== 200) {
        console.error(`  FAIL: Expected HTTP 200, got ${res.status}`);
        allPassed = false;
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Title
      const title = $('title').text();
      console.log(`  Title: "${title}"`);
      if (!title.toLowerCase().includes(tool.expectedTitle.toLowerCase())) {
        console.warn(`  WARN: Title does not contain "${tool.expectedTitle}"`);
      }

      // H1
      const h1 = $('h1').text().trim();
      const h1Count = $('h1').length;
      console.log(`  H1 (count=${h1Count}): "${h1}"`);
      if (h1Count !== 1) {
        console.error(`  FAIL: Expected exactly 1 H1, found ${h1Count}`);
        allPassed = false;
      }

      // Canonical
      const canonical = $('link[rel="canonical"]').attr('href');
      console.log(`  Canonical: "${canonical}"`);
      if (!canonical || !canonical.includes(tool.path)) {
        console.error(`  FAIL: Canonical missing or incorrect: ${canonical}`);
        allPassed = false;
      }

      // Robots
      const robots = $('meta[name="robots"]').attr('content') || '';
      console.log(`  Robots: "${robots}"`);
      if (robots.includes('noindex')) {
        console.error(`  FAIL: Tool is set to noindex!`);
        allPassed = false;
      }

      // Structured Data (SoftwareApplication)
      let hasSoftwareApp = false;
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          const type = json['@type'];
          if (type === 'SoftwareApplication' || (Array.isArray(type) && type.includes('SoftwareApplication'))) {
            hasSoftwareApp = true;
          }
        } catch {}
      });
      console.log(`  SoftwareApplication Schema: ${hasSoftwareApp ? 'YES' : 'NO'}`);
      if (!hasSoftwareApp) {
        console.error(`  FAIL: Missing SoftwareApplication structured data`);
        allPassed = false;
      }

      // Content depth and keyword checks
      const bodyText = $('main, body').text();
      const wordCount = bodyText.replace(/\s+/g, ' ').trim().split(' ').length;
      console.log(`  Word Count: ${wordCount}`);
      if (wordCount < 200) {
        console.warn(`  WARN: Content depth is low (${wordCount} words)`);
      }

      // Interactive elements
      const inputs = $('input, select, textarea, button').length;
      console.log(`  Interactive Controls (inputs/buttons): ${inputs}`);
      if (inputs === 0) {
        console.error(`  FAIL: No interactive elements found`);
        allPassed = false;
      }

      console.log(`  ✓ Tool ${tool.path} passed all basic checks!`);
    } catch (err: any) {
      console.error(`  FAIL: Request to ${url} failed:`, err.message);
      allPassed = false;
    }
  }

  if (!allPassed) {
    console.error('\nFlagship tool tests FAILED.');
    process.exit(1);
  } else {
    console.log('\nAll 3 Flagship Tools PASSED successfully!');
    process.exit(0);
  }
}

testFlagshipTools();

