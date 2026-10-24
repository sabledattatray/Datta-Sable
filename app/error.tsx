'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for internal tracking if needed
    console.error('Unhandled error:', error);
    
    // Redirect to home page
    router.push('/');
  }, [error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto mb-4" />
        <p className="mono text-[length:var(--text-small)] text-[var(--accent)] uppercase tracking-widest">
          Synchronizing System...
        </p>
      </div>
    </div>
  );
}
