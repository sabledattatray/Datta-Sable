'use client';

import React, { useState } from 'react';
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
  Workflow,
  XCircle,
  CheckCircle,
  Terminal,
  Share2
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
  formulaDesc: string;
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'sales',
    name: 'Sales Revenue & Pipeline MIS',
    category: 'Commercial Operations',
    rowCount: '1,420 rows',
    kpis: [
      { label: 'Total Revenue', value: '$482,910', sub: 'SUM(sale_amount)', trend: '+14.2% MoM', positive: true },
      { label: 'Total Orders', value: '1,420', sub: 'COUNT(order_id)', trend: '100% Fulfilled', positive: true },
      { label: 'Avg Order Value', value: '$340.08', sub: 'AVERAGE(sale_amount)', trend: '+$24 vs Base', positive: true },
      { label: 'Top Cohort', value: 'Enterprise', sub: '42.8% of Gross', trend: 'Key Growth Vector', positive: true },
    ],
    breakdown: [
      { category: 'Enterprise Tier', share: 42.8, amount: '$206,685' },
      { category: 'Mid-Market SMB', share: 31.4, amount: '$151,634' },
      { category: 'Self-Serve SaaS', share: 18.2, amount: '$87,890' },
      { category: 'Custom Solutions', share: 7.6, amount: '$36,701' },
    ],
    formulaAudit: '=SUMIFS(Sales_Amount, Order_Date, ">=2026-01-01", Status, "Completed")',
    formulaDesc: 'Deterministic sum of settled enterprise invoices matching active accounting fiscal year.'
  },
  {
    id: 'rider-ops',
    name: 'Hyperlocal Fleet & Rider Ops MIS',
    category: 'Logistics & Quick-Commerce',
    rowCount: '4,140 rows',
    kpis: [
      { label: 'Net Payout Reconciled', value: '₹4,89,900', sub: 'SUM(Net_Payout)', trend: '100% Reconciled', positive: true },
      { label: 'Completed Deliveries', value: '4,140', sub: 'COUNT(trip_id)', trend: '103.5% vs SLA', positive: true },
      { label: 'Trips / Active Day', value: '11.5', sub: 'Trips / Days_Present', trend: 'Target: 10+', positive: true },
      { label: 'Fleet Attendance', value: '89.7%', sub: 'Present / Scheduled', trend: '268 / 300 shifts', positive: true },
    ],
    breakdown: [
      { category: 'South Mumbai Central', share: 32.5, amount: '₹1,59,200' },
      { category: 'Andheri East Hub', share: 28.0, amount: '₹1,37,172' },
      { category: 'Powai Tech Corridor', share: 22.5, amount: '₹1,10,227' },
      { category: 'Bandra West Terminal', share: 17.0, amount: '₹83,301' },
    ],
    formulaAudit: '=SUMPRODUCT((Attendance="Present")*(Trips>=11)*Bonus_Rate)+Gross_Pay-Deductions',
    formulaDesc: 'Multi-criteria conditional payout matrix evaluating trip targets, shift presence, and penalty deductions.'
  },
  {
    id: 'hr-headcount',
    name: 'HR Headcount & Payroll MIS',
    category: 'People Operations',
    rowCount: '320 rows',
    kpis: [
      { label: 'Active Workforce', value: '320', sub: 'COUNTIFS(Status="Active")', trend: '+12 Net Hires', positive: true },
      { label: 'Monthly Payroll', value: '₹1.42 Cr', sub: 'SUM(Gross_Salary)', trend: 'Within 98% Budget', positive: true },
      { label: 'Retention Rate', value: '94.2%', sub: '1 - (Exits / Total)', trend: '+2.1% YoY', positive: true },
      { label: 'Avg Tenure', value: '2.8 yrs', sub: 'AVERAGE(Tenure_Days)', trend: 'Stable cohort', positive: true },
    ],
    breakdown: [
      { category: 'Data & Engineering', share: 44.0, amount: '₹62.48 L' },
      { category: 'Operations & Logistics', share: 26.5, amount: '₹37.63 L' },
      { category: 'Sales & Growth', share: 18.5, amount: '₹26.27 L' },
      { category: 'Finance & Legal', share: 11.0, amount: '₹15.62 L' },
    ],
    formulaAudit: '=COUNTIFS(Department, "Engineering", Status, "Active", Salary, ">1500000")',
    formulaDesc: 'Exact count of core senior technical headcount meeting high-compensation band criteria.'
  },
  {
    id: 'inventory',
    name: 'Inventory Stock Aging & Turnover MIS',
    category: 'Supply Chain & Warehousing',
    rowCount: '890 SKUs',
    kpis: [
      { label: 'Total Valuation', value: '₹84.6 L', sub: 'SUMPRODUCT(Qty, Unit_Cost)', trend: '890 Active SKUs', positive: true },
      { label: 'Stock Turn Ratio', value: '6.4x', sub: 'COGS / Avg_Inventory', trend: 'High Velocity', positive: true },
      { label: 'Obsolete (>90d)', value: '4.8%', sub: 'Aging > 90d / Total', trend: '-1.4% vs Q1', positive: true },
      { label: 'Fulfillment Rate', value: '99.1%', sub: 'Dispatched / Ordered', trend: 'Exceeds SLA', positive: true },
    ],
    breakdown: [
      { category: 'Fresh Stock (< 30d)', share: 58.0, amount: '₹49.07 L' },
      { category: 'Standard Turn (30-60d)', share: 26.0, amount: '₹21.99 L' },
      { category: 'Slow Moving (60-90d)', share: 11.2, amount: '₹9.48 L' },
      { category: 'Critical Obsolete (>90d)', share: 4.8, amount: '₹4.06 L' },
    ],
    formulaAudit: '=IF(Days_In_Stock>90, "Critical Obsolete", IF(Days_In_Stock>60, "Slow Moving", "Healthy"))',
    formulaDesc: 'Nested condition classifying SKU inventory aging into liquidity danger zones.'
  }
];

export default function OpenMisToolPage() {
  const [activeDataset, setActiveDataset] = useState<SampleDataset>(SAMPLE_DATASETS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <main className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        
        {/* Precision Crosshair Decorators */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.3 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.3 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* ── 1. HERO SECTION ── */}
        <section className="section" style={{ paddingTop: 'clamp(5rem, 8vw, 7rem)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ maxWidth: '880px', marginBottom: '2.5rem' }}>
              
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-[var(--accent)]" size={22} />
                <span className="label-tech">FLAGSHIP_TOOL // ZERO_CLOUD_MIS</span>
              </div>

              <h1 style={{ 
                fontFamily: 'var(--font-syne)', 
                fontSize: 'clamp(2.4rem, 6vw, 44px)', 
                fontWeight: 700, 
                lineHeight: 1.15, 
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem' 
              }}>
                Nexdial OpenMIS™ — <span className="hero-title">Client-Side Dashboard Builder</span>
              </h1>

              <p style={{ 
                color: 'var(--muted)', 
                fontSize: '1.08rem', 
                lineHeight: 1.7, 
                maxWidth: '740px',
                marginBottom: '2rem' 
              }}>
                Transform raw Excel spreadsheets and multi-sheet CSVs into executive, interactive BI dashboards in seconds. Zero account sign-up, zero server uploads, and <strong>100% in-browser Web Worker computation</strong> — your financial, payroll, and operational data never leaves your device.
              </p>

              {/* Technical Capability Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded">
                  <ShieldCheck size={13} className="text-[var(--accent)]" />
                  Zero Telemetry • 0KB Network Ingestion
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded">
                  <Cpu size={13} className="text-[var(--accent)]" />
                  Web Worker Parsing Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded">
                  <FileSpreadsheet size={13} className="text-[var(--accent)]" />
                  Multi-Sheet .xlsx &amp; .csv Support
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://app.nexdial.io/app/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2.5 no-underline"
                  style={{ padding: '0.9rem 1.85rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <Sparkles size={16} />
                  <span>Launch OpenMIS Web App</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>

                <a
                  href="https://app.nexdial.io/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2 no-underline"
                  style={{ 
                    padding: '0.9rem 1.75rem', 
                    borderRadius: '4px', 
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer'
                  }}
                >
                  <FileSpreadsheet size={15} className="text-[var(--accent)]" />
                  <span>Explore MIS Templates</span>
                  <ArrowRight size={13} className="opacity-70" />
                </a>

                <a
                  href="https://github.com/sabledattatray/app.nexdial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline px-3 py-2"
                >
                  <Database size={14} />
                  <span>GitHub Source (MIT)</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[var(--muted)] font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[var(--accent)]" />
                  100% Free &amp; Open-Source
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={13} className="text-[var(--accent)]" />
                  Zero Third-Party Cloud Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[var(--accent)]" />
                  Deterministic Excel Formula Math
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={13} className="text-[var(--accent)]" />
                  DDE Sanitized CSV &amp; PDF Export
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. LIVE INTERACTIVE ENGINE SIMULATOR ── */}
        <section className="section" style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            
            <div className="mb-8">
              <div className="label-tech mb-2">SIMULATED_WORKER_ENGINE // V2.4</div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.75rem, 4vw, 32px)', fontWeight: 600, marginBottom: '0.75rem' }}>
                Preview How OpenMIS <span className="hero-title">Profiles Spreadsheets</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.6 }}>
                Select a business domain below to witness real-time column type inference, KPI card aggregation, categorical distribution mapping, and transparent formula audits.
              </p>
            </div>

            {/* The Terminal Sandbox Container */}
            <div 
              style={{ 
                background: 'var(--surface)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius)',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
            >
              
              {/* Terminal Title Bar */}
              <div 
                style={{ 
                  background: 'var(--surface2)', 
                  borderBottom: '1px solid var(--border)', 
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                  <span className="mono text-[11px] font-bold text-[var(--text)] tracking-wider ml-2">
                    NEXDIAL_PARSER_CONSOLE // IN_BROWSER_ISOLATION
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                    THREAD: WEB_WORKER_01
                  </span>
                  <span className="hidden sm:inline">NETWORK_TRANSFER: 0 KB</span>
                  <span className="hidden sm:inline">LATENCY: &lt; 18ms</span>
                </div>
              </div>

              {/* Segmented Domain Tabs */}
              <div 
                style={{ 
                  background: 'var(--bg)', 
                  borderBottom: '1px solid var(--border)', 
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                {SAMPLE_DATASETS.map((ds) => {
                  const isActive = activeDataset.id === ds.id;
                  return (
                    <button
                      key={ds.id}
                      type="button"
                      onClick={() => setActiveDataset(ds)}
                      style={{
                        padding: '0.55rem 1.15rem',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: isActive ? 'var(--surface)' : 'transparent',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: isActive ? 'var(--accent)' : 'var(--muted)',
                        opacity: isActive ? 1 : 0.4
                      }} />
                      {ds.name.split('&')[0].trim()}
                    </button>
                  );
                })}
              </div>

              {/* Active Dataset Overview Banner */}
              <div 
                style={{ 
                  padding: '1.25rem 1.5rem', 
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                      {activeDataset.name}
                    </h3>
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
                      {activeDataset.rowCount}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] font-mono m-0">
                    Domain: <span className="text-[var(--text)]">{activeDataset.category}</span> • Memory Residency: <span className="text-[var(--accent)]">Client RAM (IndexedDB)</span>
                  </p>
                </div>

                <a
                  href="https://app.nexdial.io/app/report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2 text-[11px] font-mono no-underline"
                  style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '4px', 
                    border: '1px solid var(--border)',
                    background: 'var(--surface)'
                  }}
                >
                  <span>Open Full Dashboard In Nexdial</span>
                  <ExternalLink size={12} className="text-[var(--accent)]" />
                </a>
              </div>

              {/* KPI Cards Grid */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {activeDataset.kpis.map((kpi, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                        position: 'relative'
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="mono text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                          {kpi.label}
                        </span>
                        <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                          {kpi.trend}
                        </span>
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
                        {kpi.value}
                      </div>

                      <div className="mono text-[10px] text-[var(--muted)] flex items-center gap-1 truncate">
                        <span className="text-[var(--accent)] font-bold">fx:</span> {kpi.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Distribution & Formula Audit Split */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                  gap: '1.25rem' 
                }}>
                  
                  {/* Category Distribution Progress Bars */}
                  <div 
                    style={{ 
                      background: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      padding: '1.25rem' 
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <PieChart size={15} className="text-[var(--accent)]" />
                        <span className="mono text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">
                          Categorical Distribution Mapping
                        </span>
                      </div>
                      <span className="mono text-[10px] text-[var(--muted)]">Apache ECharts Engine</span>
                    </div>

                    <div className="space-y-3.5">
                      {activeDataset.breakdown.map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[var(--text)]">{item.category}</span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="text-[var(--text)] font-semibold">{item.amount}</span>
                              <span className="text-[var(--muted)]">({item.share}%)</span>
                            </div>
                          </div>

                          {/* Progress track */}
                          <div style={{ width: '100%', height: '8px', background: 'var(--surface2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                width: `${item.share}%`, 
                                height: '100%', 
                                background: i === 0 ? 'var(--accent)' : 'linear-gradient(90deg, var(--accent) 0%, rgba(201, 243, 29, 0.4) 100%)',
                                borderRadius: '999px',
                                transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formula Transparency Audit Card */}
                  <div 
                    style={{ 
                      background: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Terminal size={15} className="text-[var(--accent)]" />
                          <span className="mono text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">
                            Formula Transparency Audit
                          </span>
                        </div>
                        <span className="mono text-[9px] px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)] font-semibold">
                          ZERO_BLACK_BOX
                        </span>
                      </div>

                      <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                        {activeDataset.formulaDesc}
                      </p>

                      {/* Code Block */}
                      <div 
                        style={{ 
                          background: 'var(--surface2)', 
                          border: '1px solid var(--border)', 
                          borderRadius: '6px', 
                          padding: '0.85rem 1rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text)',
                          lineHeight: 1.6,
                          overflowX: 'auto'
                        }}
                      >
                        <div className="text-[var(--muted)] text-[10px] mb-1">// Deterministic Excel Logic:</div>
                        <code className="text-[var(--accent)] font-semibold">{activeDataset.formulaAudit}</code>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[var(--muted)]">
                      <span className="flex items-center gap-1.5">
                        <Check size={12} className="text-[var(--accent)]" />
                        IQR Outlier Scrubbing Applied
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Lock size={12} className="text-[var(--accent)]" />
                        RAM-Isolated Execution
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ── 3. FOUR-STEP ENGINEERING PIPELINE ── */}
        <section className="section" style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            
            <div className="mb-10">
              <div className="label-tech mb-2">ENGINEERING_SPECIFICATION</div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.75rem, 4vw, 32px)', fontWeight: 600, marginBottom: '0.75rem' }}>
                From Raw Spreadsheet to <span className="hero-title">Decision Cockpit</span> in 4 Steps
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.6 }}>
                Engineered for speed, privacy, and mathematical traceability without requiring Python scripts, SQL servers, or cloud subscriptions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              
              {/* Step 1 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)' }}>
                <div className="mono text-[11px] font-bold text-[var(--accent)] tracking-widest bg-[var(--surface2)] px-2.5 py-1 border border-[var(--border)] inline-block mb-4 rounded">
                  PHASE_01 // INGESTION
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  Drag &amp; Drop Spreadsheet
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  Supports multi-sheet <code className="font-mono text-[var(--accent)]">.xlsx</code> workbooks and <code className="font-mono text-[var(--accent)]">.csv</code> files. Stream-parsed in isolated background Web Workers with 0KB cloud upload.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)' }}>
                <div className="mono text-[11px] font-bold text-[var(--accent)] tracking-widest bg-[var(--surface2)] px-2.5 py-1 border border-[var(--border)] inline-block mb-4 rounded">
                  PHASE_02 // PROFILING
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  Automated Type Profiling
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  Automatically indexes timestamp formats, categorical dimensions, numerical measures, and primary keys. Flags duplicate rows and cleans mathematical outliers via IQR.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)' }}>
                <div className="mono text-[11px] font-bold text-[var(--accent)] tracking-widest bg-[var(--surface2)] px-2.5 py-1 border border-[var(--border)] inline-block mb-4 rounded">
                  PHASE_03 // RENDERING
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  Dynamic Visual Assembly
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  Aggregates executive KPIs, MoM growth deltas, and renders high-performance Apache ECharts (time-series, split doughnuts, stacked bars, scatter correlations).
                </p>
              </div>

              {/* Step 4 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)' }}>
                <div className="mono text-[11px] font-bold text-[var(--accent)] tracking-widest bg-[var(--surface2)] px-2.5 py-1 border border-[var(--border)] inline-block mb-4 rounded">
                  PHASE_04 // EXPORT
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  Sanitized Export &amp; PDF
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  Filter dimensions, customize charts, and export sanitized CSVs (all formula injection vectors like <code className="font-mono text-[var(--accent)]">=, +, @, -</code> neutralized) or print-ready PDF reports.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. ENTERPRISE BI COMPARISON MATRIX ── */}
        <section className="section" style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            
            <div className="mb-10 text-center" style={{ maxWidth: '720px', margin: '0 auto 3rem auto' }}>
              <div className="label-tech mb-2 justify-center">PRIVACY_FIRST_ARCHITECTURE</div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.75rem, 4vw, 32px)', fontWeight: 600, marginBottom: '0.75rem' }}>
                Why OpenMIS Outperforms <span className="hero-title">Cloud BI Platforms</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Traditional cloud BI suites ingest proprietary financials, employee payroll, and confidential client lists to corporate clouds. OpenMIS operates like a hardened desktop tool directly inside your web browser.
              </p>
            </div>

            {/* Comparison Matrix Card */}
            <div 
              style={{ 
                background: 'var(--surface)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Evaluation Vector
                      </th>
                      <th style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.08)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                            Nexdial OpenMIS™
                          </span>
                          <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Power BI Service
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Google Looker Studio
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Raw Excel Workbook
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-xs">
                    
                    {/* Row 1 */}
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        Data Residency &amp; Storage
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        100% Local Device (RAM)
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Microsoft Azure Cloud</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Google Cloud Platform</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Local / OneDrive Cloud</td>
                    </tr>

                    {/* Row 2 */}
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        Spreadsheet Telemetry
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        0 KB Transferred (Zero Telemetry)
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Full Tenant Telemetry</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Google Analytics Telemetry</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Microsoft Diagnostic Logs</td>
                    </tr>

                    {/* Row 3 */}
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        Setup Time to First Dashboard
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        &lt; 30 Seconds (Instant Web)
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>20 – 45 Minutes (Gateway Setup)</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>15 – 30 Minutes</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>1 – 3 Hours (Manual Pivot Building)</td>
                    </tr>

                    {/* Row 4 */}
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        CSV Formula Injection Shield
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        Active Sanitizer (=, +, @, - neutralized)
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Unsanitized Raw Export</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Unsanitized Raw Export</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Vulnerable to DDE exploits</td>
                    </tr>

                    {/* Row 5 */}
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        Software Cost &amp; Licensing
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        ₹0 / Free Forever (MIT Open Source)
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>$10 – $20 / user / mo</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Free (Looker Pro $9/mo)</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Microsoft 365 License Needed</td>
                    </tr>

                    {/* Row 6 */}
                    <tr>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                        Offline PWA Capability
                      </td>
                      <td style={{ padding: '1rem 1.25rem', background: 'rgba(201, 243, 29, 0.04)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
                        Full Offline Execution
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Requires Active Internet</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Requires Active Internet</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)' }}>Offline Desktop App</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. PRE-BUILT MIS BLUEPRINTS ── */}
        <section className="section" style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            
            <div className="mb-10">
              <div className="label-tech mb-2">CURATED_BLUEPRINTS</div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.75rem, 4vw, 32px)', fontWeight: 600, marginBottom: '0.75rem' }}>
                Pre-Engineered <span className="hero-title">MIS Templates</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.6 }}>
                Launch battle-tested operational blueprints with built-in formula models, cohort splits, and executive KPI cards.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              
              {/* Template 1 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                      LOGISTICS // QUICK-COMMERCE
                    </span>
                    <span className="mono text-[10px] text-[var(--muted)]">4,140 rows</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                    Hyperlocal Fleet &amp; Rider Ops
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Driver velocity, trip SLA attainment, shift compliance, and net payout reconciliation across multi-hub city operations.
                  </p>
                </div>
                <a
                  href="https://app.nexdial.io/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-xs font-mono no-underline"
                  style={{ padding: '0.65rem 1rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <span>Launch Blueprint</span>
                  <ExternalLink size={13} className="text-[var(--accent)]" />
                </a>
              </div>

              {/* Template 2 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                      COMMERCIAL // REVENUE
                    </span>
                    <span className="mono text-[10px] text-[var(--muted)]">1,420 rows</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                    B2B SaaS Sales Pipeline
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Tracks pipeline conversion, sales cycle duration, average deal sizes, and quota fulfillment by sales rep.
                  </p>
                </div>
                <a
                  href="https://app.nexdial.io/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-xs font-mono no-underline"
                  style={{ padding: '0.65rem 1rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <span>Launch Blueprint</span>
                  <ExternalLink size={13} className="text-[var(--accent)]" />
                </a>
              </div>

              {/* Template 3 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                      HR // PEOPLE OPS
                    </span>
                    <span className="mono text-[10px] text-[var(--muted)]">320 rows</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                    Executive Headcount &amp; Payroll
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Department salary distributions, compensation band compliance, hiring velocity, and voluntary attrition trends.
                  </p>
                </div>
                <a
                  href="https://app.nexdial.io/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-xs font-mono no-underline"
                  style={{ padding: '0.65rem 1rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <span>Launch Blueprint</span>
                  <ExternalLink size={13} className="text-[var(--accent)]" />
                </a>
              </div>

              {/* Template 4 */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                      SUPPLY CHAIN // WAREHOUSING
                    </span>
                    <span className="mono text-[10px] text-[var(--muted)]">890 SKUs</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                    Inventory Aging &amp; Stock Velocity
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Categorizes aging buckets (&lt;30d, 60d, 90d+), calculates stock turn ratio, and flags slow-moving capital items.
                  </p>
                </div>
                <a
                  href="https://app.nexdial.io/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-xs font-mono no-underline"
                  style={{ padding: '0.65rem 1rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <span>Launch Blueprint</span>
                  <ExternalLink size={13} className="text-[var(--accent)]" />
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* ── 6. TECHNICAL FAQ ACCORDION ── */}
        <section className="section" style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '840px' }}>
            
            <div className="mb-8">
              <div className="label-tech mb-2">SYSTEM_KNOWLEDGE // FAQS</div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.75rem, 4vw, 32px)', fontWeight: 600, marginBottom: '0.75rem' }}>
                Frequently Asked <span className="hero-title">Technical Questions</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Details on security guarantees, formula compatibility, offline capabilities, and architecture.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Is my confidential spreadsheet data really never uploaded to any server?',
                  a: 'Yes, 100%. OpenMIS executes entirely within your browser\'s V8/SpiderMonkey JavaScript runtime using background Web Workers. You can open Developer Tools (F12) -> Network tab and verify that 0 KB of spreadsheet payload is ever dispatched over the network.'
                },
                {
                  q: 'What is CSV / DDE Formula Injection and how does OpenMIS protect me?',
                  a: 'Spreadsheet programs like Microsoft Excel and LibreOffice interpret cells starting with =, +, -, or @ as executable formulas or Dynamic Data Exchange (DDE) commands. Malicious inputs can execute unauthorized system commands upon export. OpenMIS neutralizes these characters during CSV export to ensure zero command injection vulnerabilities.'
                },
                {
                  q: 'Does OpenMIS support multi-sheet .xlsx workbooks?',
                  a: 'Yes. Upon file selection, OpenMIS parses workbook metadata, displays all sheet tabs in a tabbed switcher, and allows you to select which sheet to profile, pivot, or visualize without needing to convert to individual CSV files.'
                },
                {
                  q: 'Can I use OpenMIS completely offline without an internet connection?',
                  a: 'Yes. OpenMIS is built as a progressive web application (PWA) with client-side caching. Once the initial application bundle is loaded, you can disconnect from Wi-Fi or run in air-gapped secure corporate environments.'
                },
                {
                  q: 'How does OpenMIS perform automated outlier detection?',
                  a: 'The profiling engine calculates the First Quartile (Q1), Third Quartile (Q3), and Interquartile Range (IQR = Q3 - Q1) for all numeric series. Any data points beyond [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR] are flagged as statistical anomalies to prevent skewed executive aggregates.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-syne)',
                        fontSize: '1.02rem',
                        fontWeight: 600
                      }}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-[var(--accent)] shrink-0 ml-4" />
                      ) : (
                        <ChevronDown size={18} className="text-[var(--muted)] shrink-0 ml-4" />
                      )}
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ── 7. FINAL HIGH-IMPACT LAUNCH BANNER ── */}
        <section style={{ padding: 'clamp(4rem, 7vw, 5rem) 1.5rem', background: 'var(--surface2)', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '720px' }}>
            <div className="label-tech mb-3 justify-center">FREE // OPEN_SOURCE // PRIVACY_FIRST</div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(2rem, 5vw, 36px)', fontWeight: 700, marginBottom: '1rem' }}>
              Turn Raw Excel Workbooks Into <span className="hero-title">Executive Dashboards</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              No subscriptions, no enterprise seat licenses, and zero cloud uploads. Try Nexdial OpenMIS right now in your browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://app.nexdial.io/app/new"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2.5 text-xs font-bold no-underline"
                style={{ padding: '0.95rem 2rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Sparkles size={16} />
                <span>Launch OpenMIS Web App</span>
                <ExternalLink size={14} className="opacity-80" />
              </a>

              <a
                href="https://github.com/sabledattatray/app.nexdial"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2 text-xs font-mono no-underline"
                style={{ 
                  padding: '0.95rem 1.75rem', 
                  borderRadius: '4px', 
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  cursor: 'pointer'
                }}
              >
                <Database size={15} />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
