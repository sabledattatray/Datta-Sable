'use client';
import { useState, useEffect, useCallback } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Clock, X, Save, Loader2, AlertCircle, CheckCircle2, Tag, Star } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const serviceGradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #db2777)',
];

interface Service {
  id: string;
  title: string;
  desc: string;
  price: string;
  status: string;
  category: string | null;
  orders: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  title: string;
  desc: string;
  price: string;
  status: string;
  category: string;
  featured: boolean;
}

const emptyForm: FormState = { title: '', desc: '', price: '', status: 'Active', category: '', featured: false };

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function AdminServices() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: '#000000', surface: '#000000', surface2: '#121212', border: '#1a1a1a', text: '#f1f5f9', muted: '#64748b', accent: '#6366f1', shadow: '0 4px 24px rgba(0,0,0,0.35)', hoverShadow: '0 8px 32px rgba(0,0,0,0.5)' }
    : { bg: '#f0f4ff', surface: '#ffffff', surface2: '#f8faff', border: '#e2e8f0', text: '#0f172a', muted: '#64748b', accent: '#4f46e5', shadow: '0 4px 24px rgba(0,0,0,0.07)', hoverShadow: '0 8px 32px rgba(0,0,0,0.12)' };

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setServices(data);
    } catch {
      showToast('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, desc: s.desc, price: s.price, status: s.status, category: s.category || '', featured: s.featured });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.price.trim()) {
      showToast('error', 'Title and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, category: form.category || null };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/services/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }
      await fetchServices();
      setShowModal(false);
      showToast('success', editing ? 'Service updated!' : 'Service added!');
    } catch (e: any) {
      showToast('error', e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setServices(ss => ss.filter(s => s.id !== id));
      showToast('success', 'Service deleted');
    } catch {
      showToast('error', 'Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: css.surface2,
    border: `1.5px solid ${css.border}`,
    borderRadius: 11,
    fontSize: 13,
    color: css.text,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%', position: 'relative' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 10,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
          color: '#fff', padding: '12px 20px', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)', fontSize: 13, fontWeight: 600,
          animation: 'slideInRight 0.3s ease',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 24, padding: 32, width: '100%', maxWidth: 500, boxShadow: css.hoverShadow }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  {editing ? 'Editing service' : 'New service'}
                </p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: css.text, margin: 0 }}>
                  {editing ? 'Edit Service' : 'Add Service'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted, padding: 4, display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                  Service Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Dashboard Development"
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border}
                />
              </div>

              {/* Price + Category row */}
              <div className="services-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                    Price *
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. ₹15,000"
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Analytics"
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Short description of the service..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = css.accent}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = css.border}
                />
              </div>

              {/* Status + Featured row */}
              <div className="services-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                    Featured
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${form.featured ? '#f59e0b' : css.border}`,
                      background: form.featured ? 'rgba(245,158,11,0.1)' : css.surface2,
                      color: form.featured ? '#f59e0b' : css.muted,
                      display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Star size={14} fill={form.featured ? '#f59e0b' : 'none'} />
                    {form.featured ? 'Featured' : 'Not featured'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 11, color: css.text, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 2, padding: '12px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 11, color: '#fff', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: saving ? 0.75 : 1 }}
                >
                  {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                  {saving ? 'Saving…' : (editing ? 'Update Service' : 'Add Service')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Offerings</p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Service Catalog</h1>
          <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0' }}>
            {loading ? 'Loading…' : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 14px ${css.accent}40` }}
        >
          <Plus size={17} /> Add Service
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, height: 220, animation: 'pulse 1.6s ease-in-out infinite' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: css.surface2, marginBottom: 18 }} />
              <div style={{ height: 16, width: '70%', borderRadius: 8, background: css.surface2, marginBottom: 10 }} />
              <div style={{ height: 12, width: '90%', borderRadius: 6, background: css.surface2, marginBottom: 6 }} />
              <div style={{ height: 12, width: '60%', borderRadius: 6, background: css.surface2 }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && services.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `${css.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={32} color={css.accent} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>No services yet</h3>
          <p style={{ fontSize: 14, color: css.muted, margin: 0, textAlign: 'center' }}>Add your first service to start building your catalog.</p>
          <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={17} /> Add First Service
          </button>
        </div>
      )}

      {/* Cards grid */}
      {!loading && services.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {services.map((s, i) => (
            <div
              key={s.id}
              style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, boxShadow: css.shadow, display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, transform 0.2s', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = css.hoverShadow; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = css.shadow; }}
            >
              {/* Featured badge */}
              {s.featured && (
                <div style={{ position: 'absolute', top: 16, right: 60, display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <Star size={8} fill="#f59e0b" /> Featured
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: serviceGradients[i % serviceGradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                  <Briefcase size={20} color="#fff" />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => openEdit(s)}
                    title="Edit service"
                    style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = css.accent; (e.currentTarget as HTMLElement).style.borderColor = css.accent; (e.currentTarget as HTMLElement).style.background = `${css.accent}10`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    title="Delete service"
                    style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: deleting === s.id ? 'not-allowed' : 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.borderColor = '#ef444440'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                  >
                    {deleting === s.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: css.text, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{s.title}</h3>

              {s.category && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: css.accent, background: `${css.accent}12`, border: `1px solid ${css.accent}25`, padding: '2px 8px', borderRadius: 999, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', width: 'fit-content' }}>
                  <Tag size={9} /> {s.category}
                </div>
              )}

              <p style={{ fontSize: 12, color: css.muted, margin: `${s.category ? '0' : '0'} 0 16px`, lineHeight: 1.6 }}>{s.desc || 'No description provided.'}</p>

              <div style={{ fontSize: 26, fontWeight: 900, color: css.text, letterSpacing: '-0.03em', margin: '0 0 18px', marginTop: 'auto' }}>{s.price}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: `1px solid ${css.border}` }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700,
                  background: s.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                  color: s.status === 'Active' ? '#10b981' : css.muted,
                  border: `1px solid ${s.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)'}`,
                  padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.status === 'Active' ? '#10b981' : css.muted }} />
                  {s.status}
                </span>
                <span style={{ fontSize: 12, color: css.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} /> {s.orders} order{s.orders !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideInRight { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @media (max-width: 600px) {
          .services-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
