import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('lib/post-metadata.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
vm.runInNewContext(source, { module: mod, exports: mod.exports, Date });
const { formatPostDate, formatReadTime } = mod.exports;

test('publication dates share a compact format and invalid dates do not invent a publication date', () => {
  for (const date of ['October 20, 2026', 'Oct 20, 2026', '2026-10-20', '2026-10-20T08:00:00Z']) {
    assert.equal(formatPostDate(date).label, 'Oct 20, 2026');
    assert.match(formatPostDate(date).dateTime, /^2026-10-20T/);
  }
  for (const date of ['', 'not-a-date', undefined, null]) assert.equal(formatPostDate(date), null);
});

test('dates are identical during server rendering and browser hydration in different timezones', () => {
  const script = `${source};console.log(JSON.stringify(['2026-10-20T00:30:00','Oct 20, 2026','2026-10-20T23:30:00Z'].map(d=>module.exports.formatPostDate(d))));`;
  const outputs = ['UTC', 'Asia/Kolkata', 'America/Los_Angeles'].map(TZ => {
    const result = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', env: { ...process.env, TZ } });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  });
  assert.equal(outputs[0], outputs[1]); assert.equal(outputs[0], outputs[2]);
});

test('read time uses readable labels and missing values are omitted', () => {
  assert.equal(formatReadTime(28), '28 min read');
  assert.equal(formatReadTime('12'), '12 min read');
  assert.equal(formatReadTime(2.4), '3 min read');
  for (const value of [0, -2, NaN, Infinity, undefined, null, '', 'unknown']) assert.equal(formatReadTime(value), null);
});
