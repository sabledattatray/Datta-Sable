export interface ExcelSheetMetadata {
  name: string;
  description: string;
  type: 'Dashboard' | 'Pivot Matrix' | 'Transaction Ledger' | 'Scorecard' | 'Catalog' | 'Master Accounts';
  highlights: string[];
}

export interface ScreenshotTab {
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

export interface ExcelProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  clientOrOrg: string;
  category: string;
  industry: string;
  badge: string;
  color: string;
  accentColor: string;
  excelFilename: string;
  downloadUrl: string;
  fileSize: string;
  fileSizeBytes: number;
  totalRecordsCount: number;
  sheetsCount: number;
  sheets: ExcelSheetMetadata[];
  techStack: string[];
  executiveSummary: string;
  businessProblem: string;
  keyKPIs: {
    label: string;
    value: string;
    subtext: string;
    trend?: string;
  }[];
  strategicFindings: string[];
  screenshotTabs: ScreenshotTab[];
  dashboardRoute: string;
}

export const EXCEL_PROJECTS: ExcelProject[] = [
  {
    id: 'aura-capital-sales',
    slug: 'aura-capital-sales',
    title: "Aura Capital & FinTech Group \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,036 sample transactions.",
    clientOrOrg: "Aura Capital & FinTech Group",
    category: "FinTech & Commercial BI",
    industry: "FinTech & Capital Markets",
    badge: "Flagship Model \u2022 2026 Audit Edition",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "4.64 MB",
    fileSizeBytes: 4864356,
    totalRecordsCount: 1036,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,036 sample transactions.",
    businessProblem: "Fragmented regional spreadsheets led to inconsistent gross margin visibility, unverified commission payouts, and delayed risk exposure calculations across tier-1 institutional trading clients.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$3.88M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$2.53M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "65.3%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "958", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Reconcile transaction amounts with the ledger total before interpreting margin.","Compare commission calculations with the documented rule and the correct period.","Check that a region selection filters records without changing their grain."],
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
        description: '1,036 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,036 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/aura-capital/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/aura-capital/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/aura-capital/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,036 sample Rows',
        description: 'The foundational transactional ledger containing 1,036 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,036 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/aura-capital/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/aura-capital/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/aura-capital-sales'
  },
  {
    id: 'biosynex-healthcare',
    slug: 'biosynex-healthcare',
    title: "BioSynex Healthcare Technologies \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "BioSynex Healthcare Technologies",
    category: "Healthcare & Life Sciences",
    industry: "Healthcare & Medical Devices",
    badge: "MedTech & Diagnostic Intelligence",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "BioSynex_Healthcare_Technologies_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/BioSynex_Healthcare_Technologies_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.25 MB",
    fileSizeBytes: 1305614,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Hospital networks and sovereign health authorities operated across disjointed diagnostic procurement systems, delaying critical ICU equipment shipments and causing inventory stockouts in high-demand surgical theaters.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$26.01M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$16.46M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "63.3%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Distinguish procurement, shipment and delivery dates before measuring lead time.","Check product and facility keys for duplicates before aggregating amounts.","Use fictional or properly authorized records; avoid exposing patient or buyer information."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/biosynex-healthcare/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/biosynex-healthcare/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/biosynex-healthcare/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/biosynex-healthcare/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/biosynex-healthcare/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/biosynex-healthcare'
  },
  {
    id: 'helios-cleanenergy',
    slug: 'helios-cleanenergy',
    title: "Helios CleanEnergy & Power Grid AG \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    clientOrOrg: "Helios CleanEnergy & Power Grid AG",
    category: "Energy & Utilities",
    industry: "Renewable Energy & Power Grid AG",
    badge: "Renewable Grid & Utility Analytics",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Helios_CleanEnergy___Power_Grid_AG_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Helios_CleanEnergy___Power_Grid_AG_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.48 MB",
    fileSizeBytes: 1553848,
    totalRecordsCount: 2502,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    businessProblem: "Utility operators struggled to balance volatile grid feed-in tariffs, cross-border transmission margins, and commercial microgrid power purchase agreements (PPAs) across decentralized wind and solar assets.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$273.88M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$162.78M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "59.4%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$8.7K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Check that energy quantities use compatible units before comparing assets.","Separate tariff assumptions from observed transaction amounts.","Reconcile source periods before treating a grid or region total as current."],
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
        description: '2,502 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['2,502 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/helios-cleanenergy/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/helios-cleanenergy/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/helios-cleanenergy/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '2,502 sample Rows',
        description: 'The foundational transactional ledger containing 2,502 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '2,502 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/helios-cleanenergy/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/helios-cleanenergy/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/helios-cleanenergy'
  },
  {
    id: 'meridian-global-retail',
    slug: 'meridian-global-retail',
    title: "Meridian Global Retailers Inc. \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "Meridian Global Retailers Inc.",
    category: "Retail & E-Commerce",
    industry: "Omnichannel Retail & FMCG",
    badge: "Omnichannel FMCG Commercial BI",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Meridian_Global_Retailers_Inc__Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Meridian_Global_Retailers_Inc__Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.25 MB",
    fileSizeBytes: 1309617,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Global retail operations faced channel cannibalization between flagship retail store distribution, third-party logistics fulfillment, and direct-to-consumer digital marketplace sales.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$992.6K", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$624.8K", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "62.9%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Deduplicate order lines when combining store and online channels.","Separate returns from discounts when reconciling net sales.","Compare product mix using the same period and currency."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/meridian-global-retail/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/meridian-global-retail/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/meridian-global-retail/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/meridian-global-retail/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/meridian-global-retail/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/meridian-global-retail'
  },
  {
    id: 'nexus-cloud-technologies',
    slug: 'nexus-cloud-technologies',
    title: "Nexus Cloud Technologies Inc. \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "Nexus Cloud Technologies Inc.",
    category: "Enterprise SaaS & Cloud",
    industry: "Enterprise Cloud & SaaS Infrastructure",
    badge: "Cloud Infrastructure & ARR Quota",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Nexus_Cloud_Technologies_Inc__Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Nexus_Cloud_Technologies_Inc__Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.25 MB",
    fileSizeBytes: 1310111,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Cloud infrastructure providers suffered from opaque multi-cloud compute consumption, unverified enterprise SLA credits, and unpredictable annual recurring revenue (ARR) churn across high-tier enterprise clients.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$9.08M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$5.77M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "63.5%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Separate recurring charges from one-time charges before calculating a recurring metric.","Reconcile credits with the billing period they affect.","Check whether usage quantities and invoice amounts represent the same grain."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/nexus-cloud-technologies/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/nexus-cloud-technologies/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/nexus-cloud-technologies/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/nexus-cloud-technologies/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/nexus-cloud-technologies/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/nexus-cloud-technologies'
  },
  {
    id: 'nexus-enterprise-operations',
    slug: 'nexus-enterprise-operations',
    title: "Nexus Enterprise Operations Group \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    clientOrOrg: "Nexus Enterprise Operations Group",
    category: "Operations & Supply Chain",
    industry: "Supply Chain & Operations Group",
    badge: "Global Logistics & Supply Quota",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Nexus_Enterprise_Operations_Group_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Nexus_Enterprise_Operations_Group_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.48 MB",
    fileSizeBytes: 1552885,
    totalRecordsCount: 2502,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    businessProblem: "Global freight operations encountered escalating port demurrage fees, untracked multimodal transit delays, and decentralized fleet route procurement across international trade corridors.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$24.84M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$16.03M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "64.6%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$8.7K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Distinguish a shipment, a shipment leg and an invoice before counting activity.","Check whether delay measures use planned or revised dates.","Reconcile route-level costs without duplicating shared charges."],
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
        description: '2,502 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['2,502 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/nexus-enterprise-operations/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/nexus-enterprise-operations/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/nexus-enterprise-operations/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '2,502 sample Rows',
        description: 'The foundational transactional ledger containing 2,502 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '2,502 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/nexus-enterprise-operations/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/nexus-enterprise-operations/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/nexus-enterprise-operations'
  },
  {
    id: 'omnimedia-marketing-network',
    slug: 'omnimedia-marketing-network',
    title: "OmniMedia Performance Marketing Network \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    clientOrOrg: "OmniMedia Performance Marketing Network",
    category: "Media & AdTech",
    industry: "AdTech & Performance Marketing",
    badge: "Ad Attribution & Programmatic BI",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "OmniMedia_Performance_Marketing_Network_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/OmniMedia_Performance_Marketing_Network_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.48 MB",
    fileSizeBytes: 1552494,
    totalRecordsCount: 2502,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    businessProblem: "Media buying agencies lacked auditable attribution models across programmatic real-time bidding exchanges, connected TV (CTV) inventory, and omnichannel direct sponsor partnerships.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$86.76M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$55.8M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "64.3%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$8.7K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Define an attribution window before comparing channel results.","Separate observed conversions from causal claims about a campaign.","Reconcile media costs and conversion counts to the same reporting period."],
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
        description: '2,502 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['2,502 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/omnimedia-marketing-network/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/omnimedia-marketing-network/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/omnimedia-marketing-network/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '2,502 sample Rows',
        description: 'The foundational transactional ledger containing 2,502 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '2,502 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/omnimedia-marketing-network/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/omnimedia-marketing-network/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/omnimedia-marketing-network'
  },
  {
    id: 'sovereign-resorts-hospitality',
    slug: 'sovereign-resorts-hospitality',
    title: "Sovereign Resorts & Luxury Hospitality \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "Sovereign Resorts & Luxury Hospitality",
    category: "Hospitality & Luxury",
    industry: "Luxury Hospitality & Resorts",
    badge: "Luxury RevPAR & Guest Yield Model",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Sovereign_Resorts___Luxury_Hospitality_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Sovereign_Resorts___Luxury_Hospitality_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.24 MB",
    fileSizeBytes: 1304802,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Ultra-luxury resort properties faced seasonal occupancy swings, inconsistent food & beverage yield management, and fragmented high-net-worth VIP guest spend tracking.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$11.44M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$8.14M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "71.2%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Define available room nights before computing an occupancy ratio.","Separate room revenue from food, beverage and other charges.","Compare equivalent seasonal periods and investigate cancelled bookings."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/sovereign-resorts-hospitality/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/sovereign-resorts-hospitality/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/sovereign-resorts-hospitality/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/sovereign-resorts-hospitality/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/sovereign-resorts-hospitality/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/sovereign-resorts-hospitality'
  },
  {
    id: 'st-andrews-university',
    slug: 'st-andrews-university',
    title: "St. Andrews Collegiate University System \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    clientOrOrg: "St. Andrews Collegiate University System",
    category: "Education & Institutional",
    industry: "Higher Education & Collegiate System",
    badge: "Collegiate Endowment & Academic BI",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "St__Andrews_Collegiate_University_System_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/St__Andrews_Collegiate_University_System_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.48 MB",
    fileSizeBytes: 1553039,
    totalRecordsCount: 2502,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 2,502 sample transactions.",
    businessProblem: "Multi-campus university systems struggled to reconcile decentralized academic faculty budgets, endowed research grants, competitive student tuition tiers, and campus housing overhead.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$146.31M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$100.17M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "68.5%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$8.7K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Separate restricted funding from unrestricted operating balances.","Define whether records represent students, enrollments or invoices.","Reconcile department totals with the approved source period."],
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
        description: '2,502 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['2,502 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/st-andrews-university/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/st-andrews-university/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/st-andrews-university/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '2,502 sample Rows',
        description: 'The foundational transactional ledger containing 2,502 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '2,502 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/st-andrews-university/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/st-andrews-university/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/st-andrews-university'
  },
  {
    id: 'talentpulse-people-systems',
    slug: 'talentpulse-people-systems',
    title: "TalentPulse Global People Systems \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "TalentPulse Global People Systems",
    category: "HRTech & Workforce",
    industry: "HRTech & Workforce Intelligence",
    badge: "Human Capital & Workforce Quota",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "TalentPulse_Global_People_Systems_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/TalentPulse_Global_People_Systems_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.24 MB",
    fileSizeBytes: 1303599,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Global enterprise organizations lacked unified visibility into distributed workforce compensation structures, cross-border contractor taxes, and employee retention health metrics.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$78.4M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$31.67M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "40.4%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Define headcount as of a cutoff rather than counting every historical record.","Distinguish employees from assignments and contractors.","Apply access controls before sharing compensation-related examples."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/talentpulse-people-systems/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/talentpulse-people-systems/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/talentpulse-people-systems/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/talentpulse-people-systems/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/talentpulse-people-systems/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/talentpulse-people-systems'
  },
  {
    id: 'titan-industrial-systems',
    slug: 'titan-industrial-systems',
    title: "Titan Industrial Systems AG \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "Titan Industrial Systems AG",
    category: "Manufacturing & Industry",
    industry: "Heavy Manufacturing & Robotics AG",
    badge: "Heavy Machinery & OEM Quota",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Titan_Industrial_Systems_AG_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Titan_Industrial_Systems_AG_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.25 MB",
    fileSizeBytes: 1305495,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Industrial machinery manufacturers faced extended supply chain lead times, erratic precision component scrap rates, and decentralized OEM service warranty claims.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$50.5M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$30.23M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "59.9%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Distinguish ordered, produced and shipped quantities.","Check units of measure when comparing component scrap.","Reconcile warranty and production costs without double-counting returns."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/titan-industrial-systems/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/titan-industrial-systems/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/titan-industrial-systems/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/titan-industrial-systems/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/titan-industrial-systems/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/titan-industrial-systems'
  },
  {
    id: 'vanguard-realty-capital',
    slug: 'vanguard-realty-capital',
    title: "Vanguard Realty Capital Partners \u2014 Executive Performance & Commercial Sales Dashboard",
    subtitle: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    clientOrOrg: "Vanguard Realty Capital Partners",
    category: "Real Estate & Investment",
    industry: "Commercial Real Estate & REIT Capital",
    badge: "Commercial Real Estate & REIT Yield",
    color: 'var(--accent)',
    accentColor: 'var(--accent)',
    excelFilename: "Vanguard_Realty_Capital_Partners_Executive_Sales_Dashboard_2026.xlsx",
    downloadUrl: "/Projects/Vanguard_Realty_Capital_Partners_Executive_Sales_Dashboard_2026.xlsx",
    fileSize: "1.24 MB",
    fileSizeBytes: 1304196,
    totalRecordsCount: 1002,
    sheetsCount: 6,
    techStack: ['Microsoft Excel 365', 'Dynamic SUMIFS', 'XLOOKUP Engine', 'Pivot Tables & Slicers', 'Automated Quota Scoring'],
    executiveSummary: "Enterprise multi-sheet commercial intelligence model with quota attainment, dynamic cross-tabulations, and 1,002 sample transactions.",
    businessProblem: "Commercial property funds struggled to model complex tenant lease expirations, triple-net (NNN) operating cost pass-throughs, and portfolio-wide capital capitalization rate (Cap Rate) sensitivities.",
    keyKPIs: [{"label": "GROSS REVENUE", "value": "$102.12M", "subtext": "\u25cf sample Actuals"}, {"label": "GROSS PROFIT", "value": "$62.33M", "subtext": "\u25cf Net Operating Spread"}, {"label": "BLENDED MARGIN", "value": "61.0%", "subtext": "\u25cf Target Attained"}, {"label": "UNITS SHIPPED", "value": "$3.6K", "subtext": "\u25cf Product Volume"}],
    strategicFindings: ["Separate occupied area from leased area before using an occupancy measure.","Keep lease expiry assumptions and reporting dates visible.","Distinguish scenario yields from realized investment returns."],
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
        description: '1,002 sample entries detailing products, reps, client tiers, margins, and dates.',
        type: 'Transaction Ledger',
        highlights: ['1,002 sample Rows', 'Unit Economics & COGS', 'Sales Channel Attribution', 'City & Country Coordinates']
      },
      {
        name: 'Regional Performance',
        description: 'Director quota scorecard tracking target vs actuals, variance, attainment percentage, and YoY growth.',
        type: 'Scorecard',
        highlights: ['Managing Director Tracking', 'Quota Variance Analysis', 'Attainment % Progress', 'Regional Deal Sizes']
      },
      {
        name: 'Product Catalog',
        description: 'Enterprise catalog specifying commercial pricing, unit COGS, lead time parameters, and target profit margins.',
        type: 'Catalog',
        highlights: ['Core Solution Catalog', 'List vs Cost Economics', 'Lead Time Parameters', 'Demand Classification']
      },
      {
        name: 'Customer Accounts',
        description: 'Strategic tier institutional clients, lifetime revenues, renewal schedules, and account health indicators.',
        type: 'Master Accounts',
        highlights: ['Sovereign & Tier-1 Clients', 'Lifetime Revenue & Profit', 'Health Status Index', 'Contract Renewal Quarters']
      }
    ],
    screenshotTabs: [
      {
        id: 'exec-full',
        name: '1. Executive Dashboard',
        sheetLabel: 'Sheet 1: Executive Dashboard (Full View)',
        imageSrc: '/images/projects/vanguard-realty-capital/executive_dashboard_full.png',
        width: 1383,
        height: 1658,
        badge: 'Main C-Suite Cockpit',
        description: 'The complete executive cockpit in Microsoft Excel. Features dynamic dropdown slicers (C4: Region, G4: Channel), core KPI metric scorecards, monthly run-rate table with in-cell sparklines, regional quota scorecards, and top enterprise client summaries.',
        keyHighlights: [
          'Interactive Slicer Dropdowns (C4: Region, G4: Channel)',
          'Core KPI Performance Scorecards',
          '12-Month Financial Run-Rate with In-Cell Sparklines',
          'Regional Quota Attainment & Managing Director Tracking',
          'Top Strategic Accounts & Sales Channel Mix Matrix'
        ]
      },
      {
        id: 'pivot-matrix',
        name: '2. Pivot Table Analysis',
        sheetLabel: 'Sheet 2: Pivot Table Analysis',
        imageSrc: '/images/projects/vanguard-realty-capital/pivot_table_analysis_sheet.png',
        width: 1558,
        height: 722,
        badge: 'Cross-Tabulation Engine',
        description: 'Multi-dimensional aggregate pivot engine calculating Theater by Sales Channel matrices, product category revenues across international territories, and quarterly pacing.',
        keyHighlights: [
          'Global Theater × Sales Channel Revenue Matrix',
          'Product Category Portfolio by Regional Theater',
          'Fiscal Quarterly Performance (Q1-2024 to Q4-2024)',
          'Automated Calculated Profit and Margin Fields'
        ]
      },
      {
        id: 'transactions-ledger',
        name: '3. Sales Transactions Ledger',
        sheetLabel: 'Sheet 3: Sales Transactions',
        imageSrc: '/images/projects/vanguard-realty-capital/sales_transactions_ledger.png',
        width: 2298,
        height: 646,
        badge: '1,002 sample Rows',
        description: 'The foundational transactional ledger containing 1,002 sample sales records with transaction IDs, contract dates, client organizations, SKUs, sales reps, list prices, COGS, and city coordinates.',
        keyHighlights: [
          '1,002 sample Ledger Records',
          'Standardized Data Taxonomies for Region, Rep, and Channel',
          'Unit Economics, Cost of Goods Sold (COGS), and Margin %',
          'Granular Attribution from Contract Level to Region'
        ]
      },
      {
        id: 'regional-scorecard',
        name: '4. Regional Scorecard',
        sheetLabel: 'Sheet 4: Regional Performance',
        imageSrc: '/images/projects/vanguard-realty-capital/regional_performance_sheet.png',
        width: 1605,
        height: 214,
        badge: 'Director Quotas',
        description: 'Dedicated territory scorecard assessing Managing Director quotas, actual revenue delivery, dollar variance, attainment percentage, and year-over-year commercial growth rates.',
        keyHighlights: [
          'Coverage across North America, EMEA, APAC, and LATAM',
          'Managing Director Quota Accountability',
          'Monetary Variance ($) and Attainment % Tracking',
          'YoY Growth Rate & Average Deal Size by Region'
        ]
      },
      {
        id: 'customer-accounts',
        name: '5. Customer Accounts',
        sheetLabel: 'Sheet 6: Customer Accounts',
        imageSrc: '/images/projects/vanguard-realty-capital/customer_accounts_sheet.png',
        width: 1443,
        height: 220,
        badge: 'Tier-1 Client Health',
        description: 'Master client directory tracking strategic sovereign wealth and enterprise institutional clients, order volume history, lifetime profitability, and upcoming contract renewal quarters.',
        keyHighlights: [
          'Key Institutional Accounts Directory',
          'Lifetime Revenue and Net Profit Attribution',
          'Account Health Classification (Optimal / Stable)',
          'Contract Renewal Pacing Calendar'
        ]
      }
    ],
    dashboardRoute: '/dashboards/vanguard-realty-capital'
  },
];
