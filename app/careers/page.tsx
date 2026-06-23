'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { 
  Send, CheckCircle, AlertCircle, FileText, Briefcase, Award, 
  ShieldCheck, HelpCircle, MapPin, DollarSign, Calendar, 
  Layers, Search, ArrowLeft, ArrowRight, X, ChevronRight, Info
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string;
  responsibilities: string;
  skillsRequired: string;
  benefits: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    alternateMobile: '',
    currentLocation: '',
    preferredLocation: '',
    currentCompany: '',
    currentDesignation: '',
    totalExperience: '',
    relevantExperience: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    availableFrom: '',
    highestQualification: '',
    university: '',
    passingYear: '',
    cgpa: '',
    linkedin: '',
    github: '',
    portfolio: '',
    kaggle: '',
    whyJoin: '',
    achievement: '',
    declarationChecked: false,
    honeypot: '',
  });

  // Skills tag selector
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const availableSkillsList = [
    "Power BI", "SQL", "Python", "Excel", "React", "Next.js", 
    "Node.js", "Azure", "AWS", "AI", "Machine Learning", "Tableau", 
    "Pandas", "PySpark", "Git", "dbt", "Data Modeling", "ETL"
  ];

  // Files state
  const [resumeFile, setResumeFile] = useState<{ base64: string; name: string } | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<{ base64: string; name: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Status tracking state
  const [trackId, setTrackId] = useState('');
  const [trackEmail, setTrackEmail] = useState('');
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // Submit status
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [generatedAppId, setGeneratedAppId] = useState('');

  // Fetch Jobs on Mount
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Skill tags logic
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Handle file uploads and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isResume: boolean) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(`File "${file.name}" exceeds the 10MB size limit.`);
      return;
    }

    // Validate types
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.pdf')) {
      setFileError('Invalid file format. Please upload PDF, DOC, DOCX or ZIP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (isResume) {
        setResumeFile({ base64: base64String, name: file.name });
      } else {
        setPortfolioFile({ base64: base64String, name: file.name });
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  // Next Step validation
  const validateStep = (step: number) => {
    if (step === 1) {
      return form.fullName.trim() && form.email.trim() && form.mobile.trim() && form.currentLocation.trim();
    }
    if (step === 2) {
      return form.totalExperience.trim() && form.relevantExperience.trim() && form.expectedSalary.trim() && form.noticePeriod.trim() && selectedSkills.length > 0;
    }
    if (step === 3) {
      return form.highestQualification.trim() && form.university.trim() && form.passingYear.trim() && form.cgpa.trim();
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
    } else {
      setSubmitMessage("Please fill in all required fields marked with * before moving forward.");
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage(null);
      }, 4000);
    }
  };

  // Submit Application Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;

    if (!resumeFile) {
      setSubmitMessage("Please upload your resume (PDF/DOC/DOCX).");
      setSubmitStatus('error');
      return;
    }

    if (!form.declarationChecked) {
      setSubmitMessage("You must certify that the provided details are accurate.");
      setSubmitStatus('error');
      return;
    }

    if (!form.whyJoin.trim() || !form.achievement.trim()) {
      setSubmitMessage("Please complete the essay questions in Step 4.");
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');
    setSubmitMessage(null);

    try {
      const payload = {
        jobId: selectedJob?.id,
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        alternateMobile: form.alternateMobile || null,
        currentLocation: form.currentLocation,
        preferredLocation: form.preferredLocation || null,
        currentCompany: form.currentCompany || null,
        currentDesignation: form.currentDesignation || null,
        totalExperience: form.totalExperience,
        relevantExperience: form.relevantExperience,
        currentSalary: form.currentSalary || null,
        expectedSalary: form.expectedSalary,
        noticePeriod: form.noticePeriod,
        availableFrom: form.availableFrom || null,
        skills: selectedSkills,
        highestQualification: form.highestQualification,
        university: form.university,
        passingYear: form.passingYear,
        cgpa: form.cgpa,
        linkedin: form.linkedin || null,
        github: form.github || null,
        portfolio: form.portfolio || null,
        kaggle: form.kaggle || null,
        whyJoin: form.whyJoin,
        achievement: form.achievement,
        resumeBase64: resumeFile.base64,
        resumeName: resumeFile.name,
        portfolioBase64: portfolioFile?.base64 || null,
        portfolioFileName: portfolioFile?.name || null,
        declarationChecked: form.declarationChecked,
      };

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setGeneratedAppId(data.applicationId);
      setSubmitStatus('success');
      
      // Clear form
      setForm({
        fullName: '', email: '', mobile: '', alternateMobile: '',
        currentLocation: '', preferredLocation: '', currentCompany: '', currentDesignation: '',
        totalExperience: '', relevantExperience: '', currentSalary: '', expectedSalary: '',
        noticePeriod: '', availableFrom: '', highestQualification: '', university: '',
        passingYear: '', cgpa: '', linkedin: '', github: '', portfolio: '', kaggle: '',
        whyJoin: '', achievement: '', declarationChecked: false, honeypot: '',
      });
      setSelectedSkills([]);
      setResumeFile(null);
      setPortfolioFile(null);
      setFormStep(1);

    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitStatus('error');
      setSubmitMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // Track Application status
  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim() || !trackEmail.trim()) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const res = await fetch(`/api/apply/track?applicationId=${encodeURIComponent(trackId.trim())}&email=${encodeURIComponent(trackEmail.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to retrieve status");
      }

      setTrackResult(data);
    } catch (err: any) {
      setTrackError(err.message || "No application found matching details.");
    } finally {
      setTrackLoading(false);
    }
  };

  // Stats Card data
  const companyStats = [
    { value: '10+ Years', label: 'MIS & BI Experience' },
    { value: '100+', label: 'Dashboard Assets Created' },
    { value: 'Remote-First', label: 'Global Work Culture' },
    { value: 'Fast-Track', label: 'Career Growth Potential' }
  ];

  const benefitsList = [
    { icon: <Briefcase size={18} />, title: "Remote Work Setup", desc: "Work from the comfort of your home with hybrid flexibility and home office stipends." },
    { icon: <Award size={18} />, title: "Skill Mentorship", desc: "Direct training in advanced data solutions, V-Order optimization, and LLM queries." },
    { icon: <ShieldCheck size={18} />, title: "High Autonomy", desc: "We rely on clean code and product ownership. No unnecessary daily standups." },
    { icon: <Layers size={18} />, title: "Real Business Impact", desc: "Build dashboard assets and data architectures queried directly by enterprise leadership." }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        <Crosshair position="tl" />

        {/* Hero Section */}
        <section className="section" style={{ paddingTop: 'clamp(7rem, 10vw, 9rem)', paddingBottom: '3rem' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', justifyContent: 'center' }}>CAREER-PORTAL</div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 54px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                Join Our Team & <span className="hero-title">Build the Future</span>
              </h1>
              <p style={{ color: 'var(--muted)', maxWidth: 640, margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '1.1rem' }}>
                We are building production-ready databases, complex BI models, and AI analytics systems. Explore our openings and apply for a position.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#openings" className="btn-primary" style={{ textDecoration: 'none' }}>View Open Positions</a>
                <a href="#tracking" className="mono" style={{ textDecoration: 'none', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--surface2)' }}>
                  <Search size={14} /> Track Application
                </a>
              </div>
            </div>

            {/* Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              {companyStats.map((stat, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>{stat.value}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="section" style={{ padding: '3rem 0', background: 'var(--surface2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center', marginBottom: '3rem' }}>Why You Should Grow With Us</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {benefitsList.map((benefit, idx) => (
                <div key={idx} className="card" style={{ padding: '2rem', background: 'var(--bg)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(201, 243, 29, 0.05)', color: 'var(--accent)', border: '1px solid rgba(201, 243, 29, 0.2)' }}>
                    {benefit.icon}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{benefit.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Job Openings Grid */}
        <section id="openings" className="section" style={{ padding: '5rem 0 3rem' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="label-tech mb-3" style={{ letterSpacing: '0.2em', justifyContent: 'center' }}>AVAILABLE-ROLES</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Explore Open Positions</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Find your next challenge in data architecture, coding, and analytics.</p>
            </div>

            {loadingJobs ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading live opportunities...</div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No open positions at this moment. Check back soon!</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {jobs.map((job) => (
                  <div key={job.id} className="card flex flex-col justify-between" style={{ padding: '2rem', minHeight: '260px' }}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="tag" style={{ fontSize: '10px', color: 'var(--accent)', borderColor: 'rgba(201, 243, 29, 0.2)' }}>{job.department}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> {job.location}
                        </span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text)' }}>{job.title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                      <div className="flex justify-between items-center mb-4">
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <DollarSign size={12} /> {job.salary}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                          Exp: {job.experience}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="mono" 
                          style={{ flex: 1, padding: '0.6rem 0', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedJob(job);
                            setShowApplyForm(true);
                          }}
                          className="btn-primary" 
                          style={{ flex: 1, padding: '0.6rem 0', fontSize: '10px', letterSpacing: '0.1em' }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Job Details Modal & ATS Form Wizard */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="modal-overlay" 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 15 }}
                className="card"
                style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: 'clamp(1.5rem, 4vw, 2.5rem)', position: 'relative' }}
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    setSelectedJob(null);
                    setShowApplyForm(false);
                    setFormStep(1);
                  }}
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>

                {!showApplyForm ? (
                  /* Mode 1: Job Details Display */
                  <div>
                    <span className="tag mb-2" style={{ color: 'var(--accent)', borderColor: 'rgba(201, 243, 29, 0.2)' }}>{selectedJob.department}</span>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem' }}>{selectedJob.title}</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', background: 'var(--surface2)', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <MapPin size={16} /> <strong>Location:</strong> {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <DollarSign size={16} /> <strong>Salary:</strong> {selectedJob.salary}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Award size={16} /> <strong>Exp Required:</strong> {selectedJob.experience}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                      <div>
                        <h3 style={{ color: 'var(--text)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Description</h3>
                        <p>{selectedJob.description}</p>
                      </div>

                      <div>
                        <h3 style={{ color: 'var(--text)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Key Responsibilities</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
                          {selectedJob.responsibilities.split('\n').map((line, idx) => (
                            <li key={idx}>{line.replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 style={{ color: 'var(--text)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Requirements & Qualifications</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
                          {selectedJob.requirements.split('\n').map((line, idx) => (
                            <li key={idx}>{line.replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 style={{ color: 'var(--text)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Required Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {selectedJob.skillsRequired.split(',').map((skill, idx) => (
                            <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text)' }}>
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 style={{ color: 'var(--text)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Benefits & Compensation</h3>
                        <p>{selectedJob.benefits}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowApplyForm(true)}
                      className="btn-primary" 
                      style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
                    >
                      Apply For This Position
                    </button>
                  </div>
                ) : (
                  /* Mode 2: Multi-step ATS Application Form */
                  <div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--accent)' }}>
                      <Briefcase size={16} />
                      <span className="mono" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>APPLYING FOR: {selectedJob.title}</span>
                    </div>

                    {/* Submit Result Message */}
                    {submitStatus === 'success' ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <CheckCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Application Submitted Successfully</h3>
                        <p style={{ color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                          Thank you for applying. Our recruitment team will review your profile and contact you if shortlisted.
                        </p>
                        
                        <div style={{ padding: '1rem 2rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', display: 'inline-block' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application ID</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.25rem' }}>{generatedAppId}</div>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedJob(null);
                            setShowApplyForm(false);
                            setSubmitStatus('idle');
                          }}
                          className="btn-primary"
                          style={{ marginTop: '2.5rem', width: '100%', maxWidth: '240px' }}
                        >
                          Close Window
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        {/* Progress Stepper bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', background: 'var(--surface2)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto' }}>
                          {[
                            { step: 1, label: 'Personal' },
                            { step: 2, label: 'Professional' },
                            { step: 3, label: 'Education' },
                            { step: 4, label: 'Uploads & QA' }
                          ].map((s, idx) => (
                            <React.Fragment key={s.step}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                <div style={{ 
                                  width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600,
                                  background: formStep === s.step ? 'var(--accent)' : formStep > s.step ? 'rgba(16,185,129,0.1)' : 'var(--tag-bg)',
                                  color: formStep === s.step ? '#000' : formStep > s.step ? '#10b981' : 'var(--muted)',
                                  border: formStep > s.step ? '1px solid #10b981' : '1px solid var(--border)'
                                }}>
                                  {formStep > s.step ? '✓' : s.step}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: formStep === s.step ? 600 : 400, color: formStep === s.step ? 'var(--text)' : 'var(--muted)' }}>{s.label}</span>
                              </div>
                              {idx < 3 && <ChevronRight size={14} style={{ color: 'var(--border)', flexShrink: 0 }} />}
                            </React.Fragment>
                          ))}
                        </div>

                        {submitStatus === 'error' && (
                          <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                            <AlertCircle size={18} />
                            <span style={{ fontSize: '0.85rem' }}>{submitMessage}</span>
                          </div>
                        )}

                        {/* STEP 1: Personal Details */}
                        {formStep === 1 && (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name *</label>
                                <input type="text" name="fullName" value={form.fullName} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address *</label>
                                <input type="email" name="email" value={form.email} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mobile Number *</label>
                                <input type="tel" name="mobile" value={form.mobile} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alternate Mobile</label>
                                <input type="tel" name="alternateMobile" value={form.alternateMobile} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Location *</label>
                                <input type="text" name="currentLocation" value={form.currentLocation} onChange={handleInputChange} required placeholder="e.g. Mumbai, India" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preferred Location</label>
                                <input type="text" name="preferredLocation" value={form.preferredLocation} onChange={handleInputChange} placeholder="e.g. Remote, Hybrid" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: Professional Details & Skills */}
                        {formStep === 2 && (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Company</label>
                                <input type="text" name="currentCompany" value={form.currentCompany} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Designation</label>
                                <input type="text" name="currentDesignation" value={form.currentDesignation} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Experience *</label>
                                <select name="totalExperience" value={form.totalExperience} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                                  <option value="">Select experience...</option>
                                  <option value="0-2 Years">0-2 Years</option>
                                  <option value="3-5 Years">3-5 Years</option>
                                  <option value="5+ Years">5+ Years</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Relevant Experience *</label>
                                <select name="relevantExperience" value={form.relevantExperience} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                                  <option value="">Select relevant experience...</option>
                                  <option value="0-2 Years">0-2 Years</option>
                                  <option value="3-5 Years">3-5 Years</option>
                                  <option value="5+ Years">5+ Years</option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Salary (Annual)</label>
                                <input type="text" name="currentSalary" value={form.currentSalary} onChange={handleInputChange} placeholder="e.g. ₹8,00,000" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Expected Salary *</label>
                                <input type="text" name="expectedSalary" value={form.expectedSalary} onChange={handleInputChange} required placeholder="e.g. ₹12,00,000" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notice Period *</label>
                                <select name="noticePeriod" value={form.noticePeriod} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                                  <option value="">Select notice period...</option>
                                  <option value="Immediate">Immediate</option>
                                  <option value="15 Days">15 Days</option>
                                  <option value="30 Days">30 Days</option>
                                  <option value="60 Days">60 Days</option>
                                  <option value="90 Days">90 Days</option>
                                </select>
                              </div>
                            </div>

                            {/* Skills Selector */}
                            <div>
                              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skills & Tags * (Select at least 1)</label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.75rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', minHeight: '44px', marginBottom: '0.75rem' }}>
                                {selectedSkills.length === 0 ? (
                                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Click preset tags below or enter custom skills...</span>
                                ) : (
                                  selectedSkills.map(skill => (
                                    <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: 'var(--surface2)', border: '1px solid var(--accent)55', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text)' }}>
                                      {skill}
                                      <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: '#ff4444', display: 'inline-flex', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                                    </span>
                                  ))
                                )}
                              </div>
                              
                              {/* Quick selection presets */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                                {availableSkillsList.map(skill => {
                                  const isSelected = selectedSkills.includes(skill);
                                  return (
                                    <button 
                                      type="button" key={skill} disabled={isSelected}
                                      onClick={() => handleAddSkill(skill)}
                                      style={{ padding: '0.2rem 0.5rem', background: isSelected ? 'rgba(201, 243, 29, 0.05)' : 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.75rem', color: isSelected ? 'var(--muted)' : 'var(--text)', cursor: isSelected ? 'default' : 'pointer' }}
                                    >
                                      + {skill}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Custom input */}
                              <div className="flex gap-2">
                                <input 
                                  type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} 
                                  placeholder="Type custom skill (e.g. Snowflake)..."
                                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}
                                />
                                <button type="button" onClick={() => handleAddSkill(skillInput)} style={{ padding: '0.5rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.8rem', cursor: 'pointer' }}>Add</button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: Education & Socials */}
                        {formStep === 3 && (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Highest Qualification *</label>
                                <input type="text" name="highestQualification" value={form.highestQualification} onChange={handleInputChange} required placeholder="e.g. B.Tech in CSE, MCA" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>University/College *</label>
                                <input type="text" name="university" value={form.university} onChange={handleInputChange} required placeholder="e.g. Mumbai University" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Passing Year *</label>
                                <input type="number" min="2000" max="2030" name="passingYear" value={form.passingYear} onChange={handleInputChange} required placeholder="e.g. 2024" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>CGPA or Percentage *</label>
                                <input type="text" name="cgpa" value={form.cgpa} onChange={handleInputChange} required placeholder="e.g. 8.5 CGPA or 78%" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>LinkedIn Profile URL</label>
                                <input type="url" name="linkedin" value={form.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Portfolio Website</label>
                                <input type="url" name="portfolio" value={form.portfolio} onChange={handleInputChange} placeholder="https://myportfolio.com" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>GitHub Profile Link</label>
                                <input type="url" name="github" value={form.github} onChange={handleInputChange} placeholder="https://github.com/username" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kaggle Profile Link</label>
                                <input type="url" name="kaggle" value={form.kaggle} onChange={handleInputChange} placeholder="https://kaggle.com/username" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 4: Essay Q&A, Uploads, & Declaration */}
                        {formStep === 4 && (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Why do you want to join us? * (minimum 10 characters)</label>
                              <textarea name="whyJoin" value={form.whyJoin} onChange={handleInputChange} required rows={3} placeholder="Explain what drives you to join our group..." style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                            </div>

                            <div>
                              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Describe your strongest technical or business achievement * (minimum 10 characters)</label>
                              <textarea name="achievement" value={form.achievement} onChange={handleInputChange} required rows={3} placeholder="Detail a time you resolved a complex bug, built an ETL workflow, or scaled up a dashboard..." style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                            </div>

                            {/* Resume & Portfolio upload */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px dashed var(--border)', padding: '1.25rem', borderRadius: '8px', background: 'var(--tag-bg)' }}>
                              <div>
                                <label style={{ display: 'block', color: 'var(--text)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Resume File *</label>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, true)} required style={{ fontSize: '0.8rem' }} />
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>PDF, DOC, DOCX up to 10MB</div>
                                {resumeFile && <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.4rem' }}>✓ {resumeFile.name} loaded</div>}
                              </div>
                              <div>
                                <label style={{ display: 'block', color: 'var(--text)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Portfolio File (Optional)</label>
                                <input type="file" accept=".pdf,.zip" onChange={(e) => handleFileChange(e, false)} style={{ fontSize: '0.8rem' }} />
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>PDF, ZIP up to 10MB</div>
                                {portfolioFile && <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.4rem' }}>✓ {portfolioFile.name} loaded</div>}
                              </div>
                            </div>
                            
                            {fileError && <div style={{ color: '#ff4444', fontSize: '0.85rem' }}>{fileError}</div>}

                            {/* Declaration */}
                            <div className="flex items-start gap-2 mt-2">
                              <input 
                                type="checkbox" id="declaration" name="declarationChecked" 
                                checked={form.declarationChecked} onChange={(e) => setForm(prev => ({ ...prev, declarationChecked: e.target.checked }))} 
                                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                              />
                              <label htmlFor="declaration" style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5, cursor: 'pointer' }}>
                                I certify that the information provided in this application is accurate and complete to the best of my knowledge. *
                              </label>
                            </div>
                          </motion.div>
                        )}

                        {/* Navigation Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                          {formStep > 1 ? (
                            <button 
                              type="button" onClick={() => setFormStep(prev => prev - 1)}
                              className="mono" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                            >
                              <ArrowLeft size={14} /> Back
                            </button>
                          ) : (
                            <div />
                          )}

                          {formStep < 4 ? (
                            <button 
                              type="button" onClick={handleNextStep}
                              className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', letterSpacing: '0.15em' }}
                            >
                              Next Step <ArrowRight size={14} />
                            </button>
                          ) : (
                            <button 
                              type="submit" disabled={submitStatus === 'loading'}
                              className="btn-primary" style={{ padding: '0.75rem 2rem', background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.15em' }}
                            >
                              {submitStatus === 'loading' ? 'Submitting...' : <><Send size={14} /> Submit Profile</>}
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Status Tracking Form Section */}
        <section id="tracking" className="section" style={{ padding: '4rem 0', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="label-tech mb-3" style={{ letterSpacing: '0.1em', justifyContent: 'center' }}>APPLICATION-TRACKING</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Track Your Application</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Enter your unique Application ID and email to view your current application status.</p>
            </div>

            <div className="card" style={{ padding: '2rem', background: 'var(--bg)' }}>
              <form onSubmit={handleTrackApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Application ID</label>
                    <input 
                      type="text" value={trackId} onChange={(e) => setTrackId(e.target.value)} required placeholder="e.g. DS-2026-0001"
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Registered Email</label>
                    <input 
                      type="email" value={trackEmail} onChange={(e) => setTrackEmail(e.target.value)} required placeholder="e.g. johndoe@example.com"
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={trackLoading}
                  className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '10px', letterSpacing: '0.15em' }}
                >
                  {trackLoading ? 'Searching...' : 'Track Status'}
                </button>
              </form>

              {/* Status Results Display */}
              {trackError && (
                <div className="flex items-center gap-3 mt-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '0.85rem' }}>{trackError}</span>
                </div>
              )}

              {trackResult && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Application Found</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    <div><strong>Candidate:</strong> {trackResult.fullName}</div>
                    <div><strong>Position:</strong> {trackResult.position}</div>
                    <div><strong>Department:</strong> {trackResult.department}</div>
                    <div><strong>Date Applied:</strong> {new Date(trackResult.appliedAt).toLocaleDateString()}</div>
                  </div>

                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Current Hiring Status</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.25rem' }}>{trackResult.status}</div>
                    </div>
                    
                    <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent)' }}>
                      <Info size={14} />
                      {trackResult.status === 'New' && 'Under initial evaluation'}
                      {trackResult.status === 'Under Review' && 'Recruiter is reviewing credentials'}
                      {trackResult.status === 'Shortlisted' && 'Shortlisted for interview screening'}
                      {trackResult.status === 'Interview Scheduled' && 'Active interview loops'}
                      {trackResult.status === 'Selected' && 'Selected! Check your email for offer details'}
                      {trackResult.status === 'Rejected' && 'Application archived'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Crosshair position="br" />
      </div>

      <Footer />
    </div>
  );
}
