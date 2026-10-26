import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { localBooks } from './local-catalog';

export const bookInclude = { ebook: { include: { categories: { include: { category: true } } } } } satisfies Prisma.CommerceProductInclude;
export type Book = Prisma.CommerceProductGetPayload<{ include: typeof bookInclude }>;
export async function catalog(params: { q?: string; category?: string; sort?: string; page?: string }) {
  const q = (params.q || '').trim().slice(0, 120);
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page || '1') || 1));
  const local = await localBooks();
  if (local.length) {
    const filtered = local.filter(b => (!q || `${b.title} ${b.excerpt}`.toLowerCase().includes(q.toLowerCase())) && (!params.category || b.ebook?.categories.some(c => c.category.slug === params.category)));
    filtered.sort((a,b) => params.sort === 'price-asc' ? a.priceMinor-b.priceMinor : params.sort === 'price-desc' ? b.priceMinor-a.priceMinor : params.sort === 'title' ? a.title.localeCompare(b.title) : b.createdAt.getTime()-a.createdAt.getTime());
    const categories = [...new Map(local.flatMap(b => b.ebook!.categories.map(c => [c.categoryId, c.category] as const))).values()].map(c => ({ ...c, _count: { books: local.filter(b => b.ebook?.categories.some(link => link.categoryId === c.id)).length } }));
    return { books: filtered.slice((page-1)*12,page*12), count: filtered.length, categories, featured: local.filter(b => b.ebook?.featured), page, localPreview: true };
  }
  const where: Prisma.CommerceProductWhereInput = { status: 'PUBLISHED', ebook: { is: { categories: { some: { category: { published: true, ...(params.category ? { slug: params.category } : {}) } } } } },
    ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }] } : {}),
  };
  const orderBy: Prisma.CommerceProductOrderByWithRelationInput = params.sort === 'price-asc' ? { priceMinor: 'asc' } : params.sort === 'price-desc' ? { priceMinor: 'desc' } : params.sort === 'title' ? { title: 'asc' } : { createdAt: 'desc' };
  const [books, count, categories, featured] = await Promise.all([
    prisma.commerceProduct.findMany({ where, include: bookInclude, orderBy: [orderBy, { id: 'asc' }], take: 12, skip: (page - 1) * 12 }),
    prisma.commerceProduct.count({ where }),
    prisma.ebookCategory.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' }, include: { _count: { select: { books: { where: { ebook: { product: { status: 'PUBLISHED' } } } } } } } }),
    prisma.commerceProduct.findMany({ where: { status: 'PUBLISHED', ebook: { is: { featured: true } } }, include: bookInclude, take: 3, orderBy: { createdAt: 'desc' } }),
  ]);
  return { books, count, categories: categories.filter(c => c._count.books > 0), featured, page, localPreview: false };
}
export async function publishedBook(slug: string) {
  const local = (await localBooks()).find(b => b.slug === slug);
  if (local) return local;
  return prisma.commerceProduct.findFirst({ where: { slug, status: 'PUBLISHED', ebook: { isNot: null } }, include: bookInclude });
}
