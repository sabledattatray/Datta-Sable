export interface ProductCategoryDef {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  iconName: 'Award' | 'FileSpreadsheet' | 'BarChart3' | 'Database' | 'Cpu' | 'Package';
  accentColor: string;
  accentGradient: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryDef[] = [
  {
    id: 'certifications',
    slug: 'certification-study-resources',
    title: 'Certification Study Resources',
    shortDesc: 'Comprehensive, independent self-study roadmaps and technical exam preparation packages.',
    iconName: 'Award',
    accentColor: '#3b82f6',
    accentGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
  },
  {
    id: 'excel-mis',
    slug: 'excel-mis-templates',
    title: 'Excel & MIS Templates',
    shortDesc: 'Automated executive KPI spreadsheets, financial models, and operational MIS trackers.',
    iconName: 'FileSpreadsheet',
    accentColor: '#10b981',
    accentGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
  },
  {
    id: 'powerbi',
    slug: 'power-bi-dashboards',
    title: 'Power BI Dashboards',
    shortDesc: 'Enterprise-grade .pbix templates, DAX calculation libraries, and semantic models.',
    iconName: 'BarChart3',
    accentColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
  },
  {
    id: 'sql-data',
    slug: 'sql-data-projects',
    title: 'SQL & Data Projects',
    shortDesc: 'Production SQL queries, warehouse schemas, window function patterns, and ETL pipelines.',
    iconName: 'Database',
    accentColor: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
  },
  {
    id: 'automation',
    slug: 'automation-tools',
    title: 'Automation Tools',
    shortDesc: 'Python data processing scripts, scheduled bots, and workflow automation chains.',
    iconName: 'Cpu',
    accentColor: '#8b5cf6',
    accentGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
  },
  {
    id: 'bundles',
    slug: 'professional-resource-bundles',
    title: 'Professional Resource Bundles',
    shortDesc: 'Curated end-to-end data analytics toolkits combining guides, templates, and scripts.',
    iconName: 'Package',
    accentColor: '#c9f31d',
    accentGradient: 'linear-gradient(135deg, rgba(201, 243, 29, 0.15) 0%, rgba(181, 218, 26, 0.15) 100%)',
  },
];

export interface ProductDetailSpec {
  format: string;
  files: string;
  version: string;
  lastUpdated: string;
  prerequisites: string;
  deliveryMethod: string;
  license: string;
  supportTerms: string;
}

export interface ProductFAQItem {
  question: string;
  answer: string;
}

/**
 * Standard structured metadata and FAQ repository for key flagship packages.
 */
export const PRODUCT_EXTRAS: Record<string, {
  specs: ProductDetailSpec;
  faqs: ProductFAQItem[];
  technologies: string[];
  level: string;
  outcomes: string[];
  whoIsFor: string[];
  disclaimer: string;
}> = {
  'dp-700-study-package': {
    technologies: ['Microsoft Fabric', 'PySpark', 'Delta Lake', 'OneLake', 'Data Factory', 'Dataflows Gen2', 'KQL'],
    level: 'Associate to Advanced',
    disclaimer: 'This is an independently developed study resource and is not affiliated with, sponsored by, or endorsed by Microsoft. Microsoft Fabric and related trademarks belong to their respective owners. Examination vouchers or test fees are not included.',
    whoIsFor: [
      'Data Engineers, BI Developers, and Analytics Engineers preparing for Microsoft DP-700 certification.',
      'Professionals transitioning from Azure Synapse, Databricks, or Snowflake to Microsoft Fabric architecture.',
      'Data practitioners seeking structured, scenario-driven Fabric implementation practice beyond basic theory.'
    ],
    outcomes: [
      'Master OneLake shortcut architecture, Lakehouse table maintenance, and Delta Lake compaction patterns.',
      'Design reliable Data Factory pipelines with incremental ingestion and error handling.',
      'Build end-to-end transformation workloads using PySpark notebooks and Dataflows Gen2.',
      'Understand Real-Time Intelligence concepts with Eventstream and KQL queries.',
      'Confidently evaluate exam questions with scenario-based revision checklists.'
    ],
    specs: {
      format: 'Digital Download (Self-Study Guide, Notes & Code Notebooks)',
      files: 'PDF Study Guides, PySpark Notebooks (.ipynb), Markdown Checklists',
      version: '2026.1 (Aligns with Current Fabric Exam Syllabus)',
      lastUpdated: 'October 2026',
      prerequisites: 'Basic knowledge of SQL, Python concepts, and general cloud data architecture.',
      deliveryMethod: 'Instant Account Download via My Purchases',
      license: 'Single-User Personal Educational License',
      supportTerms: 'Product documentation and email/WhatsApp support for download assistance.',
    },
    faqs: [
      {
        question: 'Is this official Microsoft training material?',
        answer: 'No. This is an independently created preparation resource crafted from hands-on engineering experience with Microsoft Fabric. It complements official documentation on Microsoft Learn and is not affiliated with or endorsed by Microsoft.'
      },
      {
        question: 'Does this package include the official DP-700 exam voucher?',
        answer: 'No. Examination fees and certification testing vouchers must be purchased directly through Pearson VUE or Microsoft.'
      },
      {
        question: 'How do I access the files after purchasing?',
        answer: 'Upon verified checkout confirmation, all download links and updates are immediately accessible under your account dashboard at "/account/purchases". You also receive an email receipt confirming your order.'
      },
      {
        question: 'Will I receive updates if the exam syllabus changes?',
        answer: 'Yes! Registered purchasers receive access to revised versions and notes released for this package through their personal library.'
      },
      {
        question: 'What is your refund policy for digital products?',
        answer: 'Due to the nature of downloadable digital assets, access is delivered immediately. Please review our published Refund Policy for eligibility criteria and support assistance.'
      }
    ]
  }
};
