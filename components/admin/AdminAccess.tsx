'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import AdminDashboardWrapper from '@/app/admin/AdminDashboardWrapper';

export default function AdminAccess({ children }: { children: React.ReactNode }) {
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

    // If unauthenticated and not on login page, redirect to login
    if (status === 'unauthenticated' && !isAuthPath && pathname !== '/admin/login') {
      console.log('User unauthenticated, redirecting to login');
      router.push('/admin/login');
      return;
    }

  }, [mounted, status, pathname, router, session, isAuthPath]);

  if (!mounted || status === 'loading') return null;

  // Allow new auth paths to be rendered with the wrapper (for router context)
  if (isAuthPath) {
    return <>{children}</>;
  }

  // Prevent flicker: Do not render admin wrapper if not an admin
  const isAdmin = status === 'authenticated' && (session?.user as any)?.role === 'ADMIN';

  if (!isAdmin) {
    if (status === 'authenticated') {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h1>Admin access unavailable</h1>
          <p>Your current session does not have administrator access. Sign in with your admin account. If this is your admin account, check its role and the production authentication logs.</p>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })}>Sign out and try again</button>
        </main>
      );
    }
    return null;
  }

  return (
    <>
      <AdminDashboardWrapper>
        {children}
      </AdminDashboardWrapper>
    </>
  );
}
