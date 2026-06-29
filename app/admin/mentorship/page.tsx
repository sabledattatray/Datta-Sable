'use client';
import { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, CheckCircle, Search, 
  Trash2, ChevronRight, ExternalLink, X, Sparkles, Download
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: '#000000', surface: '#0d0d0d', border: '#1a1a1a', text: '#f8fafc', muted: '#64748b', accent: '#6366f1', inputBg: '#121212', cardHover: '#161616' }
    : { bg: '#f8fafc', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', muted: '#475569', accent: '#4f46e5', inputBg: '#f1f5f9', cardHover: '#f8fafc' };

  // Core Lists
  const [requests, setRequests] = useState<Request[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Selected states
  const [activeAdminTab, setActiveAdminTab] = useState<'requests' | 'cohorts' | 'resources'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [comebackOnlyFilter, setComebackOnlyFilter] = useState(false);

  // Edit Panel values
  const [editCohortId, setEditCohortId] = useState('');
  const [editTrackId, setEditTrackId] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [editProgressWeeks, setEditProgressWeeks] = useState<number[]>([]);

  // Add Cohort values
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortStatus, setNewCohortStatus] = useState('ACTIVE');

  // Add Resource values
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState('Roadmap');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceFeatured, setNewResourceFeatured] = useState(false);

  // Loading & Message
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Data
  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/mentorship');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setCohorts(data.cohorts || []);
        setTracks(data.tracks || []);
      }
      const resRes = await fetch('/api/admin/mentorship/resources');
      if (resRes.ok) {
        const resData = await resRes.json();
        setResources(resData || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Drawer Selection details
  useEffect(() => {
    if (selectedRequest) {
      setEditCohortId(selectedRequest.cohortId || '');
      setEditTrackId(selectedRequest.trackId || '');
      setEditStatus(selectedRequest.status);
      setEditNotes(selectedRequest.mentorNotes || '');
      setNewFeedback('');
      setEditProgressWeeks(
        selectedRequest.progress.filter(p => p.completed).map(p => p.week)
      );
    }
  }, [selectedRequest]);

  // Handle Save Request edits
  const handleSaveRequestEdits = async () => {
    if (!selectedRequest) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/mentorship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          cohortId: editCohortId || null,
          trackId: editTrackId || null,
          status: editStatus,
          mentorNotes: editNotes,
          feedbackContent: newFeedback,
          progressWeeks: editProgressWeeks
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Request updated successfully' });
        // Refresh local items
        setRequests(requests.map(r => r.id === data.request.id ? data.request : r));
        setSelectedRequest(data.request);
        setNewFeedback('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update request' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network connection failed' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Delete Mentorship request
  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentorship request?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/mentorship?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== id));
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create Cohort
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

  // Delete Cohort
  const handleDeleteCohort = async (id: string) => {
    if (!confirm('Delete this Cohort batch?')) return;
    try {
      await fetch(`/api/admin/mentorship/cohorts?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {}
  };

  // Create Resource
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

  // Delete Resource
  const handleDeleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await fetch(`/api/admin/mentorship/resources?id=${id}`, { method: 'DELETE' });
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {}
  };

  // Toggle checklist week value
  const handleToggleWeekProgress = (week: number) => {
    if (editProgressWeeks.includes(week)) {
      setEditProgressWeeks(editProgressWeeks.filter(w => w !== week));
    } else {
      setEditProgressWeeks([...editProgressWeeks, week]);
    }
  };

  // Filter Requests
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohortFilter === 'ALL' || r.cohortId === selectedCohortFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    const matchesComeback = !comebackOnlyFilter || r.isComebackProgram;
    return matchesSearch && matchesCohort && matchesStatus && matchesComeback;
  });

  // Calculate Metrics
  const totalLearnersCount = requests.length;
  const activeLearnersCount = requests.filter(r => ['Learning', 'Project Completed', 'Mock Interview'].includes(r.status)).length;
  const placedCount = requests.filter(r => r.status === 'Placed').length;
  const comebackCount = requests.filter(r => r.isComebackProgram).length;

  return (
    <div style={{ background: css.bg, minHeight: '100vh', color: css.text, fontFamily: "'Inter', sans-serif", padding: '24px 30px' }}>
      
      {/* Top Breadcrumb Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/admin" style={{ color: css.muted, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Admin</Link>
          <ChevronRight size={13} color={css.muted} />
          <span style={{ fontSize: 13, fontWeight: 700, color: css.text }}>Mentorship Platform</span>
        </div>
      </div>

      {message && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: 24,
          background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${message.type === 'success' ? '#10b98140' : '#ef444440'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444',
          fontSize: 13, fontWeight: 600
        }}>
          {message.text}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 30 }}>
        {[
          { label: 'Total Applicants', val: totalLearnersCount, icon: <Users size={20} color={css.accent} />, desc: 'All registered requests' },
          { label: 'Active Learners', val: activeLearnersCount, icon: <Calendar size={20} color="#3b82f6" />, desc: 'Currently in progress modules' },
          { label: 'Comeback Program', val: comebackCount, icon: <Sparkles size={20} color="#f59e0b" />, desc: 'Maternity/Career break returnees' },
          { label: 'Placed Alumni', val: placedCount, icon: <CheckCircle size={20} color="#10b981" />, desc: 'Placed engineers' }
        ].map((card, idx) => (
          <div key={idx} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 11, color: css.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</span>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: '4px 0 2px' }}>{card.val}</h2>
              <span style={{ fontSize: 11, color: css.muted }}>{card.desc}</span>
            </div>
            <div style={{ background: css.inputBg, padding: 12, borderRadius: 12 }}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${css.border}`, gap: 24, marginBottom: 24 }}>
        {[
          { id: 'requests', label: 'Mentorship Requests' },
          { id: 'cohorts', label: 'Cohort Batches' },
          { id: 'resources', label: 'Resource Library CMS' }
        ].map(t => {
          const active = activeAdminTab === t.id;
          return (
            <button
              key={t.id} onClick={() => setActiveAdminTab(t.id as any)}
              style={{
                padding: '12px 4px', background: 'none', border: 'none', borderBottom: active ? `2px solid ${css.accent}` : 'none',
                color: active ? css.accent : css.muted, fontWeight: active ? 700 : 500, fontSize: 14, cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Requests Data Grid */}
      {activeAdminTab === 'requests' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRequest ? '1.7fr 1.3fr' : '1fr', gap: 24 }}>
          {/* List panel */}
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
            
            {/* Filters bar */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} color={css.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text" placeholder="Search by name, email, role..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 12.5 }}
                />
              </div>

              <select
                value={selectedCohortFilter} onChange={e => setSelectedCohortFilter(e.target.value)}
                style={{ padding: '9px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 12, outline: 'none' }}
              >
                <option value="ALL">All Cohorts</option>
                {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select
                value={selectedStatusFilter} onChange={e => setSelectedStatusFilter(e.target.value)}
                style={{ padding: '9px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 12, outline: 'none' }}
              >
                <option value="ALL">All Statuses</option>
                {['Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={comebackOnlyFilter} onChange={e => setComebackOnlyFilter(e.target.checked)} />
                <span>Comeback Only</span>
              </label>
            </div>

            {/* Grid Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${css.border}`, textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: css.muted, fontWeight: 700 }}>STUDENT</th>
                    <th style={{ padding: '12px 8px', color: css.muted, fontWeight: 700 }}>TRACK / COHORT</th>
                    <th style={{ padding: '12px 8px', color: css.muted, fontWeight: 700 }}>STATUS</th>
                    <th style={{ padding: '12px 8px', color: css.muted, fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(req => {
                    const progressVal = req.progress ? Math.round((req.progress.filter(p => p.completed).length / req.progress.length) * 100) : 0;
                    return (
                      <tr key={req.id} style={{ borderBottom: `1px solid ${css.border}`, cursor: 'pointer' }} onClick={() => setSelectedRequest(req)}>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 700 }}>{req.fullName}</div>
                          <div style={{ color: css.muted, fontSize: 11 }}>{req.email}</div>
                          {req.isComebackProgram && (
                            <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 4, fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                              COMEBACK PROGRAM
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{req.track?.name || 'Unassigned'}</div>
                          <div style={{ color: css.muted, fontSize: 11 }}>{req.cohort?.name || 'Pending Batch'}</div>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: 10,
                            background: req.status === 'Placed' ? '#10b98120' : req.status === 'Mock Interview' ? '#f59e0b20' : css.inputBg,
                            color: req.status === 'Placed' ? '#10b981' : req.status === 'Mock Interview' ? '#f59e0b' : css.text
                          }}>
                            {req.status}
                          </span>
                          <div style={{ fontSize: 10, color: css.muted, marginTop: 4 }}>{progressVal}% completed</div>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit sidebar drawer */}
          {selectedRequest && (
            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${css.border}`, paddingBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Review: {selectedRequest.fullName}</h3>
                <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: css.muted }}><X size={16} /></button>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={selectedRequest.linkedin} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: css.inputBg, borderRadius: 8, color: css.text, textDecoration: 'none', fontSize: 11.5, fontWeight: 600 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#0077b5" style={{ marginRight: 2 }}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn <ExternalLink size={10} />
                </a>
                {selectedRequest.resumeUrl && (
                  <a
                    href={selectedRequest.resumeUrl} download
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: css.inputBg, borderRadius: 8, color: css.text, textDecoration: 'none', fontSize: 11.5, fontWeight: 600 }}
                  >
                    <FileText size={12} /> Resume PDF <Download size={10} />
                  </a>
                )}
              </div>

              {/* Assignment Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>ASSIGN BATCH COHORT</label>
                  <select
                    value={editCohortId} onChange={e => setEditCohortId(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 11.5, outline: 'none' }}
                  >
                    <option value="">Pending Assignment</option>
                    {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>CAREER TRACK</label>
                  <select
                    value={editTrackId} onChange={e => setEditTrackId(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 11.5, outline: 'none' }}
                  >
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>PIPELINE PIPELINE STATUS</label>
                <select
                  value={editStatus} onChange={e => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 11.5, outline: 'none', fontWeight: 700 }}
                >
                  {['Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Progress Milestones Checkboxes */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>LEARNING PROGRESS MODULES</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto', background: css.inputBg, padding: 10, borderRadius: 8 }}>
                  {selectedRequest.progress.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, cursor: 'pointer' }}>
                      <input
                        type="checkbox" checked={editProgressWeeks.includes(p.week)}
                        onChange={() => handleToggleWeekProgress(p.week)}
                      />
                      <span>Week {p.week}: {p.moduleName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>PRIVATE MENTOR NOTES</label>
                <textarea
                  value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3}
                  placeholder="Needs SQL joins review, good communication..."
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 11.5, outline: 'none', resize: 'none', lineHeight: 1.4 }}
                />
              </div>

              {/* Add Feedback Timeline event */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>APPEND FEEDBACK TIMELINE EVENT</label>
                <textarea
                  value={newFeedback} onChange={e => setNewFeedback(e.target.value)} rows={2}
                  placeholder="Completed PySpark assignment. Code is well documented."
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 11.5, outline: 'none', resize: 'none', lineHeight: 1.4 }}
                />
              </div>

              {/* Challenge Details summary */}
              <div style={{ background: css.inputBg, padding: 12, borderRadius: 8, fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>STUDENT CHALLENGE OVERVIEW:</span>
                <p style={{ margin: 0, color: css.muted, lineHeight: 1.4 }}>{selectedRequest.challenge}</p>
              </div>

              <button
                onClick={handleSaveRequestEdits} disabled={loading}
                style={{ padding: '10px', background: css.accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                {loading ? 'Saving...' : 'Save All Review Changes'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Cohorts Management */}
      {activeAdminTab === 'cohorts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 30 }}>
          {/* Create form */}
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Create Cohort Batch</h3>
            <form onSubmit={handleCreateCohort} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>COHORT NAME</label>
                <input
                  type="text" required placeholder="Batch 3 - September 2026" value={newCohortName} onChange={e => setNewCohortName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>STATUS</label>
                <select
                  value={newCohortStatus} onChange={e => setNewCohortStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '10px', background: css.accent, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Create Cohort
              </button>
            </form>
          </div>

          {/* List panel */}
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Active Cohort Batches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cohorts.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: css.inputBg, borderRadius: 10 }}>
                  <div>
                    <strong style={{ fontSize: 13 }}>{c.name}</strong>
                    <span style={{ fontSize: 10, padding: '2px 6px', background: css.border, borderRadius: 4, marginLeft: 8, fontWeight: 700 }}>{c.status}</span>
                  </div>
                  <button onClick={() => handleDeleteCohort(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Resources Library CMS */}
      {activeAdminTab === 'resources' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: 30 }}>
          {/* Create form */}
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Upload/Edit Resource File</h3>
            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>RESOURCE TITLE</label>
                <input
                  type="text" required placeholder="Azure Data Engineer Study Roadmap" value={newResourceTitle} onChange={e => setNewResourceTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>CATEGORY</label>
                  <select
                    value={newResourceCategory} onChange={e => setNewResourceCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none' }}
                  >
                    <option value="Roadmap">Roadmap</option>
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                    <option value="Checklist">Checklist</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    <input type="checkbox" checked={newResourceFeatured} onChange={e => setNewResourceFeatured(e.target.checked)} />
                    <span>Featured Item</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>DOWNLOAD FILE PATH / URL</label>
                <input
                  type="text" required placeholder="/uploads/resources/roadmap.pdf" value={newResourceUrl} onChange={e => setNewResourceUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea
                  value={newResourceDescription} onChange={e => setNewResourceDescription(e.target.value)} rows={3}
                  placeholder="Enter short resource summary..."
                  style={{ width: '100%', padding: '8px 10px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none', resize: 'none', lineHeight: 1.4 }}
                />
              </div>

              <button type="submit" style={{ padding: '10px', background: css.accent, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Save Resource
              </button>
            </form>
          </div>

          {/* List panel */}
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Active Library Files</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resources.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: css.inputBg, borderRadius: 10 }}>
                  <div style={{ flex: 1, marginRight: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 13 }}>{r.title}</strong>
                      <span style={{ fontSize: 9.5, padding: '2px 6px', background: css.border, borderRadius: 4, fontWeight: 700 }}>{r.category}</span>
                    </div>
                    <span style={{ fontSize: 11, color: css.muted, wordBreak: 'break-all' }}>{r.downloadUrl}</span>
                  </div>
                  <button onClick={() => handleDeleteResource(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
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
