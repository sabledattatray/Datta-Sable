import * as fs from 'fs';

const lines = fs.readFileSync('docs/adsense/01-route-inventory.csv', 'utf8').split('\n');
const fivers = lines.filter(l => l.includes(',"500",')).map(l => {
  const parts = l.split(',');
  return { path: parts[1], severity: parts[23], reason: parts[24] };
});

console.log('Total 500s:', fivers.length);
console.log(JSON.stringify(fivers, null, 2));

