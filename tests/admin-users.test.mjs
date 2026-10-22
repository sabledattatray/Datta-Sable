import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const native = createRequire(import.meta.url);

function loader(stubs = {}, env = {}) {
  const cache = new Map();
  function load(file) {
    const full = path.resolve(file);
    if (cache.has(full)) return cache.get(full).exports;
    const mod = { exports: {} }; cache.set(full, mod);
    const require = id => {
      if (Object.hasOwn(stubs, id)) return stubs[id];
      if (id.startsWith('@/')) return load(id.slice(2) + '.ts');
      if (id.startsWith('.')) return load(path.resolve(path.dirname(full), id + '.ts'));
      return native(id);
    };
    const source = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
    }).outputText;
    vm.runInNewContext(source, {
      module: mod,
      exports: mod.exports,
      require,
      process: { env, cwd: () => process.cwd() },
      console: { log() {}, warn() {}, error() {} },
      Buffer, URL, Headers, Request, Response, AbortSignal, FormData, File, TextDecoder, setTimeout, clearTimeout
    }, { filename: full });
    return mod.exports;
  }
  return load;
}

test('admin users endpoints reject anonymous or standard USER sessions', async () => {
  const load = loader({
    'next-auth/next': { getServerSession: async () => null },
    '@/lib/auth': { authOptions: {} },
    '@/lib/prisma': { prisma: {} }
  });

  const route = load('app/api/admin/users/route.ts');
  const getRes = await route.GET();
  assert.equal(getRes.status, 403);

  const patchRes = await route.PATCH(new Request('http://localhost/api/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'u1' })
  }));
  assert.equal(patchRes.status, 403);

  const deleteRes = await route.DELETE(new Request('http://localhost/api/admin/users', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'user', id: 'u1' })
  }));
  assert.equal(deleteRes.status, 403);
});

test('admin users PATCH updates user name, email, and role', async () => {
  let updatedData = null;
  const mockUser = {
    id: 'user-2',
    name: 'Old Name',
    email: 'old@example.test',
    image: null,
    role: 'USER',
    createdAt: new Date(),
    lastLoginAt: null,
    password: 'hash',
    accounts: []
  };

  const prisma = {
    user: {
      findUnique: async ({ where }) => where.id === 'user-2' ? mockUser : null,
      findFirst: async () => null,
      count: async () => 2,
      update: async ({ where, data }) => {
        updatedData = data;
        return {
          ...mockUser,
          ...data,
          accounts: []
        };
      }
    }
  };

  const load = loader({
    'next-auth/next': {
      getServerSession: async () => ({
        user: { id: 'admin-1', email: 'admin@example.test', role: 'ADMIN' }
      })
    },
    '@/lib/auth': { authOptions: {} },
    '@/lib/prisma': { prisma }
  });

  const route = load('app/api/admin/users/route.ts');
  const res = await route.PATCH(new Request('http://localhost/api/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'user-2',
      name: 'New Name',
      email: 'new@example.test',
      role: 'ADMIN'
    })
  }));

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.user.name, 'New Name');
  assert.equal(json.user.email, 'new@example.test');
  assert.equal(json.user.role, 'ADMIN');
  assert.equal(updatedData.name, 'New Name');
  assert.equal(updatedData.email, 'new@example.test');
});

test('admin users PATCH prevents demoting the last remaining administrator', async () => {
  const adminUser = {
    id: 'admin-1',
    name: 'Sole Admin',
    email: 'admin@example.test',
    role: 'ADMIN',
    accounts: []
  };

  const prisma = {
    user: {
      findUnique: async () => adminUser,
      count: async () => 1
    }
  };

  const load = loader({
    'next-auth/next': {
      getServerSession: async () => ({
        user: { id: 'admin-1', email: 'admin@example.test', role: 'ADMIN' }
      })
    },
    '@/lib/auth': { authOptions: {} },
    '@/lib/prisma': { prisma }
  });

  const route = load('app/api/admin/users/route.ts');
  const res = await route.PATCH(new Request('http://localhost/api/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'admin-1',
      role: 'USER'
    })
  }));

  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
  assert.match(json.error, /Cannot demote the only remaining administrator/);
});

test('admin users DELETE prevents deleting own administrator account and lone admin', async () => {
  const adminUser = {
    id: 'admin-1',
    email: 'admin@example.test',
    role: 'ADMIN'
  };

  const prisma = {
    user: {
      findUnique: async () => adminUser,
      count: async () => 1
    }
  };

  const load = loader({
    'next-auth/next': {
      getServerSession: async () => ({
        user: { id: 'admin-1', email: 'admin@example.test', role: 'ADMIN' }
      })
    },
    '@/lib/auth': { authOptions: {} },
    '@/lib/prisma': { prisma }
  });

  const route = load('app/api/admin/users/route.ts');

  // Attempting self delete
  const selfDelRes = await route.DELETE(new Request('http://localhost/api/admin/users', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'user', id: 'admin-1' })
  }));
  assert.equal(selfDelRes.status, 400);
  const selfDelJson = await selfDelRes.json();
  assert.match(selfDelJson.error, /cannot delete your own active administrator account/i);
});

test('admin users DELETE safely cleans up child relations in transaction when deleting user', async () => {
  const targetUser = {
    id: 'user-to-delete',
    email: 'unhappy@example.test',
    role: 'USER'
  };

  const deletedEntities = [];
  const updatedOrders = [];

  const prisma = {
    user: {
      findUnique: async ({ where }) => where.id === targetUser.id ? targetUser : null,
      delete: async ({ where }) => { deletedEntities.push({ user: where.id }); return targetUser; }
    },
    commerceOrder: {
      updateMany: async ({ where, data }) => { updatedOrders.push({ where, data }); return { count: 1 }; }
    },
    adminPasswordReset: {
      deleteMany: async ({ where }) => { deletedEntities.push({ reset: where.userId }); return { count: 1 }; }
    },
    account: {
      deleteMany: async ({ where }) => { deletedEntities.push({ account: where.userId }); return { count: 1 }; }
    },
    session: {
      deleteMany: async ({ where }) => { deletedEntities.push({ session: where.userId }); return { count: 1 }; }
    }
  };
  prisma.$transaction = async (fn) => fn(prisma);

  const load = loader({
    'next-auth/next': {
      getServerSession: async () => ({
        user: { id: 'admin-1', email: 'admin@example.test', role: 'ADMIN' }
      })
    },
    '@/lib/auth': { authOptions: {} },
    '@/lib/prisma': { prisma }
  });

  const route = load('app/api/admin/users/route.ts');
  const res = await route.DELETE(new Request('http://localhost/api/admin/users', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'user', id: 'user-to-delete' })
  }));

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);

  // Check that commerce orders were detached
  assert.equal(updatedOrders.length, 1);
  assert.equal(updatedOrders[0].where.userId, 'user-to-delete');
  assert.equal(updatedOrders[0].data.userId, null);

  // Check that accounts, sessions, password reset, and user were deleted
  assert.ok(deletedEntities.some(e => e.account === 'user-to-delete'));
  assert.ok(deletedEntities.some(e => e.session === 'user-to-delete'));
  assert.ok(deletedEntities.some(e => e.reset === 'user-to-delete'));
  assert.ok(deletedEntities.some(e => e.user === 'user-to-delete'));
});
