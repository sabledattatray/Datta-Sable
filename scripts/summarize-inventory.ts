import * as fs from 'fs';

const lines = fs.readFileSync('docs/adsense/01-route-inventory.csv', 'utf8').split('\n').slice(1).filter(l => l.trim());
const statuses: Record<string, number> = {};
const decisions: Record<string, number> = {};
const severities: Record<string, number> = {};

lines.forEach(l => {
  const parts = l.split(',');
  const s = parts[5]?.replace(/"/g, '') || 'unknown';
  const d = parts[21]?.replace(/"/g, '') || 'unknown';
  const sev = parts[22]?.replace(/"/g, '') || 'None';

  statuses[s] = (statuses[s] || 0) + 1;
  decisions[d] = (decisions[d] || 0) + 1;
  severities[sev] = (severities[sev] || 0) + 1;
});

console.log('--- AUDIT CRAWL SUMMARY ---');
console.log('Total URLs Audited:', lines.length);
console.log('Status Counts:', JSON.stringify(statuses, null, 2));
console.log('Decisions:', JSON.stringify(decisions, null, 2));
console.log('Severities:', JSON.stringify(severities, null, 2));

