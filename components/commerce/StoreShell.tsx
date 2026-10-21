import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './Commerce.module.css';
export default function StoreShell({ children }: { children: React.ReactNode }) {
  return <><Navbar /><main className={styles.shell}><nav aria-label="Purchases"><Link href="/products">Learning resources</Link><Link href="/account/orders">My orders</Link><Link href="/account/purchases">My purchases</Link></nav>{children}</main><Footer /></>;
}
