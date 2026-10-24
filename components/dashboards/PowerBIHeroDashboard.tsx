'use client';

import { useState, useEffect, useId, useMemo } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Globe2,
  Layers,
  PieChart,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import styles from './PowerBIHeroDashboard.module.css';
import { WORLD_MAP_VIEWBOX, WORLD_MAP_PATHS } from './WorldMapData';
import { useTheme } from '@/components/ThemeProvider';

// ── 1. Color Tone Options (Matching Clarity: Signature, Ocean, Iris, Emerald, Amber, Rose) ──
export interface AccentToneOption {
  id: string;
  name: string;
  dotColor: string;
  primary: string;
  secondary: string;
  accent3: string;
  accent4: string;
  lightPrimary?: string;
  lightSecondary?: string;
}

export const COLOR_TONES: AccentToneOption[] = [
  {
    id: 'signature',
    name: 'Signature',
    dotColor: '#CCF51E',
    primary: '#CCF51E',
    secondary: '#38bdf8',
    accent3: '#c084fc',
    accent4: '#34d399',
    lightPrimary: '#005bbb',
    lightSecondary: '#0284c7',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    dotColor: '#38bdf8',
    primary: '#38bdf8',
    secondary: '#0ea5e9',
    accent3: '#0284c7',
    accent4: '#0369a1',
    lightPrimary: '#0284c7',
    lightSecondary: '#0369a1',
  },
  {
    id: 'iris',
    name: 'Iris',
    dotColor: '#c4b5fd',
    primary: '#c4b5fd',
    secondary: '#a78bfa',
    accent3: '#8b5cf6',
    accent4: '#7c3aed',
    lightPrimary: '#7c3aed',
    lightSecondary: '#6d28d9',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    dotColor: '#34d399',
    primary: '#34d399',
    secondary: '#10b981',
    accent3: '#059669',
    accent4: '#047857',
    lightPrimary: '#047857',
    lightSecondary: '#059669',
  },
  {
    id: 'amber',
    name: 'Amber',
    dotColor: '#fbbf24',
    primary: '#fbbf24',
    secondary: '#f59e0b',
    accent3: '#d97706',
    accent4: '#b45309',
    lightPrimary: '#b45309',
    lightSecondary: '#d97706',
  },
  {
    id: 'rose',
    name: 'Rose',
    dotColor: '#fb7185',
    primary: '#fb7185',
    secondary: '#f43f5e',
    accent3: '#e11d48',
    accent4: '#be123c',
    lightPrimary: '#be123c',
    lightSecondary: '#e11d48',
  },
];

// ── 2. Report Pages Data Model (Distinct from Home & Portfolio) ──
interface KpiItem {
  title: string;
  dax: string;
  baseVal: number;
  format: (n: number) => string;
  delta: string;
  target: string;
  spark: number[];
}

interface MatrixRowItem {
  name: string;
  baseVal: number;
  format: (n: number) => string;
  pct: number;
  variance: string;
}

interface DonutSliceItem {
  label: string;
  share: number;
  amount: string;
}

interface ReportPage {
  id: string;
  tabLabel: string;
  title: string;
  dataset: string;
  kpis: KpiItem[];
  chartTitle: string;
  chartSubtitle: string;
  chartLabels: string[];
  actuals: number[];
  budget: number[];
  priorYear: number[];
  matrixTitle: string;
  matrixRows: MatrixRowItem[];
  donutTitle: string;
  donutSlices: DonutSliceItem[];
}

const REPORT_PAGES: ReportPage[] = [
  {
    id: 'revenue-ops',
    tabLabel: '1. Revenue & SLA Matrix',
    title: 'Global Commercial Operations & SLA Cockpit',
    dataset: 'Fabric Direct Lake · Live DAX',
    kpis: [
      {
        title: 'Gross Revenue YTD',
        dax: 'CALCULATE([Gross Sales], DATESYTD(Date[Date]))',
        baseVal: 48.62,
        format: (n) => `$${n.toFixed(2)}M`,
        delta: '+14.8% YoY',
        target: 'Target: $42.3M',
        spark: [32, 38, 41, 45, 42, 54, 58, 62],
      },
      {
        title: 'OTIF Fulfillment SLA',
        dax: 'DIVIDE([OnTime InFull], [Total Shipments])',
        baseVal: 99.2,
        format: (n) => `${n.toFixed(1)}%`,
        delta: '+0.7% vs Goal',
        target: 'Goal: 98.5%',
        spark: [97, 98, 97.5, 98.8, 99.1, 99.0, 99.4, 99.2],
      },
      {
        title: 'Blended Gross Margin',
        dax: 'DIVIDE([Gross Margin], [Net Revenue])',
        baseVal: 34.8,
        format: (n) => `${n.toFixed(1)}%`,
        delta: '+2.4% vs Budget',
        target: 'Budget: 32.4%',
        spark: [28, 30, 31, 33, 32, 34, 35, 34.8],
      },
      {
        title: 'Contracted B2B Accounts',
        dax: 'DISTINCTCOUNT(Accounts[AccountID])',
        baseVal: 1428,
        format: (n) => Math.round(n).toLocaleString(),
        delta: '+182 Q3 New',
        target: 'Quota: 1,350',
        spark: [1100, 1180, 1220, 1290, 1340, 1380, 1410, 1428],
      },
    ],
    chartTitle: 'Monthly Actual Revenue vs Budget Target & Prior Year',
    chartSubtitle: 'DAX Measures: [Actual Gross Revenue] vs [Dynamic Target Plan]',
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    actuals: [38, 44, 42, 51, 49, 62, 58, 71, 68, 76],
    budget: [36, 40, 41, 46, 48, 55, 56, 64, 65, 70],
    priorYear: [31, 35, 36, 40, 42, 47, 49, 56, 57, 61],
    matrixTitle: 'Regional Contribution Matrix',
    matrixRows: [
      { name: 'North America Commercial', baseVal: 21.4, format: (n) => `$${n.toFixed(1)}M`, pct: 44, variance: '+16.2%' },
      { name: 'EMEA Enterprise Operations', baseVal: 14.2, format: (n) => `$${n.toFixed(1)}M`, pct: 29, variance: '+12.4%' },
      { name: 'Asia-Pacific Core Market', baseVal: 9.8, format: (n) => `$${n.toFixed(1)}M`, pct: 20, variance: '+18.9%' },
      { name: 'Latin America Emerging', baseVal: 3.2, format: (n) => `$${n.toFixed(1)}M`, pct: 7, variance: '+4.8%' },
    ],
    donutTitle: 'Channel Revenue Mix',
    donutSlices: [
      { label: 'Enterprise Direct', share: 48, amount: '$23.3M' },
      { label: 'Strategic Partners', share: 32, amount: '$15.5M' },
      { label: 'Cloud Marketplace', share: 20, amount: '$9.8M' },
    ],
  },
  {
    id: 'margin-cost',
    tabLabel: '2. Margin & Cost P&L',
    title: 'P&L Variance & Operating Income Explorer',
    dataset: 'Kimball Star-Schema · Audited DAX',
    kpis: [
      {
        title: 'Operating Income (EBIT)',
        dax: '[Gross Margin] - [OpEx Allocated]',
        baseVal: 16.92,
        format: (n) => `$${n.toFixed(2)}M`,
        delta: '+21.6% YoY',
        target: 'Target: $14.5M',
        spark: [11.2, 12.4, 13.1, 14.2, 15.1, 15.8, 16.2, 16.92],
      },
      {
        title: 'COGS Cost Ratio',
        dax: 'DIVIDE([Direct COGS], [Revenue])',
        baseVal: 65.2,
        format: (n) => `${n.toFixed(1)}%`,
        delta: '-2.4% Cost Reduction',
        target: 'Budget: 67.6%',
        spark: [68.4, 67.8, 67.1, 66.4, 65.9, 65.8, 65.4, 65.2],
      },
      {
        title: 'Logistics Freight Rate',
        dax: 'DIVIDE([Freight Expense], [Volume])',
        baseVal: 4.12,
        format: (n) => `$${n.toFixed(2)}/u`,
        delta: '-18.4% Efficiency',
        target: 'Ceiling: $4.85',
        spark: [5.2, 5.0, 4.8, 4.6, 4.4, 4.3, 4.2, 4.12],
      },
      {
        title: 'Cash Conversion Cycle',
        dax: '[DSO] + [DIO] - [DPO]',
        baseVal: 28.4,
        format: (n) => `${n.toFixed(1)}d`,
        delta: '-5.2 Days Faster',
        target: 'Industry: 36d',
        spark: [36, 34, 33, 31, 30, 29, 29, 28.4],
      },
    ],
    chartTitle: 'EBITDA Run-Rate vs Operating Cashflow Velocity',
    chartSubtitle: 'DAX Measures: [EBITDA Trailing 12M] vs [Operating Inflows]',
    chartLabels: ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26', 'Q3-26', 'Q4-26'],
    actuals: [42, 48, 54, 62, 59, 71, 78, 86],
    budget: [38, 44, 50, 56, 58, 66, 72, 80],
    priorYear: [34, 39, 43, 48, 51, 57, 63, 69],
    matrixTitle: 'Cost Center Allocation',
    matrixRows: [
      { name: 'Cloud & Compute Infrastructure', baseVal: 6.8, format: (n) => `$${n.toFixed(1)}M`, pct: 38, variance: '-8.4%' },
      { name: 'Supply Chain & Logistics Network', baseVal: 5.2, format: (n) => `$${n.toFixed(1)}M`, pct: 29, variance: '-14.2%' },
      { name: 'Commercial Sales & Marketing', baseVal: 3.9, format: (n) => `$${n.toFixed(1)}M`, pct: 22, variance: '+2.1%' },
      { name: 'General Administrative & Compliance', baseVal: 1.9, format: (n) => `$${n.toFixed(1)}M`, pct: 11, variance: '-1.5%' },
    ],
    donutTitle: 'OpEx Functional Allocation',
    donutSlices: [
      { label: 'Technology & Cloud', share: 41, amount: '$7.3M' },
      { label: 'Logistics Network', share: 31, amount: '$5.5M' },
      { label: 'Engineering R&D', share: 28, amount: '$5.0M' },
    ],
  },
  {
    id: 'scm-health',
    tabLabel: '3. SCM & Inventory Health',
    title: 'Global Supply Chain & Stockout Risk Matrix',
    dataset: 'Kafka Streaming · P99 Speed',
    kpis: [
      {
        title: 'Inventory Turnover',
        dax: 'DIVIDE([Annual COGS], [Avg Inventory])',
        baseVal: 7.4,
        format: (n) => `${n.toFixed(1)}x`,
        delta: 'Top Decile Index',
        target: 'Benchmark: 5.8x',
        spark: [5.8, 6.1, 6.4, 6.7, 6.9, 7.1, 7.3, 7.4],
      },
      {
        title: 'Stockout Incident Rate',
        dax: 'DIVIDE([Stockouts], [Pick Requests])',
        baseVal: 0.038,
        format: (n) => `${(n * 100).toFixed(2)}%`,
        delta: '-84% Risk Reduction',
        target: 'Tolerance: <0.10%',
        spark: [0.12, 0.09, 0.08, 0.06, 0.05, 0.045, 0.04, 0.038],
      },
      {
        title: 'Warehouse Capacity Index',
        dax: 'DIVIDE([Occupied Slots], [Max Safe Capacity])',
        baseVal: 82.4,
        format: (n) => `${n.toFixed(1)}%`,
        delta: 'Optimal Buffer',
        target: 'Max Ceiling: 88%',
        spark: [76, 78, 81, 79, 83, 84, 83, 82.4],
      },
      {
        title: 'Tier 1 Supplier Score',
        dax: 'AVERAGEX(Suppliers, [Quality Score])',
        baseVal: 98.9,
        format: (n) => `${n.toFixed(1)}/100`,
        delta: '+2.1 pts Audited',
        target: 'Gold Standard: 95+',
        spark: [94, 95.2, 96.1, 96.8, 97.4, 98.0, 98.5, 98.9],
      },
    ],
    chartTitle: 'Distribution Center Throughput vs Conveyor Cap',
    chartSubtitle: 'DAX Measures: [Daily Pallet Moves] vs [Facility Nameplate]',
    chartLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    actuals: [54, 61, 68, 64, 76, 82, 79, 91],
    budget: [50, 55, 60, 62, 70, 75, 76, 84],
    priorYear: [44, 49, 52, 55, 61, 66, 68, 74],
    matrixTitle: 'Fulfillment Hubs Status',
    matrixRows: [
      { name: 'Chicago Mega Hub (ORD-01)', baseVal: 42.4, format: (n) => `${n.toFixed(1)}k/d`, pct: 36, variance: '+18.4%' },
      { name: 'Frankfurt Hub (FRA-02)', baseVal: 31.8, format: (n) => `${n.toFixed(1)}k/d`, pct: 28, variance: '+14.1%' },
      { name: 'Singapore Logistics Gateway (SIN)', baseVal: 28.6, format: (n) => `${n.toFixed(1)}k/d`, pct: 24, variance: '+12.7%' },
      { name: 'Tokyo Distribution (HND-03)', baseVal: 19.2, format: (n) => `${n.toFixed(1)}k/d`, pct: 16, variance: '+9.2%' },
    ],
    donutTitle: 'Inventory Risk Stratification',
    donutSlices: [
      { label: 'Tier A (Zero Risk)', share: 84, amount: '4,120 SKUs' },
      { label: 'Tier B (Buffer Watch)', share: 14, amount: '680 SKUs' },
      { label: 'Tier C (Critical Replenish)', share: 2, amount: '98 SKUs' },
    ],
  },
];

export default function PowerBIHeroDashboard() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeToneId, setActiveToneId] = useState<string>('signature');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [timeHorizon, setTimeHorizon] = useState<'YTD' | 'QTD' | 'MTD'>('YTD');
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const gradientId = useId().replace(/:/g, '');

  const activeTone = useMemo(() => {
    const t = COLOR_TONES.find((s) => s.id === activeToneId) || COLOR_TONES[0];
    if (isLight) {
      return {
        ...t,
        primary: t.lightPrimary || t.primary,
        secondary: t.lightSecondary || t.secondary,
        dotColor: t.id === 'signature' ? '#005bbb' : t.dotColor,
      };
    }
    return t;
  }, [activeToneId, isLight]);

  const activeShade = activeTone;

  const currentPage = REPORT_PAGES[activePageIndex];

  // Auto-cycle through pages when playing
  useEffect(() => {
    if (!isPlaying || userInteracted) return;
    const timer = setInterval(() => {
      setActivePageIndex((prev) => (prev + 1) % REPORT_PAGES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [isPlaying, userInteracted]);

  // Slicer multiplier
  const slicerMultiplier = useMemo(() => {
    let factor = 1.0;
    if (timeHorizon === 'QTD') factor = 0.38;
    if (timeHorizon === 'MTD') factor = 0.14;

    if (selectedRegion === 'Americas') factor *= 0.52;
    if (selectedRegion === 'EMEA') factor *= 0.28;
    if (selectedRegion === 'APAC') factor *= 0.20;

    return factor;
  }, [timeHorizon, selectedRegion]);

  const resetSlicers = () => {
    setTimeHorizon('YTD');
    setSelectedRegion('Global');
    setUserInteracted(true);
  };

  // Landscape Chart dimensions (HD Landscape Vector coordinates)
  const chartHeight = 135;
  const chartWidth = 520;
  const paddingLeft = 32;
  const paddingBottom = 22;
  const plotWidth = chartWidth - paddingLeft - 8;
  const plotHeight = chartHeight - paddingBottom - 8;

  const dataCount = currentPage.chartLabels.length;
  const barSpacing = plotWidth / dataCount;
  const barWidth = Math.max(14, barSpacing * 0.44);

  const maxVal = Math.max(...currentPage.actuals, ...currentPage.budget) * 1.15;

  return (
    <div
      className={styles.pbiContainer}
      data-tone={activeToneId}
      style={
        {
          '--pbi-primary': activeShade.primary,
          '--pbi-secondary': activeShade.secondary,
          '--pbi-accent3': activeShade.accent3,
          '--pbi-accent4': activeShade.accent4,
        } as React.CSSProperties
      }
      onPointerEnter={() => setUserInteracted(true)}
    >
      {/* ── 1. Power BI App Ribbon Header ── */}
      <header className={styles.pbiHeader}>
        <div className={styles.pbiBrandGroup}>
          <div className={styles.pbiLogoBadge} title="Power BI Pro Architecture">
            <BarChart3 size={18} />
          </div>
          <div className={styles.pbiTitleGroup}>
            <span className={styles.pbiReportTitle}>
              {currentPage.title}
              <CheckCircle2 size={12} style={{ color: activeShade.primary }} />
            </span>
            <span className={styles.pbiSubBadge}>
              {currentPage.dataset} · Executive Cockpit
            </span>
          </div>
        </div>

        {/* Color Tone Swatches (Matching snap: Signature, Ocean, Iris, Emerald, Amber, Rose) */}
        <div className={styles.pbiControls}>
          <div className={styles.demoBadge}>
            <i />
            <span>Interactive Live</span>
          </div>

          <div className={styles.toneGroup} role="group" aria-label="Palette tone">
            {COLOR_TONES.map((tone) => {
              const isSelected = activeToneId === tone.id;
              const displayDot = isLight && tone.id === 'signature' ? '#005bbb' : tone.dotColor;
              const activeBorderColor = isLight ? (tone.lightPrimary || tone.primary) : tone.primary;

              return (
                <button
                  key={tone.id}
                  type="button"
                  className={`${styles.toneBtn} ${isSelected ? styles.toneBtnActive : ''}`}
                  style={
                    isSelected
                      ? {
                          borderColor: activeBorderColor,
                          boxShadow: `0 0 0 1px ${activeBorderColor}40`,
                        }
                      : undefined
                  }
                  onClick={() => {
                    setActiveToneId(tone.id);
                    setUserInteracted(true);
                  }}
                  aria-label={`Select ${tone.name} tone`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={styles.toneDot}
                    style={{ backgroundColor: displayDot }}
                  />
                  <span>{tone.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.pbiActionBtn}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Auto-Tour' : 'Start Auto-Tour'}
            aria-label={isPlaying ? 'Pause Tour' : 'Play Tour'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Live' : 'Paused'}</span>
          </button>
        </div>
      </header>

      {/* ── 2. Interactive Slicer Bar ── */}
      <nav className={styles.pbiSlicerBar} aria-label="Dashboard filters and slicers">
        <div className={styles.slicerGroup}>
          <Calendar size={12} style={{ color: activeShade.primary }} />
          <span className={styles.slicerLabel}>Horizon:</span>
          <div className={styles.slicerSegment}>
            {(['YTD', 'QTD', 'MTD'] as const).map((h) => (
              <button
                key={h}
                type="button"
                className={`${styles.slicerPill} ${timeHorizon === h ? styles.slicerPillActive : ''}`}
                onClick={() => {
                  setTimeHorizon(h);
                  setUserInteracted(true);
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.slicerGroup}>
          <Globe2 size={12} style={{ color: activeShade.secondary }} />
          <span className={styles.slicerLabel}>Segment:</span>
          <div className={styles.slicerSegment}>
            {(['Global', 'Americas', 'EMEA', 'APAC'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`${styles.slicerPill} ${selectedRegion === r ? styles.slicerPillActive : ''}`}
                onClick={() => {
                  setSelectedRegion(r);
                  setUserInteracted(true);
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {(timeHorizon !== 'YTD' || selectedRegion !== 'Global') && (
          <button
            type="button"
            className={`${styles.pbiActionBtn} ${styles.slicerResetBtn}`}
            onClick={resetSlicers}
          >
            <RotateCcw size={11} />
            <span>Reset Slicers</span>
          </button>
        )}
      </nav>

      {/* ── 3. Main Dashboard Canvas ── */}
      <div className={styles.pbiCanvas}>
        {/* KPI Row (4 Cards across desktop) */}
        <div className={styles.kpiGrid}>
          {currentPage.kpis.map((kpi, idx) => {
            const calculatedVal =
              timeHorizon === 'YTD' && selectedRegion === 'Global'
                ? kpi.baseVal
                : kpi.baseVal * slicerMultiplier;

            const minSpark = Math.min(...kpi.spark);
            const maxSpark = Math.max(...kpi.spark) || 1;
            const sparkPoints = kpi.spark
              .map((val, i) => {
                const x = (i / (kpi.spark.length - 1)) * 48 + 2;
                const y = 14 - ((val - minSpark) / (maxSpark - minSpark || 1)) * 10;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <div key={idx} className={styles.kpiCard}>
                <div className={styles.kpiAccentBar} />
                <div className={styles.kpiTopRow}>
                  <span className={styles.kpiTitle}>{kpi.title}</span>
                  <span className={styles.kpiDaxTag} title={kpi.dax}>
                    DAX
                  </span>
                </div>

                <div className={styles.kpiValueRow}>
                  <strong className={styles.kpiValue}>{kpi.format(calculatedVal)}</strong>
                  <span className={styles.kpiDelta}>
                    <ArrowUpRight size={12} />
                    {kpi.delta}
                  </span>
                </div>

                <div className={styles.kpiFooter}>
                  <span className={styles.kpiFooterText}>{kpi.target}</span>
                  <svg className={styles.kpiSpark} viewBox="0 0 52 16" aria-hidden="true">
                    <polyline
                      fill="none"
                      stroke={idx % 2 === 0 ? activeShade.primary : activeShade.secondary}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparkPoints}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Landscape Visuals Section (2 Wide Landscape Cards per Tab - Unique Visuals for each Tab!) */}
        <div className={styles.landscapeVisualsGrid}>
          {/* ══════════════════════════════════════════════════════════════
              TAB 1: Commercial Revenue & SLA Matrix
              Visual 1: Clustered Columns & Line Combo Chart
              Visual 2: Channel Revenue Mix Donut & Regional Mini Grid
             ══════════════════════════════════════════════════════════════ */}
          {activePageIndex === 0 && (
            <>
              {/* Card 1: Combo Chart */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <BarChart3 size={13} style={{ color: activeShade.primary }} />
                      Monthly Revenue vs Dynamic Target Plan
                    </span>
                    <span className={styles.cardSubtitle}>
                      DAX Measures: [Actual Gross Sales] vs [Dynamic Budget Plan]
                    </span>
                  </div>
                  <div className={styles.chartLegend}>
                    <span>
                      <span className={styles.legendDot} style={{ background: activeShade.primary }} />
                      Actual
                    </span>
                    <span>
                      <span className={styles.legendLine} style={{ background: activeShade.secondary }} />
                      Budget Plan
                    </span>
                    <span>
                      <span className={styles.legendLine} style={{ background: 'var(--muted)', opacity: 0.7 }} />
                      Prior Year
                    </span>
                  </div>
                </div>

                <svg
                  className={styles.comboChartSvg}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Clustered column and budget line combo chart"
                >
                  <defs>
                    <linearGradient id={`${gradientId}-bar`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeShade.primary} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={activeShade.primary} stopOpacity="0.55" />
                    </linearGradient>
                  </defs>

                  {/* Gridlines */}
                  {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                    const y = 8 + plotHeight * (1 - ratio);
                    return (
                      <g key={i}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={chartWidth - 8}
                          y2={y}
                          stroke="var(--border)"
                          strokeDasharray="3 3"
                          strokeOpacity="0.6"
                        />
                        <text
                          x={paddingLeft - 5}
                          y={y + 3}
                          fill="var(--muted)"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {Math.round(maxVal * ratio)}M
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={paddingLeft}
                    y1={8 + plotHeight}
                    x2={chartWidth - 8}
                    y2={8 + plotHeight}
                    stroke="var(--border)"
                  />

                  {/* Columns: Actuals */}
                  {currentPage.actuals.map((val, i) => {
                    const adjustedVal = val * slicerMultiplier;
                    const h = (adjustedVal / maxVal) * plotHeight;
                    const x = paddingLeft + i * barSpacing + (barSpacing - barWidth) / 2;
                    const y = 8 + plotHeight - h;
                    const isHovered = hoveredBarIndex === i;

                    return (
                      <g
                        key={i}
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(2, h)}
                          rx={3}
                          fill={isHovered ? 'var(--text)' : `url(#${gradientId}-bar)`}
                          style={{ transition: 'all 0.15s ease' }}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight - 6}
                          fill={isHovered ? activeShade.primary : 'var(--muted)'}
                          fontSize="8"
                          fontWeight={isHovered ? '700' : '500'}
                          textAnchor="middle"
                        >
                          {currentPage.chartLabels[i]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Prior Year Line (dashed) */}
                  <path
                    d={currentPage.priorYear
                      .map((val, i) => {
                        const x = paddingLeft + i * barSpacing + barSpacing / 2;
                        const y = 8 + plotHeight - (val * slicerMultiplier * 0.9 / maxVal) * plotHeight;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="1.4"
                    strokeDasharray="4 3"
                    opacity="0.65"
                  />

                  {/* Budget Plan Line */}
                  <path
                    d={currentPage.budget
                      .map((val, i) => {
                        const x = paddingLeft + i * barSpacing + barSpacing / 2;
                        const y = 8 + plotHeight - ((val * slicerMultiplier) / maxVal) * plotHeight;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke={activeShade.secondary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Budget Line Points */}
                  {currentPage.budget.map((val, i) => {
                    const x = paddingLeft + i * barSpacing + barSpacing / 2;
                    const y = 8 + plotHeight - ((val * slicerMultiplier) / maxVal) * plotHeight;
                    const isHovered = hoveredBarIndex === i;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={isHovered ? 4 : 2.5}
                        fill={isHovered ? 'var(--text)' : activeShade.secondary}
                        stroke="var(--surface)"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* Tooltip */}
                  {hoveredBarIndex !== null && (
                    <g>
                      {(() => {
                        const i = hoveredBarIndex;
                        const actVal = (currentPage.actuals[i] * slicerMultiplier).toFixed(1);
                        const bgtVal = (currentPage.budget[i] * slicerMultiplier).toFixed(1);
                        const varPct = (
                          ((currentPage.actuals[i] - currentPage.budget[i]) /
                            currentPage.budget[i]) *
                          100
                        ).toFixed(1);

                        const tooltipX = Math.min(
                          chartWidth - 96,
                          Math.max(paddingLeft + 8, paddingLeft + i * barSpacing - 32)
                        );

                        return (
                          <g transform={`translate(${tooltipX}, 12)`}>
                            <rect
                              width="94"
                              height="38"
                              rx="4"
                              fill="var(--surface)"
                              stroke="color-mix(in srgb, var(--text) 25%, var(--border))"
                              strokeWidth="1"
                            />
                            <text x="6" y="12" fill="var(--text)" fontSize="8.5" fontWeight="700">
                              {currentPage.chartLabels[i]}: ${actVal}M
                            </text>
                            <text x="6" y="23" fill="var(--muted)" fontSize="7.5">
                              Plan: ${bgtVal}M
                            </text>
                            <text x="6" y="33" fill="var(--text)" fontSize="7.5" fontWeight="600">
                              Var: +{varPct}% (Favorable)
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  )}
                </svg>
              </div>

              {/* Card 2: Donut & Regional Mini Grid */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <PieChart size={13} style={{ color: activeShade.primary }} />
                      Channel Mix & Regional Distribution
                    </span>
                    <span className={styles.cardSubtitle}>
                      Direct Lake Aggregation · 100% Reconciled
                    </span>
                  </div>
                  <span className={styles.kpiDelta}>+14.8% YoY</span>
                </div>

                <div className={styles.donutWithRegionalLayout}>
                  <div className={styles.donutRow}>
                    <div className={styles.donutSvgWrapper}>
                      <svg className={styles.donutSvg} viewBox="0 0 100 100">
                        {(() => {
                          const r = 38;
                          const circumference = 2 * Math.PI * r;
                          let accumulated = 0;

                          return currentPage.donutSlices.map((slice, idx) => {
                            const strokeLen = (slice.share / 100) * circumference;
                            const strokeOffset = circumference - accumulated;
                            accumulated += strokeLen;

                            const sliceColor =
                              idx === 0
                                ? activeShade.primary
                                : idx === 1
                                ? activeShade.secondary
                                : activeShade.accent3;

                            return (
                              <circle
                                key={idx}
                                cx="50"
                                cy="50"
                                r={r}
                                fill="transparent"
                                stroke={sliceColor}
                                strokeWidth="12"
                                strokeDasharray={`${strokeLen} ${circumference - strokeLen}`}
                                strokeDashoffset={strokeOffset}
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className={styles.donutCenterText}>
                        <span className={styles.donutCenterVal}>100%</span>
                        <span className={styles.donutCenterSub}>Mix</span>
                      </div>
                    </div>

                    <div className={styles.donutLegendList}>
                      {currentPage.donutSlices.map((slice, idx) => {
                        const sliceColor =
                          idx === 0
                            ? activeShade.primary
                            : idx === 1
                            ? activeShade.secondary
                            : activeShade.accent3;

                        return (
                          <div key={idx} className={styles.donutLegendItem}>
                            <span className={styles.donutLegendLabel}>
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: sliceColor,
                                  display: 'inline-block',
                                }}
                              />
                              {slice.label}
                            </span>
                            <span className={styles.donutLegendVal}>
                              {slice.share}% <small style={{ color: 'var(--muted)', fontWeight: 400 }}>({slice.amount})</small>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Regional Contribution Horizontal Mini Grid */}
                  <div className={styles.regionalMiniGrid}>
                    {[
                      { name: 'Americas', share: '44%', val: '$21.4M' },
                      { name: 'EMEA Core', share: '29%', val: '$14.2M' },
                      { name: 'Asia-Pac', share: '20%', val: '$9.8M' },
                      { name: 'LatAm', share: '7%', val: '$3.2M' },
                    ].map((reg, idx) => (
                      <div key={idx} className={styles.regionalMiniPill}>
                        <span className={styles.regionalMiniName}>{reg.name}</span>
                        <span className={styles.regionalMiniVal}>{reg.val} <small style={{ color: 'var(--muted)', fontSize: 'var(--text-small)' }}>{reg.share}</small></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: Margin & Cost P&L Variance
              Visual 1: Spline Area Chart (EBITDA Run-Rate vs Operating Cashflow)
              Visual 2: Horizontal Cost Center Variance Bar Chart (Replaces snapshot card!)
             ══════════════════════════════════════════════════════════════ */}
          {activePageIndex === 1 && (
            <>
              {/* Card 1: Smooth Spline Area Chart */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <TrendingUp size={13} style={{ color: activeShade.primary }} />
                      EBITDA Run-Rate vs Operating Cashflow Velocity
                    </span>
                    <span className={styles.cardSubtitle}>
                      DAX Measures: [EBITDA Trailing 12M] vs [Operating Inflows]
                    </span>
                  </div>
                  <div className={styles.chartLegend}>
                    <span>
                      <span className={styles.legendDot} style={{ background: activeShade.primary }} />
                      EBITDA Curve
                    </span>
                    <span>
                      <span className={styles.legendLine} style={{ background: activeShade.secondary }} />
                      Cashflow Trend
                    </span>
                  </div>
                </div>

                {(() => {
                  const areaPoints = currentPage.actuals.map((val, i) => {
                    const adjusted = val * slicerMultiplier;
                    const x = paddingLeft + i * barSpacing + barSpacing / 2;
                    const y = 8 + plotHeight - (adjusted / maxVal) * plotHeight;
                    return { x, y, val: adjusted };
                  });

                  // Build smooth cubic bezier curve
                  let splinePath = `M ${areaPoints[0].x.toFixed(1)} ${areaPoints[0].y.toFixed(1)}`;
                  for (let i = 1; i < areaPoints.length; i++) {
                    const prev = areaPoints[i - 1];
                    const curr = areaPoints[i];
                    const mx = (prev.x + curr.x) / 2;
                    splinePath += ` C ${mx.toFixed(1)} ${prev.y.toFixed(1)}, ${mx.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
                  }

                  const areaClosedPath = `${splinePath} L ${areaPoints[areaPoints.length - 1].x.toFixed(1)} ${8 + plotHeight} L ${areaPoints[0].x.toFixed(1)} ${8 + plotHeight} Z`;

                  // Cashflow trend line
                  const cashflowPath = currentPage.budget.map((val, i) => {
                    const x = paddingLeft + i * barSpacing + barSpacing / 2;
                    const y = 8 + plotHeight - ((val * slicerMultiplier) / maxVal) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ');

                  return (
                    <svg
                      className={styles.areaChartSvg}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="EBITDA area and cashflow trend chart"
                    >
                      <defs>
                        <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeShade.primary} stopOpacity="0.45" />
                          <stop offset="70%" stopColor={activeShade.primary} stopOpacity="0.10" />
                          <stop offset="100%" stopColor={activeShade.primary} stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                        const y = 8 + plotHeight * (1 - ratio);
                        return (
                          <g key={i}>
                            <line
                              x1={paddingLeft}
                              y1={y}
                              x2={chartWidth - 8}
                              y2={y}
                              stroke="var(--border)"
                              strokeDasharray="3 3"
                              strokeOpacity="0.6"
                            />
                            <text
                              x={paddingLeft - 5}
                              y={y + 3}
                              fill="var(--muted)"
                              fontSize="8"
                              fontFamily="monospace"
                              textAnchor="end"
                            >
                              {Math.round(maxVal * ratio)}M
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Gradient Fill */}
                      <path d={areaClosedPath} fill={`url(#${gradientId}-area)`} />

                      {/* Cashflow Trend Line */}
                      <path
                        d={cashflowPath}
                        fill="none"
                        stroke={activeShade.secondary}
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                      />

                      {/* Upper Spline Curve */}
                      <path
                        d={splinePath}
                        fill="none"
                        stroke={activeShade.primary}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />

                      {/* Data Point Circles & Labels */}
                      {areaPoints.map((pt, i) => {
                        const isHovered = hoveredBarIndex === i;
                        return (
                          <g
                            key={i}
                            onMouseEnter={() => setHoveredBarIndex(i)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            style={{ cursor: 'pointer' }}
                          >
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered ? 5 : 3}
                              fill="var(--surface)"
                              stroke={activeShade.primary}
                              strokeWidth="2"
                            />
                            <text
                              x={pt.x}
                              y={chartHeight - 6}
                              fill={isHovered ? activeShade.primary : 'var(--muted)'}
                              fontSize="8"
                              fontWeight={isHovered ? '700' : '500'}
                              textAnchor="middle"
                            >
                              {currentPage.chartLabels[i]}
                            </text>
                          </g>
                        );
                      })}

                      {/* Tooltip */}
                      {hoveredBarIndex !== null && areaPoints[hoveredBarIndex] && (
                        <g>
                          {(() => {
                            const i = hoveredBarIndex;
                            const ebitda = (currentPage.actuals[i] * slicerMultiplier).toFixed(1);
                            const cashflow = (currentPage.budget[i] * slicerMultiplier).toFixed(1);
                            const tooltipX = Math.min(
                              chartWidth - 96,
                              Math.max(paddingLeft + 8, areaPoints[i].x - 42)
                            );

                            return (
                              <g transform={`translate(${tooltipX}, 12)`}>
                                <rect
                                  width="94"
                                  height="38"
                                  rx="4"
                                  fill="var(--surface)"
                                  stroke={activeShade.primary}
                                  strokeWidth="1"
                                />
                                <text x="6" y="12" fill="var(--text)" fontSize="8.5" fontWeight="700">
                                  {currentPage.chartLabels[i]}: ${ebitda}M
                                </text>
                                <text x="6" y="23" fill="var(--muted)" fontSize="7.5">
                                  Cashflow: ${cashflow}M
                                </text>
                                <text x="6" y="33" fill={activeShade.primary} fontSize="7.5" fontWeight="600">
                                  Margin: +21.6% (Peak)
                                </text>
                              </g>
                            );
                          })()}
                        </g>
                      )}
                    </svg>
                  );
                })()}
              </div>

              {/* Card 2: Sales by Region (Map) - REPLACED WITH USER'S ATTACHED SNAP */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <Globe2 size={13} style={{ color: activeShade.primary }} />
                      Sales by Region (Map)
                    </span>
                    <span className={styles.cardSubtitle}>
                      Direct Lake Geo-Spatial Choropleth · Global Revenue Dispersion
                    </span>
                  </div>
                  <span className={styles.kpiDelta}>Live Shape Map</span>
                </div>

                <div className={styles.mapWrapper}>
                  {/* Vector SVG World Map */}
                  <svg
                    className={styles.mapSvg}
                    viewBox={WORLD_MAP_VIEWBOX}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Sales by Region interactive world map"
                  >
                    <defs>
                      <linearGradient id={`${gradientId}-map-scale`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeShade.primary} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={activeShade.primary} stopOpacity="0.15" />
                      </linearGradient>
                    </defs>

                    {WORLD_MAP_PATHS.map((country) => {
                      const isHovered = hoveredRegion === country.region;
                      let fill = 'color-mix(in srgb, var(--surface2) 45%, transparent)';
                      let opacity = 0.55;

                      if (country.region === 'northAmerica') {
                        fill = activeShade.primary;
                        opacity = isHovered ? 0.95 : 0.68;
                      } else if (country.region === 'europe') {
                        fill = activeShade.primary;
                        opacity = isHovered ? 0.90 : 0.52;
                      } else if (country.region === 'asia') {
                        fill = activeShade.primary;
                        opacity = isHovered ? 0.85 : 0.42;
                      } else if (country.region === 'southAmerica') {
                        fill = activeShade.primary;
                        opacity = isHovered ? 0.80 : 0.28;
                      } else if (country.region === 'oceania') {
                        fill = activeShade.secondary;
                        opacity = isHovered ? 0.75 : 0.35;
                      }

                      return (
                        <path
                          key={country.id}
                          id={`country-${country.id}`}
                          d={country.d}
                          fill={fill}
                          fillOpacity={opacity}
                          stroke={isHovered ? activeShade.primary : 'var(--border)'}
                          strokeWidth={isHovered ? 1.0 : 0.4}
                          className={styles.mapCountryPath}
                          onMouseEnter={() => setHoveredRegion(country.region)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* 4 Floating Region Callout Cards Matching Attached Snap */}
                  {[
                    {
                      id: 'northAmerica',
                      name: 'North America',
                      baseVal: 4.84,
                      growth: '12.4%',
                      style: { top: '14%', left: '7%' },
                    },
                    {
                      id: 'europe',
                      name: 'Europe',
                      baseVal: 3.11,
                      growth: '16.8%',
                      style: { top: '8%', left: '50%' },
                    },
                    {
                      id: 'asia',
                      name: 'Asia',
                      baseVal: 2.62,
                      growth: '18.1%',
                      style: { top: '40%', left: '73%' },
                    },
                    {
                      id: 'southAmerica',
                      name: 'South America',
                      baseVal: 1.40,
                      growth: '10.2%',
                      style: { top: '56%', left: '22%' },
                    },
                  ].map((card) => {
                    const val = (card.baseVal * slicerMultiplier).toFixed(2);
                    const isActive = hoveredRegion === card.id;

                    return (
                      <div
                        key={card.id}
                        className={`${styles.mapCalloutCard} ${isActive ? styles.mapCalloutCardActive : ''}`}
                        style={card.style}
                        onMouseEnter={() => setHoveredRegion(card.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      >
                        <div className={styles.mapCalloutTitle}>{card.name}</div>
                        <div className={styles.mapCalloutValue}>${val}M</div>
                        <div
                          className={styles.mapCalloutDelta}
                          style={{ color: '#10b981' }}
                        >
                          <span className={styles.mapCalloutDeltaIcon}>▲</span> {card.growth}
                        </div>
                      </div>
                    );
                  })}

                  {/* Bottom-left Sales Legend Matching Attached Snap */}
                  <div className={styles.mapLegend}>
                    <span className={styles.mapLegendTitle}>Sales</span>
                    <div className={styles.mapLegendScale}>
                      <div
                        className={styles.mapLegendBar}
                        style={{
                          background: `linear-gradient(to bottom, ${activeShade.primary}, color-mix(in srgb, ${activeShade.primary} 18%, transparent))`,
                        }}
                      />
                      <div className={styles.mapLegendLabels}>
                        <span>${(4.8 * slicerMultiplier).toFixed(1)}M</span>
                        <span>$0.2M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: SCM & Inventory Health
              Visual 1: Fulfillment Hub Throughput vs Conveyor Capacity
              Visual 2: Radial SLA Speedometer Gauge & Safety Stock Stratification
             ══════════════════════════════════════════════════════════════ */}
          {activePageIndex === 2 && (
            <>
              {/* Card 1: Logistics Hubs Throughput Chart */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <Activity size={13} style={{ color: activeShade.primary }} />
                      Distribution Center Throughput vs Conveyor Cap
                    </span>
                    <span className={styles.cardSubtitle}>
                      DAX Measures: [Daily Pallet Moves] vs [Facility Nameplate]
                    </span>
                  </div>
                  <div className={styles.chartLegend}>
                    <span>
                      <span className={styles.legendDot} style={{ background: activeShade.primary }} />
                      Daily Dispatches
                    </span>
                    <span>
                      <span className={styles.legendDot} style={{ background: 'var(--border)' }} />
                      Max Nameplate
                    </span>
                  </div>
                </div>

                {(() => {
                  const hubs = [
                    { code: 'ORD-01', city: 'Chicago', disp: 42.4, cap: 48, util: '88%' },
                    { code: 'FRA-02', city: 'Frankfurt', disp: 31.8, cap: 36, util: '88%' },
                    { code: 'SIN-01', city: 'Singapore', disp: 28.6, cap: 32, util: '89%' },
                    { code: 'HND-03', city: 'Tokyo', disp: 19.2, cap: 24, util: '80%' },
                    { code: 'LHR-04', city: 'London', disp: 16.5, cap: 20, util: '82%' },
                  ];

                  const hubBarSpacing = plotWidth / hubs.length;
                  const hubBarWidth = Math.max(18, hubBarSpacing * 0.42);
                  const maxCap = 52;

                  return (
                    <svg
                      className={styles.hubChartSvg}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Distribution centers throughput and capacity"
                    >
                      <defs>
                        <linearGradient id={`${gradientId}-hub`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeShade.primary} stopOpacity="0.95" />
                          <stop offset="100%" stopColor={activeShade.primary} stopOpacity="0.55" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                        const y = 8 + plotHeight * (1 - ratio);
                        return (
                          <g key={i}>
                            <line
                              x1={paddingLeft}
                              y1={y}
                              x2={chartWidth - 8}
                              y2={y}
                              stroke="var(--border)"
                              strokeDasharray="3 3"
                              strokeOpacity="0.6"
                            />
                            <text
                              x={paddingLeft - 5}
                              y={y + 3}
                              fill="var(--muted)"
                              fontSize="8"
                              fontFamily="monospace"
                              textAnchor="end"
                            >
                              {Math.round(maxCap * ratio)}k
                            </text>
                          </g>
                        );
                      })}

                      {/* Baseline */}
                      <line
                        x1={paddingLeft}
                        y1={8 + plotHeight}
                        x2={chartWidth - 8}
                        y2={8 + plotHeight}
                        stroke="var(--border)"
                      />

                      {/* Hub Bars */}
                      {hubs.map((hub, i) => {
                        const adjustedDisp = hub.disp * slicerMultiplier;
                        const dispH = (adjustedDisp / maxCap) * plotHeight;
                        const capH = (hub.cap / maxCap) * plotHeight;
                        const x = paddingLeft + i * hubBarSpacing + (hubBarSpacing - hubBarWidth) / 2;
                        const isHovered = hoveredBarIndex === i;

                        return (
                          <g
                            key={i}
                            onMouseEnter={() => setHoveredBarIndex(i)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Capacity background bar */}
                            <rect
                              x={x}
                              y={8 + plotHeight - capH}
                              width={hubBarWidth}
                              height={Math.max(2, capH)}
                              rx={3}
                              fill="color-mix(in srgb, var(--surface) 80%, transparent)"
                              stroke="var(--border)"
                              strokeDasharray="2 2"
                            />

                            {/* Actual Dispatches Front bar */}
                            <rect
                              x={x}
                              y={8 + plotHeight - dispH}
                              width={hubBarWidth}
                              height={Math.max(2, dispH)}
                              rx={3}
                              fill={isHovered ? 'var(--text)' : `url(#${gradientId}-hub)`}
                              style={{ transition: 'all 0.15s ease' }}
                            />

                            {/* Utilization Tag */}
                            <text
                              x={x + hubBarWidth / 2}
                              y={8 + plotHeight - dispH - 4}
                              fill={activeShade.primary}
                              fontSize="7.5"
                              fontWeight="700"
                              textAnchor="middle"
                            >
                              {hub.util}
                            </text>

                            {/* Hub Label */}
                            <text
                              x={x + hubBarWidth / 2}
                              y={chartHeight - 6}
                              fill={isHovered ? activeShade.primary : 'var(--muted)'}
                              fontSize="8"
                              fontWeight={isHovered ? '700' : '500'}
                              textAnchor="middle"
                            >
                              {hub.code}
                            </text>
                          </g>
                        );
                      })}

                      {/* Tooltip */}
                      {hoveredBarIndex !== null && hubs[hoveredBarIndex] && (
                        <g>
                          {(() => {
                            const hub = hubs[hoveredBarIndex];
                            const dispVal = (hub.disp * slicerMultiplier).toFixed(1);
                            const tooltipX = Math.min(
                              chartWidth - 96,
                              Math.max(paddingLeft + 8, paddingLeft + hoveredBarIndex * hubBarSpacing - 24)
                            );

                            return (
                              <g transform={`translate(${tooltipX}, 12)`}>
                                <rect
                                  width="94"
                                  height="38"
                                  rx="4"
                                  fill="var(--surface)"
                                  stroke={activeShade.primary}
                                  strokeWidth="1"
                                />
                                <text x="6" y="12" fill="var(--text)" fontSize="8.5" fontWeight="700">
                                  {hub.city} ({hub.code})
                                </text>
                                <text x="6" y="23" fill="var(--muted)" fontSize="7.5">
                                  Dispatches: {dispVal}k / day
                                </text>
                                <text x="6" y="33" fill={activeShade.primary} fontSize="7.5" fontWeight="600">
                                  Capacity: {hub.util} Utilized
                                </text>
                              </g>
                            );
                          })()}
                        </g>
                      )}
                    </svg>
                  );
                })()}
              </div>

              {/* Card 2: Radial SLA Speedometer Gauge & Safety Stock Stratification */}
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.chartHeaderLeft}>
                    <span className={styles.cardTitle}>
                      <CheckCircle2 size={13} style={{ color: activeShade.primary }} />
                      OTIF SLA Gauge & Inventory Safety Stock
                    </span>
                    <span className={styles.cardSubtitle}>
                      Kafka Real-Time Telemetry · P99 Fulfillment Index
                    </span>
                  </div>
                  <span className={styles.kpiDelta}>99.2% Actual</span>
                </div>

                <div className={styles.gaugeCockpitLayout}>
                  {/* Power BI Semi-Circle Speedometer Gauge */}
                  <div className={styles.gaugeWrapper}>
                    <svg className={styles.gaugeSvg} viewBox="0 0 140 85">
                      {/* Background arc track (radius 50, center at 70, 75) */}
                      <path
                        d="M 20 75 A 50 50 0 0 1 120 75"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />

                      {/* Filled progress arc (99.2% normalized to 84% stroke) */}
                      <path
                        d="M 20 75 A 50 50 0 0 1 120 75"
                        fill="none"
                        stroke={activeShade.primary}
                        strokeWidth="11"
                        strokeLinecap="round"
                        strokeDasharray="132 157"
                      />

                      {/* Target Indicator line at 98.5% goal */}
                      <line
                        x1="93"
                        y1="40"
                        x2="105"
                        y2="30"
                        stroke={activeShade.secondary}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Min / Max Labels */}
                      <text x="18" y="84" fill="var(--muted)" fontSize="7" textAnchor="start">95%</text>
                      <text x="122" y="84" fill="var(--muted)" fontSize="7" textAnchor="end">100%</text>
                    </svg>

                    <div className={styles.gaugeValueGroup}>
                      <span className={styles.gaugeBigNum}>99.2%</span>
                      <span className={styles.gaugeTargetLabel}>Goal: 98.5% Target</span>
                    </div>
                  </div>

                  {/* Safety Stock Stratification */}
                  <div className={styles.stockStratList}>
                    {[
                      { tier: 'Tier A (Zero Stockout Risk)', share: '84%', amount: '4,120 SKUs', color: activeShade.primary },
                      { tier: 'Tier B (Buffer Safety Watch)', share: '14%', amount: '680 SKUs', color: activeShade.secondary },
                      { tier: 'Tier C (Replenish Triggered)', share: '2%', amount: '98 SKUs', color: activeShade.accent3 },
                    ].map((stock, idx) => (
                      <div key={idx} className={styles.stockStratItem}>
                        <div className={styles.stockStratLabel}>
                          <span className={styles.stockStratDot} style={{ background: stock.color }} />
                          <span>{stock.tier}</span>
                        </div>
                        <div className={styles.stockStratValues}>
                          <span className={styles.stockStratShare}>{stock.share}</span>
                          <span className={styles.stockStratAmount}>{stock.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 4. Bottom Power BI Report Page Navigation Tabs ── */}
      <footer className={styles.pbiFooterTabs}>
        <div className={styles.pbiPageTabGroup} role="tablist" aria-label="Power BI report pages">
          {REPORT_PAGES.map((page, index) => (
            <button
              key={page.id}
              type="button"
              role="tab"
              aria-selected={activePageIndex === index}
              className={`${styles.pbiTabBtn} ${activePageIndex === index ? styles.pbiTabBtnActive : ''}`}
              onClick={() => {
                setActivePageIndex(index);
                setUserInteracted(true);
              }}
            >
              <BarChart3 size={11} />
              <span>{page.tabLabel}</span>
            </button>
          ))}
        </div>

        <div className={styles.pbiStatusInfo}>
          <span className={styles.statusIndicator} />
          <span>Page {activePageIndex + 1} of {REPORT_PAGES.length}</span>
          <span>·</span>
          <span>100% Math Reconciled</span>
        </div>
      </footer>
    </div>
  );
}
