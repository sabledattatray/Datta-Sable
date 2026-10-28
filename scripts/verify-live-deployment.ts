import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface VerificationTarget {
  url: string;
  expectedStatus: number;
  expectedContent?: string[];
  category: string;
}

const TARGETS: VerificationTarget[] = [
  {
    url: 'https://dattasable.com/',
    expectedStatus: 200,
    category: 'Homepage',
    expectedContent: ['Datta Sable'],
  },
  {
    url: 'https://dattasable.com/blog',
    expectedStatus: 200,
    category: 'Blog Index',
    expectedContent: ['Articles'],
  },
  {
    url: 'https://dattasable.com/blog/dp-600-study-guide-2026',
    expectedStatus: 200,
    category: 'Remediated Article',
    expectedContent: ['DP-600', 'Microsoft Fabric'],
  },
  {
    url: 'https://dattasable.com/blog/microsoft-fabric-certification-roadmap-2026',
    expectedStatus: 200,
    category: 'Remediated Article',
    expectedContent: ['Fabric Certification Roadmap', 'PL-300'],
  },
  {
    url: 'https://dattasable.com/blog/financial-bi-impact',
    expectedStatus: 200,
    category: 'Remediated Article',
    expectedContent: ['Receivables', 'Financial'],
  },
  {
    url: 'https://dattasable.com/portfolio',
    expectedStatus: 200,
    category: 'Portfolio Index',
    expectedContent: ['Portfolio', 'Excel Dashboards'],
  },
  {
    url: 'https://dattasable.com/tools',
    expectedStatus: 200,
    category: 'Tools Index',
    expectedContent: ['Tools'],
  },
  {
    url: 'https://dattasable.com/tools/open-mis',
    expectedStatus: 200,
    category: 'Flagship Tool',
    expectedContent: ['Open MIS'],
  },
  {
    url: 'https://dattasable.com/tools/bi-roi-calculator',
    expectedStatus: 200,
    category: 'Flagship Tool',
    expectedContent: ['ROI Calculator'],
  },
  {
    url: 'https://dattasable.com/tools/mermaid-forge',
    expectedStatus: 200,
    category: 'Flagship Tool',
    expectedContent: ['Mermaid'],
  },
  {
    url: 'https://dattasable.com/dashboards/world-business',
    expectedStatus: 200,
    category: 'Interactive Dashboard',
    expectedContent: ['World Business'],
  },
  {
    url: 'https://dattasable.com/dashboards/helios-cleanenergy',
    expectedStatus: 200,
    category: 'Interactive Dashboard',
    expectedContent: ['Helios'],
  },
  {
    url: 'https://dattasable.com/ebooks',
    expectedStatus: 200,
    category: 'eBooks Index',
    expectedContent: ['eBooks'],
  },
  {
    url: 'https://dattasable.com/ebooks/advanced-excel-mis-reporting-2026',
    expectedStatus: 200,
    category: 'eBook Detail',
    expectedContent: ['Advanced Excel', 'MIS Reporting'],
  },
  {
    url: 'https://dattasable.com/products',
    expectedStatus: 200,
    category: 'Products Index',
    expectedContent: ['Products', 'Learning Resources'],
  },
  {
    url: 'https://dattasable.com/products/dp-700-study-package',
    expectedStatus: 200,
    category: 'Published Product',
    expectedContent: ['DP-700', 'Study Package'],
  },
  {
    url: 'https://dattasable.com/sign-in',
    expectedStatus: 200,
    category: 'Authentication',
    expectedContent: ['Sign In'],
  },
  {
    url: 'https://dattasable.com/robots.txt',
    expectedStatus: 200,
    category: 'Technical SEO',
    expectedContent: ['User-agent: *', 'Allow: /', 'Sitemap: https://dattasable.com/'],
  },
  {
    url: 'https://dattasable.com/sitemap.xml',
    expectedStatus: 200,
    category: 'Technical SEO',
    expectedContent: ['<urlset', '<loc>https://dattasable.com/'],
  },
  {
    url: 'https://dattasable.com/ads.txt',
    expectedStatus: 200,
    category: 'AdSense Plumbing',
    expectedContent: ['google.com, pub-4242010382827250, DIRECT, f08c47fec0942fa0'],
  },
  {
    url: 'https://dattasable.com/about',
    expectedStatus: 200,
    category: 'Trust Page',
    expectedContent: ['Datta Sable', 'About'],
  },
  {
    url: 'https://dattasable.com/privacy',
    expectedStatus: 200,
    category: 'Trust Page',
    expectedContent: ['Privacy Policy'],
  },
  {
    url: 'https://dattasable.com/terms',
    expectedStatus: 200,
    category: 'Trust Page',
    expectedContent: ['Terms'],
  },
  {
    url: 'https://dattasable.com/admin-design-preview',
    expectedStatus: 404,
    category: 'Isolated 404',
  },
  {
    url: 'https://dattasable.com/careers',
    expectedStatus: 404,
    category: 'Isolated 404',
  },
];

async function verifyAll() {
  console.log('\n--- EXECUTING LIVE SMOKE TESTS AGAINST DATTASABLE.COM ---');

  const results: any[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const target of TARGETS) {
    try {
      const res = await fetch(target.url, { redirect: 'manual', cache: 'no-store' });
      const status = res.status;
      const html = await res.text();

      const statusMatch = status === target.expectedStatus;
      let contentMatch = true;
      const missingStrings: string[] = [];

      if (target.expectedContent) {
        for (const str of target.expectedContent) {
          if (!html.toLowerCase().includes(str.toLowerCase())) {
            contentMatch = false;
            missingStrings.push(str);
          }
        }
      }

      const passed = statusMatch && contentMatch;
      if (passed) passedCount++;
      else failedCount++;

      let title = '';
      let h1 = '';
      let canonical = '';
      let robots = '';

      if (html.includes('<html') || html.includes('<!DOCTYPE')) {
        const $ = cheerio.load(html);
        title = ($('title').text() || '').trim();
        h1 = ($('h1').first().text() || '').trim();
        canonical = $('link[rel="canonical"]').attr('href') || '';
        robots = $('meta[name="robots"]').attr('content') || '';
      }

      results.push({
        url: target.url,
        category: target.category,
        expectedStatus: target.expectedStatus,
        actualStatus: status,
        passed,
        title,
        h1,
        canonical,
        robots,
        missingStrings,
      });

      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${target.url} (Status: ${status})`);
      if (!passed && missingStrings.length > 0) {
        console.log(`   Missing: ${missingStrings.join(', ')}`);
      }
    } catch (err: any) {
      failedCount++;
      results.push({
        url: target.url,
        category: target.category,
        expectedStatus: target.expectedStatus,
        actualStatus: 0,
        passed: false,
        error: err.message,
      });
      console.log(`[ERROR] ${target.url}: ${err.message}`);
    }
  }

  console.log('\n--- LIVE VERIFICATION SUMMARY ---');
  console.log(`Total Verified: ${results.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  fs.writeFileSync('docs/adsense/live-verification-results.json', JSON.stringify({ results }, null, 2));
  console.log('Saved docs/adsense/live-verification-results.json');
}

verifyAll();
