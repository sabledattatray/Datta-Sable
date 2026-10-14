'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import {
  ExternalLink,
  GitBranch,
  X,
  ChevronRight,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  ArrowRight,
  Database,
  BarChart3,
  TableProperties,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Send,
  Download,
} from 'lucide-react';

import Crosshair from '@/components/Crosshair';
import {
  featuredProjects,
  projects as staticProjects,
  services,
  processSteps,
  FeaturedProject,
  ProjectData,
} from './data';

const categoryTabs = ['All', 'Power BI', 'Excel & MIS', 'SQL & Data', 'Automation', 'Analysis'];

function PortfolioContent() {
  const searchParams = useSearchParams();

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectList, setProjectList] = useState<ProjectData[]>(staticProjects);

  // Modal inspection states
  const [selectedFeatured, setSelectedFeatured] = useState<FeaturedProject | null>(null);
  const [selectedDirectoryProject, setSelectedDirectoryProject] = useState<ProjectData | null>(null);

  // Contact form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'Power BI Executive Dashboards & DAX Modeling',
    timeline: 'Within 2-4 Weeks',
    message: '',
    honeypot: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Sync category from URL parameter on initial load
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      // Normalize aliases like Dashboard -> Power BI, Web -> All
      if (cat === 'Dashboard') setActiveCategory('Power BI');
      else if (cat === 'Excel' || cat === 'MIS') setActiveCategory('Excel & MIS');
      else if (cat === 'Data' || cat === 'SQL') setActiveCategory('SQL & Data');
      else if (categoryTabs.includes(cat)) setActiveCategory(cat);
    }
  }, [searchParams]);

  // Handle category switch
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (cat === 'All') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', cat);
      }
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  // Pre-fill enquiry service and scroll to contact section
  const handleSelectServiceForEnquiry = (serviceName: string) => {
    setForm(prev => ({
      ...prev,
      service: serviceName,
      message: prev.message || `Hello Datta, I am interested in discussing your ${serviceName} solutions for our reporting workflow.`,
    }));
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter project directory
  const filteredDirectoryProjects = useMemo(() => {
    return projectList.filter(proj => {
      const matchesCategory =
        activeCategory === 'All' ||
        proj.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Power BI' && (proj.category === 'Dashboard' || proj.tools.includes('Power BI'))) ||
        (activeCategory === 'Excel & MIS' && (proj.category === 'Report' || proj.tools.includes('Excel'))) ||
        (activeCategory === 'SQL & Data' && (proj.category === 'Big Data BI' || proj.tools.includes('SQL')));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.desc.toLowerCase().includes(q) ||
        proj.tools.some(t => t.toLowerCase().includes(q)) ||
        proj.problem.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [projectList, activeCategory, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projectList.length };
    categoryTabs.forEach(tab => {
      if (tab === 'All') return;
      counts[tab] = projectList.filter(p => {
        if (tab === 'Power BI') return p.category === 'Dashboard' || p.category === 'Power BI' || p.tools.includes('Power BI');
        if (tab === 'Excel & MIS') return p.category === 'Excel & MIS' || p.category === 'Report' || p.tools.includes('Excel');
        if (tab === 'SQL & Data') return p.category === 'SQL & Data' || p.category === 'Big Data BI' || p.tools.includes('SQL');
        return p.category.toLowerCase().includes(tab.toLowerCase());
      }).length;
    });
    return counts;
  }, [projectList]);

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.name || !form.email || !form.message) {
      setFormErrorMessage('Please provide your name, valid email address, and project requirements.');
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');
    setFormErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `[Portfolio Enquiry] ${form.service} (${form.timeline})`,
          message: `Service Required: ${form.service}\nDesired Timeline: ${form.timeline}\n\nClient Requirements:\n${form.message}`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error submitting enquiry. Please try again.');
      }

      setFormStatus('success');
      setForm({
        name: '',
        email: '',
        service: 'Power BI Executive Dashboards & DAX Modeling',
        timeline: 'Within 2-4 Weeks',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setFormStatus('error');
      setFormErrorMessage(err.message || 'Submission failed. You can also email me directly at sabledattatray@gmail.com');
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <main className="boxed-wrapper" style={{ position: 'relative', marginBottom: '60px' }}>
        <Crosshair position="tl" />

        {/* ── 1. HERO SECTION ── */}
        <section
          className="section"
          style={{
            paddingTop: 'clamp(7.5rem, 11vw, 9.5rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="portfolio-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ maxWidth: '920px' }}
            >
              {/* Availability & Provenance Status Strip */}
              <div
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(201, 243, 29, 0.08)',
                  border: '1px solid rgba(201, 243, 29, 0.25)',
                  fontSize: '0.82rem',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="mono font-semibold" style={{ color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  AVAILABLE FOR MIS &amp; BI CONSULTING / FULL-TIME ROLES
                </span>
                <span style={{ color: 'var(--muted)', opacity: 0.5 }}>|</span>
                <span style={{ color: 'var(--muted)' }}>Mumbai, India (Open to Remote)</span>
              </div>

              {/* Main H1 */}
              <h1
                id="portfolio-heading"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                MIS Reporting &amp; Power BI Dashboards{' '}
                <span className="hero-title" style={{ display: 'inline' }}>
                  That Turn Complex Business Data Into Clear Decisions
                </span>
              </h1>

              {/* Subtitle / Positioning Statement */}
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 2vw, 1.22rem)',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  maxWidth: '780px',
                }}
              >
                10+ years of BFSI and risk portfolio experience. Delivering decision-ready Power BI cockpits,
                automated Advanced Excel management packs, and audited SQL models with 100% mathematical reconciliation.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <a
                  href="#flagship-projects"
                  className="btn-primary inline-flex items-center gap-2"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    borderRadius: '6px',
                  }}
                >
                  <span>Explore 3 Flagship Projects</span>
                  <ArrowRight size={17} />
                </a>

                <a
                  href="/Dattatray_Sable_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '0.92rem',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    borderColor: 'var(--border)',
                  }}
                >
                  <Download size={16} />
                  <span>Download Résumé (PDF)</span>
                </a>

                <a
                  href="#contact-section"
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '0.85rem 1.25rem',
                    fontSize: '0.92rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <Mail size={16} />
                  <span>Request a Solution</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div>
                  <div className="mono font-bold text-lg" style={{ color: 'var(--accent)' }}>10+ Years</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>BFSI &amp; Risk Portfolio MIS</div>
                </div>
                <div>
                  <div className="mono font-bold text-lg" style={{ color: 'var(--text)' }}>3 Demonstrable</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Interactive BI Systems</div>
                </div>
                <div>
                  <div className="mono font-bold text-lg" style={{ color: 'var(--accent)' }}>0.00% Variance</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Ledger Reconciliation Standard</div>
                </div>
                <div>
                  <div className="mono font-bold text-lg" style={{ color: 'var(--text)' }}>100% Truthful</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Transparent Data Provenance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. TRUST & CAPABILITIES STRIP (PRD Part 3.2) ── */}
        <section
          style={{
            background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
            padding: '1.25rem 0',
          }}
          aria-label="Core Capabilities"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="mono text-xs font-semibold" style={{ color: 'var(--muted)', letterSpacing: '0.1em' }}>
                CORE ARCHITECTURAL TOOLS //
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: 'Advanced Excel', detail: 'Power Query & Reconciliation' },
                  { name: 'Power BI & DAX', detail: 'MTD/LMTD Time Intelligence' },
                  { name: 'SQL Server (SSMS)', detail: 'CTEs, Staging & Profiling' },
                  { name: 'Star Schema', detail: 'Dimensional Data Modeling' },
                  { name: 'Delinquency MIS', detail: 'Bucket Aging & Roll-Rates' },
                  { name: 'Process Automation', detail: 'Zero Copy-Paste Routines' },
                ].map((cap, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{cap.name}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>({cap.detail})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. THE THREE FLAGSHIP DEMONSTRABLE PROJECTS (User's Strongest Recommendation) ── */}
        <section
          id="flagship-projects"
          className="section"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="flagship-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            {/* Section Header */}
            <div style={{ marginBottom: '3.5rem', maxWidth: '850px' }}>
              <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>
                DEMONSTRABLE PROOF // THREE FLAGSHIP IMPLEMENTATIONS
              </div>
              <h2
                id="flagship-heading"
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Prioritizing Demonstrable Depth Over Thin Project Cards
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Rather than an overwhelming catalog of brief summaries, the following 3 flagship case studies prove
                end-to-end data modeling, business problem-solving, and reproducible metrics with interactive demos you can launch and test right now.
              </p>
            </div>

            {/* The 3 Deep Case Studies Grid */}
            <div className="flex flex-col gap-14">
              {featuredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    background: 'var(--surface)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Visual & Evidence Column (5 cols) */}
                    <div
                      className="lg:col-span-5 relative flex flex-col justify-between"
                      style={{
                        background: 'var(--surface2)',
                        borderRight: '1px solid var(--border)',
                        minHeight: '340px',
                      }}
                    >
                      <div className="relative w-full" style={{ height: '320px', overflow: 'hidden' }}>
                        <Image
                          src={project.image}
                          alt={`${project.title} dashboard screenshot`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          style={{ objectFit: 'cover' }}
                          priority={index === 0}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, var(--surface2) 0%, transparent 60%)',
                          }}
                        />
                        {/* Status Label on image */}
                        <div style={{ position: 'absolute', top: 16, left: 16 }}>
                          <span
                            className="mono text-xs px-2.5 py-1 rounded font-bold"
                            style={{
                              background: 'var(--bg)',
                              color: project.color,
                              border: `1px solid ${project.color}55`,
                            }}
                          >
                            {project.statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Screenshot Caption / Proof Note */}
                      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2 text-xs mono" style={{ color: 'var(--muted)' }}>
                          <Info size={13} style={{ color: project.color }} />
                          <span>DATA PROVENANCE:</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {project.provenanceLabel}
                        </p>
                      </div>
                    </div>

                    {/* Content & Architectural Details Column (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8">
                      <div>
                        {/* Meta header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="mono text-xs font-bold" style={{ color: project.color, letterSpacing: '0.08em' }}>
                            PROJECT #{index + 1} // {project.category.toUpperCase()}
                          </span>
                          <span className="text-xs mono" style={{ color: 'var(--muted)' }}>
                            100% AUDITED RECONCILIATION
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3
                          style={{
                            fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                            fontWeight: 700,
                            lineHeight: 1.25,
                            color: 'var(--text)',
                            marginBottom: '0.4rem',
                          }}
                        >
                          {project.title}
                        </h3>
                        <div className="text-sm font-medium mb-4" style={{ color: 'var(--muted)' }}>
                          {project.subtitle}
                        </div>

                        {/* Plain Language Business Question */}
                        <div
                          style={{
                            background: 'var(--surface2)',
                            borderLeft: `3px solid ${project.color}`,
                            padding: '1rem',
                            borderRadius: '0 6px 6px 0',
                            marginBottom: '1.25rem',
                          }}
                        >
                          <div className="mono text-xs font-bold mb-1" style={{ color: project.color, letterSpacing: '0.05em' }}>
                            BUSINESS QUESTION ANSWERED:
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                            &ldquo;{project.businessQuestion}&rdquo;
                          </p>
                        </div>

                        {/* Tools actually used */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.tools.map(tool => (
                            <span
                              key={tool}
                              className="mono text-xs px-2.5 py-1 rounded"
                              style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="mb-6">
                          <div className="text-xs mono font-bold mb-2.5" style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}>
                            CORE DELIVERABLES &amp; MODELS INCLUDED:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {project.deliverables.map((deliv, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text)' }}>
                                <CheckCircle2 size={14} style={{ color: project.color, flexShrink: 0, marginTop: '2px' }} />
                                <span>{deliv}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Finding highlight */}
                        <div
                          className="p-3 rounded mb-6 text-xs leading-relaxed"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px dashed var(--border)',
                            color: 'var(--muted)',
                          }}
                        >
                          <strong style={{ color: 'var(--text)' }}>Verified Analytical Finding: </strong>
                          {project.caseStudy.keyFindings[0]}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div
                        className="flex flex-wrap items-center justify-between gap-3 pt-5"
                        style={{ borderTop: '1px solid var(--border)' }}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
                              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="btn-primary inline-flex items-center gap-2"
                              style={{
                                padding: '0.65rem 1.25rem',
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                borderRadius: '4px',
                              }}
                            >
                              <ExternalLink size={14} />
                              <span>{project.liveUrlLabel}</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedFeatured(project)}
                            className="btn-outline inline-flex items-center gap-2"
                            style={{
                              padding: '0.65rem 1.25rem',
                              fontSize: '0.86rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              background: 'var(--surface)',
                              color: 'var(--text)',
                            }}
                          >
                            <FileText size={14} />
                            <span>Read Full Case Study</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectServiceForEnquiry(project.title)}
                          className="mono text-xs flex items-center gap-1"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: project.color,
                            cursor: 'pointer',
                            padding: '4px 0',
                            textDecoration: 'underline',
                          }}
                        >
                          <span>Request Similar Architecture</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. SECONDARY PROJECT EXPLORER & CATALOG (PRD Part 3.4) ── */}
        <section
          className="section"
          style={{
            paddingTop: 'clamp(4rem, 6vw, 5rem)',
            paddingBottom: 'clamp(4rem, 6vw, 5rem)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="explorer-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>
                  PROJECT ARCHIVE // SPECIALIZED CATALOG
                </div>
                <h2
                  id="explorer-heading"
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Secondary Case Studies &amp; Prototypes
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '620px' }}>
                  Explore additional technical implementations, OLAP benchmarks, and operational reporting models.
                  Every entry clearly notes its data provenance and live demo availability.
                </p>
              </div>

              {/* Accessible Search Input */}
              <div className="w-full md:w-80">
                <label htmlFor="project-search" className="sr-only">
                  Search projects by title, tool, or keyword
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
                  />
                  <input
                    id="project-search"
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by tool, keyword, or domain..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem 0.65rem 2.25rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {categoryTabs.map(cat => {
                const isSelected = activeCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded transition-all"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: isSelected ? 'var(--accent)' : 'var(--tag-bg)',
                      color: isSelected ? 'var(--btn-primary-text)' : 'var(--muted)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      className="mono"
                      style={{
                        fontSize: '10px',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: isSelected ? 'rgba(0,0,0,0.2)' : 'var(--surface)',
                        color: isSelected ? 'var(--btn-primary-text)' : 'var(--accent)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-header counter */}
            <div
              className="flex items-center justify-between text-xs mono pb-3 mb-6"
              style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              <div className="flex items-center gap-2">
                <Layers size={13} style={{ color: 'var(--accent)' }} />
                <span>SHOWING</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{filteredDirectoryProjects.length}</span>
                <span>PROJECTS</span>
                <span>// CATEGORY: {activeCategory.toUpperCase()}</span>
              </div>
              {(activeCategory !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  [Reset All Filters]
                </button>
              )}
            </div>

            {/* Directory Cards Grid */}
            {filteredDirectoryProjects.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--surface2)',
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                }}
              >
                <p style={{ color: 'var(--muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  No matching projects found for category &ldquo;{activeCategory}&rdquo; and query &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="btn-outline"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', cursor: 'pointer' }}
                >
                  Reset Search &amp; Category Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDirectoryProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="card group flex flex-col justify-between"
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                    }}
                    onClick={() => setSelectedDirectoryProject(proj)}
                  >
                    <div>
                      {/* Thumbnail */}
                      <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                        <Image
                          src={proj.image}
                          alt={proj.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, var(--surface) 0%, transparent 60%)',
                          }}
                        />
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <span
                            className="mono text-xs px-2 py-0.5 rounded font-bold"
                            style={{
                              background: 'var(--bg)',
                              color: proj.color || 'var(--accent)',
                              border: `1px solid ${proj.color || 'var(--accent)'}44`,
                            }}
                          >
                            {proj.statusBadge || proj.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
                        <h3
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: 'var(--text)',
                            marginBottom: '0.5rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {proj.title}
                        </h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {proj.desc}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {proj.tools.slice(0, 3).map(t => (
                            <span
                              key={t}
                              className="mono text-xs px-2 py-0.5 rounded"
                              style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}
                            >
                              {t}
                            </span>
                          ))}
                          {proj.tools.length > 3 && (
                            <span
                              className="mono text-xs px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--tag-bg)', color: 'var(--muted)' }}
                            >
                              +{proj.tools.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div
                      className="flex items-center justify-between p-3.5"
                      style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}
                    >
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDirectoryProject(proj);
                        }}
                        className="mono text-xs flex items-center gap-1 font-semibold"
                        style={{ background: 'none', border: 'none', color: proj.color || 'var(--accent)', cursor: 'pointer', padding: 0 }}
                      >
                        <span>Case Details</span>
                        <ChevronRight size={14} />
                      </button>

                      {proj.live && proj.live !== '#' && (
                        <a
                          href={proj.live}
                          target={proj.live.startsWith('http') ? '_blank' : undefined}
                          rel={proj.live.startsWith('http') ? 'noopener noreferrer' : undefined}
                          onClick={e => e.stopPropagation()}
                          className="mono text-xs flex items-center gap-1 px-2.5 py-1 rounded"
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={11} />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 5. "HOW I APPROACH PROJECTS" / PROCESS (Replaces fake testimonials - PRD Part 3.7) ── */}
        <section
          className="section"
          style={{
            paddingTop: 'clamp(4rem, 6vw, 5rem)',
            paddingBottom: 'clamp(4rem, 6vw, 5rem)',
            background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="process-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
              <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>
                ENGINEERING RIGOR // REPRODUCIBLE METHODOLOGY
              </div>
              <h2
                id="process-heading"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                How I Approach Reporting &amp; BI Projects
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: 1.7, marginTop: '0.5rem' }}>
                I avoid fragile, one-off spreadsheets and decorative mockups. Every engagement follows a disciplined
                five-phase pipeline designed to guarantee data reconciliation, low query latency, and clear operational ownership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {processSteps.map(step => (
                <div
                  key={step.step}
                  className="card p-5 flex flex-col justify-between"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div className="mono text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
                      {step.step}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text)' }}>
                      {step.title}
                    </h3>
                    <div className="text-xs mono font-semibold mb-3" style={{ color: 'var(--accent2)' }}>
                      {step.focus}
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {step.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: '1px dashed var(--border)',
                      paddingTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span className="mono font-bold" style={{ color: 'var(--text)' }}>Deliverable: </span>
                    {step.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. SERVICES & DELIVERABLES (PRD Part 3.6) ── */}
        <section
          className="section"
          style={{
            paddingTop: 'clamp(4rem, 6vw, 5rem)',
            paddingBottom: 'clamp(4rem, 6vw, 5rem)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="services-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
              <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>
                CLIENT &amp; TEAM SERVICES // WHAT YOU RECEIVE
              </div>
              <h2
                id="services-heading"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Concrete Deliverables for Business Teams
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: 1.7, marginTop: '0.5rem' }}>
                Whether you need a dedicated Power BI dashboard build, an automated Excel close workbook, or an audit of
                unreconciled data, here are the standardized deliverables and collaboration parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(srv => (
                <div
                  key={srv.id}
                  className="card p-6 flex flex-col justify-between"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                      {srv.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {srv.tagline}
                    </p>

                    <div className="mb-4">
                      <div className="mono text-xs font-bold mb-2" style={{ color: 'var(--accent)', letterSpacing: '0.05em' }}>
                        TANGIBLE DELIVERABLES:
                      </div>
                      <ul className="space-y-1.5">
                        {srv.deliverables.map((deliv, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text)' }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>•</span>
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="p-3 rounded mb-4 text-xs"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      <strong style={{ color: 'var(--text)' }}>Typical Inputs: </strong>
                      {srv.typicalInputs.join('; ')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectServiceForEnquiry(srv.title)}
                    className="btn-outline w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                    style={{ borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <span>Discuss This Solution</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. ABOUT & PROFESSIONAL CREDIBILITY (PRD Part 3.8) ── */}
        <section
          className="section"
          style={{
            paddingTop: 'clamp(4rem, 6vw, 5rem)',
            paddingBottom: 'clamp(4rem, 6vw, 5rem)',
            background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
          }}
          aria-labelledby="about-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Profile Image & Quick Facts (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div
                  className="relative w-44 h-44 rounded-2xl overflow-hidden mb-4 shadow-xl"
                  style={{ border: '2px solid var(--border)' }}
                >
                  <Image
                    src="/images/datta.webp"
                    alt="Datta Sable - MIS & Business Intelligence Manager"
                    fill
                    sizes="176px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                  Datta Sable
                </h3>
                <div className="mono text-xs font-semibold mb-3" style={{ color: 'var(--accent)' }}>
                  Business Intelligence &amp; MIS Manager
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '300px', lineHeight: 1.6 }}>
                  Mumbai, India • B.Sc. (Dr. BAMU) • 10+ Years BFSI &amp; Risk Portfolio Management
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <a
                    href="/Dattatray_Sable_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 font-semibold"
                    style={{ background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--btn-primary-text)', textDecoration: 'none' }}
                  >
                    <Download size={13} />
                    <span>Download CV (PDF)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dattasable/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-xs px-3 py-1.5 rounded"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="https://github.com/sabledattatray"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-xs px-3 py-1.5 rounded"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Experience & Verified Track Record (8 cols) */}
              <div className="lg:col-span-8">
                <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>
                  CAREER &amp; CREDENTIALS // VERIFIED WORK HISTORY
                </div>
                <h2
                  id="about-heading"
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  Built on 10+ Years of Enterprise Data Operations
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  I bridge the gap between technical data engineering and executive business decision-making. Having
                  managed risk portfolios, tele-caller teams, and board reporting in high-stakes BFSI environments, I build
                  dashboards that focus strictly on actionable operational truths.
                </p>

                {/* Timeline cards */}
                <div className="space-y-3">
                  {[
                    {
                      role: 'MIS Manager',
                      company: 'DBS Mintek Pvt. Ltd.',
                      period: 'June 2025 – Present',
                      focus: 'Architecting executive dashboards across Power BI, SQL Server, Excel, and SAP. Reduced manual reporting overhead by 40% via automated Power Query and SQL pipelines.',
                    },
                    {
                      role: 'Information System Analyst',
                      company: 'CASCO',
                      period: 'Oct 2023 – May 2025',
                      focus: 'Engineered comprehensive MIS reporting structures and analytics leveraging SQL and Advanced Excel for C-suite operational reviews.',
                    },
                    {
                      role: 'Assistant Manager – MIS & Analytics',
                      company: 'Kissht Finance Ltd.',
                      period: 'Jan 2020 – Sep 2023',
                      focus: 'Oversaw structured MIS for PAN-India credit portfolios (Risk-30 ± Write-off/NPA) and tele-caller performance operations.',
                    },
                    {
                      role: 'Deputy Manager',
                      company: 'HDFC Bank Ltd.',
                      period: 'Aug 2015 – Jan 2020',
                      focus: 'Supervised Credit Card Write-off & NPA portfolios (Risk-120) across the Mumbai region, ensuring 100% audit compliance.',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                          {item.role} <span style={{ color: 'var(--accent)' }}>@ {item.company}</span>
                        </div>
                        <div className="mono text-xs" style={{ color: 'var(--muted)' }}>
                          {item.period}
                        </div>
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.5 }}>
                        {item.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. DIRECT CONVERSION & PROJECT ENQUIRY (PRD Part 3.9) ── */}
        <section
          id="contact-section"
          className="section"
          style={{
            paddingTop: 'clamp(4.5rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4.5rem, 7vw, 6rem)',
          }}
          aria-labelledby="contact-heading"
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Direct Info & What to Expect (5 cols) */}
              <div className="lg:col-span-5">
                <div className="label-tech mb-2" style={{ letterSpacing: '0.2em' }}>
                  MAKE CONTACT // START A CONVERSATION
                </div>
                <h2
                  id="contact-heading"
                  style={{
                    fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                  }}
                >
                  Let&apos;s Build Decision-Ready Reporting For Your Team
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Available for freelance reporting projects, dashboard modernization, and qualified full-time BI / MIS
                  opportunities. Submit your requirements or reach out directly.
                </p>

                {/* Direct Contact Cards */}
                <div className="space-y-3 mb-8">
                  <a
                    href="mailto:sabledattatray@gmail.com"
                    className="card p-3.5 flex items-center gap-3"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none' }}
                  >
                    <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201, 243, 29, 0.1)', color: 'var(--accent)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Direct Email</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>sabledattatray@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="tel:+918010803756"
                    className="card p-3.5 flex items-center gap-3"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none' }}
                  >
                    <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00F0FF' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Phone / WhatsApp</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>+91 80108 03756</div>
                    </div>
                  </a>
                </div>

                {/* "What happens next?" Statement */}
                <div
                  className="p-4 rounded-lg"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                >
                  <div className="mono text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                    <Clock size={14} />
                    <span>WHAT HAPPENS NEXT?</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                    I personally review every submission and respond within <strong>24 business hours</strong> with an initial data feasibility evaluation, timeline estimate, and architectural suggestion.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Enquiry Form (7 cols) */}
              <div
                className="lg:col-span-7 card p-6 md:p-8"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Submit Project Enquiry
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                  Fill in your project requirements below. Messages are submitted directly to the verified site backend.
                </p>

                {formStatus === 'success' ? (
                  <div
                    className="p-6 rounded-lg text-center"
                    style={{ background: 'rgba(201, 243, 29, 0.08)', border: '1px solid var(--accent)' }}
                  >
                    <CheckCircle2 size={40} style={{ color: 'var(--accent)', margin: '0 auto 1rem auto' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                      Enquiry Received!
                    </h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                      Thank you for reaching out. I have received your reporting requirements and will review your scope within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus('idle')}
                      className="btn-outline px-4 py-2 text-xs"
                      style={{ cursor: 'pointer' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate>
                    {/* Honeypot anti-spam field */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        name="honeypot"
                        tabIndex={-1}
                        value={form.honeypot}
                        onChange={e => setForm(prev => ({ ...prev, honeypot: e.target.value }))}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="form-name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                          Your Name <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Ramesh Kulkarni"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="form-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                          Your Email <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="name@company.com"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="form-service" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                          Primary Service Needed
                        </label>
                        <select
                          id="form-service"
                          value={form.service}
                          onChange={e => setForm(prev => ({ ...prev, service: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            fontSize: '0.88rem',
                          }}
                        >
                          <option value="Power BI Executive Dashboards & DAX Modeling">Power BI Executive Dashboards &amp; DAX Modeling</option>
                          <option value="Advanced Excel MIS Reporting Packs">Advanced Excel MIS Reporting Packs</option>
                          <option value="SQL Data Extraction & Quality Validation">SQL Data Extraction &amp; Quality Validation</option>
                          <option value="Portfolio Risk & Delinquency Aging Frameworks">Portfolio Risk &amp; Delinquency Aging Frameworks</option>
                          <option value="Financial Close & Variance Tracking">Financial Close &amp; Variance Tracking</option>
                          <option value="Legacy Report Optimization & Troubleshooting">Legacy Report Optimization &amp; Troubleshooting</option>
                          <option value="Full-Time Employment Opportunity">Full-Time Role Opportunity (MIS/BI)</option>
                          <option value="Other Analytical Solution">Other Analytical Solution</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="form-timeline" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                          Desired Timeline
                        </label>
                        <select
                          id="form-timeline"
                          value={form.timeline}
                          onChange={e => setForm(prev => ({ ...prev, timeline: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            fontSize: '0.88rem',
                          }}
                        >
                          <option value="Immediate (1-2 Weeks)">Immediate (1–2 Weeks)</option>
                          <option value="Within 2-4 Weeks">Within 2–4 Weeks</option>
                          <option value="Flexible / Exploration">Flexible / Exploration</option>
                          <option value="Monthly Ongoing Retainer">Monthly Ongoing Retainer</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="form-message" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                        Project Context &amp; Current Bottlenecks <span style={{ color: 'var(--accent)' }}>*</span>
                      </label>
                      <textarea
                        id="form-message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Describe your data sources (e.g., SQL Server, ERP dumps, disparate Excel sheets), your current reporting pain points, and the desired dashboard deliverable..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                        }}
                      />
                    </div>

                    {formErrorMessage && (
                      <div
                        className="p-3 rounded mb-4 text-xs flex items-center gap-2"
                        style={{ background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', color: '#ff3366' }}
                      >
                        <AlertCircle size={15} />
                        <span>{formErrorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                      style={{
                        borderRadius: '6px',
                        cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: formStatus === 'loading' ? 0.7 : 1,
                      }}
                    >
                      {formStatus === 'loading' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Send Project Enquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <Crosshair position="br" />
      </main>

      {/* ── 9. MODAL: FULL CASE STUDY INSPECTION (PRD Part 4) ── */}
      <AnimatePresence>
        {selectedFeatured && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(0.5rem, 3vw, 2rem)',
              overflowY: 'auto',
            }}
            onClick={() => setSelectedFeatured(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                maxWidth: '920px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedFeatured(null)}
                aria-label="Close case study modal"
                style={{
                  position: 'sticky',
                  top: '16px',
                  float: 'right',
                  marginRight: '16px',
                  zIndex: 20,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              {/* Modal Banner */}
              <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                <Image
                  src={selectedFeatured.image}
                  alt={selectedFeatured.title}
                  fill
                  style={{ objectFit: 'cover', opacity: 0.35 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--surface) 0%, transparent 80%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 20, left: 24, right: 60 }}>
                  <span
                    className="mono text-xs px-2.5 py-0.5 rounded font-bold"
                    style={{
                      background: 'var(--bg)',
                      color: selectedFeatured.color,
                      border: `1px solid ${selectedFeatured.color}55`,
                    }}
                  >
                    {selectedFeatured.statusLabel}
                  </span>
                  <h2
                    id="case-study-title"
                    style={{
                      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginTop: '0.4rem',
                    }}
                  >
                    {selectedFeatured.title}
                  </h2>
                  <div className="mono text-xs" style={{ color: 'var(--muted)' }}>
                    {selectedFeatured.subtitle}
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2rem' }}>
                {/* 1. Executive Summary & Business Question */}
                <div className="mb-6">
                  <div className="mono text-xs font-bold mb-1" style={{ color: selectedFeatured.color }}>
                    PLAIN-ENGLISH BUSINESS DECISION TO SUPPORT:
                  </div>
                  <p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1rem' }}>
                    &ldquo;{selectedFeatured.businessQuestion}&rdquo;
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {selectedFeatured.caseStudy.problemContext}
                  </p>
                </div>

                {/* 2. Dataset Information */}
                <div
                  className="p-4 rounded mb-6"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                >
                  <div className="mono text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                    <Database size={14} />
                    <span>DATASET SPECIFICATIONS &amp; PROVENANCE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="mono font-semibold" style={{ color: 'var(--muted)' }}>Source &amp; Scale: </span>
                      <span style={{ color: 'var(--text)' }}>{selectedFeatured.caseStudy.datasetInfo.rows}</span>
                    </div>
                    <div>
                      <span className="mono font-semibold" style={{ color: 'var(--muted)' }}>Grain: </span>
                      <span style={{ color: 'var(--text)' }}>{selectedFeatured.caseStudy.datasetInfo.grain}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="mono font-semibold" style={{ color: 'var(--muted)' }}>Provenance: </span>
                      <span style={{ color: 'var(--text)' }}>{selectedFeatured.caseStudy.datasetInfo.provenance}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Tools & Exact Architectural Roles */}
                <div className="mb-6">
                  <div className="mono text-xs font-bold mb-2.5" style={{ color: 'var(--accent)' }}>
                    TECHNOLOGY ROLES &amp; ARCHITECTURE
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedFeatured.caseStudy.toolsAndRoles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded text-xs"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                      >
                        <div className="font-bold mb-0.5" style={{ color: 'var(--text)' }}>
                          {item.tool}
                        </div>
                        <div style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{item.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Methodology */}
                <div className="mb-6">
                  <div className="mono text-xs font-bold mb-2" style={{ color: 'var(--accent)' }}>
                    METHODOLOGY &amp; DATA MODELING
                  </div>
                  <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {selectedFeatured.caseStudy.methodology.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span style={{ color: selectedFeatured.color, fontWeight: 700 }}>→</span>
                        <span style={{ lineHeight: 1.6 }}>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. KPI Definitions */}
                <div className="mb-6">
                  <div className="mono text-xs font-bold mb-2.5" style={{ color: 'var(--accent)' }}>
                    KPI DEFINITIONS &amp; MEASURE CALCULATIONS
                  </div>
                  <div className="space-y-2">
                    {selectedFeatured.caseStudy.kpiDefinitions.map((kpi, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded text-xs"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-bold" style={{ color: 'var(--text)' }}>{kpi.name}</span>
                          <span className="mono text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--surface)', color: selectedFeatured.color }}>
                            {kpi.formula}
                          </span>
                        </div>
                        <div style={{ color: 'var(--muted)' }}>{kpi.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Key Reproducible Findings */}
                <div className="mb-6">
                  <div className="mono text-xs font-bold mb-2" style={{ color: 'var(--accent)' }}>
                    VERIFIED ANALYTICAL FINDINGS
                  </div>
                  <ul className="space-y-2 text-xs" style={{ color: 'var(--text)' }}>
                    {selectedFeatured.caseStudy.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded" style={{ background: 'rgba(201, 243, 29, 0.04)', border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                        <span style={{ lineHeight: 1.6 }}>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 7. Limitations & Sensible Next Steps */}
                <div
                  className="p-3.5 rounded mb-6 text-xs"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  <strong style={{ color: 'var(--text)' }}>Model Limitations &amp; Next Steps: </strong>
                  {selectedFeatured.caseStudy.limitationsAndNextSteps}
                </div>

                {/* Modal Footer */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 pt-4"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    {selectedFeatured.liveUrl && (
                      <a
                        href={selectedFeatured.liveUrl}
                        target={selectedFeatured.liveUrl.startsWith('http') ? '_blank' : undefined}
                        rel={selectedFeatured.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
                        style={{ borderRadius: '4px', textDecoration: 'none' }}
                      >
                        <ExternalLink size={13} />
                        <span>Launch Solution</span>
                      </a>
                    )}
                    {selectedFeatured.githubUrl && (
                      <a
                        href={selectedFeatured.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                        style={{ borderRadius: '4px', textDecoration: 'none' }}
                      >
                        <GitBranch size={13} />
                        <span>Specs / Repo</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedFeatured.title;
                      setSelectedFeatured(null);
                      handleSelectServiceForEnquiry(title);
                    }}
                    className="btn-outline px-4 py-2 text-xs font-semibold"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)', cursor: 'pointer' }}
                  >
                    Discuss Similar Implementation →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 10. MODAL: SECONDARY DIRECTORY PROJECT CASE STUDY ── */}
      <AnimatePresence>
        {selectedDirectoryProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(0.5rem, 3vw, 2rem)',
              overflowY: 'auto',
            }}
            onClick={() => setSelectedDirectoryProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dir-project-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                maxWidth: '780px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedDirectoryProject(null)}
                aria-label="Close modal"
                style={{
                  position: 'sticky',
                  top: '16px',
                  float: 'right',
                  marginRight: '16px',
                  zIndex: 20,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <Image
                  src={selectedDirectoryProject.image}
                  alt={selectedDirectoryProject.title}
                  fill
                  style={{ objectFit: 'cover', opacity: 0.35 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--surface) 0%, transparent 80%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 16, left: 24, right: 60 }}>
                  <span
                    className="mono text-xs px-2 py-0.5 rounded font-bold"
                    style={{
                      background: 'var(--bg)',
                      color: selectedDirectoryProject.color || 'var(--accent)',
                      border: `1px solid ${selectedDirectoryProject.color || 'var(--accent)'}44`,
                    }}
                  >
                    {selectedDirectoryProject.statusBadge || selectedDirectoryProject.category}
                  </span>
                  <h2
                    id="dir-project-title"
                    style={{
                      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginTop: '0.4rem',
                    }}
                  >
                    {selectedDirectoryProject.title}
                  </h2>
                </div>
              </div>

              <div style={{ padding: '1.75rem' }}>
                <p style={{ color: 'var(--text)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {selectedDirectoryProject.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div
                    className="p-3.5 rounded text-xs"
                    style={{ background: 'var(--surface2)', borderLeft: '3px solid #ff3366' }}
                  >
                    <div className="mono font-bold mb-1" style={{ color: '#ff3366' }}>
                      THE CHALLENGE:
                    </div>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{selectedDirectoryProject.problem}</p>
                  </div>
                  <div
                    className="p-3.5 rounded text-xs"
                    style={{ background: 'var(--surface2)', borderLeft: '3px solid var(--accent)' }}
                  >
                    <div className="mono font-bold mb-1" style={{ color: 'var(--accent)' }}>
                      THE ARCHITECTURE:
                    </div>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{selectedDirectoryProject.solution}</p>
                  </div>
                </div>

                <div
                  className="p-3 rounded text-xs mb-6"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                >
                  <strong style={{ color: 'var(--text)' }}>What this demonstrates: </strong>
                  <span style={{ color: 'var(--muted)' }}>{selectedDirectoryProject.impact}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedDirectoryProject.tools.map(t => (
                    <span
                      key={t}
                      className="mono text-xs px-2.5 py-1 rounded"
                      style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className="flex flex-wrap items-center justify-between gap-3 pt-4"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    {selectedDirectoryProject.live && selectedDirectoryProject.live !== '#' && (
                      <a
                        href={selectedDirectoryProject.live}
                        target={selectedDirectoryProject.live.startsWith('http') ? '_blank' : undefined}
                        rel={selectedDirectoryProject.live.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
                        style={{ borderRadius: '4px', textDecoration: 'none' }}
                      >
                        <ExternalLink size={13} />
                        <span>Launch Solution</span>
                      </a>
                    )}
                    {selectedDirectoryProject.github && selectedDirectoryProject.github !== '#' && (
                      <a
                        href={selectedDirectoryProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                        style={{ borderRadius: '4px', textDecoration: 'none' }}
                      >
                        <GitBranch size={13} />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedDirectoryProject.title;
                      setSelectedDirectoryProject(null);
                      handleSelectServiceForEnquiry(title);
                    }}
                    className="btn-outline px-3.5 py-2 text-xs"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)', cursor: 'pointer' }}
                  >
                    Enquire About Similar Work →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', minHeight: '100vh' }} />}>
      <PortfolioContent />
    </Suspense>
  );
}
