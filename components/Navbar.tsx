'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoIcon from '@/components/LogoIcon';
import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';

const DesktopNav = dynamic(() => import('./DesktopNav'), { ssr: false });
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1280);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header 
        className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 flex justify-center ${
          scrolled 
            ? 'top-3 w-[calc(100%-2rem)] max-w-[1200px] navbar-scrolled rounded-2xl' 
            : 'top-0 w-full bg-transparent border-b border-transparent'
        }`}
      >
        {/* Glossy top highlight when scrolled */}
        {scrolled && (
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
        <div className="w-full max-w-[1200px] lg:px-10 relative z-10" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          <div className="flex items-center justify-between h-14 lg:h-[60px]">
            {/* Logo */}
            <Link href="/" aria-label="Datta Sable - Home" className="flex items-center gap-2 group whitespace-nowrap flex-shrink-0" style={{ textDecoration: 'none' }}>
              <LogoIcon color="var(--accent)" className="w-8 h-8 lg:w-7 lg:h-7 group-hover:rotate-[30deg] transition-transform duration-500" />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Datta Sable
              </span>
            </Link>

            {/* Desktop Nav Dynamic Component */}
            {isDesktop && <DesktopNav />}

            {/* Mobile Actions */}
            <div className="xl:hidden flex items-center gap-1.5">
              <ThemeToggle />
              {!mobileMenuOpen && (
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text)] hover:bg-white/5 border border-transparent hover:border-[var(--border)] transition-all duration-300"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open mobile menu"
                >
                  <Menu size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dynamic Component */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        expandedMobile={expandedMobile}
        setExpandedMobile={setExpandedMobile}
        session={session}
        signOut={() => signOut()}
        setIsLoginOpen={setIsLoginOpen}
      />
    </>
  );
}
