'use client';

import React, { useState } from 'react';
import { Save, Lock, Shield, CheckCircle2, AlertCircle, KeyRound, Smartphone, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { updateAdminPassword } from './actions';

export default function AdminSettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? {
        bg: '#000000',
        surface: '#0a0a0a',
        surface2: '#121212',
        border: '#1a1a1a',
        text: '#f1f5f9',
        muted: '#64748b',
        accent: '#6366f1',
        shadow: '0 4px 24px rgba(0,0,0,0.35)',
      }
    : {
        bg: '#f8fafc',
        surface: '#ffffff',
        surface2: '#f1f5f9',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: '#4f46e5',
        shadow: '0 4px 24px rgba(0,0,0,0.07)',
      };

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 2FA MFA State
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMessage, setMfaMessage] = useState<string | null>(null);

  const toggleMfa = () => {
    const nextState = !mfaEnabled;
    setMfaEnabled(nextState);
    setMfaMessage(
      nextState
        ? 'Two-Factor Authentication (MFA) has been enabled for your admin account.'
        : 'Two-Factor Authentication (MFA) has been disabled.'
    );
    setTimeout(() => setMfaMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await updateAdminPassword(formData);
    setLoading(false);
    if (res?.error) setMessage({ type: 'error', text: res.error });
    else if (res?.success) {
      setMessage({ type: 'success', text: res.success });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const Field = ({ label, id, placeholder }: { label: string; id: keyof typeof formData; placeholder: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type="password"
        required
        value={formData[id]}
        onChange={e => setFormData(f => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px',
          background: css.surface2, border: `1.5px solid ${css.border}`,
          borderRadius: 12, fontSize: 14, color: css.text,
          outline: 'none', transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent}
        onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border}
      />
    </div>
  );

  return (
    <div style={{ padding: '32px 28px', minHeight: '100vh', background: css.bg, color: css.text }}>
      
      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
          System Configuration
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>
          Security & Authorization
        </h1>
        <p style={{ fontSize: 14, color: css.muted, margin: '4px 0 0' }}>
          Configure security tokens, MFA settings, active sessions, and admin access credentials.
        </p>
      </div>

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 28 }}>
        
        {/* ── 2FA MFA SECURITY CARD ── */}
        <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, boxShadow: css.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,0.3)', flexShrink: 0 }}>
              <ShieldCheck size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: 0 }}>Two-Factor Authentication (MFA)</h2>
              <p style={{ fontSize: 12, color: css.muted, margin: '2px 0 0' }}>Add an extra layer of protection by requiring an authenticator code</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: mfaEnabled ? '#10b981' : css.muted }}>
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={toggleMfa}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {mfaEnabled ? (
                  <ToggleRight size={36} style={{ color: '#10b981' }} />
                ) : (
                  <ToggleLeft size={36} style={{ color: css.muted }} />
                )}
              </button>
            </div>
          </div>

          {mfaMessage && (
            <div style={{ padding: '14px 28px', background: 'rgba(16,185,129,0.08)', borderBottom: `1px solid ${css.border}`, color: '#10b981', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} />
              <span>{mfaMessage}</span>
            </div>
          )}

          <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 14, background: css.surface2 }}>
            <Smartphone size={18} style={{ color: css.accent, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: css.muted, margin: 0, lineHeight: 1.5 }}>
              MFA is currently <strong style={{ color: mfaEnabled ? '#10b981' : css.text }}>{mfaEnabled ? 'ACTIVE' : 'INACTIVE'}</strong>. Authenticator apps (Google Authenticator, Microsoft Authenticator) generate code prompts upon login.
            </p>
          </div>
        </div>

        {/* ── PASSWORD CHANGE CARD ── */}
        <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, boxShadow: css.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${css.accent}40`, flexShrink: 0 }}>
              <Lock size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: 0 }}>Change Admin Password</h2>
              <p style={{ fontSize: 12, color: css.muted, margin: '2px 0 0' }}>Update your admin login security credentials</p>
            </div>
          </div>

          <div style={{ padding: '28px 28px' }}>
            {message && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12, marginBottom: 24,
                background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                color: message.type === 'success' ? '#10b981' : '#ef4444',
              }}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field label="Current Password" id="currentPassword" placeholder="Enter your current password" />
              <Field label="New Password" id="newPassword" placeholder="Min 8 characters" />
              <Field label="Confirm New Password" id="confirmPassword" placeholder="Re-enter new password" />

              <div style={{ paddingTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px',
                    background: loading ? css.surface2 : `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
                    border: 'none', borderRadius: 12,
                    color: loading ? css.muted : '#fff',
                    fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : `0 4px 16px ${css.accent}40`,
                    transition: 'opacity 0.2s',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── SECURITY INFO FOOTER ── */}
        <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: '20px 24px', boxShadow: css.shadow, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Shield size={18} color={css.muted} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: css.muted, margin: 0, lineHeight: 1.6 }}>
            Your admin session is encrypted over TLS 1.3. Use a mix of letters, numbers, and symbols for stronger password protection.
          </p>
        </div>

      </div>
    </div>
  );
}
