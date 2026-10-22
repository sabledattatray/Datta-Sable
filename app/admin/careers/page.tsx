'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, Award, CheckCircle, AlertCircle, FileSpreadsheet, 
  Search, Eye, Edit, ChevronDown, Filter, FileText, ArrowUpRight, ShieldAlert, Sparkles, X, CheckCheck, TrendingUp
} from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

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
  whatsappNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  currentAddress?: string;
  is10thPass?: boolean;
  hasCollectionExperience?: boolean;
  hasTeamHandlingExperience?: boolean;
  areaFamiliarity?: string;
  hasTwoWheeler?: boolean;
  hasDrivingLicense?: boolean;
  aadhaarUrl?: string;
  photoUrl?: string;
  isImmediateJoiner?: boolean;
  recruitmentStatus?: string;
  interviewDate?: string;
  joiningDate?: string;
  remarks?: string;
  candidateSource?: string;
  applicationScore?: number;
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
      const jobsRes = await fetch('/api/jobs');
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

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

  // Update Applicant Recruitment Details
  const handleUpdateWorkflowField = async (id: string, fields: {
    recruitmentStatus?: string;
    interviewDate?: string;
    joiningDate?: string;
    remarks?: string;
    status?: string;
  }) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...fields })
      });

      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
        if (selectedApplicant && selectedApplicant.id === id) {
          setSelectedApplicant(prev => prev ? { ...prev, ...fields } : null);
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update recruitment details.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating recruitment details.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export to Excel (CSV)
  const handleExportExcel = () => {
    if (applicants.length === 0) return;

    const headers = [
      "Application ID", "Name", "Email", "Phone", "WhatsApp", "DOB", "Gender", "Address",
      "10th Pass", "Collection Exp", "Team Handling", "Area Familiarity", "Two Wheeler", "Driving License",
      "Source", "Immediate Joiner", "Recruitment Status", "Interview Date", "Joining Date", "Remarks",
      "Position", "Experience", "Skills", "Current Salary", "Expected Salary", "Notice Period", "Date Applied", "Match Score"
    ];

    const csvRows = [headers.join(",")];

    for (const app of applicants) {
      const row = [
        app.applicationId,
        `"${app.fullName.replace(/"/g, '""')}"`,
        app.email,
        app.mobile,
        app.whatsappNumber || "",
        app.dateOfBirth || "",
        app.gender || "",
        `"${(app.currentAddress || "").replace(/"/g, '""')}"`,
        app.is10thPass ? "Yes" : "No",
        app.hasCollectionExperience ? "Yes" : "No",
        app.hasTeamHandlingExperience ? "Yes" : "No",
        `"${(app.areaFamiliarity || "").replace(/"/g, '""')}"`,
        app.hasTwoWheeler ? "Yes" : "No",
        app.hasDrivingLicense ? "Yes" : "No",
        app.candidateSource || "",
        app.isImmediateJoiner ? "Yes" : "No",
        app.recruitmentStatus || "Application Received",
        app.interviewDate || "",
        app.joiningDate || "",
        `"${(app.remarks || "").replace(/"/g, '""')}"`,
        `"${(app.job?.title || 'Unknown').replace(/"/g, '""')}"`,
        app.totalExperience,
        `"${app.skills.replace(/"/g, '""')}"`,
        app.currentSalary || "",
        app.expectedSalary,
        app.noticePeriod,
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

  const positionDistribution = applicants.reduce((acc: Record<string, number>, curr) => {
    const title = curr.job?.title || 'Other';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const maxPositionCount = Math.max(...Object.values(positionDistribution), 1);

  if (sessionStatus === 'loading') {
    return (
      <div className={adminStyles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--muted)' }}>
        Loading session details...
      </div>
    );
  }

  const bypassBanner = sessionStatus === 'unauthenticated' && process.env.NODE_ENV === 'development';

  return (
    <div className={adminStyles.page}>
      {/* Dev Alert */}
      {bypassBanner && (
        <div className={adminStyles.notice}>
          <ShieldAlert size={16} />
          <span><strong>Development Access</strong>: Active bypass enabled for administrative career candidate tracking.</span>
        </div>
      )}

      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Talent & Recruitment Pipeline
          </div>
          <h1 className={adminStyles.title}>
            Careers <span className={adminStyles.titleAccent}>Management</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Applicant tracking system, candidate scoring, recruitment pipelines, and role distribution.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <button 
            onClick={handleExportExcel}
            disabled={applicants.length === 0}
            className={adminStyles.secondary}
          >
            <FileSpreadsheet size={15} /> Export Candidates to CSV
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Candidates</span>
            <Users size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics.total}</div>
          <div className={adminStyles.metricBottom}>
            <span>All active submissions</span>
            <span>All time</span>
          </div>
        </div>
        
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Received Today</span>
            <TrendingUp size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics.today}</div>
          <div className={adminStyles.metricBottom}>
            <span>New applications today</span>
            <span>24h activity</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Shortlisted</span>
            <CheckCheck size={16} />
          </div>
          <div className={adminStyles.metricValue}>{metrics.shortlisted}</div>
          <div className={adminStyles.metricBottom}>
            <span>Qualified candidates</span>
            <span>{metrics.rejected} rejected</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Avg Match Score</span>
            <Sparkles size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {metrics.avgScore}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>%</span>
          </div>
          <div className={adminStyles.metricBottom}>
            <span>Algorithmic fit score</span>
            <span>Benchmark: 70%+</span>
          </div>
        </div>
      </div>

      {/* Position Chart & Filters layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 16, marginBottom: 24, alignItems: 'stretch' }}>
        {/* Analytics Graph Card */}
        <div className={adminStyles.panel} style={{ marginBottom: 0 }}>
          <div className={adminStyles.panelHeading}>
            <h2>Applications by Position</h2>
          </div>
          {Object.keys(positionDistribution).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px 0', fontSize: 12 }}>No role data to visualize yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(positionDistribution).map(([position, count]) => {
                const percentage = Math.round((count / maxPositionCount) * 100);
                return (
                  <div key={position} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 140, fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={position}>{position}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
                    </div>
                    <span style={{ width: 28, fontSize: 11, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter controls */}
        <div className={adminStyles.panel} style={{ marginBottom: 0 }}>
          <div className={adminStyles.panelHeading}>
            <h2>Filter Candidates</h2>
          </div>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className={adminStyles.searchBar}>
              <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search candidate name, email, phone..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Position</label>
                <select 
                  value={filterJob} 
                  onChange={(e) => setFilterJob(e.target.value)} 
                  className={adminStyles.select}
                >
                  <option value="all">All Positions</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                <label className={adminStyles.label}>Experience</label>
                <select 
                  value={filterExperience} 
                  onChange={(e) => setFilterExperience(e.target.value)} 
                  className={adminStyles.select}
                >
                  <option value="all">All Experience</option>
                  <option value="0-2 Years">0-2 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>
            </div>

            <div className={adminStyles.field} style={{ marginBottom: 0 }}>
              <label className={adminStyles.label}>Hiring Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className={adminStyles.select}
              >
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
      <div className="desktop-only">
        {loading ? (
          <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
            Fetching candidate profiles...
          </div>
        ) : applicants.length === 0 ? (
          <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
            No candidate applications match the filter criteria.
          </div>
        ) : (
          <div className={adminStyles.tableWrapper} style={{ marginTop: 0 }}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th className={adminStyles.th}>Application ID</th>
                  <th className={adminStyles.th}>Candidate</th>
                  <th className={adminStyles.th}>Position</th>
                  <th className={adminStyles.th}>Experience</th>
                  <th className={adminStyles.th} style={{ textAlign: 'center' }}>Match Score</th>
                  <th className={adminStyles.th} style={{ textAlign: 'center' }}>Status</th>
                  <th className={adminStyles.th}>Date Applied</th>
                  <th className={adminStyles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} className={adminStyles.tr}>
                    <td className={adminStyles.td} style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {app.applicationId}
                    </td>
                    <td className={adminStyles.td}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.fullName}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 10 }}>{app.email}</div>
                    </td>
                    <td className={adminStyles.td} style={{ color: 'var(--muted)' }}>{app.job?.title || 'Unknown'}</td>
                    <td className={adminStyles.td} style={{ whiteSpace: 'nowrap' }}>{app.totalExperience}</td>
                    <td className={adminStyles.td} style={{ textAlign: 'center' }}>
                      <span 
                        style={{ 
                          padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                          background: app.matchScore >= 80 ? 'rgba(16,185,129,0.1)' : app.matchScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                          color: app.matchScore >= 80 ? '#34d399' : app.matchScore >= 50 ? '#fbbf24' : '#f87171',
                          border: `1px solid ${app.matchScore >= 80 ? 'rgba(16,185,129,0.25)' : app.matchScore >= 50 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`
                        }}
                      >
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className={adminStyles.td} style={{ textAlign: 'center' }}>
                      {app.status === 'Selected' || app.status === 'Shortlisted' ? (
                        <span className={adminStyles.badge}>
                          <span className={adminStyles.badgeLiveDot} /> {app.status}
                        </span>
                      ) : (
                        <span className={adminStyles.badgeNeutral}>
                          {app.status}
                        </span>
                      )}
                    </td>
                    <td className={adminStyles.td} style={{ whiteSpace: 'nowrap', color: 'var(--muted)', fontSize: 11 }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className={adminStyles.td} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button 
                        onClick={() => setSelectedApplicant(app)}
                        className={adminStyles.secondary}
                        style={{ minHeight: 30, padding: '4px 10px' }}
                        title="View Details"
                      >
                        <Eye size={13} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Applicants Mobile Cards */}
      <div className={adminStyles.mobileOnly} style={{ flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {loading ? (
          <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)' }}>Fetching candidate profiles...</div>
        ) : applicants.length === 0 ? (
          <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)' }}>No candidate applications match the filters.</div>
        ) : (
          applicants.map((app) => (
            <div key={app.id} className={adminStyles.panel} style={{ padding: 16, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>{app.applicationId}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{app.fullName}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{app.email}</div>
                </div>
                <span style={{ 
                  padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                  background: app.matchScore >= 80 ? 'rgba(16,185,129,0.1)' : app.matchScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: app.matchScore >= 80 ? '#34d399' : app.matchScore >= 50 ? '#fbbf24' : '#f87171',
                  flexShrink: 0
                }}>
                  {app.matchScore}% Match
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '8px 0', margin: '8px 0', fontSize: 11 }}>
                <div>
                  <span style={{ fontSize: 9, color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Position</span>
                  <strong>{app.job?.title || 'Unknown'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Experience</span>
                  <strong>{app.totalExperience}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={adminStyles.badgeNeutral}>{app.status}</span>
                <button 
                  onClick={() => setSelectedApplicant(app)}
                  className={adminStyles.secondary}
                  style={{ minHeight: 28, padding: '4px 8px' }}
                >
                  <Eye size={12} /> Review
                </button>
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
            className={adminStyles.modalOverlay}
            onClick={() => setSelectedApplicant(null)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }}
              className={adminStyles.modalContent}
              style={{ maxWidth: 640, height: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Sidebar Header */}
              <div className={adminStyles.modalHeader}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em' }}>{selectedApplicant.applicationId}</span>
                  <h3 style={{ marginTop: 2 }}>{selectedApplicant.fullName}</h3>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className={adminStyles.modalClose}>
                  <X size={18} />
                </button>
              </div>

              {/* Recruiter Workflow Status Card */}
              <div style={{ padding: 16, background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                  <label className={adminStyles.label}>Recruiter Workflow Status</label>
                  <select 
                    value={selectedApplicant.recruitmentStatus || "Application Received"} 
                    disabled={updatingStatus}
                    className={adminStyles.select}
                    onChange={(e) => {
                      const val = e.target.value;
                      let syncStatus = selectedApplicant.status;
                      if (val === 'Application Received') syncStatus = 'New';
                      else if (val === 'Screening Pending') syncStatus = 'Under Review';
                      else if (val === 'Interview Scheduled') syncStatus = 'Interview Scheduled';
                      else if (val === 'Selected') syncStatus = 'Shortlisted';
                      else if (val === 'Document Verification') syncStatus = 'Under Review';
                      else if (val === 'Joined') syncStatus = 'Selected';
                      else if (val === 'Rejected') syncStatus = 'Rejected';
                      
                      handleUpdateWorkflowField(selectedApplicant.id, { 
                        recruitmentStatus: val, 
                        status: syncStatus 
                      });
                    }}
                  >
                    <option value="Application Received">Application Received</option>
                    <option value="Screening Pending">Screening Pending</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Document Verification">Document Verification</option>
                    <option value="Joined">Joined</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className={adminStyles.modalGrid2}>
                  <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                    <label className={adminStyles.label}>Interview Date</label>
                    <input 
                      type="date"
                      value={selectedApplicant.interviewDate || ""}
                      onChange={(e) => handleUpdateWorkflowField(selectedApplicant.id, { interviewDate: e.target.value })}
                      className={adminStyles.input}
                    />
                  </div>
                  <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                    <label className={adminStyles.label}>Joining Date</label>
                    <input 
                      type="date"
                      value={selectedApplicant.joiningDate || ""}
                      onChange={(e) => handleUpdateWorkflowField(selectedApplicant.id, { joiningDate: e.target.value })}
                      className={adminStyles.input}
                    />
                  </div>
                </div>

                <div className={adminStyles.field} style={{ marginBottom: 0 }}>
                  <label className={adminStyles.label}>Recruiter Remarks</label>
                  <textarea 
                    value={selectedApplicant.remarks || ""}
                    placeholder="Enter internal candidate notes here..."
                    onBlur={(e) => handleUpdateWorkflowField(selectedApplicant.id, { remarks: e.target.value })}
                    onChange={(e) => setApplicants(prev => prev.map(a => a.id === selectedApplicant.id ? { ...a, remarks: e.target.value } : a))}
                    className={adminStyles.textarea}
                    rows={2}
                  />
                  <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'right', marginTop: 3 }}>Autosaves on blur</div>
                </div>
              </div>

              {/* Technical Profile Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 12, lineHeight: 1.6 }}>
                
                {/* Score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'color-mix(in srgb, var(--accent) 5%, var(--surface2))', border: '1px solid color-mix(in srgb, var(--accent) 25%, var(--border))', borderRadius: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>Candidate Match Rating Score</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{selectedApplicant.matchScore}%</span>
                </div>

                {/* Personal Section */}
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10 }}>Contact Info</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 8 }}>
                    <div><span style={{ color: 'var(--muted)' }}>Email:</span> {selectedApplicant.email}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Phone:</span> {selectedApplicant.mobile}</div>
                    <div><span style={{ color: 'var(--muted)' }}>WhatsApp:</span> {selectedApplicant.whatsappNumber || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>DOB:</span> {selectedApplicant.dateOfBirth || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Gender:</span> {selectedApplicant.gender || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Location:</span> {selectedApplicant.currentLocation}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Address:</span> {selectedApplicant.currentAddress || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Pref Location:</span> {selectedApplicant.preferredLocation || 'None Specified'}</div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10 }}>Professional Experience</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 8 }}>
                    <div><span style={{ color: 'var(--muted)' }}>Employer:</span> {selectedApplicant.currentCompany || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Designation:</span> {selectedApplicant.currentDesignation || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Total Exp:</span> {selectedApplicant.totalExperience}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Rel Exp:</span> {selectedApplicant.relevantExperience}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Current Comp:</span> {selectedApplicant.currentSalary || 'N/A'}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Expected:</span> {selectedApplicant.expectedSalary}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Notice:</span> {selectedApplicant.noticePeriod}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Available:</span> {selectedApplicant.availableFrom || 'Immediate'}</div>
                  </div>
                </div>

                {/* Secure Documents Links */}
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10 }}>Candidate Documents</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <a 
                      href={`/api/admin/documents?file=${encodeURIComponent(selectedApplicant.resumeUrl)}`} target="_blank" rel="noopener noreferrer"
                      className={adminStyles.secondary} style={{ justifyContent: 'flex-start', minHeight: 34, fontSize: 11 }}
                    >
                      <FileText size={13} style={{ color: 'var(--accent)' }} /> Open Candidate Resume <ArrowUpRight size={11} style={{ marginLeft: 'auto' }} />
                    </a>
                    {selectedApplicant.aadhaarUrl && (
                      <a 
                        href={`/api/admin/documents?file=${encodeURIComponent(selectedApplicant.aadhaarUrl)}`} target="_blank" rel="noopener noreferrer"
                        className={adminStyles.secondary} style={{ justifyContent: 'flex-start', minHeight: 34, fontSize: 11 }}
                      >
                        <FileText size={13} style={{ color: 'var(--accent)' }} /> Open Aadhaar Card <ArrowUpRight size={11} style={{ marginLeft: 'auto' }} />
                      </a>
                    )}
                    {selectedApplicant.photoUrl && (
                      <a 
                        href={`/api/admin/documents?file=${encodeURIComponent(selectedApplicant.photoUrl)}`} target="_blank" rel="noopener noreferrer"
                        className={adminStyles.secondary} style={{ justifyContent: 'flex-start', minHeight: 34, fontSize: 11 }}
                      >
                        <FileText size={13} style={{ color: 'var(--accent)' }} /> Open Candidate Photo <ArrowUpRight size={11} style={{ marginLeft: 'auto' }} />
                      </a>
                    )}
                    {selectedApplicant.portfolioFileUrl && (
                      <a 
                        href={`/api/admin/documents?file=${encodeURIComponent(selectedApplicant.portfolioFileUrl)}`} target="_blank" rel="noopener noreferrer"
                        className={adminStyles.secondary} style={{ justifyContent: 'flex-start', minHeight: 34, fontSize: 11 }}
                      >
                        <FileSpreadsheet size={13} style={{ color: 'var(--accent)' }} /> Open Portfolio Archive <ArrowUpRight size={11} style={{ marginLeft: 'auto' }} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10 }}>Expertise Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedApplicant.skills.split(',').map(s => (
                      <span key={s} className={adminStyles.badgeNeutral}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10 }}>Education</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 8 }}>
                    <div><span style={{ color: 'var(--muted)' }}>Highest Degree:</span> {selectedApplicant.highestQualification}</div>
                    <div><span style={{ color: 'var(--muted)' }}>University:</span> {selectedApplicant.university}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Graduation:</span> {selectedApplicant.passingYear}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Grade/CGPA:</span> {selectedApplicant.cgpa}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
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
