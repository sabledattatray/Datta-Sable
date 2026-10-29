import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const native = createRequire(import.meta.url);
import { docxFixture } from './resume-docx-fixture.mjs';
export const pdf = fs.readFileSync('public/resume/master.pdf');
export const docx = docxFixture();

export function harness(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-security-'));
  let session = { user: { id: 'test-admin', role: 'ADMIN' } }, role = 'ADMIN', lookups = 0;
  const cache = new Map();
  const mocks = { 'server-only': {}, 'next-auth': { getServerSession: async () => session }, '@/lib/auth': { authOptions: {} }, '@/lib/prisma': { prisma: { user: { findUnique: async () => { lookups++; return { id: 'test-admin', email: 'admin@example.test', emailVerified: new Date(), role }; } } } } };
  if (options.blob) mocks['@vercel/blob'] = options.blob;
  mocks['next-auth/next'] = mocks['next-auth'];
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {}; cache.set(file, exports);
    const require = name => {
      if (name in mocks) return mocks[name];
      if (name.startsWith('@/') || name.startsWith('.')) {
        const target = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name);
        if (target.endsWith('.json')) return JSON.parse(fs.readFileSync(target, 'utf8'));
        return load(target + '.ts');
      }
      return native(name);
    };
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { exports, require, process: { env: { NODE_ENV: 'test', RESUME_TEST_ROOT: root, ...options.env }, cwd: () => process.cwd() }, console, Buffer, URL, Headers, Request, Response, File, Date, setTimeout, clearTimeout });
    return exports;
  }
  const route = load('app/api/admin/resumes/[[...path]]/route.ts');
  const service = load('lib/resumes/service.ts'), storage = load('lib/resumes/storage.ts');
  const get = (parts = [], query = '', headers = {}, method = 'GET') => route.GET(new Request('https://resume.test/api/admin/resumes/' + parts.join('/') + query, { headers, method }), { params: Promise.resolve({ path: parts }) });
  const post = (body, origin = 'https://resume.test') => route.POST(new Request('https://resume.test/api/admin/resumes', { method: 'POST', headers: { origin, ...(body instanceof FormData ? {} : { 'content-type': 'application/json' }) }, body: body instanceof FormData ? body : JSON.stringify(body) }), { params: Promise.resolve({}) });
  async function upload({ revision, profile = 'senior_mis', note = 'Verified initial version', verified = true, pdfBytes = pdf, docxBytes = docx } = {}) {
    const form = new FormData(); form.set('profile', profile); form.set('revision', revision ?? (await service.listResumes()).revision); form.set('note', note); form.set('verified', String(verified));
    form.set('pdf', new File([pdfBytes], 'resume.pdf', { type: 'application/pdf' })); form.set('docx', new File([docxBytes], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
    return post(form);
  }
  return { root, route, get, post, upload, service, storage, load, setSession: value => { session = value; }, setRole: value => { role = value; }, get lookups() { return lookups; } };
}
