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
  ShieldCheck,
  Maximize2,
  X,
  ArrowRight,
  TrendingUp,
  Globe,
  Info,
  ExternalLink,
} from 'lucide-react';
import { EXCEL_PROJECTS } from '@/data/excelProjects';

interface ScreenshotTab {
  id: string;
  name: string;
  sheetLabel: string;
  imageSrc: string;
  width: number;
  height: number;
  badge: string;
  description: string;
  keyHighlights: string[];
}

const SCREENSHOT_TABS: ScreenshotTab[] = [
  {
    id: 'exec-full',
    name: '1. Executive Dashboard',
    sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
    imageSrc: '/images/projects/aura-capital/executive_dashboard_full.png',
    width: 1383,
    height: 1658,
    badge: 'Main C-Suite Cockpit',
    description:
      'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), 6 core KPI metric cards, monthly run-rate table with in-cell Unicode sparklines, regional quota scorecards, and top enterprise client summaries.',
    keyHighlights: [
      'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
      '6 Core KPI Scorecards ($15.95M Gross Volume)',
      '12-Month Financial Run-Rate with In-Cell Sparklines',
      'Regional Quota Attainment & Managing Director Tracking',
      'Top Strategic Accounts & Sales Channel Mix Matrix',
    ],
  },
  {
    id: 'pivot-matrix',
    name: '2. Pivot Table Analysis',
    sheetLabel: 'Sheet 2: Pivot Table Analysis',
    imageSrc: '/images/projects/aura-capital/pivot_table_analysis_sheet.png',
    width: 1558,
    height: 722,
    badge: 'Dynamic Cross-Tabulation',
    description:
      'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing (Q1 to Q4).',
    keyHighlights: [
      'Global Theater × Sales Channel Revenue Matrix',
      'Product Category Portfolio by Regional Theater',
      'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
      'Automated Calculated Profit and Margin Fields',
    ],
  },
  {
    id: 'transactions-ledger',
    name: '3. Sales Transactions Ledger',
    sheetLabel: 'Sheet 3: Sales Transactions',
    imageSrc: '/images/projects/aura-capital/sales_transactions_ledger.png',
    width: 2298,
    height: 646,
    badge: '1,037 Certified Rows',
    description:
      'The foundational transactional ledger containing 1,037 certified institutional sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
    keyHighlights: [
      '1,037 Certified Institutional Ledger Records',
      'Standardized Data Taxonomies for Region, Rep, and Channel',
      'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
      'Granular Attribution from Contract Level to Region',
    ],
  },
  {
    id: 'regional-scorecard',
    name: '4. Regional Scorecard',
    sheetLabel: 'Sheet 4: Regional Performance',
    imageSrc: '/images/projects/aura-capital/regional_performance_sheet.png',
    width: 1605,
    height: 214,
    badge: 'Director Quotas',
    description:
      'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
    keyHighlights: [
      'Coverage across North America, EMEA, APAC, and LATAM',
      'Managing Director Quota Accountability',
      'Monetary Variance ($) and Attainment % Tracking',
      'YoY Growth Rate & Average Deal Size by Region',
    ],
  },
  {
    id: 'customer-accounts',
    name: '5. Customer Accounts',
    sheetLabel: 'Sheet 6: Customer Accounts',
    imageSrc: '/images/projects/aura-capital/customer_accounts_sheet.png',
    width: 1443,
    height: 220,
    badge: 'Tier-1 Client Health',
    description:
      'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
    keyHighlights: [
      'Key Enterprise Clients (London Capital, Zurich Bank, Tokyo Sovereign)',
      'Lifetime Revenue and Net Profit Attribution',
      'Account Health Classification (Optimal / Stable)',
      'Contract Renewal Pacing Calendar (FY2026)',
    ],
  },
];

export default function AuraCapitalSalesDashboardPage() {
  const project = EXCEL_PROJECTS[0];
  const [activeTabId, setActiveTabId] = useState<string>('exec-full');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const activeTab = SCREENSHOT_TABS.find((t) => t.id === activeTabId) || SCREENSHOT_TABS[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300">
      <Navbar />

      {/* CENTERED BOXED WRAPPER */}
      <main className="boxed-wrapper !max-w-[1240px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent relative pb-20 px-4 sm:px-6">
        <Crosshair position="tl" />
        <Crosshair position="br" />

        {/* ── 1. HEADER SECTION (CENTERED & CLEAN) ── */}
        <section className="pt-6 pb-10 border-b border-[var(--border)] mb-10 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted)] font-mono mb-4">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/dashboards" className="hover:text-[var(--accent)] transition-colors">Dashboards</Link>
              <span>/</span>
              <span className="text-[var(--accent)] font-semibold">Aura Capital Excel Project</span>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={13} />
                Microsoft Excel Master Model
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                <ShieldCheck size={13} />
                2026 Audited Edition
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
                <FileSpreadsheet size={13} className="text-emerald-400" />
                4.86 MB .xlsx
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-3 leading-tight">
              Aura Capital & FinTech Group
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-sky-400 to-blue-500 mt-1">
                Executive Sales & Commercial Dashboard
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-2xl mx-auto">
              Complete commercial intelligence spreadsheet model created in Microsoft Excel.
              Browse the authentic high-resolution screenshots of each worksheet below, or download the original .xlsx workbook.
            </p>

            {/* Download Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                download="Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00F0FF] via-sky-400 to-blue-500 text-black shadow-lg shadow-[#00F0FF]/20 hover:shadow-[#00F0FF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download size={18} className="stroke-[2.5]" />
                <span>Download Master Excel File (.xlsx)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/20 text-black/90 font-bold">
                  4.86 MB
                </span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('screenshots-viewer');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <span>Browse Excel Screenshots</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 4 Key Summary Metric Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8 text-center">
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] block mb-0.5">
                Gross Volume
              </span>
              <span className="text-xl font-black text-[#00F0FF] font-mono">
                $15.95M
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                $3.88M Certified Actuals
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] block mb-0.5">
                Gross Profit
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                $10.87M
              </span>
              <span className="text-[10px] text-[var(--muted)] font-mono block mt-0.5">
                68.2% Blended Margin
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] block mb-0.5">
                Director Quota
              </span>
              <span className="text-xl font-black text-sky-400 font-mono">
                102.3%
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                Global Target Exceeded
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] block mb-0.5">
                Audit Transactions
              </span>
              <span className="text-xl font-black text-purple-400 font-mono">
                1,037 Rows
              </span>
              <span className="text-[10px] text-[var(--muted)] font-mono block mt-0.5">
                6 Worksheets Included
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. SCREENSHOTS GALLERY & VIEWER ── */}
        <section id="screenshots-viewer" className="space-y-4 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-bold block mb-1">
                Visual Dashboard Showcase
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">
                Workbook Sheet Screenshots
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Click any sheet tab below to preview the exact spreadsheet reports created in Microsoft Excel
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--card)] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors cursor-pointer w-fit"
            >
              <Maximize2 size={13} />
              <span>Fullscreen Preview</span>
            </button>
          </div>

          {/* Sheet Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SCREENSHOT_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] border border-transparent'
                  }`}
                >
                  <FileSpreadsheet size={14} className={isActive ? 'text-[#00F0FF]' : 'text-[var(--muted)]'} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Screenshot Display Window Frame */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="px-4 py-2.5 bg-[var(--bg)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-[var(--muted)] ml-2 hidden sm:inline">
                  Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx — [{activeTab.name}]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] font-semibold border border-[#00F0FF]/20">
                  {activeTab.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  title="View Fullscreen"
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>

            {/* Image Preview Container */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full bg-neutral-950 p-3 sm:p-5 flex items-center justify-center cursor-zoom-in group"
            >
              <div className="relative w-full rounded-lg overflow-hidden border border-white/10 shadow-lg">
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
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5 shadow-xl pointer-events-none">
                <Maximize2 size={13} className="text-[#00F0FF]" />
                <span>Click to zoom in full resolution</span>
              </div>
            </div>

            {/* Caption & Sheet Explanation */}
            <div className="p-5 bg-[var(--card)] border-t border-[var(--border)] space-y-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#00F0FF] block">
                  {activeTab.sheetLabel}
                </span>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mt-1">
                  {activeTab.description}
                </p>
              </div>

              {/* Highlights Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
                <span className="text-[11px] font-mono text-[var(--muted)]">Sheet Highlights:</span>
                {activeTab.keyHighlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  >
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. WORKBOOK STRUCTURE SUMMARY ── */}
        <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-12 space-y-4">
          <div className="pb-3 border-b border-[var(--border)]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-bold block mb-1">
              Workbook Directory
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text)]">
              What's Inside the Downloadable Excel File
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              The master workbook contains 6 structured worksheets designed for executive presentation and financial analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {project.sheets.map((sheet, idx) => (
              <div
                key={sheet.name}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[#00F0FF]/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00F0FF]">
                    Sheet {idx + 1}: {sheet.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]">
                    {sheet.type}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {sheet.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sheet.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. COMMERCIAL CONTEXT & TAKEAWAYS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Executive Business Context */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] font-bold uppercase tracking-wider">
              <Globe size={15} />
              <span>Commercial Background</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Executive Business Context
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Aura Capital & FinTech Group provides mission-critical risk compliance engines, low-latency execution terminals, and automated wealth management infrastructure to tier-1 financial institutions across 15+ countries.
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Previously, regional sales teams reported quotas across fragmented spreadsheets. This workbook consolidated global financial run-rates, individual contract margins, and partner channel contributions into an auditable, single-pane model.
            </p>
          </div>

          {/* Key Strategic Findings */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <TrendingUp size={15} />
              <span>Key Findings</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Commercial Takeaways
            </h3>
            <ul className="space-y-2 text-xs text-[var(--muted)]">
              {project.strategicFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 5. HOW TO RUN THE WORKBOOK ── */}
        <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
            <Info size={15} />
            <span>Usage Guide</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text)]">
            How to Use This Excel Workbook
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-1">
              <span className="font-bold text-[var(--text)] font-mono block">1. Open in Excel</span>
              <p className="text-[var(--muted)]">
                Open in Microsoft Excel (2016, 2019, 2021, or Office 365). No macros, VBA code, or add-ins required.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-1">
              <span className="font-bold text-[var(--text)] font-mono block">2. Click Slicer Dropdowns</span>
              <p className="text-[var(--muted)]">
                On the "Executive Dashboard" sheet, click cells C4 (Region Filter) or G4 (Channel Filter) to recalculate the entire model dynamically.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-1">
              <span className="font-bold text-[var(--text)] font-mono block">3. Inspect Formulas</span>
              <p className="text-[var(--muted)]">
                Inspect clean SUMIFS, XLOOKUP, pivot cross-tabulations, and 1,037 certified transaction records.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. DIRECT DOWNLOAD CTA CARD (CENTERED) ── */}
        <section className="rounded-3xl border border-[#00F0FF]/30 bg-gradient-to-b from-[var(--card)] to-[var(--bg)] p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              <FileSpreadsheet size={13} />
              Instant Direct Download
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
              Ready to Explore the Full Model?
            </h2>

            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Download the complete Microsoft Excel workbook (4.86 MB) containing all 6 dynamic worksheets,
              formulas, pivot tables, and 1,037 certified transaction records.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                download="Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00F0FF] via-sky-400 to-blue-500 text-black shadow-lg shadow-[#00F0FF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download size={18} className="stroke-[2.5]" />
                <span>Download .xlsx File (4.86 MB)</span>
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <span>Request Custom Excel BI</span>
                <ExternalLink size={15} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px] font-mono text-[var(--muted)]">
              <span>• Compatible: Excel 2016+, Office 365</span>
              <span>• SHA-Verified Data</span>
              <span>• Zero Third-Party Dependencies</span>
            </div>
          </div>
        </section>

      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center overflow-auto animate-in fade-in duration-200"
        >
          <div className="w-full max-w-6xl flex items-center justify-between text-white mb-3">
            <span className="text-xs sm:text-sm font-mono font-bold text-[#00F0FF]">
              {activeTab.sheetLabel} — High-Resolution Preview
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <X size={16} />
              <span>Close</span>
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full max-h-[85vh] overflow-auto rounded-xl border border-white/20 bg-black p-2 shadow-2xl"
          >
            <Image
              src={activeTab.imageSrc}
              alt={activeTab.name}
              width={activeTab.width}
              height={activeTab.height}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
