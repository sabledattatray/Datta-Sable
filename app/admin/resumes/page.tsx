import { customer } from '@/lib/commerce/access';
import ResumeManager from '@/components/admin/ResumeManager';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Resume management', robots: { index: false, follow: false } };
export default async function ResumesPage() {
  try { await customer(true); } catch { return <p>Administrator access required. Sign in with a verified administrator account.</p>; }
  return <ResumeManager/>;
}
