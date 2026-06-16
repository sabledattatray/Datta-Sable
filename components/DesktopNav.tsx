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
    <nav className="hidden xl:flex items-center gap-2 2xl:gap-4">
      {navLinks.map((link) => (
        <div
          key={link.label}
          className="relative group"
          onMouseEnter={() => setHovered(link.label)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Nav Link */}
          <Link
            href={link.href}
            className={`px-3 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 no-underline relative z-10 flex items-center gap-1 rounded-lg ${
              pathname === link.href || (hovered === link.label && link.mega)
                ? 'text-[var(--accent)]'
                : 'text-[var(--text)] opacity-60 hover:opacity-100 hover:bg-white/[0.03]'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {link.label}
            {link.mega && (
              <ChevronDown
                size={9}
                className={`transition-transform duration-300 ${hovered === link.label ? 'rotate-180 text-[var(--accent)]' : 'opacity-50'}`}
              />
            )}
            {pathname === link.href && (
              <motion.div layoutId="nav-underline" className="absolute bottom-1 left-3 right-3 h-[2px] bg-[var(--accent)] rounded-full" />
            )}
          </Link>

          {/* ── Mega Menu Panel ── */}
          <AnimatePresence>
            {hovered === link.label && megaMenuData[link.label] && (
              <motion.div
                key={`${link.label}-mega`}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 -translate-x-1/2 z-[300]"
                style={{ top: '52px', minWidth: '720px', maxWidth: '860px', width: 'max-content' }}
              >
                {/* Glossy border glow */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,243,29,0.04), 0 32px 64px -16px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Top accent glow line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                  <div className="flex">

                    {/* LEFT — Featured Card */}
                    {megaMenuData[link.label].featured && (() => {
                      const f = megaMenuData[link.label].featured;
                      return (
                        <Link
                          href={f.href}
                          onClick={() => setHovered(null)}
                          className="no-underline flex-shrink-0 group/feat"
                          style={{ width: '220px' }}
                        >
                          <div
                            className="flex flex-col justify-between h-full p-5 transition-colors duration-300"
                            style={{
                              background: 'linear-gradient(160deg, rgba(201,243,29,0.06) 0%, rgba(201,243,29,0.02) 100%)',
                              borderRight: '1px solid var(--border)',
                              minHeight: '100%',
                            }}
                          >
                            {/* Tag */}
                            <div>
                              <span
                                className="mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                                style={{
                                  color: 'var(--accent)',
                                  background: 'rgba(201,243,29,0.1)',
                                  border: '1px solid rgba(201,243,29,0.2)',
                                }}
                              >
                                {f.tag}
                              </span>
                              <h3
                                className="group-hover/feat:text-[var(--accent)] transition-colors duration-300 mt-3 mb-2"
                                style={{
                                  fontFamily: "'Syne', sans-serif",
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  color: 'var(--text)',
                                  lineHeight: 1.3,
                                  letterSpacing: '-0.01em',
                                }}
                              >
                                {f.title}
                              </h3>
                              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                                {f.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-4 text-[var(--accent)] group-hover/feat:gap-2.5 transition-all duration-300">
                              <span className="mono text-[10px] font-bold uppercase tracking-widest">Explore</span>
                              <ArrowUpRight size={12} className="group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      );
                    })()}

                    {/* RIGHT — Items Grid */}
                    <div
                      className="flex-1 grid p-3"
                      style={{
                        gridTemplateColumns: `repeat(${megaMenuData[link.label].items.length > 6 ? 3 : 2}, 1fr)`,
                        gap: '2px',
                      }}
                    >
                      {megaMenuData[link.label].items.map((item: any, idx: number) => {
                        const isExternal = item.href.startsWith('http');
                        return (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.04 + idx * 0.03, duration: 0.2 }}
                          >
                            <Link
                              href={item.href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              onClick={() => setHovered(null)}
                              className="group/item flex items-center gap-3 no-underline rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.04]"
                            >
                              {/* Color icon */}
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                                style={{
                                  background: `${item.color}14`,
                                  border: `1px solid ${item.color}28`,
                                  color: item.color,
                                }}
                              >
                                {item.icon}
                              </div>
                              <div className="min-w-0">
                                <div
                                  className="flex items-center gap-1 font-bold text-[var(--text)] group-hover/item:text-[var(--accent)] transition-colors"
                                  style={{ fontSize: '0.8rem', fontFamily: "'Syne', sans-serif" }}
                                >
                                  <span className="truncate">{item.title}</span>
                                  <ArrowUpRight
                                    size={11}
                                    className="opacity-0 group-hover/item:opacity-100 flex-shrink-0 transition-opacity"
                                  />
                                </div>
                                <div
                                  className="text-[var(--muted)] group-hover/item:text-[var(--text)] transition-colors truncate"
                                  style={{ fontSize: '0.7rem', marginTop: '1px', opacity: 0.7 }}
                                >
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Bottom bar */}
                  <div
                    className="flex items-center justify-between px-5 py-2.5"
                    style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}
                  >
                    <span className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      dattasable.com / {link.label.toLowerCase()}
                    </span>
                    <Link
                      href={link.href}
                      onClick={() => setHovered(null)}
                      className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] hover:underline no-underline flex items-center gap-1"
                    >
                      View all <ArrowUpRight size={9} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Right actions */}
      <div className="ml-3 pl-3 border-l border-[var(--border)] flex items-center gap-2">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/20 transition-all h-9">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[var(--text)] uppercase tracking-wider leading-none mb-0.5">{session.user?.name}</span>
              <span className="text-[7px] text-[var(--accent)] font-mono uppercase opacity-60">
                {(session.user as any)?.role || 'USER'}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold text-[10px]">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors border-l border-white/10 pl-2.5"
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[var(--accent)] text-black font-bold text-[11px] tracking-widest uppercase transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <User size={12} /> Sign In
          </button>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}
