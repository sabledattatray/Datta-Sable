import { loadEnvConfig } from '@next/env';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { resourceFormat } from '../lib/commerce/shared';

loadEnvConfig(process.cwd());
const db = new PrismaClient();
type Evidence = { productId: string; slug: string; pathname: string; filename: string; byteSize: number; sha256: string; etag: string; storeId: string; private: boolean; anonymousStatus: number };
async function main() {
  const rows = JSON.parse(await readFile('storage/ebooks/private-upload-evidence.json', 'utf8')) as Evidence[];
  for (const row of rows) {
    if (!row.private || row.anonymousStatus !== 403 || row.storeId !== 'store_7M5Dulf2qP39817d' || path.basename(row.filename) !== row.filename || row.pathname !== `products/${row.productId}/${row.filename}`) throw new Error('Private upload evidence is incomplete or inconsistent.');
    const bytes = await readFile(path.join('storage/ebooks/imports', row.filename)); resourceFormat(row.filename, bytes);
    if (bytes.length !== row.byteSize || createHash('sha256').update(bytes).digest('hex') !== row.sha256 || createHash('md5').update(bytes).digest('hex') !== row.etag) throw new Error('Uploaded file checksum mismatch.');
    await db.$transaction(async tx => {
      const book = await tx.commerceProduct.findUniqueOrThrow({ where: { id: row.productId }, include: { ebook: true } });
      if (book.slug !== row.slug || !book.ebook || book.status === 'PUBLISHED') throw new Error('Use the admin version workflow for published or mismatched products.');
      const existing = await tx.commerceResource.findUnique({ where: { pathname: row.pathname }, include: { asset: true } });
      if (existing && (existing.productId !== book.id || existing.asset?.sha256 !== row.sha256)) throw new Error('Existing resource does not match the verified file.');
      await tx.commerceResource.updateMany({ where: { productId: book.id, ...(existing ? { id: { not: existing.id } } : {}) }, data: { active: false } });
      if (existing) await tx.commerceResource.update({ where: { id: existing.id }, data: { active: true } });
      else await tx.commerceResource.create({ data: { productId: book.id, pathname: row.pathname, title: `${book.ebook.edition} PDF`, asset: { create: { filename: row.filename, sha256: row.sha256, byteSize: row.byteSize, mimeType: 'application/pdf', version: book.ebook.version } } } });
      await tx.commerceProduct.update({ where: { id: book.id }, data: { deliveryReady: true, salesEnabled: false, status: 'DRAFT' } });
      await tx.ebookProfile.update({ where: { productId: book.id }, data: { approved: false } });
      await tx.auditLog.create({ data: { action: 'EBOOK_PRIVATE_UPLOAD_REGISTERED', status: 'SUCCESS', details: JSON.stringify({ productId: book.id, sha256: row.sha256, byteSize: row.byteSize, storeId: row.storeId, anonymousStatus: row.anonymousStatus }) } });
    }, { timeout: 60000, maxWait: 15000 });
    console.log(`${row.slug}: verified private PDF attached; draft and sales-disabled state preserved.`);
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Private upload registration failed.'); process.exitCode = 1; }).finally(() => db.$disconnect());
