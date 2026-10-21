import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(window) {
  const exports = {};
  const source = fs.readFileSync(new URL('../lib/browser-storage.ts', import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, window });
  return exports;
}

test('blocked storage getter falls back without throwing', () => {
  const window = Object.defineProperty({}, 'localStorage', { get() { throw new DOMException('Access denied', 'SecurityError'); } });
  const storage = load(window);
  assert.equal(storage.readLocalStorage('company_name'), null);
  assert.doesNotThrow(() => storage.writeLocalStorage('admin_sidebar_collapsed', 'true'));
});

test('storage methods may also reject access or writes', () => {
  const storage = load({ localStorage: {
    getItem() { throw new Error('Unavailable'); },
    setItem() { throw new Error('Quota exceeded'); },
  } });
  assert.equal(storage.readLocalStorage('admin_typography'), null);
  assert.doesNotThrow(() => storage.writeLocalStorage('company_name', 'Example'));
});

test('normal storage persists preferences and server rendering needs no window', () => {
  const values = new Map();
  const storage = load({ localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } });
  storage.writeLocalStorage('company_name', 'Example');
  assert.equal(storage.readLocalStorage('company_name'), 'Example');
  assert.equal(storage.readLocalStorage('missing'), null);
  const server = load(undefined);
  assert.equal(server.readLocalStorage('company_name'), null);
  assert.doesNotThrow(() => server.writeLocalStorage('company_name', 'Example'));
});
