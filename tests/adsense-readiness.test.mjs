import { createHash } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
function load(file, stubs = {}) {
 const mod = { exports: {} };
 const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
 assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, 'Syntax errors in ' + file);
 const source = compiled.outputText;
 vm.runInNewContext(source, { module: mod, exports: mod.exports, require: id => {
   if (id in stubs) return stubs[id]; throw Error('Unexpected dependency: ' + id);
 }, Date, URL, window: stubs.window, localStorage: stubs.localStorage });
 return mod.exports;
}
const response = { NextResponse: class { constructor(body) { this.body = body; } } };
const xml = load('lib/sitemap-xml.ts');
test('image sitemap publishes only the authoritative public catalog and escapes XML URLs', async () => {
 const route = load('app/image-sitemap.xml/route.ts', { 'next/server': response, '@/lib/sitemap-xml': xml,
  '@/lib/blog-posts': { getPublishedBlogPosts: async () => [
   { slug: 'published', image: '/cover.png?a=1&b=2' },
   { slug: 'unsafe', image: 'javascript:alert(1)' } ] } });
 assert.equal(route.dynamic, 'force-dynamic');
 const result = (await route.GET()).body;
 assert.match(result, /blog\/published/); assert.match(result, /a=1&amp;b=2/);
 assert.doesNotMatch(result, /javascript|blog\/unsafe/);
});
test('news sitemap uses original publication date, a two-day window and explicit news classification', async () => {
 const recent = new Date(Date.now() - 3600000).toISOString();
 const old = new Date(Date.now() - 5 * 86400000).toISOString();
 const route = load('app/news-sitemap.xml/route.ts', { 'next/server': response, '@/lib/sitemap-xml': xml,
 '@/lib/blog-posts': { getPublishedBlogPosts: async () => [
 { slug: 'valid', category: 'News', title: 'A & B', date: recent },
 { slug: 'old', category: 'News', title: 'Old', date: old, updatedAt: recent },
 { slug: 'tutorial', category: 'Fabric', title: 'Guide', date: recent },
 { slug: 'future', category: 'News', title: 'Future', date: new Date(Date.now()+86400000) },
 { slug: 'invalid', category: 'News', title: 'Invalid', date: 'bad' } ] } });
 assert.equal(route.dynamic, 'force-dynamic');
 const body = (await route.GET()).body;
 assert.match(body, /blog\/valid/); assert.match(body, /A &amp; B/);
 assert.doesNotMatch(body, /blog\/(old|tutorial|future|invalid)/);
});
test('main sitemap deduplicates real routes and omits invalid or future modification dates', async () => {
 const productDetails = load('lib/commerce/product-details.ts', { zod: createRequire(import.meta.url)('zod') });
 const ready = { id:'ready', slug:'real-product', status:'PUBLISHED', salesEnabled:true, deliveryReady:true, excerpt:'Original resource', resources:[{title:'Real guide'}], updatedAt:new Date() };
 const route = load('app/sitemap.ts', { '@/lib/commerce/product-details': productDetails, '@/lib/commerce/product-settings': { productDetailsMap: async () => new Map([['ready',productDetails.productDetailsSchema.parse({readiness:'READY_FOR_SALE'})]]) }, '@/lib/prisma': { prisma: { commerceProduct: { findMany: async () => [ready,{...ready,id:'test',slug:'dummy-product',excerpt:'TEST ONLY dummy'}] } } }, '@/data/excelProjects': { EXCEL_PROJECTS: [{ slug: 'world-business' }] },
 '@/lib/blog-posts': { getPublishedBlogPosts: async () => [
 { slug: 'bad-date', updatedAt: 'bad' }, { slug: 'future', updatedAt: new Date(Date.now()+86400000) } ] } });
 assert.equal(route.dynamic, 'force-dynamic');
 const entries = await route.default();
 assert.equal(entries.length, new Set(entries.map(x => x.url)).size);
 assert.ok(entries.some(x => x.url.endsWith('/editorial-policy')));
 assert.ok(entries.some(x => x.url.endsWith('/products/real-product')));
 assert.ok(entries.every(x => !x.url.endsWith('/products/dummy-product')));
 assert.ok(entries.filter(x => /blog\/(bad-date|future)$/.test(x.url)).every(x => !('lastModified' in x)));
 assert.ok(entries.every(x => !/\/(p|tools|category|lp)\//.test(x.url)));
});
test('analytics consent fails closed without affirmative current-version consent or accessible storage', () => {
 const denied = load('lib/analytics-consent.ts', { window: {}, localStorage: { getItem: () => 'declined' } });
 assert.equal(denied.hasAnalyticsConsent(), false);
 const missing = load('lib/analytics-consent.ts', { window: {}, localStorage: { getItem: () => null } });
 assert.equal(missing.hasAnalyticsConsent(), false);
 const accepted = load('lib/analytics-consent.ts', { window: {}, localStorage: { getItem: () => 'accepted' } });
 assert.equal(accepted.hasAnalyticsConsent(), true);
 const blocked = load('lib/analytics-consent.ts', { window: {}, localStorage: { getItem: () => { throw Error('Blocked'); } } });
 assert.equal(blocked.hasAnalyticsConsent(), false);
});

const companion = load('content/editorial/dp600-practice-companion.ts');
const revisionData = load('content/editorial/revisions.ts');
const revisionEngine = load('lib/editorial-revisions.ts', { 'node:crypto': { createHash }, '@/content/editorial/revisions': revisionData });
const editorial = load('lib/editorial-content.ts', { '@/content/editorial/dp600-practice-companion': companion, './editorial-revisions': revisionEngine });
test('editorial correction removes only exact stock text and preserves useful neighboring sections', () => {
 const stock = 'Performance optimizations reduced page loading latency by 55% during high-concurrency testing. Database CPU utilization stabilized at 40%, and memory allocation followed a clean linear scale without garbage collection spikes.';
 const content = '<h2 id="architectural-deepdive">Architecture</h2><p>A useful architecture explanation.</p>' +
 '<ul><li><a href="#performance-benchmarks">Benchmarks</a></li></ul>' +
 '<h2 id="performance-benchmarks">Benchmarks</h2><p>' + stock + '</p><h2 id="next">Next</h2><p>Keep this.</p>';
 const result = editorial.correctEditorialContent({ slug: 'guide', content }).content;
 assert.match(result, /A useful architecture explanation/); assert.match(result, /Keep this/);
 assert.doesNotMatch(result, /55%|40%|id="performance-benchmarks"|href="#performance-benchmarks"/);
 const unique = { slug: 'other', content: '<p>A measured 55% change in our specific dataset.</p>' };
 assert.equal(editorial.correctEditorialContent(unique).content, unique.content);
});

test('repeated unsupported automation benchmark is removed from CMS and source HTML without deleting unique results', () => {
 const benchmark = 'Benchmarking <a href="/glossary/n8n-workflow-orchestration">n8n</a> in queue mode with 3 active worker nodes demonstrated an execution throughput of 250 workflows per second. Webhook response latency dropped from 450ms to 92ms when caching static API responses in Redis. Database lock contention was reduced by 60% after indexing execution log tables.';
 const result = editorial.correctEditorialContent({ slug: 'automation', content: '<p>Specific implementation details remain.</p><h2 id="performance-benchmarks">Benchmarks</h2><p>' + benchmark + '</p>' }).content;
 assert.match(result, /Specific implementation details remain/);
 assert.doesNotMatch(result, /250 workflows|450ms|60%|id="performance-benchmarks"/);
 const unique = '<p>In a documented experiment, 250 workflows completed over a ten-minute observation window.</p>';
 assert.equal(editorial.correctEditorialContent({ slug: 'measured-result', content: unique }).content, unique);
});
test('mismatched DP-600 guide gets topic-correct practice content without overriding a future corrected CMS article', () => {
 const slug = 'dp-600-fabric-analytics-engineer-study-companion-notebook';
 const replaced = editorial.correctEditorialContent({ slug, content: '<h2 id="delta-store-mechanics">Old wrong topic</h2>' }).content;
 assert.match(replaced, /Total Revenue = SUMX/); assert.match(replaced, /830/);
 assert.doesNotMatch(replaced, /delta-store-mechanics/);
 const corrected = { slug, content: '<p>A new, reviewed Fabric article.</p>' };
 assert.equal(editorial.correctEditorialContent(corrected).content, corrected.content);
 const quantities = [2, 1, 3, 4, 1], prices = [50, 120, 120, 50, 50];
 assert.equal(quantities.reduce((sum, quantity, i) => sum + quantity * prices[i], 0), 830);
 assert.equal(quantities.reduce((a, b) => a + b, 0), 11);
});
test('individual article and public catalog apply the same editorial corrections to CMS content', async () => {
 const post = { slug: 'dp-600-fabric-analytics-engineer-study-companion-notebook', published: true,
  title: 'DP-600', content: '<h2 id="delta-store-mechanics">Wrong topic</h2>' };
 const catalog = load('lib/blog-catalog.ts');
 const route = load('lib/blog-posts.ts', { react: { cache: fn => fn }, './blog-catalog': catalog, './editorial-content': editorial,
 '@/lib/prisma': { prisma: { post: { findUnique: async () => post, findMany: async () => [post] } } },
 '@/app/blog/data': { posts: [] } });
 const single = await route.getPublishedBlogPost(post.slug), all = await route.getPublishedBlogPosts();
 assert.equal(single.content, all[0].content); assert.match(single.content, /five-row fact table/);
});

test('broken article aliases and nonexistent calculator references receive accurate public destinations', () => {
 const content = '<a href="/blog/surgical-prompt-architecture-framework">Prompt architecture</a>' +
 '<a href="/tools/fabric-capacity-calculator">Fabric Capacity Calculator</a>' +
 '<a href="/blog/cloud-security">Cloud hub</a>';
 const result = editorial.correctEditorialContent({ slug: 'links', content }).content;
 assert.match(result, /href="\/blog\/precision-prompt-architecture-framework"/);
 assert.match(result, /Fabric capacity sizing guide/); assert.match(result, /All technical guides/);
 assert.doesNotMatch(result, /fabric-capacity-calculator|Cloud hub/);
});

test('reviewed replacements cover every generic-body article and have distinct topic-specific paragraphs', () => {
 const revisions = revisionData.editorialRevisions;
 assert.equal(revisions.length, 37); assert.equal(new Set(revisions.map(x => x.slug)).size, 37);
 const inventory = fs.readFileSync('docs/adsense-content-review-2026-10-20.md', 'utf8');
 const generic = inventory.split('\n').filter(x => x.includes(' | 15 | ')).map(x => x.match(/https:\/\/dattasable.com\/blog\/([^)]*)/)[1]);
 assert.equal(generic.length, 23);
 for (const slug of generic) assert.ok(revisions.some(x => x.slug === slug), slug);
 const paragraphs = new Set();
 for (const revision of revisions) {
  assert.doesNotMatch(revision.title, /\[Video\]|99\.8|42\.4|400\+/);
  assert.ok(revision.sourceHashes.length > 0); assert.equal(revision.image, null);
  assert.match(revision.content, /Primary references/); assert.doesNotMatch(revision.content, /<script|In the fast-moving landscape|we achieved|our client/i);
  for (const paragraph of revision.content.match(/<p>[\s\S]*?<\/p>/g) || []) {
   assert.ok(!paragraphs.has(paragraph), 'Repeated prose in ' + revision.slug); paragraphs.add(paragraph);
  }
 }
});
test('revision matching preserves a future CMS rewrite, new title and publication state', () => {
 const original = '<p>Known historical body.</p>';
 const revision = { slug: 'fixture', title: 'Reviewed guide', excerpt: 'New excerpt', content: '<p>A useful guide.</p>',
  sourceHashes: [createHash('sha256').update(original).digest('hex')], sourceTitles: ['Old title'], reviewedAt: '2026-10-20', readTime: 2 };
 const engine = load('lib/editorial-revisions.ts', { 'node:crypto': { createHash }, '@/content/editorial/revisions': { editorialRevisions: [revision] } });
 const post = { slug: 'fixture', title: 'Old title', content: original, published: false };
 const revised = engine.applyEditorialRevision(post);
 assert.equal(revised.title, 'Reviewed guide'); assert.equal(revised.published, false);
 assert.equal(engine.applyEditorialRevision({ ...post, content: '<p>New CMS review.</p>' }).content, '<p>New CMS review.</p>');
 assert.equal(engine.applyEditorialRevision({ ...post, title: 'New title' }).title, 'New title');
});
test('worked example calculations reproduce their stated outcomes', () => {
 assert.equal((40-12)*25-300, 400); assert.equal(6000/400, 15);
 assert.equal(6000/((40-12)*25*0.5-300), 120);
 assert.equal((30*4+30*3+25*2+15*5)/100, 3.35);
 assert.equal((300-195)/300, 0.35); assert.equal((100+80-20)/200, 0.8);
 assert.equal(100+200+50, 350); assert.equal(100+50, 150);
 assert.ok(Math.abs([1,1.1,1.2,1.3,3].reduce((a,b)=>a+b,0)/5-1.52)<1e-10);
 assert.equal(new Set(['scan-1','scan-2','scan-3','scan-2']).size, 3);
});

test('public formatting repairs prose emphasis without modifying code or HTML attributes', () => {
 const content = '<p>A **clear definition**.</p><pre><code>x ** 2</code></pre><a title="**attribute**">Read</a>';
 const result = editorial.correctEditorialContent({ slug: 'formatting', content }).content;
 assert.match(result, /<strong>clear definition<\/strong>/);
 assert.match(result, /<pre><code>x \*\* 2<\/code><\/pre>/);
 assert.match(result, /title="\*\*attribute\*\*"/);
});

test('legacy AI eligibility wording is corrected without rewriting distinct future CMS guidance', () => {
 const old = 'Yes, advanced AI capabilities like Copilot, Fabric IQ routing, and Data Agents require a Fabric F64 capacity or higher in 2026.';
 const result = editorial.correctEditorialContent({ slug: 'eligibility', content: '<p>' + old + '</p>' }).content;
 assert.match(result, /paid F2 or higher/);
 assert.doesNotMatch(result, /require a Fabric F64/);
 const future = '<p>Feature eligibility was checked against the current vendor requirements.</p>';
 assert.equal(editorial.correctEditorialContent({ slug: 'eligibility', content: future }).content, future);
});
test('known missing portrait uses the existing author asset', () => {
 const result = editorial.correctEditorialContent({ slug: 'portrait', content: '<img src="/images/hero/datta-sable-portrait.webp" alt="Author">' }).content;
 assert.match(result, /src="\/images\/author.webp"/);
 assert.ok(fs.existsSync('public/images/author.webp'));
});

test('Google consent defaults deny advertising and analytics-only acceptance never grants advertising purposes', () => {
 const consent = load('lib/google-consent.ts');
 const window = {};
 vm.runInNewContext(consent.googleConsentBootstrap, { window });
 const defaults = Array.from(window.dataLayer[0]);
 assert.equal(defaults[0], 'consent'); assert.equal(defaults[1], 'default');
 for (const name of ['analytics_storage','ad_storage','ad_user_data','ad_personalization']) assert.equal(defaults[2][name], 'denied');
 vm.runInNewContext(consent.buildAnalyticsInitialization('G-FIXTURE'), { window, Date });
 const update = Array.from(window.dataLayer[1]);
 assert.equal(update[1], 'update'); assert.equal(update[2].analytics_storage, 'granted');
 assert.equal(update[2].ad_storage, undefined); assert.equal(update[2].ad_user_data, undefined); assert.equal(update[2].ad_personalization, undefined);
 const config = Array.from(window.dataLayer[3]);
 assert.equal(config[0], 'config'); assert.equal(config[2].allow_google_signals, false); assert.equal(config[2].allow_ad_personalization_signals, false);
 assert.equal(config[2].page_referrer, '');
});

test('analytics removes queries and fragments and excludes account paths', () => {
 const urls = load('lib/analytics-url.ts');
 assert.equal(urls.analyticsPath('/knowledge?email=reader@example.com#secret'), '/knowledge');
 for (const path of ['/admin/users','/api/auth','/profile','/unsubscribe?token=secret','/person%40example.com','//external.test']) assert.equal(urls.analyticsPath(path), null);
 assert.equal(urls.referrerOrigin('https://example.com/private?email=person@example.com#secret'), 'https://example.com');
 assert.equal(urls.referrerOrigin('javascript:alert(1)'), '');
});
