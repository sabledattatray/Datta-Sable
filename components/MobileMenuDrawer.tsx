'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronDown, LogOut } from 'lucide-react';
import LogoIcon from './LogoIcon';
import { navLinks, megaMenuData } from './navigationData';

interface MobileMenuDrawerProps {
  onClose: () => void;
  expandedMobile: string | null;
  setExpandedMobile: (label: string | null) => void;
  session: any;
  signOut: () => void;
  setIsLoginOpen: (open: boolean) => void;
}

export default function MobileMenuDrawer({
  onClose,
  expandedMobile,
  setExpandedMobile,
  session,
  signOut,
  setIsLoginOpen
}: MobileMenuDrawerProps) {
  return (
    <>
      <motion.div
        key="mobile-menu-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm xl:hidden"
      />
      
      <motion.div
        key="mobile-menu-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ width: '75vw' }}
        className="fixed top-0 right-0 bottom-0 z-[200] bg-[var(--bg)] border-l border-[var(--border)] xl:hidden flex flex-col shadow-2xl"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between min-h-[100px] px-8 border-b border-[var(--border)] bg-[var(--surface)]">
            <Link href="/" onClick={onClose} className="flex items-baseline gap-2 group" style={{ textDecoration: 'none' }}>
              <LogoIcon color="var(--accent)" className="w-8 h-8 group-hover:rotate-[30deg] transition-transform duration-500 relative top-[2px]" />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
                Datta Sable
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors" 
                onClick={onClose}
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const hasSubmenu = link.mega && megaMenuData[link.label];
              const isExpanded = expandedMobile === link.label;

              return (
                <div key={link.label} className="overflow-hidden">
                  <div className="border-b border-[var(--border)] last:border-0">
                    {hasSubmenu ? (
                      <button
                        onClick={() => setExpandedMobile(isExpanded ? null : link.label)}
                        style={{ padding: '1.25rem 1rem' }}
                        className={`w-full flex items-center justify-between text-[13px] font-bold tracking-widest uppercase transition-colors ${
                          isExpanded ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                        }`}
                      >
                        {link.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--accent)]' : 'opacity-30'}`} 
                        />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        style={{ padding: '1rem', display: 'block' }}
                        className="text-[12px] font-bold tracking-widest uppercase text-[var(--text)] opacity-70 hover:text-[var(--accent)] transition-colors no-underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>

                  <AnimatePresence>
                    {hasSubmenu && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[var(--surface2)] border-l-2 border-[var(--accent)]/20 ml-2"
                      >
                        <div style={{ padding: '0.375rem' }} className="flex flex-col gap-1">
                          {megaMenuData[link.label].items.map((sub: any) => {
                            const isExternal = sub.href.startsWith('http');
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                target={isExternal ? '_blank' : undefined}
                                onClick={() => {
                                  onClose();
                                  if (sub.href.includes('#')) {
                                    const [path, hash] = sub.href.split('#');
                                    if (typeof window !== 'undefined' && (window.location.pathname === path || !path)) {
                                      setTimeout(() => {
                                        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                                      }, 50);
                                    }
                                  }
                                }}
                                className="flex items-center gap-4 rounded-lg hover:bg-white/5 no-underline group"
                              >
                                <div style={{ width: '2.25rem', height: '2.25rem' }} className="flex items-center justify-center bg-white/5 border border-white/10 text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                                  {sub.icon}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{sub.title}</span>
                                  <span className="text-[12px] text-[var(--muted)]">{sub.desc}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-12 border-t border-[var(--border)] bg-[var(--surface2)] space-y-4">
            {session ? (
              <div className="py-4 text-center space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-1">Authenticated as</p>
                  <p className="text-sm font-bold text-[var(--text)]">{session.user?.name}</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 py-4 text-[11px] font-bold tracking-[0.2em] uppercase border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all"
                >
                  <LogOut size={14} /> SIGN OUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  onClose();
                  setIsLoginOpen(true);
                }}
                className="btn-primary w-full block text-center py-5 text-[11px] font-bold tracking-[0.2em] uppercase" 
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
