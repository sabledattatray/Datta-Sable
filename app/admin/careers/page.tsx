'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, Award, CheckCircle, AlertCircle, FileSpreadsheet, 
  Search, Eye, Edit, ChevronDown, Filter, FileText, ArrowUpRight, ShieldAlert, Sparkles, X
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
}

interface Applicant {
  id: string;
  applicationId: string;
  jobId: string;
  fullName: string;
  email: string;
  mobile: string;
  currentLocation: string;
  preferredLocation?: string;
  currentCompany?: string;
  currentDesignation?: string;
  totalExperience: string;
  relevantExperience: string;
  currentSalary?: string;
  expectedSalary: string;
  noticePeriod: string;
  availableFrom?: string;
  skills: string;
  highestQualification: string;
  university: string;
  passingYear: string;
  cgpa: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  kaggle?: string;
  whyJoin: string;
  achievement: string;
  resumeUrl: string;
  portfolioFileUrl?: string;
  status: string;
  matchScore: number;
  createdAt: string;
  job: {
    title: string;
    department: string;
  };
}

export default function AdminCareersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/Search states
  const [search, setSearch] = useState('');
  const [filterJob, setFilterJob] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Selected applicant for detail modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch open jobs
      const jobsRes = await fetch('/api/jobs');
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // Fetch applicants
      const url = `/api/admin/careers?jobId=${filterJob}&experience=${filterExperience}&status=${filterStatus}&search=${encodeURIComponent(search)}`;
      const appRes = await fetch(url);
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplicants(appData);
      }
    } catch (err) {
      console.error("Failed to load admin careers data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If not logged in and not loading, we can check node environment to allow dev bypass
    if (sessionStatus === 'unauthenticated' && process.env.NODE_ENV !== 'development') {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [sessionStatus, filterJob, filterExperience, filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  // Update Applicant Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        // Refresh local lists
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedApplicant && selectedApplicant.id === id) {
          setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export to Excel (CSV)
  const handleExportExcel = () => {
    if (applicants.length === 0) return;

    const headers = [
      "Application ID", "Name", "Email", "Phone", "Position", "Experience", 
      "Skills", "Current Salary", "Expected Salary", "Notice Period", "Status", "Date Applied", "Match Score"
    ];

    const csvRows = [headers.join(",")];

    for (const app of applicants) {
      const row = [
        app.applicationId,
        `"${app.fullName.replace(/"/g, '""')}"`,
        app.email,
        app.mobile,
        `"${(app.job?.title || 'Unknown').replace(/"/g, '""')}"`,
        app.totalExperience,
        `"${app.skills.replace(/"/g, '""')}"`,
        app.currentSalary || "",
        app.expectedSalary,
        app.noticePeriod,
        app.status,
        new Date(app.createdAt).toLocaleDateString(),
        app.matchScore
      ];
      csvRows.push(row.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Applicants_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics Calculations
  const metrics = {
    total: applicants.length,
    today: applicants.filter(a => {
      const date = new Date(a.createdAt);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length,
    shortlisted: applicants.filter(a => a.status === 'Shortlisted').length,
    rejected: applicants.filter(a => a.status === 'Rejected').length,
    avgScore: applicants.length > 0 
      ? Math.round(applicants.reduce((acc, curr) => acc + curr.matchScore, 0) / applicants.length) 
      : 0
  };

  // Position chart calculations (Custom CSS Bar chart)
  const positionDistribution = applicants.reduce((acc: Record<string, number>, curr) => {
    const title = curr.job?.title || 'Other';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const maxPositionCount = Math.max(...Object.values(positionDistribution), 1);

  if (sessionStatus === 'loading') {
    return <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading session details...</div>;
  }

  // Developer Bypass Check
  const bypassBanner = sessionStatus === 'unauthenticated' && process.env.NODE_ENV === 'development';

  return (
    <div style={{ width: '100%' }}>
      {/* Bypass Dev Alert */}
      {bypassBanner && (
        <div className="flex items-center justify-between gap-3 mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(201, 243, 29, 0.05)', border: '1px solid rgba(201, 243, 29, 0.3)', color: 'var(--accent)' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span style={{ fontSize: '0.85rem' }}><strong>Development Bypass</strong>: Access granted to admin portal without active authentication session.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>ATS-ADMIN-PANEL</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em' }}>Careers Management</h1>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            disabled={applicants.length === 0}
            className="mono flex items-center gap-2" 
            style={{ padding: '0.65rem 1.25rem', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer', opacity: applicants.length === 0 ? 0.5 : 1 }}
          >
            <FileSpreadsheet size={14} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Metrics cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex justify-between items-start mb-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Applicants</span>
            <Users size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{metrics.total}</div>
        </div>
        
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex justify-between items-start mb-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applications Today</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent3)', boxShadow: '0 0 6px var(--accent3)', marginTop: '4px' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{metrics.today}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex justify-between items-start mb-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortlisted</span>
            <CheckCircle size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{metrics.shortlisted}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex justify-between items-start mb-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Match Score</span>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{metrics.avgScore} <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>/ 100</span></div>
        </div>
      </div>

      {/* Position chart & Filters layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem', alignItems: 'start' }}>
        {/* Analytics Graph Card */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '260px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text)' }}>Applications by Position</h3>
          {Object.keys(positionDistribution).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No data to visualize yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(positionDistribution).map(([position, count]) => {
                const percentage = Math.round((count / maxPositionCount) * 100);
                return (
                  <div key={position} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '130px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={position}>{position}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--tag-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--accent)' }} />
                    </div>
                    <span style={{ width: '25px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter controls */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '260px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text)' }}>Filter Candidates</h3>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input 
                type="text" value={search} onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search name, email, mobile..."
                style={{ flex: 1, padding: '0.65rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ padding: '0.65rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Search size={16} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</label>
                <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}>
                  <option value="all">All Positions</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</label>
                <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}>
                  <option value="all">All Experience</option>
                  <option value="0-2 Years">0-2 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hiring Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}>
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Applicants Grid Table */}
      <div className="card desktop-only" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Fetching candidate profiles...</div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No applicant applications match the filters.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Application ID</th>
                <th style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Candidate</th>
                <th style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Position</th>
                <th style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Experience</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Match Score</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Date Applied</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-[var(--surface2)]">
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{app.applicationId}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.fullName}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{app.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>{app.job?.title || 'Unknown'}</td>
                  <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>{app.totalExperience}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 600,
                      background: app.matchScore >= 80 ? 'rgba(16,185,129,0.1)' : app.matchScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: app.matchScore >= 80 ? '#10b981' : app.matchScore >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {app.matchScore}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: app.status === 'Selected' ? '#10b98122' : app.status === 'Rejected' ? '#ef444422' : 'var(--tag-bg)',
                      color: app.status === 'Selected' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : 'var(--accent)',
                      border: '1px solid var(--border)'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button 
                      onClick={() => setSelectedApplicant(app)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'inline-flex', padding: '0.25rem' }}
                      title="View Details"
                    >
                      <Eye size={16} className="hover:text-[var(--accent)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Applicants Mobile Cards */}
      <div className="mobile-only" style={{ flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Fetching candidate profiles...</div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No applicant applications match the filters.</div>
        ) : (
          applicants.map((app) => (
            <div key={app.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em' }}>{app.applicationId}</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.2rem' }}>{app.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{app.email}</div>
                </div>
                <span style={{ 
                  padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                  background: app.matchScore >= 80 ? 'rgba(16,185,129,0.1)' : app.matchScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: app.matchScore >= 80 ? '#10b981' : app.matchScore >= 50 ? '#f59e0b' : '#ef4444',
                  flexShrink: 0
                }}>
                  {app.matchScore}% Match
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '0.5rem 0' }} className="grid grid-cols-2 gap-2">
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Position</span>
                  <strong style={{ fontSize: '0.8rem' }}>{app.job?.title || 'Unknown'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Experience</span>
                  <strong style={{ fontSize: '0.8rem' }}>{app.totalExperience}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ 
                  padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                  background: app.status === 'Selected' ? '#10b98122' : app.status === 'Rejected' ? '#ef444422' : 'var(--tag-bg)',
                  color: app.status === 'Selected' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : 'var(--accent)',
                  border: '1px solid var(--border)'
                }}>
                  {app.status}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <button 
                    onClick={() => setSelectedApplicant(app)}
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', padding: '0.4rem' }}
                    title="View Details"
                  >
                    <Eye size={14} className="hover:text-[var(--accent)]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Applicant Details Sidebar/Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="modal-overlay" 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }}
              className="card p-4 sm:p-8"
              style={{ width: '100%', maxWidth: '580px', height: '100vh', overflowY: 'auto', borderRadius: 0, borderLeft: '1px solid var(--border)' }}
            >
              {/* Sidebar Header */}
              <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.05em' }}>{selectedApplicant.applicationId}</span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '0.25rem' }}>{selectedApplicant.fullName}</h2>
                </div>
                <button onClick={() => setSelectedApplicant(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Status Update Dropdown */}
              <div style={{ padding: '1rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Applicant Application Status</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedApplicant.status} 
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdateStatus(selectedApplicant.id, e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Technical Profile Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                
                {/* Score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(201,243,29,0.03)', border: '1px solid rgba(201,243,29,0.15)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>AI Match Rating Score</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>{selectedApplicant.matchScore}%</span>
                </div>

                {/* Personal Section */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Contact Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><strong>Email:</strong> {selectedApplicant.email}</div>
                    <div><strong>Phone:</strong> {selectedApplicant.mobile}</div>
                    <div><strong>Location:</strong> {selectedApplicant.currentLocation}</div>
                    <div><strong>Pref Location:</strong> {selectedApplicant.preferredLocation || 'None Specified'}</div>
                  </div>
                </div>

                {/* Resume preview links */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Candidate Uploads</h3>
                  <div className="flex flex-col gap-2">
                    <a 
                      href={selectedApplicant.resumeUrl} target="_blank" rel="noopener noreferrer"
                      className="mono" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', padding: '0.5rem 1rem', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--accent)' }}
                    >
                      <FileText size={14} /> Open Resume PDF/Doc <ArrowUpRight size={12} />
                    </a>
                    {selectedApplicant.portfolioFileUrl && (
                      <a 
                        href={selectedApplicant.portfolioFileUrl} target="_blank" rel="noopener noreferrer"
                        className="mono" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', padding: '0.5rem 1rem', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--accent)' }}
                      >
                        <FileSpreadsheet size={14} /> Open Portfolio ZIP <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Professional Experience</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><strong>Current Employer:</strong> {selectedApplicant.currentCompany || 'N/A'}</div>
                    <div><strong>Designation:</strong> {selectedApplicant.currentDesignation || 'N/A'}</div>
                    <div><strong>Total Exp:</strong> {selectedApplicant.totalExperience}</div>
                    <div><strong>Rel Exp:</strong> {selectedApplicant.relevantExperience}</div>
                    <div><strong>Current Salary:</strong> {selectedApplicant.currentSalary || 'N/A'}</div>
                    <div><strong>Expected Salary:</strong> {selectedApplicant.expectedSalary}</div>
                    <div><strong>Notice Period:</strong> {selectedApplicant.noticePeriod}</div>
                    <div><strong>Available From:</strong> {selectedApplicant.availableFrom || 'Immediate'}</div>
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Expertise Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedApplicant.skills.split(',').map(s => (
                      <span key={s} style={{ padding: '0.2rem 0.5rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Education Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><strong>Highest Degree:</strong> {selectedApplicant.highestQualification}</div>
                    <div><strong>University:</strong> {selectedApplicant.university}</div>
                    <div><strong>Passing Year:</strong> {selectedApplicant.passingYear}</div>
                    <div><strong>CGPA/Grade:</strong> {selectedApplicant.cgpa}</div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Social Networks</h3>
                  <div className="flex flex-wrap gap-4 text-xs">
                    {selectedApplicant.linkedin && <a href={selectedApplicant.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>LinkedIn</a>}
                    {selectedApplicant.github && <a href={selectedApplicant.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>GitHub</a>}
                    {selectedApplicant.portfolio && <a href={selectedApplicant.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Portfolio</a>}
                    {selectedApplicant.kaggle && <a href={selectedApplicant.kaggle} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Kaggle</a>}
                  </div>
                </div>

                {/* Short answers */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>Q: Why join us?</h3>
                  <p style={{ color: 'var(--muted)', background: 'var(--surface2)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>{selectedApplicant.whyJoin}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>Q: Strongest Achievement</h3>
                  <p style={{ color: 'var(--muted)', background: 'var(--surface2)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>{selectedApplicant.achievement}</p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
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
      `}</style>
    </div>
  );
}
