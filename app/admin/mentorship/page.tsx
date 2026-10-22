'use client';
import { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, CheckCircle, Search, 
  Trash2, ChevronRight, ExternalLink, X, Sparkles, Download, CheckCheck, BookOpen, Layers
} from 'lucide-react';
import Link from 'next/link';
import adminStyles from '@/components/admin/AdminCommon.module.css';

interface Cohort {
  id: string;
  name: string;
  status: string;
}

interface Track {
  id: string;
  name: string;
  description: string;
}

interface Request {
  id: string;
  fullName: string;
  email: string;
  linkedin: string;
  experience: string;
  targetRole: string;
  challenge: string;
  resumeUrl: string;
  status: string;
  isComebackProgram: boolean;
  mentorNotes: string;
  cohortId: string;
  trackId: string;
  cohort?: Cohort;
  track?: Track;
  progress: { id: string; week: number; moduleName: string; completed: boolean }[];
  projects: any[];
  feedbackTimeline: { id: string; content: string; createdAt: string }[];
}

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  downloadUrl: string;
  featured: boolean;
}

export default function AdminMentorship() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [activeAdminTab, setActiveAdminTab] = useState<'requests' | 'cohorts' | 'resources'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [comebackOnlyFilter, setComebackOnlyFilter] = useState(false);

  const [editCohortId, setEditCohortId] = useState('');
  const [editTrackId, setEditTrackId] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [editProgressWeeks, setEditProgressWeeks] = useState<number[]>([]);

  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortStatus, setNewCohortStatus] = useState('ACTIVE');

  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState('Roadmap');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceFeatured, setNewResourceFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, coRes, trRes, resRes] = await Promise.all([
        fetch('/api/admin/mentorship/requests'),
        fetch('/api/admin/mentorship/cohorts'),
        fetch('/api/admin/mentorship/tracks'),
        fetch('/api/admin/mentorship/resources')
      ]);

      if (reqRes.ok) setRequests((await reqRes.json()) || []);
      if (coRes.ok) setCohorts((await coRes.json()) || []);
      if (trRes.ok) setTracks((await trRes.json()) || []);
      if (resRes.ok) setResources((await resRes.json()) || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error loading mentorship platform records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setEditCohortId(selectedRequest.cohortId || '');
      setEditTrackId(selectedRequest.trackId || '');
      setEditStatus(selectedRequest.status || 'Applied');
      setEditNotes(selectedRequest.mentorNotes || '');
      setNewFeedback('');
      const completedWeeks = selectedRequest.progress ? selectedRequest.progress.filter(p => p.completed).map(p => p.week) : [];
      setEditProgressWeeks(completedWeeks);
    }
  }, [selectedRequest]);

  const handleSaveRequestEdits = async () => {
    if (!selectedRequest) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/mentorship/requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId: editCohortId || null,
          trackId: editTrackId || null,
          status: editStatus,
          mentorNotes: editNotes,
          feedbackContent: newFeedback,
          completedWeeks: editProgressWeeks
        })
      });

      if (!res.ok) throw new Error('Failed to update request');
      setMessage({ type: 'success', text: 'Mentee record updated successfully.' });
      setTimeout(() => setMessage(null), 3500);
      loadData();
      setSelectedRequest(null);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Permanently remove this mentorship request?')) return;
    try {
      await fetch(`/api/admin/mentorship/requests/${id}`, { method: 'DELETE' });
      loadData();
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (err) {}
  };

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortName) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/mentorship/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCohortName, status: newCohortStatus })
      });
      if (res.ok) {
        setNewCohortName('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCohort = async (id: string) => {
    if (!confirm('Delete this Cohort batch?')) return;
    try {
      await fetch(`/api/admin/mentorship/cohorts?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {}
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle || !newResourceUrl) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/mentorship/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResourceTitle,
          category: newResourceCategory,
          description: newResourceDescription,
          downloadUrl: newResourceUrl,
          featured: newResourceFeatured
        })
      });
      if (res.ok) {
        setNewResourceTitle('');
        setNewResourceDescription('');
        setNewResourceUrl('');
        setNewResourceFeatured(false);
        const resRes = await fetch('/api/admin/mentorship/resources');
        const resData = await resRes.json();
        setResources(resData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await fetch(`/api/admin/mentorship/resources?id=${id}`, { method: 'DELETE' });
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {}
  };

  const handleToggleWeekProgress = (week: number) => {
    if (editProgressWeeks.includes(week)) {
      setEditProgressWeeks(editProgressWeeks.filter(w => w !== week));
    } else {
      setEditProgressWeeks([...editProgressWeeks, week]);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohortFilter === 'ALL' || r.cohortId === selectedCohortFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    const matchesComeback = !comebackOnlyFilter || r.isComebackProgram;
    return matchesSearch && matchesCohort && matchesStatus && matchesComeback;
  });

  const totalLearnersCount = requests.length;
  const activeLearnersCount = requests.filter(r => ['Learning', 'Project Completed', 'Mock Interview'].includes(r.status)).length;
  const placedCount = requests.filter(r => r.status === 'Placed').length;
  const comebackCount = requests.filter(r => r.isComebackProgram).length;

  return (
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Academy & Mentorship Program
          </div>
          <h1 className={adminStyles.title}>
            Mentorship <span className={adminStyles.titleAccent}>Platform</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Cohort management, mentee progression, comeback initiatives, and downloadable resource library.
          </p>
        </div>
      </div>

      {message && (
        <div className={adminStyles.notice} style={{ borderColor: message.type === 'success' ? 'var(--accent)' : 'rgba(239,68,68,0.3)', borderLeftColor: message.type === 'success' ? 'var(--accent)' : '#ef4444', color: message.type === 'success' ? 'var(--accent)' : '#f87171' }}>
          {message.text}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Applicants</span>
            <Users size={16} />
          </div>
          <div className={adminStyles.metricValue}>{totalLearnersCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>All registered requests</span>
            <span>All time</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Active Learners</span>
            <Calendar size={16} />
          </div>
          <div className={adminStyles.metricValue}>{activeLearnersCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>In-progress modules</span>
            <span>Current cohorts</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Comeback Program</span>
            <Sparkles size={16} />
          </div>
          <div className={adminStyles.metricValue}>{comebackCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Career returnee initiatives</span>
            <span>Special track</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Placed Alumni</span>
            <CheckCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>{placedCount}</div>
          <div className={adminStyles.metricBottom}>
            <span>Successfully placed</span>
            <span>Verified outcomes</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className={adminStyles.tabs}>
        {[
          { id: 'requests', label: 'Mentorship Requests' },
          { id: 'cohorts', label: 'Cohort Batches' },
          { id: 'resources', label: 'Resource Library CMS' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveAdminTab(t.id as any)}
            className={`${adminStyles.tabButton} ${activeAdminTab === t.id ? adminStyles.tabButtonActive : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Requests Data Grid */}
      {activeAdminTab === 'requests' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRequest ? '1.7fr 1.3fr' : '1fr', gap: 20 }}>
          {/* List panel */}
          <div className={adminStyles.panel} style={{ marginBottom: 0 }}>
            <div className={adminStyles.panelHeading}>
              <h2>Mentee Pipeline ({filteredRequests.length})</h2>
            </div>
            
            {/* Filters bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className={adminStyles.searchBar} style={{ flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search by name, email, target role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={selectedCohortFilter}
                onChange={e => setSelectedCohortFilter(e.target.value)}
                className={adminStyles.select}
                style={{ width: 'auto', minHeight: 38 }}
              >
                <option value="ALL">All Cohorts</option>
                {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className={adminStyles.select}
                style={{ width: 'auto', minHeight: 38 }}
              >
                <option value="ALL">All Statuses</option>
                {['Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600, color: 'var(--muted)' }}>
                <input
                  type="checkbox"
                  checked={comebackOnlyFilter}
                  onChange={e => setComebackOnlyFilter(e.target.checked)}
                />
                <span>Comeback Only</span>
              </label>
            </div>

            {/* Grid Table */}
            <div className={adminStyles.tableWrapper} style={{ marginTop: 0 }}>
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>Student</th>
                    <th className={adminStyles.th}>Track / Cohort</th>
                    <th className={adminStyles.th}>Status</th>
                    <th className={adminStyles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={adminStyles.td} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                        No mentorship requests matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => {
                      const progressVal = req.progress && req.progress.length > 0
                        ? Math.round((req.progress.filter(p => p.completed).length / req.progress.length) * 100)
                        : 0;
                      const isSelected = selectedRequest?.id === req.id;
                      return (
                        <tr
                          key={req.id}
                          className={adminStyles.tr}
                          style={{
                            cursor: 'pointer',
                            background: isSelected ? 'color-mix(in srgb, var(--accent) 6%, var(--surface))' : undefined,
                          }}
                          onClick={() => setSelectedRequest(req)}
                        >
                          <td className={adminStyles.td}>
                            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{req.fullName}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 10 }}>{req.email}</div>
                            {req.isComebackProgram && (
                              <span style={{ fontSize: 9, padding: '1px 6px', background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderRadius: 4, fontWeight: 600, marginTop: 4, display: 'inline-block' }}>
                                COMEBACK PROGRAM
                              </span>
                            )}
                          </td>
                          <td className={adminStyles.td}>
                            <div style={{ fontWeight: 600 }}>{req.track?.name || 'Unassigned'}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 10 }}>{req.cohort?.name || 'Pending Batch'}</div>
                          </td>
                          <td className={adminStyles.td}>
                            {req.status === 'Placed' ? (
                              <span className={adminStyles.badge}>
                                <span className={adminStyles.badgeLiveDot} /> Placed
                              </span>
                            ) : (
                              <span className={adminStyles.badgeNeutral}>
                                {req.status}
                              </span>
                            )}
                            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{progressVal}% completed</div>
                          </td>
                          <td className={adminStyles.td} style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className={adminStyles.danger}
                              style={{ minHeight: 28, padding: '4px 8px' }}
                              title="Delete request"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit sidebar drawer */}
          {selectedRequest && (
            <div className={adminStyles.panel} style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={adminStyles.panelHeading}>
                <h2>Review: {selectedRequest.fullName}</h2>
                <button onClick={() => setSelectedRequest(null)} className={adminStyles.modalClose}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href={selectedRequest.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={adminStyles.secondary}
                  style={{ minHeight: 30, padding: '4px 10px', fontSize: 11 }}
                >
                  LinkedIn <ExternalLink size={10} />
                </a>
                {selectedRequest.resumeUrl && (
                  <a
                    href={selectedRequest.resumeUrl}
                    download
                    className={adminStyles.secondary}
                    style={{ minHeight: 30, padding: '4px 10px', fontSize: 11 }}
                  >
                    <FileText size={12} /> Resume PDF <Download size={10} />
                  </a>
                )}
              </div>

              {/* Assignment Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                  <label className={adminStyles.label}>Cohort Batch</label>
                  <select
                    value={editCohortId}
                    onChange={e => setEditCohortId(e.target.value)}
                    className={adminStyles.select}
                  >
                    <option value="">Pending Assignment</option>
                    {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                  <label className={adminStyles.label}>Career Track</label>
                  <select
                    value={editTrackId}
                    onChange={e => setEditTrackId(e.target.value)}
                    className={adminStyles.select}
                  >
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Pipeline Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className={adminStyles.select}
                >
                  {['Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Progress Milestones Checkboxes */}
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Learning Modules Checklist</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 140, overflowY: 'auto', background: 'var(--surface2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                  {selectedRequest.progress.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, cursor: 'pointer', color: 'var(--text)' }}>
                      <input
                        type="checkbox"
                        checked={editProgressWeeks.includes(p.week)}
                        onChange={() => handleToggleWeekProgress(p.week)}
                      />
                      <span>Week {p.week}: {p.moduleName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Mentor Private Notes</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes on communication, SQL strength, portfolio readiness..."
                  className={adminStyles.textarea}
                />
              </div>

              {/* Add Feedback Timeline event */}
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Append Feedback Timeline</label>
                <textarea
                  value={newFeedback}
                  onChange={e => setNewFeedback(e.target.value)}
                  rows={2}
                  placeholder="Completed PySpark assignment. Code is well documented."
                  className={adminStyles.textarea}
                />
              </div>

              <button
                onClick={handleSaveRequestEdits}
                disabled={loading}
                className={adminStyles.primary}
                style={{ width: '100%', minHeight: 40 }}
              >
                {loading ? 'Saving...' : 'Save Review Changes'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Cohorts Management */}
      {activeAdminTab === 'cohorts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 20 }}>
          {/* Create form */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <h2>Create Cohort Batch</h2>
            </div>
            <form onSubmit={handleCreateCohort} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Cohort Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batch 4 - Winter 2026"
                  value={newCohortName}
                  onChange={e => setNewCohortName(e.target.value)}
                  className={adminStyles.input}
                />
              </div>
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Status</label>
                <select
                  value={newCohortStatus}
                  onChange={e => setNewCohortStatus(e.target.value)}
                  className={adminStyles.select}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <button type="submit" className={adminStyles.primary}>
                Create Cohort Batch
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <h2>Active Batches ({cohorts.length})</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cohorts.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: 13, color: 'var(--text)' }}>{c.name}</strong>
                    <span style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--surface)', borderRadius: 4, marginLeft: 8, border: '1px solid var(--border)', color: 'var(--accent)', fontWeight: 600 }}>{c.status}</span>
                  </div>
                  <button onClick={() => handleDeleteCohort(c.id)} className={adminStyles.danger} style={{ minHeight: 28, padding: '4px 8px' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Resources Library CMS */}
      {activeAdminTab === 'resources' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 20 }}>
          {/* Create form */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <h2>Add Resource File</h2>
            </div>
            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Azure Data Engineer Roadmap"
                  value={newResourceTitle}
                  onChange={e => setNewResourceTitle(e.target.value)}
                  className={adminStyles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                  <label className={adminStyles.label}>Category</label>
                  <select
                    value={newResourceCategory}
                    onChange={e => setNewResourceCategory(e.target.value)}
                    className={adminStyles.select}
                  >
                    <option value="Roadmap">Roadmap</option>
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                    <option value="Checklist">Checklist</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 22 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600, color: 'var(--text)' }}>
                    <input
                      type="checkbox"
                      checked={newResourceFeatured}
                      onChange={e => setNewResourceFeatured(e.target.checked)}
                    />
                    <span>Featured Item</span>
                  </label>
                </div>
              </div>

              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Download URL / Path</label>
                <input
                  type="text"
                  required
                  placeholder="/uploads/resources/roadmap.pdf"
                  value={newResourceUrl}
                  onChange={e => setNewResourceUrl(e.target.value)}
                  className={adminStyles.input}
                />
              </div>

              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Description</label>
                <textarea
                  value={newResourceDescription}
                  onChange={e => setNewResourceDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of document takeaways..."
                  className={adminStyles.textarea}
                />
              </div>

              <button type="submit" className={adminStyles.primary}>
                Save Resource
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <h2>Active Library Files ({resources.length})</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resources.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, marginRight: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 13, color: 'var(--text)' }}>{r.title}</strong>
                      <span className={adminStyles.badgeNeutral}>{r.category}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', wordBreak: 'break-all' }}>{r.downloadUrl}</span>
                  </div>
                  <button onClick={() => handleDeleteResource(r.id)} className={adminStyles.danger} style={{ minHeight: 28, padding: '4px 8px' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
