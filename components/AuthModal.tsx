'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AuthModal() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'authenticated') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, x: '-50%', y: -20 }}
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            exit={{ opacity: 0, x: '-50%', y: -20 }}
            style={{
              position: 'fixed',
              top: '85px',
              left: '50%',
              x: '-50%',
              width: 'calc(100% - 48px)',
              maxWidth: '320px',
              background: 'var(--surface)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              zIndex: 9999,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px var(--border)',
              borderRadius: '16px',
              fontFamily: 'var(--font-syne), sans-serif',
            }}
          >
            {/* Trust Indicator */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ color: 'var(--accent)', display: 'flex' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <span style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Secure Connection
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginLeft: 'auto',
                  color: 'var(--muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Sign in to this Trusted Portal</h2>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--text-small)', lineHeight: 1.4 }}>Select a verified provider to establish a secure connection.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Google Button */}
              <button
                onClick={() => signIn('google')}
                style={{
                  height: '40px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 1rem',
                  gap: '10px',
                  fontWeight: 600,
                  fontSize: 'var(--text-small)',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {/* LinkedIn Button */}
                <button
                  onClick={() => signIn('linkedin')}
                  style={{
                    height: '40px',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 500,
                    fontSize: 'var(--text-small)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>

                {/* GitHub Button */}
                <button
                  onClick={() => signIn('github')}
                  style={{
                    height: '40px',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 500,
                    fontSize: 'var(--text-small)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--text-small)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                NextAuth Secure Protocol v4.0
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
