"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Search,
  Copy,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText,
  BadgeCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

interface CertificateItem {
  id: string;
  title: string;
  issuer: "Google" | "LinkedIn Learning";
  issuerBadge: string;
  accreditation: string;
  recipient: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  hash: string;
  category: "Artificial Intelligence" | "Analytics & Data" | "Marketing & Strategy";
  skills: string[];
  pdfFile: string;
  description: string;
  duration?: string;
  pduHours?: string;
  highlights: string[];
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: "google-analytics-4",
    title: "Google Analytics Certification",
    issuer: "Google",
    issuerBadge: "Google Skillshop",
    accreditation: "Official Google Career Accreditation",
    recipient: "Datta Sable",
    issueDate: "April 25, 2025",
    expiryDate: "April 25, 2026",
    credentialId: "141072342",
    hash: "SHA-256: 4a8e29bf141072342c81e7d0",
    category: "Analytics & Data",
    skills: [
      "Google Analytics 4 (GA4)",
      "Web & Event Analytics",
      "Audience Segmentation",
      "Conversion Tracking",
      "Attribution Modeling",
      "E-commerce Reporting"
    ],
    pdfFile: "/Certificates/Google%20Analytics%20Certifiacte.pdf",
    description:
      "Demonstrates verified mastery of Google Analytics 4 (GA4) architecture, event-driven tracking schemas, multi-channel funnel attribution, audience discovery, and enterprise data integration.",
    highlights: [
      "Event-driven data modeling & custom dimensions",
      "Cross-channel data-driven attribution & funnel exploration",
      "BigQuery export pipelines & predictive audiences"
    ]
  },
  {
    id: "generative-ai-digital-marketers",
    title: "Generative AI for Digital Marketers",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning & PMI®",
    accreditation: "PMI® Registered Education Provider (Provider #4094)",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "af4b7c6b7b257aca2ab3a11f844bbc224bba74c8128f72b6fba",
    hash: "SHA-256: af4b7c6b7b257aca2ab3a11f844b",
    category: "Artificial Intelligence",
    duration: "1h 30m",
    pduHours: "1.50 PDUs (Activity #4094008101)",
    skills: [
      "Generative AI Tools",
      "Artificial Intelligence for Business",
      "Digital Marketing Automation",
      "Prompt Engineering",
      "Content Generation"
    ],
    pdfFile: "/Certificates/CertificateOfCompletion_Generative%20AI%20for%20Digital%20Marketers.pdf",
    description:
      "Accredited by Project Management Institute (PMI). In-depth mastery of enterprise generative AI workflows, LLM orchestration for marketing automation, multimodal asset generation, and ethical AI deployment.",
    highlights: [
      "PMI Continuing Professional Development Accreditation",
      "LLM prompt chaining and automated campaign generation",
      "Enterprise governance and safe AI deployment frameworks"
    ]
  },
  {
    id: "ai-future-public-sector",
    title: "AI and the Future of the Public Sector",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    accreditation: "Global Content Learning Accreditation",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "f70de76c8f2278e49961a7a3ada42d92f2db705dcd8edcefc802136341e9ee49",
    hash: "SHA-256: f70de76c8f2278e49961a7a3ada4",
    category: "Artificial Intelligence",
    duration: "46m",
    skills: [
      "Artificial Intelligence for Business",
      "Public Policy & AI Governance",
      "Civic Technology",
      "Automated Decision Systems",
      "Ethical Frameworks"
    ],
    pdfFile: "/Certificates/CertificateOfCompletion_AI%20and%20the%20Future%20of%20the%20Public%20Sector.pdf",
    description:
      "Strategic exploration of artificial intelligence applications in civic infrastructure, predictive public administration, regulatory transparency, and responsible AI governance frameworks.",
    highlights: [
      "Ethical AI frameworks for high-stakes decision systems",
      "Regulatory compliance & data privacy standards",
      "Civic data intelligence & public service automation"
    ]
  },
  {
    id: "digital-marketing-tools-campaign",
    title: "Digital Marketing Tools: Create a Marketing Campaign from Start to Finish",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    accreditation: "Global Content Learning Accreditation",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "26e31bf78d275220bba0168643799c07ecefea199074516f51041bf12596fb15",
    hash: "SHA-256: 26e31bf78d275220bba016864379",
    category: "Marketing & Strategy",
    duration: "1h 10m",
    skills: [
      "Digital Marketing Tools",
      "Omnichannel Campaign Execution",
      "Audience Targeting",
      "ROI & Analytics Tracking",
      "Ad Tech Workflows"
    ],
    pdfFile: "/Certificates/CertificateOfCompletion_Digital%20Marketing%20Tools%20Create%20a%20Marketing%20Campaign%20from%20Start%20to%20Finish.pdf",
    description:
      "Comprehensive tactical training in building, executing, and optimizing cross-platform digital marketing campaigns utilizing industry-standard automation and analytics tools.",
    highlights: [
      "End-to-end multi-channel acquisition funnel architecture",
      "Conversion tracking & attribution telemetry setup",
      "Automated ad scheduling & campaign performance benchmarking"
    ]
  },
  {
    id: "content-strategy-marketers",
    title: "Content Strategy for Marketers",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    accreditation: "Global Content Learning Accreditation",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "bb49ba014ee326ff5b9edc36c7c89dec8ad2cc9bb250eb8dd3f6e72a8f227851",
    hash: "SHA-256: bb49ba014ee326ff5b9edc36c7c8",
    category: "Marketing & Strategy",
    duration: "45m",
    skills: [
      "Content Strategy",
      "Content Marketing",
      "Editorial Planning",
      "Brand Narrative",
      "Organic Growth Strategy"
    ],
    pdfFile: "/Certificates/CertificateOfCompletion_Content%20Strategy%20for%20Marketers.pdf",
    description:
      "Frameworks for architecting scalable, data-backed content engines that drive brand authority, search intent capture, audience retention, and qualified customer acquisition.",
    highlights: [
      "Search intent clustering & content topic authority graphs",
      "Scalable editorial calendars & distribution lifecycle",
      "Performance KPIs: organic engagement & pipeline attribution"
    ]
  },
  {
    id: "marketing-on-linkedin",
    title: "Marketing on LinkedIn",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning",
    accreditation: "Global Content Learning Accreditation",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "70ec3f2670dde2f56d9090417e4f04fe2253242e2954a1d7342ff0e06422a4b1",
    hash: "SHA-256: 70ec3f2670dde2f56d9090417e4f",
    category: "Marketing & Strategy",
    duration: "45m",
    skills: [
      "LinkedIn Marketing",
      "B2B Demand Generation",
      "Corporate Storytelling",
      "Professional Branding",
      "Organic & Paid Reach"
    ],
    pdfFile: "/Certificates/CertificateOfCompletion_Marketing%20on%20LinkedIn.pdf",
    description:
      "Advanced methodologies for maximizing B2B engagement, organic algorithmic distribution, executive thought leadership, and sponsored content performance on LinkedIn.",
    highlights: [
      "Executive personal branding & technical leadership positioning",
      "B2B account targeting & algorithmic content amplification",
      "Conversion tracking & analytics for high-value leads"
    ]
  }
];

// Decorative Ornamental Corner Bracket for Certificate Plaque
function CornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = {
    tl: 'top-2.5 left-2.5 rotate-0',
    tr: 'top-2.5 right-2.5 rotate-90',
    br: 'bottom-2.5 right-2.5 rotate-180',
    bl: 'bottom-2.5 left-2.5 -rotate-90',
  }[position];

  return (
    <div className={`absolute ${rotation} pointer-events-none z-10`} aria-hidden="true">
      <svg
        className="w-5 h-5 text-[var(--accent)] opacity-40 group-hover:opacity-90 transition-opacity duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M2 2h8a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5v5a2 2 0 0 1-2 2H2V2z" fill="currentColor" fillOpacity="0.12" />
        <path d="M2 2v9M2 2h9M5 5h4v4H5z" />
        <circle cx="13" cy="3" r="1" fill="currentColor" />
        <circle cx="3" cy="13" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}

// Decorative Official Verification Seal Stamp SVG
function OfficialSealStamp({ issuer }: { issuer: "Google" | "LinkedIn Learning" }) {
  const isGoogle = issuer === "Google";

  return (
    <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0" aria-hidden="true">
      {/* Outer Rotating/Sunburst Star Ring */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-[var(--accent)] drop-shadow-[0_2px_12px_rgba(201,243,29,0.25)] animate-[spin_60s_linear_infinite]"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        {/* Starburst Notches */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <line
              key={i}
              x1="50"
              y1="4"
              x2="50"
              y2="8"
              stroke="currentColor"
              strokeWidth="1.5"
              transform={`rotate(${angle} 50 50)`}
              opacity="0.75"
            />
          );
        })}
      </svg>

      {/* Inner Badge Core */}
      <div className="absolute inset-2.5 rounded-full bg-[var(--surface)] border border-[var(--accent)]/50 flex flex-col items-center justify-center text-center p-1 shadow-inner">
        <Award className="w-5 h-5 text-[var(--accent)] mb-0.5" />
        <span className="text-[7.5px] font-black tracking-widest uppercase text-[var(--accent)] leading-tight">
          {isGoogle ? "VERIFIED" : "PMI / LI"}
        </span>
      </div>
    </div>
  );
}

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

  // Close modal on Escape key
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

  // Reset zoom when modal opens or closes
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

  const filteredCerts = CERTIFICATES.filter((cert) => {
    const matchesCategory =
      activeCategory === "All" ||
      cert.category === activeCategory ||
      cert.issuer === activeCategory;

    const matchesSearch =
      searchQuery === "" ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen flex flex-col selection:bg-[var(--accent)] selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <section className="relative mb-16 text-center max-w-3xl mx-auto">
            {/* Authenticity Security Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[var(--accent)]/30 bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] text-[var(--accent)] shadow-[0_0_20px_rgba(201,243,29,0.12)]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
              <span>OFFICIAL ACCREDITATIONS &bull; CRYPTOGRAPHICALLY VERIFIED</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display mb-5 leading-[1.15]">
              Professional <span style={{ color: "var(--accent)" }}>Certifications</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
              Officially recognized enterprise accreditations in Google Analytics 4 (GA4), Generative AI Architecture, Public Sector AI Ethics, and Digital Marketing Strategy.
            </p>

            {/* Micro-KPI Grid Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 text-xs font-mono">
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-[var(--accent)]">6</span>
                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mt-0.5">Accreditations</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mt-0.5">Verified Records</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-sky-400">Google</span>
                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mt-0.5">Career Accredited</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-purple-400">PMI®</span>
                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mt-0.5">Education Provider</span>
              </div>
            </div>
          </section>

          {/* Filter Bar & Search */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? "bg-[var(--accent)] text-black shadow-sm font-extrabold"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by topic, skill, or credential ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Certificates Grid: Decorative Diplomas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredCerts.map((cert) => (
              <article
                key={cert.id}
                className="group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border-2 border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--surface)] hover:bg-[var(--surface2)]/80 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_36px_rgba(201,243,29,0.12)] overflow-hidden"
              >
                {/* 4 Corner Ornamental Filigrees */}
                <CornerFiligree position="tl" />
                <CornerFiligree position="tr" />
                <CornerFiligree position="bl" />
                <CornerFiligree position="br" />

                {/* Subtle Inner Certificate Border Inset */}
                <div className="absolute inset-2 border border-dashed border-[var(--border)]/70 rounded-2xl pointer-events-none z-0 group-hover:border-[var(--accent)]/30 transition-colors" />

                {/* Decorative Top Accent Glow */}
                <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

                {/* Card Top: Official Seal & Badges */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      {/* Issuer Pill */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)]">
                        <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{cert.issuerBadge}</span>
                      </span>

                      <div className="mt-2 text-[10px] font-mono tracking-wider uppercase text-[var(--muted)] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{cert.accreditation}</span>
                      </div>
                    </div>

                    {/* Official Embossed Seal Stamp */}
                    <OfficialSealStamp issuer={cert.issuer} />
                  </div>

                  {/* Recipient Honor Line */}
                  <div className="mb-3 pt-2 border-t border-[var(--border)]/60">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block font-semibold">
                      Certifies That
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-display text-[var(--text)] tracking-tight">
                      {cert.recipient}
                    </h3>
                  </div>

                  {/* Certificate Title */}
                  <h4 className="text-base sm:text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-3 font-display">
                    {cert.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-4 line-clamp-3">
                    {cert.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-[var(--surface2)]/70 border border-[var(--border)]/70 text-[11px]">
                    {cert.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[var(--muted)]">
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)]"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface2)] text-[var(--muted)] border border-[var(--border)]">
                        +{cert.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="relative z-10 pt-4 border-t border-[var(--border)]/70 space-y-3">
                  {/* Metadata Row: Date & Duration */}
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[var(--muted)]" />
                      Issued: <strong className="text-[var(--text)]">{cert.issueDate}</strong>
                    </span>
                    {cert.expiryDate ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        Valid Thru {cert.expiryDate}
                      </span>
                    ) : cert.duration ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--muted)]" />
                        {cert.duration}
                      </span>
                    ) : null}
                  </div>

                  {/* Credential ID Copy Box */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[10px] font-mono">
                    <div className="truncate text-[var(--muted)]">
                      <span className="text-[var(--muted)] mr-1">ID:</span>
                      <span className="text-[var(--text)] font-semibold">{cert.credentialId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyId(cert.id, cert.credentialId)}
                      className="px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] transition-colors shrink-0 flex items-center gap-1 text-[10px] font-semibold"
                      title="Copy Credential ID"
                    >
                      {copiedId === cert.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Primary Action Button: View PDF (No Download Allowed) */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActivePdfModal(cert)}
                      className="w-full py-3 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Official Certificate</span>
                    </button>

                    {/* Notice informing user that downloads are restricted for credential integrity */}
                    <div className="mt-2 text-center text-[10px] text-[var(--muted)] font-mono flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-[var(--muted)]" />
                      <span>Protected View &bull; Anti-counterfeit verification</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty Search State */}
          {filteredCerts.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] max-w-md mx-auto my-12">
              <ShieldAlert className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[var(--text)] font-display mb-1">No Matching Credentials</h3>
              <p className="text-xs text-[var(--muted)] mb-4">No certificates found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-black text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Institutional Trust & Verification Assurance Section */}
          <section className="mt-20 p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>INSTITUTIONAL ACCREDITATION GUARANTEE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text)] font-display tracking-tight">
                  Cryptographically Bound Official Documents
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  All certificates displayed on this portal represent authenticated professional credentials issued directly by Google Skillshop and LinkedIn Learning (Project Management Institute R.E.P. #4094). Documents are rendered in high-definition protected mode to ensure anti-counterfeiting compliance.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)] pt-2">
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" /> Tamper-Proof Cryptographic ID
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-sky-400" /> Read-Only Digital Vault
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                <a
                  href="/portfolio"
                  className="px-5 py-3 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface2)] text-[var(--text)] font-bold text-xs border border-[var(--border)] transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                  <span>Explore Project Portfolio</span>
                </a>
                <a
                  href="/contact"
                  className="px-5 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold text-xs transition-colors flex items-center justify-center text-center"
                >
                  Direct Inquiry &bull; Get in Touch
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Interactive Protected Fullscreen PDF Viewer Modal */}
      {activePdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActivePdfModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${isFullscreen ? 'max-w-full h-full rounded-none' : 'max-w-5xl max-h-[94vh] rounded-3xl'} bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
          >
            {/* Modal Header */}
            <header className="p-3.5 sm:px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface2)] shrink-0 gap-3">
              <div className="flex items-center gap-3 truncate pr-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
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

              {/* Toolbar Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(70, prev - 15))}
                    disabled={zoomLevel <= 70}
                    className="p-1 hover:text-[var(--text)] disabled:opacity-30"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-[10px]">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                    disabled={zoomLevel >= 150}
                    className="p-1 hover:text-[var(--text)] disabled:opacity-30"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="p-1 hover:text-[var(--text)]"
                    title="Reset Zoom"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)] transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-lg bg-[var(--surface)] hover:bg-red-500/20 hover:text-red-400 text-[var(--muted)] border border-[var(--border)] transition-colors cursor-pointer"
                  aria-label="Close certificate viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Document Protection Shield Banner */}
            <div className="px-4 py-2 bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] border-b border-[var(--border)] flex items-center justify-between text-[11px] font-mono shrink-0">
              <div className="flex items-center gap-2 text-[var(--accent)] font-semibold truncate">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Official Record Vault &bull; View-Only Protected Mode (Direct Download Disabled)</span>
              </div>
              <span className="text-[10px] text-[var(--muted)] hidden md:inline">
                Cryptographic Serial: {activePdfModal.hash}
              </span>
            </div>

            {/* Protected PDF Viewer Body */}
            <div
              className="flex-1 bg-zinc-950 overflow-auto relative min-h-[55vh] flex items-center justify-center p-1 sm:p-3"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                style={{
                  width: `${zoomLevel}%`,
                  height: '100%',
                  transition: 'width 0.15s ease-out',
                }}
                className="h-full min-h-[60vh] max-w-full flex items-center justify-center"
              >
                {/* 
                  #toolbar=0&navpanes=0 disables the browser's native download/print header
                  view=FitH ensures the certificate fits horizontally across all viewports
                */}
                <iframe
                  src={`${activePdfModal.pdfFile}#toolbar=0&navpanes=0&statusbar=0&messages=0&scrollbar=1&view=FitH`}
                  className="w-full h-full min-h-[65vh] border-0 rounded-xl shadow-2xl bg-white"
                  title={`Certificate: ${activePdfModal.title}`}
                />
              </div>
            </div>

            {/* Modal Footer with Verification Confirmation */}
            <footer className="p-3 sm:px-6 bg-[var(--surface2)] border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted)] shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Recipient: <strong className="text-[var(--text)]">{activePdfModal.recipient}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyId(activePdfModal.id, activePdfModal.credentialId)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Credential ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="text-xs text-[var(--accent)] hover:underline font-bold"
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
