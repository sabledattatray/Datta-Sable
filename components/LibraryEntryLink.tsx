import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';

type Props = ComponentPropsWithoutRef<'a'> & { href: string };

export default function LibraryEntryLink({ href, children, ...props }: Props) {
  // The library has a different document CSP from editorial pages. Enter it
  // with a fresh document rather than retaining a prefetched loading segment.
  return href === '/ebooks'
    ? <a href={href} {...props}>{children}</a>
    : <Link href={href} {...props}>{children}</Link>;
}
