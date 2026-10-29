import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/portfolio/data.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: mod, exports: mod.exports });
const { projects, flagshipProjects, matchesProjectCategory } = mod.exports;
test('five ordered flagships extend the existing library without replacing original IDs', () => {
 assert.equal(flagshipProjects.length,5);assert.equal(projects.length,24);
 assert.equal(new Set(projects.map(p=>p.id)).size,24);
 for(const id of [19,11,10,9,7,1,8,0,4,2,3,6,13,14,15,16,17,5,18])assert.ok(projects.some(p=>p.id===id),`Preserve existing project ${id}`);
 assert.equal(flagshipProjects.map(p=>p.flagship.order).join(','),'1,2,3,4,5');
 assert.equal(new Set(flagshipProjects.map(p=>p.flagship.slug)).size,5);
});
test('flagship links, media and evidence have public safe sources and real local assets', () => {
 for(const p of flagshipProjects){
  assert.ok(p.live||p.github);assert.ok(p.flagship.gallery.length);
  for(const href of [p.live,p.github,p.flagship.release,...p.flagship.sources.map(s=>s.url),...p.flagship.evidence.map(s=>s.source)].filter(Boolean)){const u=new URL(href);assert.equal(u.protocol,'https:');assert.ok(!u.username&&!u.password);}
  for(const image of p.flagship.gallery){assert.ok(fs.existsSync('public'+image.src),image.src);assert.ok(image.alt.length>25);assert.ok(['Real screenshot','Design mockup','Architecture diagram'].includes(image.classification));}
 }
 assert.equal(flagshipProjects.find(p=>p.id===102).github,'');
});
test('completion and synthetic-data limitations remain explicit', () => {
 const n8n=flagshipProjects.find(p=>p.id===103), global=flagshipProjects.find(p=>p.id===104), suite=flagshipProjects.find(p=>p.id===105);
 assert.match(n8n.flagship.limitations.join(' '),/mock\/template/);assert.equal(n8n.flagship.gallery[0].classification,'Architecture diagram');
 assert.match(global.flagship.limitations.join(' '),/DuckDB/);assert.match(global.impact,/incomplete/);assert.ok(global.flagship.gallery.every(m=>m.classification==='Design mockup'));
 assert.match(suite.flagship.limitations.join(' '),/not client revenue/);assert.match(suite.flagship.limitations.join(' '),/execution remains pending/);
});
test('multi-category filters discover cross-disciplinary work and legacy aliases', () => {
 assert.ok(matchesProjectCategory(flagshipProjects[2],'AI & Automation'));
 assert.ok(matchesProjectCategory(flagshipProjects[2],'SQL & Data Engineering'));
 assert.ok(matchesProjectCategory(flagshipProjects[0],'Microsoft Fabric'));
 assert.equal(projects.filter(p=>matchesProjectCategory(p,'Featured')).length,5);
 assert.ok(projects.some(p=>p.id<=19&&matchesProjectCategory(p,'Power BI')));
});
test('media manifest excludes unusable n8n setup captures and records dimensions and sources', () => {
 const manifest=JSON.parse(fs.readFileSync('docs/portfolio/screenshot-manifest.json','utf8'));
 for(const m of manifest){assert.ok(fs.existsSync('public'+m.assetPath));assert.ok(m.width>600&&m.height>300);assert.ok(m.source.startsWith('https://'));assert.equal(m.retrievedDate,'2026-10-29');assert.ok(m.captureDate===null||m.captureDate==='2026-10-29');}
 assert.ok(!manifest.some(m=>/n8n-(overview|ingestion|quality|tests)\.webp/.test(m.assetPath)));
});
