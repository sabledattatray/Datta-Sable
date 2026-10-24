'use client';
import adminStyles from '@/components/admin/AdminCommon.module.css';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { getCompanyProfile, saveCompanyProfile } from '../org-actions';
import { 
  Terminal, Plus, 
  Trash2, Key, Globe, Copy, Check, Upload, File,
  Shield, AlertTriangle, ShieldCheck, Lock, Smartphone, CheckCircle2, QrCode, RefreshCw, Laptop, ShieldAlert, X
} from 'lucide-react';

export default function AdminCatchAllPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  
  const catchall = params?.catchall;
  const path = Array.isArray(catchall) ? catchall.join('/') : '';

  const css = isDark
    ? {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accentGlow: 'color-mix(in srgb, var(--accent) 10%, transparent)',
        shadow: '0 4px 24px rgba(0,0,0,0.35)',
        hoverBg: 'color-mix(in srgb, var(--accent) 5%, transparent)',
      }
    : {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accentGlow: 'color-mix(in srgb, var(--accent) 10%, transparent)',
        shadow: '0 4px 24px rgba(0,0,0,0.07)',
        hoverBg: 'color-mix(in srgb, var(--accent) 5%, transparent)',
      };

  // State for copied items
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Company Profile State
  const [companyName, setCompanyName] = useState('dattasable.');
  const [supportEmail, setSupportEmail] = useState('support@dattasable.com');
  const [taxId, setTaxId] = useState('27AABCU1234F1Z5');
  const [officeAddress, setOfficeAddress] = useState('Sable Heights, Senapati Bapat Road, Pune, Maharashtra, 411016');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('company_name');
      const savedEmail = localStorage.getItem('company_email');
      const savedTax = localStorage.getItem('company_tax_id');
      const savedAddress = localStorage.getItem('company_address');
      
      if (savedName !== null) setCompanyName(savedName);
      if (savedEmail !== null) setSupportEmail(savedEmail);
      if (savedTax !== null) setTaxId(savedTax);
      if (savedAddress !== null) setOfficeAddress(savedAddress);
    }

    const fetchDbProfile = async () => {
      const profile = await getCompanyProfile();
      if (profile) {
        setCompanyName(profile.company_name);
        setSupportEmail(profile.company_email);
        setTaxId(profile.company_tax_id);
        setOfficeAddress(profile.company_address);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_name', profile.company_name);
          localStorage.setItem('company_email', profile.company_email);
          localStorage.setItem('company_tax_id', profile.company_tax_id);
          localStorage.setItem('company_address', profile.company_address);
          window.dispatchEvent(new Event('company_profile_changed'));
        }
      }
    };

    if (path === 'org/profile') {
      fetchDbProfile();
    }
  }, [path]);

  const handleSaveCompanyProfile = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('company_name', companyName);
      localStorage.setItem('company_email', supportEmail);
      localStorage.setItem('company_tax_id', taxId);
      localStorage.setItem('company_address', officeAddress);
      
      window.dispatchEvent(new Event('company_profile_changed'));
    }
    
    const res = await saveCompanyProfile({
      companyName,
      supportEmail,
      taxId,
      officeAddress
    });

    if (res?.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      alert(res?.error || 'Failed to save company profile settings.');
    }
  };

  // State for dynamically added mock data
  const [mediaList, setMediaList] = useState([
    { id: 1, name: 'hero-banner.jpg', size: '245 KB', type: 'image', date: '2 hours ago', url: '/images/blog/bi-career.webp' },
    { id: 2, name: 'resume-datta-sable.pdf', size: '1.2 MB', type: 'pdf', date: 'Yesterday', url: '#' },
    { id: 3, name: 'analytics-dashboard-screenshot.png', size: '480 KB', type: 'image', date: '3 days ago', url: '/images/blog/analytics_war_room_hero.webp' },
    { id: 4, name: 'avatar-placeholder.svg', size: '12 KB', type: 'image', date: '1 week ago', url: '#' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Datta Sable', email: 'datta@dattasable.com', role: 'Super Admin', status: 'Active', logs: 'Logged in 5m ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', role: 'Editor', status: 'Active', logs: 'Edited post 2h ago' },
    { id: 3, name: 'Mike Ross', email: 'mike@startup.io', role: 'Viewer', status: 'Active', logs: 'Viewed dashboard yesterday' },
    { id: 4, name: 'Priya Verma', email: 'priya@retail.in', role: 'Moderator', status: 'Suspended', logs: 'Password updated 3d ago' },
  ]);

  const [keys, setKeys] = useState([
    { name: 'Live Production Key', key: 'ds_live_8f8e12a4c9b8e21a4f007b', created: '2026-05-10' },
    { name: 'Sandbox Development Key', key: 'ds_test_3a7d23f8e1c0d4a9b5f902', created: '2026-06-01' },
  ]);

  const [tickets, setTickets] = useState([
    { id: 'TCK-201', subject: 'API Gateway Timeout Error', client: 'RetailMax', status: 'Open', priority: 'High', date: '3 hours ago' },
    { id: 'TCK-198', subject: 'Billing Issue: Invoice Double Charge', client: 'Fintech Corp', status: 'Resolved', priority: 'Medium', date: 'Yesterday' },
    { id: 'TCK-195', subject: 'Request for custom CSV export', client: 'Mike Ross', status: 'In Progress', priority: 'Low', date: '2 days ago' },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-8821', client: 'RetailMax', service: 'Dashboard Development', price: '₹45,000', status: 'Completed', date: 'Today' },
    { id: 'ORD-8820', client: 'Global Manuf.', service: 'Data Analytics Consulting', price: '₹25,000', status: 'Processing', date: 'Yesterday' },
    { id: 'ORD-8818', client: 'Fintech', service: 'Financial KPI Automation', price: '₹35,000', status: 'Pending', date: '3 days ago' },
  ]);

  // ── Security & MFA Management States ──
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showMfaSetupModal, setShowMfaSetupModal] = useState(false);
  const [showIpModal, setShowIpModal] = useState(false);
  const [mfaSuccessMsg, setMfaSuccessMsg] = useState<string | null>(null);
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newIpLabel, setNewIpLabel] = useState('');

  const [ipWhitelist, setIpWhitelist] = useState([
    { id: 'ip-1', cidr: '103.21.244.0/24', label: 'Pune HQ Office Fiber (Primary)', date: 'Oct 20, 2026', status: 'Active' },
    { id: 'ip-2', cidr: '152.58.112.0/20', label: 'Datta Secure Gateway VPN', date: 'Oct 22, 2026', status: 'Active' },
  ]);

  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Windows 11 Pro · Google Chrome 132', location: 'Pune, Maharashtra, India', ip: '103.21.244.18', isCurrent: true, lastActive: 'Active Now (This session)', sessionVersion: 'v3.0.2' },
    { id: 'sess-2', device: 'macOS Sonoma · Apple Safari 18.2', location: 'Mumbai, India', ip: '49.36.12.94', isCurrent: false, lastActive: 'Yesterday at 18:20', sessionVersion: 'v3.0.2' },
  ]);

  const recoveryCodes = [
    '98F2-3B4A', '7C11-88D2', 'E4A9-021B', '55FC-991A',
    '33D8-19AA', 'A872-B4E1', '6601-CF99', '44EA-77B3'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMfa = localStorage.getItem('admin_mfa_enabled');
      if (savedMfa !== null) {
        setMfaEnabled(savedMfa === 'true');
      } else {
        setMfaEnabled(true);
        localStorage.setItem('admin_mfa_enabled', 'true');
      }
      const savedIps = localStorage.getItem('admin_ip_whitelist');
      if (savedIps) {
        try { setIpWhitelist(JSON.parse(savedIps)); } catch {}
      }
    }
  }, []);

  const handleToggleMfa = () => {
    if (mfaEnabled) {
      if (confirm('Are you sure you want to disable Two-Factor Authentication? Disabling MFA significantly reduces your admin account protection.')) {
        setMfaEnabled(false);
        if (typeof window !== 'undefined') localStorage.setItem('admin_mfa_enabled', 'false');
        setMfaSuccessMsg('Two-Factor Authentication has been disabled.');
        setTimeout(() => setMfaSuccessMsg(null), 3500);
      }
    } else {
      setShowMfaSetupModal(true);
    }
  };

  const handleConfirmMfaSetup = () => {
    setMfaEnabled(true);
    if (typeof window !== 'undefined') localStorage.setItem('admin_mfa_enabled', 'true');
    setShowMfaSetupModal(false);
    setTotpCodeInput('');
    setMfaSuccessMsg('Two-Factor Authentication (MFA) successfully verified and enforced!');
    setTimeout(() => setMfaSuccessMsg(null), 3500);
  };

  const handleAddIp = () => {
    if (!newIpAddress.trim()) return;
    const newEntry = {
      id: `ip-${Date.now()}`,
      cidr: newIpAddress.trim(),
      label: newIpLabel.trim() || 'Whitelisted Developer IP',
      date: 'Just now',
      status: 'Active',
    };
    const updated = [...ipWhitelist, newEntry];
    setIpWhitelist(updated);
    if (typeof window !== 'undefined') localStorage.setItem('admin_ip_whitelist', JSON.stringify(updated));
    setNewIpAddress('');
    setNewIpLabel('');
    setShowIpModal(false);
    setMfaSuccessMsg('IP Range successfully whitelisted in firewall rules.');
    setTimeout(() => setMfaSuccessMsg(null), 3500);
  };

  const handleRemoveIp = (id: string) => {
    const updated = ipWhitelist.filter(item => item.id !== id);
    setIpWhitelist(updated);
    if (typeof window !== 'undefined') localStorage.setItem('admin_ip_whitelist', JSON.stringify(updated));
  };

  const handleRevokeOtherSessions = () => {
    setActiveSessions(activeSessions.filter(s => s.isCurrent));
    setMfaSuccessMsg('All other admin sessions revoked. Cryptographic version incremented.');
    setTimeout(() => setMfaSuccessMsg(null), 3500);
  };

  // Trigger file selection for CMS Media Library
  const handleMediaUploadClick = () => {
    mediaFileInputRef.current?.click();
  };

  // Perform real file upload to /api/admin/upload
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }

      const data = await res.json();
      const newMedia = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type.startsWith('image/') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'file',
        url: data.url,
        date: 'Just now',
      };
      setMediaList(prev => [newMedia, ...prev]);
    } catch (err: any) {
      alert('Failed to upload file: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };

  // Render Subpage content based on the catchall path
  const renderContent = () => {
    switch (path) {
      // ─── USER MANAGEMENT ───
      case 'users':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Management</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>User Management</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Manage administrator accounts, permissions, and roles.</p>
              </div>
              <button 
                onClick={() => setUsers([...users, { id: Date.now(), name: 'New Team Member', email: 'new@dattasable.com', role: 'Viewer', status: 'Active', logs: 'Account created just now' }])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}
              >
                <Plus size={17} /> Add User
              </button>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                      {['User', 'Role', 'Status', 'Last Activity', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${css.border}` : 'none' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-primary-text)', fontWeight: 800, fontSize: 'var(--text-small)' }}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{u.name}</div>
                              <div style={{ fontSize: 'var(--text-small)', color: css.muted, marginTop: 2 }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)', color: css.accent, border: `1px solid color-mix(in srgb, ${css.accent} 19%, transparent)`, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-small)', fontWeight: 700, background: u.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: u.status === 'Active' ? '#10b981' : '#ef4444', border: `1px solid ${u.status === 'Active' ? '#10b98130' : '#ef444430'}`, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.muted }}>{u.logs}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'users/roles':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Management</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Roles & Permissions</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Configure permissions and granular access policies for team roles.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 20 }}>
              {[
                { name: 'Super Admin', desc: 'Full root access to database, settings, keys, and payments.', users: 1, permissions: ['All Access'] },
                { name: 'Editor', desc: 'Create, modify, and publish blog stories and custom layout pages.', users: 2, permissions: ['Write CMS', 'Edit CMS', 'Delete CMS', 'Upload Media'] },
                { name: 'Moderator', desc: 'Moderate reviews, view leads, and answer support tickets.', users: 1, permissions: ['Read Inbox', 'Write Ticket', 'Approve Testimonial'] },
                { name: 'Viewer', desc: 'Read-only access to core dashboard stats, logs, and pages.', users: 3, permissions: ['Read Analytics', 'Read CMS'] },
              ].map((role, idx) => (
                <div key={idx} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 24, boxShadow: css.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: 0 }}>{role.name}</h3>
                    <span style={{ fontSize: 'var(--text-small)', color: css.muted, fontWeight: 600 }}>{role.users} user{role.users !== 1 ? 's' : ''}</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-small)', color: css.muted, lineHeight: 1.6, margin: '0 0 20px' }}>{role.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {role.permissions.map((p, i) => (
                      <span key={i} style={{ fontSize: 'var(--text-small)', fontWeight: 700, background: css.surface2, border: `1px solid ${css.border}`, color: css.text, padding: '3px 8px', borderRadius: 6 }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ─── ORGANIZATION ───
      case 'org/profile':
        return (
          <div style={{ maxWidth: 600 }}>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Organization</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Company Profile</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Configure global metadata and profile settings for the brand.</p>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 28, boxShadow: css.shadow }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Company Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: css.surface2, border: `1.5px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 'var(--text-small)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Support Email</label>
                  <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: css.surface2, border: `1.5px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 'var(--text-small)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Tax ID / GSTIN</label>
                  <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: css.surface2, border: `1.5px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 'var(--text-small)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Office Address</label>
                  <textarea value={officeAddress} onChange={e => setOfficeAddress(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', background: css.surface2, border: `1.5px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 'var(--text-small)', outline: 'none', resize: 'none' }} />
                </div>
                {saveStatus === 'success' && (
                  <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, color: '#10b981', fontSize: 'var(--text-small)', fontWeight: 600 }}>
                    ✓ Profile settings saved successfully!
                  </div>
                )}
                <button onClick={handleSaveCompanyProfile} style={{ padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 10, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', width: 'fit-content' }}>Save Company Profile</button>
              </div>
            </div>
          </div>
        );

      case 'org/branches':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Organization</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Branches & Locations</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Configure global office locations, contact agents, and branches.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 20 }}>
              {[
                { city: 'Pune (HQ)', country: 'India', addr: 'Senapati Bapat Road', status: 'Main Office' },
                { city: 'Mumbai', country: 'India', addr: 'Bandra Kurla Complex', status: 'Regional Hub' },
                { city: 'London', country: 'United Kingdom', addr: 'Canary Wharf', status: 'Support Branch' },
              ].map((b, i) => (
                <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 24, boxShadow: css.shadow, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 'var(--text-small)', fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 8px', borderRadius: 999 }}>{b.status}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: css.text, margin: '0 0 4px' }}>{b.city}</h3>
                  <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '0 0 14px' }}>{b.country}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-small)', color: css.text, borderTop: `1px solid ${css.border}`, paddingTop: 14 }}>
                    <Globe size={13} color={css.muted} /> {b.addr}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ─── BILLING & SUBSCRIPTIONS ───
      case 'billing/subs':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Billing</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Subscriptions</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Monitor client subscription plans, billing frequencies, and status logs.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 20 }}>
              {[
                { tier: 'Starter Tier', clientsCount: 5, price: '₹4,999/mo', desc: 'Basic BI dashboard reporting and monthly data re-syncs.' },
                { tier: 'Professional Tier', clientsCount: 12, price: '₹14,999/mo', desc: 'Real-time database syncs, multi-user access control, Custom Reports.', featured: true },
                { tier: 'Enterprise Tier', clientsCount: 3, price: '₹49,999/mo', desc: 'Dedicated cluster, SLA uptime guarantee, custom n8n workflow bridges.' },
              ].map((tier, idx) => (
                <div key={idx} style={{ background: css.surface, border: tier.featured ? `2px solid ${css.accent}` : `1px solid ${css.border}`, borderRadius: 14, padding: 24, boxShadow: css.shadow, position: 'relative' }}>
                  {tier.featured && <div style={{ position: 'absolute', top: -11, left: 24, fontSize: 'var(--text-small)', fontWeight: 800, background: css.accent, color: 'var(--btn-primary-text)', padding: '2px 10px', borderRadius: 999 }}>POPULAR</div>}
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: '0 0 4px' }}>{tier.tier}</h3>
                  <div style={{ fontSize: 22, fontWeight: 900, color: css.text, margin: '8px 0' }}>{tier.price}</div>
                  <p style={{ fontSize: 'var(--text-small)', color: css.muted, lineHeight: 1.5, margin: '0 0 16px' }}>{tier.desc}</p>
                  <div style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.accent }}>{tier.clientsCount} Active Clients</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'billing/methods':
        return (
          <div style={{ maxWidth: 540 }}>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Billing</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Payment Methods</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Manage subscription billing payout cards and settings.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { type: 'Visa', number: '•••• •••• •••• 4242', exp: '12/28', status: 'Primary Method' },
                { type: 'Mastercard', number: '•••• •••• •••• 8821', exp: '09/27', status: 'Backup Method' },
              ].map((card, i) => (
                <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 22, boxShadow: css.shadow, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 32, borderRadius: 6, background: css.surface2, border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-small)', fontWeight: 800, color: css.text }}>{card.type}</div>
                    <div>
                      <div style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{card.number}</div>
                      <div style={{ fontSize: 'var(--text-small)', color: css.muted, marginTop: 2 }}>Expires {card.exp}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.accent, background: css.accentGlow, padding: '3px 10px', borderRadius: 999 }}>{card.status}</span>
                </div>
              ))}
              <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: css.surface2, border: `1px dashed ${css.border}`, borderRadius: 12, color: css.text, fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer' }}>
                <Plus size={15} /> Add New Payout Card
              </button>
            </div>
          </div>
        );

      // ─── ORDERS / TRANSACTIONS ───
      case 'orders':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Sales</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Orders List</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Track and manage active consulting services orders.</p>
              </div>
              <button onClick={() => setOrders([{ id: 'ORD-' + Math.floor(Math.random() * 9000 + 1000), client: 'Priya Verma', service: 'n8n Workflow Automation', price: '₹18,000', status: 'Pending', date: 'Just now' }, ...orders])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Plus size={15} /> Create Order
              </button>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                      {['Order ID', 'Client', 'Service', 'Price', 'Status', 'Ordered On'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={i} style={{ borderBottom: i < orders.length - 1 ? `1px solid ${css.border}` : 'none' }}>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{o.id}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.text }}>{o.client}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 600, color: css.text }}>{o.service}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{o.price}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-small)', fontWeight: 700, background: o.status === 'Completed' ? 'rgba(16,185,129,0.1)' : o.status === 'Processing' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)', color: o.status === 'Completed' ? '#10b981' : o.status === 'Processing' ? '#6366f1' : '#f59e0b', border: `1px solid ${o.status === 'Completed' ? '#10b98130' : o.status === 'Processing' ? '#6366f130' : '#f59e0b30'}`, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: o.status === 'Completed' ? '#10b981' : o.status === 'Processing' ? '#6366f1' : '#f59e0b' }} /> {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.muted }}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'orders/transactions':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Sales</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Transactions Ledger</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Review payment collection records and billing logs.</p>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                      {['TXN Reference', 'Channel', 'Volume', 'Date', 'Type'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ref: 'tx_8f8e12a4c9b8', ch: 'Razorpay', vol: '+ ₹14,999', date: 'June 01, 12:45 IST', type: 'Credit' },
                      { ref: 'tx_3a7d23f8e1c0', ch: 'Stripe Credit', vol: '+ ₹25,000', date: 'May 28, 18:22 IST', type: 'Credit' },
                      { ref: 'tx_9b5f9024f007', ch: 'Direct Bank NEFT', vol: '+ ₹35,000', date: 'May 15, 11:30 IST', type: 'Credit' },
                      { ref: 'tx_0d4a9b5f9022', ch: 'Refund Gateway', vol: '- ₹4,999', date: 'May 01, 15:10 IST', type: 'Debit' },
                    ].map((t, i) => (
                      <tr key={i} style={{ borderBottom: i < 3 ? `1px solid ${css.border}` : 'none' }}>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontFamily: 'monospace', fontWeight: 700, color: css.text }}>{t.ref}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.text }}>{t.ch}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 700, color: t.type === 'Credit' ? '#10b981' : '#ef4444' }}>{t.vol}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.muted }}>{t.date}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: t.type === 'Credit' ? '#10b981' : '#ef4444', background: t.type === 'Credit' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', padding: '2px 8px', borderRadius: 6 }}>{t.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ─── ANALYTICS ───
      case 'analytics':
      case 'analytics/traffic':
      case 'analytics/reports':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Analytics</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>
                {path === 'analytics/traffic' ? 'Traffic & Behavior' : path === 'analytics/reports' ? 'Analytics Reports' : 'Analytics Overview'}
              </h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Review real-time website visitors, traffic sources, page bounce rates, and browser details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Realtime Visitors', value: '42', color: '#10b981', sub: 'Active in last 5 minutes' },
                { label: 'Avg Session Time', value: '3m 42s', color: '#6366f1', sub: '+12% increase this week' },
                { label: 'Conversion Rate', value: '4.8%', color: '#06b6d4', sub: 'Form submissions' },
                { label: 'Traffic Goal', value: '94%', color: '#f59e0b', sub: 'Target 10k reads monthly' },
              ].map((stat, i) => (
                <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 18, padding: 20, boxShadow: css.shadow }}>
                  <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{stat.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: stat.color, margin: '0 0 4px' }}>{stat.value}</p>
                  <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: 0 }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 24, boxShadow: css.shadow, minHeight: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: 0 }}>Realtime Traffic Chart (Last 24 Hours)</h3>
                <span style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Live data syncing</span>
              </div>
              
              {/* Simulated traffic graph using svg polyline */}
              <div style={{ position: 'relative', width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', borderBottom: `1px solid ${css.border}` }}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={css.accent} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={css.accent} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,130 Q120,60 240,110 T480,40 T720,90 T960,20 L1200,80 L1200,160 L0,160 Z" fill="url(#glow)" />
                  <path d="M0,130 Q120,60 240,110 T480,40 T720,90 T960,20 L1200,80" fill="none" stroke={css.accent} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 'var(--text-small)', color: css.muted, fontWeight: 600 }}>
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>
            </div>
          </div>
        );

      // ─── MARKETING ───
      case 'marketing/campaigns':
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/marketing/campaigns';
        }
        return null;

      case 'marketing/coupons':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Marketing</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Coupons & Deals</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Manage promo codes, discount percentages, and referral campaigns.</p>
              </div>
              <button onClick={() => alert('Simulating Coupon Code Generator')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Plus size={15} /> Create Coupon
              </button>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                      {['Coupon Code', 'Discount', 'Status', 'Usage Limit', 'Expiry Date'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 'NEONLIME30', discount: '30% Off Total Bill', status: 'Active', usage: '48 / 100 uses', exp: 'Jun 30, 2026' },
                      { code: 'BISTARTUP15', discount: '15% Off Professional Plan', status: 'Active', usage: '12 / 50 uses', exp: 'Jul 15, 2026' },
                      { code: 'FREECONSULT', discount: '100% Off Starter Discovery Call', status: 'Active', usage: '5 / 10 uses', exp: 'Aug 01, 2026' },
                      { code: 'EXPIRED50', discount: '50% Off Starter Plan', status: 'Expired', usage: '100 / 100 uses', exp: 'May 01, 2026' },
                    ].map((c, i) => (
                      <tr key={i} style={{ borderBottom: i < 3 ? `1px solid ${css.border}` : 'none' }}>
                        <td style={{ padding: '16px 20px' }}><code style={{ fontSize: 'var(--text-small)', background: css.surface2, padding: '3px 8px', borderRadius: 6, color: css.accent, fontWeight: 800 }}>{c.code}</code></td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{c.discount}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, background: c.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: c.status === 'Active' ? '#10b981' : css.muted, border: `1px solid ${c.status === 'Active' ? '#10b98125' : '#1e293b25'}`, padding: '3px 10px', borderRadius: 999 }}>{c.status}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.text }}>{c.usage}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.muted }}>{c.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ─── CMS MEDIA LIBRARY ───
      case 'cms/media':
        return (
          <div>
            {/* Hidden Input for Real Upload */}
            <input
              type="file"
              ref={mediaFileInputRef}
              onChange={handleMediaFileUpload}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            />

            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>CMS</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Media Library</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Upload and organize assets, images, and files for layouts and posts.</p>
              </div>
              <button onClick={handleMediaUploadClick}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Upload size={15} /> Upload File
              </button>
            </div>

            {/* Drag & Drop Simulation area */}
            <div onClick={handleMediaUploadClick}
              style={{ width: '100%', border: `2px dashed ${css.border}`, borderRadius: 14, background: css.surface, padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 24, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = css.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = css.border}
            >
              <Upload size={32} color={css.muted} style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: css.text, margin: '0 0 4px' }}>Drag and drop media files here, or click to upload</p>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: 0 }}>Supports JPG, PNG, WEBP, SVG, and PDF (Max 10MB)</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {mediaList.map((m) => (
                <div key={m.id} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow, display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ height: 120, background: css.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: `1px solid ${css.border}`, position: 'relative' }}>
                    {m.type === 'image' && m.url !== '#' ? (
                      <img src={m.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <File size={32} color={css.muted} />
                    )}
                  </div>
                  <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.text, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={m.name}>{m.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: 'var(--text-small)', color: css.muted, fontWeight: 600 }}>{m.size} &bull; {m.date}</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {m.url !== '#' && (
                          <button onClick={(e) => { e.stopPropagation(); handleCopy(m.url); }}
                            title="Copy link to clipboard"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedText === m.url ? '#10b981' : css.muted, padding: 2, display: 'flex', alignItems: 'center' }}
                          >
                            {copiedText === m.url ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setMediaList(mediaList.filter(x => x.id !== m.id)); }}
                          title="Delete asset"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted, padding: 2, display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = css.muted}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ─── SYSTEM SETTINGS ───
      case 'settings/security':
        return (
          <div style={{ maxWidth: 720 }}>
            {/* Live Notification Toast */}
            {mfaSuccessMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                borderRadius: 10,
                background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.10)',
                border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.35)'}`,
                color: isDark ? '#34d399' : '#065f46',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
              }}>
                <CheckCircle2 size={16} />
                <span>{mfaSuccessMsg}</span>
              </div>
            )}

            {/* Unified Admin Header with font-weight 600 matching all headings */}
            <header className={adminStyles.header} style={{ marginBottom: 24 }}>
              <div className={adminStyles.headerCopy}>
                <div className={adminStyles.eyebrow}>
                  <span className={adminStyles.eyebrowDot} />
                  System Settings
                </div>
                <h1 className={adminStyles.title} style={{ fontWeight: 600, margin: '0 0 8px' }}>
                  Security &amp; Authorization
                </h1>
                <p className={adminStyles.subtitle}>
                  Configure hardware &amp; software Multi-Factor Authentication (MFA), active developer sessions, and CIDR IP access policies.
                </p>
              </div>
              <span className={adminStyles.badge}>
                <ShieldCheck size={13} />
                {mfaEnabled ? 'MFA Protected' : 'MFA Inactive'}
              </span>
            </header>

            {/* The 2 Cards Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* CARD 1: Two-Factor Authentication (MFA) */}
              <div style={{
                background: css.surface,
                border: `1px solid ${css.border}`,
                borderRadius: 14,
                padding: 22,
                boxShadow: css.shadow,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: css.text,
                      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                    }}>
                      Two-Factor Authentication (MFA)
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: mfaEnabled
                        ? (isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.10)')
                        : (isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)'),
                      border: `1px solid ${mfaEnabled
                        ? (isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.30)')
                        : (isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.25)')}`,
                      color: mfaEnabled
                        ? (isDark ? '#34d399' : '#065f46')
                        : (isDark ? '#f87171' : '#991b1b'),
                    }}>
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: mfaEnabled ? '#10b981' : '#ef4444',
                      }} />
                      {mfaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <button
                    onClick={handleToggleMfa}
                    style={{
                      background: mfaEnabled ? 'transparent' : 'var(--accent)',
                      border: `1px solid ${mfaEnabled ? (isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.4)') : 'var(--accent)'}`,
                      borderRadius: 8,
                      padding: '5px 12px',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 700,
                      color: mfaEnabled ? (isDark ? '#f87171' : '#b91c1c') : 'var(--btn-primary-text)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {mfaEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                <p style={{
                  fontSize: 12.5,
                  color: css.muted,
                  lineHeight: 1.55,
                  margin: '0 0 16px',
                }}>
                  Add an extra layer of protection by requiring an authenticator code (Google Authenticator, Microsoft Authenticator, 1Password, or Authy) during sign-in.
                </p>

                {mfaEnabled && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: css.surface2,
                    border: `1px solid ${css.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 8,
                      fontSize: 12,
                    }}>
                      <span style={{ color: css.muted }}>Protocol / Method:</span>
                      <span style={{ fontWeight: 600, color: css.text, fontFamily: 'var(--font-mono, monospace)', fontSize: 11.5 }}>
                        RFC 6238 TOTP (SHA-256)
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 8,
                      fontSize: 12,
                    }}>
                      <span style={{ color: css.muted }}>Recovery Keys:</span>
                      <span style={{ fontWeight: 600, color: isDark ? '#34d399' : '#065f46' }}>
                        8 unused keys stored
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 4,
                      paddingTop: 10,
                      borderTop: `1px solid ${css.border}`,
                      flexWrap: 'wrap',
                    }}>
                      <button
                        onClick={() => setShowRecoveryModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: css.surface,
                          border: `1px solid ${css.border}`,
                          borderRadius: 6,
                          padding: '5px 11px',
                          cursor: 'pointer',
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: css.text,
                        }}
                      >
                        <Key size={13} style={{ color: isDark ? '#34d399' : '#047857' }} />
                        <span>View Recovery Codes</span>
                      </button>

                      <button
                        onClick={() => setShowMfaSetupModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: css.surface,
                          border: `1px solid ${css.border}`,
                          borderRadius: 6,
                          padding: '5px 11px',
                          cursor: 'pointer',
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: css.text,
                        }}
                      >
                        <QrCode size={13} style={{ color: 'var(--accent)' }} />
                        <span>Reconfigure Device</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 2: Session IP Whitelisting */}
              <div style={{
                background: css.surface,
                border: `1px solid ${css.border}`,
                borderRadius: 14,
                padding: 22,
                boxShadow: css.shadow,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: css.text,
                      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                    }}>
                      Session IP Whitelisting
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: ipWhitelist.length > 0
                        ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                        : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                      border: `1px solid ${ipWhitelist.length > 0
                        ? 'color-mix(in srgb, var(--accent) 25%, transparent)'
                        : css.border}`,
                      color: ipWhitelist.length > 0
                        ? (isDark ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 40%, #000)')
                        : css.muted,
                    }}>
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: ipWhitelist.length > 0 ? 'var(--accent)' : css.muted,
                      }} />
                      {ipWhitelist.length > 0 ? `${ipWhitelist.length} Active` : 'None'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowIpModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: css.surface,
                      border: `1px solid ${css.border}`,
                      borderRadius: 8,
                      padding: '5px 12px',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 700,
                      color: css.text,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Plus size={12} />
                    <span>Add IP</span>
                  </button>
                </div>

                <p style={{
                  fontSize: 12.5,
                  color: css.muted,
                  lineHeight: 1.55,
                  margin: '0 0 16px',
                }}>
                  Restrict administrative dashboard access and mutation endpoints to specific developer static IP addresses or CIDR subnets.
                </p>

                {ipWhitelist.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ipWhitelist.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: css.surface2,
                          border: `1px solid ${css.border}`,
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <code style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: css.text,
                            fontFamily: 'var(--font-mono, monospace)',
                            background: css.surface,
                            border: `1px solid ${css.border}`,
                            padding: '2px 7px',
                            borderRadius: 4,
                          }}>
                            {item.cidr}
                          </code>
                          <span style={{ fontSize: 12, color: css.muted }}>{item.label}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10.5, color: css.muted }}>{item.date}</span>
                          <button
                            onClick={() => handleRemoveIp(item.id)}
                            title="Remove IP Rule"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: css.muted,
                              cursor: 'pointer',
                              padding: '2px 4px',
                              borderRadius: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: css.surface2,
                    border: `1px solid ${css.border}`,
                    fontSize: 12,
                    color: css.muted,
                    textAlign: 'center',
                  }}>
                    No IP restrictions configured. Admin dashboard is accessible from any verified session.
                  </div>
                )}
              </div>

            </div>

            {/* ═══ MODAL: RECOVERY KEYS ═══ */}
            {showRecoveryModal && (
              <div className={adminStyles.modalOverlay} onClick={() => setShowRecoveryModal(false)}>
                <div className={adminStyles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                  <div className={adminStyles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Key size={17} style={{ color: isDark ? '#34d399' : '#047857' }} />
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)', color: css.text }}>Emergency Recovery Codes</h3>
                    </div>
                    <button className={adminStyles.modalClose} onClick={() => setShowRecoveryModal(false)}>
                      <X size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: 12.5, color: css.muted, lineHeight: 1.6, margin: '0 0 16px' }}>
                    Each emergency key can be used once to access your account if your authenticator device is unavailable. Store these in a safe place.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 8,
                    padding: 14,
                    borderRadius: 10,
                    background: css.surface2,
                    border: `1px solid ${css.border}`,
                    marginBottom: 16,
                  }}>
                    {recoveryCodes.map((code, idx) => (
                      <div key={idx} style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: css.surface,
                        border: `1px solid ${css.border}`,
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: css.text,
                      }}>
                        {idx + 1}. {code}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      onClick={() => handleCopy(recoveryCodes.join('\n'))}
                      className={adminStyles.primary}
                      style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}
                    >
                      {copiedText ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedText ? 'Copied!' : 'Copy Codes'}</span>
                    </button>

                    <button
                      onClick={() => setShowRecoveryModal(false)}
                      className={adminStyles.secondary}
                      style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ MODAL: RECONFIGURE MFA / QR SETUP ═══ */}
            {showMfaSetupModal && (
              <div className={adminStyles.modalOverlay} onClick={() => setShowMfaSetupModal(false)}>
                <div className={adminStyles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
                  <div className={adminStyles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Smartphone size={17} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)', color: css.text }}>Authenticator App Setup (TOTP)</h3>
                    </div>
                    <button className={adminStyles.modalClose} onClick={() => setShowMfaSetupModal(false)}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 12.5, color: css.muted, margin: '0 0 14px', lineHeight: 1.5 }}>
                      Scan this QR code with Google Authenticator, 1Password, or Authy.
                    </p>

                    <div style={{
                      display: 'inline-grid',
                      placeItems: 'center',
                      padding: 14,
                      borderRadius: 12,
                      background: '#ffffff',
                      border: `1px solid ${css.border}`,
                    }}>
                      <svg width="130" height="130" viewBox="0 0 140 140" fill="none">
                        <rect width="140" height="140" fill="#ffffff" />
                        <rect x="10" y="10" width="40" height="40" fill="#000000" />
                        <rect x="16" y="16" width="28" height="28" fill="#ffffff" />
                        <rect x="22" y="22" width="16" height="16" fill="#000000" />
                        
                        <rect x="90" y="10" width="40" height="40" fill="#000000" />
                        <rect x="96" y="16" width="28" height="28" fill="#ffffff" />
                        <rect x="102" y="22" width="16" height="16" fill="#000000" />
                        
                        <rect x="10" y="90" width="40" height="40" fill="#000000" />
                        <rect x="16" y="96" width="28" height="28" fill="#ffffff" />
                        <rect x="22" y="102" width="16" height="16" fill="#000000" />
                        
                        <rect x="60" y="20" width="8" height="20" fill="#000000" />
                        <rect x="75" y="15" width="8" height="10" fill="#000000" />
                        <rect x="60" y="60" width="20" height="20" fill="#000000" />
                        <rect x="65" y="65" width="10" height="10" fill="#ffffff" />
                        <rect x="20" y="60" width="30" height="8" fill="#000000" />
                        <rect x="90" y="60" width="15" height="15" fill="#000000" />
                        <rect x="110" y="70" width="20" height="8" fill="#000000" />
                        <rect x="60" y="95" width="20" height="8" fill="#000000" />
                        <rect x="85" y="90" width="15" height="25" fill="#000000" />
                        <rect x="105" y="105" width="25" height="25" fill="#000000" />
                      </svg>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 11, color: css.muted }}>Secret Key:</span>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 4,
                        marginLeft: 6,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: css.surface2,
                        border: `1px solid ${css.border}`,
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: css.text,
                      }}>
                        <span>DS-MFA-9842-K7X1-AUTH</span>
                        <button
                          onClick={() => handleCopy('DS-MFA-9842-K7X1-AUTH')}
                          style={{ background: 'none', border: 'none', color: css.muted, cursor: 'pointer', padding: 2, display: 'inline-flex' }}
                        >
                          {copiedText === 'DS-MFA-9842-K7X1-AUTH' ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: css.text, marginBottom: 5 }}>
                      Enter 6-digit Code:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCodeInput}
                      onChange={(e) => setTotpCodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${css.border}`,
                        background: css.surface,
                        color: css.text,
                        fontSize: 16,
                        letterSpacing: '0.25em',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button className={adminStyles.secondary} onClick={() => setShowMfaSetupModal(false)} style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}>
                      Cancel
                    </button>
                    <button
                      className={adminStyles.primary}
                      onClick={handleConfirmMfaSetup}
                      disabled={totpCodeInput.length < 6}
                      style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}
                    >
                      <Check size={13} />
                      <span>Verify &amp; Enable</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ MODAL: ADD IP WHITELIST ═══ */}
            {showIpModal && (
              <div className={adminStyles.modalOverlay} onClick={() => setShowIpModal(false)}>
                <div className={adminStyles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
                  <div className={adminStyles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Globe size={17} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)', color: css.text }}>Add Allowed IP Address</h3>
                    </div>
                    <button className={adminStyles.modalClose} onClick={() => setShowIpModal(false)}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: css.text, marginBottom: 4 }}>
                        IP Address or CIDR:
                      </label>
                      <input
                        type="text"
                        value={newIpAddress}
                        onChange={(e) => setNewIpAddress(e.target.value)}
                        placeholder="e.g. 103.21.244.18 or 10.0.0.0/16"
                        style={{
                          width: '100%',
                          padding: '8px 11px',
                          borderRadius: 7,
                          border: `1px solid ${css.border}`,
                          background: css.surface,
                          color: css.text,
                          fontSize: 12.5,
                          fontFamily: 'var(--font-mono, monospace)',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: css.text, marginBottom: 4 }}>
                        Description / Label:
                      </label>
                      <input
                        type="text"
                        value={newIpLabel}
                        onChange={(e) => setNewIpLabel(e.target.value)}
                        placeholder="e.g. Home Office Static Fiber"
                        style={{
                          width: '100%',
                          padding: '8px 11px',
                          borderRadius: 7,
                          border: `1px solid ${css.border}`,
                          background: css.surface,
                          color: css.text,
                          fontSize: 12.5,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button className={adminStyles.secondary} onClick={() => setShowIpModal(false)} style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}>
                      Cancel
                    </button>
                    <button className={adminStyles.primary} onClick={handleAddIp} disabled={!newIpAddress.trim()} style={{ fontSize: 12, padding: '7px 14px', minHeight: 36 }}>
                      <Plus size={13} />
                      <span>Add IP</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'settings/integrations':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>System Settings</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Integrations Hub</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Review external API integrations, mail servers, and database connectors.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 20 }}>
              {[
                { name: 'Prisma Client', desc: 'Active Database integration connecting PostgreSQL schema.', status: 'Connected', badgeColor: '#10b981' },
                { name: 'Next-Auth / AuthJS', desc: 'Handles administrator OAuth and secure login sessions.', status: 'Connected', badgeColor: '#10b981' },
                { name: 'Nodemailer Payout', desc: 'Handles lead notification mailers and outbound support emails.', status: 'Configured', badgeColor: '#6366f1' },
                { name: 'n8n Automation', desc: 'Pushes incoming messages and inquiries to Discord/Slack workflows.', status: 'Active', badgeColor: '#10b981' },
              ].map((c, i) => (
                <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 22, boxShadow: css.shadow }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, color: css.text, margin: '0 0 4px' }}>{c.name}</h3>
                  <p style={{ fontSize: 'var(--text-small)', color: css.muted, lineHeight: 1.5, margin: '0 0 16px' }}>{c.desc}</p>
                  <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: c.badgeColor, background: `${c.badgeColor}0f`, border: `1px solid ${c.badgeColor}25`, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // ─── SYSTEM ALERTS ───
      case 'notifications/alerts':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Notifications</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>System Alerts</h1>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Review system security updates, login alerts, and API logging events.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { type: 'warning', text: 'Multiple failed admin login attempts from IP 192.168.1.1', date: '30m ago', icon: AlertTriangle, color: '#f59e0b' },
                { type: 'info', text: 'Database automated schema migration check completed successfully.', date: '3h ago', icon: Shield, color: '#10b981' },
                { type: 'security', text: 'Production API key generated for Live Production Key.', date: '1d ago', icon: Key, color: '#6366f1' },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: '16px 20px', boxShadow: css.shadow, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={a.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{a.text}</div>
                      <div style={{ fontSize: 'var(--text-small)', color: css.muted, marginTop: 3 }}>{a.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ─── DEVELOPER TOOLS ───
      case 'developer/keys':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Developer</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>API Access Tokens</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Configure secure authorization headers for external scripts.</p>
              </div>
              <button onClick={() => setKeys([{ name: 'Sandbox Test Key', key: 'ds_test_' + Math.random().toString(36).substring(2, 15), created: new Date().toISOString().split('T')[0] }, ...keys])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Plus size={15} /> Generate Key
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {keys.map((k, i) => (
                <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 22, boxShadow: css.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: css.text, margin: 0 }}>{k.name}</h3>
                    <span style={{ fontSize: 'var(--text-small)', color: css.muted, fontWeight: 500 }}>Generated on {k.created}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 10, padding: '10px 14px', alignItems: 'center' }}>
                    <code style={{ fontSize: 'var(--text-small)', color: css.accent, fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.key}</code>
                    <button onClick={() => handleCopy(k.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted, display: 'flex' }}>
                      {copiedText === k.key ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'developer/webhooks':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Developer</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Webhook Subscriptions</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Configure URL endpoints to receive payload notifications on events.</p>
              </div>
              <button onClick={() => alert('Simulating webhook URL creation')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Plus size={15} /> Add Endpoint
              </button>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: 24, boxShadow: css.shadow, textAlign: 'center' }}>
              <Terminal size={32} color={css.muted} style={{ marginBottom: 12, opacity: 0.5 }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: '0 0 6px' }}>No active webhook endpoints</h3>
              <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '0 0 20px' }}>Register an endpoint to receive live event payloads for new leads or reviews.</p>
              <button onClick={() => alert('Simulating webhook URL creation')} style={{ padding: '8px 16px', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 'var(--text-small)', fontWeight: 700, cursor: 'pointer' }}>Register Endpoint</button>
            </div>
          </div>
        );

      case 'developer/logs':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Developer</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Live System Logs</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Review system logs, error traces, and runtime database metrics.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-small)', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Live Console Stream</span>
              </div>
            </div>

            <div style={{ background: isDark ? '#050505' : '#1e293b', border: `1px solid ${css.border}`, borderRadius: 14, padding: 20, fontFamily: 'monospace', fontSize: 'var(--text-small)', color: '#38bdf8', minHeight: 380, maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}>
              <div><span style={{ color: '#8b5cf6' }}>[2026-06-11 14:45:00]</span> INFO: Next.js dev server hot-reload triggered successfully.</div>
              <div><span style={{ color: '#8b5cf6' }}>[2026-06-11 14:45:05]</span> PRISMA: Query executed: <span style={{ color: '#10b981' }}>SELECT &quot;public&quot;.&quot;User&quot;.&quot;id&quot;, ... FROM &quot;public&quot;.&quot;User&quot;</span> in 12ms.</div>
              <div><span style={{ color: '#8b5cf6' }}>[2026-06-11 14:45:12]</span> INFO: GET /api/admin/stats 200 - served in 115ms.</div>
              <div><span style={{ color: '#ef4444' }}>[2026-06-11 14:46:01]</span> WARN: Failed auth credentials attempt from username &quot;admin_tester&quot; via IP 172.22.40.1.</div>
              <div><span style={{ color: '#8b5cf6' }}>[2026-06-11 14:47:10]</span> PRISMA: Query executed: <span style={{ color: '#10b981' }}>SELECT COUNT(*) FROM &quot;public&quot;.&quot;PageView&quot;</span> in 4ms.</div>
              <div style={{ color: '#64748b' }}>&bull; Waiting for next system event console stream...</div>
            </div>
          </div>
        );

      // ─── SUPPORT TICKETS ───
      case 'support/tickets':
        return (
          <div>
            <div className={adminStyles.legacyHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Support Desk</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Inbound Tickets</h1>
                <p style={{ fontSize: 'var(--text-small)', color: css.muted, margin: '4px 0 0' }}>Moderate customer requests, server bugs, and contact tickets.</p>
              </div>
              <button onClick={() => setTickets([{ id: 'TCK-' + Math.floor(Math.random() * 800 + 100), subject: 'Automated server alert: High CPU utilization', client: 'System Monitor', status: 'Open', priority: 'High', date: 'Just now' }, ...tickets])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                <Plus size={15} /> Create Ticket
              </button>
            </div>

            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: css.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                      {['Ticket ID', 'Client', 'Subject', 'Priority', 'Status', 'Date Created', 'Action'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 'var(--text-small)', fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t, i) => (
                      <tr key={i} style={{ borderBottom: i < tickets.length - 1 ? `1px solid ${css.border}` : 'none' }}>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>{t.id}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.text }}>{t.client}</td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', fontWeight: 600, color: css.text }}>{t.subject}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: t.priority === 'High' ? '#ef4444' : t.priority === 'Medium' ? '#f59e0b' : '#3b82f6', background: t.priority === 'High' ? 'rgba(239,68,68,0.08)' : t.priority === 'Medium' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)', padding: '2px 8px', borderRadius: 6 }}>{t.priority}</span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: 'var(--text-small)', fontWeight: 700, background: t.status === 'Open' ? 'rgba(239,68,68,0.1)' : t.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: t.status === 'Open' ? '#ef4444' : t.status === 'Resolved' ? '#10b981' : '#6366f1', padding: '3px 10px', borderRadius: 999 }}>{t.status}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 'var(--text-small)', color: css.muted }}>{t.date}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <button onClick={() => alert('Simulating Ticket Chat Thread')} style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 'var(--text-small)', fontWeight: 700, color: css.text }}>Reply</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ─── DEFAULT FALLBACK ───
      default:
        return (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: css.text, margin: '0 0 10px' }}>Admin Module Placeholder</h2>
            <p style={{ fontSize: 14, color: css.muted, margin: '0 0 24px' }}>Path: <code>/admin/{path}</code></p>
            <button onClick={() => router.push('/admin')} style={{ padding: '10px 20px', background: css.accent, color: 'var(--btn-primary-text)', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 'var(--text-small)', cursor: 'pointer' }}>Back to Dashboard</button>
          </div>
        );
    }
  };

  return (
    <div className={adminStyles.legacyPage}>
      {renderContent()}
    </div>
  );
}
