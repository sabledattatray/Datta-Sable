"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowUpRight,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Cpu,
  FileText,
  Layers,
  Search,
  X,
  Award,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Certificate as CertificateIcon
} from "lucide-react";
import styles from "./Certification.module.css";

interface CertificateItem {
  id: string;
  title: string;
  level: string;
  desc: string;
  topics: string[];
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  pdfFile: string;
  issuer: "Google" | "LinkedIn Learning";
  issuerBadge: string;
  recipient: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  category: "Artificial Intelligence" | "Analytics & Data" | "Marketing & Strategy";
}

const tracks: CertificateItem[] = [
  {
    id: "google-analytics-4",
    title: "Google Analytics 4",
    level: "Official Google Skillshop Accreditation",
    desc: "Mastery of GA4 event architecture, predictive audiences, BigQuery pipelines, and multi-channel attribution.",
    topics: ["GA4", "Attribution", "Event Tracking", "ID: 141072342"],
    icon: BarChart3,
    pdfFile: "/Certificates/Google%20Analytics%20Certifiacte.pdf",
    issuer: "Google",
    issuerBadge: "Google Skillshop",
    recipient: "Datta Sable",
    issueDate: "April 25, 2025",
    expiryDate: "April 25, 2026",
    credentialId: "141072342",
    category: "Analytics & Data",
  },
  {
    id: "generative-ai-digital-marketers",
    title: "Generative AI & LLMs",
    level: "PMI® Registered Provider (PDU #4094)",
    desc: "Enterprise prompt architecture, LLM orchestration, multimodal asset generation, and AI marketing governance.",
    topics: ["1.50 PDUs", "Prompt Chaining", "LLM Workflows", "Automation"],
    icon: Sparkles,
    pdfFile: "/Certificates/CertificateOfCompletion_Generative%20AI%20for%20Digital%20Marketers.pdf",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning & PMI®",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "af4b7c6b7b257aca2ab3a11f844bbc224bba74c8128f72b6fba",
    category: "Artificial Intelligence",
  },
  {
    id: "ai-future-public-sector",
    title: "Public Sector AI & Ethics",
    level: "Civic Technology & Policy Governance",
    desc: "Predictive public governance, automated decision systems, civic infrastructure, and ethical AI compliance.",
    topics: ["Civic Tech", "AI Governance", "Ethics", "Policy"],
    icon: ShieldCheck,
    pdfFile: "/Certificates/CertificateOfCompletion_AI%20and%20the%20Future%20of%20the%20Public%20Sector.pdf",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "f70de76c8f2278e49961a7a3ada42d92f2db705dcd8edcefc802136341e9ee49",
    category: "Artificial Intelligence",
  },
  {
    id: "digital-marketing-tools-campaign",
    title: "Campaign Architecture",
    level: "Omnichannel Acquisition & Analytics",
    desc: "End-to-end tactical campaign construction, ad tracking telemetry, conversion optimization, and ROI benchmarking.",
    topics: ["Campaigns", "Conversion Tracking", "Ad Tech", "ROI"],
    icon: Cpu,
    pdfFile: "/Certificates/CertificateOfCompletion_Digital%20Marketing%20Tools%20Create%20a%20Marketing%20Campaign%20from%20Start%20to%20Finish.pdf",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "26e31bf78d275220bba0168643799c07ecefea199074516f51041bf12596fb15",
    category: "Marketing & Strategy",
  },
  {
    id: "content-strategy-marketers",
    title: "Content Strategy & SEO",
    level: "Search Intent & Organic Growth",
    desc: "Scalable data-backed content architecture, topic authority mapping, editorial systems, and audience retention.",
    topics: ["Topic Authority", "Editorial Ops", "Organic Growth", "KPIs"],
    icon: FileText,
    pdfFile: "/Certificates/CertificateOfCompletion_Content%20Strategy%20for%20Marketers.pdf",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "bb49ba014ee326ff5b9edc36c7c89dec8ad2cc9bb250eb8dd3f6e72a8f227851",
    category: "Marketing & Strategy",
  },
  {
    id: "marketing-on-linkedin",
    title: "LinkedIn B2B Strategy",
    level: "Algorithmic Reach & Demand Gen",
    desc: "Executive personal branding, sponsored media targeting, corporate thought leadership, and B2B pipeline growth.",
    topics: ["B2B Reach", "Algorithmic Distribution", "Thought Leadership"],
    icon: Layers,
    pdfFile: "/Certificates/CertificateOfCompletion_Marketing%20on%20LinkedIn.pdf",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "70ec3f2670dde2f56d9090417e4f04fe2253242e2954a1d7342ff0e06422a4b1",
    category: "Marketing & Strategy",
  },
];

export default function CertificationPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePdfModal, setActivePdfModal] = useState<CertificateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopyId = (id: string, credId: string) => {
    navigator.clipboard.writeText(credId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePdfModal(null);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activePdfModal) {
      setZoomLevel(100);
      setIsFullscreen(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePdfModal]);

  const filteredTracks = tracks.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      item.category === activeCategory ||
      item.issuer === activeCategory;

    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.credentialId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen flex flex-col">
      <Navbar />

      <section className={styles.section} aria-labelledby="certifications-title">
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          
          {/* Top Heading matching StartHere */}
          <div className={styles.heading}>
            <div>
              <span className={styles.eyebrow}>
                <ShieldCheck size={14} /> VERIFIED INDUSTRY CREDENTIALS
              </span>
              <h1 id="certifications-title">
                Official Certifications.<br />
                <span>Verified expertise.</span>
              </h1>
            </div>

            <div className={styles.intro}>
              <p>
                Professional accreditations in Google Analytics 4, Generative AI architecture, public sector governance, and B2B growth systems.
              </p>
              <span>
                06 credentials <i /> Direct view-only vault
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterChips} role="tablist" aria-label="Credential Categories">
              {[
                { id: "All", label: "All Credentials (6)" },
                { id: "Artificial Intelligence", label: "AI & GenAI (2)" },
                { id: "Analytics & Data", label: "Analytics / GA4 (1)" },
                { id: "Marketing & Strategy", label: "Strategy & Marketing (3)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`${styles.chip} ${activeCategory === tab.id ? styles.chipActive : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Search credentials, skills, or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* 2-Column Card Grid exactly matching the snap */}
          <div className={styles.grid}>
            {filteredTracks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setActivePdfModal(item)}
                  className={styles.card}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePdfModal(item);
                    }
                  }}
                  aria-label={`View official certificate: ${item.title}`}
                >
                  {/* Left Column: Visual Orbit, Center Icon, and 2-digit Number */}
                  <div className={styles.visual} aria-hidden="true">
                    <div className={styles.orbit} />
                    <div className={styles.icon}>
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <span className={styles.number}>0{index + 1}</span>
                  </div>

                  {/* Right Column: Level, H2, Description, and Topic Pills */}
                  <div className={styles.body}>
                    <span className={styles.level}>{item.level}</span>
                    <h2>{item.title}</h2>
                    <p>{item.desc}</p>
                    <div className={styles.topics}>
                      {item.topics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  </div>

                  {/* Top-Right Arrow (shifts on hover) */}
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Footnote matching StartHere */}
          <div className={styles.foot}>
            <span>Official records issued to Datta Sable &bull; Cryptographically bound &amp; tamper-proof.</span>
            <a href="/portfolio">
              Explore project portfolio <ArrowUpRight size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* Interactive Protected Fullscreen PDF Viewer Modal (NO DOWNLOAD) */}
      {activePdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActivePdfModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${
              isFullscreen ? "max-w-full h-full rounded-none" : "max-w-5xl max-h-[94vh] rounded-3xl"
            } bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
          >
            {/* Modal Header */}
            <header className="p-3.5 sm:px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface2)] shrink-0 gap-3">
              <div className="flex items-center gap-3 truncate pr-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div className="truncate">
                  <h3 id="certificate-modal-title" className="text-xs sm:text-sm font-extrabold text-[var(--text)] truncate font-display">
                    {activePdfModal.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[var(--muted)] font-mono">
                    <span>{activePdfModal.issuerBadge}</span>
                    <span>&bull;</span>
                    <span className="truncate">ID: {activePdfModal.credentialId}</span>
                  </div>
                </div>
              </div>

              {/* Viewport Toolbar Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(70, prev - 15))}
                    disabled={zoomLevel <= 70}
                    className="p-1 hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="w-10 text-center text-[10px]">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                    disabled={zoomLevel >= 150}
                    className="p-1 hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="p-1 hover:text-[var(--text)] cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)] transition-colors cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-lg bg-[var(--surface)] hover:bg-red-500/20 hover:text-red-400 text-[var(--muted)] border border-[var(--border)] transition-colors cursor-pointer"
                  aria-label="Close certificate viewer"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Document Protection Shield Banner (Download Disabled) */}
            <div className="px-4 py-2 bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] border-b border-[var(--border)] flex items-center justify-between text-[11px] font-mono shrink-0">
              <div className="flex items-center gap-2 text-[var(--accent)] font-semibold truncate">
                <Lock size={14} className="shrink-0" />
                <span className="truncate">Official Certificate Vault &bull; View-Only Protected Mode (Direct Download Disabled)</span>
              </div>
              <span className="text-[10px] text-[var(--muted)] hidden md:inline">
                Issued to: {activePdfModal.recipient}
              </span>
            </div>

            {/* PDF Viewer Body with Right-Click Protection & #toolbar=0 */}
            <div
              className="flex-1 bg-zinc-950 overflow-auto relative min-h-[55vh] flex items-center justify-center p-1 sm:p-3"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                style={{
                  width: `${zoomLevel}%`,
                  height: "100%",
                  transition: "width 0.15s ease-out",
                }}
                className="h-full min-h-[60vh] max-w-full flex items-center justify-center"
              >
                <iframe
                  src={`${activePdfModal.pdfFile}#toolbar=0&navpanes=0&statusbar=0&messages=0&scrollbar=1&view=FitH`}
                  className="w-full h-full min-h-[65vh] border-0 rounded-xl shadow-2xl bg-white"
                  title={`Official Certificate: ${activePdfModal.title}`}
                />
              </div>
            </div>

            {/* Modal Footer with Verification Confirmation */}
            <footer className="p-3 sm:px-6 bg-[var(--surface2)] border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted)] shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>
                  Official Credential ID: <strong className="text-[var(--text)]">{activePdfModal.credentialId}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyId(activePdfModal.id, activePdfModal.credentialId)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === activePdfModal.id ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="text-xs text-[var(--accent)] hover:underline font-bold cursor-pointer"
                >
                  Exit Viewer
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
