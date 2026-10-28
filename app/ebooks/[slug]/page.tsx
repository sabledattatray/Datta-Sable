import { notFound } from 'next/navigation';
import Link from 'next/link';
import { publishedBook } from '@/lib/ebooks/catalog';
import { ebookEnabled, ebookPaymentMode } from '@/lib/ebooks/validation';
import { ebookCheckoutReady } from '@/lib/ebooks/checkout';
import { money } from '@/lib/commerce/format';
import { safeJsonLd } from '@/lib/commerce/product-details';
import Shell from '@/components/ebooks/Shell';
import { BookAnalytics } from '@/components/ebooks/Analytics';
import { Cover } from '@/components/ebooks/BookCard';
import { BuyBook } from '@/components/ebooks/Reader';
import s from '@/components/ebooks/Books.module.css';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  if (!ebookEnabled()) return { robots: { index: false } };
  const book = await publishedBook((await params).slug); if (!book) return { title: 'Book not found', robots: { index: false } };
  const title = book.seoTitle || `${book.title} | ${book.ebook?.edition}`, description = book.seoDescription || book.excerpt, url = `https://dattasable.com/ebooks/${book.slug}`;
  const isIndexed = book.status === 'PUBLISHED';
  return {
    title,
    description,
    robots: isIndexed ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', ...(book.image ? { images: [{ url: book.image, alt: `${book.title} cover` }] } : {}) },
    twitter: { card: 'summary_large_image' as const, title, description, ...(book.image ? { images: [book.image] } : {}) }
  };
}
export default async function Page({ params }: Props) {
  if (!ebookEnabled()) notFound();
  const book = await publishedBook((await params).slug); if (!book?.ebook) notFound(); const profile=book.ebook;
  const available = book.status === 'PUBLISHED' && book.salesEnabled && book.deliveryReady && profile.approved && ebookCheckoutReady();
  const url=`https://dattasable.com/ebooks/${book.slug}`;
  const schema=[{'@context':'https://schema.org','@type':['Book','Product'],name:`${book.title} | ${profile.edition}`,description:book.excerpt,author:{'@type':'Person',name:profile.author},bookEdition:profile.edition,bookFormat:'https://schema.org/EBook',numberOfPages:profile.pageCount,inLanguage:profile.language,sku:profile.sku,url,...(book.image?{image:book.image}:{})},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'eBooks',item:'https://dattasable.com/ebooks'},{'@type':'ListItem',position:2,name:book.title,item:url}]}];
  return <Shell>{book.status !== "PUBLISHED" && <p role="note" className={s.notice}>Coming soon · ₹99 · Browse the contents below. This book is not available for purchase yet.</p>}<BookAnalytics detail items={[{item_id:book.id,item_name:book.title,item_category:book.category,price:book.priceMinor/100,currency:book.currency}]}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(schema)}}/><section className={s.detail}><div><Cover image={book.image} title={book.title} priority/><div className={s.section}><h2>Inside the handbook</h2><ol>{profile.contents.map(t=><li key={t}>{t}</li>)}</ol></div></div><div className={s.purchase}><div className={s.eyebrow}>{book.category} / {profile.edition}</div><h1>{book.title}</h1><p>By {profile.author}</p><p>{book.excerpt}</p><div className={s.meta}><span>{profile.pageCount} pages</span><span>PDF</span><span>{profile.language}</span><span>Updated {book.updatedAt.toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</span></div><span className={s.price}>{money(book.priceMinor,book.currency)}</span><BuyBook productId={book.id} title={book.title} amount={book.priceMinor} available={available} testMode={ebookPaymentMode() === 'test'}/><p className={s.note}>Independent educational resource. Not affiliated with or endorsed by Microsoft. <Link href="/contact">Contact the author</Link>.</p></div></section><section className={s.section}><h2>A practical handbook</h2><p style={{whiteSpace:'pre-line'}}>{book.description}</p></section><div className={s.columns}>{[['What you will practice',profile.outcomes],['Who it is for',profile.audience],['Before you start',profile.prerequisites],['Included files',book.includedResources],['Not included',profile.notIncluded]].map(([heading,items])=><section className={s.section} key={String(heading)}><h2>{String(heading)}</h2><ul>{(items as string[]).map(t=><li key={t}>{t}</li>)}</ul></section>)}</div><section className={`${s.section} ${s.faq}`}><h2>Delivery, licensing & updates</h2><details><summary>How do I receive this PDF?</summary><p>After a server-verified captured payment, access appears in your private library. Sign in or verify your purchase email. Download links expire and can be regenerated in the library. Payment receipts are queued separately; email failure does not remove access.</p></details><details><summary>Can I share the file?</summary><p>{profile.license}</p></details><details><summary>What updates are included?</summary><p>{profile.updatePolicy}</p></details><details><summary>Where can I get purchase support?</summary><p><Link href="/contact">Contact Datta Sable</Link> with your order number. Review the <Link href="/refund-policy">refund policy</Link> before purchase.</p></details></section></Shell>;
}




