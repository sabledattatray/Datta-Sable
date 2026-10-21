'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Globe } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import OfficialGoogleButton from './OfficialGoogleButton';

interface LoginModalProps {
  isOpen: boolean;
  callbackUrl?: string;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose, callbackUrl }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: callbackUrl || window.location.origin });
    setIsLoading(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '420px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 1001,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <button 
                onClick={onClose}
                aria-label="Close login modal"
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
              
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'rgba(201, 243, 29, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '1px solid rgba(201, 243, 29, 0.2)'
              }}>
                <Lock size={24} color="var(--accent)" />
              </div>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                Join the Network
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Securely authenticate to access your custom dashboards, case studies, and BI strategy portals.
              </p>
            </div>

            {/* Providers */}
            <div style={{ padding: '0 2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '100%' }}>
                <OfficialGoogleButton />
              </div>

              <button 
                onClick={() => handleLogin('github')}
                disabled={!!isLoading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: isLoading === 'github' ? 'wait' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.105C14.939 23.427 15.149 23.803 15.764 23.679C20.522 22.09 23.955 17.595 23.955 12.297C23.955 5.67 18.585 0.296997 12 0.296997Z"/>
                </svg>
                Continue with GitHub
              </button>

              <button 
                onClick={() => handleLogin('linkedin')}
                disabled={!!isLoading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: isLoading === 'linkedin' ? 'wait' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.23 0H1.77C0.8 0 0 0.8 0 1.77V22.23C0 23.2 0.8 24 1.77 24H22.24C23.2 24 24 23.2 24 22.24V1.77C24 0.8 23.2 0 22.23 0ZM7.12 20.45H3.56V9H7.13V20.45ZM5.34 7.43C4.2 7.43 3.27 6.5 3.27 5.36C3.27 4.22 4.2 3.29 5.34 3.29C6.48 3.29 7.41 4.22 7.41 5.36C7.41 6.5 6.48 7.43 5.34 7.43ZM20.45 20.45H16.89V14.89C16.89 13.57 16.87 11.87 15.04 11.87C13.19 11.87 12.9 13.31 12.9 14.79V20.45H9.33V9H12.76V10.56H12.81C13.29 9.65 14.46 8.69 16.2 8.69C19.82 8.69 20.48 11.07 20.48 14.18V20.45H20.45Z"/>
                </svg>
                Continue with LinkedIn
              </button>

              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button 
                disabled
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'transparent',
                  color: 'var(--muted)',
                  border: '1px dashed var(--border)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'not-allowed'
                }}
              >
                <Mail size={20} />
                Email Login (Coming Soon)
              </button>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                By continuing, you agree to our <Link href="/privacy" style={{ color: 'var(--text)', fontWeight: 600 }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: 'var(--text)', fontWeight: 600 }}>Terms of Service</Link>.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
