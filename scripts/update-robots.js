import fs from 'fs';

const path = 'public/robots.txt';
const content = fs.readFileSync(path, 'utf8');

const updatedContent = content.replace(
  'User-agent: Mediapartners-Google',
  'User-agent: Mediapartners-Google\nDisallow: /tools\nDisallow: /portfolio\nDisallow: /services\nDisallow: /about\nDisallow: /contact'
);

fs.writeFileSync(path, updatedContent);
console.log('Updated robots.txt successfully.');
