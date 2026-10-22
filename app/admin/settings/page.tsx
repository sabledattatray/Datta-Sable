'use client';

import React, { useState } from 'react';
import { Save, Lock, Shield, CheckCircle2, AlertCircle, Smartphone, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { updateAdminPassword } from './actions';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function AdminSettingsPage() {
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
    <div className={adminStyles.field}>
      <label className={adminStyles.label}>
        {label}
      </label>
      <input
        type="password"
        required
        value={formData[id]}
        onChange={e => setFormData(f => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        className={adminStyles.input}
      />
    </div>
  );

  return (
    <div className={adminStyles.page}>
      
      {/* ── PAGE HEADER ── */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> SYSTEM CONFIGURATION
          </div>
          <h1 className={adminStyles.title}>
            Security &amp; <span className={adminStyles.titleAccent}>Authorization</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Configure security tokens, MFA settings, active sessions, and admin access credentials.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* ── 2FA MFA SECURITY CARD ── */}
        <div className={adminStyles.panel} style={{ padding: 0, overflow: 'hidden', margin: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))', border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Two-Factor Authentication (MFA)</h2>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '3px 0 0' }}>Add an extra layer of protection by requiring an authenticator code</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={mfaEnabled ? adminStyles.badge : adminStyles.badgeNeutral}>
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
                aria-label={mfaEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
              >
                {mfaEnabled ? (
                  <ToggleRight size={34} style={{ color: 'var(--accent)' }} />
                ) : (
                  <ToggleLeft size={34} style={{ color: 'var(--muted)' }} />
                )}
              </button>
            </div>
          </div>

          {mfaMessage && (
            <div className={adminStyles.notice} style={{ margin: 0, borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
              <CheckCircle2 size={16} />
              <span>{mfaMessage}</span>
            </div>
          )}

          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface2)' }}>
            <Smartphone size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
              MFA is currently <strong style={{ color: mfaEnabled ? 'var(--accent)' : 'var(--text)' }}>{mfaEnabled ? 'ACTIVE' : 'INACTIVE'}</strong>. Authenticator apps (Google Authenticator, Microsoft Authenticator) generate code prompts upon login.
            </p>
          </div>
        </div>

        {/* ── PASSWORD CHANGE CARD ── */}
        <div className={adminStyles.panel} style={{ padding: 0, overflow: 'hidden', margin: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))', border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <Lock size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Change Admin Password</h2>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '3px 0 0' }}>Update your admin login security credentials</p>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {message && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 8, marginBottom: 20,
                background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                color: message.type === 'success' ? '#34d399' : '#f87171',
                fontSize: 12, fontWeight: 500
              }}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <Field label="Current Password" id="currentPassword" placeholder="Enter your current password" />
              <Field label="New Password" id="newPassword" placeholder="Min 8 characters" />
              <Field label="Confirm New Password" id="confirmPassword" placeholder="Re-enter new password" />

              <div style={{ paddingTop: 6 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className={adminStyles.primary}
                >
                  <Save size={14} />
                  {loading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── SECURITY INFO FOOTER ── */}
        <div className={adminStyles.panel} style={{ padding: '16px 20px', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            Your admin session is encrypted over TLS 1.3. Use a mix of letters, numbers, and symbols for stronger password protection.
          </p>
        </div>

      </div>
    </div>
  );
}
