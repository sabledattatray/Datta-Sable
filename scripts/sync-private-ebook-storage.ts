import { loadEnvConfig } from '@next/env';
import { createHash, randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { get, head, put, BlobNotFoundError } from '@vercel/blob';
import { resourceFormat } from '../lib/commerce/shared';

loadEnvConfig(process.cwd());
const db = new PrismaClient();
const apply = process.argv.includes('--apply');
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

async function main() {
  const records = JSON.parse(await readFile('content/ebooks/import-catalog.json', 'utf8')) as {
    product: { slug: string }; profile: { version: string; edition: string };
    asset: { filename: string; sha256: string; byteSize: number };
  }[];
  // Check every source before any cloud writes.
  const sources = await Promise.all(records.map(async record => {
    if (path.basename(record.asset.filename) !== record.asset.filename) throw new Error('Invalid source filename.');
    const bytes = await readFile(path.join('storage/ebooks/imports', record.asset.filename));
    resourceFormat(record.asset.filename, bytes);
    if (bytes.length !== record.asset.byteSize || hash(bytes) !== record.asset.sha256) throw new Error(`Source checksum mismatch: ${record.product.slug}`);
    return { record, bytes };
  }));
  console.log(`Verified ${sources.length} local PDF checksums (${sources.reduce((n, s) => n + s.bytes.length, 0)} bytes).`);
  const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('COMMERCE_BLOB_READ_WRITE_TOKEN is required to audit private storage. Source files are valid; no uploads or database changes were made.');
  let missing = 0;
  for (const { record, bytes } of sources) {
    const book = await db.commerceProduct.findUnique({ where: { slug: record.product.slug }, include: { ebook: true, resources: { where: { active: true }, include: { asset: true } } } });
    if (!book?.ebook) throw new Error(`Create the draft catalog entry first: ${record.product.slug}`);
    const matching = book.resources.find(r => r.asset?.sha256 === record.asset.sha256 && r.asset.version === book.ebook!.version);
    if (!matching && book.resources.length) throw new Error(`Active PDF differs from the source for ${book.slug}. Use the version workflow; existing purchases are preserved.`);
    if (book.ebook.version !== record.profile.version) throw new Error(`Version differs for ${book.slug}.`);
    let pathname = matching?.pathname;
    let exists = false;
    if (pathname) {
      try {
        const info = await head(pathname, { token });
        if (!new URL(info.url).hostname.endsWith('.private.blob.vercel-storage.com') || info.size !== bytes.length || info.contentType !== 'application/pdf') throw new Error(`Private file metadata mismatch: ${book.slug}`);
        const result = await get(pathname, { token, access: 'private', useCache: false });
        if (!result || result.statusCode !== 200 || !result.stream || hash(Buffer.from(await new Response(result.stream).arrayBuffer())) !== record.asset.sha256) throw new Error(`Cloud checksum mismatch: ${book.slug}`);
        exists = true;
      } catch (error) { if (!(error instanceof BlobNotFoundError)) throw error; }
    }
    if (exists) { console.log(`${book.slug}: private PDF verified.`); continue; }
    missing++;
    if (!apply) { console.log(`${book.slug}: private upload required.`); continue; }
    pathname ||= `products/${book.id}/${randomUUID()}.pdf`;
    const blob = await put(pathname, bytes, { token, access: 'private', contentType: 'application/pdf', addRandomSuffix: false });
    const uploaded = await get(blob.pathname, { token, access: 'private', useCache: false });
    if (!uploaded || uploaded.statusCode !== 200 || !uploaded.stream || hash(Buffer.from(await new Response(uploaded.stream).arrayBuffer())) !== record.asset.sha256) throw new Error(`Uploaded checksum verification failed: ${book.slug}`);
    const anonymous = await fetch(blob.url, { method: 'HEAD' });
    if (anonymous.status !== 403 && anonymous.status !== 401) throw new Error(`Anonymous access was not denied: ${book.slug}`);
    await db.$transaction(async tx => {
      const current = await tx.commerceResource.findMany({ where: { productId: book.id, active: true } });
      if (current.length !== book.resources.length || current.some(r => !book.resources.some(old => old.id === r.id && old.pathname === r.pathname))) throw new Error(`Resources changed during upload: ${book.slug}. Retry the audit.`);
      if (!matching) await tx.commerceResource.create({ data: { productId: book.id, pathname: blob.pathname, title: `${record.profile.edition} PDF`, asset: { create: { filename: record.asset.filename, byteSize: bytes.length, sha256: record.asset.sha256, version: record.profile.version, mimeType: 'application/pdf' } } } });
      await tx.auditLog.create({ data: { action: 'EBOOK_PRIVATE_STORAGE_REPAIRED', status: 'SUCCESS', details: JSON.stringify({ productId: book.id, pathname: blob.pathname, sha256: record.asset.sha256 }) } });
      // Publication, approval, sales, orders and purchased resource snapshots stay unchanged.
    });
    console.log(`${book.slug}: uploaded and verified privately; publication state preserved.`);
  }
  console.log(`${missing} ${apply ? 'files repaired' : 'files need upload; run with --apply to repair'}.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Storage audit failed.'); process.exitCode = 1; }).finally(() => db.$disconnect());
