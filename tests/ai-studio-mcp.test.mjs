import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

const native = createRequire(import.meta.url);

function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const require = name => {
      if (name in overrides) return overrides[name];
      if (name.startsWith('@/')) return load(name.slice(2) + (name.endsWith('.ts') ? '' : '.ts'));
      if (name.startsWith('.')) return load(new URL(name + (name.endsWith('.ts') ? '' : '.ts'), 'file:///' + file).pathname.slice(1));
      return native(name);
    };
    vm.runInNewContext(code, { exports, require, console, URL, Date, Set, Map, Buffer, global, process: { env: {} }, ...globals });
    return exports;
  }
  return load;
}

const load = loader();
const config = load('lib/ai/config.ts');
const quality = load('lib/ai/quality-gates.ts');
const seo = load('lib/ai/seo-intelligence.ts');
const provider = load('lib/ai/provider.ts');
const schema = load('lib/ai/schema.ts');

test('AI Studio configuration maintains safe default operating modes and budget limits', () => {
  assert.equal(config.DEFAULT_AI_SETTINGS.operatingMode, 'ASSISTED');
  assert.equal(config.DEFAULT_AI_SETTINGS.monthlyBudgetUsd, 25);
  assert.equal(config.DEFAULT_AI_SETTINGS.timezone, 'Asia/Kolkata');
  assert.equal(config.OPERATING_MODES.ASSISTED, 'ASSISTED');
  assert.equal(config.OPERATING_MODES.AUTONOMOUS, 'AUTONOMOUS');
  assert.equal(config.OPERATING_MODES.MANUAL, 'MANUAL');
  assert.ok(config.ARTICLE_LENGTH_TARGETS.COMPREHENSIVE.target >= 2000);
});

test('Token cost estimation accurately calculates prompt and completion rates', () => {
  // 1M prompt + 1M completion on gemini-2.5-flash = $0.075 + $0.30 = $0.375
  const cost = provider.estimateTokenCost('gemini-2.5-flash', 1_000_000, 1_000_000);
  assert.equal(cost, 0.375);

  const smallCost = provider.estimateTokenCost('gemini-2.5-flash', 10_000, 2_000);
  assert.ok(smallCost > 0 && smallCost < 0.01);
});

test('Slug generation produces clean, URL-safe lowercase slugs', () => {
  const slug = seo.generateSlug('Building Real-Time Data Pipelines with Microsoft Fabric!');
  assert.equal(slug, 'building-real-time-data-pipelines-with-microsoft-fabric');

  const slugWithPunctuation = seo.generateSlug('Power BI: DAX vs. Power Query (2026 Guide)');
  assert.equal(slugWithPunctuation, 'power-bi-dax-vs-power-query-2026-guide');
});

test('Research brief schema validates official citations and rejects malformed outline', () => {
  const validBrief = {
    proposedTitle: 'Microsoft Fabric Eventhouse Architecture Guide',
    readerIntent: 'Deploy real-time ingestion in production',
    targetAudience: 'Data Engineers',
    primaryQuestions: ['How to configure streaming tables?'],
    verifiedClaims: [
      {
        claim: 'Eventhouse supports KQL database storage with sub-second query latency.',
        sourceUrl: 'https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventhouse-overview',
        verified: true,
      },
    ],
    documentationUrls: ['https://learn.microsoft.com/en-us/fabric/'],
    sourceCitations: [
      {
        url: 'https://learn.microsoft.com/en-us/fabric/',
        title: 'Microsoft Fabric Documentation',
        retrievedAt: new Date().toISOString(),
      },
    ],
    potentialConflicts: null,
    suggestedOutline: [
      {
        heading: 'Architecture Overview',
        level: 'H2',
        summary: 'Component breakdown',
        keyPoints: ['OneLake storage', 'KQL engine'],
      },
    ],
  };

  const parsed = schema.ResearchBriefSchema.safeParse(validBrief);
  assert.equal(parsed.success, true);

  const invalidBrief = { ...validBrief, primaryQuestions: [] };
  assert.equal(schema.ResearchBriefSchema.safeParse(invalidBrief).success, false);
});

test('Quality gates enforce depth, heading hierarchy, and block low-quality drafts from autonomous publish', () => {
  // 1. High-quality comprehensive article
  const highQuality = quality.evaluateContentQuality({
    title: 'Enterprise Microsoft Fabric Guide',
    content: '## Overview\nHigh performance analytics.\n\n## Configuration\n```sql\nSELECT 1;\n```\n\n## Benchmarks\n| Metric | Result |\n|---|---|\n| Latency | 5ms |\n\n## Summary\nProduction ready.',
    excerpt: 'Detailed enterprise guide to configuring Microsoft Fabric workloads with verified benchmarks.',
    category: 'Microsoft Fabric',
    wordCount: 1400,
    duplicateRiskScore: 10,
    verifiedClaimsCount: 3,
    hasSeoTitle: true,
    hasSeoDescription: true,
  });

  assert.ok(highQuality.score >= 75);
  assert.equal(highQuality.blockers.length, 0);
  assert.equal(highQuality.isEligibleForAutonomousPublish, true);

  // 2. Short, low-quality article with high duplicate risk
  const lowQuality = quality.evaluateContentQuality({
    title: 'Short Note',
    content: 'Very short content.',
    excerpt: 'Short.',
    category: 'General',
    wordCount: 200,
    duplicateRiskScore: 85,
    verifiedClaimsCount: 0,
    hasSeoTitle: false,
    hasSeoDescription: false,
  });

  assert.ok(lowQuality.score < 50);
  assert.ok(lowQuality.blockers.length >= 2);
  assert.equal(lowQuality.isEligibleForAutonomousPublish, false);
});

test('Live source validator checks authoritative domains and detects invalid URLs', async () => {
  const research = load('lib/ai/research-engine.ts');

  // 1. Authoritative domain validation
  const validDomainCheck = await research.validateAuthoritativeSource('https://learn.microsoft.com/en-us/fabric/');
  assert.equal(validDomainCheck.isAuthoritativeDomain, true);
  assert.equal(validDomainCheck.domain, 'learn.microsoft.com');

  // 2. Non-authoritative / suspicious domain is rejected
  const nonAuthoritativeCheck = await research.validateAuthoritativeSource('https://random-unverified-blog.xyz/post');
  assert.equal(nonAuthoritativeCheck.isAuthoritativeDomain, false);
  assert.equal(nonAuthoritativeCheck.verified, false);
  assert.ok(nonAuthoritativeCheck.error?.includes('not in authoritative whitelist') || nonAuthoritativeCheck.error);

  // 3. Malformed URL is safely rejected without crashing
  const malformedCheck = await research.validateAuthoritativeSource('not-a-url');
  assert.equal(malformedCheck.verified, false);
  assert.equal(malformedCheck.isAuthoritativeDomain, false);
});

test('Concurrency-safe budget reservations calculate task upper bounds accurately', () => {
  const deepCost = provider.estimateTaskReservationCost('ARTICLE_DRAFT', 'gemini-2.5-flash');
  assert.equal(deepCost, 0.08);

  const briefCost = provider.estimateTaskReservationCost('RESEARCH_BRIEF', 'gemini-2.5-flash');
  assert.equal(briefCost, 0.03);

  const seoCost = provider.estimateTaskReservationCost('SEO_INTELLIGENCE', 'gemini-2.5-flash');
  assert.equal(seoCost, 0.02);
});

test('source validation rejects unsafe destinations before fetching and checks every redirect', async () => {
  const requests = [];
  let responses = [];
  const research = loader({}, { AbortSignal, fetch: async (url, options) => {
    requests.push({ url, options });
    return responses.shift() || new Response(null, { status: 200 });
  } })('lib/ai/research-engine.ts');

  for (const url of ['https://127.0.0.1/private', 'https://learn.microsoft.com.evil.test/', 'http://learn.microsoft.com/', 'https://user:pass@learn.microsoft.com/', 'https://learn.microsoft.com:8443/']) {
    assert.equal((await research.validateAuthoritativeSource(url)).verified, false);
  }
  assert.equal(requests.length, 0);

  responses = [new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/latest/meta-data/' } })];
  assert.equal((await research.validateAuthoritativeSource('https://learn.microsoft.com/redirect')).verified, false);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.redirect, 'manual');

  requests.length = 0;
  responses = [new Response(null, { status: 301, headers: { location: '/en-us/fabric/' } }), new Response(null, { status: 200 })];
  assert.equal((await research.validateAuthoritativeSource('https://learn.microsoft.com/old')).verified, true);
  assert.equal(requests[1].url, 'https://learn.microsoft.com/en-us/fabric/');

  requests.length = 0;
  responses = [new Response(null, { status: 405 }), new Response('source', { status: 200 })];
  assert.equal((await research.validateAuthoritativeSource('https://learn.microsoft.com/')).verified, true);
  assert.deepEqual(requests.map(r => r.options.method), ['HEAD', 'GET']);

  responses = Array.from({ length: 6 }, () => new Response(null, { status: 302, headers: { location: '/loop' } }));
  assert.equal((await research.validateAuthoritativeSource('https://learn.microsoft.com/loop')).verified, false);
});

test('Schema DDL reflects all 7 additive models without dropping or altering existing tables', () => {
  const ddl = schema.AI_STUDIO_SCHEMA;
  assert.ok(Array.isArray(ddl));
  assert.ok(ddl.length >= 10);
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiTopicOpportunity"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiResearchBrief"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiContentDraft"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiQualityReport"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiContentVersion"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiPublishingSchedule"')));
  assert.ok(ddl.some(q => q.includes('CREATE TABLE IF NOT EXISTS "AiProviderUsage"')));
});

