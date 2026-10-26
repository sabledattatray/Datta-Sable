import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import s from './Books.module.css';
export default function Shell({ children }: { children: React.ReactNode }) {
  return <><Navbar/><div className={s.page}><nav className={s.top} aria-label="eBook navigation"><div><Link href="/">Home</Link> / <Link href="/ebooks">eBooks</Link></div><div><Link href="/products">All products</Link> · <Link href="/ebooks/library">My library</Link> · <Link href="/contact">Support</Link></div></nav>{children}<nav className={s.policies} aria-label="Purchase policies"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund-policy">Refund policy</Link><Link href="/delivery-policy">Delivery policy</Link><Link href="/contact">Contact Datta Sable</Link></nav></div><Footer/></>;
}

