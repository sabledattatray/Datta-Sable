// Isolated browser QA only. No authentication bypass is added to the Next.js app.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { harness } from '../tests/helpers/resume-harness.mjs';
if (process.env.NODE_ENV === 'production') throw new Error('Local test fixture only.');
const h = harness();
const fixtureStems = { master: 'Master_Professional_Resume', senior_mis: 'Senior_MIS_Reporting_Analyst', power_bi_analyst: 'Power_BI_Business_Intelligence_Analyst', bfsi_analytics: 'BFSI_Risk_Collections_Analytics' };
for (const profile of ['master', 'senior_mis', 'power_bi_analyst', 'bfsi_analytics']) {
  const stem = 'resume-system/output/Dattatray_Sable_' + fixtureStems[profile];
  const r = await h.upload({ profile, note: 'Verified local QA document pair', pdfBytes: await fs.readFile(stem + '.pdf'), docxBytes: await fs.readFile(stem + '.docx') });
  if (r.status !== 200) throw new Error(await r.text());
}
await h.upload({ note: 'Previous version retained for restoration checks', pdfBytes: await fs.readFile('resume-system/output/Dattatray_Sable_Senior_MIS_Reporting_Analyst.pdf'), docxBytes: await fs.readFile('resume-system/output/Dattatray_Sable_Senior_MIS_Reporting_Analyst.docx') });
const out = path.resolve('scratch/resume-ui'); await fs.mkdir(out, { recursive: true });
await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import ResumeManager from './components/admin/ResumeManager'; createRoot(document.getElementById('root')).render(<ResumeManager/>); document.getElementById('logout').onclick=async()=>{await fetch('/fixture/logout');window.dispatchEvent(new Event('fixture-logout'));};`, resolveDir: process.cwd(), sourcefile: 'resume-fixture.tsx', loader: 'tsx' }, bundle: true, outfile: path.join(out, 'browser.js'), jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'fixture-session', setup(b) { b.onResolve({ filter: /^next-auth\/react$/ }, () => ({ path: 'session', namespace: 'fixture' })); b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `import {useState,useEffect} from 'react';export function useSession(){const [status,setStatus]=useState('authenticated');useEffect(()=>{const logout=()=>setStatus('unauthenticated');window.addEventListener('fixture-logout',logout);return()=>window.removeEventListener('fixture-logout',logout)},[]);return {status,data:status==='authenticated'?{user:{id:'test-admin',role:'ADMIN'}}:null}}`, resolveDir: process.cwd(), loader: 'js' })); } }] });
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Resume management · isolated local QA</title><link rel="stylesheet" href="/browser.css"><style>:root{--text:#142b49;--muted:#526174;--border:#d8e1eb;--surface:#fff;--bg:#f4f7fb;--accent:#2563a6}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:var(--bg)}.qa-banner{padding:10px 28px;background:#142b49;color:white;display:flex;justify-content:space-between;align-items:center;font-size:12px}.qa-banner button{color:white;background:transparent;border:1px solid #ffffff66;border-radius:4px;padding:6px 10px}</style></head><body><div class="qa-banner"><span>ISOLATED LOCAL QA · simulated administrator · no production changes</span><button id="logout">Sign out test session</button></div><div id="root"></div><script src="/browser.js"></script></body></html>`;
const server = http.createServer(async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://127.0.0.1:3095');
    if (url.pathname === '/fixture/logout') { res.setHeader('Set-Cookie', 'fixture=; Path=/; Max-Age=0; SameSite=Strict'); res.end('signed out'); return; }
    if (url.pathname === '/resume-worker/pdf.worker.min.mjs') { res.setHeader('Content-Type', 'text/javascript'); res.end(await fs.readFile('public/resume-worker/pdf.worker.min.mjs')); return; }
    if (url.pathname === '/admin/resumes') { res.setHeader('Set-Cookie', 'fixture=admin; Path=/; HttpOnly; SameSite=Strict'); res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return; }
    if (['/browser.js','/browser.css'].includes(url.pathname)) { res.setHeader('Content-Type', url.pathname.endsWith('.css') ? 'text/css' : 'text/javascript'); res.end(await fs.readFile(path.join(out, url.pathname.slice(1)))); return; }
    if (!url.pathname.startsWith('/api/admin/resumes')) { res.writeHead(404); res.end(); return; }
    h.setSession(req.headers.cookie?.includes('fixture=admin') ? { user: { id: 'test-admin', role: 'ADMIN' } } : null);
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, ...(['GET','HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }) });
    const context = { params: Promise.resolve({ path: url.pathname.slice('/api/admin/resumes'.length).split('/').filter(Boolean) }) };
    const response = await (req.method === 'POST' ? h.route.POST : h.route.GET)(request, context);
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) { console.error(error); res.writeHead(500); res.end('Fixture error'); }
});
server.listen(3095, '127.0.0.1', () => console.log('Isolated resume UI fixture ready at http://127.0.0.1:3095/admin/resumes'));
