'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { 
  Send, CheckCircle, AlertCircle, FileText, Briefcase, Award, 
  MapPin, DollarSign, Calendar, Search, X, ChevronRight, Info, Phone
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

export default function CareersContent({ defaultJobTitle }: { defaultJobTitle?: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Pre-select job if passed as prop
  useEffect(() => {
    if (defaultJobTitle && jobs.length > 0) {
      const match = jobs.find(j => j.title.toLowerCase().includes(defaultJobTitle.toLowerCase()));
      if (match) {
        setSelectedJob(match);
        setForm(f => ({ ...f, jobId: match.id }));
        setShowApplyForm(true);
      }
    }
  }, [defaultJobTitle, jobs]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [form, setForm] = useState({
    jobId: '',
    fullName: '',
    email: '',
    mobile: '',
    alternateMobile: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    currentLocation: '',
    currentAddress: '',
    preferredLocation: 'Mumbai & Nearby Areas',
    currentCompany: '',
    currentDesignation: '',
    totalExperience: '0-2 Years',
    relevantExperience: '0-2 Years',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: 'Immediate',
    availableFrom: '',
    highestQualification: '10th Pass',
    university: '',
    passingYear: '',
    cgpa: '',
    linkedin: '',
    github: '',
    portfolio: '',
    kaggle: '',
    whyJoin: 'Interested in growing within collections operations.',
    achievement: 'N/A',
    declarationChecked: false,
    honeypot: '',
    
    // Collections Specific Fields
    is10thPass: true,
    hasCollectionExperience: false,
    hasTeamHandlingExperience: false,
    areaFamiliarity: '',
    hasTwoWheeler: false,
    hasDrivingLicense: false,
    isImmediateJoiner: true,
    candidateSource: 'LinkedIn',
  });

  // Files state
  const [resumeFile, setResumeFile] = useState<{ base64: string; name: string } | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<{ base64: string; name: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<{ base64: string; name: string } | null>(null);
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
          // Filter to collections jobs primarily or prioritize them
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file uploads and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'resume' | 'aadhaar' | 'photo') => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    // Validate size (max 5MB for photos, 10MB for others)
    const maxSize = (fileType === 'photo' ? 5 : 10) * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(`File "${file.name}" exceeds the size limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (fileType === 'resume') {
        setResumeFile({ base64: base64String, name: file.name });
      } else if (fileType === 'aadhaar') {
        setAadhaarFile({ base64: base64String, name: file.name });
      } else if (fileType === 'photo') {
        setPhotoFile({ base64: base64String, name: file.name });
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
      // Step 1: Position selection & Candidate Source
      return true;
    }
    if (step === 2) {
      // Step 2: Personal Details
      return form.fullName.trim() && form.email.trim() && form.mobile.trim() && form.whatsappNumber.trim() && form.dateOfBirth.trim() && form.currentAddress.trim() && form.currentLocation.trim();
    }
    if (step === 3) {
      // Step 3: Education & Experience details
      return form.highestQualification.trim() && form.expectedSalary.trim();
    }
    if (step === 4) {
      // Step 4: Collections Eligibility
      return form.areaFamiliarity.trim();
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

    if (!aadhaarFile) {
      setSubmitMessage("Please upload your Aadhaar document.");
      setSubmitStatus('error');
      return;
    }

    if (!photoFile) {
      setSubmitMessage("Please upload your passport-sized photograph.");
      setSubmitStatus('error');
      return;
    }

    if (!form.declarationChecked) {
      setSubmitMessage("You must certify that the provided details are accurate.");
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
        whatsappNumber: form.whatsappNumber,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        currentLocation: form.currentLocation,
        currentAddress: form.currentAddress,
        preferredLocation: form.preferredLocation,
        currentCompany: form.currentCompany || null,
        currentDesignation: form.currentDesignation || null,
        totalExperience: form.totalExperience,
        relevantExperience: form.relevantExperience,
        currentSalary: form.currentSalary || null,
        expectedSalary: form.expectedSalary,
        noticePeriod: form.noticePeriod,
        availableFrom: form.availableFrom || null,
        skills: ['Collections', 'Field Operations', 'Customer Service'],
        highestQualification: form.highestQualification,
        university: form.university || null,
        passingYear: form.passingYear || null,
        cgpa: form.cgpa || null,
        linkedin: form.linkedin || null,
        github: form.github || null,
        portfolio: form.portfolio || null,
        kaggle: form.kaggle || null,
        whyJoin: form.whyJoin,
        achievement: form.achievement,
        declarationChecked: form.declarationChecked,

        // Collections Specific
        is10thPass: form.is10thPass,
        hasCollectionExperience: form.hasCollectionExperience,
        hasTeamHandlingExperience: form.hasTeamHandlingExperience,
        areaFamiliarity: form.areaFamiliarity,
        hasTwoWheeler: form.hasTwoWheeler,
        hasDrivingLicense: form.hasDrivingLicense,
        isImmediateJoiner: form.isImmediateJoiner,
        candidateSource: form.candidateSource,

        // Files
        resumeBase64: resumeFile.base64,
        resumeName: resumeFile.name,
        aadhaarBase64: aadhaarFile.base64,
        aadhaarName: aadhaarFile.name,
        photoBase64: photoFile.base64,
        photoName: photoFile.name,
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
      setResumeFile(null);
      setAadhaarFile(null);
      setPhotoFile(null);
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

  // Hardcoded target jobs to show details if DB query fails or seeds aren't loaded yet
  const collectionsJobOfficer = {
    title: "Field Collection Officer (FOS)",
    department: "Collections",
    location: "Mumbai & Nearby Areas",
    openings: "40",
    qualification: "10th Pass Minimum",
    experience: "Preferred but not mandatory (Freshers welcome)",
    salary: "Commission Only",
    commission: "10% to 20% of successfully collected amount. Weekly performance incentives. Unlimited earning potential. Field allowances."
  };

  const collectionsJobLeader = {
    title: "Collection Team Leader",
    department: "Collections",
    location: "Mumbai & Nearby Areas",
    openings: "10",
    qualification: "12th Pass / Graduate Preferred",
    experience: "2-5 Years Collections Experience (Must have team handling)",
    salary: "₹20,000 - ₹30,000 / month",
    bonus: "Team Performance Bonus & incentives"
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', position: 'relative' }}>
      <Navbar />
      
      {/* Floating WhatsApp Apply Button */}
      <a 
        href="https://wa.me/919999999999?text=Hi%20Recruitment%20Team%2C%20I%20am%20interested%20in%20applying%20for%20the%20Collection%20jobs%20at%20DattaSable.com.%20Please%20guide%20me%20on%20the%20next%20steps." 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          background: '#25D366',
          color: '#fff',
          borderRadius: '50px',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        className="hover:scale-105"
      >
        <Phone size={16} /> Apply via WhatsApp
      </a>

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        <Crosshair position="tl" />

        {/* Hero Section */}
        <section className="section" style={{ paddingTop: 'clamp(7rem, 10vw, 9rem)', paddingBottom: '3rem' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> Urgent Hiring Campaign 2026
              </div>

              <div style={{ background: 'var(--surface2)', display: 'inline-flex', padding: '0.5rem 1.25rem', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                ⚡ Immediate Joiners Preferred
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 38px)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.015em' }}>
                Urgent Hiring: <span className="hero-title">Collection Officers</span> & Team Leaders
              </h1>
              
              <p style={{ color: 'var(--muted)', maxWidth: 680, margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>
                Join our fast-growing collections operation in Mumbai and surrounding regions. Freshers welcome, excellent commission structures, and fixed salaries for team leaders. Immediate joining roles available now.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#quick-apply" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>Apply Now Online</a>
                <a href="#tracking" className="mono" style={{ textDecoration: 'none', border: '1px solid var(--border)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--surface2)' }}>
                  <Search size={14} /> Track Application Status
                </a>
              </div>
            </div>

            {/* Statistics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>40+</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FOS Openings</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>10</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Leader Openings</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>10th Pass</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum Qualification</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Immediate</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joining Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Description Cards */}
        <section id="roles" className="section" style={{ paddingBottom: '5rem' }}>
          <div className="container">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 700, textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '-0.015em' }}>Urgent Job Openings</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
              
              {/* Card 1: FOS */}
              <div className="card flex flex-col justify-between" style={{ padding: '2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="tag" style={{ color: 'var(--accent)', borderColor: 'rgba(201, 243, 29, 0.2)' }}>Field Operations</span>
                    <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>🔥 40 Positions</span>
                  </div>
                  
                  <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.015em' }}>{collectionsJobOfficer.title}</h3>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>📍 Location:</strong> {collectionsJobOfficer.location}</div>
                    <div><strong>💼 Compensation:</strong> {collectionsJobOfficer.salary}</div>
                    <div><strong>🎓 Education:</strong> {collectionsJobOfficer.qualification}</div>
                    <div><strong>⏳ Experience:</strong> {collectionsJobOfficer.experience}</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Commission Structure</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{collectionsJobOfficer.commission}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Roles & Responsibilities</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }} className="space-y-1">
                      <li>Field operations (FOS) for debt collection in assigned locations</li>
                      <li>Visit customer locations to collect outstanding dues</li>
                      <li>Maintain clean records and daily collection reports</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Eligibility</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }} className="space-y-1">
                      <li>Minimum 10th Pass</li>
                      <li>Freshers Can Apply</li>
                      <li>Collection Experience Preferred</li>
                      <li>Good Communication Skills</li>
                      <li>Two-Wheeler Preferred</li>
                    </ul>
                  </div>
                </div>

                <a 
                  href="#quick-apply" 
                  onClick={() => {
                    const fosJob = jobs.find(j => j.title.includes('FOS') || j.title.includes('Officer')) || { id: 'fos' };
                    setSelectedJob(fosJob as any);
                    setForm(f => ({ ...f, jobId: fosJob.id }));
                    setShowApplyForm(true);
                  }}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem', textAlign: 'center', textDecoration: 'none' }}
                >
                  Apply For FOS
                </a>
              </div>

              {/* Card 2: TL */}
              <div className="card flex flex-col justify-between" style={{ padding: '2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="tag" style={{ color: 'var(--accent)', borderColor: 'rgba(201, 243, 29, 0.2)' }}>Team Management</span>
                    <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>🔥 10 Positions</span>
                  </div>
                  
                  <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.015em' }}>{collectionsJobLeader.title}</h3>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>📍 Location:</strong> {collectionsJobLeader.location}</div>
                    <div><strong>💼 Salary:</strong> {collectionsJobLeader.salary}</div>
                    <div><strong>🎓 Education:</strong> {collectionsJobLeader.qualification}</div>
                    <div><strong>⏳ Experience:</strong> {collectionsJobLeader.experience}</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Additional Benefits</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{collectionsJobLeader.bonus}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Roles & Responsibilities</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }} className="space-y-1">
                      <li>Manage a team of 15-20 field collection officers (FOS)</li>
                      <li>Monitor and drive daily collection targets</li>
                      <li>Handle critical escalations and agency reports</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--text)' }}>Eligibility</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }} className="space-y-1">
                      <li>2–5 Years Collections Experience</li>
                      <li>Team Handling Experience</li>
                      <li>Leadership Skills</li>
                      <li>Target Management Experience</li>
                      <li>Reporting Knowledge</li>
                      <li>Collection Process Expertise</li>
                    </ul>
                  </div>
                </div>

                <a 
                  href="#quick-apply" 
                  onClick={() => {
                    const tlJob = jobs.find(j => j.title.includes('Leader') || j.title.includes('TL')) || { id: 'tl' };
                    setSelectedJob(tlJob as any);
                    setForm(f => ({ ...f, jobId: tlJob.id }));
                    setShowApplyForm(true);
                  }}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem', textAlign: 'center', textDecoration: 'none' }}
                >
                  Apply For Team Leader
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Application Form Wizard */}
        <section id="quick-apply" className="section" style={{ padding: '5rem 0', background: 'var(--surface2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '780px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="label-tech mb-3" style={{ letterSpacing: '0.2em', justifyContent: 'center' }}>ATS-APPLICATION-PORTAL</div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 1.8rem)', fontWeight: 700, letterSpacing: '-0.015em', marginBottom: '0.5rem' }}>Quick Apply Form</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Fill in the details below. Immediate joining opportunities available.</p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', background: 'var(--bg)' }}>
              
              {submitStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.015em' }}>Application Submitted Successfully</h3>
                  <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                    Thank you for applying. An automated confirmation message has been triggered to your WhatsApp number. Our recruitment team will review your details and contact you within 48 hours.
                  </p>
                  
                  <div style={{ padding: '1.25rem 2.5rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', display: 'inline-block' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Tracking ID</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>{generatedAppId}</div>
                  </div>

                  <button 
                    onClick={() => {
                      setSubmitStatus('idle');
                      setFormStep(1);
                    }}
                    className="btn-primary"
                    style={{ marginTop: '2.5rem', width: '100%', maxWidth: '240px', padding: '1rem' }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  
                  {/* Progress Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', background: 'var(--surface2)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto' }}>
                    {[
                      { step: 1, label: 'Role & Source' },
                      { step: 2, label: 'Personal Details' },
                      { step: 3, label: 'Experience & Qualifications' },
                      { step: 4, label: 'Collections Qs' },
                      { step: 5, label: 'Upload Documents' }
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
                        {idx < 4 && <ChevronRight size={14} style={{ color: 'var(--border)', flexShrink: 0 }} />}
                      </React.Fragment>
                    ))}
                  </div>

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                      <AlertCircle size={18} />
                      <span style={{ fontSize: '0.85rem' }}>{submitMessage}</span>
                    </div>
                  )}

                  {fileError && (
                    <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                      <AlertCircle size={18} />
                      <span style={{ fontSize: '0.85rem' }}>{fileError}</span>
                    </div>
                  )}

                  {/* STEP 1: Position selection & Candidate Source */}
                  {formStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Position Applying For *</label>
                        <select name="jobId" value={form.jobId} onChange={(e) => {
                          const val = e.target.value;
                          const selected = jobs.find(j => j.id === val);
                          setSelectedJob(selected || null);
                          setForm(f => ({ ...f, jobId: val }));
                        }} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                          <option value="">Select a role...</option>
                          {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Candidate Recruiting Source *</label>
                        <select name="candidateSource" value={form.candidateSource} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Referral">Referral</option>
                          <option value="Naukri">Naukri</option>
                          <option value="Apna">Apna</option>
                          <option value="WorkIndia">WorkIndia</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <button type="button" onClick={handleNextStep} className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>Next Step</button>
                    </motion.div>
                  )}

                  {/* STEP 2: Personal Details */}
                  {formStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name *</label>
                        <input type="text" name="fullName" value={form.fullName} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mobile Number *</label>
                          <input type="tel" name="mobile" value={form.mobile} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>WhatsApp Number *</label>
                          <input type="tel" name="whatsappNumber" value={form.whatsappNumber} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address *</label>
                          <input type="email" name="email" value={form.email} onChange={handleInputChange} required className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date of Birth *</label>
                          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gender *</label>
                          <select name="gender" value={form.gender} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Location (City) *</label>
                          <input type="text" name="currentLocation" value={form.currentLocation} onChange={handleInputChange} required placeholder="e.g. Mumbai, Kalyan, Thane" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Full Address *</label>
                        <textarea name="currentAddress" value={form.currentAddress} onChange={handleInputChange} required style={{ width: '100%', minHeight: '60px', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setFormStep(1)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Back</button>
                        <button type="button" onClick={handleNextStep} className="btn-primary" style={{ flex: 2, padding: '0.8rem' }}>Next Step</button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Experience & Qualifications */}
                  {formStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Highest Qualification *</label>
                          <select name="highestQualification" value={form.highestQualification} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                            <option value="10th Pass">10th Pass</option>
                            <option value="12th Pass">12th Pass</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Experience Status *</label>
                          <select name="totalExperience" value={form.totalExperience} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                            <option value="0-2 Years">Fresher</option>
                            <option value="3-5 Years">Experienced (1-3 years)</option>
                            <option value="5+ Years">Experienced (3+ years)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Company (If experienced)</label>
                          <input type="text" name="currentCompany" value={form.currentCompany} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Designation</label>
                          <input type="text" name="currentDesignation" value={form.currentDesignation} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Monthly Salary (If applicable)</label>
                          <input type="text" name="currentSalary" value={form.currentSalary} onChange={handleInputChange} placeholder="e.g. ₹15,000" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Expected Salary *</label>
                          <input type="text" name="expectedSalary" value={form.expectedSalary} onChange={handleInputChange} required placeholder="e.g. ₹25,000" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notice Period *</label>
                          <select name="noticePeriod" value={form.noticePeriod} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}>
                            <option value="Immediate">Immediate Joining</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="60+ Days">60+ Days</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.8rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" name="isImmediateJoiner" checked={form.isImmediateJoiner} onChange={handleInputChange} style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                            <span><strong>I can join immediately</strong></span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setFormStep(2)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Back</button>
                        <button type="button" onClick={handleNextStep} className="btn-primary" style={{ flex: 2, padding: '0.8rem' }}>Next Step</button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Collections Eligibility Questions */}
                  {formStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <input type="checkbox" name="is10thPass" checked={form.is10thPass} onChange={handleInputChange} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>10th Pass Confirmed?</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Confirm you have cleared SSC exam</span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <input type="checkbox" name="hasCollectionExperience" checked={form.hasCollectionExperience} onChange={handleInputChange} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Collections Experience?</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Do you have past collection experience?</span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <input type="checkbox" name="hasTeamHandlingExperience" checked={form.hasTeamHandlingExperience} onChange={handleInputChange} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Team Handling Exp?</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Have you managed collections agents?</span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <input type="checkbox" name="hasTwoWheeler" checked={form.hasTwoWheeler} onChange={handleInputChange} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Two Wheeler Available?</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Do you own a bike/scooter?</span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <input type="checkbox" name="hasDrivingLicense" checked={form.hasDrivingLicense} onChange={handleInputChange} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Driving License Available?</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Do you have a valid driving license?</span>
                          </div>
                        </label>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Which Mumbai Areas are you familiar with? *</label>
                        <input type="text" name="areaFamiliarity" value={form.areaFamiliarity} onChange={handleInputChange} required placeholder="e.g. Kalyan, Dombivli, Thane, Badlapur, Kurla" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setFormStep(3)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Back</button>
                        <button type="button" onClick={handleNextStep} className="btn-primary" style={{ flex: 2, padding: '0.8rem' }}>Next Step</button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: File Uploads & Checkbox Submit */}
                  {formStep === 5 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      
                      {/* Resume */}
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Upload Resume * (PDF, DOC, DOCX - Max 10MB)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--tag-bg)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                          <input type="file" required onChange={(e) => handleFileChange(e, 'resume')} accept=".pdf,.doc,.docx" style={{ fontSize: '0.85rem' }} />
                          {resumeFile && <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Attached</span>}
                        </div>
                      </div>

                      {/* Aadhaar */}
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Upload Aadhaar Card * (PDF, JPG, PNG - Max 10MB)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--tag-bg)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                          <input type="file" required onChange={(e) => handleFileChange(e, 'aadhaar')} accept=".pdf,.jpg,.jpeg,.png" style={{ fontSize: '0.85rem' }} />
                          {aadhaarFile && <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Attached</span>}
                        </div>
                      </div>

                      {/* Photo */}
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Upload Candidate Photo * (Passport Size - JPG, PNG - Max 5MB)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--tag-bg)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                          <input type="file" required onChange={(e) => handleFileChange(e, 'photo')} accept=".jpg,.jpeg,.png" style={{ fontSize: '0.85rem' }} />
                          {photoFile && <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Attached</span>}
                        </div>
                      </div>

                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--muted)' }}>
                          <input type="checkbox" name="declarationChecked" checked={form.declarationChecked} onChange={handleInputChange} required style={{ width: 16, height: 16, marginTop: '2px', accentColor: 'var(--accent)' }} />
                          <span>I hereby declare that all details provided in this application form are true and accurate to the best of my knowledge. I understand that any false declarations may lead to immediate disqualification.</span>
                        </label>
                      </div>

                      <input type="text" name="honeypot" value={form.honeypot} onChange={handleInputChange} style={{ display: 'none' }} />

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setFormStep(4)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Back</button>
                        <button 
                          type="submit" 
                          disabled={submitStatus === 'loading'}
                          className="btn-primary" 
                          style={{ flex: 2, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                          {submitStatus === 'loading' ? 'Submitting...' : (
                            <>
                              <Send size={14} /> Submit Application
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </form>
              )}
            </div>
          </div>
        </section>

        {/* ATS Tracker Form */}
        <section id="tracking" className="section" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.6rem)', fontWeight: 700, letterSpacing: '-0.015em', marginBottom: '0.5rem' }}>Track Application Status</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Enter your Application ID and Email to view your hiring workflow status.</p>
            </div>

            <div className="card" style={{ padding: '2rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <form onSubmit={handleTrackApplication} className="space-y-4">
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Application ID *</label>
                  <input type="text" value={trackId} onChange={(e) => setTrackId(e.target.value)} required placeholder="e.g. DS-2026-0001" style={{ width: '100%', padding: '0.65rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email Address *</label>
                  <input type="email" value={trackEmail} onChange={(e) => setTrackEmail(e.target.value)} required placeholder="e.g. candidate@domain.com" style={{ width: '100%', padding: '0.65rem 1rem', background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }} />
                </div>

                <button type="submit" disabled={trackLoading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {trackLoading ? 'Searching...' : (
                    <>
                      <Search size={14} /> Search Candidate Profile
                    </>
                  )}
                </button>
              </form>

              {trackError && (
                <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: '#ef4444' }}>
                  <AlertCircle size={14} /> {trackError}
                </div>
              )}

              {/* tracking results timeline */}
              {trackResult && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Application Tracking Details</h4>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div><strong>Name:</strong> {trackResult.fullName}</div>
                    <div><strong>Position:</strong> {trackResult.position}</div>
                    <div><strong>Applied On:</strong> {new Date(trackResult.appliedAt).toLocaleDateString()}</div>
                  </div>

                  {/* Stepper visualization of recruitmentStatus */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.5rem' }}>
                    <div style={{ position: 'absolute', top: 5, bottom: 5, left: 5, width: 2, background: 'var(--border)' }} />
                    
                    {[
                      { status: "Application Received", desc: "Your application has been received and added to our system." },
                      { status: "Screening Pending", desc: "A recruiter is currently screening your profile." },
                      { status: "Interview Scheduled", desc: "Your interview has been scheduled.", date: trackResult.interviewDate },
                      { status: "Selected", desc: "Congratulations! You have cleared our interview stages." },
                      { status: "Document Verification", desc: "We are currently verifying your uploaded Aadhaar and photo details." },
                      { status: "Joined", desc: "Welcome to the team!", date: trackResult.joiningDate }
                    ].map((step, idx) => {
                      const isTerminalRejected = trackResult.recruitmentStatus === 'Rejected';
                      const statuses = [
                        "Application Received",
                        "Screening Pending",
                        "Interview Scheduled",
                        "Selected",
                        "Document Verification",
                        "Joined"
                      ];
                      
                      const currentIdx = statuses.indexOf(trackResult.recruitmentStatus);
                      const stepIdx = statuses.indexOf(step.status);
                      const isActive = !isTerminalRejected && stepIdx <= currentIdx;
                      const isUpcoming = !isTerminalRejected && stepIdx > currentIdx;

                      return (
                        <div key={idx} style={{ position: 'relative' }}>
                          <div style={{ 
                            position: 'absolute', left: '-20px', top: '3px', width: '12px', height: '12px', borderRadius: '50%',
                            background: isActive ? 'var(--accent)' : 'var(--tag-bg)',
                            border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)'
                          }} />
                          <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--text)' : 'var(--muted)' }}>
                            {step.status} {step.date && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>({step.date})</span>}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{step.desc}</div>
                        </div>
                      );
                    })}

                    {trackResult.recruitmentStatus === 'Rejected' && (
                      <div style={{ position: 'relative', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Application Status: Rejected</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>We regret to inform you that we are not moving forward with your application at this time. Thank you for your interest.</div>
                      </div>
                    )}

                    {trackResult.remarks && (
                      <div style={{ padding: '0.75rem', background: 'var(--surface)', borderLeft: '3px solid var(--accent)', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                        <strong>Recruiter Note:</strong> {trackResult.remarks}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
