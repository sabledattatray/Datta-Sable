import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import StoreShell from './StoreShell';
export default async function PurchasePolicy({ slug, title }: { slug: string; title: string }) {
  const page = await getDynamicPage(slug);
  if (page) return <DynamicPageRenderer title={page.title} excerpt={page.excerpt} content={page.content} />;
  return <StoreShell><h1>{title}</h1><p>This policy is awaiting administrator approval. Purchases must remain disabled until the approved policy is published.</p><p><a href="/contact">Contact Datta Sable</a> for questions.</p></StoreShell>;
}
