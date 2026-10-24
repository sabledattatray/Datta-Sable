import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path,mocks={}){const exports={};const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(code,{exports,require:name=>{assert.ok(name in mocks,`Unexpected dependency ${name}`);return mocks[name];}});return exports;}
const data=compile('app/portfolio/data.ts');
function portfolio(fetch){
 const slots=[];let cursor=0;let effects=[];
 const react={useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},useRef(initial){const i=cursor++;return slots[i]??={current:initial};},useMemo(fn){return fn();},useEffect(fn,deps){const i=cursor++;if(JSON.stringify(slots[i])!==JSON.stringify(deps)){slots[i]=deps;effects.push(fn);}},Suspense:'suspense'};
 const jsx=(type,props)=>({type,props});const exports={};const params={get:()=>null};
 const mocks={react,'react/jsx-runtime':{jsx,jsxs:jsx},'next/navigation':{useSearchParams:()=>params},'next/link':{default:'a'},'lucide-react':{},'@/components/Navbar':{default:'header'},'@/components/Footer':{default:'footer'},'@/components/showcase/Showcase':{WorkDialog:'dialog',WorkImage:'image',WorkLink:'a'},'@/components/showcase/Showcase.module.css':{default:{}},'./Portfolio.module.css':{default:{}},'./data':data};
 const code=ts.transpileModule(fs.readFileSync('app/portfolio/PortfolioClientPage.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>{assert.ok(name in mocks,`Unexpected dependency ${name}`);return mocks[name];},fetch,Error,URL,window:{location:{href:'http://localhost/portfolio'},history:{replaceState(){}}}});
 const Component=exports.default().props.children.type;
 function render(){cursor=0;effects=[];let tree=Component();if(effects.length){effects.forEach(fn=>fn());cursor=0;effects=[];tree=Component();}const nodes=[];function walk(node){if(Array.isArray(node))return node.forEach(walk);if(!node||typeof node!=='object')return;nodes.push(node);walk(node.props?.children);}walk(tree);return nodes;}
 return{render,change(name,value){render().find(n=>n.props?.name===name).props.onChange({target:{value}});},submit(){return render().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});}};
}
test('portfolio filters narrow the project library and reset page size',()=>{
 const app=portfolio(()=>{});
 const cards=()=>app.render().filter(n=>n.type==='button'&&n.props?.['aria-label']?.startsWith('Inspect '));
 assert.equal(cards().length,6);
 const automation=app.render().find(n=>n.type==='button'&&Array.isArray(n.props?.children)&&n.props.children[0]==='Automation');
 automation.props.onClick();assert.equal(cards().length,data.projects.filter(p=>p.category.toLowerCase().includes('automation')).length);
 const search=app.render().find(n=>n.props?.['aria-label']==='Search projects');search.props.onChange({target:{value:'no-match-12345'}});assert.equal(cards().length,0);
});
test('portfolio pending enquiry prevents duplicate delivery and handles non-JSON failure',async()=>{
 let resolve;let calls=0;const app=portfolio(async()=>{calls++;return new Promise(done=>{resolve=done;});});
 app.change('name','Example visitor');app.change('email','visitor@example.com');app.change('message','A reporting project');
 const first=app.submit();await app.submit();assert.equal(calls,1);
 resolve({ok:false,json:async()=>{throw new SyntaxError('HTML failure');}});await first;
 assert.ok(app.render().some(n=>n.props?.role==='alert'));
 assert.equal(app.render().find(n=>n.props?.name==='message').props.value,'A reporting project');
});
