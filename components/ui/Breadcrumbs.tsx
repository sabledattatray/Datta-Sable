'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  if (pathname === '/') return null;

  return (
    <nav className="flex items-center gap-2 mono text-[length:var(--text-small)] text-[var(--muted)] opacity-70 uppercase tracking-widest mb-8">
      <Link href="/" className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
        <Home size={10} /> HOME
      </Link>
      
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const name = segment.replace(/-/g, ' ').toUpperCase();

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight size={10} className="opacity-40" />
            {isLast ? (
              <span className="text-[var(--accent)] font-bold truncate max-w-[150px] md:max-w-none">
                {name}
              </span>
            ) : (
              <Link href={href} className="hover:text-[var(--accent)] transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
