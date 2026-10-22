import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

const native = createRequire(import.meta.url);

function load(file, deps) {
  const mod = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 }
  });
  vm.runInNewContext(compiled.outputText, {
    module: mod,
    exports: mod.exports,
    require: id => id in deps ? deps[id] : native(id),
    process: { env: {} },
    Buffer,
    Date,
    URL,
    console: { error() {} }
  });
  return mod.exports;
}

test('registration endpoint rejects missing or short inputs', async () => {
  let createdUser = null;
  const deps = {
    '@/lib/security': { rateLimit: () => true },
    'next/server': {
      NextResponse: {
        json: (data, init) => ({ data, status: init?.status || 200 })
      }
    },
    bcrypt: { hash: async p => `hashed:${p}` },
    '@/lib/prisma': {
      prisma: {
        user: {
          findFirst: async () => null,
          create: async ({ data }) => { createdUser = data; return { id: 'user-1', ...data }; }
        }
      }
    },
    '@/lib/tokens': { generateVerificationToken: async email => ({ identifier: email, token: 'tok-123' }) },
    '@/lib/mail': { sendVerificationEmail: async () => {} }
  };

  const route = load('app/api/auth/register/route.ts', deps);

  // Short password (< 8 chars)
  const res1 = await route.POST(new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName: 'Datta', lastName: 'Sable', email: 'user@example.test', password: '123' })
  }));
  assert.equal(res1.status, 400);

  // Missing names
  const res2 = await route.POST(new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName: '', lastName: '', email: 'user@example.test', password: 'password123' })
  }));
  assert.equal(res2.status, 400);

  // Invalid email
  const res3 = await route.POST(new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName: 'Datta', lastName: 'Sable', email: 'not-an-email', password: 'password123' })
  }));
  assert.equal(res3.status, 400);

  // Valid registration creates user with lowercase email and hashedPassword
  const res4 = await route.POST(new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName: 'Datta', lastName: 'Sable', email: 'User@Example.Test', password: 'password123' })
  }));
  assert.equal(res4.status, 200);
  assert.equal(createdUser.email, 'user@example.test');
  assert.equal(createdUser.name, 'Datta Sable');
  assert.equal(createdUser.password, 'hashed:password123');
  assert.equal(createdUser.role, 'USER');
});
