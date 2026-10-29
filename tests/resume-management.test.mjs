import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {harness,pdf,docx} from './helpers/resume-harness.mjs';
const native=createRequire(import.meta.url);

test('resume metadata and file endpoints reject anonymous requests, including HEAD and ranges', async () => {
  const h = harness(); h.setSession(null);
  for (const args of [[], [['senior_mis', 'file']], [['senior_mis', 'file'], '?format=docx'], [['senior_mis', 'file'], '', { range: 'bytes=0-10' }], [['senior_mis', 'file'], '', {}, 'HEAD']]) {
    const response = await h.get(...args); assert.equal(response.status, 401); assert.match(response.headers.get('cache-control'), /no-store/); assert.match(response.headers.get('x-robots-tag'), /noindex/);
  }
  assert.equal((await h.post({ action: 'restore' })).status, 401);
});
test('a stale ADMIN session cannot override the current database role', async () => {
  const h = harness(); h.setRole('USER'); assert.equal((await h.get()).status, 403); assert.equal((await h.upload()).status, 403); assert.ok(h.lookups >= 2);
});
test('private replacement uploads both documents, preserves integrity and exposes no storage paths', async () => {
  const h = harness(); assert.equal((await h.upload()).status, 200);
  const r = await h.get(); const json = await r.json(); const p = json.profiles.find(p => p.id === 'senior_mis'); assert.equal(p.versions.length, 1); assert.equal(p.active, p.versions[0].id);
  assert.doesNotMatch(JSON.stringify(json), /resumes\/files|blob\.vercel|"key"/);
  const file = await h.get(['senior_mis', 'file']); assert.equal(file.status, 200); assert.deepEqual(Buffer.from(await file.arrayBuffer()), pdf); assert.equal(file.headers.get('x-frame-options'), 'SAMEORIGIN'); assert.match(file.headers.get('cache-control'), /no-store/);
  const word = await h.get(['senior_mis', 'file'], '?format=docx&download=1'); assert.equal(word.headers.get('content-disposition').startsWith('attachment'), true); assert.deepEqual(Buffer.from(await word.arrayBuffer()), docx);
});
test('replacement and restoration retain every historical version and both file formats', async () => {
  const h = harness(); await h.upload(); let data = await h.service.listResumes(); const first = data.profiles[1].active;
  await h.upload({ note: 'Second reviewed version' }); data = await h.service.listResumes(); const second = data.profiles[1].active; assert.notEqual(first, second); assert.equal(data.profiles[1].versions.length, 2);
  const restored = await h.post({ action: 'restore', profile: 'senior_mis', version: first, revision: data.revision }); assert.equal(restored.status, 200);
  const after = await h.service.listResumes(); assert.equal(after.profiles[1].active, first); assert.equal(after.profiles[1].versions.length, 2);
  assert.equal((await h.get(['senior_mis', 'file'], '?version=' + second + '&format=docx')).status, 200);
  assert.equal((await h.storage.readManifest()).manifest.events.length, 3);
});
test('logout immediately prevents new access to an earlier preview URL', async () => {
  const h = harness(); await h.upload(); const version = (await h.service.listResumes()).profiles[1].active;
  assert.equal((await h.get(['senior_mis', 'file'], '?version=' + version)).status, 200);
  h.setSession(null); assert.equal((await h.get(['senior_mis', 'file'], '?version=' + version)).status, 401); assert.equal((await h.get(['senior_mis', 'file'], '?version=' + version, { range: 'bytes=0-99' })).status, 401);
});
test('resume writes reject cross-origin requests and stale revisions without changing the active version', async () => {
  const h = harness(); await h.upload(); const before = await h.service.listResumes();
  assert.equal((await h.post({ action: 'restore', profile: 'senior_mis', version: before.profiles[1].active, revision: before.revision }, 'https://attacker.test')).status, 403);
  assert.equal((await h.upload({ revision: 'empty' })).status, 409); assert.equal((await h.service.listResumes()).profiles[1].versions.length, 1);
});
test('invalid profiles, path traversal, forged formats and missing versions do not expose files', async () => {
  const h = harness(); await h.upload();
  for (const [parts, query] of [[['..', 'file'], ''], [['senior_mis', 'file'], '?format=zip'], [['senior_mis', 'file'], '?version=../../secret'], [['master', 'file'], ''], [['senior_mis', 'other'], '']]) assert.notEqual((await h.get(parts, query)).status, 200);
  assert.equal((await h.get(['senior_mis', 'file'], '?version=00000000-0000-4000-8000-000000000001')).status, 404);
});
test('file validation rejects forged PDF/DOCX, executable PDFs, oversize files and unconfirmed contents', async () => {
  const h = harness();
  for (const options of [{ pdfBytes: Buffer.from('not a PDF') }, { docxBytes: Buffer.from('not a DOCX') }, { pdfBytes: Buffer.from('%PDF-1.7\n/JavaScript evil\n%%EOF') }, { pdfBytes: Buffer.alloc(4 * 1024 * 1024 + 1) }, { verified: false }]) assert.notEqual((await h.upload(options)).status, 200);
  assert.equal((await h.service.listResumes()).profiles[1].versions.length, 0);
});
test('range and HEAD responses support PDF preview without bypassing authorization', async () => {
  const h = harness(); await h.upload();
  const r = await h.get(['senior_mis', 'file'], '', { range: 'bytes=0-99' }); assert.equal(r.status, 206); assert.equal((await r.arrayBuffer()).byteLength, 100); assert.equal(r.headers.get('content-range'), `bytes 0-99/${pdf.length}`);
  assert.equal((await h.get(['senior_mis', 'file'], '', { range: 'bytes=99999999-' })).status, 416);
  const head = await h.get(['senior_mis', 'file'], '', {}, 'HEAD'); assert.equal(head.status, 200); assert.equal((await head.arrayBuffer()).byteLength, 0);
});
test('damaged files cannot be downloaded or restored, and obsolete facts cannot be restored', async () => {
  const h = harness(); await h.upload(); const { manifest } = await h.storage.readManifest(); const v = manifest.versions[0];
  fs.writeFileSync(path.join(h.root, ...v.files.pdf.key.split('/').slice(1)), 'tampered');
  assert.equal((await h.get(['senior_mis', 'file'])).status, 503);
  assert.equal((await h.post({ action: 'restore', profile: 'senior_mis', version: v.id, revision: manifest.revision })).status, 409);
  await h.storage.updateManifest(manifest.revision, m => { m.versions[0].sourceHash = '0'.repeat(64); });
  assert.equal((await h.post({ action: 'restore', profile: 'senior_mis', version: v.id, revision: (await h.service.listResumes()).revision })).status, 409);
});
test('a profile cannot restore another profile’s version', async () => {
  const h = harness(); await h.upload(); const data = await h.service.listResumes();
  assert.equal((await h.post({ action: 'restore', profile: 'master', version: data.profiles[1].active, revision: data.revision })).status, 404);
});
test('the public PDF route only returns the master even when a private profile is supplied', async () => {
  const h = harness(); await h.upload({ profile: 'master' }); await h.upload(); h.setSession(null);
  const publicRoute = h.load('app/Dattatray_Sable_Resume.pdf/route.ts');
  const result = await publicRoute.GET(new Request('https://resume.test/Dattatray_Sable_Resume.pdf?profile=senior_mis&format=docx'));
  assert.equal(result.status, 200); assert.equal(result.headers.get('content-type'), 'application/pdf'); assert.deepEqual(Buffer.from(await result.arrayBuffer()), pdf);
});
test('concurrent replacements cannot silently overwrite each other', async () => {
  const h = harness(); const results = await Promise.all([h.upload(), h.upload()]);
  assert.equal(results.filter(r => r.status === 200).length, 1);
  assert.equal(results.filter(r => r.status === 409).length, 1);
  assert.equal((await h.service.listResumes()).profiles[1].versions.length, 1);
});
test('retired specialized public URLs return 410 with indexing and caching restrictions', async () => {
  const h = harness(); const { NextRequest } = native('next/server'); const { middleware } = h.load('middleware.ts');
  for (const url of ['/resumes', '/resumes/test.pdf', '/resumes/test.docx']) {
    const response = middleware(new NextRequest('https://resume.test' + url));
    assert.equal(response.status, 410); assert.match(response.headers.get('x-robots-tag'), /noindex/); assert.match(response.headers.get('cache-control'), /no-store/);
  }
});
function blobFixture() {
  const objects = new Map(), calls = []; let counter = 0, conflict = false;
  class BlobNotFoundError extends Error {}
  class BlobPreconditionFailedError extends Error {}
  return { calls, setConflict: value => { conflict = value; }, api: {
    BlobNotFoundError, BlobPreconditionFailedError,
    async get(key, options) {
      calls.push({ operation: 'get', key, ...options }); const found = objects.get(key); if (!found) return null;
      return { statusCode: 200, stream: new Response(found.bytes).body, blob: { url: 'https://fixture.private.blob.vercel-storage.com/' + key, etag: found.etag } };
    },
    async put(key, bytes, options) {
      calls.push({ operation: 'put', key, ...options }); assert.equal(options.access, 'private');
      const previous = objects.get(key);
      if ((options.ifMatch && (previous?.etag !== options.ifMatch || conflict)) || (previous && !options.ifMatch && !options.allowOverwrite)) throw new BlobPreconditionFailedError();
      const etag = 'etag-' + ++counter; objects.set(key, { bytes: Buffer.from(bytes), etag });
      return { url: 'https://fixture.private.blob.vercel-storage.com/' + key, etag, pathname: key };
    },
  } };
}
test('cloud storage uses private access and conditional manifest writes without exposing blob URLs', async () => {
  const blob = blobFixture(); const h = harness({ blob: blob.api, env: { RESUME_STORAGE_BACKEND: 'blob', RESUME_PRIVATE_BLOB_READ_WRITE_TOKEN: 'test-private-token', RESUME_PRIVATE_BLOB_STORE_ID: 'store_test' } });
  assert.equal((await h.upload()).status, 200); assert.equal((await h.upload()).status, 200);
  assert.ok(blob.calls.every(c => c.access === 'private'));
  assert.ok(blob.calls.some(c => c.operation === 'put' && c.key === 'resumes/manifest.json' && c.ifMatch));
  assert.ok(blob.calls.filter(c => c.operation === 'get').every(c => c.useCache === false));
  assert.doesNotMatch(JSON.stringify(await (await h.get()).json()), /blob\.vercel|resumes\/files/);
});
test('cloud conditional-write conflicts preserve the active version and history', async () => {
  const blob = blobFixture(); const h = harness({ blob: blob.api, env: { RESUME_STORAGE_BACKEND: 'blob', RESUME_PRIVATE_BLOB_READ_WRITE_TOKEN: 'test-private-token' } });
  await h.upload(); const before = await h.service.listResumes(); blob.setConflict(true);
  assert.equal((await h.upload()).status, 409); const after = await h.service.listResumes(); assert.equal(after.revision, before.revision); assert.equal(after.profiles[1].versions.length, 1);
});
test('production storage never falls back to local disk when credentials are absent', async () => {
  const blob = blobFixture(); const h = harness({ blob: blob.api, env: { NODE_ENV: 'production' } });
  assert.equal((await h.get()).status, 503); assert.equal(blob.calls.length, 0);
});
test('the legacy admin document endpoint cannot read the protected resume namespace', async () => {
  const h = harness(); const route = h.load('app/api/admin/documents/route.ts'); const { NextRequest } = native('next/server');
  for (const file of ['resumes/manifest.json', '/resumes/files/test/pdf', './resumes/manifest.json', 'resumes\\manifest.json']) {
    const response = await route.GET(new NextRequest('https://resume.test/api/admin/documents?file=' + encodeURIComponent(file)));
    assert.equal(response.status, 404); assert.match(response.headers.get('cache-control'), /no-store/);
  }
});
