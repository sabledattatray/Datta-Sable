// Cross-platform post-build packaging guard. Edits generated trace metadata only;
// never touches original documents or storage files.
import fs from 'node:fs/promises';
import path from 'node:path';
const cwd = process.cwd(), dist = path.resolve(cwd, process.argv[2] || process.env.NEXT_BUILD_DIR || '.next');
if (path.dirname(dist) !== cwd || !path.basename(dist).startsWith('.next')) throw new Error('Expected a generated .next build directory inside the project.');
const roots = ['storage/resumes', 'resume-system/output', 'resume-system/source', 'resume-system/previews', 'public/resumes'].map(p => path.resolve(cwd, p).toLowerCase());
const privatePath = p => roots.some(root => p.toLowerCase() === root || p.toLowerCase().startsWith(root + path.sep));
async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file)); else if (entry.isFile()) result.push(file);
  }
  return result;
}
let traces = 0, removed = 0, chunks = 0;
const files = await walk(dist);
for (const file of files.filter(p => p.endsWith('.nft.json'))) {
  const value = JSON.parse(await fs.readFile(file, 'utf8'));
  const kept = value.files.filter(entry => !privatePath(path.resolve(path.dirname(file), entry)));
  if (kept.length !== value.files.length) {
    removed += value.files.length - kept.length;
    await fs.writeFile(file, JSON.stringify({ ...value, files: kept }));
  }
  if (kept.some(entry => privatePath(path.resolve(path.dirname(file), entry)))) throw new Error('Private resume path remains in a deployment trace.');
  traces++;
}
for (const file of files.filter(p => p.startsWith(path.join(dist, 'static') + path.sep) && p.endsWith('.js'))) {
  const text = await fs.readFile(file, 'utf8');
  if (text.includes('resumes/files/') || /Dattatray_Sable_(Senior_MIS_Reporting_Analyst|Power_BI_Business_Intelligence_Analyst|BFSI_Risk_Collections_Analytics)\.(pdf|docx)/.test(text)) throw new Error('Private resume file reference found in a browser bundle.');
  chunks++;
}
const fallbackTrace = path.join(dist, 'server/app/Dattatray_Sable_Resume.pdf/route.js.nft.json');
const fallback = JSON.parse(await fs.readFile(fallbackTrace, 'utf8'));
if (!fallback.files.some(p => path.resolve(path.dirname(fallbackTrace), p) === path.resolve(cwd, 'public/resume/master.pdf'))) throw new Error('Public master fallback is missing from its deployment trace.');
const report = { passed: true, traces, chunks, privateReferencesRemoved: removed, originalDocumentsModified: false };
await fs.writeFile(path.join(dist, 'resume-packaging-audit.json'), JSON.stringify(report, null, 2));
console.log('Resume packaging guard:', JSON.stringify(report));
