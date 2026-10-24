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
const templates = load('lib/site-typography-templates.ts', { './site-typography': typography });

test('published typography uses the portfolio body and control floors on desktop and mobile', () => {
  const settings = typography.defaultTypography();
  for (const id of ['body', 'paragraph', 'small', 'button', 'link', 'code']) {
    settings.elements[id].fontSize = 10;
    settings.elements[id].mobileFontSize = 11;
  }
  settings.elements.h1.fontSize = 64;
  const css = typography.buildTypographyCss(settings);
  assert.doesNotMatch(css, /font-size:0\.625rem/);
  assert.match(css, /font-size:0\.8125rem!important/);
  assert.match(css, /font-size:0\.6875rem!important/);
  assert.match(css, /font-size:4rem!important/);
  assert.doesNotMatch(css, /text-fill-color|background-image:none/);
});

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
  assert.equal(typography.FONT_FAMILIES.length, 13);
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
    '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma }, '@/lib/site-typography': typography, '@/lib/site-typography-templates': templates,
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

test('Segoe UI template matches all recommended typography values without replacing links or button colors', () => {
  const settings = templates.segoeTypography();
  assert.ok(typography.parseTypography(settings));
  for (const [id, desktop, mobile, weight, height, spacing] of [
    ['body', 18, 17, 400, 1.75, 0], ['paragraph', 18, 17, 400, 1.75, 0],
    ['h1', 48, 34, 700, 1.2, -0.025], ['h2', 34, 28, 600, 1.3, -0.015],
    ['h3', 26, 23, 600, 1.35, -0.01], ['h4', 22, 20, 600, 1.4, 0],
    ['h5', 19, 18, 600, 1.4, 0], ['h6', 17, 16, 600, 1.5, 0],
    ['button', 14, 14, 600, 1.4, 0], ['small', 14, 14, 400, 1.6, 0],
  ]) {
    const rule = settings.elements[id];
    assert.equal(rule.fontFamily, 'Segoe UI');
    assert.deepEqual([rule.fontSize, rule.mobileFontSize, rule.fontWeight, rule.lineHeight, rule.letterSpacing], [desktop, mobile, weight, height, spacing]);
  }
  for (const id of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    assert.equal(settings.elements[id].darkColor, '#FAFAFA'); assert.equal(settings.elements[id].lightColor, '#18181B');
  }
  assert.equal(settings.elements.paragraph.darkColor, '#D4D4D8'); assert.equal(settings.elements.paragraph.lightColor, '#27272A');
  assert.equal(settings.elements.small.darkColor, '#B3BDCC'); assert.equal(settings.elements.small.lightColor, '#475569');
  for (const id of ['button', 'link', 'code']) { assert.equal(settings.elements[id].lightColor, ''); assert.equal(settings.elements[id].darkColor, ''); }
  assert.equal(settings.elements.code.fontFamily, 'JetBrains Mono');
  assert.equal(settings.elements.link.fontSize, null); assert.equal(settings.elements.link.fontWeight, null);
  settings.elements.h1.fontSize = 100;
  assert.equal(templates.segoeTypography().elements.h1.fontSize, 48, 'each template application returns fresh settings');
});

function templateEnvironment({ role = 'ADMIN', current = null, baseline = null, failBackup = false } = {}) {
  let records = new Map();
  const invalidated = [];
  let transactions = 0;
  if (current) records.set(typography.TYPOGRAPHY_KEY, current);
  if (baseline) records.set(templates.TYPOGRAPHY_DEFAULT_KEY, baseline);
  const prisma = { async $transaction(work) {
    transactions++;
    const pending = new Map(records);
    const systemSetting = {
      findUnique: async ({ where }) => pending.get(where.key) ?? null,
      create: async ({ data }) => {
        if (failBackup && data.key === templates.TYPOGRAPHY_DEFAULT_KEY) throw Error('backup failed');
        if (pending.has(data.key)) throw Object.assign(Error('duplicate'), { code: 'P2002' });
        const record = { ...data, updatedAt: new Date('2026-10-20T16:00:00.000Z') };
        pending.set(data.key, record); return record;
      },
      updateMany: async ({ where, data }) => {
        const record = pending.get(where.key);
        if (!record || record.updatedAt.getTime() !== where.updatedAt.getTime()) return { count: 0 };
        pending.set(where.key, { ...record, ...data }); return { count: 1 };
      },
    };
    const result = await work({ systemSetting });
    records = pending;
    return result;
  } };
  const actions = load('app/admin/settings/typography/actions.ts', {
    'next-auth': { getServerSession: async () => role ? { user: { id: 'admin-test', role } } : null },
    '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma }, '@/lib/site-typography': typography, '@/lib/site-typography-templates': templates,
    '@/lib/security': { logAudit: async () => {} },
    'next/cache': { revalidateTag: tag => invalidated.push(tag), revalidatePath: () => {} },
  });
  return { apply: actions.applyWebsiteTypographyTemplate, record: key => records.get(key), invalidated, transactions: () => transactions };
}

test('one-click templates preserve the original custom default permanently and restore it exactly', async () => {
  const original = typography.defaultTypography(); original.elements.h1.fontFamily = 'Inter'; original.elements.h1.fontSize = 52;
  const current = { key: typography.TYPOGRAPHY_KEY, value: JSON.stringify(original), updatedAt: new Date('2026-10-20T15:00:00.000Z') };
  const e = templateEnvironment({ current });
  const first = await e.apply('segoe', current.updatedAt.toISOString());
  assert.equal(first.success, true);
  assert.equal(e.record(templates.TYPOGRAPHY_DEFAULT_KEY).value, JSON.stringify(original));
  assert.equal(JSON.parse(e.record(typography.TYPOGRAPHY_KEY).value).elements.h1.fontFamily, 'Segoe UI');
  const restored = await e.apply('default', first.revision);
  assert.equal(restored.success, true); assert.equal(e.record(typography.TYPOGRAPHY_KEY).value, JSON.stringify(original));
  const next = await e.apply('segoe', restored.revision);
  assert.equal(next.success, true); assert.equal(e.record(templates.TYPOGRAPHY_DEFAULT_KEY).value, JSON.stringify(original));
  assert.equal((await e.apply('default', next.revision)).success, true);
  assert.equal(e.record(typography.TYPOGRAPHY_KEY).value, JSON.stringify(original));
});

test('template switching works on an untouched site and snapshots its unmodified original design', async () => {
  const e = templateEnvironment();
  const first = await e.apply('segoe', null);
  assert.equal(first.success, true);
  assert.equal(typography.buildTypographyCss(JSON.parse(e.record(templates.TYPOGRAPHY_DEFAULT_KEY).value)), '');
  assert.equal((await e.apply('default', first.revision)).success, true);
  assert.equal(typography.buildTypographyCss(JSON.parse(e.record(typography.TYPOGRAPHY_KEY).value)), '');
});

test('template publication requires admin access, valid template and current revision', async () => {
  for (const role of [null, 'USER']) {
    const e = templateEnvironment({ role }); assert.match((await e.apply('segoe', null)).error, /Administrator/); assert.equal(e.transactions(), 0);
  }
  const e = templateEnvironment();
  assert.ok((await e.apply('unknown', null)).error); assert.ok((await e.apply('segoe', 'bad')).error); assert.equal(e.transactions(), 0);
  const first = await e.apply('segoe', null);
  const value = e.record(typography.TYPOGRAPHY_KEY).value;
  assert.ok((await e.apply('default', null)).error);
  assert.equal(e.record(typography.TYPOGRAPHY_KEY).value, value);
  assert.equal(e.invalidated.length, 1); assert.equal(first.success, true);
});

test('a failed default backup rolls back publication so the original fonts remain recoverable', async () => {
  const original = typography.defaultTypography(); original.elements.h2.fontFamily = 'Syne';
  const current = { key: typography.TYPOGRAPHY_KEY, value: JSON.stringify(original), updatedAt: new Date('2026-10-20T15:00:00.000Z') };
  const e = templateEnvironment({ current, failBackup: true });
  const result = await e.apply('segoe', current.updatedAt.toISOString());
  assert.ok(result.error); assert.equal(e.record(typography.TYPOGRAPHY_KEY).value, current.value);
  assert.equal(e.record(templates.TYPOGRAPHY_DEFAULT_KEY), undefined); assert.equal(e.invalidated.length, 0);
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

test('public reads use validated persisted settings and fall back on database failure', async () => {
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

test('public typography falls back safely when its database is unreachable', async () => {
  let attempts = 0;
  const store = load('lib/site-typography-store.ts', {
    'next/cache': { unstable_cache: callback => callback },
    '@/lib/prisma': { prisma: { systemSetting: { findUnique: async () => {
      attempts += 1;
      throw new Error('Database unavailable');
    } } } },
    './site-typography': typography,
  });
  assert.deepEqual(await store.getPublicTypography(), typography.defaultTypography());
  assert.equal(attempts, 1);
});
