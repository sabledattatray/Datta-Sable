import 'server-only';
import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { get, put, BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';
import { emptyManifest, manifestSchema, ResumeError, type Manifest } from './model';

const manifestKey = 'resumes/manifest.json';
function cloud() { return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || process.env.RESUME_STORAGE_BACKEND === 'blob'; }
function credentials() {
  const token = process.env.RESUME_PRIVATE_BLOB_READ_WRITE_TOKEN || process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
  if (!token) throw new ResumeError('Private resume storage is not configured. Configure the dedicated private Blob token before deployment.', 503);
  // Explicit store ID prevents an unrelated default public store being selected by OIDC.
  return { token, storeId: process.env.RESUME_PRIVATE_BLOB_STORE_ID || process.env.COMMERCE_BLOB_STORE_ID };
}
export function localRoot() {
  if (process.env.RESUME_TEST_ROOT && process.env.NODE_ENV === 'test') return path.resolve(process.env.RESUME_TEST_ROOT);
  return path.join(process.cwd(), 'storage/resumes');
}
function localPath(key: string) {
  if (key !== manifestKey && !/^resumes\/files\/[a-f0-9-]{36}\/(pdf|docx)$/.test(key)) throw new ResumeError('Invalid document identifier.');
  return path.join(localRoot(), ...key.split('/').slice(1));
}
export async function readObject(key: string): Promise<{ bytes: Buffer; etag: string } | null> {
  if (cloud()) {
    try {
      const result = await get(key, { ...credentials(), access: 'private', useCache: false });
      if (!result) return null;
      if (result.statusCode !== 200 || !new URL(result.blob.url).hostname.endsWith('.private.blob.vercel-storage.com')) throw new ResumeError('Private storage verification failed.', 503);
      return { bytes: Buffer.from(await new Response(result.stream).arrayBuffer()), etag: result.blob.etag };
    } catch (error) { if (error instanceof BlobNotFoundError) return null; throw error; }
  }
  try { return { bytes: await readFile(localPath(key)), etag: '' }; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}
export async function writeDocument(key: string, bytes: Buffer, contentType: string) {
  if (cloud()) {
    const result = await put(key, bytes, { ...credentials(), access: 'private', addRandomSuffix: false, contentType, cacheControlMaxAge: 60 });
    if (!new URL(result.url).hostname.endsWith('.private.blob.vercel-storage.com')) throw new ResumeError('The resume store must be private.', 503);
    return;
  }
  const target = localPath(key); await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, bytes, { flag: 'wx' });
}
export async function readManifest() {
  const object = await readObject(manifestKey);
  return { manifest: object ? manifestSchema.parse(JSON.parse(object.bytes.toString('utf8'))) : emptyManifest(), etag: object?.etag };
}
export async function updateManifest(expected: string, mutate: (manifest: Manifest) => void) {
  let lock: Awaited<ReturnType<typeof open>> | undefined;
  if (!cloud()) {
    await mkdir(localRoot(), { recursive: true });
    try { lock = await open(path.join(localRoot(), 'manifest.lock'), 'wx'); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new ResumeError('Another update is in progress. Refresh and retry.', 409); throw error; }
  }
  try {
    const { manifest, etag } = await readManifest();
    if (manifest.revision !== expected) throw new ResumeError('The resume collection changed. Refresh before saving.', 409);
    mutate(manifest); manifest.revision = randomUUID(); manifestSchema.parse(manifest);
    const bytes = Buffer.from(JSON.stringify(manifest));
    if (cloud()) {
      try { await put(manifestKey, bytes, { ...credentials(), access: 'private', contentType: 'application/json', addRandomSuffix: false, cacheControlMaxAge: 60, ...(etag ? { ifMatch: etag } : { allowOverwrite: false }) }); }
      catch (error) { if (error instanceof BlobPreconditionFailedError) throw new ResumeError('Concurrent update detected. Refresh and retry.', 409); throw error; }
    } else {
      const temporary = path.join(localRoot(), `manifest-${randomUUID()}.tmp`); await writeFile(temporary, bytes); await rename(temporary, localPath(manifestKey));
    }
    return manifest;
  } finally { if (lock) { await lock.close(); await unlink(path.join(localRoot(), 'manifest.lock')); } }
}
