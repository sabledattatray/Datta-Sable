import Link from 'next/link';
import SalesPage from '@/components/commerce/SalesPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <>
    <section style={{ marginBottom: 24 }}>
      <h1>Purchase receipts</h1>
      <p>Review receipt delivery for recorded purchases below. <Link href="/admin/orders">View orders and payment details</Link>.</p>
      <p>PDF invoices are not available. Payment receipts are sent by email; test receipts are marked TEST and are not tax invoices.</p>
    </section>
    <SalesPage tab="emails" />
  </>;
}
