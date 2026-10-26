import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ebookEnabled } from '@/lib/ebooks/validation';
import Catalog from '@/components/ebooks/Catalog';
import { localBooks } from '@/lib/ebooks/local-catalog';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
async function categoryBySlug(slug: string) {
  const local = (await localBooks()).flatMap(b => b.ebook!.categories).find(c => c.category.slug === slug);
  if (local) return local.category;
  return prisma.ebookCategory.findFirst({ where: { slug, published: true, books: { some: { ebook: { product: { status: 'PUBLISHED' } } } } } });
}
export async function generateMetadata({ params }: Props) { if (!ebookEnabled()) return { robots: { index: false } }; const { slug } = await params; const category = await categoryBySlug(slug); return { title: category?.seoTitle || category?.name || 'eBook category', description: category?.seoDescription || category?.description, robots: process.env.NODE_ENV === 'development' ? { index: false, follow: false } : undefined, alternates: { canonical: `https://dattasable.com/ebooks/category/${slug}` } }; }
export default async function Page({ params }: Props) { if (!ebookEnabled()) notFound(); const { slug } = await params; const category = await categoryBySlug(slug); if (!category) notFound(); return <Catalog params={{ category: slug }} categoryName={category.name}/>; }
