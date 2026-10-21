'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Star, CheckCircle, XCircle, Search, Trash2, Clock,
  Plus, Pencil, X, Save, Loader2, AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: 'var(--bg)', surface: 'var(--surface)', surface2: 'var(--surface2)', border: 'var(--border)', text: 'var(--text)', muted: 'var(--muted)', accent: 'var(--accent)', shadow: '0 4px 24px rgba(0,0,0,0.35)', hoverShadow: '0 8px 32px rgba(0,0,0,0.5)', overlay: 'rgba(0,0,0,0.7)' }
    : { bg: 'var(--bg)', surface: 'var(--surface)', surface2: 'var(--surface2)', border: 'var(--border)', text: 'var(--text)', muted: 'var(--muted)', accent: 'var(--accent)', shadow: '0 4px 24px rgba(0,0,0,0.07)', hoverShadow: '0 8px 32px rgba(0,0,0,0.12)', overlay: 'rgba(0,0,0,0.4)' };

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

  // ── Filtered list ──────────────────────────────────────────────────
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

  // ── Open modal for Add ─────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open modal for Edit ────────────────────────────────────────────
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

  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  // ── Validate form ──────────────────────────────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.content.trim()) errs.content = 'Review content is required';
    if (form.content.trim().length < 10) errs.content = 'Content is too short (min 10 chars)';
    return errs;
  };

  // ── Save (create or update) ────────────────────────────────────────
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating), avatarUrl: form.avatarUrl || null }),
      });
      if (!res.ok) throw new Error('Save failed');
      const saved: Testimonial = await res.json();
      if (editingId) {
        setItems(prev => prev.map(t => t.id === editingId ? saved : t));
        showToast('✅ Testimonial updated!');
      } else {
        setItems(prev => [saved, ...prev]);
        showToast('✅ Testimonial added!');
      }
      closeModal();
    } catch {
      setFormErrors({ submit: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Approve / Pending ───────────────────────────────────────
  const toggleStatus = async (t: Testimonial) => {
    const newStatus = t.status === 'APPROVED' ? 'PENDING' : 'APPROVED';
    // Optimistic update
    setItems(prev => prev.map(x => x.id === t.id ? { ...x, status: newStatus } : x));
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems(prev => prev.map(x => x.id === t.id ? updated : x));
      showToast(newStatus === 'APPROVED' ? '✅ Testimonial approved!' : '⏸ Moved to pending');
    } catch {
      // Revert
      setItems(prev => prev.map(x => x.id === t.id ? t : x));
      showToast('❌ Failed to update status');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setItems(prev => prev.filter(t => t.id !== deleteId));
      showToast('🗑️ Testimonial deleted');
    } catch {
      showToast('❌ Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  // ── Input style helper ─────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: css.surface2,
    border: `1px solid ${css.border}`, borderRadius: 10, color: css.text,
    fontSize: 13, fontWeight: 500, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: css.muted,
    textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6,
  };

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: isDark ? '#1e293b' : '#fff', border: `1px solid ${css.border}`,
          borderRadius: 14, padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          fontSize: 13, fontWeight: 600, color: css.text,
          animation: 'fadeSlideIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
            Social Proof
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>
            Testimonials
          </h1>
          <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0' }}>
            {approved} approved · {items.length - approved} pending review
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, padding: '9px 14px', minWidth: 220 }}>
            <Search size={14} color={css.muted} />
            <input
              type="text" placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, fontWeight: 500, width: '100%' }}
            />
          </div>
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            style={{ padding: '9px 14px', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, color: css.text, fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>
          {/* Add button */}
          <button
            onClick={openAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
              background: css.accent, border: 'none', borderRadius: 12,
              color: 'var(--btn-primary-text)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)`, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={15} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, marginBottom: 20, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Reviews', value: loading ? '…' : items.length, color: '#6366f1' },
          { label: 'Approved', value: loading ? '…' : approved, color: '#10b981' },
          { label: 'Pending', value: loading ? '…' : items.length - approved, color: '#f59e0b' },
          { label: 'Avg Rating', value: loading ? '…' : `⭐ ${avgRating}`, color: '#ec4899' },
        ].map((s, i) => (
          <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: '18px 22px', boxShadow: css.shadow }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: '24px 28px', animation: 'shimmer 1.6s ease-in-out infinite' }}>
              <div style={{ height: 16, width: '40%', background: css.surface2, borderRadius: 8, marginBottom: 12 }} />
              <div style={{ height: 12, width: '80%', background: css.surface2, borderRadius: 8, marginBottom: 8 }} />
              <div style={{ height: 12, width: '60%', background: css.surface2, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 && (
            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: '56px 48px', textAlign: 'center' }}>
              <Star size={36} color={css.muted} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: css.text, margin: '0 0 6px' }}>
                {items.length === 0 ? 'No testimonials yet' : 'No results found'}
              </p>
              <p style={{ fontSize: 13, color: css.muted, margin: 0 }}>
                {items.length === 0 ? 'Click "Add Testimonial" to add your first review.' : 'Try adjusting your search or filter.'}
              </p>
            </div>
          )}
          {filtered.map(t => (
            <div
              key={t.id}
              style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, padding: '22px 26px', boxShadow: css.shadow, transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = css.hoverShadow}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = css.shadow}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                {/* Person info */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 17, flexShrink: 0,
                  }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: css.text, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: css.muted, margin: '2px 0 0', fontWeight: 500 }}>
                      {t.role}{t.role && t.company ? ' · ' : ''}{t.company}
                    </p>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {/* Status badge */}
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: t.status === 'APPROVED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: t.status === 'APPROVED' ? '#10b981' : '#f59e0b',
                    border: `1px solid ${t.status === 'APPROVED' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase',
                    letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.status === 'APPROVED' ? '#10b981' : '#f59e0b' }} />
                    {t.status === 'APPROVED' ? 'Approved' : 'Pending'}
                  </span>
                  {/* Toggle approve */}
                  <button
                    onClick={() => toggleStatus(t)}
                    title={t.status === 'APPROVED' ? 'Move to Pending' : 'Approve'}
                    style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: t.status === 'APPROVED' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                  >
                    {t.status === 'APPROVED' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(t)}
                    title="Edit"
                    style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.accent, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                  >
                    <Pencil size={14} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(t.id)}
                    title="Delete"
                    style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < t.rating ? '#f59e0b' : 'none'} stroke={i < t.rating ? '#f59e0b' : css.muted} />
                ))}
                <span style={{ fontSize: 11, color: css.muted, marginLeft: 6, fontWeight: 600 }}>{t.rating}/5</span>
              </div>
              <p style={{ fontSize: 14, color: css.text, lineHeight: 1.7, margin: '0 0 10px', fontStyle: 'italic' }}>
                "{t.content}"
              </p>
              <p style={{ fontSize: 11, color: css.muted, margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={11} /> {formatDate(t.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ══════════ ADD / EDIT MODAL ══════════ */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: css.overlay, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={closeModal}
        >
          <div
            style={{ background: css.surface, borderRadius: 24, padding: '32px 32px', width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(0,0,0,0.4)', border: `1px solid ${css.border}`, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
                  {editingId ? 'Edit Review' : 'New Review'}
                </p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: css.text, margin: 0 }}>
                  {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', padding: 6 }}>
                <X size={20} />
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text" placeholder="e.g. Sarah Johnson"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ ...inputStyle, borderColor: formErrors.name ? '#ef4444' : css.border }}
                />
                {formErrors.name && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{formErrors.name}</p>}
              </div>

              {/* Role + Company (2 columns) */}
              <div className="testimonial-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Role / Title</label>
                  <input type="text" placeholder="e.g. Product Manager" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input type="text" placeholder="e.g. TechCorp" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label style={labelStyle}>Rating</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n} type="button"
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transition: 'transform 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Star
                        size={24}
                        fill={n <= form.rating ? '#f59e0b' : 'none'}
                        stroke={n <= form.rating ? '#f59e0b' : css.muted}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: 13, color: css.muted, fontWeight: 600, marginLeft: 4 }}>{form.rating} / 5</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <label style={labelStyle}>Review Content *</label>
                <textarea
                  placeholder="Write the client's testimonial here..."
                  value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: formErrors.content ? '#ef4444' : css.border }}
                />
                {formErrors.content && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{formErrors.content}</p>}
              </div>

              {/* Status */}
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['PENDING', 'APPROVED'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 10, border: `1.5px solid`,
                        borderColor: form.status === s ? (s === 'APPROVED' ? '#10b981' : '#f59e0b') : css.border,
                        background: form.status === s ? (s === 'APPROVED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)') : 'none',
                        color: form.status === s ? (s === 'APPROVED' ? '#10b981' : '#f59e0b') : css.muted,
                        fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s === 'APPROVED' ? '✓ Approved' : '⏸ Pending'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit error */}
              {formErrors.submit && (
                <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={14} /> {formErrors.submit}
                </p>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={closeModal} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${css.border}`, background: 'none', color: css.muted, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 2, padding: '11px 0', borderRadius: 12, border: 'none',
                    background: saving ? css.border : css.accent,
                    color: '#fff', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'opacity 0.15s', opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={15} /> {editingId ? 'Update Testimonial' : 'Add Testimonial'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM MODAL ══════════ */}
      {deleteId && (
        <div
          style={{ position: 'fixed', inset: 0, background: css.overlay, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setDeleteId(null)}
        >
          <div
            style={{ background: css.surface, borderRadius: 14, padding: '28px 32px', width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.4)', border: `1px solid ${css.border}`, textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: '0 0 8px' }}>Delete Testimonial?</h3>
            <p style={{ fontSize: 13, color: css.muted, margin: '0 0 24px' }}>
              This review will be permanently removed. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${css.border}`, background: 'none', color: css.muted, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 13, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .testimonial-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
