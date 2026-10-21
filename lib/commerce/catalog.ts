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
