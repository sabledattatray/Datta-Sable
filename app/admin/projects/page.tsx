'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const toolColors: Record<string, { bg: string; color: string }> = {
  Tableau:  { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  'Power BI': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  Excel:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  Python:   { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
  Looker:   { bg: 'rgba(168,85,247,0.1)',  color: '#a855f7' },
};

const emptyForm = {
  title: '',
  category: 'Dashboard',
  toolsString: 'Power BI',
  client: '',
  status: 'Published',
  description: '',
  problem: '',
  solution: '',
  impact: '',
  github: '',
  live: '',
  color: 'var(--accent)',
  imageUrl: '',
};

export default function ProjectsManager() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: '#000000', surface: '#000000', surface2: '#121212', border: '#1a1a1a', text: '#f1f5f9', muted: '#64748b', accent: '#6366f1', shadow: '0 4px 24px rgba(0,0,0,0.35)', hoverShadow: '0 8px 32px rgba(0,0,0,0.5)', hoverBg: 'rgba(255,255,255,0.02)' }
    : { bg: '#f0f4ff', surface: '#ffffff', surface2: '#f8faff', border: '#e2e8f0', text: '#0f172a', muted: '#64748b', accent: '#4f46e5', shadow: '0 4px 24px rgba(0,0,0,0.07)', hoverShadow: '0 8px 32px rgba(0,0,0,0.12)', hoverBg: 'rgba(0,0,0,0.015)' };

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title || '',
      category: p.category || 'Dashboard',
      toolsString: p.tools ? p.tools.join(', ') : '',
      client: p.client || '',
      status: p.published ? 'Published' : 'Draft',
      description: p.description || '',
      problem: p.problem || '',
      solution: p.solution || '',
      impact: p.impact || '',
      github: p.github || '',
      live: p.live || '',
      color: p.color || 'var(--accent)',
      imageUrl: p.imageUrl || '',
    });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        tools: form.toolsString.split(',').map(t => t.trim()).filter(Boolean),
        client: form.client,
        status: form.status,
        description: form.description,
        problem: form.problem,
        solution: form.solution,
        impact: form.impact,
        github: form.github,
        live: form.live,
        color: form.color,
        imageUrl: form.imageUrl,
      };

      const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save project');
      }

      await fetchProjects();
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project permanently? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setProjects(ps => ps.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.client && p.client.toLowerCase().includes(search.toLowerCase()))
  );

  const InputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: css.surface2,
    border: `1.5px solid ${css.border}`,
    borderRadius: 11,
    fontSize: 13,
    color: css.text,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  };

  const LabelStyle = {
    display: 'block',
    fontSize: 10,
    fontWeight: 700,
    color: css.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 6,
  };

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%' }}>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 24, padding: '28px 32px', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: css.hoverShadow }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: css.text, margin: 0 }}>{editing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted, padding: 4, display: 'flex' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Row 1: Title & Client */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>Project Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Sales Dashboard" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
                <div>
                  <label style={LabelStyle}>Client *</label>
                  <input required value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Client name" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* Row 2: Category & Primary Tools */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={InputStyle}>
                    {['Dashboard', 'Analysis', 'Report', 'Automation', 'AI Infrastructure'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LabelStyle}>Tools (Comma separated) *</label>
                  <input required value={form.toolsString} onChange={e => setForm(f => ({ ...f, toolsString: e.target.value }))} placeholder="e.g. Power BI, DAX, SQL" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* Row 3: Colors & Image Url */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>Accent Color (hex or css var)</label>
                  <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="e.g. var(--accent) or #6366f1" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
                <div>
                  <label style={LabelStyle}>Image Path / URL</label>
                  <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="e.g. /images/portfolio/supply_chain.jpg" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* Row 4: Status & Impact */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={InputStyle}>
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label style={LabelStyle}>Impact / Metrics</label>
                  <input value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))} placeholder="e.g. -18% Inventory Cost, $72K Saved" style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={LabelStyle}>Short Description *</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief summary of the project..." rows={2} style={{ ...InputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = css.border} />
              </div>

              {/* Case Study details */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>The Problem</label>
                  <textarea value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} placeholder="What business challenge was addressed?" rows={3} style={{ ...InputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = css.border} />
                </div>
                <div>
                  <label style={LabelStyle}>The Solution</label>
                  <textarea value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} placeholder="How was it resolved?" rows={3} style={{ ...InputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* GitHub / Live Links */}
              <div className="projects-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LabelStyle}>GitHub URL</label>
                  <input value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/..." style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
                <div>
                  <label style={LabelStyle}>Live Link / Embed URL</label>
                  <input value={form.live} onChange={e => setForm(f => ({ ...f, live: e.target.value }))} placeholder="https://..." style={InputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = css.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = css.border} />
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 11, color: css.text, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '12px', background: saving ? css.border : `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 11, color: '#fff', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={15} /> {editing ? 'Update' : 'Publish'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Content</p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>Projects</h1>
          <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0' }}>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <Search size={14} color={css.muted} />
            <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, fontWeight: 500, width: 180 }} />
          </div>
          <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 14px ${css.accent}40`, whiteSpace: 'nowrap' }}>
            <Plus size={17} /> Add Project
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, marginBottom: 20, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {/* Table / List */}
      {loading ? (
        <div style={{ display: 'flex', padding: '48px', justifyContent: 'center', alignItems: 'center', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, color: css.muted }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginRight: 10 }} /> Loading projects...
        </div>
      ) : (
        <>
          <div className="desktop-only" style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: css.shadow }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 780, borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: css.surface2, borderBottom: `1px solid ${css.border}` }}>
                    {['Project', 'Client', 'Tool', 'Status', 'Views', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 800, color: css.muted, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: css.muted, fontSize: 14 }}>No projects found.</td></tr>
                  )}
                  {filtered.map((p, i) => {
                    const primaryTool = p.tools && p.tools.length > 0 ? p.tools[0] : 'Other';
                    const tool = toolColors[primaryTool] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
                    return (
                      <tr key={p.id}
                        style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${css.border}` : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', maxWidth: 300 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: css.text, marginBottom: 3 }}>{p.title}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</div>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: css.muted, whiteSpace: 'nowrap' }}>{p.client}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, background: tool.bg, color: tool.color, border: `1px solid ${tool.color}30`, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{primaryTool}</span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, background: p.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.published ? '#10b981' : '#f59e0b', border: `1px solid ${p.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.published ? '#10b981' : '#f59e0b' }} />{p.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: css.text }}>{p.views}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[
                              { Icon: Edit2, action: () => openEdit(p), title: 'Edit', hoverColor: css.accent },
                              { Icon: Trash2, action: () => handleDelete(p.id), title: 'Delete', hoverColor: '#ef4444' },
                            ].map(({ Icon, action, title, hoverColor }) => (
                              <button key={title} onClick={action} title={title}
                                style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 9, padding: 7, cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = hoverColor; (e.currentTarget as HTMLElement).style.borderColor = `${hoverColor}50`; (e.currentTarget as HTMLElement).style.background = `${hoverColor}08`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                              ><Icon size={14} /></button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects Mobile Cards */}
          <div className="mobile-only" style={{ flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {filtered.length === 0 ? (
              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: '32px 16px', textAlign: 'center', color: css.muted, fontSize: 14 }}>
                No projects found.
              </div>
            ) : (
              filtered.map((p) => {
                const primaryTool = p.tools && p.tools.length > 0 ? p.tools[0] : 'Other';
                const tool = toolColors[primaryTool] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
                return (
                  <div
                    key={p.id}
                    style={{
                      background: css.surface,
                      border: `1px solid ${css.border}`,
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: css.shadow,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: css.text, lineHeight: 1.45 }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
                          {p.category}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        {[
                          { Icon: Edit2, action: () => openEdit(p), title: 'Edit', hoverColor: css.accent },
                          { Icon: Trash2, action: () => handleDelete(p.id), title: 'Delete', hoverColor: '#ef4444' },
                        ].map(({ Icon, action, title }) => (
                          <button
                            key={title}
                            onClick={action}
                            title={title}
                            style={{
                              background: 'none', border: `1px solid ${css.border}`,
                              borderRadius: 8, padding: 6, cursor: 'pointer',
                              color: css.muted, display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <span style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 700, background: tool.bg, color: tool.color, border: `1px solid ${tool.color}30`, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {primaryTool}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, fontWeight: 700, background: p.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.published ? '#10b981' : '#f59e0b', border: `1px solid ${p.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.published ? '#10b981' : '#f59e0b' }} />
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${css.border}`, paddingTop: 10, fontSize: 11, color: css.muted }}>
                      <span>Client: <strong>{p.client}</strong></span>
                      <span style={{ fontWeight: 700, color: css.text }}>👁️ {p.views} views</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .desktop-only {
          display: block !important;
        }
        .mobile-only {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .projects-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
