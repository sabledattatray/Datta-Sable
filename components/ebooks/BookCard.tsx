import Image from 'next/image';
import { BookLink } from './Analytics';
import { BookOpen, ArrowUpRight, FileText } from 'lucide-react';
import type { Book } from '@/lib/ebooks/catalog';
import { money } from '@/lib/commerce/format';
import s from './Books.module.css';
export function Cover({ image, title, priority = false }: { image: string | null; title: string; priority?: boolean }) {
  return <div className={s.cover}>{image ? <Image src={image} alt={`${title} book cover`} fill sizes="(max-width: 600px) 200px, 350px" priority={priority}/> : <div className={s.placeholder}><span><BookOpen size={32}/><br/>Cover awaiting upload</span></div>}</div>;
}
export default function BookCard({ book }: { book: Book }) {
  const item = { item_id: book.id, item_name: book.title, item_category: book.category, price: book.priceMinor / 100, currency: book.currency };
  const available = book.status === 'PUBLISHED' && book.salesEnabled && book.deliveryReady && book.ebook?.approved;
  return <article className={s.card}>
    <div className={s.cardArtwork}>
      <span className={s.bookBadge}>{available ? 'Digital edition' : 'Coming soon'}</span>
      <BookLink item={item} href={`/ebooks/${book.slug}`}><Cover image={book.image} title={book.title}/></BookLink>
      <span className={s.artworkCaption}>THE DATTA SABLE COLLECTION</span>
    </div>
    <div className={s.cardBody}>
      <p className={s.eyebrow}>{book.category}</p>
      <h3><BookLink item={item} href={`/ebooks/${book.slug}`}>{book.title}</BookLink></h3>
      <p className={s.cardExcerpt}>{book.excerpt}</p>
      <div className={s.meta}><span><FileText size={14} aria-hidden="true"/>{book.ebook?.pageCount ? `${book.ebook.pageCount} pages · PDF` : 'PDF edition'}</span><span>{book.ebook?.edition}</span></div>
      <div className={s.cardFooter}>
        <div><span className={s.price}>{money(book.priceMinor, book.currency)}</span><span className={s.priceCaption}>By Datta Sable</span></div>
        <BookLink item={item} className={s.cardDetails} href={`/ebooks/${book.slug}`}>View book <ArrowUpRight size={16} aria-hidden="true"/></BookLink>
      </div>
      {available ? <BookLink item={item} className={s.button} href={`/ebooks/${book.slug}#purchase`}>Buy for {money(book.priceMinor, book.currency)} <ArrowUpRight size={16} aria-hidden="true"/></BookLink> : <span className={s.cardUpcoming}>In preparation · Explore the contents</span>}
    </div>
  </article>;
}

