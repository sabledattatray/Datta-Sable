import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ebookEnabled } from '@/lib/ebooks/validation';
import Catalog from '@/components/ebooks/Catalog';
import { localBooks } from '@/lib/ebooks/local-catalog';
import { publicBookWhere } from '@/lib/ebooks/visibility';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
async function categoryBySlug(slug: string) {
  const dbCategory = await prisma.ebookCategory.findFirst({
    where: { slug, published: true },
    include: {
      books: {
        where: { ebook: { product: { status: 'PUBLISHED' } } },
        select: { productId: true },
      },
    },
  });
  if (dbCategory) return dbCategory;

  if (process.env.NODE_ENV === 'development') {
    const local = (await localBooks()).flatMap(b => b.ebook!.categories).find(c => c.category.slug === slug);
    if (local) return { ...local.category, books: [] };
  }
  return null;
}
export async function generateMetadata({ params }: Props) {
  if (!ebookEnabled()) return { robots: { index: false } };
  const { slug } = await params;
  const category = await categoryBySlug(slug);
  const hasPublishedBooks = (category?.books?.length ?? 0) > 0;
  return {
    title: category?.seoTitle || category?.name || 'eBook category',
    description: category?.seoDescription || category?.description,
    robots: hasPublishedBooks ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical: `https://dattasable.com/ebooks/category/${slug}` },
  };
}
export default async function Page({ params }: Props) { if (!ebookEnabled()) notFound(); const { slug } = await params; const category = await categoryBySlug(slug); if (!category) notFound(); return <Catalog params={{ category: slug }} categoryName={category.name}/>; }
