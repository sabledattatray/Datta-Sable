"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Download,
  Eye,
  Search,
  Filter,
  Copy,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";

interface CertificateItem {
  id: string;
  title: string;
  issuer: "Google" | "LinkedIn Learning";
  issuerBadge: string;
  accreditation?: string;
  recipient: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  category: "Artificial Intelligence" | "Analytics & Data" | "Marketing & Strategy";
  skills: string[];
  pdfFile: string;
  description: string;
  duration?: string;
  pduHours?: string;
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
      "Demonstrates verified mastery of Google Analytics 4 (GA4) architecture, event-driven tracking schemas, multi-channel funnel attribution, audience discovery, and enterprise data integration."
  },
  {
    id: "generative-ai-digital-marketers",
    title: "Generative AI for Digital Marketers",
    issuer: "LinkedIn Learning",
    issuerBadge: "LinkedIn Learning & PMI",
    accreditation: "PMI® Registered Education Provider (Provider #4094)",
    recipient: "Datta Sable",
    issueDate: "April 21, 2025",
    credentialId: "af4b7c6b7b257aca2ab3a11f844bbc224bba74c8128f72b6fba",
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
      "Accredited by Project Management Institute (PMI). In-depth mastery of enterprise generative AI workflows, LLM orchestration for marketing automation, multimodal asset generation, and ethical AI deployment."
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
      "Strategic exploration of artificial intelligence applications in civic infrastructure, predictive public administration, regulatory transparency, and responsible AI governance frameworks."
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
      "Comprehensive tactical training in building, executing, and optimizing cross-platform digital marketing campaigns utilizing industry-standard automation and analytics tools."
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
      "Frameworks for architecting scalable, data-backed content engines that drive brand authority, search intent capture, audience retention, and qualified customer acquisition."
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
      "Advanced methodologies for maximizing B2B engagement, organic algorithmic distribution, executive thought leadership, and sponsored content performance on LinkedIn."
  }
];

export default function CertificationPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePdfModal, setActivePdfModal] = useState<CertificateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string, credId: string) => {
    navigator.clipboard.writeText(credId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

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
    <div style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Hero */}
          <div className="relative mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 border border-lime-400/30 bg-lime-400/10 text-lime-400 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>100% Authenticated &bull; Verified Industry Accreditations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 leading-tight">
              Professional <span style={{ color: "var(--accent)" }}>Certifications</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Official industry credentials in Artificial Intelligence, Google Analytics 4 (GA4), Enterprise Prompt Architecture, and Digital Marketing Strategy.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <Award className="w-4 h-4 text-lime-400" />
                <span><strong>6</strong> Verified Credentials</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span><strong>Google &amp; LinkedIn</strong> Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Completed <strong>April 2025</strong></span>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === tab.id
                      ? "bg-lime-400 text-black shadow-sm font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills, titles, or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-900/40 shadow-lg hover:shadow-2xl"
              >
                <div>
                  {/* Top Bar with Issuer & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-zinc-900 border border-zinc-700 text-zinc-200">
                      <Award className="w-3.5 h-3.5 text-lime-400" />
                      <span>{cert.issuerBadge}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors leading-snug mb-2 font-display">
                    {cert.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                    {cert.description}
                  </p>

                  {/* Skills Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900/80 text-zinc-300 border border-zinc-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900/80 text-zinc-500 border border-zinc-800">
                        +{cert.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="pt-4 border-t border-zinc-800/70 space-y-4">
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {cert.issueDate}
                    </span>
                    {cert.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {cert.duration}
                      </span>
                    )}
                  </div>

                  {/* Credential ID Copy Button */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[10px] font-mono">
                    <div className="truncate text-zinc-400">
                      <span className="text-zinc-500 mr-1">ID:</span>
                      <span className="text-zinc-300">{cert.credentialId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyId(cert.id, cert.credentialId)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 flex items-center gap-1 text-[10px]"
                      title="Copy Credential ID"
                    >
                      {copiedId === cert.id ? (
                        <>
                          <Check className="w-3 h-3 text-lime-400" />
                          <span className="text-lime-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePdfModal(cert)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>

                    <a
                      href={cert.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                      title="Open in New Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <a
                      href={cert.pdfFile}
                      download
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification & Trust Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-lime-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Third-Party Verification Guarantee</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Verifiable Official Records
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All certificates listed are stored in original, uncompressed PDF format with immutable cryptographic Certificate IDs issued by Google Skillshop and LinkedIn Learning.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/portfolio"
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <span>View Project Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Interactive Fullscreen PDF Modal */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="flex items-center gap-3 truncate pr-4">
                <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate font-display">
                    {activePdfModal.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Issuer: {activePdfModal.issuer} &bull; ID: {activePdfModal.credentialId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activePdfModal.pdfFile}
                  download
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={activePdfModal.pdfFile}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer Body */}
            <div className="flex-1 bg-zinc-900 overflow-hidden relative min-h-[60vh]">
              <iframe
                src={`${activePdfModal.pdfFile}#toolbar=1&navpanes=0`}
                className="w-full h-full min-h-[65vh] border-0"
                title={activePdfModal.title}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:px-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Recipient: <strong>{activePdfModal.recipient}</strong></span>
              <button
                type="button"
                onClick={() => setActivePdfModal(null)}
                className="text-xs text-lime-400 hover:underline font-semibold"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
