export interface ExcelSheetMetadata {
  name: string;
  description: string;
  type: 'Dashboard' | 'Pivot Matrix' | 'Transaction Ledger' | 'Scorecard' | 'Catalog' | 'Master Accounts';
  highlights: string[];
}

export interface ExcelProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  clientOrOrg: string;
  category: 'FinTech & Commercial BI' | 'Operations & Logistics' | 'Retail & E-commerce' | 'Risk & Delinquency';
  badge: string;
  color: string;
  accentColor: string;
  excelFilename: string;
  downloadUrl: string;
  fileSize: string;
  fileSizeBytes: number;
  totalRecordsCount: number;
  totalVolumeFormatted: string;
  sheetsCount: number;
  sheets: ExcelSheetMetadata[];
  techStack: string[];
  executiveSummary: string;
  businessProblem: string;
  solutionArchitecture: string[];
  keyKPIs: {
    label: string;
    value: string;
    subtext: string;
    trend?: string;
  }[];
  strategicFindings: string[];
  excelEngineeringHighlights: {
    feature: string;
    description: string;
    formulaOrMethod: string;
  }[];
  dashboardRoute: string;
}

export const EXCEL_PROJECTS: ExcelProject[] = [
  {
    id: 'aura-capital-sales-2026',
    slug: 'aura-capital-sales',
    title: 'Aura Capital & FinTech Group — Executive Performance & Commercial Sales Intelligence Dashboard',
    subtitle: 'Institutional FinTech sales model with multi-theater quota attainment, dynamic pivot matrix, and 1,037 certified transaction records.',
    clientOrOrg: 'Aura Capital & FinTech Group',
    category: 'FinTech & Commercial BI',
    badge: 'Flagship Excel Model • 2026 Audit Edition',
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: 'Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx',
    downloadUrl: '/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx',
    fileSize: '4.86 MB',
    fileSizeBytes: 4864356,
    totalRecordsCount: 1037,
    totalVolumeFormatted: '$15.95M Gross Volume ($3.88M Certified Actuals)',
    sheetsCount: 6,
    sheets: [
      {
        name: 'Executive Dashboard',
        description: 'C-Suite performance cockpit featuring interactive regional slicers, run-rate summaries, and margin directories.',
        type: 'Dashboard',
        highlights: ['Dynamic Slicers (C4/G4)', 'In-Cell Unicode Sparklines', 'Monthly Financial Run-Rate', 'Channel Mix Matrix']
      },
      {
        name: 'Pivot Table Analysis',
        description: 'Multi-dimensional cross-tabulation engine aggregating theater revenues, channel splits, and quarterly margins.',
        type: 'Pivot Matrix',
        highlights: ['Theater × Channel Matrix', 'Category × Theater Breakdown', 'Fiscal Quarterly Run-Rate (Q1-Q4)']
      },
      {
        name: 'Sales Transactions',
        description: '1,037 certified institutional sales entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,037 Certified Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise FinTech software catalog specifying pricing, COGS, inventory status, and target margins.',
        type: 'Catalog',
        highlights: ['5 Core Solutions', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    techStack: [
      'Microsoft Excel (.xlsx)',
      'Dynamic Array Formulas',
      'XLOOKUP & SUMIFS Engine',
      'Multi-Dimensional Pivot Tables',
      'Calculated Columns & DAX Logic',
      'In-Cell Unicode Visualizations',
      'Next.js 15 & React 19',
      'Tailwind CSS & Glassmorphic UI'
    ],
    executiveSummary:
      'An institutional commercial intelligence model designed for C-level leadership at Aura Capital & FinTech Group. The workbook centralizes global software revenues, director quota attainment across 4 international theaters, and unit economics for enterprise compliance, trading, and wealth management platforms. Backed by 1,037 certified transaction records, it models over $15.95M in gross commercial activity with a blended operating margin of 68.2%.',
    businessProblem:
      'Global sales directors struggled with disparate regional spreadsheets, fragmented quota tracking, and manual calculation errors during fiscal reporting. Executive leadership lacked an auditable, single-pane view connecting high-level regional quota attainment directly down to individual contract margins and client renewal schedules.',
    solutionArchitecture: [
      'Centralized 1,037 row certified transaction ledger with standardized taxonomies for customer tier, region, channel, and product category.',
      'Constructed dynamic SUMIFS and XLOOKUP calculation engines in Excel enabling single-cell parameter dropdowns (Theater and Channel) to recalculate the entire dashboard in real time.',
      'Designed an automated Regional Scorecard evaluating Director quotas, variance spreads, and blended profit margins across North America, EMEA, APAC, and LATAM.',
      'Developed native cross-tabulation pivot tables tracking multi-channel velocity (Direct Enterprise, Partner Ecosystem, Inside Sales, Online Enterprise).',
      'Embedded in-cell Unicode data bars and sparklines that render visual micro-charts directly within cells without requiring third-party plugins.'
    ],
    keyKPIs: [
      { label: 'Gross Volume', value: '$15.95M', subtext: '$3.88M Certified Period Actuals', trend: '+18.4% YoY' },
      { label: 'Operating Profit', value: '$10.87M', subtext: 'Net Operating Spread', trend: '68.2% Blended Margin' },
      { label: 'Quota Attainment', value: '102.3%', subtext: 'Global Theater Average', trend: 'Target Surpassed' },
      { label: 'Audited Records', value: '1,037', subtext: 'Certified Ledger Rows', trend: '100% Reconciled' },
      { label: 'Active Theaters', value: '4 Theaters', subtext: 'NA, EMEA, APAC, LATAM', trend: '15+ Sovereign Nations' },
      { label: 'Avg Enterprise Deal', value: '$15,409', subtext: 'Per Closed Contract', trend: 'Strategic Tier Focus' }
    ],
    strategicFindings: [
      'Risk & Compliance suite (AML Engine & Credit Risk Evaluator) accounts for 45.5% of total gross revenue, proving compliance software is the primary commercial driver.',
      'EMEA and LATAM exceeded quotas significantly (102% and 109.9% attainment), driven by high demand for cross-border PSD2 integration and wealth management platforms.',
      'Direct Enterprise and Partner Ecosystem channels deliver 78% of operating profit with average deal sizes 2.3x larger than inside sales transactions.',
      'The top 4 institutional accounts (London Capital Partners, Tokyo Sovereign Asset, SingaTrade, Zurich Private Bank) maintain 100% retention with $11.7M combined lifetime revenue.'
    ],
    excelEngineeringHighlights: [
      {
        feature: 'Dynamic Slicer Automation',
        description: 'Single-cell data validation dropdowns in C4 and G4 that instantly trigger cascade formula updates across all metric cards.',
        formulaOrMethod: '=SUMIFS(SalesTransactions[Revenue], SalesTransactions[Region], C4, SalesTransactions[Channel], G4)'
      },
      {
        feature: 'Automated Quota Variance Engine',
        description: 'Calculates monetary variance, percentage attainment, and dynamic status indicators comparing actual revenue to annual targets.',
        formulaOrMethod: '=(Actual_Rev - Quota_Target) / Quota_Target with custom number formatting and conditional threshold alerts.'
      },
      {
        feature: 'In-Cell Visual Micro-Bars',
        description: 'Unicode character repetition formulas (REPT) creating lightweight sparklines and progress bars natively inside spreadsheet cells.',
        formulaOrMethod: '=REPT("█", ROUND(Margin_Pct * 20, 0))'
      },
      {
        feature: 'Multi-Key Dimensional Lookups',
        description: 'High-speed retrieval of product costs, catalog pricing, and customer metadata across 1,000+ transaction rows.',
        formulaOrMethod: '=XLOOKUP(Product_SKU, ProductCatalog[SKU], ProductCatalog[ListPrice], 0, 0)'
      }
    ],
    dashboardRoute: '/dashboards/aura-capital-sales'
  }
];

export function getExcelProjectBySlug(slug: string): ExcelProject | undefined {
  return EXCEL_PROJECTS.find(p => p.slug === slug);
}
