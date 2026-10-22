import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const mod={exports:{}};
const compiled=ts.transpileModule(fs.readFileSync('lib/sign-in-path.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}});
vm.runInNewContext(compiled.outputText,{module:mod,exports:mod.exports,URL});
const {signInReturnPath}=mod.exports;
test('sign-in returns to the original local page including query and fragment',()=>{
 assert.equal(signInReturnPath('/blog?category=fabric#articles','http://localhost:3000'),'/blog?category=fabric#articles');
 assert.equal(signInReturnPath('http://localhost:3000/account/orders/123','http://localhost:3000'),'/account/orders/123');
});
test('sign-in rejects external destinations and loops back to the sign-in page',()=>{
 for(const value of ['https://example.test/','//example.test/','javascript:alert(1)','/\\example.test','/sign-in?callbackUrl=/blog',undefined])assert.equal(signInReturnPath(value,'http://localhost:3000'),'/');
});
