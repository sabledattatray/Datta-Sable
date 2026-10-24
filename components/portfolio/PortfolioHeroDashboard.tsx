'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Database,
  Filter,
  Layers,
  Pause,
  Play,
  Server,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import styles from './PortfolioHeroDashboard.module.css';

interface ScenarioData {
  id: string;
  name: string;
  badge: string;
  icon: typeof TrendingUp;
  kpi1: { label: string; value: string; numVal: number; delta: string; unit: string; prefix: string };
  kpi2: { label: string; value: string; delta: string; subtitle: string };
  kpi3: { label: string; value: string; delta: string; status: string };
  chartTitle: string;
  data: number[];
  planned: number[];
  slices: { label: string; share: number; color: string }[];
  caseStudyTitle: string;
  caseStudyLink: string;
  insights: string[];
}

const SCENARIOS: ScenarioData[] = [
  {
    id: 'fintech',
    name: 'FinTech Growth',
    badge: 'Aura BI Engine',
    icon: TrendingUp,
    kpi1: { label: 'Net MRR Velocity', value: '$184,200', numVal: 184200, delta: '+28.4%', unit: 'k', prefix: '$' },
    kpi2: { label: 'Gross Margin', value: '84.6%', delta: '+3.8%', subtitle: 'vs 80.8% planned' },
    kpi3: { label: 'LTV : CAC Ratio', value: '4.2x', delta: 'Top decile', status: 'Optimal' },
    chartTitle: 'Net Recurring Velocity vs Planned Forecast',
    data: [42, 58, 52, 74, 68, 86, 94, 118],
    planned: [38, 50, 48, 65, 62, 78, 84, 102],
    slices: [
      { label: 'Enterprise Core', share: 54, color: 'var(--accent)' },
      { label: 'FinTech Partners', share: 31, color: '#3b82f6' },
      { label: 'Self-Serve API', share: 15, color: '#8b5cf6' },
    ],
    caseStudyTitle: 'Aura FinTech Capital BI Model',
    caseStudyLink: '/dashboards/sales-pipeline',
    insights: [
      'Jan baseline: Initial migration to columnar storage reduced report latency by 68%.',
      'Feb surge: Multi-currency billing automation added 14 new recurring accounts.',
      'Mar dip: Seasonal audit calibration stabilized forecast accuracy to 99.4%.',
      'Apr spike: Strategic enterprise contracts expanded monthly cash retention +19%.',
      'May consolidation: Cloud cluster caching lowered AWS data retrieval expenses.',
      'Jun rally: High-volume API transactions crossed 100M total operations.',
      'Jul peak: Q3 gross margin expanded +3.8% following automated DAX optimization.',
      'Aug record: All-time high recurring run-rate with zero critical SLA breaches.',
    ],
  },
  {
    id: 'data-pipeline',
    name: 'ETL Pipeline',
    badge: 'Real-Time Telemetry',
    icon: Cpu,
    kpi1: { label: 'ETL Throughput', value: '4.82M rec/s', numVal: 4820000, delta: '+19.2%', unit: 'M', prefix: '' },
    kpi2: { label: 'Pipeline SLA', value: '99.98%', delta: '0 failures', subtitle: 'Target: 99.95%' },
    kpi3: { label: 'P95 Query Speed', value: '18.4ms', delta: '4.2x faster', status: 'Healthy' },
    chartTitle: 'Ingestion Throughput vs Cluster Capacity Limit',
    data: [55, 64, 82, 76, 94, 108, 104, 128],
    planned: [50, 58, 70, 72, 85, 95, 98, 112],
    slices: [
      { label: 'Batch Spark Sync', share: 48, color: 'var(--accent)' },
      { label: 'Kafka Realtime', share: 38, color: '#06b6d4' },
      { label: 'On-Demand API', share: 14, color: '#ec4899' },
    ],
    caseStudyTitle: 'High-Throughput Analytics Infrastructure',
    caseStudyLink: '/infrastructure',
    insights: [
      'Node 01: Ingestion baseline established with zero data drop.',
      'Node 02: Automated index rebalancing accelerated CDC replication.',
      'Node 03: Peak event burst handled cleanly with automated node scaling.',
      'Node 04: Query caching layer absorbed 84% of concurrent BI queries.',
      'Node 05: Data deduplication logic eliminated redundant transactional rows.',
      'Node 06: Distributed cluster throughput exceeded 4.2M records/sec benchmark.',
      'Node 07: Real-time schema validation prevented upstream pipeline halt.',
      'Node 08: End-to-end sync completed 14 minutes ahead of scheduled window.',
    ],
  },
  {
    id: 'pipeline-sales',
    name: 'Deal Intelligence',
    badge: 'Conversion Matrix',
    icon: Layers,
    kpi1: { label: 'Active Pipeline', value: '$3.42M', numVal: 3420000, delta: '+34.2%', unit: 'M', prefix: '$' },
    kpi2: { label: 'Win Probability', value: '38.2%', delta: '+6.4%', subtitle: 'vs 31.8% benchmark' },
    kpi3: { label: 'Sales Velocity', value: '22 Days', delta: '-8 days', status: 'Fast-Track' },
    chartTitle: 'Qualified Stage Progression & Conversion Velocity',
    data: [36, 48, 64, 58, 82, 76, 98, 116],
    planned: [32, 42, 54, 52, 70, 72, 86, 102],
    slices: [
      { label: 'Strategic Tier-1', share: 56, color: 'var(--accent)' },
      { label: 'Mid-Market Scale', share: 28, color: '#38bdf8' },
      { label: 'Warm Inbound', share: 16, color: '#a855f7' },
    ],
    caseStudyTitle: 'Executive Sales Pipeline Analytics',
    caseStudyLink: '/dashboards/sales-pipeline',
    insights: [
      'Stage 1: Discovery volume up +22% from targeted account intelligence.',
      'Stage 2: Technical qualification rate accelerated with self-serve demos.',
      'Stage 3: Proposal conversion rose to 46% with automated ROI calculators.',
      'Stage 4: Executive sponsor engagement reduced negotiation cycle length.',
      'Stage 5: Multi-year expansion options accepted by 6 enterprise accounts.',
      'Stage 6: Competitive win rate reached 74% against legacy BI providers.',
      'Stage 7: Closing velocity accelerated 8 days ahead of quarterly forecast.',
      'Stage 8: Record pipeline close rate generated $3.42M in net ARR.',
    ],
  },
];

const PERIODS = ['30D', '90D', 'QTD', 'FY26'];
const PERIOD_MULTIPLIERS = [0.35, 0.72, 1.0, 2.35];
const PERIOD_LABELS = [
  ['Day 04', 'Day 08', 'Day 12', 'Day 16', 'Day 20', 'Day 24', 'Day 28', 'Day 30'],
  ['Wk 01', 'Wk 03', 'Wk 05', 'Wk 07', 'Wk 09', 'Wk 10', 'Wk 11', 'Wk 12'],
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26', 'Q3-26', 'Q4-26'],
];

const SEGMENTS = ['All Segments', 'Enterprise Core', 'Mid-Market'];
const SEGMENT_FACTORS = [1.0, 0.68, 0.32];

// Domain 2: Cluster Nodes
const CLUSTER_NODES = [
  { name: 'Node-01 Spark', cpu: 74, latency: '12ms', status: 'Optimal' },
  { name: 'Node-02 Kafka', cpu: 82, latency: '16ms', status: 'High Peak' },
  { name: 'Node-03 Worker', cpu: 65, latency: '10ms', status: 'Optimal' },
  { name: 'Node-04 Engine', cpu: 48, latency: '8ms', status: 'Healthy' },
];

// Domain 3: Funnel Stages
const FUNNEL_STAGES = [
  { name: 'Discovery', deals: '420 Deals', value: '$8.4M', widthPct: 100, conv: '100%' },
  { name: 'Qualified', deals: '240 Deals', value: '$6.1M', widthPct: 78, conv: '57% conv' },
  { name: 'Proposal', deals: '145 Deals', value: '$4.2M', widthPct: 58, conv: '60% conv' },
  { name: 'Negotiation', deals: '78 Deals', value: '$2.8M', widthPct: 40, conv: '54% conv' },
  { name: 'Closed Won', deals: '46 Deals', value: '$1.9M', widthPct: 25, conv: '59% conv' },
];

export default function PortfolioHeroDashboard() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [periodIdx, setPeriodIdx] = useState(2); // QTD default
  const [segmentIdx, setSegmentIdx] = useState(0); // All Segments
  const [activePoint, setActivePoint] = useState(7); // Last point
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState(4); // Default to Closed Won
  const [autoTour, setAutoTour] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const gradientId = useId().replace(/:/g, '');
  const barGradId = useId().replace(/:/g, '');
  const scenario = SCENARIOS[scenarioIdx];

  // Auto-tour rotation every 7 seconds when unengaged
  useEffect(() => {
    if (!autoTour || isHovered) return;
    const interval = setInterval(() => {
      setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
      setActivePoint(7);
      setActiveSlice(null);
    }, 7000);
    return () => clearInterval(interval);
  }, [autoTour, isHovered]);

  // Compute live data with period and segment multipliers
  const periodFactor = PERIOD_MULTIPLIERS[periodIdx];
  const segmentFactor = SEGMENT_FACTORS[segmentIdx];
  const combinedFactor = periodFactor * segmentFactor;

  const currentData = scenario.data.map((val, idx) =>
    Math.round((val + (periodIdx - 2) * (idx % 2 ? 6 : -4)) * segmentFactor)
  );
  const currentPlanned = scenario.planned.map((val) =>
    Math.round(val * segmentFactor)
  );

  // SVG Chart Geometry
  const chartWidth = 460;
  const chartHeight = 158;
  const paddingX = 35;
  const paddingY = 18;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const maxValue = Math.max(...currentData, ...currentPlanned) * 1.12;

  const points = currentData.map((val, idx) => {
    const x = paddingX + (idx / (currentData.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (val / maxValue) * usableHeight;
    return [x, y];
  });

  const plannedPoints = currentPlanned.map((val, idx) => {
    const x = paddingX + (idx / (currentPlanned.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (val / maxValue) * usableHeight;
    return [x, y];
  });

  // Cubic Bézier Spline generator (for FinTech)
  const splinePath = points.reduce((acc, [x, y], idx) => {
    if (idx === 0) return `M ${x} ${y}`;
    const [prevX, prevY] = points[idx - 1];
    const cpX1 = prevX + (x - prevX) / 2;
    const cpY1 = prevY;
    const cpX2 = prevX + (x - prevX) / 2;
    const cpY2 = y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
  }, '');

  const areaPath = `${splinePath} L ${points[points.length - 1][0]} ${chartHeight - paddingY} L ${points[0][0]} ${chartHeight - paddingY} Z`;

  const plannedSplinePath = plannedPoints.reduce((acc, [x, y], idx) => {
    if (idx === 0) return `M ${x} ${y}`;
    const [prevX, prevY] = plannedPoints[idx - 1];
    const cpX1 = prevX + (x - prevX) / 2;
    const cpY1 = prevY;
    const cpX2 = prevX + (x - prevX) / 2;
    const cpY2 = y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
  }, '');

  // Radial Donut Geometry (for Deal Intelligence)
  const circumference = 2 * Math.PI * 34; // r = 34
  let accumulatedOffset = 0;

  // Speedometer Gauge Geometry (for FinTech)
  // 240 degree sweep from 150° to 390° (r = 48)
  const gaugeRadius = 48;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeSweep = (240 / 360) * gaugeCircumference; // Length of the 240 deg arc
  // Target is 84.6% -> fill 84.6% of the 240 deg sweep
  const gaugeTargetPct = 0.846;
  const gaugeFillDash = gaugeTargetPct * gaugeSweep;

  // Selected Data Point Details
  const activeLabel = PERIOD_LABELS[periodIdx][activePoint];
  const activeVal = currentData[activePoint];
  const activeTarget = currentPlanned[activePoint];
  const varianceNum = activeVal - activeTarget;
  const variancePct = Math.round((varianceNum / activeTarget) * 100);

  // Formatted Metric 1 Value
  const rawKpiVal = Math.round(scenario.kpi1.numVal * combinedFactor);
  const formattedKpi1 =
    scenario.kpi1.prefix +
    (rawKpiVal >= 1000000
      ? (rawKpiVal / 1000000).toFixed(2) + 'M'
      : rawKpiVal >= 1000
      ? (rawKpiVal / 1000).toFixed(1) + 'k'
      : rawKpiVal.toLocaleString('en-US'));

  return (
    <div
      className={styles.dashboardContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Interactive Executive Portfolio Dashboard"
    >
      {/* ── Top Window Bar (Chrome) ── */}
      <div className={styles.windowBar}>
        <div className={styles.windowControls}>
          <span className={styles.dotRed} title="Close view" />
          <span className={styles.dotYellow} title="Minimize view" />
          <span className={styles.dotGreen} title="Maximize view" />
        </div>

        <div className={styles.windowTitle}>
          <strong>AURA BI COCKPIT</strong>
          <span>/</span>
          <span className={styles.windowBadge}>
            <span className={styles.pulseDot} />
            LIVE TELEMETRY
          </span>
        </div>

        <div className={styles.windowActions}>
          <button
            className={`${styles.tourButton} ${autoTour && !isHovered ? styles.activeTour : ''}`}
            onClick={() => setAutoTour(!autoTour)}
            title={autoTour ? 'Pause auto-tour' : 'Start auto-tour'}
            aria-label={autoTour ? 'Pause interactive tour' : 'Play interactive tour'}
          >
            {autoTour && !isHovered ? <Pause size={10} /> : <Play size={10} />}
            <span>{autoTour && !isHovered ? 'Touring' : 'Auto-Tour'}</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Scenario & Filter Strip ── */}
      <div className={styles.controlStrip}>
        <div className={styles.scenarioTabs} role="tablist" aria-label="Dashboard Domain">
          {SCENARIOS.map((scen, idx) => {
            const Icon = scen.icon;
            return (
              <button
                key={scen.id}
                role="tab"
                aria-selected={scenarioIdx === idx}
                className={`${styles.scenarioTab} ${scenarioIdx === idx ? styles.activeTab : ''}`}
                onClick={() => {
                  setScenarioIdx(idx);
                  setActivePoint(7);
                  setActiveSlice(null);
                  setAutoTour(false);
                }}
              >
                <Icon size={12} />
                <span>{scen.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.secondaryFilters}>
          {/* Period Selector */}
          <div className={styles.periodPills} role="group" aria-label="Time period">
            {PERIODS.map((period, idx) => (
              <button
                key={period}
                className={`${styles.periodPill} ${periodIdx === idx ? styles.activePeriod : ''}`}
                onClick={() => {
                  setPeriodIdx(idx);
                  setAutoTour(false);
                }}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Segment Slicer */}
          <button
            className={styles.segmentSelector}
            onClick={() => {
              setSegmentIdx((prev) => (prev + 1) % SEGMENTS.length);
              setAutoTour(false);
            }}
            title="Click to cycle segment filter"
          >
            <Filter size={10} />
            <span>{SEGMENTS[segmentIdx]}</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards Strip ── */}
      <div className={styles.kpiGrid}>
        {/* KPI 1 */}
        <div
          className={styles.kpiCard}
          style={{ '--kpi-accent': scenarioIdx === 1 ? '#06b6d4' : 'var(--accent)' } as React.CSSProperties}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{scenario.kpi1.label}</span>
            <span className={styles.kpiDelta}>{scenario.kpi1.delta}</span>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formattedKpi1}</span>
            {/* SVG Sparkline */}
            <svg className={styles.kpiMiniSparkline} viewBox="0 0 50 20" fill="none">
              <path
                d={
                  scenarioIdx === 1
                    ? 'M 2 14 L 10 10 L 18 16 L 26 6 L 34 8 L 42 3 L 48 2'
                    : scenarioIdx === 2
                    ? 'M 2 18 L 12 15 L 22 11 L 32 8 L 42 4 L 48 2'
                    : 'M 2 16 L 10 13 L 18 15 L 26 8 L 34 11 L 42 4 L 48 2'
                }
                stroke={scenarioIdx === 1 ? '#06b6d4' : 'var(--accent)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.kpiFootnote}>
            <span>{PERIODS[periodIdx]} aggregate</span>
            <span>Target on-track</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          className={styles.kpiCard}
          style={{ '--kpi-accent': '#10b981' } as React.CSSProperties}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{scenario.kpi2.label}</span>
            <span className={styles.kpiDelta}>{scenario.kpi2.delta}</span>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{scenario.kpi2.value}</span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div className={styles.kpiFootnote}>
            <span>{scenario.kpi2.subtitle}</span>
            <span>DAX verified</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          className={styles.kpiCard}
          style={
            {
              '--kpi-accent':
                scenarioIdx === 1 ? '#8b5cf6' : scenarioIdx === 2 ? '#f59e0b' : '#38bdf8',
            } as React.CSSProperties
          }
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{scenario.kpi3.label}</span>
            <span
              className={styles.kpiDelta}
              style={{
                color:
                  scenarioIdx === 1
                    ? '#8b5cf6'
                    : scenarioIdx === 2
                    ? '#f59e0b'
                    : 'var(--accent)',
                background:
                  scenarioIdx === 1
                    ? 'rgba(139, 92, 246, 0.12)'
                    : scenarioIdx === 2
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'color-mix(in srgb, var(--accent) 12%, transparent)',
              }}
            >
              {scenario.kpi3.status}
            </span>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{scenario.kpi3.value}</span>
            <Activity
              size={16}
              color={
                scenarioIdx === 1
                  ? '#8b5cf6'
                  : scenarioIdx === 2
                  ? '#f59e0b'
                  : 'var(--accent)'
              }
            />
          </div>
          <div className={styles.kpiFootnote}>
            <span>{scenario.kpi3.delta}</span>
            <span>Live node telemetry</span>
          </div>
        </div>
      </div>

      {/* ── Main Dual-Visual Workspace: Custom Visuals per Tab ── */}
      <div className={styles.workspaceLayout}>
        {/* ========================================================
            LEFT VISUAL CONTAINER
            - Tab 0: Spline Area Chart (FinTech)
            - Tab 1: Clustered Bar Columns with Capacity Line (ETL Pipeline)
            - Tab 2: Stepped Conversion Funnel Waterfall (Deal Flow)
           ======================================================== */}
        <div className={styles.chartCard}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>
              <i />
              <span>{scenario.chartTitle}</span>
            </div>

            <div className={styles.cardLegend}>
              {scenarioIdx === 0 && (
                <>
                  <span className={styles.legendActual}>
                    <i /> Actual
                  </span>
                  <span className={styles.legendTarget}>
                    <i /> Target
                  </span>
                </>
              )}
              {scenarioIdx === 1 && (
                <>
                  <span className={styles.legendActual}>
                    <i /> Ingestion
                  </span>
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i style={{ width: 12, height: 2, borderTop: '2px dashed #ef4444' }} /> Capacity
                  </span>
                </>
              )}
              {scenarioIdx === 2 && (
                <span style={{ color: 'var(--accent)', fontSize: 'var(--text-small)', fontWeight: 700 }}>
                  5-Stage Sales Velocity
                </span>
              )}
            </div>
          </div>

          <div className={styles.chartSvgWrapper}>
            {/* Visual 1: Spline Area Curve (FinTech) */}
            {scenarioIdx === 0 && (
              <>
                <div className={styles.chartTooltip}>
                  <div className={styles.tooltipTitle}>
                    <span>{activeLabel}</span>
                    <span className={styles.tooltipBadge}>
                      {varianceNum >= 0 ? `+${variancePct}%` : `${variancePct}%`}
                    </span>
                  </div>
                  <div className={styles.tooltipNumbers}>
                    <span>
                      {scenario.kpi1.prefix}
                      {activeVal}
                      {scenario.kpi1.unit}
                    </span>
                    <span className={styles.tooltipVariance}>
                      vs {scenario.kpi1.prefix}
                      {activeTarget}
                      {scenario.kpi1.unit} planned
                    </span>
                  </div>
                </div>

                <svg
                  className={styles.interactiveSvg}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
                    const closestIdx = points.reduce((bestIdx, [px], idx) => {
                      return Math.abs(px - mouseX) < Math.abs(points[bestIdx][0] - mouseX) ? idx : bestIdx;
                    }, 0);
                    setActivePoint(closestIdx);
                    setAutoTour(false);
                  }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
                      <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                    const y = chartHeight - paddingY - frac * usableHeight;
                    return (
                      <g key={idx}>
                        <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} className={styles.chartGridLine} />
                        <text x={8} y={y + 3} className={styles.chartAxisText}>
                          {Math.round(maxValue * frac)}
                        </text>
                      </g>
                    );
                  })}

                  <path d={areaPath} fill={`url(#${gradientId})`} />
                  <path d={plannedSplinePath} className={styles.chartTargetLine} />
                  <path d={splinePath} className={styles.chartTrendLine} />

                  <line
                    x1={points[activePoint][0]}
                    y1={paddingY}
                    x2={points[activePoint][0]}
                    y2={chartHeight - paddingY}
                    className={styles.chartCrosshair}
                  />

                  {points.map(([px, py], idx) => {
                    const isSelected = activePoint === idx;
                    return (
                      <g key={idx}>
                        <text
                          x={px}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className={styles.chartAxisText}
                          style={{
                            fontWeight: isSelected ? '700' : '400',
                            fill: isSelected ? 'var(--text)' : 'var(--muted)',
                          }}
                        >
                          {PERIOD_LABELS[periodIdx][idx]}
                        </text>
                        <circle
                          cx={px}
                          cy={py}
                          r={isSelected ? 6 : 3}
                          className={isSelected ? styles.activePointRing : ''}
                          fill={isSelected ? 'var(--surface)' : 'var(--accent)'}
                          stroke={isSelected ? 'var(--accent)' : 'none'}
                          strokeWidth={isSelected ? 2.5 : 0}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setActivePoint(idx);
                            setAutoTour(false);
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </>
            )}

            {/* Visual 2: Clustered Columns & Capacity Ceiling (ETL Pipeline) */}
            {scenarioIdx === 1 && (
              <>
                <div className={styles.chartTooltip}>
                  <div className={styles.tooltipTitle}>
                    <span>{activeLabel}</span>
                    <span className={styles.tooltipBadge} style={{ color: '#10b981' }}>
                      Optimal SLA
                    </span>
                  </div>
                  <div className={styles.tooltipNumbers}>
                    <span>{activeVal}M rec/s</span>
                    <span className={styles.tooltipVariance}>18ms P95 latency</span>
                  </div>
                </div>

                <svg
                  className={styles.interactiveSvg}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                  <defs>
                    <linearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid */}
                  {[0.33, 0.66, 1.0].map((frac, idx) => {
                    const y = chartHeight - paddingY - frac * usableHeight;
                    return (
                      <line
                        key={idx}
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        className={styles.chartGridLine}
                      />
                    );
                  })}

                  {/* Cluster Max Capacity Limit Line (Dashed Red Line) */}
                  <line
                    x1={paddingX}
                    y1={24}
                    x2={chartWidth - paddingX}
                    y2={24}
                    className={styles.capacityLine}
                  />
                  <text x={chartWidth - paddingX - 75} y={19} className={styles.capacityBadge}>
                    CAPACITY LIMIT: 140M/s
                  </text>

                  {/* Dual Column Bars for each time point */}
                  {currentData.map((val, idx) => {
                    const slotWidth = usableWidth / currentData.length;
                    const barW = 16;
                    const xCenter = paddingX + idx * slotWidth + slotWidth / 2;
                    const barH = (val / maxValue) * usableHeight;
                    const y = chartHeight - paddingY - barH;
                    const isSelected = activePoint === idx;

                    return (
                      <g
                        key={idx}
                        onClick={() => {
                          setActivePoint(idx);
                          setAutoTour(false);
                        }}
                        onMouseEnter={() => {
                          setActivePoint(idx);
                          setAutoTour(false);
                        }}
                      >
                        {/* Background buffer bar */}
                        <rect
                          x={xCenter - barW / 2}
                          y={chartHeight - paddingY - (val * 1.15 / maxValue) * usableHeight}
                          width={barW}
                          height={(val * 1.15 / maxValue) * usableHeight}
                          rx={3}
                          className={styles.barColumnBuffer}
                        />

                        {/* Primary Processed Ingestion Column */}
                        <rect
                          x={xCenter - barW / 2}
                          y={y}
                          width={barW}
                          height={barH}
                          rx={3}
                          fill={`url(#${barGradId})`}
                          className={styles.barColumnActual}
                          opacity={isSelected ? 1 : 0.8}
                          stroke={isSelected ? 'var(--text)' : 'none'}
                          strokeWidth={isSelected ? 1.5 : 0}
                        />

                        {/* Bottom Label */}
                        <text
                          x={xCenter}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className={styles.chartAxisText}
                          style={{
                            fontWeight: isSelected ? '700' : '400',
                            fill: isSelected ? 'var(--text)' : 'var(--muted)',
                          }}
                        >
                          {PERIOD_LABELS[periodIdx][idx]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </>
            )}

            {/* Visual 3: Stepped Conversion Funnel Waterfall (Deal Intelligence) */}
            {scenarioIdx === 2 && (
              <div className={styles.funnelContainer}>
                {FUNNEL_STAGES.map((stg, idx) => {
                  const isSelected = activeStage === idx;
                  return (
                    <div
                      key={stg.name}
                      className={`${styles.funnelStage} ${isSelected ? styles.activeStage : ''}`}
                      onClick={() => {
                        setActiveStage(idx);
                        setActivePoint(idx % scenario.insights.length);
                        setAutoTour(false);
                      }}
                      onMouseEnter={() => {
                        setActiveStage(idx);
                        setActivePoint(idx % scenario.insights.length);
                        setAutoTour(false);
                      }}
                    >
                      <div className={styles.funnelMeta}>
                        <span>{stg.name}</span>
                        <small>{stg.deals}</small>
                      </div>

                      <div className={styles.funnelBarTrack}>
                        <div
                          className={styles.funnelBarFill}
                          style={{
                            width: `${stg.widthPct}%`,
                            opacity: isSelected ? 1 : 0.78,
                          }}
                        >
                          <span className={styles.funnelBarText}>{stg.value}</span>
                        </div>
                      </div>

                      <span className={styles.funnelConvBadge}>{stg.conv}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDECAR VISUAL CONTAINER
            - Tab 0: Speedometer Radial Gauge (FinTech Gross Margin)
            - Tab 1: Server Cluster Health Telemetry Grid (ETL Pipeline)
            - Tab 2: Deal Attribution Donut Ring (Deal Intelligence)
           ======================================================== */}
        <div className={styles.breakdownCard}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>
              {scenarioIdx === 0 && <Sparkles size={11} color="var(--accent)" />}
              {scenarioIdx === 1 && <Server size={11} color="#10b981" />}
              {scenarioIdx === 2 && <Layers size={11} color="var(--accent)" />}
              <span>
                {scenarioIdx === 0
                  ? 'Margin Gauge'
                  : scenarioIdx === 1
                  ? 'Node Cluster'
                  : 'Source Mix'}
              </span>
            </div>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--muted)' }}>
              {scenarioIdx === 0 ? 'Target Dial' : scenarioIdx === 1 ? '4 Nodes' : 'Attribution'}
            </span>
          </div>

          <div className={styles.breakdownBody}>
            {/* Visual 1 Right: Speedometer Semi-Circle Gauge (FinTech) */}
            {scenarioIdx === 0 && (
              <>
                <div className={styles.gaugeWrapper}>
                  <svg className={styles.gaugeSvg} viewBox="0 0 130 95">
                    {/* Track Arc (240 deg sweep from angle 150 to 390) */}
                    <path
                      d="M 24 82 A 48 48 0 1 1 106 82"
                      className={styles.gaugeTrack}
                    />

                    {/* Active Value Progress Fill Arc */}
                    <path
                      d="M 24 82 A 48 48 0 1 1 106 82"
                      className={styles.gaugeFill}
                      strokeDasharray={`${gaugeFillDash} ${gaugeCircumference}`}
                    />

                    {/* Benchmark Target Indicator Line at 80% mark */}
                    <line
                      x1="65"
                      y1="18"
                      x2="65"
                      y2="28"
                      className={styles.gaugeTargetTick}
                    />
                  </svg>

                  <div className={styles.gaugeCenter}>
                    <span className={styles.gaugeValue}>84.6%</span>
                    <span className={styles.gaugeLabel}>GROSS MARGIN</span>
                  </div>
                </div>

                <div className={styles.gaugeFootnote}>
                  <span>Target: 80.0%</span>
                  <strong>+3.8% Optimal</strong>
                </div>
              </>
            )}

            {/* Visual 2 Right: Multi-Node Telemetry Grid (ETL Pipeline) */}
            {scenarioIdx === 1 && (
              <div className={styles.nodeGrid}>
                {CLUSTER_NODES.map((node) => (
                  <div key={node.name} className={styles.nodeCard}>
                    <div className={styles.nodeCardTop}>
                      <span>{node.name.split(' ')[0]}</span>
                      <span className={styles.nodeDotLive} />
                    </div>

                    <div className={styles.nodeStats}>
                      <span>CPU</span>
                      <span className={styles.nodeCpuVal}>{node.cpu}%</span>
                    </div>

                    <div className={styles.nodeBarTrack}>
                      <div
                        className={styles.nodeBarFill}
                        style={{ width: `${node.cpu}%` }}
                      />
                    </div>

                    <div className={styles.nodeStats} style={{ marginTop: 2 }}>
                      <span>{node.latency}</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{node.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Visual 3 Right: Deal Source Donut Ring (Deal Intelligence) */}
            {scenarioIdx === 2 && (
              <>
                <div className={styles.radialWrapper}>
                  <svg className={styles.radialSvg} viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="34" className={styles.radialTrack} />
                    {scenario.slices.map((slice, idx) => {
                      const sliceDash = (slice.share / 100) * circumference;
                      const currentOffset = accumulatedOffset;
                      accumulatedOffset += sliceDash;
                      const isHoveredSlice = activeSlice === idx;

                      return (
                        <circle
                          key={slice.label}
                          cx="45"
                          cy="45"
                          r="34"
                          className={styles.radialSegment}
                          stroke={slice.color}
                          strokeWidth={isHoveredSlice ? 13 : 9}
                          strokeDasharray={`${sliceDash - 3} ${circumference}`}
                          strokeDashoffset={-currentOffset}
                          onMouseEnter={() => {
                            setActiveSlice(idx);
                            setAutoTour(false);
                          }}
                          onMouseLeave={() => setActiveSlice(null)}
                        />
                      );
                    })}
                  </svg>

                  <div className={styles.radialCenterText}>
                    <strong>
                      {activeSlice !== null ? `${scenario.slices[activeSlice].share}%` : '38.2%'}
                    </strong>
                    <small>
                      {activeSlice !== null ? scenario.slices[activeSlice].label.split(' ')[0] : 'Win Rate'}
                    </small>
                  </div>
                </div>

                <div className={styles.segmentList}>
                  {scenario.slices.map((slice, idx) => (
                    <div
                      key={slice.label}
                      className={`${styles.segmentRow} ${activeSlice === idx ? styles.activeSegment : ''}`}
                      onMouseEnter={() => {
                        setActiveSlice(idx);
                        setAutoTour(false);
                      }}
                      onMouseLeave={() => setActiveSlice(null)}
                    >
                      <div className={styles.segmentKey}>
                        <span className={styles.segmentDot} style={{ background: slice.color }} />
                        <span>{slice.label}</span>
                      </div>
                      <span className={styles.segmentShare}>{slice.share}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Insight & Case Study Bar ── */}
      <div className={styles.bottomInsightBar}>
        <div className={styles.insightText}>
          <Zap size={13} className={styles.insightIcon} />
          <span>
            <strong>AI Model Note: </strong>
            {scenario.insights[activePoint] || scenario.insights[0]}
          </span>
        </div>

        <Link href={scenario.caseStudyLink} className={styles.insightLink}>
          <span>Explore Demo</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
