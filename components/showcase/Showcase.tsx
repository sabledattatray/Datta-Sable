'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import styles from './Showcase.module.css';

export function WorkImage({ src, alt, priority = false, sizes = '(max-width: 700px) 100vw, 50vw' }: { src: string | null; alt: string; priority?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={styles.image}>{src && !failed ? <Image src={src} alt={alt} fill priority={priority} sizes={sizes} onError={() => setFailed(true)} /> : <div className={styles.imageFallback}><ImageIcon size={32} strokeWidth={1} /><span>Explore the project details</span></div>}</div>;
}

export function WorkLink({ href, children, primary = false, className = '' }: { href: string; children: React.ReactNode; primary?: boolean; className?: string }) {
  const external = href.startsWith('http');
  return <Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={`${primary ? styles.primary : styles.secondary} ${className}`}>{children}<ArrowUpRight size={15} aria-hidden="true" /></Link>;
}

export function WorkDialog({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description: string; children: React.ReactNode }) {
  const previousFocus = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={open} onOpenChange={next => { if (!next) onClose(); }}><Dialog.Portal><Dialog.Overlay className={styles.overlay} /><Dialog.Content className={styles.dialog} onOpenAutoFocus={() => { previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus(); }}>
    <div className={styles.dialogTop}><span>PROJECT NOTES / DATTA SABLE</span><Dialog.Close asChild><button aria-label="Close project details"><X size={19} /></button></Dialog.Close></div><div className={styles.dialogBody}><Dialog.Title>{title}</Dialog.Title><Dialog.Description>{description}</Dialog.Description>{children}</div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function SectionHeading({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className={styles.sectionHeading}><div><span className={styles.kicker}><i /> {number} / {eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}
