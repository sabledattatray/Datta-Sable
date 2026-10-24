import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const native = createRequire(import.meta.url);
function loader(stubs = {}, env = {}) {
  const cache = new Map();
  function load(file) {
    const full = path.resolve(file);
    if (cache.has(full)) return cache.get(full).exports;
    const mod = { exports: {} }; cache.set(full, mod);
    const require = id => {
      if (Object.hasOwn(stubs, id)) return stubs[id];
      if (id.startsWith('@/')) return load(id.slice(2) + '.ts');
      if (id.startsWith('.')) return load(path.resolve(path.dirname(full), id + '.ts'));
      return native(id);
    };
    const source = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    vm.runInNewContext(source, { module: mod, exports: mod.exports, require, process: { env, cwd: () => process.cwd() }, console: { log() {}, warn() {}, error() {} }, Buffer, URL, Headers, Request, Response, AbortSignal, FormData, File, TextDecoder, setTimeout, clearTimeout }, { filename: full });
    return mod.exports;
  }
  return load;
}

test('HTML sanitization rejects encoded executable URLs, event handlers and foreign frames', () => {
  const { sanitizeHtml } = loader()('lib/sanitize.ts');
  const result = sanitizeHtml('<a href="java&#x73;cript:alert(1)" onclick="alert(1)">Read</a><img src="/photo.png" onerror="alert(1)"><svg onload="alert(1)"></svg><iframe src="https://www.youtube.com.evil.test/embed/test"></iframe>');
  assert.doesNotMatch(result, /javascript|onclick|onerror|onload|<svg|<iframe/i);
  assert.match(result, /\/photo\.png/);
});
test('HTML sanitization preserves safe formatting and genuine YouTube embeds', () => {
  const { sanitizeHtml } = loader()('lib/sanitize.ts');
  const result = sanitizeHtml('<h2 id="guide" style="color:#123456;padding:20px">Guide</h2><iframe src="https://www.youtube.com/embed/abc123" srcdoc="bad" onload="bad()"></iframe>');
  assert.match(result, /id="guide"/); assert.match(result, /color:#123456/); assert.match(result, /youtube.com\/embed\/abc123/); assert.doesNotMatch(result, /srcdoc|onload/);
});
test('public catalog suppresses database drafts and placeholders rather than reviving source copies', () => {
  const { mergePublishedPosts } = loader()('lib/blog-catalog.ts');
  const source = [{ slug: 'hidden', content: 'Source article' }, { slug: 'valid', content: 'Useful article' }];
  assert.deepEqual(Array.from(mergePublishedPosts(source, [{ slug: 'hidden', published: false }]), p => p.slug), ['valid']);
  assert.equal(mergePublishedPosts(source, [{ slug: 'hidden', published: true, content: 'In the rapidly evolving world of digital infrastructure and technology' }]).length, 1);
});
test('uploads reject forged image content, executable extensions and oversized files', async () => {
  const { validateUpload } = loader()('lib/upload-validation.ts');
  await assert.rejects(validateUpload(new File(['<script>bad()</script>'], 'image.png', { type: 'image/png' })));
  await assert.rejects(validateUpload(new File(['%PDF-1.7'], 'page.html', { type: 'application/pdf' })));
  await assert.rejects(validateUpload(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' })));
  assert.equal((await validateUpload(new File(['%PDF-1.7'], 'resume.pdf', { type: 'application/pdf' }), 'resume')).extension, 'pdf');
});
test('private company-profile server action does not query data for anonymous users', async () => {
  let reads = 0;
  const load = loader({ 'next-auth': { getServerSession: async () => null }, '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma: { systemSetting: { findMany: async () => { reads++; return []; } } } } });
  assert.equal(await load('app/admin/org-actions.ts').getCompanyProfile(), null); assert.equal(reads, 0);
});
test('admin topic-authority endpoint requires administrator access', async () => {
  const load = loader({ 'next-auth/next': { getServerSession: async () => ({ user: { role: 'USER' } }) }, '@/lib/auth': { authOptions: {} } });
  assert.equal((await load('app/api/admin/topic-authority/route.ts').GET()).status, 403);
});

function mentorship(failMail = false) {
  let tokens = []; const emails = []; const attempts = new Map();
  const applicant = { id: 'learner-1', email: 'reader@example.test', fullName: '<Reader>' };
  const matches = (r, w) => (!w.email || r.email === w.email) && (!w.token || (typeof w.token === 'string' ? r.token === w.token : w.token.in.includes(r.token))) && (!w.expiresAt || r.expiresAt > w.expiresAt.gt);
  const prisma = {
    mentorshipRequest: { findUnique: async ({ where }) => where.email === applicant.email ? applicant : null },
    mentorshipToken: { findUnique: async ({ where }) => tokens.find(t => t.token === where.token) || null, createMany: async ({ data }) => { tokens.push(...data); return { count: data.length }; }, deleteMany: async ({ where }) => { const count = tokens.filter(t => matches(t, where)).length; tokens = tokens.filter(t => !matches(t, where)); return { count }; } },
  };
  prisma.$transaction = fn => fn(prisma);
  const load = loader({ '@/lib/prisma': { prisma }, '@/lib/security': { rateLimit: (key, limit) => { const n = (attempts.get(key) || 0) + 1; attempts.set(key, n); return n <= limit; } }, '@/lib/email-delivery': { emailConfiguration: () => ({ configured: true }), sendEmail: async mail => { if (failMail) throw Error('provider unavailable'); emails.push(mail); return { messageId: 'fixture-id' }; } } }, { NEXTAUTH_SECRET: 'fixture-secret', NEXTAUTH_URL: 'https://dattasable.test' });
  const route = load('app/api/mentorship/magic-link/route.ts');
  const call = body => route.POST(new Request('https://dattasable.test/api/mentorship/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
  return { call, emails, getTokens: () => tokens };
}
test('mentorship issues an actual email without exposing credentials in its response or stored tokens', async () => {
  const e = mentorship(); const response = await e.call({ email: ' Reader@Example.test ' }); const result = await response.json();
  assert.equal(response.status, 200); assert.equal(e.emails.length, 1); assert.equal(e.emails[0].to, 'reader@example.test');
  assert.equal(result.otp, undefined); assert.equal(result.magicLink, undefined); assert.equal(e.getTokens().length, 2);
  assert.ok(e.getTokens().every(t => /^(ml2_|otp2_)[a-f0-9]{64}$/.test(t.token)));
  assert.match(e.emails[0].html, /&lt;Reader&gt;/);
});
test('mentorship OTPs are email-bound and single-use; they cannot be passed as magic links', async () => {
  const e = mentorship(); await e.call({ email: 'reader@example.test' }); const otp = /code is (\d{6})/.exec(e.emails[0].text)[1];
  assert.equal((await e.call({ token: `otp_${otp}` })).status, 400);
  assert.equal((await e.call({ email: 'another@example.test', otp })).status, 400);
  assert.equal((await e.call({ email: 'reader@example.test', otp })).status, 200);
  assert.equal((await e.call({ email: 'reader@example.test', otp })).status, 400);
});
test('mentorship provider failure returns an error and removes unsent credentials', async () => {
  const e = mentorship(true); assert.equal((await e.call({ email: 'reader@example.test' })).status, 503); assert.equal(e.getTokens().length, 0);
});
test('mentorship rejects malformed tokens before looking up applicant data', async () => {
  const e = mentorship(); assert.equal((await e.call({ token: '123456' })).status, 400); assert.equal((await e.call({ email: ['invalid'] })).status, 400); assert.equal(e.emails.length, 0);
});

test('public jobs reads never create default vacancies in an empty database', async () => {
  const route = loader({ '@/lib/prisma': { prisma: { job: { findMany: async () => [] } } } })('app/api/jobs/route.ts');
  const response = await route.GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('MCP validates request envelopes and initializes without database writes', async () => {
  let schemaCalls = 0;
  const stubs = {
    'next-auth': { getServerSession: async () => ({ user: { role: 'ADMIN' } }) },
    '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma: {} },
    '@/lib/ai/schema': { ensureAiStudioSchema: async () => { schemaCalls++; throw Error('Database unavailable'); } },
  };
  for (const dependency of ['topic-discovery', 'research-engine', 'article-writer', 'duplicate-detector', 'seo-intelligence', 'publishing', 'google-indexing', 'config', 'audit']) stubs[`@/lib/ai/${dependency}`] = {};
  const route = loader(stubs)('app/api/mcp/route.ts');
  const call = body => route.POST(new Request('https://dattasable.test/api/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
  for (const body of [null, [], 'invalid', {}, { method: 'tools/call', params: null }]) {
    const response = await call(body);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, -32600);
  }
  assert.equal((await call({ id: 7, method: 'initialize' })).status, 200);
  assert.equal((await call({ id: 8, method: 'tools/list' })).status, 200);
  assert.equal(schemaCalls, 0);
  const unavailable = await call({ id: 9, method: 'tools/call', params: { name: 'list_articles' } });
  assert.equal((await unavailable.json()).error.code, -32000);
  assert.equal(schemaCalls, 1);
});
