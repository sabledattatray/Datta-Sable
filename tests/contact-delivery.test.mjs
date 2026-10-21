import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

function route(create, audit = async () => {}) {
  const mod = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync('app/api/contact/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const dependencies = {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options.status }) } },
    '@/lib/prisma': { prisma: { contactMessage: { create } } },
    zod: { z },
    '@/lib/security': { rateLimit: () => true, logAudit: audit },
  };
  vm.runInNewContext(compiled.outputText, { module: mod, exports: mod.exports, require: id => {
    assert.ok(id in dependencies, 'Unexpected contact dependency: ' + id);
    return dependencies[id];
  } });
  return mod.exports;
}
const request = body => ({ headers: { get: () => null }, json: async () => body });
const valid = { name: 'Example visitor', email: 'visitor@example.com', message: 'A test question.' };

test('contact storage failure returns an actionable failure rather than false success', async () => {
  const response = await route(async () => { throw Error('Database unavailable'); }).POST(request(valid));
  assert.equal(response.status, 503);
  assert.match(response.body.message, /could not be saved/);
  assert.match(response.body.message, /info@dattasable.com/);
});
test('durably saved contact remains successful if secondary audit logging fails', async () => {
  let saves = 0;
  const response = await route(async () => { saves++; return { id: 'saved-1' }; }, async () => { throw Error('Audit unavailable'); }).POST(request(valid));
  assert.equal(saves, 1);
  assert.equal(response.status, 201);
  assert.equal(response.body.id, 'saved-1');
});
test('invalid contact input is rejected before attempting storage', async () => {
  const response = await route(async () => { assert.fail('Must not store invalid input'); }).POST(request({ ...valid, email: 'invalid' }));
  assert.equal(response.status, 400);
});
