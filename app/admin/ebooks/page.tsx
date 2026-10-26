import { customer } from '@/lib/commerce/access';
import Admin from '@/components/ebooks/Admin';
export const dynamic='force-dynamic';
export default async function Page(){try{await customer(true);}catch{return <p>Administrator access required.</p>;}return <Admin/>;}
