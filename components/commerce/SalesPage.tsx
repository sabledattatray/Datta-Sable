import { customer } from '@/lib/commerce/access';
import SalesAdmin from './SalesAdmin';
export default async function SalesPage({ tab }: { tab: string }) { try { await customer(true); } catch { return <p>Administrator access required.</p>; } return <SalesAdmin initialTab={tab} />; }
