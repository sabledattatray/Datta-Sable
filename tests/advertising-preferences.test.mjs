import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('advertising preferences wait for the CMP and reopen its consent flow without granting consent', () => {
  let ready = false;
  let effect;
  const window = {};
  const mod = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('components/AdvertisingPreferencesButton.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { window, module: mod, exports: mod.exports, require: id => {
    if (id === 'react') return { useState: () => [ready, value => { ready = value; }], useEffect: callback => { effect = callback; } };
    if (id === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
    throw Error('Unexpected dependency: ' + id);
  } });
  const render = mod.exports.default;
  assert.equal(render(), null);
  const cleanup = effect();
  const callback = window.googlefc.callbackQueue[0].CONSENT_API_READY;
  callback();
  assert.equal(ready, false, 'Do not expose an inoperative control');
  let revocations = 0;
  window.googlefc.showRevocationMessage = () => { revocations++; };
  callback();
  const button = render();
  assert.equal(button.props.children, 'Advertising privacy choices');
  button.props.onClick();
  assert.equal(revocations, 1);
  assert.equal(window.dataLayer, undefined, 'Reopening choices must not grant Google consent');
  cleanup(); ready = false; callback();
  assert.equal(ready, false, 'Ignore readiness after unmount');
});
