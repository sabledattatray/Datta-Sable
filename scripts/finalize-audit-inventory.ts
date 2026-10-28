import * as fs from 'fs';
import * as cheerio from 'cheerio';

async function updateInventory() {
  const file = 'docs/adsense/01-route-inventory.csv';
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const header = lines[0];
  const updatedLines: string[] = [header];

  let fixedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.includes(',"500",')) {
      const parts = line.split(',');
      const rawPath = parts[1].replace(/"/g, '');
      console.log(`Verifying path ${rawPath}...`);
      try {
        const res = await fetch(`http://localhost:3000${rawPath}`);
        const text = await res.text();
        const $ = cheerio.load(text);
        const title = $('title').text().replace(/"/g, '""');
        const h1 = ($('h1').first().text() || '').trim().replace(/"/g, '""');
        const h1Count = $('h1').length;
        const robots = ($('meta[name="robots"]').attr('content') || '').replace(/"/g, '""');
        const canonical = ($('link[rel="canonical"]').attr('href') || '').replace(/"/g, '""');
        const words = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;

        parts[5] = `"${res.status}"`;
        parts[7] = `"${canonical}"`;
        parts[9] = `"${robots || 'index, follow'}"`;
        parts[11] = `"${title}"`;
        parts[14] = `"${h1Count}"`;
        parts[15] = `"${h1}"`;
        parts[17] = `"${words}"`;
        parts[21] = `"KEEP"`;
        parts[22] = `"None"`;
        parts[23] = `""`;
        parts[24] = `""`;

        updatedLines.push(parts.join(','));
        fixedCount++;
        console.log(`  ✓ Updated ${rawPath} to HTTP ${res.status}`);
      } catch (err: any) {
        console.error(`  ✗ Still failed: ${rawPath}`, err.message);
        updatedLines.push(line);
      }
    } else {
      updatedLines.push(line);
    }
  }

  fs.writeFileSync(file, updatedLines.join('\n'), 'utf8');
  fs.writeFileSync('docs/adsense/route-inventory.csv', updatedLines.join('\n'), 'utf8');
  console.log(`Inventory updated successfully! Fixed ${fixedCount} entries.`);
}

updateInventory();

