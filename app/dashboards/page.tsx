'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ExternalLink, Filter, BarChart3, TrendingUp, PieChart, Activity, Share2, Code2 } from 'lucide-react';

interface DashboardItem {
  id: number;
  title: string;
  category: string;
  tool: string;
  color: string;
  icon: string;
  image: string | null;
  desc: string;
  embed: string | null;
  link?: string;
  isInternal?: boolean;
  tags: string[];
  metrics: string[];
  isNDA?: boolean;
}

const dashboards: DashboardItem[] = [
  {
    id: 100,
    title: 'Excel to Dashboards Generator & MIS Engine',
    category: 'Operations',
    tool: 'ExcelJS / Web App',
    color: '#10b981',
    icon: '📊',
    image: '/images/projects/excel-dashboard-generator/executive_dashboard_full.png',
    desc: 'Free client-side automated Excel KPI & MIS report generator. Multi-sheet workbook exports with live formulas, dynamic charts, and instant analytics. 100% private in-browser.',
    embed: null,
    link: 'https://excel.dattasable.com/',
    isInternal: false,
    tags: ['Flagship App', 'Excel Automation', 'Live Formulas', 'Zero Telemetry'],
    metrics: ['Multi-Sheet .xlsx', '100% In-Browser', 'Instant KPI Audit'],
  },
  {
    id: 201,
    title: 'Aura Capital & FinTech Group — Executive Sales Dashboard',
    category: 'Finance',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '💼',
    image: '/images/projects/aura-capital/executive_dashboard_full.png',
    desc: 'Illustrative enterprise FinTech BI model with 4 international theaters, dynamic quota scorecards, pivot matrix, and 1,036 sample transaction records. Download .xlsx file.',
    embed: null,
    link: '/dashboards/aura-capital-sales',
    isInternal: true,
    tags: ['Excel BI', 'FinTech', '1,036 Rows', 'Downloadable .xlsx'],
    metrics: ['$15.95M Vol', '102.3% Quota', '65.3% Margin'],
  },
  {
    id: 202,
    title: 'BioSynex Healthcare Technologies — Executive Sales Dashboard',
    category: 'Operations',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🩺',
    image: '/images/projects/biosynex-healthcare/executive_dashboard_full.png',
    desc: 'Hospital diagnostic procurement and clinical equipment sales model with multi-theater quota attainment and 1,002 sample transaction records. Download .xlsx file.',
    embed: null,
    link: '/dashboards/biosynex-healthcare',
    isInternal: true,
    tags: ['Excel BI', 'Healthcare', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['$26.01M Rev', '$16.46M Profit', '63.3% Margin'],
  },
  {
    id: 203,
    title: 'Helios CleanEnergy & Power Grid AG — Executive Sales Dashboard',
    category: 'Operations',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '⚡',
    image: '/images/projects/helios-cleanenergy/executive_dashboard_full.png',
    desc: 'Utility-scale renewable battery storage, solar inverter delivery, and regional feed-in tariff analysis with 2,502 audited telemetry records. Download .xlsx file.',
    embed: null,
    link: '/dashboards/helios-cleanenergy',
    isInternal: true,
    tags: ['Excel BI', 'CleanEnergy', '2,502 Rows', 'Downloadable .xlsx'],
    metrics: ['2,502 Orders', '108.4% Quota', '62.5% Margin'],
  },
  {
    id: 204,
    title: 'Meridian Global Retailers Inc. — Executive Sales Dashboard',
    category: 'Sales',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🛍️',
    image: '/images/projects/meridian-global-retail/executive_dashboard_full.png',
    desc: 'Omnichannel FMCG and retail commercial intelligence model tracking store vs direct fulfillment and channel margin splits across 1,002 records. Download .xlsx file.',
    embed: null,
    link: '/dashboards/meridian-global-retail',
    isInternal: true,
    tags: ['Excel BI', 'Retail FMCG', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['1,002 Rows', '103.7% Target', 'Multi-Channel'],
  },
  {
    id: 205,
    title: 'Nexus Cloud Technologies Inc. — Executive Sales Dashboard',
    category: 'Sales',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '☁️',
    image: '/images/projects/nexus-cloud-technologies/executive_dashboard_full.png',
    desc: 'Enterprise multi-cloud compute consumption, ARR quota tracking, and customer retention analytics across 1,002 institutional accounts. Download .xlsx file.',
    embed: null,
    link: '/dashboards/nexus-cloud-technologies',
    isInternal: true,
    tags: ['Excel BI', 'Cloud SaaS', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['124% NRR', '71.4% Margin', '$285K ACV'],
  },
  {
    id: 206,
    title: 'Nexus Enterprise Operations Group — Executive Sales Dashboard',
    category: 'Operations',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🚢',
    image: '/images/projects/nexus-enterprise-operations/executive_dashboard_full.png',
    desc: 'Global container logistics, multimodal freight forwarding, and carrier demurrage billing model across 2,502 sample transactions. Download .xlsx file.',
    embed: null,
    link: '/dashboards/nexus-enterprise-operations',
    isInternal: true,
    tags: ['Excel BI', 'Logistics', '2,502 Rows', 'Downloadable .xlsx'],
    metrics: ['2,502 Orders', '98.6% On-Time', '$34.2M Vol'],
  },
  {
    id: 207,
    title: 'OmniMedia Performance Marketing Network — Executive Sales Dashboard',
    category: 'Marketing',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '📣',
    image: '/images/projects/omnimedia-marketing-network/executive_dashboard_full.png',
    desc: 'Programmatic ad real-time bidding, connected TV attribution, and quarterly campaign pacing model across 2,502 marketing contracts. Download .xlsx file.',
    embed: null,
    link: '/dashboards/omnimedia-marketing-network',
    isInternal: true,
    tags: ['Excel BI', 'AdTech', '2,502 Rows', 'Downloadable .xlsx'],
    metrics: ['114.2% ROAS', '2,502 Campaigns', '-22.4% CPA'],
  },
  {
    id: 208,
    title: 'Sovereign Resorts & Luxury Hospitality — Executive Sales Dashboard',
    category: 'Finance',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🏨',
    image: '/images/projects/sovereign-resorts-hospitality/executive_dashboard_full.png',
    desc: 'Ultra-luxury hospitality RevPAR, villa yield management, and VIP guest lifetime value model across 1,002 reservation ledger entries. Download .xlsx file.',
    embed: null,
    link: '/dashboards/sovereign-resorts-hospitality',
    isInternal: true,
    tags: ['Excel BI', 'Hospitality', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['$1,420 RevPAR', '+14.8% ADR', '72% Direct'],
  },
  {
    id: 209,
    title: 'St. Andrews Collegiate University System — Executive Sales Dashboard',
    category: 'Operations',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🎓',
    image: '/images/projects/st-andrews-university/executive_dashboard_full.png',
    desc: 'Academic tuition revenue, endowed research grants, and departmental budget reconciliation across 2,502 sample collegiate entries. Download .xlsx file.',
    embed: null,
    link: '/dashboards/st-andrews-university',
    isInternal: true,
    tags: ['Excel BI', 'Higher Ed', '2,502 Rows', 'Downloadable .xlsx'],
    metrics: ['2,502 Records', '106.8% Target', 'Multi-Campus'],
  },
  {
    id: 210,
    title: 'TalentPulse Global People Systems — Executive Sales Dashboard',
    category: 'HR',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '👥',
    image: '/images/projects/talentpulse-people-systems/executive_dashboard_full.png',
    desc: 'Workforce analytics, international payroll compliance, and human capital retention intelligence model across 1,002 enterprise records. Download .xlsx file.',
    embed: null,
    link: '/dashboards/talentpulse-people-systems',
    isInternal: true,
    tags: ['Excel BI', 'HRTech', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['100% Renewal', '1,002 Records', '-28% Churn'],
  },
  {
    id: 211,
    title: 'Titan Industrial Systems AG — Executive Sales Dashboard',
    category: 'Sales',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '⚙️',
    image: '/images/projects/titan-industrial-systems/executive_dashboard_full.png',
    desc: 'Industrial machinery, CNC robotics manufacturing, and OEM aftermarket service quota model across 1,002 sample sales contracts. Download .xlsx file.',
    embed: null,
    link: '/dashboards/titan-industrial-systems',
    isInternal: true,
    tags: ['Excel BI', 'Industrial', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['103.5% Quota', '74.2% Margin', 'OEM Service'],
  },
  {
    id: 212,
    title: 'Vanguard Realty Capital Partners — Executive Sales Dashboard',
    category: 'Finance',
    tool: 'Excel / Next.js',
    color: 'var(--accent)',
    icon: '🏢',
    image: '/images/projects/vanguard-realty-capital/executive_dashboard_full.png',
    desc: 'Commercial real estate REIT lease expirations, tenant NNN recoveries, and portfolio capitalization yield analysis across 1,002 contracts. Download .xlsx file.',
    embed: null,
    link: '/dashboards/vanguard-realty-capital',
    isInternal: true,
    tags: ['Excel BI', 'Real Estate', '1,002 Rows', 'Downloadable .xlsx'],
    metrics: ['7.2% Cap Rate', '8.4 Yr WALE', '$1.85M Recov'],
  },
  {
    id: 115,
    title: 'Hyperlocal Fleet Operations & Rider MIS',
    category: 'Operations',
    tool: 'Excel / Next.js',
    color: '#00F0FF',
    icon: '🛵',
    image: '/images/dashboards/fleet_logistics.webp',
    desc: 'Interactive operational MIS dashboard modeling driver trip velocity, attendance compliance, bonus qualifications, and net payout reconciliation across 4 regional hub zones.',
    embed: null,
    link: '/dashboards/rider-ops',
    isInternal: true,
    tags: ['Rider Ops', 'Excel MIS', 'XLOOKUP', 'Fleet Logistics'],
    metrics: ['12 Fleet Riders', '4 Mumbai Hubs', '100% Reconciled'],
  },
  {
    id: 110,
    title: 'World Business Intelligence',
    category: 'Analytics',
    tool: 'DuckDB / BI',
    color: '#00F0FF',
    icon: '🌐',
    image: '/images/dashboards/world_business_intelligence.webp',
    desc: '3,000,000 audited global transactions (.72B GMV) across 50 sovereign markets, 6 continents, and 15 industry verticals with live cross-filtering.',
    embed: '/Dashboard/world-business-dashboard.html',
    link: '/dashboards/world-business',
    isInternal: true,
    tags: ['Big Data', '3M Records', 'Global BI', 'DuckDB'],
    metrics: ['.72B GMV', '3M Orders', '50 Nations'],
  },
  {
    id: 103,
    title: 'Blinkit Sales Dashboard',
    category: 'Sales',
    tool: 'Power BI',
    color: 'var(--accent2)',
    icon: '🛒',
    image: '/images/dashboards/blinkit_sales_dashboard.webp',
    desc: 'Comprehensive Blinkit sales performance and quick commerce analytics dashboard.',
    embed: '/Dashboard/blinkit-dashboard.html',
    link: '/dashboards/blinkit-sales',
    isInternal: true,
    tags: ['Sales', 'Blinkit', 'Quick Commerce'],
    metrics: ['Live Tracking', 'Real-time'],
  },
  {
    id: 104,
    title: 'Surgical AI Workspace',
    category: 'Operations',
    tool: 'Internal',
    color: '#6ee7ff',
    icon: '⚡',
    image: '/images/dashboards/surgical_ai_preview.webp',
    desc: 'Enterprise-grade AI workflow infrastructure for creators. Monitor intelligent execution chains and scale AI operations.',
    embed: '/Dashboard/surgical-ai-workspace.html',
    link: '/dashboards/surgical-ai',
    isInternal: true,
    tags: ['AI Operations', 'Automation', 'Infrastructure'],
    metrics: ['98.4% Success', '18.4M Tokens', '-6.2% Cost'],
  },
  // --- FINTECH (1) ---
  {
    id: 101,
    title: 'Global Sales Intelligence',
    category: 'Analytics',
    tool: 'Python',
    color: '#9b59ff',
    icon: '🌍',
    image: '/images/dashboards/world_business_intelligence.webp',
    desc: 'Real-time global revenue monitoring with market penetration and conversion funnel analysis.',
    embed: '/dashboards/global-sales-intelligence',
    isInternal: true,
    tags: ['Sales', 'Global', 'BI'],
    metrics: ['Real-time', 'Market Focus', 'Funnel'],
  },
  {
    id: 102,
    title: 'EMI Collection Intelligence',
    category: 'Finance',
    tool: 'Python',
    color: '#00d4ff',
    icon: '💳',
    image: '/images/dashboards/telecom_collection_delinquency.webp',
    desc: 'Next-gen collection infrastructure with real-time risk assessment, aging bucket analysis, and automated channel tracking.',
    embed: '/dashboards/collection-intelligence',
    isInternal: true,
    tags: ['FinTech', 'Collections', 'Risk'],
    metrics: ['₹4.82Cr Coll', '94.7% Eff', '22k+ Loans'],
  },
  {
    id: 105,
    title: 'Revenue Intelligence',
    category: 'Finance',
    tool: 'Power BI',
    color: '#3b82f6',
    icon: '📈',
    image: null,
    desc: 'SQL & Power BI MoM forecasting model displaying revenue streams, conversion drivers, and run-rate variance.',
    embed: '/dashboards/revenue-intelligence',
    isInternal: true,
    tags: ['Revenue', 'Forecasting', 'SQL'],
    metrics: ['MoM Forecast', 'SQL Native', 'Power BI'],
  },
  {
    id: 106,
    title: 'Interactive Demo',
    category: 'Analytics',
    tool: 'Tableau',
    color: '#06b6d4',
    icon: '🎭',
    image: null,
    desc: 'Live embedded BI experience showcasing interactive parameters, advanced level-of-detail queries, and custom tooltips.',
    embed: '/dashboards/interactive',
    isInternal: true,
    tags: ['Interactive', 'BI', 'Embedded'],
    metrics: ['Live Embedded', 'Interactive UX', 'Tableau'],
  },
  // --- SALES (4) ---
  {
    id: 1,
    title: 'Global Sales KPI Tracker',
    category: 'Sales',
    tool: 'Tableau',
    color: 'var(--accent)',
    icon: '📊',
    image: '/images/dashboards/global_sales_kpi.webp',
    desc: 'Real-time tracking of $12M+ in annual revenue with region/product/rep drilldown and YoY trend forecasting.',
    embed: 'https://public.tableau.com/views/SuperstoreSalesOverviewDashboard_16817475061410/ExecOverview?:embed=y&:showVizHome=no',
    tags: ['Revenue', 'KPI', 'Trend'],
    metrics: ['$12M+ tracked', '15 markets', '200+ SKUs'],
  },
  {
    id: 7,
    title: 'Sales Pipeline Velocity',
    category: 'Sales',
    tool: 'Internal',
    color: 'var(--accent)',
    icon: '📈',
    image: '/images/dashboards/sales_pipeline_preview.webp',
    desc: 'Analysis of deal movement through the funnel, identifying bottlenecks and predicting quarterly closure rates.',
    embed: '/Dashboard/sales_pipeline_dashboard.html',
    link: '/dashboards/sales-pipeline',
    isInternal: true,
    tags: ['Pipeline', 'Forecasting', 'Funnel'],
    metrics: ['+22% Velocity', '$4.5M Pipeline', '85% Accuracy'],
  },
  {
    id: 8,
    title: 'Customer Churn Prediction',
    category: 'Sales',
    tool: 'Python',
    color: 'var(--accent)',
    icon: '📉',
    image: '/images/dashboards/customer_churn_prediction.webp',
    desc: 'ML-driven churn risk assessment integrated with Tableau for proactive account management and retention.',
    embed: null,
    tags: ['Churn', 'Retention', 'ML'],
    metrics: ['-15% Churn', 'Risk Scoring', '90% Precision'],
  },
  {
    id: 9,
    title: 'Regional Sales Performance',
    category: 'Sales',
    tool: 'Looker',
    color: 'var(--accent)',
    icon: '🗺️',
    image: '/images/dashboards/regional_sales_performance.webp',
    desc: 'Geospatial analysis of sales performance across 50 states, correlated with local economic indicators.',
    embed: 'https://lookerstudio.google.com/embed/reporting/0B_U5fByxZW9uX3ZpczltU3pYdTg/page/1M',
    isNDA: true,
    tags: ['Geo-spatial', 'Regional', 'Growth'],
    metrics: ['50 States', 'Live Updates', 'Zip-level Drill'],
  },

  // --- OPERATIONS (5) ---


  {
    id: 2,
    title: 'Supply Chain Performance',
    category: 'Operations',
    tool: 'Power BI',
    color: 'var(--accent2)',
    icon: '🔗',
    image: '/images/dashboards/supply_chain_performance.webp',
    desc: 'End-to-end supply chain visibility — inventory, supplier SLA, logistics cost and demand forecasting.',
    embed: null,
    tags: ['Supply Chain', 'Inventory', 'Logistics'],
    metrics: ['500+ SKUs', '3 countries', '-18% cost'],
  },
  {
    id: 10,
    title: 'Warehouse Throughput Monitor',
    category: 'Operations',
    tool: 'Tableau',
    color: 'var(--accent2)',
    icon: '📦',
    image: '/images/dashboards/warehouse_throughput.webp',
    desc: 'Real-time monitoring of warehouse efficiency, picker performance, and order-to-shipment latency.',
    embed: 'https://public.tableau.com/views/LogisticsDashboard_16820931460080/Overview?:embed=y&:showVizHome=no',
    isNDA: true,
    tags: ['Warehouse', 'Efficiency', 'Logistics'],
    metrics: ['2.4k orders/hr', '99.8% Accuracy', '-12m Latency'],
  },
  {
    id: 11,
    title: 'Predictive Maintenance Log',
    category: 'Operations',
    tool: 'Python',
    color: 'var(--accent2)',
    icon: '⚙️',
    image: '/images/dashboards/predictive_maintenance.webp',
    desc: 'IoT sensor data analysis to predict equipment failure before it occurs, reducing unplanned downtime.',
    embed: null,
    tags: ['IoT', 'Maintenance', 'Predictive'],
    metrics: ['-30% Downtime', '$200k Saved', 'Live Sensors'],
  },
  {
    id: 12,
    title: 'Fleet Logistics Optimization',
    category: 'Operations',
    tool: 'Power BI',
    color: 'var(--accent2)',
    icon: '🚛',
    image: '/images/dashboards/fleet_logistics.webp',
    desc: 'Route optimization and fuel efficiency tracking for a 500-vehicle fleet across international borders.',
    embed: null,
    tags: ['Fleet', 'Routing', 'Fuel'],
    metrics: ['500 Vehicles', '-15% Fuel', 'GPS Integrated'],
  },

  // --- HR (4) ---
  {
    id: 3,
    title: 'HR Workforce Analytics',
    category: 'HR',
    tool: 'Tableau',
    color: 'var(--accent3)',
    icon: '👥',
    image: '/images/dashboards/hr_workforce.webp',
    desc: 'Attrition prediction, headcount planning, performance distribution, and diversity metrics.',
    embed: 'https://public.tableau.com/views/WorkforceAnalytics-Attrition/AttritionDashboard?:embed=y&:showVizHome=no',
    isNDA: true,
    tags: ['Attrition', 'Headcount', 'D&I'],
    metrics: ['2,000+ employees', '97% time saved', '12 KPIs'],
  },
  {
    id: 13,
    title: 'Talent Acquisition Funnel',
    category: 'HR',
    tool: 'Looker',
    color: 'var(--accent3)',
    icon: '🎯',
    image: '/images/dashboards/talent_acquisition.webp',
    desc: 'Tracking recruitment efficiency, time-to-hire, and cost-per-hire across multiple sourcing channels.',
    embed: 'https://lookerstudio.google.com/embed/reporting/17Yq6eVJSSEM1mCtkB9lnZ2bjOROZBBU1/page/VgD',
    isNDA: true,
    tags: ['Recruitment', 'Hiring', 'ROI'],
    metrics: ['-20% Time-to-Hire', '5 Channels', 'ATS Integrated'],
  },
  {
    id: 14,
    title: 'Employee Performance Matrix',
    category: 'HR',
    tool: 'Power BI',
    color: 'var(--accent3)',
    icon: '🌟',
    image: '/images/dashboards/employee_performance.webp',
    desc: 'Automated 9-box grid for succession planning and performance vs. potential analysis.',
    embed: null,
    tags: ['Performance', 'Succession', 'Growth'],
    metrics: ['100% Automated', 'Bias-Free', 'Quarterly Review'],
  },
  {
    id: 15,
    title: 'Workplace Diversity Pulse',
    category: 'HR',
    tool: 'Tableau',
    color: 'var(--accent3)',
    icon: '🌍',
    image: '/images/dashboards/workplace_diversity.webp',
    desc: 'Real-time D&I reporting, ensuring compliance with global standards and tracking equity benchmarks.',
    embed: 'https://public.tableau.com/views/DiversityInclusion_17493725024920/WorkforceAnalyticsDiversityInclusion?:embed=y&:showVizHome=no',
    isNDA: true,
    tags: ['Diversity', 'Equity', 'Inclusion'],
    metrics: ['Global Compliance', 'Live Pulse', 'Pay Equity'],
  },

  // --- FINANCE (4) ---
  {
    id: 5,
    title: 'Financial P&L Dashboard',
    category: 'Finance',
    tool: 'Power BI',
    color: 'var(--accent2)',
    icon: '💰',
    image: '/images/dashboards/financial_pnl.webp',
    desc: 'Board-ready P&L, cash flow waterfall, budget variance heatmap, and departmental cost breakdown.',
    embed: null,
    tags: ['P&L', 'Cash Flow', 'Budget'],
    metrics: ['5-day → 4hr close', '18mo zero errors', 'CFO 9.5/10'],
  },
  {
    id: 16,
    title: 'Cash Flow Forecasting',
    category: 'Finance',
    tool: 'Power BI',
    color: 'var(--accent2)',
    icon: '🌊',
    image: '/images/dashboards/cash_flow_forecasting.webp',
    desc: '12-month rolling cash flow forecast with multiple sensitivity analysis scenarios for executive planning.',
    embed: null,
    tags: ['Cash Flow', 'Forecast', 'Scenarios'],
    metrics: ['$50M+ Managed', '95% Accuracy', 'Rolling 12M'],
  },
  {
    id: 17,
    title: 'SaaS Unit Economics',
    category: 'Finance',
    tool: 'Looker',
    color: 'var(--accent2)',
    icon: '📊',
    image: '/images/dashboards/saas_economics.webp',
    desc: 'Real-time LTV/CAC, MRR movements, and cohort-based retention analysis for high-growth startups.',
    embed: 'https://lookerstudio.google.com/embed/reporting/1rBC8woDruwE-f_gsheY7kwlx0BPtgzEn/page/c2P1',
    isNDA: true,
    tags: ['SaaS', 'LTV', 'CAC'],
    metrics: ['Live MRR', 'Cohort Analysis', '+4.5x LTV/CAC'],
  },
  {
    id: 18,
    title: 'Expense Audit & Control',
    category: 'Finance',
    tool: 'Python',
    color: 'var(--accent2)',
    icon: '🔎',
    image: '/images/dashboards/expense_audit.webp',
    desc: 'AI-powered anomaly detection in corporate expenses, identifying potential fraud or waste instantly.',
    embed: null,
    tags: ['Audit', 'Fraud', 'Control'],
    metrics: ['-25% Waste', 'Instant Alerts', 'Full Audit Trail'],
  },

  // --- MARKETING (4) ---
  {
    id: 4,
    title: 'E-Commerce Customer Journey',
    category: 'Marketing',
    tool: 'Tableau',
    color: 'var(--accent)',
    icon: '🛒',
    image: '/images/dashboards/ecommerce_journey.webp',
    desc: 'Omnichannel attribution, customer lifetime value cohorts, funnel analysis, and campaign ROI tracking.',
    embed: 'https://public.tableau.com/views/SalesFunnelDashboard_16570254084520/SalesPipelineDashboard?:embed=y&:showVizHome=no',
    isNDA: true,
    tags: ['Attribution', 'LTV', 'Funnel'],
    metrics: ['+35% ROAS', '-22% CAC', '4 channels'],
  },
  {
    id: 6,
    title: 'Marketing Campaign Analytics',
    category: 'Marketing',
    tool: 'Looker',
    color: 'var(--accent3)',
    icon: '📢',
    image: '/images/blog/python_scraper_hero_1777410123458.webp',
    desc: 'Multi-channel campaign performance, A/B test results, audience segmentation, and real-time spend tracking.',
    embed: 'https://lookerstudio.google.com/embed/reporting/17Yq6eVJSSEM1mCtkB9lnZ2bjOROZBBU1/page/VgD',
    isNDA: true,
    tags: ['Campaigns', 'A/B Testing', 'Segments'],
    metrics: ['8 channels', '$500K spend', 'Real-time'],
  },
  {
    id: 19,
    title: 'Social Media Sentiment Engine',
    category: 'Marketing',
    tool: 'Python',
    color: 'var(--accent3)',
    icon: '🔥',
    image: '/images/blog/nlq_engines_hero_1777410174899.webp',
    desc: 'Real-time sentiment analysis of brand mentions across Twitter, Reddit, and LinkedIn using NLP.',
    embed: null,
    tags: ['NLP', 'Social', 'Sentiment'],
    metrics: ['10k mentions/day', '85% Sentiment Acc', 'Live Alerts'],
  },
  {
    id: 20,
    title: 'SEO Performance Master',
    category: 'Marketing',
    tool: 'Looker',
    color: 'var(--accent3)',
    icon: '🚀',
    image: '/images/blog/generative_ai_hero_1777410154583.webp',
    desc: 'Comprehensive SEO health tracking, keyword rankings, backlink profiles, and organic traffic growth.',
    embed: 'https://lookerstudio.google.com/embed/reporting/f1837c75-6dd4-4355-9966-ca1785d14302/page/4OrWB',
    isNDA: true,
    tags: ['SEO', 'Keywords', 'Traffic'],
    metrics: ['+150% Traffic', 'Top 3 Ranking', 'Full GSC Integration'],
  },

  // --- TABLEAU SAMPLES (5) ---
  {
    id: 21,
    title: 'Executive Sales Overview',
    category: 'Sales',
    tool: 'Tableau',
    color: 'var(--accent)',
    icon: '📊',
    image: '/images/blog/dashboard_ux_hero_1777410208497.webp',
    desc: 'Modern executive-level summary featuring top-level sales, profit, and customer KPIs with quarterly comparisons.',
    embed: 'https://public.tableau.com/views/SuperstoreDashboard_16709573699130/SuperstoreDashboard?:embed=y&:showVizHome=no',
    tags: ['Executive', 'Sales', 'KPI'],
    metrics: ['Interactive', '99.9% Acc', 'Real-time'],
  },
  {
    id: 22,
    title: 'Executive Sales Strategy',
    category: 'Sales',
    tool: 'Tableau',
    color: 'var(--accent)',
    icon: '🎯',
    image: '/images/blog/tableau_lods_hero_1777410139358.webp',
    desc: 'Sophisticated strategic dashboard designed for board-level decision-making with deep profitability insights.',
    embed: 'https://public.tableau.com/views/SuperstoreSalesDashboardforExecutives/Executive?:embed=y&:showVizHome=no',
    tags: ['Strategy', 'Profit', 'Executive'],
    metrics: ['Board-Ready', 'Deep Dive', 'Strategic'],
  },
  {
    id: 23,
    title: 'Supply Chain & Logistics',
    category: 'Operations',
    tool: 'Tableau',
    color: 'var(--accent2)',
    icon: '🚛',
    image: '/images/blog/python-pandas.webp',
    desc: 'Dedicated logistics-focused dashboard highlighting shipping performance and regional distribution efficiency.',
    embed: 'https://public.tableau.com/views/SupplychainDashboard/1KPIDashboard?:embed=y&:showVizHome=no',
    tags: ['Supply Chain', 'Logistics', 'Shipping'],
    metrics: ['Live Tracking', 'Global Coverage', '-12% Delay'],
  },
  {
    id: 24,
    title: 'Corporate Expense Audit',
    category: 'Finance',
    tool: 'Tableau',
    color: 'var(--accent2)',
    icon: '💰',
    image: '/images/dashboards/expense_audit.webp',
    desc: 'High-authority financial dashboard showcasing employee expense tracking and departmental budget management.',
    embed: 'https://public.tableau.com/views/EmployeeExpenseAnalysis/EmployeeExpenseAnalysis?:embed=y&:showVizHome=no',
    tags: ['Finance', 'Expense', 'Audit'],
    metrics: ['$5M Tracked', 'Fraud Detect', '100% Audit'],
  },
  {
    id: 25,
    title: 'Super Sample Superstore',
    category: 'Sales',
    tool: 'Tableau',
    color: 'var(--accent)',
    icon: '🚀',
    image: '/images/blog/tech_stack_2026_hero_1777409998596.webp',
    desc: 'A world-famous, visually distinct dashboard using advanced custom formatting and technical design standards.',
    embed: 'https://public.tableau.com/views/SuperSampleSuperstore/SuperDescriptive?:embed=y&:showVizHome=no',
    tags: ['Advanced', 'Design', 'Formatting'],
    metrics: ['Award Winning', 'Custom UX', 'Pro Grade'],
  },
];

const categories = ['All', 'Excel', 'Sales', 'Operations', 'Finance', 'HR', 'Marketing', 'Analytics'];
const tools = ['All Tools', 'Excel', 'Tableau', 'Power BI', 'Looker', 'Python'];

const toolColors: Record<string, string> = {
  Excel: '#107c41',
  'Excel / Next.js': '#107c41',
  Tableau: 'var(--accent)',
  'Power BI': 'var(--accent2)',
  Looker: 'var(--accent3)',
  Python: '#3776ab',
};

export default function DashboardsPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [activeTool, setActiveTool] = useState('All Tools');
  const [preview, setPreview] = useState<typeof dashboards[0] | null>(null);

  const isExcelItem = (d: DashboardItem) =>
    d.category === 'Excel' ||
    d.tool.toLowerCase().includes('excel') ||
    d.tags.some(t => t.toLowerCase().includes('excel'));

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return dashboards.length;
    if (cat === 'Excel') return dashboards.filter(isExcelItem).length;
    return dashboards.filter(d => d.category === cat).length;
  };

  const getToolCount = (tool: string) => {
    if (tool === 'All Tools') return dashboards.length;
    if (tool === 'Excel') return dashboards.filter(d => d.tool.toLowerCase().includes('excel')).length;
    return dashboards.filter(d => d.tool.toLowerCase().includes(tool.toLowerCase())).length;
  };

  const filtered = dashboards.filter(d => {
    const catMatch =
      activeCat === 'All'
        ? true
        : activeCat === 'Excel'
          ? isExcelItem(d)
          : d.category === activeCat;

    const toolMatch =
      activeTool === 'All Tools'
        ? true
        : activeTool === 'Excel'
          ? d.tool.toLowerCase().includes('excel')
          : d.tool.toLowerCase().includes(activeTool.toLowerCase());

    return catMatch && toolMatch;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        {/* ── Top-left Precision Crosshair ── */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
        <div className="container">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
            <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>INTERACTIVE-ANALYTICS</div>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 48px)', 
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Dashboard <span className="hero-title">Showcase</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 560, lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Real-world analytics platforms engineered for high-stakes decision making. Filter by industry or stack.
            </p>


            {/* Filter Control Center */}
            <div style={{ 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="mono" style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(201,243,29,0.1)', padding: '2px 8px', border: '1px solid rgba(201,243,29,0.2)' }}>
                  CAT_FILTER:
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const count = getCategoryCount(cat);
                    const isActive = activeCat === cat;
                    return (
                      <button 
                        key={cat} 
                        className={`filter-tab ${isActive ? 'active' : ''}`} 
                        onClick={() => setActiveCat(cat)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: isActive ? 'var(--accent)' : 'transparent',
                          color: isActive ? 'var(--btn-primary-text)' : 'var(--muted)',
                          border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderRadius: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{cat}</span>
                        <span 
                          className="mono" 
                          style={{ 
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '2px',
                            background: isActive ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)',
                            color: isActive ? 'var(--btn-primary-text)' : 'var(--text)',
                            border: isActive ? '1px solid rgba(0,0,0,0.15)' : '1px solid var(--border)',
                            lineHeight: 1.2
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

              <div className="flex flex-wrap items-center gap-4">
                <div className="mono" style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent2)', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', border: '1px solid rgba(139,92,246,0.2)' }}>
                  TOOL_FILTER:
                </div>
                <div className="flex flex-wrap gap-2">
                  {tools.map(t => {
                    const count = getToolCount(t);
                    const isActive = activeTool === t;
                    return (
                      <button 
                        key={t} 
                        className={`filter-tab ${isActive ? 'active' : ''}`} 
                        onClick={() => setActiveTool(t)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: isActive ? 'var(--accent2)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--muted)',
                          border: isActive ? '1px solid var(--accent2)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderRadius: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{t}</span>
                        <span 
                          className="mono" 
                          style={{ 
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '2px',
                            background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                            color: isActive ? '#fff' : 'var(--text)',
                            border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--border)',
                            lineHeight: 1.2
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard grid */}
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filtered.map((d, i) => (
                  <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.06 }}
                  className="card"
                  style={{ 
                    overflow: 'hidden',
                    borderLeft: '2px solid',
                    borderImage: `linear-gradient(to bottom, ${d.color}, #00C9F2) 1`,
                  }}
                >
                  {/* Preview area */}
                  <div
                    style={{
                      height: 200,
                      background: 'var(--tag-bg)',
                      border: `1px solid ${d.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {d.image ? (
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                        <motion.img 
                          src={d.image} 
                          alt={d.title}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                          loading="lazy"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, var(--bg), transparent)` }} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '5rem' }}>{d.icon}</span>
                    )}
                    {/* Tool badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--bg)', border: `1px solid ${d.color}44`, padding: '0.3rem 0.75rem', fontSize: '10px', fontWeight: 700, color: d.color, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', zIndex: 2 }}>
                      {d.tool}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="tag" style={{ color: d.color, borderColor: `${d.color}44`, fontSize: '0.7rem' }}>{d.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: 'var(--text)' }}>{d.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{d.desc}</p>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {d.metrics.map(m => (
                        <span key={m} className="mono" style={{ background: 'var(--tag-bg)', border: `1px solid ${d.color}22`, padding: '0.2rem 0.6rem', fontSize: '10px', color: d.color, fontWeight: 700, textTransform: 'uppercase' }}>{m}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {d.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <Link
                        href={d.link || d.embed || '#'}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                        style={{ fontSize: '0.75rem', height: '38px', whiteSpace: 'nowrap', padding: '0 1rem', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}
                        target={(d.link?.startsWith('http') || d.embed?.startsWith('http')) ? "_blank" : undefined}
                        rel={(d.link?.startsWith('http') || d.embed?.startsWith('http')) ? "noopener noreferrer" : undefined}
                      >
                        <ExternalLink size={14} /> Open Dashboard
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Schema and Component Code for this dashboard will be available soon in the Infrastructure Hub.');
                        }}
                        className="btn-outline flex items-center justify-center"
                        style={{ width: '38px', height: '38px', padding: 0 }}
                        title="View Component Schema"
                      >
                        <Code2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          let shareUrl = window.location.href;
                          // Use the 'link' property if it exists, otherwise fall back to 'embed' if it's a dedicated page
                          const targetPath = d.link || d.embed;
                          if (targetPath) {
                            if (targetPath.startsWith('/')) {
                              shareUrl = window.location.origin + targetPath;
                            } else {
                              shareUrl = targetPath;
                            }
                          }

                          if (navigator.share) {
                            navigator.share({
                              title: d.title,
                              text: d.desc,
                              url: shareUrl,
                            });
                          } else {
                            // Fallback if Web Share API is not supported
                            navigator.clipboard.writeText(shareUrl).then(() => {
                              alert('Dashboard link copied to clipboard!');
                            });
                          }
                        }}
                        className="btn-outline flex items-center justify-center"
                        style={{ width: '38px', height: '38px', padding: 0 }}
                        title="Share Dashboard URL"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No dashboards match these filters.</p>
              <button
                onClick={() => {
                  setActiveCat('All');
                  setActiveTool('All Tools');
                }}
                className="btn-outline"
                style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 1.25rem' }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Preview modal has been replaced by native page routing */}

        {/* ── Bottom-right Precision Crosshair ── */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
