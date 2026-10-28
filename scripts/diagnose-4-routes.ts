import * as cheerio from 'cheerio';

async function diagnose() {
  const routes = [
    '/blog/microsoft-fabric-direct-lake-mode-architecture-fallback-elimination-enterprise-performance-tuning-2026',
    '/dashboards/helios-cleanenergy',
    '/glossary/semantic-compression',
    '/services/graphic-design',
  ];

  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      console.log(`${r} -> Status: ${res.status}`);
      if (res.status >= 400) {
        const text = await res.text();
        const $ = cheerio.load(text);
        const title = $('title').text();
        const h1 = $('h1').text();
        console.log(`  Details: title="${title}", h1="${h1}", textSnippet="${text.slice(0, 300).replace(/\s+/g, ' ')}"`);
      }
    } catch (err: any) {
      console.error(`${r} -> Fetch failed:`, err.message);
    }
  }
}

diagnose();
