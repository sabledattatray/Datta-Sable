'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInReturnPath } from '@/lib/sign-in-path';

// Shared entry point for checkout and account screens that request sign-in.
export default function LoginModal({ isOpen, onClose, callbackUrl }: { isOpen: boolean; onClose: () => void; callbackUrl?: string }) {
  const router = useRouter();
  useEffect(() => {
    if (!isOpen) return;
    const target = signInReturnPath(callbackUrl || window.location.href, window.location.origin);
    onClose();
    router.push('/sign-in?callbackUrl=' + encodeURIComponent(target));
  }, [isOpen, callbackUrl, onClose, router]);
  return null;
}
