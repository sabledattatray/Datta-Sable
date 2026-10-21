import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const native = createRequire(import.meta.url);
function loader(overrides = {}, globals = {}) {
 const cache = new Map();
 function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file,exports);
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const require = name => {
   if(name in overrides)return overrides[name];
   if(name.startsWith('@/'))return load(name.slice(2)+'.ts');
   if(name.startsWith('.'))return load(new URL(name+'.ts','file:///'+file).pathname.slice(1));
   return native(name);
  };
  vm.runInNewContext(code,{exports,require,console,URL,Date,Set,Map,Buffer,process:{env:{}},...globals});return exports;
 }
 return load;
}
const load = loader();
const details = load('lib/commerce/product-details.ts');
const discovery = load('lib/commerce/discovery.ts');
const product = (patch={}) => ({id:'p',slug:'package',title:'Fabric guide',excerpt:'Independent resource',category:'Microsoft Fabric',technologies:['Fabric'],currency:'USD',priceMinor:4900,status:'PUBLISHED',createdAt:'2026-10-01',salesEnabled:true,deliveryReady:true,resources:[{title:'Guide PDF'}],readiness:'READY_FOR_SALE',...patch});

test('unknown catalog metadata defaults to test only; dummy contents cannot be marked commercially ready',()=>{
 assert.equal(details.productReadiness(product(),details.defaultProductDetails()),'TEST_ONLY');
 const ready=details.productDetailsSchema.parse({readiness:'READY_FOR_SALE'});
 assert.equal(details.productReadiness(product({excerpt:'TEST ONLY — dummy ZIP'}),ready),'TEST_ONLY');
 assert.equal(details.productReadiness(product({resources:[{title:'TEST ONLY dummy resource'}]}),ready),'TEST_ONLY');
 assert.equal(details.productReadiness(product(),ready),'READY_FOR_SALE');
 for(const patch of [{status:'ARCHIVED'},{resources:[]},{deliveryReady:false},{salesEnabled:false}]) assert.equal(details.productReadiness(product(patch),ready),'COMING_SOON');
});
test('editorial metadata rejects unsafe URLs and malformed details without accepting accidental readiness',()=>{
 for(const previewUrl of ['javascript:alert(1)','//evil.test/sample','https://evil.test/file','/\\evil.test']) assert.equal(details.productDetailsSchema.safeParse({previewUrl}).success,false);
 assert.equal(details.productDetailsSchema.safeParse({previewUrl:'/images/sample.webp'}).success,true);
 assert.equal(details.productDetailsSchema.safeParse({technologies:Array(31).fill('SQL')}).success,false);
 assert.equal(details.parseProductDetails('{bad').readiness,'TEST_ONLY');
 assert.equal(details.parseProductDetails({readiness:'INVALID'}).readiness,'TEST_ONLY');
 assert.equal(details.safeJsonLd({name:'</script><script>alert(1)</script>'}).includes('</script>'),false);
});
test('all six collections use the same published-only counting and filtering rules',()=>{
 const categories=['Microsoft Fabric','Excel & MIS Templates','Power BI Dashboards','SQL & Data Projects','Automation Tools','Professional Resource Bundles'];
 const items=categories.map((category,i)=>product({id:String(i),category}));items.push(product({status:'DRAFT'}));
 const counts=discovery.categoryCounts(items);assert.equal(Object.keys(counts).length,6);assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),6);
 for(const category of categories){const slug=discovery.categoryFor(category).slug;const found=discovery.filterProducts(items,{q:'',category:slug,technology:'all',availability:'all',sort:'newest'});assert.equal(found.length,counts[slug]);}
});
test('combined discovery filters, empty results, chronological and currency-grouped price sorting are correct',()=>{
 const items=[product({id:'old',priceMinor:9000,createdAt:'2026-01-01'}),product({id:'new',priceMinor:1000,createdAt:'2026-10-01'}),product({id:'inr',priceMinor:500,currency:'INR',readiness:'TEST_ONLY'})];
 const base={q:'fabric',category:'all',technology:'Fabric',availability:'READY_FOR_SALE',sort:'newest'};
 assert.deepEqual(Array.from(discovery.filterProducts(items,base),p=>p.id),['new','old']);
 assert.equal(discovery.filterProducts(items,{...base,q:'no matches'}).length,0);
 assert.deepEqual(Array.from(discovery.filterProducts(items,{...base,availability:'all',sort:'price-asc'}),p=>p.id),['inr','new','old']);
 assert.deepEqual(Array.from(discovery.filterProducts(items,{...base,availability:'all',sort:'price-desc'}),p=>p.id),['inr','old','new']);
});
test('analytics is consent-gated, excludes test purchases and strips arbitrary customer data',()=>{
 let consent=false;const events=[],values=new Map();const window={gtag:(...args)=>events.push(args)};
 const analytics=loader({'@/lib/analytics-consent':{hasAnalyticsConsent:()=>consent},'@/lib/browser-storage':{readLocalStorage:k=>values.get(k)||null,writeLocalStorage:(k,v)=>values.set(k,v)}},{window}).call(null,'lib/commerce/analytics.ts');
 const item={item_id:'p',item_name:'Guide',price:49,currency:'USD',email:'secret@example.test'};
 analytics.trackViewItem(item);assert.equal(events.length,0);
 consent=true;analytics.trackViewItem({...item,testOnly:true});assert.equal(events.length,0);
 analytics.trackViewItem(item);assert.equal(events.length,1);assert.equal(JSON.stringify(events).includes('secret@example.test'),false);
 const order={mode:'test',status:'PAID',number:'txn',totalMinor:4900,currency:'USD',items:[{productId:'p',title:'Guide',unitPriceMinor:4900}]};
 analytics.trackVerifiedPurchase(order);assert.equal(events.length,1);
 analytics.trackVerifiedPurchase({...order,mode:'live',status:'PENDING'});assert.equal(events.length,1);
 analytics.trackVerifiedPurchase({...order,mode:'live'});analytics.trackVerifiedPurchase({...order,mode:'live'});assert.equal(events.filter(e=>e[1]==='purchase').length,1);
 assert.equal(events.at(-1)[2].transaction_id,'txn');
});
test('stored file format labels do not expose private paths',()=>{
 assert.equal(details.resourceFormatLabel('products/id/random.zip'),'ZIP');assert.equal(details.resourceFormatLabel('products/id/random.pdf'),'PDF');assert.equal(details.resourceFormatLabel('products/id/random.exe'),'File');
});
function downloadHarness({authenticated=true,owned=true,count=1,missing=false,pathname='products/product1/fixture.zip'}={}) {
 const calls={signed:0,logged:0,head:0};
 let load;
 const overrides={
  '@/lib/prisma':{prisma:{commerceResource:{findFirst:async({where})=>{
    assert.equal(where.active,true);assert.equal(where.product.deliveryReady,true);
    assert.equal(where.product.entitlements.some.status,'ACTIVE');assert.equal(where.product.entitlements.some.order.userId,'buyer1');assert.equal(where.product.entitlements.some.order.status,'PAID');
    return owned?{id:'resource1',pathname}:null;
  }},commerceLimit:{upsert:async()=>({count})},commerceDownload:{create:async()=>{calls.logged++;}}}},
  '@/lib/security':{logAudit:async()=>{}},
  '@/lib/commerce/access':{customer:async()=>{if(!authenticated)throw new (load('lib/commerce/shared.ts').CommerceError)('Sign in',401);return{id:'buyer1'};}},
  '@/lib/commerce/config':{},'@/lib/commerce/payments':{},'@/lib/commerce/jobs':{},'@/lib/commerce/product-settings':{},
  '@vercel/blob':{head:async()=>{calls.head++;if(missing)throw Error('Not found');},issueSignedToken:async input=>{calls.signed++;assert.equal(input.operations[0],'get');assert.ok(input.validUntil-Date.now()<=120000);return 'signed';},presignUrl:async()=>({presignedUrl:'https://private.example.test/short-lived'})},
  'next/server':{after:()=>{},NextResponse:class extends Response{static json(data,init){return Response.json(data,init);}}},
 };
 load=loader(overrides,{Request,Response,process:{env:{COMMERCE_BLOB_READ_WRITE_TOKEN:'private_fixture'}}});
 const route=load('app/api/commerce/[...path]/route.ts');
 return {calls,run:()=>route.GET(new Request('https://site.test/api/commerce/downloads/resource1'),{params:Promise.resolve({path:['downloads','resource1']})})};
}
test('private download checks ownership and entitlement before issuing a short-lived URL',async()=>{
 const h=downloadHarness();const response=await h.run();assert.equal(response.status,303);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');assert.equal(h.calls.head,1);assert.equal(h.calls.signed,1);assert.equal(h.calls.logged,1);
});
test('anonymous, non-purchasers, traversal paths, missing files and rate limits never receive signed access',async()=>{
 for(const [input,status] of [[{authenticated:false},401],[{owned:false},404],[{pathname:'products/product1/../secret.zip'},404],[{missing:true},503],[{count:21},429]]){
  const h=downloadHarness(input),response=await h.run();assert.equal(response.status,status);assert.equal(h.calls.signed,0);assert.equal(h.calls.logged,0);assert.ok(response.headers.get('cache-control').includes('no-store'));
 }
});
test('admin setup diagnostics reveal flags and required variable names, never secrets',()=>{
 const config=loader({}, {process:{env:{RAZORPAY_KEY_ID:'rzp_test_fixture',RAZORPAY_KEY_SECRET:'private-value',RAZORPAY_WEBHOOK_SECRET:'webhook-private',COMMERCE_BLOB_READ_WRITE_TOKEN:'your_private_store_token'}}})('lib/commerce/config.ts');
 const checks=config.checkoutConfigurationChecks();assert.equal(checks.find(c=>c.key==='RAZORPAY_TEST_KEYS').ready,true);assert.equal(checks.find(c=>c.key==='COMMERCE_BLOB_READ_WRITE_TOKEN').ready,false);assert.equal(checks.find(c=>c.key==='CRON_SECRET').ready,false);assert.doesNotMatch(JSON.stringify(checks),/private-value|webhook-private/);
});
test('owner-supplied disclaimer is preserved verbatim',()=>{
 assert.equal(details.independentEducationalDisclaimer.length,5);
 assert.equal(details.independentEducationalDisclaimer[3],'All practice questions, explanations, examples, and exercises are independently developed and do not reproduce actual Microsoft certification examination content.');
 assert.equal(details.independentEducationalDisclaimer[4],'Purchase of this resource does not include an examination voucher, official certification, or guarantee of passing any Microsoft examination.');
});
