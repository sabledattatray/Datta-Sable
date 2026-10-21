import { ownedOrder } from '@/lib/commerce/access';
import OrderStatus from '@/components/commerce/OrderStatus';
import SignInNotice from '@/components/commerce/SignInNotice';
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await ownedOrder(id); } catch { return <SignInNotice />; }
  return <OrderStatus id={id} />;
}
