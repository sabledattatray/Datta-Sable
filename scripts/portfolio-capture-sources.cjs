const { chromium } = require('./portfolio-browser.cjs');
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = process.cwd();
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
 for(const [name,url] of [['before','https://dattasable.com/portfolio'],['fabric','https://fabric.dattasable.com/'],['excel','https://excel.dattasable.com/']]){
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1800);
  await fs.writeFile(path.join(root,'scratch/portfolio',name+'-text.txt'),await page.locator('body').innerText());
  await fs.writeFile(path.join(root,'scratch/portfolio',name+'-links.json'),JSON.stringify(await page.locator('a').evaluateAll(a=>a.map(e=>({text:e.textContent,url:e.href}))),null,2));
  await sharp(await page.screenshot({fullPage:false})).webp({quality:85}).toFile(path.join(root,name==='before'?'docs/portfolio/before-desktop.webp':`public/images/portfolio/${name}-home.webp`));
  if(name==='before'){await page.setViewportSize({width:375,height:812});await page.screenshot({path:'docs/portfolio/before-mobile.png',fullPage:true});}
  console.log(name,await page.title());await page.close();
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
