import type { Metadata } from 'next';
import StoreShell from '@/components/commerce/StoreShell';
import OrderStatus from '@/components/commerce/OrderStatus';
export const metadata: Metadata = { title: 'Payment status', robots: { index: false, follow: false } };
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return <StoreShell>{order ? <OrderStatus id={order} /> : <p>No order selected. Open My Orders to check your payment.</p>}</StoreShell>;
}
