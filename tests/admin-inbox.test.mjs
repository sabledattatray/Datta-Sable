import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const record = { id: 'message-1', name: 'Visitor', email: 'visitor@example.com', subject: 'A question & more', message: 'Hello', status: 'UNREAD', createdAt: new Date().toISOString() };

// Exercise the actual component handlers without a browser, real inbox, or database mutations.
function inbox(fetch) {
  const slots = []; let cursor = 0;
  const react = {
    useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }]; },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useEffect() {},
  };
  const jsx = (type, props) => ({ type, props });
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync('app/admin/messages/page.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const mocks = { react, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'lucide-react': {}, '@/components/admin/AdminCommon.module.css': { default: {} } };
  vm.runInNewContext(source, { exports, require: name => { if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`); return mocks[name]; }, fetch, console, Date, encodeURIComponent });
  function render() {
    cursor = 0;
    const nodes = [];
    function walk(node) { if (Array.isArray(node)) return node.forEach(walk); if (!node || typeof node !== 'object') return; nodes.push(node); walk(node.props?.children); }
    walk(exports.default());
    return nodes;
  }
  return { render, async load() { await render().find(node => node.props?.['aria-label'] === 'Refresh messages').props.onClick(); }, message() { return render().find(node => node.type === 'button' && node.props?.['aria-label']?.startsWith('Unread:')); } };
}

test('inbox shows a load failure rather than a successful empty inbox', async () => {
  const app = inbox(async () => ({ ok: false }));
  await app.load();
  assert.ok(app.render().some(node => node.props?.role === 'alert'));
  assert.ok(app.render().some(node => node.props?.children === 'Messages unavailable'));
});

test('failed mark-read keeps unread state and reports the failure', async () => {
  const app = inbox(async (_url, options) => options ? { ok: false } : { ok: true, json: async () => [record] });
  await app.load();
  await app.message().props.onClick();
  assert.ok(app.message(), 'message remains unread');
  assert.ok(app.render().some(node => node.props?.role === 'alert'));
});

test('failed deletion preserves the message; successful deletion removes it only after confirmation', async () => {
  let resolveDelete; let deletes = 0;
  const app = inbox(async (_url, options) => {
    if (options?.method === 'DELETE') { deletes++; return new Promise(resolve => { resolveDelete = resolve; }); }
    return options ? { ok: true } : { ok: true, json: async () => [record] };
  });
  await app.load();
  await app.message().props.onClick();
  const deleteButton = () => app.render().find(node => node.type === 'button' && Array.isArray(node.props?.children) && node.props.children.includes('Delete'));
  const action = deleteButton().props.onClick;
  const first = action();
  await action();
  assert.equal(deletes, 1, 'duplicate deletion is ignored while pending');
  assert.ok(app.render().some(node => node.props?.['aria-label'] === 'A question & more from Visitor'));
  resolveDelete({ ok: false }); await first;
  assert.ok(deleteButton(), 'details stay open after a failed delete');
  assert.ok(app.render().some(node => node.props?.role === 'alert'));
  const second = deleteButton().props.onClick();
  resolveDelete({ ok: true }); await second;
  assert.equal(deleteButton(), undefined);
  assert.ok(app.render().some(node => node.props?.children === 'You’re all caught up'));
});
