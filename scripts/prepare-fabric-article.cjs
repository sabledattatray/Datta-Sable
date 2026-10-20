const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const cheerio = require('cheerio');
const sharp = require('sharp');

const root = process.cwd();
const slug = 'microsoft-fabric-real-time-intelligence-guide';
const folder = path.join(root, 'content', 'editorial', slug);
const source = path.join(root, 'content', 'editorial', `${slug}.md`);
const image = `/images/blog/${slug}.webp`;
const title = 'Microsoft Fabric Real-Time Intelligence: A Practical Guide';
const excerpt = 'Build Microsoft Fabric Real-Time Intelligence with Eventstream, Eventhouse, KQL and Activator. Includes queries, alert design, costs and a production checklist.';

async function main() {
  fs.mkdirSync(folder, { recursive: true });
  const markdown = fs.readFileSync(source, 'utf8');
  const $ = cheerio.load(marked.parse(markdown), null, false);
  $('h1').first().remove();
  const headings = [];
  const ids = new Set();
  $('h2,h3').each((_, element) => {
    const el = $(element), text = el.text();
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let id = base, n = 2;
    while (ids.has(id)) id = `${base}-${n++}`;
    ids.add(id);
    el.attr('id', id).attr('style', 'scroll-margin-top:110px');
    if (element.tagName === 'h2') headings.push({ id, text });
  });
  $('table').each((index, element) => {
    const table = $(element);
    table.attr('style', 'min-width:580px;width:100%;border-collapse:collapse;font-size:.94rem');
    table.find('th,td').attr('style', 'padding:14px 16px;border:1px solid var(--border);text-align:left;vertical-align:top;line-height:1.7');
    table.find('th').attr('scope', 'col');
    table.wrap(`<div role="region" tabindex="0" aria-label="Reference table ${index + 1}; scroll horizontally on small screens" style="max-width:100%;overflow-x:auto;margin:24px 0;border-radius:12px"></div>`);
  });
  $('pre').attr('style', 'max-width:100%;overflow-x:auto;padding:22px;border:1px solid var(--border);border-radius:12px;font-size:.88rem;line-height:1.8');
  $('a[href^="https://learn.microsoft.com"]').attr('rel', 'noopener');
  $('p').filter((_, e) => $(e).text().startsWith('Editorial note:')).attr('style', 'font-size:.88rem;line-height:1.8;border-left:3px solid #0e8c78;padding:16px 20px;background:var(--surface2);border-radius:0 10px 10px 0');
  const toc = `<nav aria-label="Article contents" style="padding:24px;border:1px solid var(--border);border-radius:16px;background:var(--surface2);margin:32px 0"><p style="font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:var(--text)">Inside this guide</p><ol style="padding-left:22px;line-height:1.9">${headings.map(h=>`<li><a href="#${h.id}">${h.text.replace(/^\d+\.\s*/, '')}</a></li>`).join('')}</ol></nav>`;
  const lead = `<aside style="display:flex;flex-wrap:wrap;gap:10px;margin:0 0 24px"><span style="padding:7px 12px;border-radius:999px;border:1px solid var(--border);font-size:.78rem">Implementation guide</span><span style="padding:7px 12px;border-radius:999px;border:1px solid var(--border);font-size:.78rem">Data engineers &amp; BI developers</span><span style="padding:7px 12px;border-radius:999px;border:1px solid var(--border);font-size:.78rem">Reviewed 20 October 2026</span></aside>`;
  const content = lead + $.html().replace('<h2 id="1-start-with-a-decision-and-a-latency-budget"', '<details style="margin:28px 0;border:1px solid var(--border);border-radius:14px;padding:18px 22px"><summary style="cursor:pointer;font-weight:700;color:var(--text)">Explore the guide — 19 sections</summary>' + toc + '</details><h2 id="1-start-with-a-decision-and-a-latency-budget"');
  const words = $.text().split(/\s+/).filter(Boolean).length;
  const post = {title, slug, category:'Microsoft Fabric', excerpt, content, image, date:'Oct 20, 2026', readTime:Math.ceil(words / 220), color:'#0e8c78', icon:'Activity', published:false, blocks:{focusedKeyword:'Microsoft Fabric Real-Time Intelligence',seo:{title,description:excerpt,canonical:`https://dattasable.com/blog/${slug}`,keywords:['Microsoft Fabric Real-Time Intelligence','Fabric Eventstream','Fabric Eventhouse','KQL tutorial','Fabric Activator','real-time analytics'],imageAlt:'Microsoft Fabric Real-Time Intelligence: events flow through Eventstream, Eventhouse, KQL and alerts.',reviewedAt:'2026-10-20',imageGeneration:'Built-in image generation; independent editorial cover in a Fabric-inspired teal and mint palette.'}}};
  fs.writeFileSync(path.join(folder,'draft.json'), JSON.stringify(post,null,2));
  fs.writeFileSync(path.join(folder,'article.html'), content);
  const links=[...$('a[href]')].map(e=>$(e).attr('href'));
  for (const href of links.filter(h=>h.startsWith('#'))) if(!ids.has(href.slice(1))) throw Error(`Broken anchor ${href}`);
  if(excerpt.length > 160 || title.length > 65) throw Error('Review metadata lengths');
  const inventory=JSON.parse(fs.readFileSync(path.join(root,'content/editorial/blog-inventory-2026-10-20.json'),'utf8'));
  for(const href of links.filter(h=>h.startsWith('/blog/'))) if(!inventory.some(p=>p.slug===href.slice(6)&&p.published)) throw Error(`Unknown internal article ${href}`);
  const assetSource = process.argv.find(a=>a.startsWith('--image='))?.slice(8);
  if(assetSource) await sharp(assetSource).resize(1200,630,{fit:'contain',background:'#f4fbf8'}).webp({quality:85,effort:6}).toFile(path.join(root,'public',image));
  const meta = await sharp(path.join(root,'public',image)).metadata();
  const checks={words,estimatedReadMinutes:post.readTime,titleCharacters:title.length,descriptionCharacters:excerpt.length,sections:headings.length,tables:$('table').length,codeBlocks:$('pre').length,internalLinks:links.filter(h=>h.startsWith('/blog/')).length,officialReferenceLinks:new Set(links.filter(h=>h.startsWith('https://learn.microsoft.com'))).size,image:{width:meta.width,height:meta.height,bytes:fs.statSync(path.join(root,'public',image)).size},draft:true};
  fs.writeFileSync(path.join(folder,'validation.json'),JSON.stringify(checks,null,2));
  if(process.argv.includes('--save-draft')) {
    require('@next/env').loadEnvConfig(root);
    const {PrismaClient}=require('@prisma/client'), p=new PrismaClient();
    try {
      const existing=await p.post.findUnique({where:{slug},select:{id:true,published:true}});
      if(existing?.published) throw Error('Refusing to overwrite a published article');
      const {blocks:unused,...data}=post;
      const saved=existing?await p.post.update({where:{slug},data:{...data,blocks:post.blocks}}):await p.post.create({data:post});
      console.log(JSON.stringify({draftId:saved.id,published:saved.published,slug:saved.slug}));
    } finally {await p.$disconnect();}
  }
  console.log(JSON.stringify(checks,null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
