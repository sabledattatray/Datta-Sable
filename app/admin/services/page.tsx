'use client';
import { useState, useEffect, useCallback } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Clock, X, Save, Loader2, AlertCircle, CheckCircle2, Tag, Star, Layers, CheckCheck } from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

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
    if (!confirm('Delete this service permanently? This cannot be undone.')) return;
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

  const activeCount = services.filter(s => s.status === 'Active').length;
  const featuredCount = services.filter(s => s.featured).length;
  const totalOrders = services.reduce((acc, s) => acc + (s.orders || 0), 0);

  return (
    <div className={adminStyles.page}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 10,
          background: toast.type === 'success' ? 'var(--surface)' : 'rgba(239,68,68,0.15)',
          color: toast.type === 'success' ? 'var(--accent)' : '#f87171',
          border: `1px solid ${toast.type === 'success' ? 'var(--accent)' : 'rgba(239,68,68,0.3)'}`,
          padding: '12px 20px', borderRadius: 10, boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)', fontSize: 'var(--text-small)', fontWeight: 600,
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Offerings & Packages
          </div>
          <h1 className={adminStyles.title}>
            Service <span className={adminStyles.titleAccent}>Catalog</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Manage consulting packages, custom analytics offerings, fixed scopes, and client pricing.
          </p>
        </div>
        <div className={adminStyles.headerActions}>
          <button onClick={openAdd} className={adminStyles.primary}>
            <Plus size={15} /> Add Service
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Catalog</span>
            <Layers size={16} />
          </div>
          <div className={adminStyles.metricValue}>{services.length}</div>
          <div className={adminStyles.metricBottom}>
            <span>All offerings</span>
            <span>Active: {activeCount}</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Featured Offerings</span>
            <Star size={16} />
          </div>
          <div className={adminStyles.metricValue}>{featuredCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Pinned to homepage & pricing</span>
            <span>Highlight tier</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Orders Delivered</span>
            <CheckCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>{totalOrders}</div>
          <div className={adminStyles.metricBottom}>
            <span>Cumulative fulfillment count</span>
            <span>Lifetime</span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div>Loading service catalog...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && (
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '64px 20px' }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--surface2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Briefcase size={26} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px' }}>No services published</h3>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', margin: '0 0 20px' }}>Create your first service offering to start building your catalog.</p>
          <button onClick={openAdd} className={adminStyles.primary}>
            <Plus size={15} /> Add Service
          </button>
        </div>
      )}

      {/* Service Cards Grid */}
      {!loading && services.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          {services.map((s) => (
            <div
              key={s.id}
              className={adminStyles.panel}
              style={{
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'color-mix(in srgb, var(--accent) 12%, var(--surface2))', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={18} color="var(--accent)" />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => openEdit(s)}
                    title="Edit service"
                    className={adminStyles.secondary}
                    style={{ minHeight: 30, padding: '4px 8px' }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    title="Delete service"
                    className={adminStyles.danger}
                    style={{ minHeight: 30, padding: '4px 8px' }}
                  >
                    {deleting === s.id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                  {s.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {s.category && (
                  <span className={adminStyles.badgeNeutral}>
                    <Tag size={9} /> {s.category}
                  </span>
                )}
                {s.featured && (
                  <span className={adminStyles.badge}>
                    <Star size={9} /> Featured
                  </span>
                )}
              </div>

              <p style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.6, flex: 1 }}>
                {s.desc || 'No description provided.'}
              </p>

              <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', margin: '0 0 16px' }}>
                {s.price}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                {s.status === 'Active' ? (
                  <span className={adminStyles.badge}>
                    <span className={adminStyles.badgeLiveDot} /> Active
                  </span>
                ) : (
                  <span className={adminStyles.badgeNeutral}>
                    Inactive
                  </span>
                )}
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {s.orders} order{s.orders !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={adminStyles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={adminStyles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={adminStyles.modalHeader}>
              <h3>{editing ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className={adminStyles.modalClose}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Service Title *</label>
                <input
                  type="text"
                  className={adminStyles.input}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Executive Power BI Dashboard Suite"
                />
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Price / Rate *</label>
                  <input
                    type="text"
                    className={adminStyles.input}
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. ₹15,000 or $499"
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Category</label>
                  <input
                    type="text"
                    className={adminStyles.input}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Business Intelligence"
                  />
                </div>
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Description</label>
                <textarea
                  rows={3}
                  className={adminStyles.textarea}
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Deliverables, scope, tools included, and turnaround timeline..."
                />
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Status</label>
                  <select
                    className={adminStyles.select}
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Featured on Website</label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className={adminStyles.secondary}
                    style={{
                      width: '100%',
                      minHeight: 38,
                      borderColor: form.featured ? 'var(--accent)' : 'var(--border)',
                      color: form.featured ? 'var(--accent)' : 'var(--muted)',
                    }}
                  >
                    <Star size={13} fill={form.featured ? 'currentColor' : 'none'} />
                    {form.featured ? 'Featured Service' : 'Standard Catalog'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={adminStyles.secondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={adminStyles.primary}
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> {editing ? 'Update Service' : 'Add Service'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
