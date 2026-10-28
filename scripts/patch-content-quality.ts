import * as fs from 'fs';
import * as path from 'path';

function patchBlogPostContent() {
  const file = path.join(process.cwd(), 'components/BlogPostContent.tsx');
  let content = fs.readFileSync(file, 'utf8');

  const startMarker = '{/* ── Related Articles Section';
  const endMarker = '{/* ── Article Schema';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in BlogPostContent.tsx');
    process.exit(1);
  }

  const replacement = `{/* ── Related Articles Section (Semantic complementary navigation) ── */}
        {relatedPosts && relatedPosts.length > 0 && (
          <aside aria-label="Related articles" style={{ marginTop: '5rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', fontFamily: "'Syne', sans-serif" }}>Related <span className="hero-title">Reading</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <Link key={p.slug} href={\`/blog/\${p.slug}\`} className="group no-underline block">
                  <div className="card h-full flex flex-col" style={{ padding: '1.25rem', borderLeft: '2px solid var(--border)', background: 'var(--surface2)' }}>
                    <div className="relative aspect-video overflow-hidden" style={{ marginBottom: 16 }}>
                      <Image 
                        src={p.image || '/images/dattasable.com.webp'} 
                        alt={p.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[length:var(--text-small)] text-[var(--muted)] mono uppercase tracking-wider" style={{ marginBottom: 10 }}>
                      <span>{p.category}</span>
                      {p.readTime ? <span>{p.readTime} min read</span> : null}
                    </div>
                    <h4 style={{ fontSize: '1rem', lineHeight: 1.3, color: 'var(--text)', marginBottom: '0.5rem' }}>{p.title}</h4>
                    <span className="mono text-[0.8rem] text-[var(--accent)] group-hover:underline mt-auto pt-2 block">
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        `;

  content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched components/BlogPostContent.tsx');
}

function patchWorldBusinessDashboard() {
  const file = path.join(process.cwd(), 'app/dashboards/world-business/page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  // Add H1
  content = content.replace(
    `<div className="font-['Rajdhani'] text-3xl md:text-4xl font-bold tracking-[2px] text-[var(--text)] uppercase">\n                  World Business <span className="text-[#00F0FF]">Intelligence</span>\n                </div>`,
    `<h1 className="font-['Rajdhani'] text-3xl md:text-4xl font-bold tracking-[2px] text-[var(--text)] uppercase">\n                  World Business <span className="text-[#00F0FF]">Intelligence</span>\n                </h1>`
  );
  // Also check if CRLF
  content = content.replace(
    `<div className="font-['Rajdhani'] text-3xl md:text-4xl font-bold tracking-[2px] text-[var(--text)] uppercase">\r\n                  World Business <span className="text-[#00F0FF]">Intelligence</span>\r\n                </div>`,
    `<h1 className="font-['Rajdhani'] text-3xl md:text-4xl font-bold tracking-[2px] text-[var(--text)] uppercase">\r\n                  World Business <span className="text-[#00F0FF]">Intelligence</span>\r\n                </h1>`
  );

  // Add metadata export if missing
  if (!content.includes('export const metadata: Metadata')) {
    const metadataBlock = `export const metadata: Metadata = {
  title: 'World Business & Commercial Intelligence Dashboard | Datta Sable',
  description: 'Interactive commercial intelligence system auditing 3,000,000 global transactions, $18.72B GMV, and multi-currency metrics across 50 sovereign markets.',
  alternates: {
    canonical: 'https://dattasable.com/dashboards/world-business',
  },
  openGraph: {
    title: 'World Business & Commercial Intelligence Dashboard | Datta Sable',
    description: 'Interactive commercial intelligence system auditing 3,000,000 global transactions and $18.72B GMV.',
    url: 'https://dattasable.com/dashboards/world-business',
  },
};

`;
    content = content.replace('export default function WorldBusinessDashboardPage() {', `${metadataBlock}export default function WorldBusinessDashboardPage() {`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched app/dashboards/world-business/page.tsx');
}

function patchRobotsTxt() {
  const file = path.join(process.cwd(), 'public/robots.txt');
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace('Disallow: /analytics-live$\r\n', '')
    .replace('Disallow: /analytics-live$\n', '')
    .replace('Disallow: /analytics-live/\r\n', '')
    .replace('Disallow: /analytics-live/\n', '')
    .replace('Disallow: /live-dashboard$\r\n', '')
    .replace('Disallow: /live-dashboard$\n', '')
    .replace('Disallow: /live-dashboard/\r\n', '')
    .replace('Disallow: /live-dashboard/\n', '');

  if (!content.includes('Sitemap: https://dattasable.com/sitemap.xml')) {
    content = content.replace(
      'Sitemap: https://dattasable.com/sitemap-index.xml',
      'Sitemap: https://dattasable.com/sitemap.xml\r\nSitemap: https://dattasable.com/sitemap-index.xml'
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched public/robots.txt');
}

function patchTemplateBranding() {
  const file = path.join(process.cwd(), 'app/templates/[slug]/page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace('| Surgical AI Blueprint', '| Technical Blueprint | Datta Sable');
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched app/templates/[slug]/page.tsx branding');
}

function patchGlossaryDoorwayLinks() {
  const file = path.join(process.cwd(), 'app/glossary/page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    "href: '/lp/gemini-seo-pipelines-for-marketers',",
    "href: '/templates/gemini-research-pipeline',"
  );
  content = content.replace(
    "title: 'Surgical AI Framework Comparisons',",
    "title: 'AI & Analytics Architecture Comparisons',"
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched app/glossary/page.tsx links');
}

function patchTemplatesDoorwayLinks() {
  const file = path.join(process.cwd(), 'app/templates/page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    "href: '/lp/gemini-seo-pipelines-for-marketers',",
    "href: '/templates/gemini-research-pipeline',"
  );

  // In the playbooks grid, link to associated templates instead of /lp/*
  content = content.replace(
    "href={`/lp/${item.slug}`}",
    "href={`/templates/${item.associatedTemplate || item.slug}`}"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched app/templates/page.tsx links');
}

patchBlogPostContent();
patchWorldBusinessDashboard();
patchRobotsTxt();
patchTemplateBranding();
patchGlossaryDoorwayLinks();
patchTemplatesDoorwayLinks();
console.log('All patches completed successfully.');

