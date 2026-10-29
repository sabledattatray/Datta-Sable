export interface CaseStudyDetail {
  problemContext: string;
  datasetInfo: {
    source: string;
    rows: string;
    grain: string;
    provenance: string;
    limitations: string;
  };
  toolsAndRoles: { tool: string; role: string }[];
  methodology: string[];
  kpiDefinitions: { name: string; formula: string; description: string }[];
  keyFindings: string[];
  validationChecks: string[];
  limitationsAndNextSteps: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'Risk & Delinquency' | 'Power BI & Sales BI' | 'Excel & Power BI MIS';
  statusLabel: string;
  provenanceLabel: string;
  image: string;
  color: string;
  tools: string[];
  executiveSummary: string;
  businessQuestion: string;
  deliverables: string[];
  liveUrl: string;
  liveUrlLabel: string;
  githubUrl?: string;
  caseStudy: CaseStudyDetail;
}

export interface ProjectData {
  id: number;
  title: string;
  category: string;
  image: string;
  color: string;
  tools: string[];
  client: string;
  desc: string;
  problem: string;
  solution: string;
  impact: string;
  github: string;
  live: string;
  statusBadge?: string;
  categories?: string[];
  flagship?: FlagshipDetail;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  classification: 'Real screenshot' | 'Design mockup' | 'Architecture diagram';
  source: string;
}

export interface FlagshipDetail {
  slug: string;
  order: number;
  evidence: { value: string; label: string; source: string }[];
  gallery: ProjectMedia[];
  architecture: string[];
  implementation: string[];
  limitations: string[];
  sources: { label: string; url: string }[];
  release?: string;
  cta: string;
  verifiedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  deliverables: string[];
  typicalInputs: string[];
  outcomes: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  focus: string;
  description: string;
  deliverable: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. THE THREE FLAGSHIP DEMONSTRABLE PROJECTS (PRD Core Focus)
// ─────────────────────────────────────────────────────────────────────────────

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'telecom-delinquency-intelligence',
    title: 'Telecom Collection & Delinquency Intelligence',
    subtitle: 'Postpaid Portfolio Aging, Roll-Rate Analysis & Tele-Caller Allocation Engine',
    category: 'Risk & Delinquency',
    statusLabel: 'Portfolio Demonstration',
    provenanceLabel: 'Synthetic BFSI / Telecom Dataset (250K Accounts)',
    image: '/images/dashboards/telecom_collection_delinquency.webp',
    color: '#00d4ff',
    tools: ['Power BI', 'SQL Server (SSMS)', 'Advanced DAX', 'Power Query'],
    businessQuestion:
      'Which subscriber cohorts drive delinquency slippage into 60+ and 90+ DPD buckets, and how should recovery teams allocate caller bandwidth to protect portfolio cash flow?',
    executiveSummary:
      'A multi-dimensional portfolio risk engine designed to model collections efficiency, roll-forward probabilities, and collector resolution rates across 6 billing cycles without compromising subscriber privacy.',
    deliverables: [
      'Interactive aging bucket cockpit (Current, 1-30, 31-60, 61-90, 90+ DPD)',
      'Roll-rate transition matrix tracking cohort migration period-over-period',
      'Collector resolution & call disposition performance tracking',
      'Data dictionary and automated SQL ETL validation scripts',
    ],
    liveUrl: '/dashboards/collection-intelligence',
    liveUrlLabel: 'Launch Interactive Dashboard',
    githubUrl: 'https://github.com/sabledattatray/dattasable',
    caseStudy: {
      problemContext:
        'In high-volume consumer credit and postpaid telecommunication portfolios, collections managers struggle with fragmented spreadsheets. Delinquent balances are reported in aggregate totals without visibility into bucket roll rates or collector productivity. By the time write-off risks become visible at month-end, the window for intervention has closed.',
      datasetInfo: {
        source: 'Synthetic BFSI delinquency data modeled on standard Indian retail banking & telecom postpaid credit structures.',
        rows: '250,000 monthly account snapshot records across 6 consecutive billing cycles.',
        grain: 'One record per subscriber account per billing cycle month.',
        provenance: '100% synthetic/anonymized dataset generated for portfolio demonstration. Contains zero actual customer, employer, or institutional information.',
        limitations: 'Model assumes static credit limit parameters; does not capture real-time intraday bureau score updates.',
      },
      toolsAndRoles: [
        { tool: 'SQL Server (SSMS)', role: 'Data profiling, CTE-based bucket categorization, window functions for previous-month roll tracking.' },
        { tool: 'Power Query', role: 'Automated data shaping, unpivoting payment disposition logs, parameterizing monthly ledger ingestion.' },
        { tool: 'Advanced DAX', role: 'Dynamic measure branching for Roll-Rate %, Resolution Rate %, and Net Overdue Exposure.' },
        { tool: 'Power BI UI', role: 'High-contrast executive layout with drill-through navigation from national overview to team-level queues.' },
      ],
      methodology: [
        'Profiled account balances, payment timestamps, and billing statuses to eliminate orphaned records and negative adjustments.',
        'Constructed a clean Star Schema: FactCollections joined to DimCustomerSegment, DimAgingBucket, DimTeleCallerTeam, and DimDate.',
        'Engineered time-intelligence DAX to calculate roll-forward migration (balance moving from Bucket N in Month T-1 to Bucket N+1 in Month T).',
        'Implemented field-level conditional formatting to flag accounts crossing critical 60 DPD thresholds.',
        'Validated all aggregated collection totals against source billing control tables within a 0.00% variance tolerance.',
      ],
      kpiDefinitions: [
        { name: 'Resolution Rate %', formula: 'DIVIDE([Collected Amount], [Opening Overdue Balance], 0)', description: 'Proportion of overdue balance recovered during the active 30-day cycle.' },
        { name: 'Roll-Forward Rate %', formula: 'DIVIDE([Balance Migrated to Next Bucket], [Prior Bucket Opening Balance], 0)', description: 'Velocity at which accounts degrade into deeper delinquency stages.' },
        { name: 'Net Overdue Exposure', formula: 'SUM(FactCollections[OverdueAmount]) - SUM(FactCollections[RecoveredAmount])', description: 'Total capital at risk requiring active recovery intervention.' },
      ],
      keyFindings: [
        'Accounts that roll from 1-30 DPD to 31-60 DPD exhibit a 64% decline in probability of curing without targeted field escalation.',
        'Tele-caller outreach within the first 5 days of cycle due-date yields 3.2x higher recovery efficiency than end-of-month pushes.',
        'Auto-debit failure alerts segmented by banking institution revealed 42% of first-time delinquencies were operational rather than insolvency-driven.',
      ],
      validationChecks: [
        'Source-to-target reconciliation: Sum of FactCollections[PaidAmount] matches general billing ledger total across all 6 cycles.',
        'No orphaned dimension keys: Referential integrity enforced across subscriber segment and agency dimensions.',
        'DAX performance: All cross-filtering visual calculations execute within <80ms in Power BI desktop analyzer.',
      ],
      limitationsAndNextSteps:
        'Current demonstration uses monthly account snapshots. Next planned enhancement is integrating daily promise-to-pay (PTP) disposition tracking and automated agent escalation queues.',
    },
  },
  {
    id: 'sales-pipeline-velocity',
    title: 'Executive B2B Sales Pipeline & Revenue Velocity Dashboard',
    subtitle: 'Deal Stage Conversion, Sales Velocity Modeling & Risk-Adjusted Revenue Forecasting',
    category: 'Power BI & Sales BI',
    statusLabel: 'Live Interactive Solution',
    provenanceLabel: 'Synthetic Multi-Regional CRM Dataset (1,850 Opportunities)',
    image: '/images/dashboards/sales_pipeline_preview.webp',
    color: '#c9f31d',
    tools: ['Power BI', 'DAX Time Intelligence', 'SQL Server', 'Power Query'],
    businessQuestion:
      'Where are high-value enterprise deals stalling in the sales funnel, and what is the realistic, risk-adjusted revenue forecast for the next 90 days across sales territories?',
    executiveSummary:
      'An enterprise pipeline analytics framework delivering transparency into deal velocity, rep quota attainment, and stage-by-stage leakage for revenue leaders and finance forecasters.',
    deliverables: [
      'Interactive deal velocity and stage transition funnel',
      'Risk-weighted revenue forecasting based on historical win-rates',
      'Sales rep productivity and quota pacing matrix',
      'Complete measure dictionary and data modeling documentation',
    ],
    liveUrl: '/dashboards/sales-pipeline',
    liveUrlLabel: 'Launch Live Solution',
    githubUrl: 'https://github.com/sabledattatray/dattasable',
    caseStudy: {
      problemContext:
        'Sales executives frequently rely on subjective CRM stages and self-reported closing dates. This results in inaccurate quarterly forecasts, unspotted pipeline bottlenecks, and misallocated executive sponsorship on deals that have already stalled beyond recovery.',
      datasetInfo: {
        source: 'Synthetic enterprise B2B sales ledger modeled on SaaS and industrial equipment commercial operations.',
        rows: '1,850 opportunity records spanning 4 fiscal quarters, 5 geographic regions, and 28 account executives.',
        grain: 'One record per deal stage event and opportunity closure.',
        provenance: '100% synthetic CRM dataset. All company names, reps, and deal amounts are generated for technical demonstration.',
        limitations: 'Assumes linear funnel progression without capturing multi-threaded parallel negotiation streams.',
      },
      toolsAndRoles: [
        { tool: 'Power BI', role: 'Interactive stage funnel, dynamic scatter plots for deal size vs. duration, and responsive executive cockpit.' },
        { tool: 'Advanced DAX', role: 'Time intelligence (MTD, QTD, YOY), Weighted Pipeline calculation, and Sales Velocity formula.' },
        { tool: 'SQL Server', role: 'Staging views, data cleaning, and deduplication of CRM revision histories.' },
        { tool: 'Power Query', role: 'Date table generation, holiday calendar adjustment, and currency normalization.' },
      ],
      methodology: [
        'Cleaned raw CRM stage audit tables to isolate active deal lifecycle duration and eliminate negative stage movements.',
        'Established an optimized Star Schema with FactOpportunities linked to DimDate, DimRep, DimStage, and DimIndustry.',
        'Formulated custom DAX measures for Sales Velocity: (Number of Opps * Win Rate * Average Deal Value) / Sales Cycle Length.',
        'Configured interactive drill-through pages allowing executives to transition from macro quarterly view to individual rep pipeline health.',
        'Conducted user testing across desktop and tablet viewport resolutions to ensure immediate metric comprehension.',
      ],
      kpiDefinitions: [
        { name: 'Sales Velocity ($/Day)', formula: 'DIVIDE([Qualified Deals] * [Win Rate %] * [Avg Deal Size], [Average Cycle Days], 0)', description: 'Daily dollar value expected to flow through the pipeline.' },
        { name: 'Weighted Pipeline', formula: 'SUMX(FactOpportunities, FactOpportunities[Amount] * RELATED(DimStage[DefaultProbability]))', description: 'Probability-discounted value of all active pipeline opportunities.' },
        { name: 'Win / Loss Ratio', formula: 'DIVIDE([Won Deals Count], [Won Deals Count] + [Lost Deals Count], 0)', description: 'Proportion of resolved deals successfully converted to closed revenue.' },
      ],
      keyFindings: [
        'Opportunities lingering in "Proposal Sent" stage for >45 days suffered a 68% decline in win probability compared to average cycle deals.',
        'Enterprise tier deals ($100k+) required 2.4x longer negotiation periods, but demonstrated a 28% higher retention rate post-onboarding.',
        'Midwest region achieved 118% quota pacing driven by high conversion in industrial manufacturing accounts, offsetting delays in tech accounts.',
      ],
      validationChecks: [
        'Total won pipeline accurately reconciled with financial booked billings across all 4 quarters.',
        'No date gaps: continuous fiscal date table validated from Q1 2024 through Q4 2026.',
        'Stage probability weights verified by sales ops parameters prior to forecast model publication.',
      ],
      limitationsAndNextSteps:
        'Currently tracks CRM opportunities through close date. The next iteration will integrate post-sale invoicing to verify whether booked opportunities convert into collected revenue on schedule.',
    },
  },
  {
    id: 'financial-close-pnl-automation',
    title: 'Enterprise P&L & Financial Close Reconciliation Pack',
    subtitle: 'Month-End Close Automation, Budget Variance & Executive Time Intelligence (MTD / LMTD)',
    category: 'Excel & Power BI MIS',
    statusLabel: 'Flagship Architecture',
    provenanceLabel: 'Synthetic General Ledger & Chart of Accounts (36 Months)',
    image: '/images/dashboards/financial_pnl.webp',
    color: '#00F0FF',
    tools: ['Power BI', 'Advanced Excel', 'Power Query ETL', 'SQL OLAP', 'DAX'],
    businessQuestion:
      'How can financial accounting teams replace fragile, manual spreadsheet close routines with an automated, auditable P&L model that reconciles variances in seconds?',
    executiveSummary:
      'An end-to-end financial reporting architecture that streamlines ledger consolidation, automates debit/credit trial balance reconciliation, and delivers board-ready MTD/LMTD variance reporting.',
    deliverables: [
      'Executive P&L summary with dynamic Month-to-Date and Last-Month-to-Date variance',
      'Automated Power Query trial balance ingestion and exception flagging',
      'Cost center variance drilldown (Actual vs. Budget vs. Prior Year)',
      'Reconciliation checklist workbook with automated integrity checks',
    ],
    liveUrl: 'https://app.powerbi.com/reportEmbed?reportId=31b010f4-3f62-4cbe-8524-9238cc2ebaca&autoAuth=true&embeddedDemo=true',
    liveUrlLabel: 'Open Power BI Live Embed',
    githubUrl: 'https://github.com/sabledattatray/dattasable',
    caseStudy: {
      problemContext:
        'Month-end financial close in many mid-market organizations is slowed down by dozens of decentralized Excel sheets. Financial analysts manually re-key numbers, re-apply broken VLOOKUPs, and struggle with reconciliation mismatches between subsidiary ledgers and parent accounts.',
      datasetInfo: {
        source: 'Synthetic general ledger ledger transactions generated according to standard double-entry accounting rules.',
        rows: '180,000 journal entry line items covering 36 consecutive calendar months across 12 operational cost centers.',
        grain: 'One record per accounting journal line item (Account, Entity, Cost Center, Amount, Period).',
        provenance: '100% synthetic general ledger and chart of accounts created for financial reporting demonstration. No proprietary business records used.',
        limitations: 'Does not model multi-currency translation revaluation reserve impacts.',
      },
      toolsAndRoles: [
        { tool: 'Advanced Excel', role: 'Power Query consolidation, structured tables, automated reconciliation exception log.' },
        { tool: 'Power BI', role: 'Executive board presentation, interactive financial statements, MTD/LMTD variance drivers.' },
        { tool: 'DAX', role: 'Complex time intelligence: MTD, LMTD, YoY Growth %, Budget Variance, and Dynamic Statement formatting.' },
        { tool: 'SQL Server', role: 'Chart of accounts hierarchy staging and double-entry net-zero validation.' },
      ],
      methodology: [
        'Standardized chart of accounts into a unified reporting taxonomy (Revenue, COGS, Gross Margin, OPEX, EBITDA, Net Income).',
        'Built an automated Power Query pipeline that merges trial balances from disparate operating entities without manual intervention.',
        'Created measure branching DAX routines for Net Revenue, Cost of Sales, and Operating Expenses with custom subtotal formatting.',
        'Implemented automated sanity checks: trial balance net debits minus credits must equal 0.00 across all closed periods.',
        'Documented refresh protocols and parameter settings for finance team handover.',
      ],
      kpiDefinitions: [
        { name: 'EBITDA Margin %', formula: 'DIVIDE([EBITDA], [Net Revenue], 0)', description: 'Operating profitability prior to non-cash depreciation and amortization.' },
        { name: 'MTD vs LMTD Variance', formula: '[Revenue MTD] - CALCULATE([Revenue MTD], DATEADD(DimDate[Date], -1, MONTH))', description: 'Month-over-month pace comparison at the exact same calendar point.' },
        { name: 'Budget Realization %', formula: 'DIVIDE([Actual Expenses], [Budgeted Expenses], 0)', description: 'Adherence to departmental financial expenditure limits.' },
      ],
      keyFindings: [
        'Standardizing data ingestion through Power Query eliminated 14 repetitive copy-paste workflows and reduced reconciliation friction.',
        'Variance analysis surfaced an 8.4% cost over-run in cloud infrastructure cost centers that had been obscured by aggregated OPEX grouping.',
        'Automated exception logging caught 100% of unmapped account codes before statements reached executive review.',
      ],
      validationChecks: [
        'Balance sheet equation test: Assets = Liabilities + Equity passes with zero variance across all reported periods.',
        'Debit / Credit sum check: Total debits strictly match total credits in every monthly trial balance.',
        'Hierarchy reconciliation: Sub-account rollups match parent financial statement line items perfectly.',
      ],
      limitationsAndNextSteps:
        'This showcase models standardized statutory P&L and cost center structures. Next planned evolution includes rolling 13-week cash flow forecasting and working capital scenario modeling.',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROJECT REPOSITORY / DIRECTORY (Cleaned, Truthful, Defensible Secondary Work)
// ─────────────────────────────────────────────────────────────────────────────

const establishedProjects: ProjectData[] = [
  {
    id: 19,
    title: 'Hyperlocal Fleet Operations & Rider MIS Dashboard',
    category: 'Excel & MIS',
    image: '/images/dashboards/fleet_logistics.webp',
    color: '#00d4ff',
    tools: ['Advanced Excel', 'XLOOKUP', 'SUMPRODUCT', 'Next.js', 'Operations MIS'],
    client: 'Hyperlocal Logistics Hub',
    desc: 'An automated fleet operations dashboard modeling order density, tiered shift bonuses, attendance compliance, and net payout reconciliation across 4 regional delivery hubs.',
    problem: 'Fleet managers struggle with disparate daily shift logs, leading to delayed weekly driver disbursements, unverified bonus qualifications, and high attendance slippage.',
    solution: 'Constructed an automated 4-sheet MIS architecture with dynamic Excel formulas (XLOOKUP, SUMPRODUCT, COUNTIFS) paired with an interactive real-time web cockpit.',
    impact: 'Complete operational template tracking 12 fleet riders across 5 operating weeks with zero calculation discrepancies.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/rider-ops',
    statusBadge: 'Interactive Web + Excel (.xlsx)',
  },
  {
    id: 11,
    title: 'World Business Intelligence (3M Records)',
    category: 'SQL & Data',
    image: '/images/dashboards/world_business_intelligence.webp',
    color: '#00F0FF',
    tools: ['DuckDB', 'Python', 'Chart.js', 'Next.js', 'SQL OLAP'],
    client: 'High-Volume Ledger Demonstration',
    desc: 'An analytical architecture benchmark testing sub-second columnar aggregation on a 3,000,000-row global transaction dataset.',
    problem: 'Visualizing multi-gigabyte transaction ledgers directly in standard web browsers causes severe memory exhaustion and unworkable query latency.',
    solution: 'Designed a high-throughput DuckDB columnar pipeline that aggregates 3M rows in sub-second queries, paired with a vector-rendered analytical cockpit.',
    impact: 'Architectural proof of concept: 3M simulated rows aggregated with sub-100ms UI response time.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/world-business',
    statusBadge: 'Interactive Demo (DuckDB)',
  },
  {
    id: 10,
    title: 'Surgical AI-BI Forge',
    category: 'Automation',
    image: '/images/portfolio/surgical_forge.webp',
    color: 'var(--accent)',
    tools: ['Python', 'DuckDB', 'Next.js', 'Analytical Rules'],
    client: 'Data Quality & Validation Lab',
    desc: 'An automated analytical engine capable of profiling large CSV datasets in real-time using in-memory OLAP routines.',
    problem: 'Business analysts spend excessive hours manually profiling data quality, checking null rates, and identifying schema mismatches.',
    solution: 'Engineered a Python and DuckDB processing bridge that automatically audits incoming tabular records and outputs summary diagnostics.',
    impact: 'Automated data profiling pipeline capable of evaluating 1M+ rows at over 200,000 records/sec throughput.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/surgical-ai',
    statusBadge: 'Analytical Utility',
  },
  {
    id: 9,
    title: 'Flagship Enterprise BI Engine (MTD/LMTD)',
    category: 'Power BI',
    image: '/images/dashboards/financial_pnl.webp',
    color: 'var(--accent)',
    tools: ['Power BI', 'Advanced DAX', 'Time Intelligence', 'Data Modeling'],
    client: 'Enterprise Reporting Showcase',
    desc: 'A comprehensive 3-page executive reporting framework featuring complex time-intelligence DAX (Month-to-Date vs Last-Month-to-Date).',
    problem: 'Leadership required side-by-side comparative views of current pace against historical periods with instant cross-dimensional slicing.',
    solution: 'Engineered an enterprise Power BI model with measure branching DAX to deliver instant period-over-period clarity for decision-makers.',
    impact: 'Demonstrates robust time-intelligence DAX modeling and clean executive UI hierarchy in live Power BI Service.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://app.powerbi.com/reportEmbed?reportId=31b010f4-3f62-4cbe-8524-9238cc2ebaca&autoAuth=true&embeddedDemo=true',
    statusBadge: 'Live Power BI Embed',
  },
  {
    id: 7,
    title: 'Telecom Collection Intelligence',
    category: 'Power BI',
    image: '/images/dashboards/telecom_collection_delinquency.webp',
    color: 'var(--accent)',
    tools: ['Power BI', 'SQL Server', 'Aging Buckets', 'Risk Analysis'],
    client: 'BFSI / Delinquency Model',
    desc: 'Real-time collection summary engine for credit and postpaid portfolios, tracking bucket aging, roll-rates, and collector efficiency.',
    problem: 'Fragmented spreadsheets prevented collections management from identifying early-stage account slippage before default.',
    solution: 'Constructed an integrated portfolio aging model with automated DPD categorization and tele-caller queue segmentation.',
    impact: 'Clear visualization of cohort roll rates and recovery probabilities across 6 simulated billing cycles.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/collection-intelligence',
    statusBadge: 'Interactive Web Dashboard',
  },
  {
    id: 1,
    title: 'Sales Pipeline Velocity & Funnel Analysis',
    category: 'Power BI',
    image: '/images/dashboards/sales_pipeline_preview.webp',
    color: 'var(--accent)',
    tools: ['Power BI', 'DAX', 'SQL', 'CRM Modeling'],
    client: 'Commercial Operations Study',
    desc: 'End-to-end sales performance tracking system identifying deal velocity bottlenecks, stage leakage, and risk-weighted forecasts.',
    problem: 'Disjointed CRM pipeline metrics made quarterly revenue forecasting speculative and prevented proactive deal coaching.',
    solution: 'Developed a structured sales velocity dashboard featuring stage duration analysis and rep quota pacing metrics.',
    impact: 'Reproducible sales velocity framework modeling 1,850 enterprise deals across 4 fiscal quarters.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/sales-pipeline',
    statusBadge: 'Live Interactive Dashboard',
  },
  {
    id: 8,
    title: 'Quick-Commerce Revenue Engine (Beta)',
    category: 'Excel & MIS',
    image: '/images/dashboards/ecommerce_journey.webp',
    color: '#F9D100',
    tools: ['Power BI', 'Power Query', 'Retail Analytics', 'Pricing Logic'],
    client: 'Blinkit Retail Case Study',
    desc: 'An exploratory study into quick-commerce unit economics, analyzing average order value and sales velocity across dynamic grocery SKUs.',
    problem: 'Quick-commerce margins require precise visibility into delivery density, basket composition, and category turnover.',
    solution: 'Constructed a prototype revenue model mapping SKU-level contribution margins and delivery radius performance.',
    impact: 'Beta architectural model establishing retail KPI taxonomy and category performance hierarchies.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/blinkit-sales',
    statusBadge: 'Prototype / Study',
  },
  {
    id: 0,
    title: 'Production Performance Benchmarking Engine',
    category: 'Power BI',
    image: '/images/dashboards/dashboard_1.webp',
    color: 'var(--accent)',
    tools: ['Power BI', 'SQL', 'DAX', 'Performance Tuning'],
    client: 'Operational Benchmarking Lab',
    desc: 'A high-throughput Power BI architecture demonstrating optimized DAX measures and Star Schema relationships.',
    problem: 'Complex DAX calculations and inefficient relationships caused slow dashboard render times and sluggish filter responsiveness.',
    solution: 'Optimized calculation trees using measure branching and aggregated staging tables to achieve instantaneous visual updates.',
    impact: 'Technical proof of optimal data modeling practices for enterprise Power BI deployment.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://app.powerbi.com/view?r=eyJrIjoiOWJlMjkwZTUtMTBiZS00ZDVmLTkxNTItMThhZTY0MTE1N2ViIiwidCI6ImE4MDkzYjljLTFiYWUtNGExNS1hNTRjLTY4NDc5ZDFmMjVkZiJ9',
    statusBadge: 'Live Power BI Embed',
  },
  {
    id: 4,
    title: 'Financial Close & Expense Audit Automation',
    category: 'Excel & MIS',
    image: '/images/portfolio/finance.webp',
    color: 'var(--accent)',
    tools: ['Excel', 'Power Query', 'SQL', 'Variance Modeling'],
    client: 'Corporate Finance Exercise',
    desc: 'Automated general ledger reconciliation model eliminating manual data collation during month-end financial reviews.',
    problem: 'Manual consolidation across cost center spreadsheets introduced reconciliation discrepancies and delayed closing packages.',
    solution: 'Engineered an automated Power Query ingestion pipeline with automated debit/credit balancing and exception flags.',
    impact: 'Standardized monthly close framework with automated trial balance reconciliation checks.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://public.tableau.com/views/EmployeeExpenseAnalysis/EmployeeExpenseAnalysis?:embed=y&:showVizHome=no',
    statusBadge: 'Tableau Case Study',
  },
  {
    id: 2,
    title: 'Supply Chain & Fulfillment Logistics',
    category: 'Analysis',
    image: '/images/portfolio/supply_chain.webp',
    color: 'var(--accent2)',
    tools: ['Power BI', 'SQL', 'DAX', 'Inventory Modeling'],
    client: 'Manufacturing & Distribution Study',
    desc: 'Visibility framework tracking inventory turnover, supplier lead times, and fulfillment delay distribution across distribution hubs.',
    problem: 'Lack of unified visibility into warehouse safety stock levels created frequent inventory stockouts during peak demand cycles.',
    solution: 'Modeled reorder thresholds and safety stock metrics in SQL, visualized via an operational KPI dashboard.',
    impact: 'Interactive inventory tracking model demonstrating automated reorder point alerting logic.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://public.tableau.com/views/SupplychainDashboard/1KPIDashboard?:embed=y&:showVizHome=no',
    statusBadge: 'Tableau Case Study',
  },
  {
    id: 3,
    title: 'Workforce Attrition Risk Analytics',
    category: 'Analysis',
    image: '/images/portfolio/hr.webp',
    color: 'var(--accent3)',
    tools: ['Excel', 'Tableau', 'SQL', 'Cohort Analysis'],
    client: 'HR Operational Case Study',
    desc: 'Structured HR reporting model identifying attrition patterns, departmental retention rates, and tenure distribution.',
    problem: 'HR leadership lacked analytical insight into which departments and tenure brackets suffered highest voluntary turnover.',
    solution: 'Built a cohort retention reporting suite analyzing historical employee departures across job roles and compensation tiers.',
    impact: 'Transparent HR analytics pack showing retention curve modeling and tenure-based risk segmentation.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://public.tableau.com/views/WorkforceAnalytics-Attrition/AttritionDashboard?:embed=y&:showVizHome=no',
    statusBadge: 'Tableau Case Study',
  },
  {
    id: 6,
    title: 'Global Market Expansion & Pricing Intelligence',
    category: 'Analysis',
    image: '/images/dashboards/global_sales_intelligence.webp',
    color: 'var(--accent3)',
    tools: ['Python', 'SQL', 'Next.js', 'Benchmarking'],
    client: 'Market Research Exercise',
    desc: 'Competitive price-benchmarking framework analyzing multi-regional product catalogs and pricing strategies.',
    problem: 'Comparing price elasticity across distributed e-commerce markets required automated data aggregation and currency adjustment.',
    solution: 'Developed an automated data ingestion pipeline feeding a multi-dimensional pricing comparison dashboard.',
    impact: 'Scalable pricing intelligence cockpit with regional currency normalization and index comparisons.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/global-sales-intelligence',
    statusBadge: 'Interactive Web Dashboard',
  },
  {
    id: 13,
    title: 'Warehouse Operations & Logistics Tracker',
    category: 'Automation',
    image: '/images/portfolio/iot.webp',
    color: 'var(--accent)',
    tools: ['SQL', 'Tableau', 'Power Query', 'Logistics Metrics'],
    client: 'Logistics Operations Simulation',
    desc: 'Operational dashboard tracking warehouse dispatch throughput, picker turnaround, and storage threshold compliance.',
    problem: 'Distribution centers experienced delayed outbound dispatches due to lack of real-time visibility into packing queue bottlenecks.',
    solution: 'Designed an operational tracking board with SLA status indicators and hourly throughput histograms.',
    impact: 'Simulated logistics monitoring layout demonstrating threshold exception alerts and throughput tracking.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://public.tableau.com/views/LogisticsDashboard_16820931460080/Overview?:embed=y&:showVizHome=no',
    statusBadge: 'Tableau Case Study',
  },
  {
    id: 14,
    title: 'Retail Demand Forecast & Stockout Model',
    category: 'Analysis',
    image: '/images/portfolio/retail.webp',
    color: 'var(--accent2)',
    tools: ['Power BI', 'SQL', 'Time Series Analysis', 'Excel'],
    client: 'Retail Inventory Simulation',
    desc: 'Seasonal demand forecasting model predicting stock replenishment cycles across retail stores.',
    problem: 'Mismatched order quantities led to excess holding costs on slow-moving SKUs alongside stockouts on fast-movers.',
    solution: 'Engineered a historical sales velocity model in SQL with seasonal index adjustments displayed in Power BI.',
    impact: 'Illustrative retail demand model demonstrating safety-stock formulas and seasonal run-rate calculations.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/blinkit-sales',
    statusBadge: 'Interactive Demo',
  },
  {
    id: 15,
    title: 'Contract Text Classification & Metadata Parser',
    category: 'Automation',
    image: '/images/portfolio/legal.webp',
    color: 'var(--accent3)',
    tools: ['Python', 'Text Extraction', 'Excel Structured Output'],
    client: 'Document Automation Prototype',
    desc: 'An automated parsing script that extracts key legal contract clauses into structured tabular records.',
    problem: 'Operations teams spent excessive hours manually reading through contracts to record expiry dates, indemnity limits, and renewal terms.',
    solution: 'Built a Python extraction pipeline that parses unstructured document text and formats fields into clean Excel tables.',
    impact: 'Automated clause extraction prototype outputting standardized schema for management review.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/surgical-ai',
    statusBadge: 'Python Automation',
  },
  {
    id: 16,
    title: 'Hospital Operational Flow & Bed Occupancy',
    category: 'Analysis',
    image: '/images/portfolio/healthcare.webp',
    color: 'var(--accent)',
    tools: ['Tableau', 'SQL', 'Healthcare Operations'],
    client: 'Healthcare Operations Case Study',
    desc: 'Departmental patient flow and bed occupancy dashboard for clinical operations planning.',
    problem: 'Emergency departments faced admission delays due to lack of ward bed availability tracking.',
    solution: 'Built an operational tracking layout mapping patient transit stages, ward occupancy rates, and average length of stay.',
    impact: 'Demonstrates capacity utilization modeling using anonymized public healthcare operational metrics.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/interactive',
    statusBadge: 'Interactive Demo',
  },
  {
    id: 17,
    title: 'SaaS Cohort Retention & Churn Analytics',
    category: 'Analysis',
    image: '/images/portfolio/saas.webp',
    color: 'var(--accent2)',
    tools: ['SQL', 'Looker Studio', 'Cohort Analysis'],
    client: 'SaaS Economics Simulation',
    desc: 'Subscription cohort analysis tracking monthly user retention, expansion ARR, and churn triggers.',
    problem: 'Subscription businesses struggle to isolate whether customer churn is caused by onboarding friction or later renewal fatigue.',
    solution: 'Constructed an SQL-driven cohort triangular matrix tracking retention retention curves month-by-month.',
    impact: 'Standardized SaaS retention analysis modeling Net Revenue Retention (NRR) across plan tiers.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://lookerstudio.google.com/embed/reporting/1rBC8woDruwE-f_gsheY7kwlx0BPtgzEn/page/c2P1',
    statusBadge: 'Looker Studio Embed',
  },
  {
    id: 5,
    title: 'Omnichannel Marketing Attribution & Funnel ROI',
    category: 'Analysis',
    image: '/images/portfolio/marketing.webp',
    color: 'var(--accent2)',
    tools: ['Tableau', 'SQL', 'Marketing Funnel'],
    client: 'Digital Acquisition Study',
    desc: 'Cross-channel attribution analysis mapping customer acquisition costs against lifetime customer value.',
    problem: 'Marketing budgets were allocated based on last-touch attribution, inflating apparent social ROAS while ignoring search assists.',
    solution: 'Developed a unified acquisition dashboard modeling first-touch, last-touch, and position-based attribution comparisons.',
    impact: 'Attribution comparison framework showcasing channel blended CAC and payback period modeling.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: 'https://public.tableau.com/views/SalesFunnelDashboard_16570254084520/SalesPipelineDashboard?:embed=y&:showVizHome=no',
    statusBadge: 'Tableau Case Study',
  },
  {
    id: 18,
    title: 'Energy Grid Load & Peak Consumption Forecasting',
    category: 'Analysis',
    image: '/images/portfolio/energy.webp',
    color: 'var(--accent3)',
    tools: ['Python', 'Power BI', 'Time Series'],
    client: 'Utility Load Benchmark',
    desc: 'Predictive time-series model forecasting hourly electricity grid demand and peak load variances.',
    problem: 'Municipal utilities risk costly spot-market energy procurement when localized temperature spikes exceed forecasts.',
    solution: 'Formulated a regression forecasting pipeline mapping historical temperature indices to peak megawatt demand.',
    impact: 'Simulated load forecasting model illustrating seasonal variance and peak hourly capacity thresholds.',
    github: 'https://github.com/sabledattatray/dattasable',
    live: '/dashboards/interactive',
    statusBadge: 'Interactive Demo',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE SERVICES & DELIVERABLES (PRD Part 3.6)
// ─────────────────────────────────────────────────────────────────────────────

export const services: ServiceItem[] = [
  {
    id: 'power-bi-dashboards',
    title: 'Power BI Executive Dashboards & DAX Modeling',
    tagline: 'Transform raw enterprise tables into high-contrast, decision-ready executive cockpits.',
    deliverables: [
      'Star Schema dimensional data modeling (Fact / Dim separation)',
      'Complex DAX measures (Time intelligence, MTD/LMTD, measure branching)',
      'High-contrast executive layout designed for 10-second clarity',
      'Row-Level Security (RLS) and Power BI Service deployment setup',
    ],
    typicalInputs: ['SQL views or transactional tables', 'Defined business KPIs & calculation rules', 'User role hierarchy'],
    outcomes: 'C-suite and operational leaders get instant, sub-second visibility into actual performance without waiting for manual batch reports.',
  },
  {
    id: 'excel-mis-automation',
    title: 'Advanced Excel MIS Reporting Packs',
    tagline: 'Replace fragile manual copy-paste sheets with automated, parameterized Power Query workbooks.',
    deliverables: [
      'Automated Power Query ingestion pipelines (multi-file folder merges)',
      'Structured Excel Data Models with PivotTable summaries',
      'Automated reconciliation checklists and exception logging sheets',
      'One-click refresh documentation and user SOP manuals',
    ],
    typicalInputs: ['Exported ERP / CRM / SAP dumps', 'Current manual spreadsheet reports', 'Reconciliation criteria'],
    outcomes: 'Eliminates repetitive manual collation, removes broken formula errors, and delivers standardized management packs reliably.',
  },
  {
    id: 'sql-data-quality',
    title: 'SQL Data Extraction & Quality Validation',
    tagline: 'Audit source data integrity, reconcile ledger imbalances, and profile dirty databases.',
    deliverables: [
      'Comprehensive SQL profiling queries (nulls, duplicates, cardinality)',
      'Source-to-target reconciliation test suites',
      'Optimized reporting views, CTEs, and window functions',
      'Data dictionary and documentation of transformation logic',
    ],
    typicalInputs: ['Database access (SQL Server / PostgreSQL / MySQL)', 'Source schemas and table catalogs', 'Integrity expectations'],
    outcomes: 'Guarantees downstream reports are built on clean, validated numbers with zero unmapped records or silent discrepancies.',
  },
  {
    id: 'delinquency-portfolio-risk',
    title: 'Portfolio Risk & Delinquency Aging Frameworks',
    tagline: 'Actionable aging buckets, roll-rate migration, and recovery performance analytics for BFSI & credit.',
    deliverables: [
      'Bucket-wise aging models (Risk 30 / 60 / 90+ DPD / Write-offs)',
      'Roll-rate transition matrices period-over-period',
      'Tele-caller / agency allocation & promise-to-pay tracking',
      'Executive summary cards on portfolio slippage and provision risk',
    ],
    typicalInputs: ['Billing cycle snapshots', 'Customer loan / postpaid ledger records', 'Collection disposition logs'],
    outcomes: 'Collections leaders can pinpoint cohort decay early, optimize field collector allocation, and protect portfolio cash flow.',
  },
  {
    id: 'financial-close-tracking',
    title: 'Financial Close & Variance Tracking (P&L / Budget)',
    tagline: 'Automate trial balance rollups, cost-center budget variance, and monthly board presentations.',
    deliverables: [
      'Standardized Chart of Accounts mapping tables',
      'Automated trial balance debit/credit balance checks',
      'Actual vs. Budget vs. Prior Year variance drivers',
      'Board-ready financial statement presentation views',
    ],
    typicalInputs: ['General ledger line item exports', 'Departmental budget allocations', 'Historical trial balances'],
    outcomes: 'Compresses month-end financial reporting cycles, eliminates accounting reconciliation errors, and clarifies margin drivers.',
  },
  {
    id: 'report-troubleshooting',
    title: 'Legacy Report Optimization & Troubleshooting',
    tagline: 'Revamp sluggish Power BI files, untangle nested formulas, and repair broken reporting pipelines.',
    deliverables: [
      'DAX query performance audit via DAX Studio / Performance Analyzer',
      'Model optimization: removing high-cardinality columns, star-schema alignment',
      'Refactoring volatile formulas (VLOOKUP / nested IFs to dynamic arrays / Power Query)',
      'System stability report with before/after memory & render benchmarks',
    ],
    typicalInputs: ['Existing .pbix files or .xlsx workbooks', 'Underlying data source schemas', 'Specific error/latency descriptions'],
    outcomes: 'Restores speed, accuracy, and reliability to mission-critical business reports that had become too slow or unstable to trust.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. "HOW I APPROACH PROJECTS" / ENGINEERING PROCESS (Replaces Fake Testimonials)
// ─────────────────────────────────────────────────────────────────────────────

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Business Decision Discovery',
    focus: 'Identify the Decision, Not Just the Chart',
    description:
      'Every dashboard begins with the business question: Who is looking at this report? What specific operational decision must they make within 10 seconds? What are the SLA intervals and data refresh needs?',
    deliverable: 'Agreed Metric Definition Matrix & Mockup Wireframe',
  },
  {
    step: '02',
    title: 'Data Audit & Schema Profiling',
    focus: 'Inspect the Raw Grain & Verify Integrity',
    description:
      'Before writing a single DAX measure, I audit the raw sources in SQL. I check primary keys, profile missing values, identify orphaned records, verify data grain, and test debit/credit or sum reconciliation.',
    deliverable: 'Data Quality Audit & Exception Summary',
  },
  {
    step: '03',
    title: 'Power Query ETL & Star Schema Modeling',
    focus: 'Clean, Normalize & Structure for Speed',
    description:
      'I structure data into an auditable Star Schema with dedicated Fact and Dimension tables. Ingestion transformations are pushed upstream via Power Query or SQL views to ensure the reporting model remains lightweight.',
    deliverable: 'Normalized Dimensional Data Model & Measure Tables',
  },
  {
    step: '04',
    title: 'Executive UX & Drill-Through Architecture',
    focus: '10-Second High-Contrast Clarity',
    description:
      'Visuals are designed using restrained, high-contrast aesthetics. Top-level KPI cards show current status with variance indicators; intuitive drill-through paths let users navigate down to transaction-level exceptions.',
    deliverable: 'Interactive, Tested Power BI / Excel Dashboard Pack',
  },
  {
    step: '05',
    title: 'Reconciliation, Validation & Handover',
    focus: 'Zero-Discrepancy Proof & Documentation',
    description:
      'Final report totals are cross-checked against source accounting ledgers to prove 100% mathematical accuracy. I provide clear refresh instructions, DAX measure documentation, and user SOPs.',
    deliverable: 'Reconciliation Sign-Off & Refresh SOP Manual',
  },
];

// Evidence reviewed on 29 October 2026. Repository-reported results are not new local test runs.
const repo = (name: string) => `https://github.com/sabledattatray/${name}`;
const media = (name: string, alt: string, classification: ProjectMedia['classification'], source: string): ProjectMedia => ({ src: `/images/portfolio/${name}.webp`, alt, classification, source });
const fabricRepo = repo('fabric-master');
const n8nRepo = repo('enterprise-n8n-intelligence-automation');
const globalRepo = repo('enterprise-global-business-analytics-3m');
const powerbiRepo = repo('enterprise-power-bi-dashboard');

export const flagshipProjects: ProjectData[] = [
  {
    id: 101, title: 'Fabric Master — Microsoft Fabric Engineering & FinOps Platform', category: 'Microsoft Fabric',
    categories: ['Microsoft Fabric', 'Web Applications', 'SQL & Data Engineering'],
    image: '/images/portfolio/fabric-home.webp', color: 'var(--accent)', tools: ['React', 'TypeScript', 'Vite', 'Express', 'Microsoft Fabric'], client: 'Independent engineering platform',
    desc: 'An independent engineering workbench for capacity planning, workload analysis, architecture visualization and explainable FinOps decisions.',
    problem: 'Architects need to compare Fabric capacity and cost before committing, while understanding how Spark, Data Factory and Power BI workloads compete for compute.',
    solution: 'A browser workspace connects deterministic workload models, F-SKU comparisons, cost estimates and architecture planning. Scenarios retain visible assumptions rather than presenting estimates as guarantees.',
    impact: 'A publicly accessible planning platform with 11 F-SKU tiers and a documentation library of 25 guides, as displayed by the live platform on the review date.',
    live: 'https://fabric.dattasable.com/', github: fabricRepo, statusBadge: 'Live platform · v4.0',
    flagship: {
      slug: 'fabric-master', order: 1, verifiedAt: '2026-10-29', cta: 'Explore Live Platform',
      evidence: [{ value: '11', label: 'F-SKU planning tiers', source: 'https://fabric.dattasable.com/' }, { value: '25', label: 'Published guides', source: 'https://fabric.dattasable.com/documentation' }, { value: 'v4.0', label: 'Live engineering workspace', source: 'https://fabric.dattasable.com/workspace' }],
      gallery: [media('fabric-home', 'Fabric Master live homepage and capacity preview', 'Real screenshot', 'https://fabric.dattasable.com/'), media('fabric-workspace', 'Fabric Master engineering workspace with saved-scenario tools', 'Real screenshot', 'https://fabric.dattasable.com/workspace'), media('fabric-capacity', 'Fabric Master capacity planning wizard', 'Real screenshot', 'https://fabric.dattasable.com/wizard'), media('fabric-architecture', 'Fabric Master architecture planner', 'Real screenshot', 'https://fabric.dattasable.com/architecture/planner'), media('fabric-cost', 'Fabric Master cost estimation workspace', 'Real screenshot', 'https://fabric.dattasable.com/cost-calculator')],
      architecture: ['React and TypeScript provide the planning interface; Vite builds the application and Express supplies its server entry point.', 'Workload inputs feed deterministic capacity estimates. Cost comparisons and documented pricing assumptions support scenario evaluation.', 'The engineering workspace stores scenarios in the browser and supports JSON import/export. Architecture tools cover Lakehouse, OneLake and medallion planning.'],
      implementation: ['Capacity planning across F2–F2048, including Spark and Power BI workload inputs.', 'Pay-as-you-go and reserved-capacity comparisons with visible planning assumptions.', 'Scenario workspace, architecture planner and an engineering documentation library.'],
      limitations: ['Independent educational planning software; not an official Microsoft product.', 'Estimates require validation with representative workloads and current regional pricing. They are not commercial offers or performance guarantees.', 'The live platform and README differ in recency; the live v4.0 interface supports the displayed counts. The suggested count of eight tools is omitted because the current navigation is broader.'],
      sources: [{ label: 'Source repository and README', url: fabricRepo }, { label: 'Methodology and limitations', url: 'https://fabric.dattasable.com/about' }, { label: 'Engineering workspace', url: 'https://fabric.dattasable.com/workspace' }],
    },
  },
  {
    id: 102, title: 'Excel Dashboard Generator — Executive BI Studio', category: 'Excel & MIS', categories: ['Excel & MIS', 'Web Applications'],
    image: '/images/portfolio/excel-dashboard.webp', color: 'var(--accent2)', tools: ['Excel', 'CSV', 'Browser analytics', 'Workbook export'], client: 'Public analytics application',
    desc: 'A browser-based analytics studio that turns spreadsheet imports into interactive dashboards and structured Excel reporting workbooks.',
    problem: 'Analysts need a repeatable way to explore spreadsheet data, validate records and create reporting workbooks without rebuilding every KPI manually.',
    solution: 'The studio connects CSV/Excel import, template selection, analytical views, source-record inspection and workbook download within a browser workflow.',
    impact: 'The live application exposes 32 BI templates, import controls and Excel export alongside a sample enterprise model.',
    live: 'https://excel.dattasable.com/', github: '', statusBadge: 'Live browser application',
    flagship: {
      slug: 'excel-dashboard-generator', order: 2, verifiedAt: '2026-10-29', cta: 'Launch Dashboard Generator',
      evidence: [{ value: '32', label: 'Templates in live gallery', source: 'https://excel.dattasable.com/' }, { value: 'CSV / XLSX', label: 'Spreadsheet import', source: 'https://excel.dattasable.com/' }, { value: '.xlsx', label: 'Reporting workbook export', source: 'https://excel.dattasable.com/' }],
      gallery: [media('excel-dashboard', 'Excel studio executive dashboard using the built-in synthetic enterprise model', 'Real screenshot', 'https://excel.dattasable.com/'), media('excel-home', 'Excel Dashboard Generator live studio with import and export controls', 'Real screenshot', 'https://excel.dattasable.com/'), media('excel-templates', 'Excel studio template selection gallery', 'Real screenshot', 'https://excel.dattasable.com/')],
      architecture: ['A browser workspace accepts CSV, XLSX and XLS files through the import interface.', 'The active model powers KPI views, grouped analysis, regional trends and record-validation tools.', 'The export interface generates a structured Excel workbook from the selected model.'],
      implementation: ['32 template options displayed by the public studio.', 'Import workspace, source records, interactive analytics and data-verification navigation.', 'Excel workbook download and a built-in synthetic enterprise model.'],
      limitations: ['The interface states that processing occurs in-browser; this review verifies the public workflow, not an independent privacy or security audit.', 'Screenshots use the supplied sample model. No private spreadsheet was uploaded.', 'No public repository was verified, so no source-code CTA is shown.'],
      sources: [{ label: 'Public analytics studio', url: 'https://excel.dattasable.com/' }],
    },
  },
  {
    id: 103, title: 'Enterprise Intelligence Automation Platform — n8n', category: 'AI & Automation', categories: ['AI & Automation', 'SQL & Data Engineering', 'Power BI'],
    image: '/images/portfolio/n8n-architecture.webp', color: 'var(--accent3)', tools: ['n8n', 'FastAPI', 'Python', 'PostgreSQL', 'Docker', 'Power BI integration'], client: 'Local engineering portfolio',
    desc: 'An event-driven data-to-decision pipeline connecting ingestion, quality quarantine, dimensional analytics, BI refresh orchestration and operational recovery.',
    problem: 'Fragile ingestion scripts can replay transactions, hide invalid records and leave reporting failures without a clear recovery path.',
    solution: 'Eight n8n workflows coordinate a FastAPI ingress, PostgreSQL warehouse, validation quarantine, refresh adapters and numerically grounded reporting.',
    impact: 'The repository documents eight implemented workflows, 51 passing tests and a 1,792 rows/second local synthetic-data benchmark.',
    live: '', github: n8nRepo, statusBadge: 'Local production-style project',
    flagship: {
      slug: 'enterprise-n8n-intelligence-automation', order: 3, verifiedAt: '2026-10-29', cta: 'Explore GitHub Repository', release: `${n8nRepo}/releases/tag/v1.0.0`,
      evidence: [{ value: '8', label: 'Implemented n8n workflows', source: `${n8nRepo}/blob/main/docs/WORKFLOW_CATALOG.md` }, { value: '51', label: 'Repository-reported tests passed', source: `${n8nRepo}/blob/main/README.md` }, { value: '1,792 rows/s', label: 'Measured local benchmark', source: `${n8nRepo}/blob/main/docs/PERFORMANCE.md` }],
      gallery: [media('n8n-architecture', 'Data-ingestion architecture derived from actual repository workflow nodes and connections; not an n8n canvas screenshot', 'Architecture diagram', `${n8nRepo}/blob/main/workflows/01-data-ingestion.json`)],
      architecture: ['FastAPI validates ingress and batch fingerprints before orchestration.', 'n8n coordinates ingestion, precedence-based quality rules, transactional ETL, monitoring and recovery; PostgreSQL holds dimensional and operational state.', 'Power BI and AI adapters default to local mock/template modes. Mailpit provides local email inspection without requiring cloud subscriptions.'],
      implementation: ['SHA-256 batch fingerprinting and replay protection.', 'Bad-record quarantine, dimensional upserts and operational monitoring.', 'Bounded retries, dead-letter isolation and recovery validation.', 'Grounded reporting with numerical validation and an adapter-based Power BI refresh workflow.'],
      limitations: ['Local Docker project using deterministic synthetic data. It is not a deployed enterprise cloud service.', 'Default Power BI and AI integrations are mock/template adapters; configured cloud integrations were not verified here.', 'README-linked canvas captures show account setup instead of workflows. They are excluded; the published diagram derives from workflow JSON and is explicitly labeled.', 'The 51 tests and 1,792 rows/s benchmark are repository-reported evidence from a developer workstation, not tests rerun by this website or cloud SLAs.'],
      sources: [{ label: 'README and implementation scope', url: n8nRepo }, { label: 'Performance methodology', url: `${n8nRepo}/blob/main/docs/PERFORMANCE.md` }, { label: 'Workflow catalog', url: `${n8nRepo}/blob/main/docs/WORKFLOW_CATALOG.md` }],
    },
  },
  {
    id: 104, title: 'Enterprise Global Business Analytics — 3M Records', category: 'SQL & Data Engineering', categories: ['SQL & Data Engineering', 'Power BI'],
    image: '/images/portfolio/global-executive.webp', color: 'var(--accent2)', tools: ['SQL Server 2022', 'T-SQL', 'Power BI', 'DAX', 'Kimball star schema'], client: 'Synthetic analytics engineering project',
    desc: 'An audit-first SQL Server and Power BI foundation built around three million synthetic international transactions and explicit data-quality guardrails.',
    problem: 'Synthetic international transactions contain mixed currencies, customer-identity collisions and inconsistent product keys that make naive aggregation misleading.',
    solution: 'A typed SQL staging pipeline, repaired surrogate keys and a Kimball star schema feed currency-gated DAX measures and documented reporting specifications.',
    impact: 'The repository records 12/12 SQL verification tests on three million rows. Native Power BI visual authoring remains incomplete.',
    live: '', github: globalRepo, statusBadge: 'Verified model · visuals in progress',
    flagship: {
      slug: 'enterprise-global-business-analytics-3m', order: 4, verifiedAt: '2026-10-29', cta: 'Review Engineering Project',
      evidence: [{ value: '3M', label: 'Synthetic source records', source: globalRepo }, { value: '50', label: 'Countries in the model', source: globalRepo }, { value: '12 / 12', label: 'Repository-reported SQL checks', source: globalRepo }],
      gallery: [media('global-executive', 'Executive overview design target from the 3M analytics repository; not a completed report screenshot', 'Design mockup', `${globalRepo}/tree/main/assets/screenshots`), media('global-sales', 'Sales performance design target for native Power BI authoring', 'Design mockup', `${globalRepo}/tree/main/assets/screenshots`)],
      architecture: ['An immutable 49-column raw CSV lands in SQL Server. TRY_CONVERT staging views produce a typed clean table.', 'Product, geography and date dimensions use repaired surrogate keys and trusted foreign-key relationships.', 'A 19-column reporting fact view feeds a Power BI import model. Monetary measures require a single-currency filter.'],
      implementation: ['Three-million-row SQL pipeline, typed materialization and dimensional model.', 'Currency aggregation guards across 42 local currencies; unreliable unique-customer metrics excluded.', 'Nine reporting-page specifications; repository reports the Executive Overview canvas laid out, while pages 02–09 remain in authoring.'],
      limitations: ['All source transactions are synthetic. There is no economically meaningful total across the 42 local currencies.', 'The gallery contains design mockups, not proof of nine completed Power BI pages. No authentic model screenshot was available in the reviewed README assets.', 'Distinct from World Business Intelligence in the existing library: that is a DuckDB/web exploration; this project focuses on SQL Server, governance and native Power BI modeling.'],
      sources: [{ label: 'README and implementation matrix', url: globalRepo }, { label: 'SQL and semantic architecture', url: `${globalRepo}/blob/main/docs/ARCHITECTURE.md` }, { label: 'Data-quality limitations', url: `${globalRepo}/blob/main/docs/DATA_QUALITY_AND_LIMITATIONS.md` }],
    },
  },
  {
    id: 105, title: 'Enterprise Power BI Dashboard — Nine-Page Analytics Suite', category: 'Power BI', categories: ['Power BI', 'SQL & Data Engineering'],
    image: '/images/portfolio/powerbi-executive.webp', color: 'var(--accent3)', tools: ['Power BI', 'DAX', 'Power Query', 'Python', 'Excel'], client: 'Synthetic retail analytics blueprint',
    desc: 'A documented analytics blueprint covering executive reporting, sales, products, customers, regions, profitability, returns and forecast scenarios.',
    problem: 'A credible BI portfolio needs reconciled data, consistent metric definitions and reproducible visual specifications rather than unexplained dashboard images.',
    solution: 'A synthetic retail star schema, DAX library, workbook handbook and nine visual build guides form a reproducible report-authoring reference.',
    impact: 'The README reconciles $12.84M illustrative revenue, 178,200 orders and 46,798 synthetic customers. Visuals are design references, not compiled reports.',
    live: '', github: powerbiRepo, statusBadge: 'Nine designs · implementation blueprint',
    flagship: {
      slug: 'enterprise-power-bi-dashboard', order: 5, verifiedAt: '2026-10-29', cta: 'Explore Power BI Project',
      evidence: [{ value: '9', label: 'Dashboard design references', source: powerbiRepo }, { value: '178,200', label: 'Synthetic orders', source: powerbiRepo }, { value: '66', label: 'Source-reviewed DAX measures', source: `${powerbiRepo}/blob/main/docs/dax-validation-matrix.md` }],
      gallery: [media('powerbi-executive', 'Executive overview design reference with synthetic retail figures', 'Design mockup', `${powerbiRepo}/tree/main/assets/dashboards`), media('powerbi-sales', 'Sales performance design reference', 'Design mockup', `${powerbiRepo}/tree/main/assets/dashboards`), media('powerbi-customers', 'Customer insights design reference using synthetic customers', 'Design mockup', `${powerbiRepo}/tree/main/assets/dashboards`), media('powerbi-profitability', 'Profitability design reference', 'Design mockup', `${powerbiRepo}/tree/main/assets/dashboards`), media('powerbi-forecast', 'Forecast scenario design reference, not a statistical confidence interval', 'Design mockup', `${powerbiRepo}/tree/main/assets/dashboards`)],
      architecture: ['Five relational synthetic-data tables describe orders, customers, products, returns and forecasts.', 'Star-schema relationships, Power Query guidance and 66 documented DAX measures define the semantic layer.', 'Nine visual specifications and an Excel implementation handbook guide construction in Power BI Desktop.'],
      implementation: ['Nine dashboard designs and field-level visual build guides.', 'Synthetic data reconciled to $12,840,570 in gross sales, 178,200 orders and 46,798 customer records.', 'DAX source, relationship documentation, validation scripts and a reproducible authoring handbook.'],
      limitations: ['Financial values are synthetic demonstration data, not client revenue.', 'Images are mockups and architectural design references. A compiled PBIX is not included.', 'DAX syntax and schema references are source-reviewed; Power BI Desktop execution remains pending.', 'Forecast ±12% bands are illustrative planning assumptions, not statistical confidence intervals.'],
      sources: [{ label: 'README and metric reconciliation', url: powerbiRepo }, { label: 'Assumptions and limitations', url: `${powerbiRepo}/blob/main/docs/assumptions-limitations.md` }, { label: 'DAX validation matrix', url: `${powerbiRepo}/blob/main/docs/dax-validation-matrix.md` }],
    },
  },
];

export const projects: ProjectData[] = [...flagshipProjects, ...establishedProjects];
export const projectCategories = ['All', 'Featured', 'Microsoft Fabric', 'Power BI', 'Excel & MIS', 'SQL & Data Engineering', 'AI & Automation', 'Web Applications', 'Analysis'] as const;
export function matchesProjectCategory(project: ProjectData, category: string) {
  if (category === 'All') return true;
  if (category === 'Featured') return !!project.flagship;
  if (project.categories?.includes(category)) return true;
  if (category === 'Power BI') return project.category === 'Dashboard' || project.tools.some(tool => tool.includes('Power BI'));
  if (category === 'Excel & MIS') return project.category === 'Report' || project.tools.some(tool => tool.includes('Excel'));
  if (category === 'SQL & Data Engineering' || category === 'SQL & Data') return project.category === 'SQL & Data' || project.tools.some(tool => tool.includes('SQL'));
  if (category === 'AI & Automation' || category === 'Automation') return project.category.toLowerCase().includes('automation');
  if (category === 'Web Applications') return project.tools.some(tool => /Next.js|React|JavaScript/.test(tool));
  return project.category.toLowerCase().includes(category.toLowerCase());
}
