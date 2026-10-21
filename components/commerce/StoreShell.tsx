import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './Commerce.module.css';
import { ShoppingBag, FolderHeart, ArrowLeft } from 'lucide-react';

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className={styles.shell}>
        <nav aria-label="Commerce account navigation" style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            Back to Marketplace
          </Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <Link href="/account/purchases" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text)', textDecoration: 'none' }}>
            <FolderHeart size={14} style={{ color: 'var(--accent)' }} />
            My Purchases
          </Link>
          <Link href="/account/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none' }}>
            <ShoppingBag size={14} />
            My Orders
          </Link>
        </nav>
        {children}
      </main>
      <Footer />
    </>
  );
}

