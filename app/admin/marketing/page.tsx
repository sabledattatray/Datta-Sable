import { redirect } from 'next/navigation';

export default function MarketingRedirectPage() {
  redirect('/admin/marketing/campaigns');
}
