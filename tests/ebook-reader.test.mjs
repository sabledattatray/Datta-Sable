import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function reader(component, fetch, session=null) {
 let cursor=0,effects=[],refreshes=0;const slots=[];
 const react={
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},
  useRef(initial){const i=cursor++;return slots[i]??={current:initial};},
  useEffect(effect,deps){const i=cursor++;if(JSON.stringify(slots[i])!==JSON.stringify(deps)){slots[i]=deps;effects.push(effect);}},
 };
 const jsx=(type,props)=>({type,props}),exports={};
 const mocks={react,'react/jsx-runtime':{jsx,jsxs:jsx},'next/link':{default:'next-link'},'../LibraryEntryLink':{default:'entry-link'},
  'next-auth/react':{useSession:()=>({data:session}),getSession:async()=>{refreshes++;return session;}},
  '@/components/commerce/Checkout':{loadCheckout:async()=>assert.fail('No payment widget should load without identity')},
  '@/lib/commerce/format':{money:(v)=>`INR ${v/100}`},
  '@/lib/browser-storage':{readSessionStorage:()=> '00000000-0000-4000-8000-000000000001',writeSessionStorage:()=>{}},'./Books.module.css':{default:{}},
 };
 const code=ts.transpileModule(fs.readFileSync('components/ebooks/Reader.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>{assert.ok(name in mocks,`Unexpected import ${name}`);return mocks[name];},fetch,AbortController,setTimeout,clearTimeout,console,window:{location:{pathname:'/ebooks/sql-business-analytics-2026'}}});
 function render(){cursor=0;effects=[];let tree=exports[component]({productId:'book',title:'SQL guide',amount:9900,available:true,testMode:false});if(effects.length){effects.forEach(f=>f());cursor=0;effects=[];tree=exports[component]({productId:'book',title:'SQL guide',amount:9900,available:true,testMode:false});}const nodes=[];function walk(n){if(Array.isArray(n))return n.forEach(walk);if(!n||typeof n!=='object')return;nodes.push(n);walk(n.props?.children);}walk(tree);return nodes;}
 return{render,get refreshes(){return refreshes;},async settle(){await new Promise(setImmediate);return render();}};
}
const isGuest=n=>typeof n.type==='function'&&n.type.name==='GuestAccess';

test('verified account library renders purchases without a guest verification form',async()=>{
 const app=reader('Library',async()=>Response.json({orders:[]}),{user:{id:'reader'}});
 assert.ok(app.render().some(n=>n.props?.children==='Loading your purchases…'));
 const nodes=await app.settle();assert.equal(nodes.some(isGuest),false);
 assert.ok(nodes.some(n=>n.type==='button'&&n.props.children==='Refresh library'));
});

test('library service failures offer retry instead of incorrectly asking for verification',async()=>{
 const app=reader('Library',async()=>Response.json({error:'Service unavailable'},{status:503}));app.render();const nodes=await app.settle();
 assert.equal(nodes.some(isGuest),false);assert.ok(nodes.some(n=>n.type==='button'&&n.props.children==='Retry library'));
});

test('unauthenticated checkout offers guest access inline and preserves the book return path',async()=>{
 const app=reader('BuyBook',async()=>Response.json({error:'Sign in or verify your email to access your library.'},{status:401}));
 let nodes=app.render();nodes.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});
 nodes=app.render();await nodes.find(n=>n.type==='button'&&String(n.props.children).startsWith('Buy for')).props.onClick();
 nodes=await app.settle();assert.equal(nodes.find(isGuest)?.props.returnTo,'/ebooks/sql-business-analytics-2026#purchase');
 assert.ok(nodes.some(n=>n.type==='a'&&n.props.href==='/sign-in?callbackUrl=%2Febooks%2Fsql-business-analytics-2026%23purchase'));
 assert.equal(app.refreshes,0);
});

test('signed-in checkout refreshes its account cookie and provides explicit recovery for an expired session',async()=>{
 const app=reader('BuyBook',async()=>Response.json({error:'Unauthorized'},{status:401}),{user:{id:'reader'}});
 let nodes=app.render();nodes.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});
 nodes=app.render();await nodes.find(n=>n.type==='button'&&String(n.props.children).startsWith('Buy for')).props.onClick();
 nodes=await app.settle();assert.equal(app.refreshes,1);assert.ok(nodes.some(n=>n.type==='a'&&n.props.children==='Sign in again'));
});

test('library menu entry performs document navigation while ordinary menu links retain client routing',()=>{
 const exports={},jsx=(type,props)=>({type,props});
 const code=ts.transpileModule(fs.readFileSync('components/LibraryEntryLink.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>name==='next/link'?{default:'next-link'}:{jsx,jsxs:jsx}});
 const entry=exports.default({href:'/ebooks',children:'eBooks','aria-current':'page'});
 assert.equal(entry.type,'a');assert.equal(entry.props['aria-current'],'page');
 assert.equal(exports.default({href:'/blog',children:'Blog'}).type,'next-link');
});
