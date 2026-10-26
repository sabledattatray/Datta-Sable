import { loadEnvConfig } from '@next/env';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import { productInput, resourceFormat } from '../lib/commerce/shared';
import { profileInput, categorySeeds } from '../lib/ebooks/validation';

loadEnvConfig(process.cwd());
const db = new PrismaClient();
async function main() {
  const apply = process.argv.includes('--apply');
  const catalogOnly = process.argv.includes('--catalog-only');
  const records = JSON.parse(await readFile('content/ebooks/import-catalog.json', 'utf8'));
  for (const record of records) {
    const product = productInput.parse(record.product), profile = profileInput.parse(record.profile);
    const filename = path.basename(record.asset.filename);
    if (filename !== record.asset.filename) throw new Error('Invalid import filename.');
    const bytes = await readFile(path.join('storage/ebooks/imports', filename));
    resourceFormat(filename, bytes);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (sha256 !== record.asset.sha256 || bytes.length !== record.asset.byteSize) throw new Error(`Checksum mismatch: ${filename}`);
    console.log(`${product.title}: ${profile.pageCount} pages, INR ${product.priceMinor / 100}, ${bytes.length} bytes, SHA-256 verified.`);
    if (!apply) continue;
    const token = process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
    if (!token && !catalogOnly) throw new Error('Configure private storage before importing files, or use --catalog-only to save disabled drafts.');
    const existing = await db.commerceProduct.findUnique({ where: { slug: product.slug }, include: { resources: { include: { asset: true } } } });
    if (existing?.status === 'PUBLISHED') throw new Error('Refusing to overwrite a published book; use the admin version workflow.');
    const productId = existing?.id || randomUUID();
    const unchanged = existing?.resources.find(r => r.active && r.asset?.sha256 === sha256);
    const blob = unchanged || catalogOnly ? null : await put(`products/${productId}/${randomUUID()}.pdf`, bytes, { token, access: 'private', contentType: 'application/pdf', addRandomSuffix: false });
    await db.$transaction(async tx => {
      await tx.commerceProduct.upsert({ where: { slug: product.slug }, create: { ...product, id: productId, status: 'DRAFT', salesEnabled: false, deliveryReady: false }, update: { ...product, status: 'DRAFT', salesEnabled: false, deliveryReady: false } });
      await tx.ebookProfile.upsert({ where: { productId }, create: { ...profile, productId, approved: false }, update: { ...profile, approved: false } });
      await tx.ebookCategoryLink.deleteMany({ where: { productId } });
      for (const [i, slug] of (record.categorySlugs as string[]).entries()) {
        const seed = categorySeeds.find(([s]) => s === slug);
        if (!seed) throw new Error('Unknown category.');
        const category = await tx.ebookCategory.upsert({ where: { slug }, create: { slug, name: seed[1], sortOrder: categorySeeds.indexOf(seed), description: `Practical independent learning resources for ${seed[1]}.` }, update: {} });
        await tx.ebookCategoryLink.create({ data: { productId, categoryId: category.id, isPrimary: i === 0 } });
      }
      if (blob) {
        await tx.commerceResource.updateMany({ where: { productId }, data: { active: false } });
        await tx.commerceResource.create({ data: { productId, title: `${profile.edition} PDF`, pathname: blob.pathname, asset: { create: { filename, sha256, byteSize: bytes.length, version: profile.version, mimeType: 'application/pdf' } } } });
      }
      await tx.auditLog.create({ data: { action: 'EBOOK_OWNER_IMPORT', status: 'SUCCESS', details: JSON.stringify({ productId, sha256, pricePaise: product.priceMinor, status: 'DRAFT', reviewNotes: record.reviewNotes }) } });
    }, { timeout: 60000, maxWait: 15000 });
    console.log(catalogOnly ? 'Saved draft catalog record. Private file delivery and sales remain disabled.' : 'Imported private asset and draft catalog record. Publication and sales remain disabled.');
  }
  if (!apply) console.log('Validation only. Run with --apply after the database migration and private storage are configured.');
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Import failed.'); process.exitCode = 1; }).finally(() => db.$disconnect());
