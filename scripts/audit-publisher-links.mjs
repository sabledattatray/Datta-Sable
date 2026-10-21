import fs from 'node:fs/promises';
import { load } from 'cheerio';
const origins=['https://dattasable.com','https://fabric.dattasable.com','https://excel.dattasable.com'];
const prior=JSON.parse(await fs.readFile('docs/audits/production-content-2026-10-21.json','utf8'));
const queue=[...new Set(prior.results.map(r=>r.url).filter(Boolean))];
const checked=new Map(), links=new Map();let cursor=0;
async function inspect(url,discover){try{const response=await fetch(url,{signal:AbortSignal.timeout(35000)});const type=response.headers.get('content-type')||'';const body=type.includes('text/html')?await response.text():'';const $=load(body);if(discover)$('a[href]').each((i,e)=>{try{const u=new URL($(e).attr('href'),url);u.hash='';if(origins.includes(u.origin)&&!u.search&&!/^\/(api|admin|dashboard|preview)(\/|$)/.test(u.pathname)){if(!links.has(u.href))links.set(u.href,[]);links.get(u.href).push({from:url,label:$(e).text().trim().slice(0,90)});}}catch{}});checked.set(url,{url,status:response.status,final:response.url,type,title:$('title').text(),headings:$('h1').length,ads:$('script[src*=googlesyndication]').length,bytes:Number(response.headers.get('content-length'))||body.length});}catch(e){checked.set(url,{url,error:e.message});}}
await Promise.all(Array.from({length:5},async()=>{while(cursor<queue.length)await inspect(queue[cursor++],true);}));
const extra=[...links.keys()].filter(u=>!checked.has(u));cursor=0;await Promise.all(Array.from({length:5},async()=>{while(cursor<extra.length)await inspect(extra[cursor++],false);}));
const failures=[...checked.values()].filter(r=>r.error||r.status>=400).map(r=>({...r,referrers:links.get(r.url)||[]}));
await fs.writeFile('docs/audits/deep-links-2026-10-21.json',JSON.stringify({checkedAt:new Date().toISOString(),pageSeeds:queue.length,checked:checked.size,failures,results:[...checked.values()]},null,2)+'\n');console.log(JSON.stringify({seeds:queue.length,total:checked.size,failures:failures.map(r=>({url:r.url,status:r.status,error:r.error,refs:r.referrers.length}))},null,2));
