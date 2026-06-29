'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { 
  CheckCircle, ChevronDown, ChevronRight, 
  Download, HelpCircle, Lock, 
  ArrowRight, ShieldCheck, Heart, Sparkles, Code,
  Users, BookOpen, AlertTriangle, Mail, Calendar, Award
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  description: string;
}

interface Cohort {
  id: string;
  name: string;
  status: string;
}

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  downloadUrl: string;
  featured: boolean;
}

interface LearnerSession {
  id: string;
  fullName: string;
  email: string;
  linkedin: string;
  experience: string;
  targetRole: string;
  challenge: string;
  status: string;
  resumeUrl: string;
  isComebackProgram: boolean;
  mentorNotes?: string;
  cohort?: Cohort;
  track?: Track;
  progress: { id: string; week: number; moduleName: string; completed: boolean; completedAt: string }[];
  projects: any[];
  feedbackTimeline: { id: string; content: string; createdAt: string }[];
}

export default function MentorshipPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: '#000000', surface: '#0d0d0d', border: '#1a1a1a', text: '#f8fafc', muted: '#64748b', accent: '#6366f1', inputBg: '#121212', cardHover: '#161616' }
    : { bg: '#f8fafc', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', muted: '#475569', accent: '#4f46e5', inputBg: '#f1f5f9', cardHover: '#f8fafc' };

  // Setup state
  const [tracks, setTracks] = useState<Track[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'apply' | 'portal'>('info');

  // Application form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [targetRole, setTargetRole] = useState('Azure Data Engineer');
  const [challenge, setChallenge] = useState('');
  const [trackId, setTrackId] = useState('');
  const [isComebackProgram, setIsComebackProgram] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  // Form compliance checkboxes
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [agreedFreePolicy, setAgreedFreePolicy] = useState(false);

  // Portal login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devHelper, setDevHelper] = useState<{ otp: string; magicLink: string } | null>(null);

  // Active Learner Dashboard Session
  const [session, setSession] = useState<LearnerSession | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Weekly Challenge Submitter
  const [weeklyChallengeLink, setWeeklyChallengeLink] = useState('');

  // Newsletter Form States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    // Simulate API registration delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setNewsletterSubscribed(true);
    setNewsletterLoading(false);
  };

  // Fetch basic tracks, cohorts, resources
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const res = await fetch('/api/mentorship');
        if (res.ok) {
          const data = await res.json();
          setTracks(data.tracks || []);
          if (data.tracks && data.tracks.length > 0) {
            setTrackId(data.tracks[0].id);
          }
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
    loadMetadata();
  }, []);

  // Handle Application Submit
  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !linkedin || !challenge || !trackId) {
      setMessage({ type: 'error', text: 'All required fields must be filled.' });
      return;
    }
    if (!agreedGuidelines || !agreedFreePolicy) {
      setMessage({ type: 'error', text: 'You must agree to the mentorship guidelines.' });
      return;
    }
    if (!resume) {
      setMessage({ type: 'error', text: 'Please upload your resume PDF.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('linkedin', linkedin);
      formData.append('experience', experience);
      formData.append('targetRole', targetRole);
      formData.append('challenge', challenge);
      formData.append('trackId', trackId);
      formData.append('isComebackProgram', isComebackProgram ? 'true' : 'false');
      formData.append('resume', resume);

      const res = await fetch('/api/mentorship', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Application submitted successfully! You can now check your progress using the Learner Portal.' });
        // Clear form
        setFullName('');
        setEmail('');
        setLinkedin('');
        setChallenge('');
        setResume(null);
        setIsComebackProgram(false);
        setAgreedGuidelines(false);
        setAgreedFreePolicy(false);
        
        // Auto navigate to portal login
        setTimeout(() => {
          setActiveTab('portal');
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit application.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  // Request Magic Link / OTP
  const handleRequestMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setMessage({ type: 'error', text: 'Please enter your registered email.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      setDevHelper(null);

      const res = await fetch('/api/mentorship/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'Verification code generated! Check your terminal console logs.' });
        if (data.devMode) {
          setDevHelper({ otp: data.otp, magicLink: data.magicLink });
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to request code.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error connecting to verification server.' });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginOtp) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit code.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch('/api/mentorship/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, otp: loginOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSession(data.request);
        setMessage({ type: 'success', text: 'Access granted!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid verification code.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to verify code.' });
    } finally {
      setLoading(false);
    }
  };

  // Submit Weekly Challenge
  const handleSubmitChallenge = async (e: FormEvent) => {
    e.preventDefault();
    if (!weeklyChallengeLink) return;

    try {
      setLoading(true);
      // Mock submitting to DB: In Phase 2, we write challenge links.
      // For now, we update client state
      if (session) {
        setSession({
          ...session,
          projects: [...session.projects, { repoUrl: weeklyChallengeLink, title: 'Weekly Challenge Submission', createdAt: new Date().toISOString() }]
        });
        setWeeklyChallengeLink('');
        setMessage({ type: 'success', text: 'Project submitted successfully!' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Progress Percent
  const getProgressPercentage = () => {
    if (!session || !session.progress) return 0;
    const completed = session.progress.filter(p => p.completed).length;
    return Math.round((completed / session.progress.length) * 100);
  };

  const isAppliedStatusActive = (step: string) => {
    if (!session) return false;
    const order = ['Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'];
    const currentIdx = order.indexOf(session.status);
    const stepIdx = order.indexOf(step);
    return stepIdx <= currentIdx;
  };

  return (
    <div style={{ background: css.bg, minHeight: '100vh', color: css.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '110px 20px 40px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
          {[
            { id: 'info', label: 'Program Info' },
            { id: 'apply', label: 'Apply For Free' },
            { id: 'portal', label: 'Learner Dashboard' }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMessage(null);
                }}
                style={{
                  padding: '10px 24px', borderRadius: 20, border: `1px solid ${active ? css.accent : css.border}`,
                  background: active ? css.accent : css.surface, color: active ? '#fff' : css.text,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: active ? `0 4px 14px ${css.accent}30` : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* System Message Banner */}
        {message && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 12, marginBottom: 30,
            background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${message.type === 'success' ? '#10b98140' : '#ef444440'}`,
            color: message.type === 'success' ? '#10b981' : '#ef4444',
          }}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <HelpCircle size={16} />}
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Info Page */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: `${css.accent}15`, borderRadius: 20, color: css.accent, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                <Sparkles size={13} /> Genuinely Free Career Mentorship
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)', fontWeight: 750, lineHeight: 1.35, maxWidth: 900, margin: '0 auto 20px', letterSpacing: '-0.01em' }}>
                Helping Azure Data Engineers & Microsoft Fabric Professionals Build Better Careers
              </h1>
              <p style={{ fontSize: 16, color: css.muted, maxWidth: 750, margin: '0 auto 30px', lineHeight: 1.6 }}>
                Whether you're starting your career, switching domains, returning after a career break, or preparing for interviews, I'll help you with a structured roadmap, resume feedback, projects, and interview guidance — completely free.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                <button 
                  onClick={() => setActiveTab('apply')}
                  style={{
                    padding: '12px 28px', background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
                    color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', boxShadow: `0 4px 20px ${css.accent}30`, display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  Get Free Career Guidance <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => setActiveTab('portal')}
                  style={{
                    padding: '12px 28px', background: css.surface, border: `1px solid ${css.border}`,
                    color: css.text, borderRadius: 12, fontWeight: 600, fontSize: 14,
                    cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = css.cardHover}
                  onMouseLeave={e => e.currentTarget.style.background = css.surface}
                >
                  Explore Learning Dashboard
                </button>
              </div>
            </section>

            {/* Community Numbers */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, textAlign: 'center' }}>
              {[
                { count: '3', label: 'Active Learners', desc: 'Undergoing 1-on-1 reviews' },
                { count: '7', label: 'Resumes Audited', desc: 'ATS optimized templates' },
                { count: '4', label: 'Projects Evaluated', desc: 'Live Fabric lakehouses' },
                { count: '40+', label: 'Technical Guides', desc: 'Deep architectural blogs' }
              ].map((stat, idx) => (
                <div key={idx} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 900, color: css.accent, margin: '0 0 4px' }}>{stat.count}</h3>
                  <strong style={{ fontSize: 13, display: 'block', marginBottom: 2 }}>{stat.label}</strong>
                  <span style={{ fontSize: 11, color: css.muted }}>{stat.desc}</span>
                </div>
              ))}
            </section>

            {/* Promise Philosophy Section */}
            <section style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                <Heart size={28} color="#ef4444" style={{ alignSelf: 'center' }} />
                <h3 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)', fontWeight: 750, margin: 0, letterSpacing: '-0.01em' }}>My Promise to the Community</h3>
                <p style={{ fontSize: 15, fontStyle: 'italic', color: css.muted, lineHeight: 1.6, margin: 0 }}>
                  "I won't promise you a job. What I can promise is honest guidance, practical learning, real-world projects, resume reviews, interview preparation, and continuous support. If you commit to learning consistently, I'll commit to helping you grow."
                </p>
                <div style={{ height: 1, background: css.border, margin: '10px 0' }} />
                <p style={{ fontSize: 12, color: css.muted, margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>
                  — DATTA SABLE, DATA PLATFORM & BI ARCHITECT
                </p>
              </div>
            </section>

            {/* Meet Your Mentor Section */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 24, padding: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: 60, background: css.inputBg, border: `2px solid ${css.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ fontSize: 24, fontWeight: 900 }}>DS</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>Datta Sable</h3>
                  <span style={{ fontSize: 13, color: css.accent, fontWeight: 700 }}>Data Platform & BI Architect</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['Microsoft Certified', 'Fabric Specialist', 'Azure Solutions Architect'].map(tag => (
                    <span key={tag} style={{ fontSize: 10.5, padding: '3px 8px', background: `${css.accent}12`, color: css.accent, borderRadius: 6, fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 850, margin: 0 }}>Meet Your Mentor</h3>
                <p style={{ fontSize: 14.5, color: css.muted, lineHeight: 1.6, margin: 0 }}>
                  Hi, I'm Datta Sable. I've spent years helping organizations design modern data platforms using Azure and Microsoft Fabric. Through this initiative, I want to help professionals build practical skills, confidence, and strong portfolios — completely free.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: 13 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Award size={16} color={css.accent} style={{ flexShrink: 0 }} />
                    <span>Microsoft Certified Trainer</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Code size={16} color={css.accent} style={{ flexShrink: 0 }} />
                    <span>Fabric & PySpark Orchestration Expert</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <BookOpen size={16} color={css.accent} style={{ flexShrink: 0 }} />
                    <span>40+ Published In-depth Technical Guides</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Heart size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span>100% Genuinely Free Direct Mentorship</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Articles Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Featured Technical Articles</h2>
                <p style={{ fontSize: 14, color: css.muted, margin: 0 }}>Reinforce your learning with in-depth platform architectural roadmaps</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                {[
                  { title: 'Microsoft Fabric Architecture Explained', desc: 'A deep dive into OneLake storage, lakehouse architecture, and compute engine abstraction.', url: '/blog/posts/microsoft-fabric-architecture-explained' },
                  { title: 'DP-600 vs DP-700 Certifications', desc: 'Compare the Fabric Analytics Engineer and Microsoft Fabric Solution Architect exams.', url: '/blog/posts/dp-600-vs-dp-700-certifications' },
                  { title: 'Microsoft Fabric Certification Roadmap', desc: 'Step-by-step guidance on schedules, modules, practice tests, and voucher preparation.', url: '/blog/posts/microsoft-fabric-certification-roadmap' },
                  { title: 'Azure Data Engineering Roadmap', desc: 'From relational databases to Synapse pipelines, Spark scripting, and Delta lakehouses.', url: '/blog/posts/azure-data-engineering-roadmap' }
                ].map((art, i) => (
                  <Link href={art.url} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', transition: 'border-color 0.2s' }}
                         onMouseEnter={e => e.currentTarget.style.borderColor = css.accent}
                         onMouseLeave={e => e.currentTarget.style.borderColor = css.border}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: css.accent }}>GUIDE {i+1}</span>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>{art.title}</h4>
                      <p style={{ fontSize: 12.5, color: css.muted, lineHeight: 1.4, margin: 0, flex: 1 }}>{art.desc}</p>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: css.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                        Read Guide <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Career Tracks */}
            <section>
              <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 30 }}>Active Career Tracks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                {tracks.map(track => (
                  <div key={track.id} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: `${css.accent}10`, width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: css.accent }}>
                      <Code size={20} style={{ margin: 'auto' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{track.name} Track</h3>
                    <p style={{ fontSize: 13, color: css.muted, lineHeight: 1.5, margin: 0, flex: 1 }}>{track.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: css.accent }}>
                      Active Enrollment <ChevronRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Visual 9-Week Roadmap Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>The 9-Week Career Roadmap</h2>
                <p style={{ fontSize: 14, color: css.muted, margin: 0 }}>A rigorous, structured pathway from database fundamentals to live system interviews</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 24, padding: '30px 20px' }}>
                {[
                  { w: 1, label: 'SQL', desc: 'Queries & Joins' },
                  { w: 2, label: 'Python', desc: 'Scripting Basics' },
                  { w: 3, label: 'ADF', desc: 'Cloud Ingestion' },
                  { w: 4, label: 'PySpark', desc: 'Data Analytics' },
                  { w: 5, label: 'Databricks', desc: 'Delta Compute' },
                  { w: 6, label: 'Delta Lake', desc: 'Lakehouse Design' },
                  { w: 7, label: 'MS Fabric', desc: 'Orchestration' },
                  { w: 8, label: 'GitHub', desc: 'Project Delivery' },
                  { w: 9, label: 'Interview', desc: 'Mock Prep' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 16, padding: 14, width: 100, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: css.accent }}>WEEK {item.w}</span>
                      <strong style={{ fontSize: 13.5, display: 'block' }}>{item.label}</strong>
                      <span style={{ fontSize: 9.5, color: css.muted, whiteSpace: 'nowrap' }}>{item.desc}</span>
                    </div>
                    {idx < 8 && <ChevronRight size={16} color={css.border} />}
                  </div>
                ))}
              </div>
            </section>

            {/* Community Projects Showcase */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Community Projects Showcase</h2>
                <p style={{ fontSize: 14, color: css.muted, margin: 0 }}>Industry-standard open-source templates designed to showcase enterprise skills</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { name: 'Healthcare Analytics Pipeline', tech: 'Fabric, Medallion Architecture, Spark' },
                  { name: 'E-Commerce Retail ETL', tech: 'ADF, SQL Server, Databricks, Delta' },
                  { name: 'Fabric Lakehouse Orchestration', tech: 'OneLake, Notebooks, Pipeline Triggers' },
                  { name: 'Serverless ADF ELT Hub', tech: 'Synapse, Blob Storage, KeyVault, SQL' },
                  { name: 'Enterprise Power BI Dashboard', tech: 'DAX, Star Schema, Gateway scheduling' }
                ].map((proj, idx) => (
                  <div key={idx} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: `${css.accent}08`, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: css.accent, fontWeight: 800, fontSize: 13 }}>
                      0{idx+1}
                    </div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 800, margin: 0 }}>{proj.name}</h4>
                    <span style={{ fontSize: 11, color: css.muted }}>{proj.tech}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Comeback Program */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '4px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: 12, color: '#f59e0b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Signature Program
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Career Comeback Initiative</h2>
                <p style={{ fontSize: 14.5, color: css.muted, lineHeight: 1.6, margin: 0 }}>
                  Returning to technology after a break is incredibly challenging. Recruiters flag gaps, and technologies evolve. We provide dedicated paths for returning mothers, health recovery breaks, and personal gap periods.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'ATS Optimization specifically customized for career gaps.',
                    'Practical, hands-on portfolio projects to bridge technical confidence.',
                    'Personalized milestones with flexible weekly hours.',
                    'Genuinely free — no subscriptions or paid up-sells.'
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, fontSize: 13.5 }}>
                      <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 30 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Success Spotlight</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ background: css.inputBg, width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                      SR
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Sandhyarani</h4>
                      <span style={{ fontSize: 11, color: css.muted }}>Career Comeback Journey</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13.5, color: css.muted, fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                    "Currently preparing to return to Azure Data Engineering after a career break through the mentorship program."
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Maternity Returnee', 'Fabric Lakehouse', 'Active Learner'].map(t => (
                      <span key={t} style={{ fontSize: 10, padding: '3px 8px', background: css.inputBg, borderRadius: 6, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Build in Public & Challenges Section */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {/* Build in public */}
              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, borderBottom: `1px solid ${css.border}`, paddingBottom: 8, marginBottom: 12 }}>
                  🔧 What's New (Build in Public)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { date: 'Jun 28', desc: 'Released Azure Data Engineering Study Roadmap' },
                    { date: 'Jun 26', desc: 'Added Fabric OneLake ingestion challenge checklist' },
                    { date: 'Jun 24', desc: 'Uploaded DP-600 & DP-700 mock question pools' },
                    { date: 'Jun 20', desc: 'Integrated ATS Resume Optimization template file' }
                  ].map((log, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
                      <span style={{ fontWeight: 700, color: css.accent, whiteSpace: 'nowrap' }}>{log.date}</span>
                      <span style={{ color: css.muted }}>{log.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Challenge */}
              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, borderBottom: `1px solid ${css.border}`, paddingBottom: 8, marginBottom: 12 }}>
                  ⚡ Live Weekly Challenges
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { week: 'Week 1', title: 'Write SQL query with analytic window functions over transactions.' },
                    { week: 'Week 2', title: 'Build a Python script that parses dirty logs and formats CSV.' },
                    { week: 'Week 3', title: 'Configure ADF trigger pipeline copying files safely to ADLS Gen2.' },
                    { week: 'Week 4', title: 'Create PySpark DataFrame join processing partition logs on local Spark.' }
                  ].map((ch, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, padding: '10px 14px', background: css.inputBg, borderRadius: 10, fontSize: 12.5 }}>
                      <strong style={{ color: css.accent, whiteSpace: 'nowrap' }}>{ch.week}:</strong>
                      <span style={{ color: css.muted }}>{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Who This Is For / Who This Is NOT For Section */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 30 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#10b981' }}>
                  <CheckCircle size={18} /> Who This Is For
                </h3>
                <ul style={{ fontSize: 13.5, color: css.muted, paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, lineHeight: 1.5 }}>
                  <li><strong>Fresh graduates & Career Switchers</strong> who want structured path validation.</li>
                  <li><strong>Professionals returning to Tech</strong> after health, maternity, or personal breaks.</li>
                  <li>Candidates willing to spend <strong>10+ hours a week</strong> on labs and project building.</li>
                  <li>Learners aiming to build a <strong>real technical GitHub portfolio</strong> rather than just certificate collections.</li>
                </ul>
              </div>

              <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 30 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}>
                  <AlertTriangle size={18} /> Who This Is NOT For
                </h3>
                <ul style={{ fontSize: 13.5, color: css.muted, paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, lineHeight: 1.5 }}>
                  <li>Candidates looking for <strong>quick shortcuts or direct answers</strong> without doing the labs.</li>
                  <li>Individuals expecting <strong>guaranteed jobs or paid referrals</strong> (all referrals are earned by merit).</li>
                  <li>Learners who want someone else to write their code or build their projects.</li>
                  <li>Anyone unwilling to commit to consistent practice and active learning.</li>
                </ul>
              </div>
            </section>

            {/* CMS Resources Library */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 850, margin: 0 }}>Resource Library</h2>
                  <p style={{ fontSize: 13, color: css.muted, margin: '2px 0 0' }}>Download free study roadmaps, checklists, and resume templates</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {resources.map(res => (
                  <div key={res.id} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: css.inputBg, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                        {res.category}
                      </span>
                      {res.featured && <span style={{ fontSize: 9.5, color: '#f59e0b', fontWeight: 800 }}>★ FEATURED</span>}
                    </div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 800, margin: 0 }}>{res.title}</h3>
                    <p style={{ fontSize: 12.5, color: css.muted, lineHeight: 1.4, margin: 0, flex: 1 }}>{res.description}</p>
                    <a
                      href={res.downloadUrl}
                      download
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: css.inputBg,
                        borderRadius: 8, color: css.text, textDecoration: 'none', fontSize: 12, fontWeight: 700,
                        transition: 'background 0.2s', justifyContent: 'center'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = css.border}
                      onMouseLeave={e => e.currentTarget.style.background = css.inputBg}
                    >
                      <Download size={13} /> Download Resource
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section style={{ maxWidth: 850, margin: '0 auto', width: '100%' }}>
              <h2 style={{ fontSize: 20, fontWeight: 850, textAlign: 'center', marginBottom: 24 }}>Frequently Asked Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { q: 'Who can apply?', a: 'Fresh graduates, professionals looking to switch careers, students, and especially those returning from maternity or career breaks.' },
                  { q: 'Is it really free?', a: 'Yes. This is not a coaching business or course. It is a community initiative designed to help you prepare for and switch to Data Platform roles.' },
                  { q: 'Do you guarantee jobs or referrals?', a: 'No. The initiative provides structured roadmaps, resume evaluations, and mock feedback. The final results depend on your effort.' },
                  { q: 'Do I need prior coding experience?', a: 'Some basic analytical interest is helpful. If you switch from non-IT, we start with SQL and Python modules to build your foundations.' }
                ].map((item, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 12, overflow: 'hidden' }}>
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        style={{
                          width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', background: 'none', border: 'none', color: css.text,
                          fontWeight: 700, fontSize: 14.5, cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <span>{item.q}</span>
                        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 'auto' }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 20px 16px', fontSize: 13.5, color: css.muted, lineHeight: 1.5 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Newsletter Signup Form */}
            <section style={{ background: `linear-gradient(135deg, ${css.surface}, ${css.inputBg})`, border: `1px solid ${css.border}`, borderRadius: 24, padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 650, margin: '0 auto', width: '100%' }}>
              <h3 style={{ fontSize: 18, fontWeight: 850, margin: 0 }}>Join the Mentorship Newsletter</h3>
              <p style={{ fontSize: 13.5, color: css.muted, margin: 0, lineHeight: 1.5 }}>
                Get weekly Fabric/Azure updates, mock interview questions, ATS resume templates, and challenges directly in your inbox.
              </p>
              {newsletterSubscribed ? (
                <div style={{ padding: '16px', background: 'rgba(16,185,129,0.08)', border: '1px solid #10b981', borderRadius: 12, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '10px auto 0', maxWidth: 450, width: '100%', fontSize: 13.5, fontWeight: 700 }}>
                  <CheckCircle size={16} /> Subscription successful! Welcome to the community.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 10, maxWidth: 450, margin: '10px auto 0', width: '100%' }}>
                  <input
                    type="email" required placeholder="Enter your professional email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, fontSize: 13, outline: 'none' }}
                  />
                  <button type="submit" disabled={newsletterLoading} style={{ padding: '10px 20px', background: css.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: newsletterLoading ? 0.7 : 1 }}>
                    {newsletterLoading ? 'Joining...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </section>

            {/* Signature Heart Statement & Disclaimer */}
            <div style={{ textAlign: 'center', marginTop: 40, borderTop: `1px solid ${css.border}`, paddingTop: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 14.5, fontStyle: 'italic', color: css.muted, maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
                "Everyone deserves an opportunity to grow. Sometimes, all it takes is the right guidance, consistent effort, and someone who believes in your potential."
              </p>
              <span style={{ fontSize: 11, color: css.muted, lineHeight: 1.4 }}>
                © {new Date().getFullYear()} Datta Sable. This initiative is a personal community effort by Datta Sable. It is not affiliated with Microsoft or any employer. All guidance is provided based on my experience and availability.
              </span>
            </div>

          </div>
        )}

        {/* Tab 2: Application Form */}
        {activeTab === 'apply' && (
          <div style={{ maxWidth: 650, margin: '0 auto', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Start Your Career Journey</h2>
            <p style={{ fontSize: 13, color: css.muted, marginBottom: 24 }}>
              Fill in your details to apply for the next active Batch Cohort.
            </p>

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>FULL NAME</label>
                  <input
                    type="text" required placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
                  <input
                    type="email" required placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>LINKEDIN PROFILE URL</label>
                <input
                  type="url" required placeholder="https://linkedin.com/in/username" value={linkedin} onChange={e => setLinkedin(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>YEARS OF EXPERIENCE</label>
                  <select
                    value={experience} onChange={e => setExperience(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                  >
                    <option value="Fresher">Fresher (0 years)</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>TARGET CAREER TRACK</label>
                  <select
                    value={trackId} onChange={e => setTrackId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                  >
                    {tracks.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>TARGET SPECIFIC ROLE</label>
                <input
                  type="text" required placeholder="e.g. Associate Data Engineer" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>WHAT IS YOUR BIGGEST CAREER CHALLENGE?</label>
                <textarea
                  required placeholder="Explain your current bottlenecks, career gaps, or difficulty switching profiles..."
                  value={challenge} onChange={e => setChallenge(e.target.value)} rows={4}
                  style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13, resize: 'none', lineHeight: 1.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6 }}>RESUME PDF UPLOAD (MAX 5MB)</label>
                <input
                  type="file" required accept=".pdf" onChange={e => setResume(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '8px 12px', background: css.inputBg, border: `1px dashed ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '10px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox" checked={isComebackProgram} onChange={e => setIsComebackProgram(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span>I am returning after a career break or maternity gap (opt-in <strong>Comeback Program</strong>).</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox" required checked={agreedGuidelines} onChange={e => setAgreedGuidelines(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', marginTop: 3 }}
                  />
                  <span>I have read the program guidelines and understand this requires consistent learning effort.</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox" required checked={agreedFreePolicy} onChange={e => setAgreedFreePolicy(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', marginTop: 3 }}
                  />
                  <span>I understand this is a free community initiative with no job placement guarantees.</span>
                </label>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  padding: '12px 20px', background: css.accent, color: '#fff', border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Learner Dashboard / Access Portal */}
        {activeTab === 'portal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {!session ? (
              /* Portal Entry Panel */
              <div style={{ maxWidth: 450, margin: '40px auto', background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 30, textAlign: 'center' }}>
                <Lock size={28} color={css.accent} style={{ marginBottom: 14 }} />
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Learner Verification Access</h2>
                <p style={{ fontSize: 13, color: css.muted, marginBottom: 24 }}>
                  Enter your registered email to request a secure one-time verification OTP.
                </p>

                {!otpSent ? (
                  <form onSubmit={handleRequestMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input
                      type="email" required placeholder="your.email@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 13, textAlign: 'center' }}
                    />
                    <button
                      type="submit" disabled={loading}
                      style={{ padding: '10px 20px', background: css.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {loading ? 'Generating Code...' : 'Request Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input
                      type="text" required placeholder="Enter 6-digit Code" value={loginOtp} onChange={e => setLoginOtp(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 10, color: css.text, outline: 'none', fontSize: 14, textAlign: 'center', letterSpacing: '0.2em', fontWeight: 800 }}
                    />
                    <button
                      type="submit" disabled={loading}
                      style={{ padding: '10px 20px', background: css.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                    <button
                      type="button" onClick={() => setOtpSent(false)}
                      style={{ background: 'none', border: 'none', color: css.accent, fontSize: 11, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}
                    >
                      ← Request New Code
                    </button>
                  </form>
                )}

                {/* Dev Helper Block for Local testing */}
                {devHelper && (
                  <div style={{ marginTop: 24, padding: 16, background: 'rgba(245,158,11,0.06)', border: '1px dashed #f59e0b', borderRadius: 10, textAlign: 'left' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', display: 'block', marginBottom: 4 }}>DEV LOCAL VERIFICATION HELPER</span>
                    <span style={{ fontSize: 11, display: 'block', color: css.muted, marginBottom: 8 }}>OTP Code is logged below since you are running locally:</span>
                    <code style={{ fontSize: 14, fontWeight: 800, display: 'block', background: css.inputBg, padding: 6, borderRadius: 6, textAlign: 'center', margin: '4px 0' }}>{devHelper.otp}</code>
                    <button
                      onClick={() => setLoginOtp(devHelper.otp)}
                      style={{ width: '100%', padding: '6px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
                    >
                      Autofill Code ⚡
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Active Dashboard Session */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {/* Header Profile Summary */}
                <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, background: css.inputBg, padding: '4px 10px', borderRadius: 8, color: css.accent }}>
                      COHORT: {session.cohort?.name || 'Awaiting Cohort Assignment'}
                    </span>
                    <h2 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 2px' }}>Welcome back, {session.fullName}!</h2>
                    <span style={{ fontSize: 13, color: css.muted }}>Registered Track: <strong>{session.track?.name || 'Generic'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setSession(null)}
                      style={{ padding: '8px 16px', background: css.inputBg, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Pipeline visual stepper */}
                <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                    Your Pipeline Progress
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    {[
                      'Applied', 'Resume Reviewed', 'Learning', 'Project Completed', 'Mock Interview', 'Interview Scheduled', 'Offer Received', 'Placed'
                    ].map((step, idx) => {
                      const active = isAppliedStatusActive(step);
                      return (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: active ? '#10b981' : css.border, color: '#fff', fontSize: 11, fontWeight: 800
                            }}>
                              {idx + 1}
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? css.text : css.muted }}>{step}</span>
                          </div>
                          {idx < 7 && <ChevronRight size={14} color={css.border} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Main Grid: Checklist & private timeline logs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: 24, alignItems: 'start' }}>
                  
                  {/* Left Column: Normalized Weekly Progress Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${css.border}`, paddingBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Learning Modules</h3>
                        <span style={{ fontSize: 12, color: css.muted }}>Track your weekly milestones</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: css.accent }}>
                        {getProgressPercentage()}% Complete
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {session.progress.map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: css.inputBg, borderRadius: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input
                              type="checkbox" checked={p.completed} readOnly
                              style={{ width: 18, height: 18, cursor: 'not-allowed' }}
                            />
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: p.completed ? css.text : css.muted }}>
                              Week {p.week}: {p.moduleName}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: p.completed ? '#10b981' : css.muted }}>
                            {p.completed ? 'COMPLETED' : 'PENDING REVIEW'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Weekly Challenge Submitter */}
                    <div style={{ borderTop: `1px solid ${css.border}`, paddingTop: 18, marginTop: 10 }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Submit Weekly Challenge Project</h4>
                      <p style={{ fontSize: 12, color: css.muted, marginBottom: 12 }}>Paste your GitHub repository link below to submit your week's project for review.</p>
                      <form onSubmit={handleSubmitChallenge} style={{ display: 'flex', gap: 10 }}>
                        <input
                          type="url" required placeholder="https://github.com/username/project-repo"
                          value={weeklyChallengeLink} onChange={e => setWeeklyChallengeLink(e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', background: css.inputBg, border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12.5 }}
                        />
                        <button type="submit" style={{ padding: '8px 16px', background: css.accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Timeline Event Logs & Private Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    {/* Private Notes Panel */}
                    <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, borderBottom: `1px solid ${css.border}`, paddingBottom: 10, marginBottom: 12 }}>
                        Private Mentor Notes
                      </h3>
                      {session.mentorNotes ? (
                        <p style={{ fontSize: 13.5, color: css.muted, lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {session.mentorNotes}
                        </p>
                      ) : (
                        <p style={{ fontSize: 12.5, color: css.muted, fontStyle: 'italic', margin: 0 }}>
                          Datta has not left any notes yet. Complete some modules or submit your resume to trigger reviews!
                        </p>
                      )}
                    </div>

                    {/* Feedback Timeline */}
                    <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: 24 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, borderBottom: `1px solid ${css.border}`, paddingBottom: 10, marginBottom: 12 }}>
                        Feedback Journey
                      </h3>
                      {session.feedbackTimeline && session.feedbackTimeline.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {session.feedbackTimeline.map(log => (
                            <div key={log.id} style={{ borderLeft: `2px solid ${css.accent}`, paddingLeft: 12 }}>
                              <span style={{ fontSize: 10.5, color: css.muted, fontWeight: 700 }}>
                                {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <p style={{ fontSize: 13, margin: '2px 0 0', lineHeight: 1.4 }}>
                                {log.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 12.5, color: css.muted, fontStyle: 'italic', margin: 0 }}>
                          No feedback timeline events recorded yet.
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
