'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import {
  BarChart3,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Zap,
  TrendingUp,
  Lock,
  Download,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Database,
  Users,
  PieChart,
  Table,
  Check,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Workflow
} from 'lucide-react';

interface SampleDataset {
  id: string;
  name: string;
  category: string;
  rowCount: string;
  kpis: {
    label: string;
    value: string;
    sub: string;
    trend: string;
    positive: boolean;
  }[];
  breakdown: {
    category: string;
    share: number;
    amount: string;
  }[];
  formulaAudit: string;
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'sales',
    name: 'Sales Revenue & Pipeline MIS',
    category: 'Commercial Operations',
    rowCount: '1,420 rows',
    kpis: [
      { label: 'Total Revenue', value: '$482,910', sub: 'Formula: SUM(sale_amount)', trend: '+14.2% MoM', positive: true },
      { label: 'Total Orders', value: '1,420', sub: 'Formula: COUNT(order_id)', trend: '100% Fulfilled', positive: true },
      { label: 'Avg Order Value', value: '$340.08', sub: 'Formula: AVG(sale_amount)', trend: '+$24 vs baseline', positive: true },
      { label: 'Top Segment', value: 'Enterprise', sub: '42.8% of Total Volume', trend: 'Key Growth Driver', positive: true },
    ],
    breakdown: [
      { category: 'Enterprise Tier', share: 42.8, amount: '$206,685' },
      { category: 'Mid-Market SMB', share: 31.4, amount: '$151,634' },
      { category: 'Self-Serve SaaS', share: 18.2, amount: '$87,890' },
      { category: 'Custom Integrations', share: 7.6, amount: '$36,701' },
    ],
    formulaAudit: '=SUMIFS(Sales_Amount, Order_Date, ">=2026-01-01", Status, "Completed")'
  },
  {
    id: 'rider-ops',
    name: 'Hyperlocal Fleet & Rider MIS',
    category: 'Logistics & Quick-Commerce',
    rowCount: '4,140 rows',
    kpis: [
      { label: 'Total Net Payout', value: '₹4,89,900', sub: 'Formula: SUM(Net_Payout)', trend: '100% Reconciled', positive: true },
      { label: 'Completed Deliveries', value: '4,140', sub: 'Formula: COUNT(trip_id)', trend: '103.5% vs SLA', positive: true },
      { label: 'Avg Trips / Active Day', value: '11.5', sub: 'Formula: Trips / Days_Present', trend: 'Target: 10+', positive: true },
      { label: 'Fleet Attendance', value: '89.7%', sub: 'Formula: Present / Scheduled', trend: '268 / 300 shifts', positive: true },
    ],
    breakdown: [
      { category: 'South Mumbai Central', share: 32.5, amount: '₹1,59,200' },
      { category: 'Andheri East Hub', share: 28.0, amount: '₹1,37,172' },
      { category: 'Powai Tech Corridor', share: 22.5, amount: '₹1,10,227' },
      { category: 'Bandra West Terminal', share: 17.0, amount: '₹83,301' },
    ],
    formulaAudit: '=SUMPRODUCT((Attendance="Present")*(Trips>=11)*Bonus_Rate)+Gross_Pay-Deductions'
  },
  {
    id: 'hr-headcount',
    name: 'HR Headcount & Payroll MIS',
    category: 'People Operations',
    rowCount: '320 rows',
    kpis: [
      { label: 'Active Workforce', value: '320', sub: 'Formula: COUNTIF(status="Active")', trend: '+12 Net Hires', positive: true },
      { label: 'Monthly Payroll', value: '₹1.42 Cr', sub: 'Formula: SUM(gross_salary)', trend: 'Within 98% Budget', positive: true },
      { label: 'Retention Rate', value: '94.2%', sub: 'Formula: 1 - (Attr / Avg_HC)', trend: '+2.1% YoY', positive: true },
      { label: 'Avg Tenure', value: '2.8 yrs', sub: 'Formula: AVG(tenure_months)', trend: 'Stable cohort', positive: true },
    ],
    breakdown: [
      { category: 'Data & Engineering', share: 44.0, amount: '₹62.48 L' },
      { category: 'Operations & Logistics', share: 26.5, amount: '₹37.63 L' },
      { category: 'Sales & Commercial', share: 18.5, amount: '₹26.27 L' },
      { category: 'Corporate & Finance', share: 11.0, amount: '₹15.62 L' },
    ],
    formulaAudit: '=COUNTIFS(Department, "Engineering", Status, "Active", Salary, ">1500000")'
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Aging MIS',
    category: 'Supply Chain',
    rowCount: '2,890 rows',
    kpis: [
      { label: 'Total Stock Valuation', value: '₹84.6 L', sub: 'Formula: SUM(Units * Cost)', trend: 'Optimal Range', positive: true },
      { label: 'In-Stock SKUs', value: '2,890', sub: 'Formula: COUNT(sku_id)', trend: '99.1% In-Stock', positive: true },
      { label: 'Fast Moving SKUs', value: '184', sub: 'Formula: Stock_Turnover > 12', trend: 'High Velocity', positive: true },
      { label: 'Aged Stock (>60d)', value: '3.2%', sub: 'Formula: Aged / Total_Stock', trend: '-1.4% MoM', positive: true },
    ],
    breakdown: [
      { category: 'FMCG Essentials', share: 51.2, amount: '₹43.31 L' },
      { category: 'Cold Storage Dairy', share: 24.8, amount: '₹20.98 L' },
      { category: 'Packaged Foods', share: 16.0, amount: '₹13.53 L' },
      { category: 'Non-Food FMCG', share: 8.0, amount: '₹6.78 L' },
    ],
    formulaAudit: '=IF(Days_In_Stock>60, "Aged - Clearance Needed", "Healthy Velocity")'
  }
];

export default function OpenMisToolPage() {
  const [activeDataset, setActiveDataset] = useState<SampleDataset>(SAMPLE_DATASETS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300">
      <Navbar />

      <main className="boxed-wrapper !max-w-[1360px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent relative pb-28">
        <Crosshair position="tl" />

        {/* ── 1. HERO SECTION ── */}
        <section className="pt-8 pb-12 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                100% In-Browser Processing • Zero Telemetry
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
                <Cpu size={14} className="text-indigo-600 dark:text-indigo-400" />
                Web Worker Analytics Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface2)] text-[var(--muted)] border border-[var(--border)]">
                <FileSpreadsheet size={14} className="text-[var(--accent)]" />
                CSV &amp; Multi-Sheet Excel
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Nexdial OpenMIS™ — Free, Privacy-First{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
                MIS &amp; Excel Dashboard Builder
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
              Transform raw Excel workbooks and CSV spreadsheets into interactive, presentation-ready business dashboards in minutes. Zero accounts required, zero subscription fees, and <strong>100% client-side privacy</strong> — your cell data never leaves your device.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href="https://app.nexdial.io/app/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-[var(--accent)] hover:brightness-105 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer no-underline"
              >
                <Sparkles size={18} />
                <span>Launch OpenMIS Web App</span>
                <ExternalLink size={15} className="opacity-70" />
              </a>

              <a
                href="https://app.nexdial.io/templates"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-[var(--surface2)] hover:bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] transition-all cursor-pointer no-underline"
              >
                <FileSpreadsheet size={16} className="text-emerald-500" />
                <span>Explore MIS Templates</span>
                <ArrowRight size={14} className="opacity-60" />
              </a>

              <a
                href="https://github.com/sabledattatray/app.nexdial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline"
              >
                <Database size={15} />
                <span>GitHub Source (MIT)</span>
              </a>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[var(--muted)] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                No Sign-Up or Credit Card
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-emerald-500" />
                Runs 100% in Browser Memory
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                Deterministic, Traceable Math
              </span>
              <span className="flex items-center gap-1.5">
                <Download size={14} className="text-emerald-500" />
                DDE Sanitized CSV &amp; PDF Export
              </span>
            </div>

          </div>
        </section>

        {/* ── 2. INTERACTIVE DEMO SIMULATOR ── */}
        <section className="py-14 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  LIVE INTERACTIVE ENGINE SIMULATOR
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-[var(--text)]">
                  Preview How OpenMIS Analyzes Spreadsheets
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 max-w-xl">
                  Select a business domain below to see how OpenMIS automatically profiles columns, extracts KPIs, and maps categorical distributions.
                </p>
              </div>

              {/* Dataset Selector Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--surface2)] rounded-lg border border-[var(--border)]">
                {SAMPLE_DATASETS.map((dataset) => {
                  const isActive = activeDataset.id === dataset.id;
                  return (
                    <button
                      key={dataset.id}
                      type="button"
                      onClick={() => setActiveDataset(dataset)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs border border-[var(--border)]'
                          : 'text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {dataset.name.split(' ')[0]} {dataset.name.split(' ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Simulation Dashboard Card */}
            <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                      <span>{activeDataset.name}</span>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--muted)] border border-[var(--border)]">
                        {activeDataset.rowCount}
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--muted)]">
                      Domain: <strong className="text-[var(--text)] font-medium">{activeDataset.category}</strong> • Engine: <span className="text-emerald-600 dark:text-emerald-400 font-mono">Web Worker Local Memory</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`https://app.nexdial.io/app/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto no-underline"
                >
                  <Sparkles size={13} />
                  <span>Open This In Nexdial</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* 4 Generated KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeDataset.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/40 hover:bg-[var(--surface2)]/80 transition-all space-y-2"
                  >
                    <div className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--muted)]">
                      {kpi.label}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
                      {kpi.value}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {kpi.trend}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] truncate max-w-[120px]" title={kpi.sub}>
                        {kpi.sub.split(':')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Breakdown & Formula Auditing Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Visual Categorical Distribution */}
                <div className="lg:col-span-7 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                      <PieChart size={14} className="text-indigo-500" />
                      Automatic Distribution Mapping (Apache ECharts)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">Categorical Split</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {activeDataset.breakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[var(--text)]">{item.category}</span>
                          <span className="font-mono text-[var(--muted)]">
                            {item.amount} ({item.share}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${item.share}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deterministic Formula Audit Box */}
                <div className="lg:col-span-5 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                        <Table size={14} className="text-emerald-500" />
                        Formula Transparency Audit
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                        Zero Black Box
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                      Unlike generative AI tools that hallucinate totals, OpenMIS implements deterministic arithmetic and statistical methods:
                    </p>
                    <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all overflow-x-auto shadow-2xs">
                      {activeDataset.formulaAudit}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      IQR Outliers Neutralized
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock size={13} className="text-emerald-500" />
                      0 Bytes Uploaded
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ── 3. HOW OPENMIS WORKS (4-STEP WORKFLOW) ── */}
        <section className="py-14 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto space-y-10">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                ENGINEERING SPECIFICATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                From Raw Workbook to Decision Cockpit in 4 Steps
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)]">
                Engineered for speed, privacy, and mathematical reliability without requiring Python, SQL, or cloud setup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Step 1 */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20 font-mono">
                  01
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Drag &amp; Drop Spreadsheet</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Support for multi-sheet <code className="font-mono text-emerald-500">.xlsx</code> workbooks and <code className="font-mono text-emerald-500">.csv</code> files. Files are parsed inside an isolated browser Web Worker without blocking your browser UI.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20 font-mono">
                  02
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Automated Type Profiling</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  The profiler automatically detects timestamp columns, categorical labels, numerical measures, and primary IDs. Detects null values, duplicate rows, and statistical anomalies using IQR.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20 font-mono">
                  03
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Dynamic Visual Assembly</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Calculates executive KPI totals, MoM variances, and generates high-performance Apache ECharts (time-series, categorical bars, doughnut splits, scatter clusters) mapped to your distribution.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20 font-mono">
                  04
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Sanitized Export &amp; PDF</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Filter dimensions, customize charts, and export sanitized CSVs (all formula injection characters like <code className="font-mono text-emerald-500">=, +, @, -</code> neutralized) or print-ready PDF reports.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. PRIVACY & ARCHITECTURE COMPARISON ── */}
        <section className="py-14 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto space-y-10">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                PRIVACY FIRST ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                Why OpenMIS Outperforms Cloud BI for Sensitive Data
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)]">
                Most online analytics tools transmit your proprietary financials, salary sheets, and client rosters to remote clouds. OpenMIS operates like a desktop tool in your web browser.
              </p>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-x-auto border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface2)] font-bold text-[var(--text)] text-[11px]">
                    <th className="py-3.5 px-4">Evaluation Criteria</th>
                    <th className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-black">Nexdial OpenMIS™</th>
                    <th className="py-3.5 px-4 text-[var(--muted)]">Power BI Service</th>
                    <th className="py-3.5 px-4 text-[var(--muted)]">Google Looker Studio</th>
                    <th className="py-3.5 px-4 text-[var(--muted)]">Raw Excel Spreadsheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">Data Residency</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">100% Local Device (RAM)</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Microsoft Azure Cloud</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Google Cloud Platform</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Local Drive / OneDrive</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">Spreadsheet Telemetry</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Zero Data Collected</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Full Tenant Telemetry</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Google Cloud Telemetry</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Microsoft Diagnostic Data</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">Time to First Dashboard</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">&lt; 30 Seconds (Instant)</td>
                    <td className="py-3 px-4 text-[var(--muted)]">20 – 60 Minutes</td>
                    <td className="py-3 px-4 text-[var(--muted)]">15 – 45 Minutes</td>
                    <td className="py-3 px-4 text-[var(--muted)]">1 – 3 Hours (Manual)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">Subscription Cost</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">₹0 / Free Forever (MIT)</td>
                    <td className="py-3 px-4 text-[var(--muted)]">$10 – $20 / user / mo</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Free (Looker Pro $9/mo)</td>
                    <td className="py-3 px-4 text-[var(--muted)]">M365 License Needed</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">Offline Capability</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Yes (PWA &amp; IndexedDB)</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Requires Connection</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Requires Connection</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Yes (Desktop App)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">DDE Injection Security</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Built-in Auto-Sanitizer</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Manual Export Handling</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Not Sanitized by Default</td>
                    <td className="py-3 px-4 text-[var(--muted)]">Vulnerable to Formulas</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* ── 5. PRE-BUILT MIS TEMPLATES ── */}
        <section className="py-14 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  READY-TO-USE BLUEPRINTS
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] mt-1">
                  Featured MIS Templates on Nexdial
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                  Load pre-configured industry templates or download sanitized sample datasets to test immediately.
                </p>
              </div>

              <a
                href="https://app.nexdial.io/templates"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:underline no-underline"
              >
                <span>Browse All Templates on Nexdial</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: 'Sales & Revenue MIS',
                  desc: 'Executive commercial dashboard with MoM growth tracking, deal velocity, and regional revenue breakdown.',
                  icon: TrendingUp,
                  color: 'text-emerald-500',
                  url: 'https://app.nexdial.io/app/new'
                },
                {
                  title: 'Hyperlocal Rider Ops',
                  desc: 'Fleet delivery auditing, incentive threshold verification, shift surge analytics, and net payout reconciliation.',
                  icon: Activity,
                  color: 'text-blue-500',
                  url: 'https://app.nexdial.io/app/new'
                },
                {
                  title: 'HR Headcount & Payroll',
                  desc: 'Departmental salary distribution, employee tenure cohorts, retention analysis, and absenteeism ratios.',
                  icon: Users,
                  color: 'text-indigo-500',
                  url: 'https://app.nexdial.io/app/new'
                },
                {
                  title: 'Inventory & Stock Aging',
                  desc: 'SKU velocity classification, holding cost valuation, dead-stock flags, and supplier fulfillment metrics.',
                  icon: Database,
                  color: 'text-amber-500',
                  url: 'https://app.nexdial.io/app/new'
                },
              ].map((tmpl, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)]/50 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[var(--surface2)] flex items-center justify-center border border-[var(--border)]">
                      <tmpl.icon size={18} className={tmpl.color} />
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text)]">{tmpl.title}</h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>

                  <a
                    href={tmpl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline pt-2 no-underline"
                  >
                    <span>Use Template</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
        <section className="py-14 px-4 sm:px-6 md:px-8 border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                CLARITY &amp; TECHNICAL FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                Frequently Asked Questions About OpenMIS
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Is my spreadsheet data really 100% private and local?',
                  a: 'Yes. Unlike typical SaaS tools that upload your files to AWS or Google Cloud servers for backend parsing, Nexdial OpenMIS runs its entire data pipeline inside your local browser via a Web Worker. If you open your browser Developer Tools Network tab, you will observe zero data payload bytes transmitted when parsing or interacting with your spreadsheets.'
                },
                {
                  q: 'Can OpenMIS process large multi-sheet Excel workbooks?',
                  a: 'Yes. OpenMIS supports both .csv and complex multi-sheet .xlsx files. Its memory-efficient parsing engine comfortably handles workbooks with dozens of sheets and tens of thousands of rows without crashing the browser thread.'
                },
                {
                  q: 'Does it require an account, credit card, or installation?',
                  a: 'No. OpenMIS is 100% free software licensed under MIT. You do not need to register, provide an email address, or install any software. You simply visit app.nexdial.io and begin analyzing your spreadsheets immediately.'
                },
                {
                  q: 'What is DDE Formula Injection and how does OpenMIS protect against it?',
                  a: 'When exporting data to CSV, malicious or malformed cells starting with =, +, -, or @ can trigger formula execution when opened in desktop Microsoft Excel (Dynamic Data Exchange attacks). OpenMIS includes an automated formula neutralizer that sanitizes export strings to ensure your exported files are safe for corporate distribution.'
                },
                {
                  q: 'Can I use OpenMIS offline without an internet connection?',
                  a: 'Yes. OpenMIS is built as an offline-ready Progressive Web Application (PWA). Once loaded in your browser cache, the Web Worker and client-side visualization library can parse spreadsheets and render dashboards completely offline.'
                },
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[var(--text)] hover:bg-[var(--surface2)]/40 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-[var(--muted)] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ── 7. FINAL LAUNCH CTA BANNER ── */}
        <section className="pt-14 px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface2)] to-[var(--surface)] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <Zap size={14} className="text-emerald-500" />
              <span>Instant Setup • No Waiting</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              Ready to Turn Your Spreadsheets Into Interactive Dashboards?
            </h2>

            <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
              Launch Nexdial OpenMIS right now in your web browser. Upload your file, customize metrics, and generate clean executive reports without sharing private data with anyone.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://app.nexdial.io/app/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-[var(--accent)] hover:brightness-105 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer no-underline"
              >
                <Sparkles size={18} />
                <span>Open Nexdial OpenMIS Now</span>
                <ExternalLink size={15} />
              </a>

              <a
                href="/dashboards/rider-ops"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] transition-all cursor-pointer no-underline"
              >
                <Table size={16} className="text-[var(--accent)]" />
                <span>View Rider Ops Excel MIS Demo</span>
              </a>
            </div>

            <div className="text-[11px] text-[var(--muted)] pt-2 font-mono">
              Designed &amp; Engineered by Datta Sable • MIT Open Source Software
            </div>

          </div>
        </section>

        <Crosshair position="br" />
      </main>

      <Footer />
    </div>
  );
}
