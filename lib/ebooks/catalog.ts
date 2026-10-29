import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { localBooks } from './local-catalog';
import { publicBookWhere } from './visibility';

export const bookInclude = { ebook: { include: { categories: { include: { category: true } } } } } satisfies Prisma.CommerceProductInclude;
export type Book = Prisma.CommerceProductGetPayload<{ include: typeof bookInclude }>;

// Local drafts are a development preview, never a production database substitute.
async function withLocalPreview<T>(query: () => Promise<T>): Promise<T | null> {
  try {
    return await query();
  } catch (error) {
    const failure = error as { name?: string; message?: string; code?: string; errorCode?: string };
    const unavailable = ['P1001', 'P1002', 'P1008', 'P1017'].includes(failure?.code || failure?.errorCode || '') ||
      (failure?.name === 'PrismaClientInitializationError' && /Can't reach database server|connection timed out/i.test(failure.message || ''));
    if (process.env.NODE_ENV !== 'development' || !unavailable) {
      if (process.env.NODE_ENV === 'development') console.warn('Ebook database query failed:', { name: failure?.name, code: failure?.code, errorCode: failure?.errorCode });
      throw error;
    }
    console.warn('Ebook database unavailable; showing local draft previews with purchases disabled.');
    return null;
  }
}
export async function catalog(params: { q?: string; category?: string; sort?: string; page?: string }) {
  const q = (params.q || '').trim().slice(0, 120);
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page || '1') || 1));
  const where: Prisma.CommerceProductWhereInput = {
    AND: [publicBookWhere, ...(q ? [{ OR: [{ title: { contains: q, mode: 'insensitive' as const } }, { excerpt: { contains: q, mode: 'insensitive' as const } }] }] : [])],
    ebook: { is: { categories: { some: { category: { published: true, ...(params.category ? { slug: params.category } : {}) } } } } },
  };
  const orderBy: Prisma.CommerceProductOrderByWithRelationInput = params.sort === 'price-asc' ? { priceMinor: 'asc' } : params.sort === 'price-desc' ? { priceMinor: 'desc' } : params.sort === 'title' ? { title: 'asc' } : { createdAt: 'desc' };
  const result = await withLocalPreview(() => Promise.all([
    prisma.commerceProduct.findMany({ where, include: bookInclude, orderBy: [orderBy, { id: 'asc' }], take: 12, skip: (page - 1) * 12 }),
    prisma.commerceProduct.count({ where }),
    prisma.ebookCategory.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' }, include: { _count: { select: { books: { where: { ebook: { product: publicBookWhere } } } } } } }),
    prisma.commerceProduct.findMany({ where: { AND: [publicBookWhere], ebook: { is: { featured: true, categories: { some: { category: { published: true } } } } } }, include: bookInclude, take: 3, orderBy: { createdAt: 'desc' } }),
  ]));

  if (result && (result[0].length > 0 || result[1] > 0)) {
    const [books, count, categories, featured] = result;
    return { books, count, categories: categories.filter(c => c._count.books > 0), featured, page, localPreview: false };
  }

  // Preview drafts locally when the database is empty or temporarily unreachable.
  if (process.env.NODE_ENV === 'development') {
    const local = await localBooks();
    if (local.length) {
      const filtered = local.filter(b => (!q || `${b.title} ${b.excerpt}`.toLowerCase().includes(q.toLowerCase())) && (!params.category || b.ebook?.categories.some(c => c.category.slug === params.category)));
      filtered.sort((a,b) => params.sort === 'price-asc' ? a.priceMinor-b.priceMinor : params.sort === 'price-desc' ? b.priceMinor-a.priceMinor : params.sort === 'title' ? a.title.localeCompare(b.title) : b.createdAt.getTime()-a.createdAt.getTime());
      const categories = [...new Map(local.flatMap(b => b.ebook!.categories.map(c => [c.categoryId, c.category] as const))).values()].map(c => ({ ...c, _count: { books: local.filter(b => b.ebook?.categories.some(link => link.categoryId === c.id)).length } }));
      return { books: filtered.slice((page-1)*12,page*12), count: filtered.length, categories, featured: local.filter(b => b.ebook?.featured), page, localPreview: true };
    }
  }

  return { books: [], count: 0, categories: [], featured: [], page, localPreview: false };
}
export async function publishedBook(slug: string) {
  // Query authoritative database record first
  const dbBook = await withLocalPreview(() => prisma.commerceProduct.findFirst({
    where: { slug, AND: [publicBookWhere], ebook: { is: { categories: { some: { category: { published: true } } } } } },
    include: bookInclude,
  }));
  if (dbBook) return dbBook;

  // Fallback to local preview catalog in development if database has no matching book
  if (process.env.NODE_ENV === 'development') {
    const local = (await localBooks()).find(b => b.slug === slug);
    if (local) return local;
  }
  return null;
}
