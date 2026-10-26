import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Book } from './catalog';

// Owner-supplied drafts are previewable only on the local development server.
// No PDF paths or bytes are passed to the browser, and checkout remains disabled.
export async function localBooks(): Promise<Book[]> {
  if (process.env.NODE_ENV !== 'development') return [];
  const records = JSON.parse(await readFile(path.join(process.cwd(), 'content/ebooks/import-catalog.json'), 'utf8'));
  return records.map((record: { product: object; profile: { sku: string }; categorySlugs: string[] }) => {
    const id = `local-${record.profile.sku}`;
    const categories = record.categorySlugs.map((slug, i) => ({ productId: id, categoryId: slug, isPrimary: i === 0, category: { id: slug, slug, name: slug === 'power-bi-dax' ? 'Power BI & DAX' : 'Data Analytics & BI', description: 'Practical independent guides for data professionals.', icon: 'BookOpen', sortOrder: i, published: true, seoTitle: null, seoDescription: null } }));
    return { ...record.product, id, createdAt: new Date('2026-10-26T00:00:00Z'), updatedAt: new Date('2026-10-26T00:00:00Z'), ebook: { ...record.profile, productId: id, categories } } as Book;
  });
}
