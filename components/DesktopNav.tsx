'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, ArrowUpRight, LogOut, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';
import { navLinks, megaMenuData } from './navigationData';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });

export default function DesktopNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
      {navLinks.map((link) => (
        <div 
          key={link.label}
          className="relative group"
          onMouseEnter={() => setHovered(link.label)}
          onMouseLeave={() => setHovered(null)}
        >
          <Link
            href={link.href}
            className={`px-4 py-3 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 no-underline relative z-10 flex items-center gap-1.5 ${
              pathname === link.href || (hovered === link.label && link.mega)
                ? 'text-[var(--accent)]' 
                : 'text-[var(--text)] opacity-75 hover:opacity-100'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {link.label}
            {link.mega && (
              <ChevronDown 
                size={10} 
                className={`transition-transform duration-300 ${hovered === link.label ? 'rotate-180' : ''}`} 
              />
            )}
            {(pathname === link.href) && (
              <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
            )}
          </Link>
          
          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {hovered === link.label && megaMenuData[link.label] && (
              <motion.div
                key={`${link.label}-mega-dropdown`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 w-max max-w-[1077.88px] bg-[var(--surface)] backdrop-blur-3xl border border-[var(--border)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden"
                style={{ top: '60px' }}
              >
                <div className="grid grid-cols-3">
                  {megaMenuData[link.label].items.map((item: any, idx: number) => {
                    const isExternal = item.href.startsWith('http');
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + (idx * 0.05) }}
                        className={`border-b border-[var(--border)] ${idx % 3 !== 2 ? 'border-r' : ''}`}
                      >
                        <Link 
                          href={item.href} 
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className="group/item block no-underline p-12 hover:bg-white/[0.02] transition-colors h-full min-h-[120px] flex flex-col justify-center"
                          onClick={() => setHovered(null)}
                        >
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 text-[var(--accent)] group-hover/item:border-[var(--accent)] transition-all duration-500">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-[var(--text)] mb-2 flex items-center gap-2 group-hover/item:text-[var(--accent)] transition-colors">
                              {item.title}
                              <ArrowUpRight size={14} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
                            </h4>
                            <p className="text-[13px] text-[var(--muted)] leading-relaxed font-medium group-hover/item:text-[var(--text)] opacity-70 transition-colors">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      
      <div className="ml-4 pl-4 border-l border-[var(--border)] flex items-center gap-4">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 group hover:border-[var(--accent)]/20 transition-all">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[var(--text)] uppercase tracking-wider leading-none mb-1">{session.user?.name}</span>
                <span className="text-[7px] text-[var(--accent)] font-mono uppercase opacity-60">
                  {(session.user as any)?.role || 'USER'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] font-bold text-[10px]">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => signOut()}
                className="ml-2 p-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors border-l border-white/10 pl-3"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="btn-primary"
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '0.5rem 1.25rem',
              fontSize: '12px'
            }}
          >
            <User size={12} /> SIGN IN
          </button>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}
