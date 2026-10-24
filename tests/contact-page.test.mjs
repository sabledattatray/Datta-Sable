import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function contact(fetch, user = null) {
  const slots=[]; let cursor=0; let effects=[];
  const react={
    useState(initial) { const index=cursor++; if(!(index in slots)) slots[index]=initial; return [slots[index],value=>{slots[index]=typeof value==='function'?value(slots[index]):value;}]; },
    useRef(initial) { const index=cursor++; return slots[index]??={current:initial}; },
    useEffect(effect,deps) { const index=cursor++; if(JSON.stringify(slots[index])!==JSON.stringify(deps)){slots[index]=deps;effects.push(effect);} },
  };
  const jsx=(type,props)=>({type,props}); const exports={};
  const code=ts.transpileModule(fs.readFileSync('app/contact/ContactPageClient.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const mocks={react,'react/jsx-runtime':{jsx,jsxs:jsx},'next/link':{default:'a'},'next-auth/react':{useSession:()=>({data:user?{user}:null,status:user?'authenticated':'unauthenticated'})},'lucide-react':{},'@/components/Navbar':{default:'header'},'@/components/Footer':{default:'footer'},'./Contact.module.css':{default:{}}};
  vm.runInNewContext(code,{exports,require:name=>{assert.ok(name in mocks,`Unexpected dependency ${name}`);return mocks[name];},fetch,Error});
  function render(){cursor=0;effects=[];let tree=exports.default();if(effects.length){effects.forEach(effect=>effect());cursor=0;effects=[];tree=exports.default();}const nodes=[];function walk(node){if(Array.isArray(node))return node.forEach(walk);if(!node||typeof node!=='object')return;nodes.push(node);walk(node.props?.children);}walk(tree);return nodes;}
  return {render,change(name,value){render().find(n=>n.props?.name===name).props.onChange({target:{name,value}});},submit(){return render().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});}};
}
function fill(app){for(const [name,value] of Object.entries({name:' Example visitor ',email:' visitor@example.com ',message:' A dashboard enquiry. '}))app.change(name,value);}

test('contact GitHub and LinkedIn links open profiles instead of starting OAuth, including while signed in',()=>{
  for(const user of [null,{name:'Visitor',email:'visitor@example.com'}]){
    const app=contact(()=>assert.fail('No request expected'),user);
    const github=app.render().find(n=>n.props?.href==='https://github.com/sabledattatray');
    assert.equal(github.type,'a');assert.equal(github.props.target,'_blank');assert.match(github.props.rel,/noopener/);
    assert.ok(app.render().some(n=>n.props?.href==='https://www.linkedin.com/in/dattasable/'));
    assert.equal(app.render().some(n=>n.type==='button'&&n.props?.title==='Login with GitHub'),false);
  }
});
test('account identity fills empty fields without preventing visitors editing the details',()=>{
  const app=contact(()=>{}, {name:'Visitor',email:'visitor@example.com'});
  assert.equal(app.render().find(n=>n.props?.name==='email').props.value,'visitor@example.com');
  app.change('email','work@example.com');assert.equal(app.render().find(n=>n.props?.name==='email').props.value,'work@example.com');
});
test('failed contact delivery keeps the complete draft and displays a persistent error',async()=>{
  const app=contact(async()=>({ok:false,json:async()=>({message:'Please try again later.'})}));fill(app);await app.submit();
  assert.ok(app.render().some(n=>n.props?.role==='alert'));
  assert.equal(app.render().find(n=>n.props?.name==='message').props.value,' A dashboard enquiry. ');
});
test('non-JSON contact failures still show an actionable error',async()=>{
  const app=contact(async()=>({ok:false,json:async()=>{throw new SyntaxError('Unexpected HTML');}}));fill(app);await app.submit();
  assert.ok(app.render().some(n=>n.props?.children==='Your message could not be sent. Please try again or email me directly.'));
});
test('pending contact submission blocks duplicates, trims payload and confirms only after success',async()=>{
  let resolve;let calls=0;let payload;
  const app=contact(async(_url,options)=>{calls++;payload=JSON.parse(options.body);return new Promise(done=>{resolve=done;});});fill(app);
  const first=app.submit();await app.submit();assert.equal(calls,1);assert.deepEqual(payload,{name:'Example visitor',email:'visitor@example.com',subject:'',message:'A dashboard enquiry.'});
  resolve({ok:true});await first;
  assert.ok(app.render().some(n=>n.props?.role==='status'));
  assert.ok(app.render().some(n=>n.props?.children==='Your message is in.'));
});
test('honeypot and whitespace-only contact submissions make no delivery requests',async()=>{
  const app=contact(()=>assert.fail('Must not submit'));fill(app);app.change('honeypot','spam');await app.submit();
  app.change('honeypot','');app.change('message','   ');await app.submit();assert.ok(app.render().some(n=>n.props?.role==='alert'));
});
