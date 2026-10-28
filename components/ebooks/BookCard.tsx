import Image from 'next/image';
import { BookLink } from './Analytics';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import type { Book } from '@/lib/ebooks/catalog';
import { money } from '@/lib/commerce/format';
import s from './Books.module.css';
export function Cover({ image, title, priority = false }: { image: string | null; title: string; priority?: boolean }) {
  return <div className={s.cover}>{image ? <Image src={image} alt={`${title} book cover`} fill sizes="(max-width: 600px) 200px, 350px" priority={priority}/> : <div className={s.placeholder}><span><BookOpen size={32}/><br/>Cover awaiting upload</span></div>}</div>;
}
export default function BookCard({ book }: { book: Book }) {
  const item = { item_id: book.id, item_name: book.title, item_category: book.category, price: book.priceMinor / 100, currency: book.currency };
  return <article className={s.card}><BookLink item={item} href={`/ebooks/${book.slug}`}><Cover image={book.image} title={book.title}/></BookLink><p className={s.eyebrow}>{book.category}</p><h3><BookLink item={item} href={`/ebooks/${book.slug}`}>{book.title}</BookLink></h3><p>{book.excerpt}</p><div className={s.meta}><span>{book.ebook?.edition}</span><span>{book.ebook?.pageCount} pages · PDF</span></div><div className={s.actions}><span className={s.price}>{money(book.priceMinor, book.currency)}</span><BookLink item={item} className={s.secondary} href={`/ebooks/${book.slug}`}>View book <ArrowUpRight size={15}/></BookLink>{book.status === 'PUBLISHED' && book.salesEnabled && book.ebook?.approved ? <BookLink item={item} className={s.button} href={`/ebooks/${book.slug}#purchase`}>Buy for {money(book.priceMinor, book.currency)}</BookLink> : <span className={s.note}>Coming soon</span>}</div></article>;
}

