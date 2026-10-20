'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import styles from './HeaderAccount.module.css';

export default function HeaderAccount({ name, isAdmin, onSignOut }: { name?: string | null; isAdmin: boolean; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  return <div className={styles.root} ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <button type="button" className={styles.trigger} ref={trigger} aria-label="Your account" aria-expanded={open} aria-controls="header-account-panel" onClick={() => setOpen(value => !value)}>
      <span className={styles.avatar}>{name?.trim().charAt(0).toUpperCase() || <User size={15} aria-hidden="true" />}</span>
      <ChevronDown size={12} aria-hidden="true" className={open ? styles.rotated : undefined} />
    </button>
    {open && <div id="header-account-panel" className={styles.panel}>
      <div className={styles.identity}><span>Signed in as</span><strong>{name?.trim() || 'Your account'}</strong></div>
      <div className={styles.actions}>
        <Link href={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}><LayoutDashboard size={16} aria-hidden="true" />{isAdmin ? 'Admin dashboard' : 'Your dashboard'}</Link>
        <button type="button" onClick={() => { setOpen(false); onSignOut(); }}><LogOut size={16} aria-hidden="true" />Sign out</button>
      </div>
    </div>}
  </div>;
}
