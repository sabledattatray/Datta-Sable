import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const native = createRequire(import.meta.url);
function load(file, overrides) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, require: name => name in overrides ? overrides[name] : native(name), console, Date, Map, Promise });
  return exports;
}
function database({ fail = [], hourly = [] } = {}) {
  const calls = [];
  const operation = (name, result) => async args => { calls.push({ name, args }); if(fail.includes(name)) throw new Error('unavailable'); return result; };
  return { calls, prisma: {
    post: { count: operation('post.count',0), groupBy: operation('post.groupBy',[]), findMany: operation('post.findMany',[]) },
    project: { count: operation('project.count',0) }, user: { count: operation('user.count',0) }, subscriber: { count: operation('subscriber.count',0) },
    contactMessage: { count: operation('contactMessage.count',0) }, pageView: { count: operation('pageView.count',0) },
    auditLog: { findMany: operation('auditLog.findMany',[]) }, $queryRaw: operation('hourly',hourly),
  } };
}

test('navigation chooses one deepest route and respects path boundaries', () => {
  const { activeAdminDestination, adminDestinations } = load('components/admin/navigation.ts',{});
  assert.equal(activeAdminDestination('/admin/orders/transactions').label,'Transactions');
  assert.equal(activeAdminDestination('/admin/users/roles').label,'Roles & permissions');
  assert.equal(activeAdminDestination('/admin/settings/typography').label,'Website typography');
  assert.equal(activeAdminDestination('/admin/products-other'),undefined);
  assert.equal(new Set(adminDestinations.map(d=>d.href)).size,adminDestinations.length);
});

test('an empty database remains zero with a complete 24-hour traffic series',async()=>{
  const db=database(); const { getAdminOverview }=load('lib/admin/overview.ts',{'@/lib/prisma':db});
  const result=await getAdminOverview();
  assert.equal(result.availableSources,12); assert.equal(result.sourceCount,12);
  assert.ok(Object.values(result.counts).every(value=>value===0));
  assert.equal(result.traffic.length,24); assert.ok(result.traffic.every(p=>p.count===0));
  assert.equal(new Date(result.traffic[23].at)-new Date(result.traffic[0].at),23*3600000);
});

test('unavailable sources stay null without erasing successful sources',async()=>{
  const db=database({fail:['user.count','hourly']});
  const result=await load('lib/admin/overview.ts',{'@/lib/prisma':db}).getAdminOverview();
  assert.equal(result.availableSources,10);assert.equal(result.counts.users,null);assert.equal(result.traffic,null);assert.equal(result.counts.published,0);
});

test('hourly bigint counts serialize safely and audit reads exclude personal details',async()=>{
  const at=new Date();at.setUTCMinutes(0,0,0);
  const db=database({hourly:[{hour:at,count:7n}]});
  const result=await load('lib/admin/overview.ts',{'@/lib/prisma':db}).getAdminOverview();
  assert.equal(result.traffic.at(-1).count,7);assert.doesNotThrow(()=>JSON.stringify(result));
  const audit=db.calls.find(call=>call.name==='auditLog.findMany');
  assert.equal(audit.args.select.details,undefined);assert.equal(audit.args.select.ipAddress,undefined);assert.equal(audit.args.select.userId,undefined);
  assert.equal(audit.args.take,5);
});

for (const session of [null,{user:{role:'USER'}}]) test(`overview API denies ${session ? 'non-admin' : 'anonymous'} access before querying`,async()=>{
  let queried=false;
  const route=load('app/api/admin/overview/route.ts',{'next-auth':{getServerSession:async()=>session},'@/lib/auth':{authOptions:{}},'@/lib/admin/overview':{getAdminOverview:async()=>{queried=true;}}});
  const response=await route.GET();assert.equal(response.status,401);assert.equal(queried,false);assert.equal(response.headers.get('Cache-Control'),'private, no-store');
});

test('overview API sends private no-store responses for authorized admins',async()=>{
  const route=load('app/api/admin/overview/route.ts',{'next-auth':{getServerSession:async()=>({user:{role:'ADMIN'}})},'@/lib/auth':{authOptions:{}},'@/lib/admin/overview':{getAdminOverview:async()=>({counts:{users:0}})}});
  const response=await route.GET();assert.equal(response.status,200);assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow');assert.deepEqual(await response.json(),{counts:{users:0}});
});

test('overview API failures return a safe unavailable response',async()=>{
  const route=load('app/api/admin/overview/route.ts',{'next-auth':{getServerSession:async()=>({user:{role:'ADMIN'}})},'@/lib/auth':{authOptions:{}},'@/lib/admin/overview':{getAdminOverview:async()=>{throw new Error('private connection string');}}});
  const response=await route.GET();assert.equal(response.status,503);assert.equal((await response.text()).includes('private connection'),false);
});
