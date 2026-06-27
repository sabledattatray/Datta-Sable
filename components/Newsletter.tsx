'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section style={{ 
      background: 'var(--surface2)', 
      border: '1px solid var(--border)', 
      padding: '4rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '4rem',
      marginBottom: '4rem'
    }}>
      {/* Decorative pulse */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="label-tech mb-4" style={{ justifyContent: 'center' }}>KNOWLEDGE-STREAM</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Get One Practical Tutorial Every Week</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Join 7,000+ data engineers and BI professionals. Practical guides, study roadmaps, and cheat sheets delivered once a week.
        </p>

        {/* Weekly Preview List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          color: 'var(--muted)',
          fontSize: '0.85rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One technical tutorial
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One practical tip
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> One new resource
          </div>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <CheckCircle size={20} /> CONNECTION ESTABLISHED. WELCOME TO THE LOG.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="ENTER_EMAIL_ADDRESS" 
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                flex: 1, 
                background: 'transparent', 
                border: 'none', 
                padding: '0.75rem 1rem', 
                color: 'var(--text)', 
                fontSize: '12px',
                fontFamily: 'var(--mono)',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="btn-primary" 
              style={{ 
                padding: '0 1.5rem', 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '0.1em',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {status === 'loading' ? 'PROCESSING...' : (
                <>GET WEEKLY TUTORIAL <Send size={14} /></>
              )}
            </button>
          </form>
        )}
        <div className="mono" style={{ fontSize: '8px', color: 'var(--muted)', marginTop: '1.5rem', opacity: 0.6, letterSpacing: '0.1em' }}>
          SECURE_ENCRYPTION: AES-256 // ZERO_SPAM_POLICY: TRUE
        </div>
      </div>
    </section>
  );
}
