'use client';
import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
export default function SignInNotice() {
  const [open, setOpen] = useState(false);
  return <><p>Sign in with your verified account to view purchases. If the account service is temporarily unavailable, please try again shortly.</p><button onClick={() => setOpen(true)}>Sign in</button><LoginModal isOpen={open} onClose={() => setOpen(false)} callbackUrl={typeof window === 'undefined' ? undefined : window.location.href} /></>;
}
