import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ebookEnabled } from '@/lib/ebooks/validation';
import Catalog from '@/components/ebooks/Catalog';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }): Promise<Metadata> {
  const query = await searchParams;
  return { title: 'Practical eBooks for Data, Analytics & Technology', description: 'Independent practical PDF handbooks by Datta Sable. Explore data, analytics and technology through guided workflows.', alternates: { canonical: 'https://dattasable.com/ebooks' }, robots: Object.values(query).some(Boolean) ? { index: false, follow: true } : undefined };
}
export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) { if (!ebookEnabled()) notFound(); return <Catalog params={await searchParams}/>; }
