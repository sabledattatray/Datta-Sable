import type { Metadata } from 'next';
import AdminAccess from '@/components/admin/AdminAccess';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAccess>{children}</AdminAccess>;
}
