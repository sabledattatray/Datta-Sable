'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Maximize2,
  X,
  ArrowRight,
  TrendingUp,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { ExcelProject } from '@/data/excelProjects';

interface ExcelProjectShowcaseProps {
  project: ExcelProject;
}

export default function ExcelProjectShowcase({ project }: ExcelProjectShowcaseProps) {
  const [activeTabId, setActiveTabId] = useState<string>('exec-full');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const activeTab = project.screenshotTabs.find((t) => t.id === activeTabId) || project.screenshotTabs[0];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      {/* CANONICAL BOXED WRAPPER (Exact 1077.88px site width without overrides) */}
      <main className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        <Crosshair position="tl" />
        <Crosshair position="tr" />
        <Crosshair position="bl" />
        <Crosshair position="br" />

        {/* ── 1. HERO SECTION ── */}
        <section className="p-8 sm:p-14 border-b border-[var(--border)] text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted)] font-mono mb-6">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/dashboards" className="hover:text-[var(--accent)] transition-colors">Dashboards</Link>
            <span>/</span>
            <span className="text-[var(--accent)] font-semibold">{project.clientOrOrg}</span>
          </div>

          {/* Status Strip Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono font-semibold tracking-wider text-[var(--accent)] text-[11px] uppercase">
              {project.badge}
            </span>
            <span className="text-[var(--muted)] opacity-40">|</span>
            <span className="font-mono text-xs text-[var(--muted)]">{project.fileSize} .xlsx • {project.totalRecordsCount.toLocaleString()} Rows</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            {project.clientOrOrg}
            <span className="block text-[var(--muted)] font-normal text-xl sm:text-2xl mt-2 tracking-normal">
              Executive Performance &amp; Commercial Sales Dashboard
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            {project.subtitle} Explore authentic screenshots of each worksheet below, or download the master spreadsheet workbook.
          </p>

          {/* Download CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={project.downloadUrl}
              download={project.excelFilename}
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 font-bold text-xs tracking-widest uppercase transition-all"
              style={{
                textDecoration: 'none',
              }}
            >
              <Download size={16} className="stroke-[2.5]" />
              <span>Download Master Excel File (.xlsx)</span>
              <span className="px-2 py-0.5 bg-black/15 text-black text-[10px] font-mono font-bold">
                {project.fileSize}
              </span>
            </a>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('screenshots-viewer');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase cursor-pointer"
            >
              <span>Browse Worksheets</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto mt-10 text-left">
            {project.keyKPIs.map((kpi, idx) => (
              <div key={idx} className="p-4 border border-[var(--border)] bg-[var(--card)]">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--muted)] block mb-1">
                  {kpi.label}
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
                  {kpi.value}
                </div>
                <span className="text-[11px] text-[var(--accent)] font-mono block mt-1">
                  {kpi.subtext}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. SCREENSHOTS GALLERY & VIEWER ── */}
        <section id="screenshots-viewer" className="p-6 sm:p-10 border-b border-[var(--border)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div>
              <div className="label-tech mb-2">Visual Showcase</div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
                Workbook Sheet Screenshots
              </h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Click any sheet tab below to preview the exact spreadsheet reports created in Microsoft Excel
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer w-fit"
            >
              <Maximize2 size={13} />
              <span>Fullscreen Preview</span>
            </button>
          </div>

          {/* Sheet Selector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-[var(--border)]">
            {project.screenshotTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer border-b-2 -mb-[2px] ${
                    isActive
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--card)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]/50'
                  }`}
                >
                  <FileSpreadsheet size={14} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Screenshot Display Window Frame */}
          <div className="border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            {/* Window Title Bar */}
            <div className="px-5 py-3 bg-[var(--bg)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                </div>
                <span className="text-xs font-mono text-[var(--muted)] ml-2 hidden sm:inline">
                  {project.excelFilename} — [{activeTab.name}]
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2.5 py-0.5 border border-[var(--border)] bg-[var(--card)] text-[var(--accent)] font-semibold">
                  {activeTab.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  title="View Fullscreen"
                  className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* Image Preview Container */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full bg-black p-3 sm:p-6 flex items-center justify-center cursor-zoom-in group"
            >
              <div className="relative w-full border border-white/10 shadow-2xl overflow-hidden">
                <Image
                  src={activeTab.imageSrc}
                  alt={activeTab.name}
                  width={activeTab.width}
                  height={activeTab.height}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.005]"
                  priority
                />
              </div>

              {/* Hover Overlay Hint */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 backdrop-blur-md text-white text-xs px-3.5 py-2 border border-white/20 flex items-center gap-2 shadow-2xl pointer-events-none font-mono">
                <Maximize2 size={13} className="text-[var(--accent)]" />
                <span>Click to zoom full resolution</span>
              </div>
            </div>

            {/* Caption & Sheet Explanation */}
            <div className="p-6 sm:p-8 bg-[var(--bg)] border-t border-[var(--border)] space-y-5">
              <div>
                <div className="label-tech mb-2">Worksheet Overview</div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">
                  {activeTab.sheetLabel}
                </h3>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mt-2 max-w-3xl">
                  {activeTab.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                  Key Technical Features
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeTab.keyHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-[var(--text)]"
                    >
                      <CheckCircle2 size={14} className="text-[var(--accent)] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. WORKBOOK DIRECTORY (6 SHEETS) ── */}
        <section className="p-6 sm:p-10 border-b border-[var(--border)] space-y-6">
          <div className="pb-4 border-b border-[var(--border)]">
            <div className="label-tech mb-2">Architecture</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
              Workbook Directory &amp; Sheet Hierarchy
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              The master workbook contains 6 structured worksheets designed for executive presentation and financial analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.sheets.map((sheet, idx) => (
              <div
                key={sheet.name}
                className="p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--accent)]">
                      0{idx + 1}
                    </span>
                    <span>{sheet.name}</span>
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
                    {sheet.type}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {sheet.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                  {sheet.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono text-[var(--text)] opacity-80"
                    >
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. COMMERCIAL CONTEXT & TAKEAWAYS ── */}
        <section className="p-6 sm:p-10 border-b border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Executive Business Context */}
            <div className="p-6 border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-widest">
                <Globe size={15} />
                <span>Commercial Background</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Executive Business Context
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {project.clientOrOrg} operates complex enterprise systems across multiple international commercial territories.
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {project.businessProblem}
              </p>
            </div>

            {/* Key Strategic Findings */}
            <div className="p-6 border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-widest">
                <TrendingUp size={15} />
                <span>Strategic Findings</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Commercial Takeaways
              </h3>
              <ul className="space-y-3 text-sm text-[var(--text)]">
                {project.strategicFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 5. HOW TO RUN THE WORKBOOK ── */}
        <section className="p-6 sm:p-10 border-b border-[var(--border)] space-y-6">
          <div>
            <div className="label-tech mb-2">Instructions</div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
              How to Use This Excel Workbook
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              Zero VBA or third-party add-ins required — works out of the box in modern Microsoft Excel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 border border-[var(--border)] bg-[var(--card)] space-y-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)] block">01</span>
              <h4 className="text-base font-bold text-[var(--text)]">Open in Excel</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Open in Microsoft Excel (2016, 2019, 2021, or Microsoft 365). No macros, external links, or plugins needed.
              </p>
            </div>

            <div className="p-5 border border-[var(--border)] bg-[var(--card)] space-y-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)] block">02</span>
              <h4 className="text-base font-bold text-[var(--text)]">Toggle Slicers</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                On the "Executive Dashboard" sheet, click cells C4 (Region) or G4 (Channel) to recalculate the entire model dynamically.
              </p>
            </div>

            <div className="p-5 border border-[var(--border)] bg-[var(--card)] space-y-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)] block">03</span>
              <h4 className="text-base font-bold text-[var(--text)]">Inspect Formulas</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Inspect clean SUMIFS, XLOOKUP, dynamic pivot tables, and {project.totalRecordsCount.toLocaleString()} certified institutional transactions.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. DIRECT DOWNLOAD CTA CARD ── */}
        <section className="p-8 sm:p-14 text-center relative overflow-hidden bg-[var(--card)]">
          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[var(--accent)] border border-[var(--accent)]/30 bg-[var(--accent)]/5">
              <FileSpreadsheet size={13} />
              <span>Institutional Master Workbook</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Download {project.clientOrOrg} Master Workbook
            </h3>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              Fully unlocked .xlsx file including the executive dashboard, dynamic pivot models, {project.totalRecordsCount.toLocaleString()} transaction rows, regional scorecards, and customer health registers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={project.downloadUrl}
                download={project.excelFilename}
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-xs tracking-widest uppercase transition-all"
                style={{
                  textDecoration: 'none',
                }}
              >
                <Download size={16} className="stroke-[2.5]" />
                <span>Download .xlsx File ({project.fileSize})</span>
              </a>

              <Link
                href="/contact"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-colors"
                style={{
                  textDecoration: 'none',
                }}
              >
                <span>Request Custom Excel BI</span>
                <ExternalLink size={14} />
              </Link>
            </div>

            <div className="pt-4 text-xs font-mono text-[var(--muted)]">
              SHA-256 Verified • Clean Format • Certified Compatible with Excel 2016-365
            </div>
          </div>
        </section>

        {/* ── 7. FULLSCREEN LIGHTBOX MODAL ── */}
        {isLightboxOpen && (
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center overflow-auto animate-in fade-in duration-200"
          >
            <div className="w-full max-w-5xl flex items-center justify-between text-white mb-3">
              <span className="text-xs sm:text-sm font-mono font-bold text-[var(--accent)]">
                {activeTab.sheetLabel} — High-Resolution Preview
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full max-h-[85vh] overflow-auto border border-white/20 bg-black p-2 shadow-2xl"
            >
              <Image
                src={activeTab.imageSrc}
                alt={activeTab.name}
                width={activeTab.width}
                height={activeTab.height}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
