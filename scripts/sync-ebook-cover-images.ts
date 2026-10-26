import { loadEnvConfig } from '@next/env';
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { productInput } from '../lib/commerce/shared';

loadEnvConfig(process.cwd());
const db = new PrismaClient();
async function main() {
  const records = JSON.parse(await readFile('content/ebooks/import-catalog.json', 'utf8'));
  for (const record of records) {
    const product = productInput.parse(record.product);
    if (!product.image || !new URL(product.image).hostname.endsWith('.public.blob.vercel-storage.com')) throw new Error('A verified public cover image URL is required.');
    await db.$transaction(async tx => {
      const book = await tx.commerceProduct.findUniqueOrThrow({ where: { slug: product.slug }, include: { ebook: true } });
      if (!book.ebook || book.ebook.sku !== record.profile.sku) throw new Error('The eBook identity does not match the cover.');
      await tx.commerceProduct.update({ where: { id: book.id }, data: { image: product.image } });
      await tx.auditLog.create({ data: { action: 'EBOOK_COVER_UPDATED', status: 'SUCCESS', details: JSON.stringify({ productId: book.id, before: book.image, after: product.image }) } });
    }, { timeout: 60000, maxWait: 15000 });
    console.log(`${product.slug}: thumbnail URL saved; pricing, sales and private files unchanged.`);
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Cover sync failed.'); process.exitCode = 1; }).finally(() => db.$disconnect());
