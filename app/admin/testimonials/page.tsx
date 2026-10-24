'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Star, CheckCircle, XCircle, Search, Trash2, Clock,
  Plus, Pencil, X, Save, Loader2, AlertCircle, MessageSquareQuote, CheckCheck, ThumbsUp
} from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  status: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM = {
  name: '', role: '', company: '', content: '', rating: 5, status: 'PENDING', avatarUrl: '',
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch {
      setError('Failed to load testimonials. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const filtered = items.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const approved = items.filter(t => t.status === 'APPROVED').length;
  const avgRating = items.length > 0
    ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)
    : '0.0';

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name, role: t.role, company: t.company,
      content: t.content, rating: t.rating,
      status: t.status, avatarUrl: t.avatarUrl || '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.content.trim()) errs.content = 'Review content is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save');
      }

      await fetchTestimonials();
      closeModal();
      showToast(isEdit ? 'Testimonial updated!' : 'Testimonial added!');
    } catch (e: any) {
      setFormErrors(f => ({ ...f, submit: e.message || 'Error saving' }));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (t: Testimonial) => {
    const next = t.status === 'APPROVED' ? 'PENDING' : 'APPROVED';
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setItems(all => all.map(x => x.id === t.id ? { ...x, status: next } : x));
      showToast(`Status updated to ${next}`);
    } catch {
      showToast('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setItems(all => all.filter(x => x.id !== deleteId));
      setDeleteId(null);
      showToast('Testimonial deleted');
    } catch {
      showToast('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className={adminStyles.page}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: 'var(--surface)', border: '1px solid var(--accent)',
          borderRadius: 10, padding: '12px 20px', boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--accent)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Social Proof & Reputation
          </div>
          <h1 className={adminStyles.title}>
            Client <span className={adminStyles.titleAccent}>Testimonials</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Manage verified client recommendations, peer endorsements, executive reviews, and star ratings.
          </p>
        </div>
        <div className={adminStyles.headerActions}>
          <div className={adminStyles.searchBar} style={{ minWidth: 200 }}>
            <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className={adminStyles.select}
            style={{ width: 'auto', minHeight: 38 }}
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>

          <button onClick={openAdd} className={adminStyles.primary}>
            <Plus size={15} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={adminStyles.notice} style={{ borderColor: 'rgba(239,68,68,0.3)', borderLeftColor: '#ef4444', color: '#f87171' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Reviews</span>
            <MessageSquareQuote size={16} />
          </div>
          <div className={adminStyles.metricValue}>{items.length}</div>
          <div className={adminStyles.metricBottom}>
            <span>All collected endorsements</span>
            <span>{filtered.length} matching</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Approved</span>
            <CheckCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>{approved}</div>
          <div className={adminStyles.metricBottom}>
            <span>Live on portfolio site</span>
            <span>Published</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Pending Review</span>
            <Clock size={16} />
          </div>
          <div className={adminStyles.metricValue}>{items.length - approved}</div>
          <div className={adminStyles.metricBottom}>
            <span>Awaiting administrator sign-off</span>
            <span>Action required</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Avg Satisfaction</span>
            <ThumbsUp size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {avgRating}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}> / 5</span>
          </div>
          <div className={adminStyles.metricBottom}>
            <span>Cumulative rating score</span>
            <span>5-star benchmark</span>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div>Loading testimonials...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 && (
            <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '56px 20px' }}>
              <Star size={32} color="var(--muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>
                {items.length === 0 ? 'No testimonials recorded' : 'No testimonials match criteria'}
              </h3>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', margin: 0 }}>
                {items.length === 0 ? 'Click "+ Add Testimonial" to enter your first client review.' : 'Try adjusting your search query or status filter.'}
              </p>
            </div>
          )}

          {filtered.map(t => (
            <div key={t.id} className={adminStyles.panel} style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                {/* Person info */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'color-mix(in srgb, var(--accent) 12%, var(--surface2))',
                    border: '1px solid color-mix(in srgb, var(--accent) 25%, var(--border))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', fontWeight: 600, fontSize: 15, flexShrink: 0,
                  }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', marginTop: 2 }}>
                      {t.role}{t.role && t.company ? ' · ' : ''}{t.company}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {t.status === 'APPROVED' ? (
                    <span className={adminStyles.badge}>
                      <span className={adminStyles.badgeLiveDot} /> Approved
                    </span>
                  ) : (
                    <span className={adminStyles.badgeNeutral}>
                      Pending
                    </span>
                  )}

                  <button
                    onClick={() => toggleStatus(t)}
                    title={t.status === 'APPROVED' ? 'Move to Pending' : 'Approve Review'}
                    className={adminStyles.secondary}
                    style={{ minHeight: 30, padding: '4px 8px' }}
                  >
                    {t.status === 'APPROVED' ? <XCircle size={13} style={{ color: '#f87171' }} /> : <CheckCircle size={13} style={{ color: 'var(--accent)' }} />}
                  </button>

                  <button
                    onClick={() => openEdit(t)}
                    title="Edit"
                    className={adminStyles.secondary}
                    style={{ minHeight: 30, padding: '4px 8px' }}
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => setDeleteId(t.id)}
                    title="Delete"
                    className={adminStyles.danger}
                    style={{ minHeight: 30, padding: '4px 8px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 10 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < t.rating ? '#fbbf24' : 'none'}
                    stroke={i < t.rating ? '#fbbf24' : 'var(--border)'}
                  />
                ))}
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', marginLeft: 6, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {t.rating}/5
                </span>
              </div>

              {/* Quote */}
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--text)', lineHeight: 1.6, margin: '0 0 12px', fontStyle: 'italic' }}>
                "{t.content}"
              </p>

              <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <Clock size={11} /> {formatDate(t.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className={adminStyles.modalOverlay} onClick={closeModal}>
          <div className={adminStyles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={adminStyles.modalHeader}>
              <h3>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={closeModal} className={adminStyles.modalClose}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Johnson"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={adminStyles.input}
                />
                {formErrors.name && <div style={{ fontSize: 'var(--text-small)', color: '#f87171', marginTop: 4 }}>{formErrors.name}</div>}
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP of Analytics"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className={adminStyles.input}
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Fintech Global"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className={adminStyles.input}
                  />
                </div>
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Rating</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star
                        size={20}
                        fill={n <= form.rating ? '#fbbf24' : 'none'}
                        stroke={n <= form.rating ? '#fbbf24' : 'var(--border)'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', fontWeight: 600, marginLeft: 6 }}>
                    {form.rating} / 5
                  </span>
                </div>
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Review Content *</label>
                <textarea
                  placeholder="Write the client's verified endorsement here..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={4}
                  className={adminStyles.textarea}
                />
                {formErrors.content && <div style={{ fontSize: 'var(--text-small)', color: '#f87171', marginTop: 4 }}>{formErrors.content}</div>}
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Approval Status</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['PENDING', 'APPROVED'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={form.status === s ? adminStyles.primary : adminStyles.secondary}
                      style={{ flex: 1, minHeight: 36 }}
                    >
                      {s === 'APPROVED' ? '✓ Approved' : '⏸ Pending Review'}
                    </button>
                  ))}
                </div>
              </div>

              {formErrors.submit && (
                <div className={adminStyles.notice} style={{ borderColor: 'rgba(239,68,68,0.3)', borderLeftColor: '#ef4444', color: '#f87171', marginBottom: 0 }}>
                  <AlertCircle size={15} /> {formErrors.submit}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={closeModal} className={adminStyles.secondary}>
                  Cancel
                </button>
                <button
                  type="button"
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
                      <Save size={14} /> {editingId ? 'Update Review' : 'Add Review'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className={adminStyles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={adminStyles.modalContent} style={{ maxWidth: 420, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ef4444' }}>
              <Trash2 size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px' }}>Delete Testimonial?</h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
              This review will be permanently deleted from the database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} className={adminStyles.secondary} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={adminStyles.danger}
                style={{ flex: 1 }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
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
