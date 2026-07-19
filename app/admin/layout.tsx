'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminDashboardWrapper from './AdminDashboardWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPath = pathname?.startsWith('/admin/auth') || pathname === '/admin/login';

  useEffect(() => {
    if (!mounted || status === 'loading') return;

    const isAdmin = status === 'authenticated' && (session?.user as any)?.role === 'ADMIN';

    // If unauthenticated and not on login page, redirect to login
    if (status === 'unauthenticated' && !isAuthPath && pathname !== '/admin/login') {
      console.log('User unauthenticated, redirecting to login');
      router.push('/admin/login');
      return;
    }
    
    // If authenticated but not an admin, redirect to home page
    // Note: We check if status is specifically 'authenticated' to avoid race conditions
    if (status === 'authenticated' && !isAuthPath && pathname !== '/admin/login') {
      if ((session?.user as any)?.role !== 'ADMIN') {
        console.warn('Access denied: User role is not ADMIN. Redirecting to home.');
        router.push('/');
      }
    }
  }, [mounted, status, pathname, router, session, isAuthPath]);

  if (!mounted || status === 'loading') return null;

  // Allow new auth paths to be rendered with the wrapper (for router context)
  if (isAuthPath) {
    return (
      <AdminDashboardWrapper>
        {children}
      </AdminDashboardWrapper>
    );
  }

  // Prevent flicker: Do not render admin wrapper if not an admin
  const isAdmin = status === 'authenticated' && (session?.user as any)?.role === 'ADMIN';
  
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <AdminDashboardWrapper>
        {children}
      </AdminDashboardWrapper>
    </>
  );
}
