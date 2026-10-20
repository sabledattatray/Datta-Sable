import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, stubs = {}) {
  const mod = { exports: {} };
  const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  assert.equal(result.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  vm.runInNewContext(result.outputText, { module: mod, exports: mod.exports, Date, Set, console: { warn() {}, error() {} }, require: id => {
    if (Object.hasOwn(stubs, id)) return stubs[id];
    throw new Error(`Unexpected import: ${id}`);
  } });
  return mod.exports;
}
const typography = load('lib/site-typography.ts');

test('original site remains unchanged until individual properties are customized', () => {
  const settings = typography.defaultTypography();
  assert.ok(typography.parseTypography(settings));
  assert.equal(typography.buildTypographyCss(settings), '');
  settings.elements.h1.fontSize = 56;
  settings.elements.h1.mobileFontSize = 32;
  settings.elements.h1.fontWeight = 700;
  settings.elements.h1.darkColor = '#abcdef';
  settings.elements.h2.lightColor = '#123456';
  const css = typography.buildTypographyCss(settings);
  assert.match(css, /font-size:3.5rem!important/);
  assert.match(css, /@media\(max-width:767px\)/);
  assert.match(css, /font-size:2rem!important/);
  assert.match(css, /html\.dark #main-content h1/);
  assert.match(css, /html\.light #main-content h2/);
  assert.match(css, /-webkit-text-fill-color:#abcdef!important/);
  assert.doesNotMatch(css, /#main-content h3|@font-face|body\{|!important!important/);
  assert.doesNotMatch(typography.buildTypographyCss(settings, '#sample', '#preview', 'desktop'), /@media|font-size:2rem/);
  assert.match(typography.buildTypographyCss(settings, '#sample', '#preview', 'mobile'), /#sample h1[^}]+font-size:2rem/);
});

test('malformed settings, CSS injection, unsupported weights and out-of-range values cannot reach styles', () => {
  const cases = [
    rule => { rule.fontFamily = "Inter';}body{display:none}/*"; },
    rule => { rule.darkColor = '#ffffff;}</style><script>alert(1)</script>'; },
    rule => { rule.fontSize = '20px'; }, rule => { rule.fontSize = NaN; },
    rule => { rule.fontSize = 121; }, rule => { rule.mobileFontSize = 0; },
    rule => { rule.fontWeight = 450; }, rule => { rule.lineHeight = 0; },
    rule => { rule.letterSpacing = -1; }, rule => { rule.unknown = 'injected'; },
    rule => { rule.fontFamily = 'JetBrains Mono'; rule.fontWeight = 800; },
  ];
  for (const mutate of cases) {
    const settings = typography.defaultTypography(); mutate(settings.elements.h1);
    assert.equal(typography.parseTypography(settings), null);
    assert.equal(typography.buildTypographyCss(settings), '');
  }
  const missing = typography.defaultTypography(); delete missing.elements.h6;
  assert.equal(typography.parseTypography(missing), null);
  assert.equal(typography.parseStoredTypography('{broken'), null);
  assert.equal(typography.parseStoredTypography('x'.repeat(16001)), null);
});

test('every advertised font is bundled, licensed, and loads only when selected', () => {
  assert.equal(typography.FONT_FAMILIES.length, 11);
  const settings = typography.defaultTypography();
  assert.equal(typography.typographyFontCss(settings), '');
  for (const font of typography.FONT_FAMILIES.slice(3).filter(font => font.name !== 'Segoe UI')) {
    const slug = font.name.toLowerCase().replaceAll(' ', '-');
    const root = path.join('public/fonts/typography', slug);
    assert.equal(fs.readFileSync(`${root}-latin-variable.woff2`).subarray(0, 4).toString(), 'wOF2');
    assert.match(fs.readFileSync(`${root}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE/);
  }
  settings.elements.h1.fontFamily = 'Roboto'; settings.elements.h2.fontFamily = 'Roboto';
  const css = typography.buildTypographyCss(settings);
  assert.equal((css.match(/@font-face/g) || []).length, 1);
  assert.match(css, /\/fonts\/typography\/roboto-latin-variable\.woff2/);
  assert.doesNotMatch(css, /fonts\.googleapis|fonts\.gstatic|montserrat/);
  const system = typography.defaultTypography(); system.elements.h1.fontFamily = 'Segoe UI';
  assert.match(typography.buildTypographyCss(system), /font-family:'Segoe UI',system-ui,sans-serif!important/);
  assert.doesNotMatch(typography.buildTypographyCss(system), /@font-face|\/fonts\//);
});

function actionEnvironment({ role = 'ADMIN', fail = false, row = null } = {}) {
  let record = row;
  let writes = 0;
  const invalidated = [];
  const audits = [];
  const prisma = { systemSetting: {
    async create({ data }) {
      writes++;
      if (fail) throw new Error('database offline');
      if (record) throw Object.assign(new Error('duplicate'), { code: 'P2002' });
      record = { ...data, updatedAt: new Date('2026-10-20T15:00:00.000Z') }; return record;
    },
    async updateMany({ where, data }) {
      writes++;
      if (fail) throw new Error('database offline');
      if (!record || record.key !== where.key || record.updatedAt.getTime() !== where.updatedAt.getTime()) return { count: 0 };
      record = { ...record, ...data }; return { count: 1 };
    },
  } };
  const actions = load('app/admin/settings/typography/actions.ts', {
    'next-auth': { getServerSession: async () => role ? { user: { id: 'admin-test', role } } : null },
    '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma }, '@/lib/site-typography': typography,
    '@/lib/security': { logAudit: async entry => audits.push(entry) },
    'next/cache': { revalidateTag: tag => invalidated.push(tag), revalidatePath: (...args) => invalidated.push(args) },
  });
  return { actions, getRecord: () => record, getWrites: () => writes, invalidated, audits };
}

test('anonymous and non-admin users cannot publish typography', async () => {
  for (const role of [null, 'USER']) {
    const e = actionEnvironment({ role });
    assert.match((await e.actions.saveWebsiteTypography(typography.defaultTypography(), null)).error, /Administrator/);
    assert.equal(e.getWrites(), 0); assert.equal(e.invalidated.length, 0);
  }
});

test('publish validates input, saves to the shared database, invalidates site cache and audits the change', async () => {
  const e = actionEnvironment();
  const invalid = typography.defaultTypography(); invalid.elements.h1.lightColor = 'red;display:none';
  assert.ok((await e.actions.saveWebsiteTypography(invalid, null)).error); assert.equal(e.getWrites(), 0);
  assert.ok((await e.actions.saveWebsiteTypography(typography.defaultTypography(), 'not-a-date')).error);
  const settings = typography.defaultTypography(); settings.elements.h2.fontFamily = 'Lora';
  const result = await e.actions.saveWebsiteTypography(settings, null);
  assert.equal(result.success, true); assert.equal(e.getWrites(), 1);
  assert.equal(e.getRecord().key, typography.TYPOGRAPHY_KEY);
  assert.equal(JSON.parse(e.getRecord().value).elements.h2.fontFamily, 'Lora');
  assert.equal(result.revision, e.getRecord().updatedAt.toISOString());
  assert.ok(e.invalidated.includes(typography.TYPOGRAPHY_TAG));
  assert.deepEqual(Array.from(e.invalidated[1]), ['/', 'layout']);
  assert.equal(e.audits[0].action, 'UPDATE_WEBSITE_TYPOGRAPHY');
});

test('an outdated editor cannot overwrite a newer publish; a current editor can reset to defaults', async () => {
  const e = actionEnvironment();
  const settings = typography.defaultTypography(); settings.elements.h1.fontSize = 64;
  const first = await e.actions.saveWebsiteTypography(settings, null);
  assert.ok((await e.actions.saveWebsiteTypography(typography.defaultTypography(), null)).error);
  assert.ok((await e.actions.saveWebsiteTypography(typography.defaultTypography(), '2026-10-20T14:00:00.000Z')).error);
  assert.equal(JSON.parse(e.getRecord().value).elements.h1.fontSize, 64);
  const reset = await e.actions.saveWebsiteTypography(typography.defaultTypography(), first.revision);
  assert.equal(reset.success, true);
  assert.equal(typography.buildTypographyCss(JSON.parse(e.getRecord().value)), '');
});

test('database save failure reports failure and does not invalidate or claim publication', async () => {
  const e = actionEnvironment({ fail: true });
  const result = await e.actions.saveWebsiteTypography(typography.defaultTypography(), null);
  assert.match(result.error, /Could not save/); assert.equal(result.success, undefined);
  assert.equal(e.invalidated.length, 0); assert.equal(e.audits.length, 0);
});

test('public reads use validated persisted settings and fall back without caching a database failure', async () => {
  const settings = typography.defaultTypography(); settings.elements.h1.fontSize = 60;
  let fail = false;
  const store = load('lib/site-typography-store.ts', {
    './site-typography': typography,
    '@/lib/prisma': { prisma: { systemSetting: { findUnique: async () => { if (fail) throw Error('offline'); return { value: JSON.stringify(settings) }; } } } },
    'next/cache': { unstable_cache: fn => fn },
  });
  assert.equal((await store.getPublicTypography()).elements.h1.fontSize, 60);
  fail = true; assert.equal(typography.buildTypographyCss(await store.getPublicTypography()), '');
  fail = false; assert.equal((await store.getPublicTypography()).elements.h1.fontSize, 60);
});
