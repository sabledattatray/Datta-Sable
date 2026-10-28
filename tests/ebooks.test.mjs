import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';
const native=createRequire(import.meta.url);
function load(file,mocks={},env={}){
 const cache=new Map();
 function read(path){if(cache.has(path))return cache.get(path);const output={};cache.set(path,output);const source=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const require=id=>{if(id in mocks)return mocks[id];if(id.startsWith('@/'))return read(id.slice(2)+'.ts');if(id.startsWith('.'))return read(new URL(id+'.ts','file:///'+path.replaceAll('\\','/')).pathname.slice(1));return native(id);};
 vm.runInNewContext(source,{exports:output,require,process:{env},console,Buffer,URL,Request,Response,Date,setTimeout,clearTimeout,structuredClone,File});return output;}
 return read(file);
}
test('first eBook is an unapproved INR 99 draft without cover, PDF or invented bundled files',()=>{
 const {firstBook,firstProfile}=load('lib/ebooks/validation.ts');assert.equal(firstBook.priceMinor,9900);assert.equal(firstBook.currency,'INR');assert.equal(firstBook.status,'DRAFT');assert.equal(firstBook.salesEnabled,false);assert.equal(firstBook.deliveryReady,false);assert.equal(firstProfile.approved,false);assert.equal(firstProfile.pageCount,33);assert.equal(firstBook.image,undefined);assert.equal(firstBook.includedResources.length,1);assert.equal(firstProfile.notIncluded.length,3);
});
test('profile and taxonomy input reject invalid pages, prices, slugs and empty approval metadata',()=>{
 const {profileInput,categoryInput,firstProfile}=load('lib/ebooks/validation.ts');for(const pageCount of [0,-1,1.2,10001])assert.equal(profileInput.safeParse({...firstProfile,pageCount}).success,false);assert.equal(profileInput.safeParse({...firstProfile,sku:''}).success,false);assert.equal(categoryInput.safeParse({slug:'../private',name:'Test',description:'',sortOrder:0,published:true}).success,false);
});
test('guest and download tokens are cryptographically random with only SHA-256 hashes persisted',()=>{
 const {newToken,tokenHash}=load('lib/ebooks/tokens.ts');const a=newToken(),b=newToken();assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);assert.notEqual(tokenHash(a),a);assert.equal(tokenHash(a),native('node:crypto').createHash('sha256').update(a).digest('hex'));
});
test('eBook checkout blocks flag-off, live credentials, missing approvals, missing cover and wrong-version assets',async()=>{
 const valid={approved:true,version:'1',product:{image:'/cover.webp',currency:'INR',resources:[{asset:{version:'1'}}]}};
 for(const [env,row] of [[{},valid],[{EBOOK_STORE_ENABLED:'true',RAZORPAY_KEY_ID:'rzp_live_x'},valid],[{EBOOK_STORE_ENABLED:'true',RAZORPAY_KEY_ID:'rzp_test_x'},{...valid,approved:false}],[{EBOOK_STORE_ENABLED:'true',RAZORPAY_KEY_ID:'rzp_test_x'},{...valid,product:{...valid.product,image:null}}],[{EBOOK_STORE_ENABLED:'true',RAZORPAY_KEY_ID:'rzp_test_x'},{...valid,product:{...valid.product,resources:[{asset:{version:'old'}}]}}]]){
 const service=load('lib/ebooks/service.ts',{'@/lib/prisma':{prisma:{ebookProfile:{findUnique:async()=>row}}},'@/lib/commerce/payments':{}},env);await assert.rejects(service.assertEbookSale('book'));
 }
 const service=load('lib/ebooks/service.ts',{'@/lib/prisma':{prisma:{ebookProfile:{findUnique:async()=>valid}}},'@/lib/commerce/payments':{}},{EBOOK_STORE_ENABLED:'true',RAZORPAY_KEY_ID:'rzp_test_x'});await service.assertEbookSale('book');
});
test('guest link consumption is single-use, expires, creates hashed session and rejects replay',async()=>{
 let consumed=false,session;const crypto=load('lib/ebooks/tokens.ts'),raw=crypto.newToken();
 const tx={ebookAccessToken:{findUnique:async()=>({hash:crypto.tokenHash(raw),kind:'LINK',email:'reader@example.test',expiresAt:new Date(Date.now()+60000),consumedAt:consumed?new Date():null}),updateMany:async()=>{if(consumed)return{count:0};consumed=true;return{count:1};},create:async({data})=>{session=data;}}};
 const access=load('lib/ebooks/access.ts',{'next/headers':{},'next-auth':{},'@/lib/auth':{},'@/lib/prisma':{prisma:{$transaction:work=>work(tx)}}});
 const cookie=await access.createSession(raw);assert.equal(session.kind,'SESSION');assert.equal(session.hash,crypto.tokenHash(cookie));assert.notEqual(session.hash,cookie);await assert.rejects(access.createSession(raw));await assert.rejects(access.createSession('forged'));
});
test('expired magic link cannot create a session',async()=>{
 const access=load('lib/ebooks/access.ts',{'next/headers':{},'next-auth':{},'@/lib/auth':{},'@/lib/prisma':{prisma:{$transaction:work=>work({ebookAccessToken:{findUnique:async()=>({kind:'LINK',expiresAt:new Date(0)})}})}}});await assert.rejects(access.createSession('a'.repeat(64)));
});
test('catalog performs bounded pagination and combines public visibility with search',async()=>{
 const calls=[];const prisma={commerceProduct:{findMany:async args=>{calls.push(args);return[];},count:async()=>0},ebookCategory:{findMany:async()=>[]}};const {catalog}=load('lib/ebooks/catalog.ts',{'@/lib/prisma':{prisma}});await catalog({q:' BI ',category:'power-bi-dax',sort:'price-asc',page:'2'});assert.equal(calls[0].take,12);assert.equal(calls[0].skip,12);assert.equal(calls[0].where.AND[0].OR[0].status,'PUBLISHED');assert.equal(calls[0].where.AND[1].OR[0].title.contains,'BI');assert.equal(calls[0].where.AND[0].OR[1].status,'DRAFT');assert.deepEqual(Array.from(calls[0].where.AND[0].OR[1].slug.in),['power-bi-real-world-projects-2026','power-bi-mastery-2026','digital-marketing-playbook-2026']);assert.equal(calls[0].where.ebook.is.categories.some.category.slug,'power-bi-dax');assert.equal(calls[0].orderBy[0].priceMinor,'asc');
});
test('private eBook paths and bearer tokens never enter visit analytics',()=>{
 const {analyticsPath}=load('lib/analytics-url.ts');for(const route of ['/ebooks/library','/ebooks/access','/ebooks/download/access','/ebooks/download/secret','/ebooks/order/secret'])assert.equal(analyticsPath(route),null);assert.equal(analyticsPath('/ebooks/power-bi-real-world-projects-2026?utm_source=linkedin'),'/ebooks/power-bi-real-world-projects-2026');
});
test('additive eBook migration preserves existing commerce and enforces relational/hash uniqueness',async()=>{
 const db=new PGlite();try{
 for(const dir of fs.readdirSync('prisma/migrations').filter(s=>s.startsWith('20')).sort())await db.exec(fs.readFileSync(`prisma/migrations/${dir}/migration.sql`,'utf8'));
 await db.exec(`INSERT INTO "CommerceProduct"(id,slug,title,excerpt,description,category,"priceMinor",currency,features,"includedResources","updatedAt") VALUES('book','book','Book','Excerpt','Description','BI',9900,'INR','{}','{}',NOW()); INSERT INTO "EbookProfile"("productId",sku,edition,"pageCount",contents,outcomes,audience,prerequisites,"notIncluded") VALUES('book','SKU','2026',33,'{}','{}','{}','{}','{}'); INSERT INTO "EbookCategory"(id,slug,name) VALUES('bi','power-bi-dax','Power BI & DAX'); INSERT INTO "EbookCategoryLink"("productId","categoryId","isPrimary") VALUES('book','bi',true);`);
 assert.equal((await db.query(`SELECT "priceMinor",status FROM "CommerceProduct" WHERE id='book'`)).rows[0].priceMinor,9900);assert.equal((await db.query(`SELECT approved FROM "EbookProfile"`)).rows[0].approved,false);
 await assert.rejects(db.exec(`DELETE FROM "EbookCategory" WHERE id='bi'`));await assert.rejects(db.exec(`INSERT INTO "EbookCategoryLink"("productId","categoryId") VALUES('book','bi')`));
 await db.exec(`INSERT INTO "EbookAccessToken"(hash,email,kind,"expiresAt") VALUES('${'a'.repeat(64)}','reader@example.test','LINK',NOW()+INTERVAL '30 minutes')`);await assert.rejects(db.exec(`INSERT INTO "EbookAccessToken"(hash,email,kind,"expiresAt") VALUES('${'a'.repeat(64)}','reader@example.test','LINK',NOW())`));
 assert.equal((await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name='CommerceOrderItem' AND column_name='resourceIdSnapshot'`)).rows.length,1);
 }finally{await db.close();}
});

function routeHarness(options={}){
 let signed=0,audits=0;
 const shared=load('lib/commerce/shared.ts');
 const resource={id:'pdf-original',active:false,pathname:'products/book/original.pdf',asset:{version:'1'}};
 const grant={hash:'a'.repeat(64),revokedAt:null,expiresAt:new Date(Date.now()+60000),usedCount:0,maxUses:3,entitlement:{status:'ACTIVE',productId:'book',order:{status:'PAID',userId:null,customerEmail:'reader@example.test',items:[{productId:'book',resourceIdSnapshot:'pdf-original'}]},product:{deliveryReady:true,resources:[resource]}}};
 options.mutate?.(grant);
 const prisma={ebookDownloadGrant:{findUnique:async()=>options.missing?null:grant,updateMany:async()=>({count:options.race?0:1})},commerceDownload:{create:async()=>{audits++;}}};
 const mocks={
  '@vercel/blob':{head:async()=>{},put:async()=>{},issueSignedToken:async()=>{signed++;return'signed';},presignUrl:async()=>({presignedUrl:'https://private.example.test/signed'})},
  '@/lib/prisma':{prisma},'@/lib/security':{logAudit:async()=>{}},'@/lib/commerce/shared':shared,'./shared':shared,
  '@/lib/commerce/access':{customer:async()=>{throw new shared.CommerceError('Anonymous',401);},sameOrigin:req=>{if(req.headers.get('origin')!==new URL(req.url).origin)throw new shared.CommerceError('Invalid origin',403);},workerAuth:()=>{throw new shared.CommerceError('Unauthorized',401);}},
  '@/lib/commerce/payments':{},'@/lib/commerce/config':{},'@/lib/commerce/jobs':{},'@/lib/ebooks/service':{},'@/lib/ebooks/access':{},'@/lib/ebooks/notifications':{},
 };
 const route=load('app/api/ebooks/[...path]/route.ts',mocks,{EBOOK_STORE_ENABLED:'true',COMMERCE_BLOB_READ_WRITE_TOKEN:'private-test-fixture'});
 const post=(path,body,origin='https://dattasable.test')=>route.POST(new Request(`https://dattasable.test/api/ebooks/${path}`,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)}),{params:Promise.resolve({path:path.split('/')})});
 return{post,grant,get signed(){return signed;},get audits(){return audits;}};
}
test('download API signs only a paid, active entitlement and its immutable purchased asset',async()=>{
 const h=routeHarness();const result=await h.post('download',{token:'a'.repeat(64)});assert.equal(result.status,200);assert.equal(h.signed,1);assert.equal(h.audits,1);assert.equal(result.headers.get('cache-control'),'private, no-store');assert.equal(result.headers.get('referrer-policy'),'no-referrer');assert.equal((await result.json()).url,'https://private.example.test/signed');
});
test('expired, revoked, exhausted, refunded and missing download grants never issue signed URLs',async()=>{
 const cases=[{missing:true},{mutate:g=>g.expiresAt=new Date(0)},{mutate:g=>g.revokedAt=new Date()},{mutate:g=>g.usedCount=3},{mutate:g=>g.entitlement.status='REVOKED'},{mutate:g=>g.entitlement.order.status='REFUNDED'},{mutate:g=>g.entitlement.product.deliveryReady=false},{race:true},{mutate:g=>g.entitlement.order.items[0].resourceIdSnapshot='different-file'}];
 for(const options of cases){const h=routeHarness(options);const result=await h.post('download',{token:'a'.repeat(64)});assert.notEqual(result.status,200);assert.equal(h.signed,0);assert.equal(h.audits,0);}
});
test('download API rejects cross-origin and malformed bearer-token requests',async()=>{
 const h=routeHarness();assert.equal((await h.post('download',{token:'a'.repeat(64)},'https://attacker.test')).status,403);assert.equal((await h.post('download',{token:'../private'})).status,410);assert.equal(h.signed,0);
});
test('eBook admin mutations deny anonymous access before touching catalog data',async()=>{const h=routeHarness();assert.equal((await h.post('admin',{action:'seed'})).status,401);});
test('owner import has eight real-cover INR 99 records without promising missing companion files',()=>{
 const records=JSON.parse(fs.readFileSync('content/ebooks/import-catalog.json','utf8'));const {profileInput}=load('lib/ebooks/validation.ts');const {productInput}=load('lib/commerce/shared.ts');assert.equal(records.length,8);
 for(const record of records){productInput.parse(record.product);profileInput.parse(record.profile);assert.equal(record.product.priceMinor,9900);assert.equal(record.product.status,'DRAFT');assert.equal(record.product.salesEnabled,false);assert.equal(record.profile.approved,false);assert.ok(record.product.image.startsWith('/images/ebooks/') || new URL(record.product.image).hostname.endsWith('.public.blob.vercel-storage.com'));assert.ok(fs.existsSync('public/images/ebooks/'+record.product.slug+'.png'));assert.match(record.asset.sha256,/^[a-f0-9]{64}$/);assert.equal(record.product.includedResources.length,1);}
 const mastery=records.find(r=>r.product.slug==='power-bi-mastery-2026');assert.equal(mastery.profile.pageCount,16);assert.match(mastery.reviewNotes[0],/not supplied/);
});
test('development draft catalog cannot load into production',async()=>{const {localBooks}=load('lib/ebooks/local-catalog.ts',{}, {NODE_ENV:'production'});assert.equal((await localBooks()).length,0);});
test('live eBook approval still refuses missing private delivery or live webhook setup',async()=>{
 const valid={approved:true,version:'1',product:{image:'/cover.png',currency:'INR',resources:[{asset:{version:'1'}}]}};
 const service=load('lib/ebooks/service.ts',{'@/lib/prisma':{prisma:{ebookProfile:{findUnique:async()=>valid}}},'@/lib/commerce/payments':{}},{EBOOK_STORE_ENABLED:'true',EBOOK_PAYMENT_MODE:'live',EBOOK_LIVE_CHECKOUT_APPROVED:'true'});await assert.rejects(service.assertEbookSale('book'));
});

test('active commerce webhook satisfies live readiness only with explicit opt-in and live keys',()=>{
 const base={EBOOK_USE_ACTIVE_LIVE_WEBHOOK:'true',RAZORPAY_WEBHOOK_SECRET:'existing-secret'};
 for(const env of [base,{...base,RAZORPAY_KEY_ID:'rzp_test_example'},{...base,EBOOK_USE_ACTIVE_LIVE_WEBHOOK:'false',RAZORPAY_KEY_ID:'rzp_live_example'}]){
  assert.equal(load('lib/ebooks/validation.ts',{},env).ebookLiveWebhookReady(),false);
 }
 assert.equal(load('lib/ebooks/validation.ts',{}, {...base,RAZORPAY_KEY_ID:'rzp_live_example'}).ebookLiveWebhookReady(),true);
 assert.equal(load('lib/ebooks/validation.ts',{}, {RAZORPAY_LIVE_WEBHOOK_SECRET:'dedicated-secret'}).ebookLiveWebhookReady(),true);
});

test('checkout display refuses incomplete provider configuration even for approved editions',()=>{
 const env={EBOOK_STORE_ENABLED:'true',EBOOK_ACCESS_SECRET:'a'.repeat(32),EBOOK_PAYMENT_MODE:'live',EBOOK_LIVE_CHECKOUT_APPROVED:'true',COMMERCE_BLOB_READ_WRITE_TOKEN:'private-token',RAZORPAY_LIVE_WEBHOOK_SECRET:'webhook-secret'};
 const failed=load('lib/ebooks/checkout.ts',{'@/lib/commerce/config':{assertCheckout:()=>{throw Error('missing live keys');}}},env);
 assert.equal(failed.ebookCheckoutReady(),false);
 const ready=load('lib/ebooks/checkout.ts',{'@/lib/commerce/config':{assertCheckout:mode=>assert.equal(mode,'live')}},env);
 assert.equal(ready.ebookCheckoutReady(),true);
 const noGuestAccess=load('lib/ebooks/checkout.ts',{'@/lib/commerce/config':{assertCheckout:()=>{}}},{...env,EBOOK_ACCESS_SECRET:''});
 assert.equal(noGuestAccess.ebookCheckoutReady(),false);
});

test('verified signed-in readers use account identity without requiring guest email verification',async()=>{
 const user={id:'reader',email:'Reader@example.test',name:'Reader',emailVerified:new Date(),sessionVersion:2};
 const {buyer}=load('lib/ebooks/access.ts',{
  'next/headers':{cookies:async()=>({get:()=>undefined,getAll:()=>[]})},
  'next-auth':{getServerSession:async()=>({user:{id:'reader'}})},
  '@/lib/auth':{authOptions:{secret:'test-only-secret'}},
  '@/lib/prisma':{prisma:{user:{findUnique:async()=>user}}},
 });
 const identity=await buyer();assert.equal(identity.id,'reader');assert.equal(identity.email,'reader@example.test');
});

test('account-cookie recovery verifies encryption, expiry, verification and revocation for both cookie names',async()=>{
 const secret='test-only-encryption-secret-for-library';
 const {encode}=native('next-auth/jwt');
 for(const secure of [false,true]){
  const name=secure?'__Secure-next-auth.session-token':'next-auth.session-token';
  for(const scenario of ['valid','tampered','expired','revoked','unverified','deleted']){
   let encrypted=await encode({secret,token:{id:'reader',email:'reader@example.test',sessionVersion:2},maxAge:scenario==='expired'?-3600:3600});
   if(scenario==='tampered')encrypted=encrypted.slice(0,-8)+'tampered';
   const user=scenario==='deleted'?null:{id:'reader',email:'reader@example.test',name:'Reader',emailVerified:scenario==='unverified'?null:new Date(),sessionVersion:scenario==='revoked'?3:2};
   const cookies=[{name:name+'.0',value:encrypted.slice(0,50)},{name:name+'.1',value:encrypted.slice(50)}];
   const {buyer}=load('lib/ebooks/access.ts',{
    'next/headers':{cookies:async()=>({get:()=>undefined,getAll:()=>cookies})},
    'next-auth':{getServerSession:async()=>null},
    '@/lib/auth':{authOptions:{secret}},
    '@/lib/prisma':{prisma:{user:{findUnique:async()=>user}}},
   });
   if(scenario==='valid')assert.equal((await buyer()).id,'reader');
   else await assert.rejects(buyer(),error=>error.status===401,`${name}: ${scenario}`);
  }
 }
});

