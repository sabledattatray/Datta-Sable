import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';
const native = createRequire(import.meta.url);
function load(file, deps) {
 const mod={exports:{}};
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}});
 vm.runInNewContext(compiled.outputText,{module:mod,exports:mod.exports,require:id=>id in deps?deps[id]:native(id),process:{env:{NEXTAUTH_SECRET:'test-recovery-secret'}},Buffer,Date,URL,console:{error(){}}});
 return mod.exports;
}
const policy=load('lib/admin/password-policy.ts',{});
function harness(options={}) {
 const user={id:'admin1',email:'admin@example.test',password:'old-hash',role:options.role||'ADMIN',sessionVersion:0};
 let reset=null, chain=Promise.resolve();const sent=[];
 const matches=(row,where)=>row&&Object.entries(where).every(([key,value])=>value&&typeof value==='object'&&'gt'in value?row[key]>value.gt:row[key]===value);
 const update=(row,data)=>{for(const [key,val]of Object.entries(data))row[key]=val&&typeof val==='object'&&'increment'in val?row[key]+val.increment:val;return structuredClone(row);};
 const prisma={user:{
  findFirst:async({where})=>where.role===user.role&&where.email.equals===user.email?structuredClone(user):null,
  findUnique:async()=>structuredClone(user),
  updateMany:async({where,data})=>matches(user,where)?(update(user,data),{count:1}):{count:0},
 },adminPasswordReset:{
  findUnique:async()=>structuredClone(reset),
  upsert:async({create,update:data})=>{reset=reset?{...reset,...data}:structuredClone(create);return structuredClone(reset);},
  updateMany:async({where,data})=>matches(reset,where)?(update(reset,data),{count:1}):{count:0},
  update:async({data})=>update(reset,data),
 }};
 prisma.$transaction=fn=>{const run=chain.then(async()=>{const before=structuredClone({user,reset});try{return await fn(prisma);}catch(error){Object.assign(user,before.user);reset=before.reset;throw error;}});chain=run.catch(()=>{});return run;};
 const deps={
  '@/lib/prisma':{prisma},
  '@/lib/email-delivery':{emailConfiguration:()=>({configured:!options.unconfigured}),sendEmail:async message=>{if(options.mailFails)throw Error('Provider failed');sent.push(message);}},
  '@/lib/security':{logAudit:async()=>{},rateLimit:()=>true},
  bcrypt:{hash:async password=>`hashed:${password}`,compare:async password=>password==='current-password'},
 };
 const recovery=load('lib/admin/password-recovery.ts',deps);
 const actions=load('app/admin/settings/actions.ts',{...deps,'next-auth':{getServerSession:async()=>({user:{id:user.id,role:'ADMIN'}})},'@/lib/auth':{authOptions:{}},'@/lib/admin/password-policy':policy});
 return{...recovery,...actions,user,sent,get reset(){return reset;},code:()=>sent.at(-1).text.match(/code is (\d{6})/)[1]};
}
const password='a-new-long-password';
test('recovery endpoint validates origin and input and returns safe errors',async()=>{
 let requested=0;
 const route=load('app/api/auth/admin-password/route.ts',{
  'next/server':{NextResponse:{json:(body,init)=>({body,...init})}},
  '@/lib/admin/password-policy':policy,
  '@/lib/admin/password-recovery':{RESET_MESSAGE:'Generic response',requestAdminPasswordReset:async()=>{requested++;},resetAdminPassword:async()=>({error:'Invalid code'})},
  '@/lib/security':{rateLimit:()=>true},
 });
 const request=(body,origin='https://example.test')=>({url:'https://example.test/api/auth/admin-password',headers:{get:key=>key==='origin'?origin:null},json:async()=>body});
 assert.equal((await route.POST(request({action:'request',email:'admin@example.test'},'https://other.test'))).status,403);
 assert.equal((await route.POST(request({action:'request',email:'invalid'}))).status,400);assert.equal(requested,0);
 const response=await route.POST(request({action:'request',email:'admin@example.test'}));assert.equal(response.status,200);assert.equal(response.body.success,'Generic response');assert.equal(response.headers['Cache-Control'],'no-store');
 assert.equal((await route.POST(request({action:'reset',email:'admin@example.test',code:'000000',newPassword:password,confirmPassword:password}))).status,400);
});
test('password policy rejects malformed input, short, mismatched and bcrypt-truncated passwords',()=>{
 assert.equal(policy.passwordChangeInput.safeParse(null).success,false);
 assert.equal(policy.adminPassword.safeParse('short').success,false);
 assert.equal(policy.adminPassword.safeParse('é'.repeat(37)).success,false);
 assert.equal(policy.resetPasswordInput.safeParse({email:'admin@example.test',code:'123456',newPassword:password,confirmPassword:'different'}).success,false);
});
test('OTP is hashed, expires, is admin-only and cannot be resent immediately',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);assert.equal(h.sent.length,1);
 assert.ok(!h.reset.codeHash.includes(h.code()));assert.match(h.reset.codeHash,/^[a-f0-9]{64}$/);
 assert.ok(h.reset.expiresAt>Date.now());await h.requestAdminPasswordReset(h.user.email);assert.equal(h.sent.length,1);
 const ordinary=harness({role:'USER'});await ordinary.requestAdminPasswordReset(ordinary.user.email);assert.equal(ordinary.sent.length,0);
 await h.requestAdminPasswordReset('unknown@example.test');assert.equal(h.sent.length,1);
});
test('correct OTP resets password once and revokes prior sessions',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);const code=h.code();
 assert.ok((await h.resetAdminPassword(h.user.email,code,password)).success);
 assert.equal(h.user.password,`hashed:${password}`);assert.equal(h.user.sessionVersion,1);assert.ok(h.user.emailVerified);
 assert.ok((await h.resetAdminPassword(h.user.email,code,password)).error);
});
test('resending invalidates earlier codes and durable request limits cap hourly emails',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);const first=h.code();
 for(let i=0;i<4;i++){h.reset.requestedAt=new Date(Date.now()-61000);await h.requestAdminPasswordReset(h.user.email);}
 assert.equal(h.sent.length,5);h.reset.requestedAt=new Date(Date.now()-61000);await h.requestAdminPasswordReset(h.user.email);assert.equal(h.sent.length,5);
 if(first!==h.code())assert.ok((await h.resetAdminPassword(h.user.email,first,password)).error);
});
test('five wrong OTP attempts invalidate the challenge across requests',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);
 for(let i=0;i<5;i++)assert.ok((await h.resetAdminPassword(h.user.email,'000000',password)).error);
 assert.ok((await h.resetAdminPassword(h.user.email,h.code(),password)).error);assert.equal(h.user.password,'old-hash');
});
test('expired and undelivered OTPs cannot reset the password',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);h.reset.expiresAt=new Date(0);
 assert.ok((await h.resetAdminPassword(h.user.email,h.code(),password)).error);
 const failed=harness({mailFails:true});await failed.requestAdminPasswordReset(failed.user.email);assert.ok(failed.reset.expiresAt<=new Date());
 await assert.rejects(()=>harness({unconfigured:true}).requestAdminPasswordReset('admin@example.test'));
});
test('simultaneous correct OTP submissions only update the password once',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);const code=h.code();
 const results=await Promise.all([h.resetAdminPassword(h.user.email,code,password),h.resetAdminPassword(h.user.email,code,password)]);
 assert.equal(results.filter(r=>r.success).length,1);assert.equal(h.user.sessionVersion,1);
});
test('password change verifies current password, checks role and invalidates pending recovery',async()=>{
 const h=harness();await h.requestAdminPasswordReset(h.user.email);
 const input={currentPassword:'wrong',newPassword:password,confirmPassword:password};
 assert.ok((await h.updateAdminPassword(input)).error);assert.equal(h.user.password,'old-hash');
 assert.ok((await h.updateAdminPassword({...input,currentPassword:'current-password'})).success);
 assert.equal(h.user.sessionVersion,1);assert.equal(h.reset.attempts,5);
 const nonAdmin=harness({role:'USER'});assert.ok((await nonAdmin.updateAdminPassword({...input,currentPassword:'current-password'})).error);
});
test('recovery migration adds only versioning and the reset table and preserves existing users',async()=>{
 const db=new PGlite();try{
 await db.exec('CREATE TABLE "User" ("id" TEXT PRIMARY KEY, "email" TEXT); INSERT INTO "User" VALUES (\'existing\', \'admin@example.test\');');
 await db.exec(fs.readFileSync('prisma/migrations/20261022090000_admin_password_recovery/migration.sql','utf8'));
 const rows=await db.query('SELECT "id", "sessionVersion" FROM "User"');assert.equal(rows.rows[0].id,'existing');assert.equal(rows.rows[0].sessionVersion,0);
 await db.query('INSERT INTO "AdminPasswordReset" ("userId","codeHash","nonce","expiresAt") VALUES ($1,$2,$3,NOW())',['existing','hash','nonce']);
 await db.exec('DELETE FROM "User" WHERE "id"=\'existing\'');assert.equal((await db.query('SELECT * FROM "AdminPasswordReset"')).rows.length,0);
 }finally{await db.close();}
});

