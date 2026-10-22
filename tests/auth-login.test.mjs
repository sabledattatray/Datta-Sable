import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function auth({ auditFails = false, userFails = false } = {}) {
  const mod = { exports: {} };
  const provider = { default: () => ({}) };
  const deps = {
    'next-auth/providers/github': provider,
    'next-auth/providers/linkedin': provider,
    'next-auth/providers/google': provider,
    'next-auth/providers/credentials': provider,
    '@/lib/prisma': { prisma: {
      user: {
        findUnique: async () => ({ id: 'admin-1', role: 'ADMIN' }),
        upsert: async () => {
          if (userFails) throw Error('User database unavailable');
          return { id: 'admin-1', role: 'ADMIN' };
        },
      },
      auditLog: { create: async () => { if (auditFails) throw Error('Audit unavailable'); } },
    } },
    bcrypt: {},
    './mail': { sendWelcomeEmail: async () => {} },
    './security': { rateLimit: () => true },
  };
  const compiled = ts.transpileModule(fs.readFileSync('lib/auth.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  vm.runInNewContext(compiled.outputText, {
    module: mod, exports: mod.exports,
    require: id => { assert.ok(id in deps, id); return deps[id]; },
    process: { env: {} }, console: { error() {} },
  });
  return mod.exports.authOptions;
}

test('audit logging failure preserves authenticated admin identity and role', async () => {
  const options = auth({ auditFails: true });
  const token = await options.callbacks.jwt({ token: {}, user: { email: 'admin@example.test' } });
  assert.equal(token.id, 'admin-1');
  assert.equal(token.role, 'ADMIN');
  const session = await options.callbacks.session({ session: { user: {} }, token });
  assert.equal(session.user.role, 'ADMIN');
});

test('user persistence failure still fails closed without admin privileges', async () => {
  const token = await auth({ userFails: true }).callbacks.jwt({ token: {}, user: { email: 'admin@example.test' } });
  assert.equal(token.id, undefined);
  assert.equal(token.role, 'USER');
});
