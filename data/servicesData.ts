export interface ServiceItem {
  id: string;
  slug: string;
  aliases: string[];
  icon: string;
  image?: string;
  title: string;
  tagline: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  price: string;
  deliveryTime: string;
  cta: string;
  color: string;
  popular: boolean;
  features: string[];
  capabilities: { title: string; desc: string }[];
  technologies: string[];
  faqs: { q: string; a: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'consulting',
    slug: 'consulting',
    aliases: ['bi-consulting'],
    icon: '🔬',
    image: '/images/blog/bi_strategy_unique.webp',
    title: 'Data Analytics & BI Consulting',
    tagline: 'Executive decision systems, data pipeline audits, and strategic KPI architecture.',
    desc: 'End-to-end analytics strategy — from raw data hygiene audits to insight delivery. I help enterprise stakeholders understand data lineage, eliminate reporting bottlenecks, and scale decision velocity.',
    metaTitle: 'Data Analytics & BI Consulting | Datta Sable',
    metaDesc: 'Specialized BI and data analytics consulting for enterprise teams. Strategy, KPI frameworks, SQL query optimization, and executive decision cockpits.',
    price: 'Starting at ₹25,000',
    deliveryTime: '1 - 3 Weeks',
    cta: 'Book a Strategy Consultation',
    color: 'var(--accent2)',
    popular: true,
    features: [
      'Data audit & source gap analysis',
      'KPI framework design & governance',
      'SQL query performance optimization',
      'Data modeling (Star Schema / 3NF)',
      'Executive insight reporting packs',
      'Team upskilling & enablement sessions'
    ],
    capabilities: [
      {
        title: 'Data Audits & Lineage Mapping',
        desc: 'Comprehensive review of your existing data pipelines, identifying silent failures, data drift, and redundant processing steps.'
      },
      {
        title: 'KPI Framework & Metric Governance',
        desc: 'Establish unified metric definitions across departments so finance, operations, and leadership all look at the exact same numbers.'
      },
      {
        title: 'Query Optimization & Indexing',
        desc: 'Optimize slow SQL queries and data models in PostgreSQL, MySQL, and SQL Server to reduce execution time and cloud compute bills.'
      },
      {
        title: 'Executive Advisory & Enablement',
        desc: 'Hands-on coaching for internal teams and weekly syncs with stakeholders to turn analytics findings into decisive operational actions.'
      }
    ],
    technologies: ['Power BI', 'Tableau', 'PostgreSQL', 'SQL Server', 'Python', 'Excel MIS', 'DAX Studio'],
    faqs: [
      {
        q: 'How does the consulting engagement work?',
        a: 'We begin with a data infrastructure discovery call, review existing schemas, define the scope and milestone roadmap, and provide weekly actionable sprints.'
      },
      {
        q: 'Can you work with our existing engineering and analytics team?',
        a: 'Yes, I seamlessly embed into your workflow, working alongside internal data engineers, business analysts, and C-level stakeholders.'
      },
      {
        q: 'Do you sign Non-Disclosure Agreements (NDAs)?',
        a: 'Absolutely. Confidentiality is paramount. I sign mutual NDAs prior to accessing any internal datasets or system architectures.'
      }
    ]
  },
  {
    id: 'dashboards',
    slug: 'dashboards',
    aliases: ['dashboard-design'],
    icon: '📊',
    image: '/images/dashboards/global_sales_intelligence.webp',
    title: 'Dashboard Development',
    tagline: 'High-fidelity Power BI & Tableau interactive command centres.',
    desc: 'Custom, interactive dashboards that give leadership and operational teams real-time visibility into mission-critical KPIs. Engineered with audited DAX/LOD calculations, sub-second query rendering, and pixel-perfect design.',
    metaTitle: 'Custom Power BI & Tableau Dashboard Development | Datta Sable',
    metaDesc: 'Professional Power BI and Tableau dashboard engineering. Sub-second queries, executive UX, automated data refreshes, and financial mathematical reconciliation.',
    price: 'Starting at ₹15,000',
    deliveryTime: '5 - 10 Business Days',
    cta: 'Build My Dashboard',
    color: 'var(--accent)',
    popular: false,
    features: [
      'KPI tracking & real-time monitoring',
      'Interactive drill-down & cross-filtering',
      'Cross-platform & responsive layouts',
      'Automated scheduled data refresh',
      'Executive-ready dark/light mode themes',
      'Mobile-optimized viewing views'
    ],
    capabilities: [
      {
        title: 'Financial & Collections Cockpits',
        desc: 'Multi-tiered portfolio views tracking delinquency rates, recovery velocity, roll rates, and cash-flow projections with mathematical precision.'
      },
      {
        title: 'Executive C-Suite Overview',
        desc: 'High-density summaries focused on EBITDA, MoM variance, customer acquisition efficiency, and operational bottlenecks.'
      },
      {
        title: 'Self-Serve Drill-Down Analytics',
        desc: 'Intuitive slicers, hierarchy breakdowns, and dynamic tooltip cards that empower analysts to answer secondary questions without IT assistance.'
      },
      {
        title: 'Row-Level Security (RLS) Setup',
        desc: 'Granular security configurations ensuring managers only see their regional branch data while global directors view aggregated totals.'
      }
    ],
    technologies: ['Power BI', 'Tableau', 'DAX', 'Power Query', 'SQL', 'Microsoft Fabric', 'Figma'],
    faqs: [
      {
        q: 'What BI tools do you specialize in?',
        a: 'I specialize in Power BI and Tableau, with extensive experience connecting to SQL warehouses, Azure OneLake, Google BigQuery, Excel, and REST APIs.'
      },
      {
        q: 'How do you ensure calculations match our financial statements?',
        a: 'Every measure undergoes a 100% mathematical reconciliation protocol, validating results against audited source databases and accounting balance sheets.'
      },
      {
        q: 'Can the dashboard automatically refresh without manual intervention?',
        a: 'Yes, I configure on-premises gateways and cloud scheduled refresh pipelines so data updates automatically daily, hourly, or in near-real-time.'
      }
    ]
  },
  {
    id: 'web-solutions',
    slug: 'web-solutions',
    aliases: ['web-dev'],
    icon: '🌐',
    image: '/images/blog/enterprise_web_unique.webp',
    title: 'Enterprise Web Solutions',
    tagline: 'High-performance Next.js and WordPress platforms tailored for data-heavy organizations.',
    desc: 'Bespoke web development combining modern React/Next.js architectures with ultra-fast database backends. Built for businesses that need high SEO rankings, zero layout shift, and scalable digital infrastructure.',
    metaTitle: 'Enterprise Web Solutions & Next.js Development | Datta Sable',
    metaDesc: 'Enterprise web development with Next.js, React, and custom WordPress. High performance, sub-second load times, and custom API integrations.',
    price: 'Starting at ₹30,000',
    deliveryTime: '2 - 4 Weeks',
    cta: 'Build My Platform',
    color: 'var(--accent)',
    popular: false,
    features: [
      'Custom Next.js & React Architectures',
      'Custom Headless & Native WordPress Themes',
      'Technical SEO architecture from day one',
      'Core Web Vitals 95+ score tuning',
      'Content management training & documentation',
      'REST API & Database integrations'
    ],
    capabilities: [
      {
        title: 'Next.js 15 Full-Stack Applications',
        desc: 'Server-side rendered, lightning-fast web applications leveraging React 19, TypeScript, and edge runtime routing for peak performance.'
      },
      {
        title: 'Custom WordPress Engineering',
        desc: 'Zero-bloat WordPress custom theme development, eliminating heavy page builders in favor of lightweight, custom Gutenberg blocks.'
      },
      {
        title: 'API & Microservice Integration',
        desc: 'Secure server actions, OAuth authentication flows, payment gateway connections, and CRM integrations tailored to your business.'
      },
      {
        title: 'Performance & Security Hardening',
        desc: 'DDoS mitigation, CSP headers, rate-limiting, edge CDN caching, and automated image compression pipeline.'
      }
    ],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'WordPress', 'Node.js', 'PostgreSQL'],
    faqs: [
      {
        q: 'Why choose Next.js over traditional WordPress or builders?',
        a: 'Next.js delivers near-instant page loads, superior Core Web Vitals, enterprise security, and ultimate design flexibility for data-driven platforms.'
      },
      {
        q: 'Do you offer ongoing maintenance?',
        a: 'Yes, ongoing maintenance packages include security patches, uptime monitoring, performance auditing, and monthly feature rollouts.'
      }
    ]
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design',
    aliases: [],
    icon: '✒️',
    image: '/images/blog/creative_tools_unique.webp',
    title: 'Professional Graphic Design',
    tagline: 'Vector design, corporate branding, and print-ready marketing assets powered by CorelDRAW.',
    desc: 'High-impact visual communication for print and digital media. Precision vector logo creation, branding systems, executive presentations, and marketing collateral engineered for maximum brand recall.',
    metaTitle: 'Professional Graphic Design & Vector Branding | Datta Sable',
    metaDesc: 'Expert vector graphics, brand identities, CorelDRAW design, and corporate collateral. Crisp typography, vector precision, and print-ready outputs.',
    price: 'Starting at ₹5,000',
    deliveryTime: '2 - 4 Business Days',
    cta: 'Get Design Quote',
    color: 'var(--accent2)',
    popular: false,
    features: [
      'Vector logo design & identity suites',
      'Brand style guides & color palettes',
      'Print-ready marketing assets (CMYK/Pantone)',
      'Custom typography & visual layouts',
      'Icon sets & vector illustration',
      'File conversion & vectorization (AI/CDR/SVG)'
    ],
    capabilities: [
      {
        title: 'Corporate Brand Identity',
        desc: 'Crafting memorable visual identities with scalable vector logomarks, typography rules, and cohesive brand guidelines.'
      },
      {
        title: 'Marketing & Advertising Collateral',
        desc: 'Designing banners, brochures, business stationery, flyers, and digital advertisements that convert viewers into clients.'
      },
      {
        title: 'Vector Tracing & Restoration',
        desc: 'Upgrading low-resolution raster imagery into crystal-clear, infinitely scalable vector curves ready for large-format billboards.'
      },
      {
        title: 'Executive Presentation Decks',
        desc: 'Polishing slide decks and investor pitch materials with infographics, charts, and clean layout hierarchies.'
      }
    ],
    technologies: ['CorelDRAW', 'Adobe Illustrator', 'Photoshop', 'Figma', 'Vector SVG', 'PDF/X Print'],
    faqs: [
      {
        q: 'What file formats will I receive?',
        a: 'You will receive editable source files (CDR, AI, SVG) along with high-res PNG, JPEG, and print-ready PDF (CMYK 300 DPI) formats.'
      },
      {
        q: 'How many design revisions are included?',
        a: 'All design packages include 3 iterative review rounds to ensure the final assets perfectly match your brand vision.'
      }
    ]
  },
  {
    id: 'seo-optimization',
    slug: 'seo-optimization',
    aliases: ['seo'],
    icon: '🚀',
    image: '/images/blog/gtm_100.webp',
    title: 'On-Page SEO Optimization',
    tagline: 'Technical audits, semantic content hierarchy, and Core Web Vitals speed tuning.',
    desc: 'Data-driven on-page SEO strategies that systematically position your content at the top of organic search results. We combine technical audits, schema structured data, internal link mapping, and site speed optimization.',
    metaTitle: 'On-Page SEO Optimization & Technical Audits | Datta Sable',
    metaDesc: 'Professional On-Page SEO and technical optimization. Schema markup, keyword mapping, Core Web Vitals speed tuning, and internal linking strategies.',
    price: 'Starting at ₹10,000',
    deliveryTime: '3 - 7 Business Days',
    cta: 'Boost My Ranking',
    color: 'var(--accent2)',
    popular: false,
    features: [
      'Keyword research & search intent mapping',
      'Meta tags, headers & title structure tuning',
      'Content gap & competitive ranking analysis',
      'Automated Schema.org JSON-LD structured data',
      'Internal linking & authority distribution',
      'Core Web Vitals & page speed tuning'
    ],
    capabilities: [
      {
        title: 'Technical Crawl & Indexing Audit',
        desc: 'Identify and resolve canonical issues, 404 broken links, crawl budget waste, redirect chains, and XML sitemap configuration.'
      },
      {
        title: 'Schema.org JSON-LD Implementation',
        desc: 'Inject rich snippets for Articles, Products, FAQs, Organizations, and Breadcrumbs to dramatically improve search result CTR.'
      },
      {
        title: 'Content Semantic Architecture',
        desc: 'Restructure headings (H1-H4), improve keyword density without keyword stuffing, and align content with Google Helpful Content guidelines.'
      },
      {
        title: 'Core Web Vitals Optimization',
        desc: 'Eliminate Cumulative Layout Shift (CLS), minimize Largest Contentful Paint (LCP), and optimize Interaction to Next Paint (INP).'
      }
    ],
    technologies: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Next.js SEO', 'Schema.org', 'Lighthouse'],
    faqs: [
      {
        q: 'How long before we see ranking improvements?',
        a: 'Technical fixes (indexing, schema, speed) typically register with search engines within 1–3 weeks. Organic keyword movement generally compounds within 4–8 weeks.'
      },
      {
        q: 'Do you work on both WordPress and Next.js sites?',
        a: 'Yes, I implement technical SEO across Next.js dynamic routing, custom React codebases, as well as enterprise WordPress installations.'
      }
    ]
  },
  {
    id: 'technical-seo-audit',
    slug: 'technical-seo-audit',
    aliases: ['technical-seo', 'seo-audit'],
    icon: '⚡',
    image: '/images/blog/seo_tools_unique.webp',
    title: 'Technical SEO & Crawl Audits',
    tagline: 'Crawl architecture, indexing health, structured data schemas, and Core Web Vitals optimization.',
    desc: 'Comprehensive technical search audits to eliminate index bloat, fix canonical conflicts, configure rich Schema.org structured data, and tune Core Web Vitals for maximum crawl efficiency and organic search authority.',
    metaTitle: 'Technical SEO Audits & Site Architecture | Datta Sable',
    metaDesc: 'Enterprise technical SEO consulting and audits. Fix indexing issues, optimize crawl budget, implement JSON-LD Schema markup, and achieve green Core Web Vitals scores.',
    price: 'Starting at ₹15,000',
    deliveryTime: '3 - 5 Business Days',
    cta: 'Request Technical Audit',
    color: 'var(--accent)',
    popular: false,
    features: [
      'Full crawl audit (Screaming Frog, Search Console)',
      'Crawl budget optimization & index bloat removal',
      'Canonical tags, hreflang & redirect chain resolution',
      'JSON-LD Schema markup for rich Google snippets',
      'Core Web Vitals diagnostics (LCP, INP, CLS)',
      'Robots.txt, XML sitemaps & rendering audit'
    ],
    capabilities: [
      {
        title: 'Crawl Budget & Indexation Control',
        desc: 'Audit and eliminate non-indexable, thin, or duplicate URLs that waste search engine crawl allocation and dilute ranking signals.'
      },
      {
        title: 'Schema.org Structured Data Engineering',
        desc: 'Author and validate semantic JSON-LD models for Articles, Products, Organizations, and Breadcrumbs to capture Google rich results.'
      },
      {
        title: 'Core Web Vitals & Rendering Performance',
        desc: 'Debug client-side vs. server-side rendering bottlenecks to achieve sub-second LCP and excellent Interaction to Next Paint (INP).'
      },
      {
        title: 'JavaScript SEO & Framework Architecture',
        desc: 'Ensure dynamic React/Next.js routes, server components, and hydration cycles are effortlessly discoverable and parseable by Googlebot.'
      }
    ],
    technologies: ['Screaming Frog', 'Google Search Console', 'Ahrefs', 'Next.js 15', 'Lighthouse', 'Schema.org', 'Cloudflare'],
    faqs: [
      {
        q: 'What does a technical SEO audit deliver?',
        a: 'You receive an executive summary, prioritized issue backlog categorized by impact vs. effort, and direct code-level fixes or PRs ready for deployment.'
      },
      {
        q: 'Can you implement the technical fixes directly into our codebase?',
        a: 'Yes. As a full-stack engineer, I can directly implement the schema, meta tags, sitemaps, and speed optimizations into your Git repository.'
      },
      {
        q: 'How does technical SEO differ from content marketing?',
        a: 'Technical SEO ensures that search engines can discover, crawl, render, and index your pages without barriers. Without strong technical foundations, even exceptional content cannot rank.'
      }
    ]
  },
  {
    id: 'automation',
    slug: 'automation',
    aliases: ['automation-solutions'],
    icon: '⚙️',
    image: '/images/blog/python_automation_hero_1777410033671.webp',
    title: 'Automation Solutions',
    tagline: 'Eliminate manual spreadsheet busywork with Python ETL, VBA macros, and API pipelines.',
    desc: 'End-to-end automation pipelines that turn hours of tedious copy-pasting into scheduled, hands-off background processes. We build automated data extractors, scheduled email reports, and error-monitored workflows.',
    metaTitle: 'Business Process & Data Automation Solutions | Datta Sable',
    metaDesc: 'Python ETL pipelines, Excel VBA automation, scheduled reporting, and REST API integrations that run your business operations on autopilot.',
    price: 'Starting at ₹20,000',
    deliveryTime: '1 - 2 Weeks',
    cta: 'Automate My Reports',
    color: 'var(--accent3)',
    popular: false,
    features: [
      'Python ETL data transformation pipelines',
      'Advanced Excel VBA macros & management packs',
      'Scheduled email dispatch & alerts',
      'Third-party REST & SOAP API data sync',
      'Automated error monitoring & failover logs',
      'Detailed handover documentation & source code'
    ],
    capabilities: [
      {
        title: 'Python Batch Data Pipelines',
        desc: 'Automate pulling data from databases, CSV dumps, and cloud APIs, cleansing records, and storing them in BI-ready schemas.'
      },
      {
        title: 'Advanced Excel & VBA Automation',
        desc: 'One-click macro workbooks that ingest raw files, calculate variances, and format executive presentation sheets in seconds.'
      },
      {
        title: 'Scheduled Alert & Notification Systems',
        desc: 'Automated email alerts notifying managers of threshold breaches, failed transfers, or key operational milestones.'
      },
      {
        title: 'API Integrations & Webhooks',
        desc: 'Connect your CRM, payment processors, and ERP directly to your reporting database via automated webhook listeners.'
      }
    ],
    technologies: ['Python', 'Pandas', 'Excel VBA', 'FastAPI', 'Cron', 'PostgreSQL', 'Airflow/Prefect'],
    faqs: [
      {
        q: 'Can these scripts run on our internal company computers?',
        a: 'Yes, scripts can be packaged into executable files for local desktops or deployed to secure cloud servers / Task Scheduler.'
      },
      {
        q: 'What happens if a source file format changes?',
        a: 'Pipelines include defensive data validation that checks headers and column structures before processing, firing alerts if unexpected drift occurs.'
      }
    ]
  },
  {
    id: 'web-design',
    slug: 'web-design',
    aliases: ['ui-ux-design'],
    icon: '🎨',
    image: '/images/blog/surgical_ui_mastery.webp',
    title: 'Custom Web Design',
    tagline: 'Bespoke UI/UX design balancing aesthetic excellence with functional conversions.',
    desc: 'High-fidelity user interface and user experience design for web applications, SaaS dashboards, and marketing websites. Every design is crafted with pixel perfection, intuitive usability, and design system tokens.',
    metaTitle: 'Custom Web & UI/UX Design | Datta Sable',
    metaDesc: 'Custom UI/UX web design for enterprise applications and marketing platforms. High fidelity, design systems, mobile responsiveness, and conversion UX.',
    price: 'Starting at ₹25,000',
    deliveryTime: '1 - 3 Weeks',
    cta: 'Start Designing',
    color: 'var(--accent3)',
    popular: false,
    features: [
      'High-fidelity Figma & CorelDRAW UI/UX design',
      'Comprehensive design system & component library',
      'Responsive mobile, tablet & desktop wireframes',
      'Micro-animations & interactive prototypes',
      'Brand identity alignment & iconography',
      'Developer-ready asset export & style specs'
    ],
    capabilities: [
      {
        title: 'SaaS & Dashboard UI Systems',
        desc: 'Engineered information architecture for complex data portals, optimizing chart readability, density, and dark/light modes.'
      },
      {
        title: 'Conversion-Focused Landing Pages',
        desc: 'Structuring visual storytelling, proof points, and action hooks to guide prospects seamlessly toward checkout or enquiry.'
      },
      {
        title: 'Design System & Component Kits',
        desc: 'Reusable buttons, typography scales, cards, and modal components that ensure consistency as your platform expands.'
      },
      {
        title: 'Interactive Prototypes',
        desc: 'Clickable prototypes allowing stakeholders to test user flows and gather feedback before writing a single line of code.'
      }
    ],
    technologies: ['Figma', 'CorelDRAW', 'CSS Design Systems', 'Framer Motion Specs', 'Adobe XD'],
    faqs: [
      {
        q: 'Do you provide developer handoff files?',
        a: 'Yes, you receive complete Figma/Corel files with typography styles, color variables, spacing tokens, and exportable SVG assets.'
      },
      {
        q: 'Can you also develop the design into code?',
        a: 'Yes! I specialize in full-stack implementation, turning designs directly into production-grade Next.js or WordPress websites.'
      }
    ]
  },
  {
    id: 'fabric-architecture',
    slug: 'fabric-architecture',
    aliases: ['microsoft-fabric', 'fabric'],
    icon: '⚡',
    image: '/images/blog/microsoft-fabric-architecture-explained-2026.webp',
    title: 'Microsoft Fabric & Lakehouse Architecture',
    tagline: 'Enterprise Medallion architecture, OneLake unification, and DirectLake Power BI modeling.',
    desc: 'Consolidate fragmented analytics silos into a unified Microsoft Fabric tenant. We build scalable Bronze-Silver-Gold Lakehouses, real-time Eventstream ingestion, and sub-second DirectLake semantic models.',
    metaTitle: 'Microsoft Fabric & Lakehouse Architecture Consulting | Datta Sable',
    metaDesc: 'Enterprise Microsoft Fabric engineering. Medallion architecture, OneLake, DirectLake semantic modeling, PySpark pipelines, and real-time intelligence.',
    price: 'Starting at ₹35,000',
    deliveryTime: '2 - 4 Weeks',
    cta: 'Architect My Lakehouse',
    color: 'var(--accent)',
    popular: true,
    features: [
      'Bronze, Silver & Gold Medallion architecture',
      'OneLake delta table storage & shortcuts',
      'DirectLake Power BI semantic modeling',
      'Real-Time Intelligence & KQL eventstreams',
      'Azure Data Factory & Synapse pipeline migration',
      'Capacity sizing & CU cost governance'
    ],
    capabilities: [
      {
        title: 'Medallion Lakehouse Engineering',
        desc: 'Structuring raw data into cleansed Delta tables with ACID transactions, schema enforcement, and time-travel querying.'
      },
      {
        title: 'DirectLake Semantic Models',
        desc: 'Eliminating slow import refreshes and DirectQuery latency by querying OneLake Delta Parquet files directly at memory speeds.'
      },
      {
        title: 'Real-Time Intelligence & KQL',
        desc: 'Setting up Eventstreams, KQL databases, and automated Fabric Reflex alerts for instant anomaly detection.'
      },
      {
        title: 'Fabric Capacity Governance & Cost Control',
        desc: 'Analyzing Capacity Metrics App, mitigating throttling, and optimizing background job scheduling to minimize compute costs.'
      }
    ],
    technologies: ['Microsoft Fabric', 'OneLake', 'DirectLake', 'PySpark', 'KQL', 'Delta Lake', 'Power BI'],
    faqs: [
      {
        q: 'Why should we migrate our analytics stack to Microsoft Fabric?',
        a: 'Fabric consolidates data ingestion, transformation, data warehousing, lakehouses, real-time analytics, and Power BI into a unified SaaS experience with zero infrastructure management.'
      },
      {
        q: 'Can we connect existing AWS S3 or Google Cloud storage into Fabric?',
        a: 'Yes. OneLake Shortcuts allow you to virtualize external data in AWS S3 and ADLS Gen2 without copying or moving data.'
      }
    ]
  },
  {
    id: 'database-optimization',
    slug: 'database-optimization',
    aliases: ['sql-optimization', 'sql-tuning'],
    icon: '⚡',
    image: '/images/blog/Live SQL Tuning From 10 Minutes to 10 Seconds.webp',
    title: 'SQL & Database Performance Tuning',
    tagline: 'Execution plan auditing, indexing strategy, and sub-second query latency.',
    desc: 'Eliminate query timeouts, locking contention, and runaway cloud compute bills. We analyze execution plans, optimize index coverage, refactor complex joins, and tune database servers for high-throughput transactional and analytical workloads.',
    metaTitle: 'SQL & Database Performance Tuning Services | Datta Sable',
    metaDesc: 'Specialized SQL query optimization and database tuning for PostgreSQL, MySQL, and SQL Server. Execution plan audits, index strategies, and latency reduction.',
    price: 'Starting at ₹15,000',
    deliveryTime: '3 - 7 Business Days',
    cta: 'Optimize My Queries',
    color: 'var(--accent2)',
    popular: false,
    features: [
      'Query execution plan analysis & profiling',
      'Missing index & fragmentation tuning',
      'Stored procedure & CTE query refactoring',
      'Connection pooling & lock contention resolution',
      'Star-schema dimensional indexing',
      'Cloud compute & memory cost reduction'
    ],
    capabilities: [
      {
        title: 'Execution Plan Deep-Dives',
        desc: 'Identifying costly table scans, nested loop spills, and implicit conversions that slow down critical reporting queries.'
      },
      {
        title: 'Targeted Indexing Architecture',
        desc: 'Designing filtered, covering, and composite indexes that dramatically reduce I/O while eliminating redundant, bloated indexes.'
      },
      {
        title: 'Analytical Query Refactoring',
        desc: 'Rewriting inefficient correlated subqueries, window functions, and recursive CTEs into performant set-based operations.'
      },
      {
        title: 'Database Capacity & Cost Auditing',
        desc: 'Tuning buffer pools, query cache, and vacuum settings to allow existing database hardware to handle 3x–5x more concurrent load.'
      }
    ],
    technologies: ['PostgreSQL', 'SQL Server', 'MySQL', 'Execution Plans', 'pg_stat_statements', 'Query Profiler'],
    faqs: [
      {
        q: 'How much performance improvement can we expect?',
        a: 'Most unoptimized queries see a 70% to 95% reduction in execution time (often dropping from 30+ seconds down to under 500 milliseconds) following indexing and query refactoring.'
      },
      {
        q: 'Do you need direct production write access to tune queries?',
        a: 'No. I can review execution plans, schema DDL, and sanitized query logs on a staging replica or via screen share, ensuring zero production disruption.'
      }
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  const normalized = slug.toLowerCase();
  return servicesData.find(s => s.slug === normalized || s.id === normalized || s.aliases.includes(normalized));
}
