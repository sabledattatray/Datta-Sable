'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Save, Loader2, AlertCircle, FolderKanban, CheckCircle2, TrendingUp } from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

const toolColors: Record<string, { bg: string; color: string; border: string }> = {
  Tableau:    { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  'Power BI': { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  Excel:      { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Python:     { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Looker:     { bg: 'rgba(168,85,247,0.1)',  color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
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

  const publishedCount = projects.filter(p => p.published).length;
  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Portfolio & Case Studies
          </div>
          <h1 className={adminStyles.title}>
            Projects <span className={adminStyles.titleAccent}>Portfolio</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Manage your analytics showcases, case studies, client deliverables, and interactive dashboards.
          </p>
        </div>
        <div className={adminStyles.headerActions}>
          <div className={adminStyles.searchBar} style={{ minWidth: 220 }}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openAdd} className={adminStyles.primary}>
            <Plus size={15} /> Add Project
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Projects</span>
            <FolderKanban size={16} />
          </div>
          <div className={adminStyles.metricValue}>{projects.length}</div>
          <div className={adminStyles.metricBottom}>
            <span>All repository items</span>
            <span>{filtered.length} showing</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Published</span>
            <CheckCircle2 size={16} />
          </div>
          <div className={adminStyles.metricValue}>{publishedCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Live on public portfolio</span>
            <span>{projects.length - publishedCount} drafts</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Impressions</span>
            <TrendingUp size={16} />
          </div>
          <div className={adminStyles.metricValue}>{totalViews.toLocaleString()}</div>
          <div className={adminStyles.metricBottom}>
            <span>Cumulative project views</span>
            <span>All-time</span>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={adminStyles.notice} style={{ borderColor: 'rgba(239,68,68,0.3)', borderLeftColor: '#ef4444', color: '#f87171' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Table / List */}
      {loading ? (
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div>Loading projects...</div>
        </div>
      ) : (
        <>
          <div className="desktop-only">
            <div className={adminStyles.tableWrapper}>
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>Project</th>
                    <th className={adminStyles.th}>Client</th>
                    <th className={adminStyles.th}>Primary Tool</th>
                    <th className={adminStyles.th}>Status</th>
                    <th className={adminStyles.th} style={{ textAlign: 'right' }}>Views</th>
                    <th className={adminStyles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={adminStyles.td} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
                        No projects matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => {
                      const primaryTool = p.tools && p.tools.length > 0 ? p.tools[0] : 'Other';
                      const tool = toolColors[primaryTool] || { bg: 'var(--surface2)', color: 'var(--muted)', border: 'var(--border)' };
                      return (
                        <tr key={p.id} className={adminStyles.tr}>
                          <td className={adminStyles.td}>
                            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{p.title}</div>
                            <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', letterSpacing: '0.04em' }}>{p.category}</div>
                          </td>
                          <td className={adminStyles.td} style={{ color: 'var(--muted)', fontWeight: 500 }}>
                            {p.client || '—'}
                          </td>
                          <td className={adminStyles.td}>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: 'var(--text-small)',
                                fontWeight: 600,
                                background: tool.bg,
                                color: tool.color,
                                border: `1px solid ${tool.border}`,
                                padding: '2px 8px',
                                borderRadius: 999,
                                letterSpacing: '0.04em',
                              }}
                            >
                              {primaryTool}
                            </span>
                          </td>
                          <td className={adminStyles.td}>
                            {p.published ? (
                              <span className={adminStyles.badge}>
                                <span className={adminStyles.badgeLiveDot} /> Published
                              </span>
                            ) : (
                              <span className={adminStyles.badgeNeutral}>
                                Draft
                              </span>
                            )}
                          </td>
                          <td className={adminStyles.td} style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            {p.views || 0}
                          </td>
                          <td className={adminStyles.td} style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openEdit(p)}
                                title="Edit"
                                className={adminStyles.secondary}
                                style={{ minHeight: 32, padding: '6px 10px' }}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                title="Delete"
                                className={adminStyles.danger}
                                style={{ minHeight: 32, padding: '6px 10px' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile view */}
          <div className={adminStyles.mobileOnly} style={{ flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {filtered.map(p => (
              <div key={p.id} className={adminStyles.panel} style={{ padding: 18, marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{p.title}</div>
                    <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', marginTop: 2 }}>{p.category} &bull; {p.client}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} className={adminStyles.secondary} style={{ minHeight: 30, padding: '4px 8px' }}>
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className={adminStyles.danger} style={{ minHeight: 30, padding: '4px 8px' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  {p.published ? (
                    <span className={adminStyles.badge}><span className={adminStyles.badgeLiveDot} /> Published</span>
                  ) : (
                    <span className={adminStyles.badgeNeutral}>Draft</span>
                  )}
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--muted)' }}>👁️ {p.views || 0} views</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className={adminStyles.modalOverlay} onClick={closeModal}>
          <div className={adminStyles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={adminStyles.modalHeader}>
              <h3>{editing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={closeModal} className={adminStyles.modalClose}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Project Title *</label>
                  <input
                    required
                    className={adminStyles.input}
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Sales Performance Dashboard"
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Client *</label>
                  <input
                    required
                    className={adminStyles.input}
                    value={form.client}
                    onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                    placeholder="e.g. Retail Corp"
                  />
                </div>
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Category</label>
                  <select
                    className={adminStyles.select}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {['Dashboard', 'Analysis', 'Report', 'Automation', 'AI Infrastructure'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Tools (Comma separated) *</label>
                  <input
                    required
                    className={adminStyles.input}
                    value={form.toolsString}
                    onChange={e => setForm(f => ({ ...f, toolsString: e.target.value }))}
                    placeholder="e.g. Power BI, DAX, SQL"
                  />
                </div>
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Accent Color</label>
                  <input
                    className={adminStyles.input}
                    value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    placeholder="var(--accent) or #bef264"
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Image Path / URL</label>
                  <input
                    className={adminStyles.input}
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="/images/portfolio/project.jpg"
                  />
                </div>
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Status</label>
                  <select
                    className={adminStyles.select}
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Impact / Metrics</label>
                  <input
                    className={adminStyles.input}
                    value={form.impact}
                    onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}
                    placeholder="-18% Inventory Cost, $72K Saved"
                  />
                </div>
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Short Description *</label>
                <textarea
                  required
                  rows={2}
                  className={adminStyles.textarea}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Executive summary of the project deliverable..."
                />
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>The Problem</label>
                  <textarea
                    rows={3}
                    className={adminStyles.textarea}
                    value={form.problem}
                    onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
                    placeholder="What business challenge was addressed?"
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>The Solution</label>
                  <textarea
                    rows={3}
                    className={adminStyles.textarea}
                    value={form.solution}
                    onChange={e => setForm(f => ({ ...f, solution: e.target.value }))}
                    placeholder="How was it resolved?"
                  />
                </div>
              </div>

              <div className={adminStyles.modalGrid2}>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>GitHub URL</label>
                  <input
                    className={adminStyles.input}
                    value={form.github}
                    onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className={adminStyles.field}>
                  <label className={adminStyles.label}>Live Demo URL</label>
                  <input
                    className={adminStyles.input}
                    value={form.live}
                    onChange={e => setForm(f => ({ ...f, live: e.target.value }))}
                    placeholder="https://app.powerbi.com/..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={closeModal} className={adminStyles.secondary}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={adminStyles.primary}>
                  {saving ? (
                    <>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> {editing ? 'Update Project' : 'Publish Project'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </div>
  );
}
