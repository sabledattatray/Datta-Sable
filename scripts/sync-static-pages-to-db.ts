import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Static datasets to pre-render JSX loops
const timeline = [
  { year: '2025—PRES', role: 'MIS MANAGER', company: 'DBS MINTEK PVT. LTD.', desc: 'Developing automated Power BI & SQL dashboards, reducing manual effort by 40% through Power Query.' },
  { year: '2023—2025', role: 'INFORMATION SYSTEM ANALYST', company: 'CASCO', desc: 'Analyzing business data to support decision-making via optimized MIS and SQL reporting systems.' },
  { year: '2020—2023', role: 'ASSISTANT MANAGER – MIS & ANALYTICS', company: 'KISSHT FINANCE LTD.', desc: 'Managed PAN-India risk portfolios and supervised 60+ callers with performance analytics and Excel dashboards.' },
  { year: '2015—2020', role: 'DEPUTY MANAGER', company: 'HDFC BANK LTD.', desc: 'Managed Credit Card Write-off & NPA portfolios for Mumbai region. Ensured strict audit compliance and slippage control.' },
];

const certifications = [
  { name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)', issuer: 'Microsoft', year: '2024' },
  { name: 'Microsoft Certified: Azure Data Engineer Associate (DP-203)', issuer: 'Microsoft', year: '2025' },
  { name: 'Tableau Desktop Certified Associate', issuer: 'Tableau Software', year: '2023' },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
];

const credentials = [
  { title: 'Generative AI for Marketers', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Generative AI for Digital Marketers.pdf' },
  { title: 'AI & The Public Sector', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_AI and the Future of the Public Sector.pdf' },
  { title: 'Google Analytics Specialist', issuer: 'Google Analytics', file: 'Google Analytics Certifiacte.pdf' },
  { title: 'Content Strategy Expert', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Content Strategy for Marketers.pdf' },
  { title: 'Digital Marketing Mastery', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Digital Marketing Tools Create a Marketing Campaign from Start to Finish.pdf' },
  { title: 'LinkedIn Marketing Pro', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Marketing on LinkedIn.pdf' },
];

const values = [
  { id: '01', title: 'Data Rigor', desc: 'No guessing, no shortcuts. Every number is cross-verified, and every query plan is optimized for production-grade reliability.', color: 'var(--accent)', icon: '🛡️' },
  { id: '02', title: 'Actionable Insights', desc: 'A dashboard is useless if it does not drive decisions. I design backward from stakeholder questions to ensure natural adoption.', color: '#00C9F2', icon: '🎯' },
  { id: '03', title: 'Absolute Transparency', desc: 'All code, logic, and query structures are fully documented so your internal team can operate and adapt the system.', color: 'var(--accent3)', icon: '🔑' }
];

const skills = [
  { name: 'Tableau', pct: 95, category: 'BI Tools', icon: '📊' },
  { name: 'Power BI', pct: 90, category: 'BI Tools', icon: '📊' },
  { name: 'SQL', pct: 85, category: 'Programming', icon: '💻' },
  { name: 'Python', pct: 80, category: 'Programming', icon: '💻' }
];

const services = [
  { icon: '📊', title: 'Dashboard Development', id: 'dashboards', desc: 'Custom, interactive dashboards in Tableau and Power BI that give your team real-time visibility into what matters most.', features: ['KPI tracking & monitoring', 'Drill-down & filter capabilities', 'Cross-platform compatibility', 'Automated data refresh', 'Executive-ready design', 'Mobile responsive'], price: 'Starting at ₹15,000', cta: 'Get a Dashboard', color: 'var(--accent)', popular: false },
  { icon: '🔬', title: 'Data Analytics Consulting', id: 'consulting', desc: 'End-to-end analytics strategy — from data audit to insight delivery. I help you understand your data and act on it.', features: ['Data audit & gap analysis', 'KPI framework design', 'SQL query optimization', 'Predictive modeling basics', 'Insight reporting', 'Team upskilling sessions'], price: 'Starting at ₹25,000', cta: 'Book a Consultation', color: 'var(--accent2)', popular: true },
  { icon: '🚀', title: 'On-Page SEO Optimization', id: 'seo-optimization', desc: 'Technical SEO audits and on-page optimization strategies that align your content with search engine algorithms for maximum visibility.', features: ['Keyword research & mapping', 'Meta tags & header optimization', 'Content gap analysis', 'Internal linking strategy', 'Image alt-text & compression', 'Core Web Vitals tuning'], price: 'Starting at ₹10,000', cta: 'Boost My Ranking', color: 'var(--accent2)', popular: false },
  { icon: '🎨', title: 'Custom Web Design', id: 'web-design', desc: 'Bespoke, high-fidelity UI/UX designs that balance aesthetic excellence with functional performance for a premium digital presence.', features: ['High-fidelity UI/UX design', 'CorelDRAW Asset Creation', 'Responsive & adaptive layouts', 'Custom iconography', 'Brand identity integration', 'Performance-first architecture'], price: 'Starting at ₹25,000', cta: 'Start Designing', color: 'var(--accent3)', popular: false },
  { icon: '🔗', title: 'n8n Workflow Automation', id: 'n8n-automation', desc: 'Self-hosted and scalable workflow automation using n8n to connect your entire toolstack and eliminate manual data silos.', features: ['Custom n8n nodes & triggers', 'Multi-app workflow design', 'Self-hosted setup & security', 'Error handling & retry logic', 'API & Webhook integration', 'Data synchronization & cleanup'], price: 'Starting at ₹15,000', cta: 'Connect My Stack', color: 'var(--accent)', popular: false },
  { icon: '✒️', title: 'Professional Graphic Design', id: 'graphic-design', desc: 'Expert vector design and branding solutions powered by CorelDRAW, delivering high-impact visual communication for print and digital media.', features: ['Vector logo design', 'Brand identity development', 'Print-ready marketing assets', 'Custom typography & layouts', 'Icon set creation', 'File conversion & vectorization'], price: 'Starting at ₹5,000', cta: 'Get a Quote', color: 'var(--accent2)', popular: false }
];

const serviceFaqs = [
  { q: 'What tools do you use for dashboards?', a: 'I primarily use Tableau and Power BI, connecting to SQL, Excel, and APIs. Tool choice depends on your existing tech stack.' },
  { q: 'How long does a typical project take?', a: 'Standard projects take 1–2 weeks. Complex pipelines or enterprise platforms take 3–6 weeks. I provide detailed milestones upfront.' },
  { q: 'Do you offer ongoing support?', a: 'Yes. I offer monthly maintenance packages for data updates and feature additions, starting at ₹5,000/month.' },
  { q: 'Can you work with our data infrastructure?', a: 'Absolutely. I integrate with AWS, Azure, GCP, Salesforce, SAP, and most modern databases via custom ETL pipelines.' },
  { q: 'How do you ensure data accuracy?', a: 'I implement automated validation checks at every ETL stage, with error logging and instant alerts to prevent data drift.' },
];

const trustBadges = [
  { label: 'Microsoft Certified', icon: '🏆' },
  { label: 'Tableau Specialist', icon: '📊' },
  { label: 'Google Analytics Certified', icon: '🔍' },
  { label: '50+ Projects Delivered', icon: '✅' },
  { label: '5★ Average Rating', icon: '⭐' },
  { label: 'NDA Protected', icon: '🔒' },
];

const faqs = [
  { q: "What Business Intelligence tools do you specialize in?", a: "I specialize in the full Microsoft BI stack — Power BI, Power Query, DAX, SQL Server, and SSRS — as well as Tableau Desktop and Advanced Excel automation using VBA and Power Query. For data engineering tasks I work with Python (pandas, SQLAlchemy, Prefect) and for cloud deployments, Azure Data Factory and AWS S3." },
  { q: "Do you handle custom data automation projects?", a: "Yes, automation is a core service. I build Python and SQL-based ETL pipelines that replace manual data exports, scheduled email report generation using SMTP automation, Excel-to-dashboard pipelines with Power Query, and API integrations to pull live data from external platforms." },
  { q: "Can you optimize existing slow Power BI reports?", a: "Absolutely. Slow Power BI reports are almost always caused by inefficient DAX measures that calculate at the row-level instead of the filter context, a star-schema data model that hasn't been properly normalized, or DirectQuery connections pulling from unindexed tables." },
  { q: "Do you provide MIS reporting services for Finance and Operations?", a: "Yes, MIS reporting is one of my primary specializations. Over 10 years I have built automated MIS dashboards for banking (NPA tracking, collection efficiency, portfolio risk), telecom (churn analysis, revenue per circle), and manufacturing." }
];

const paths = [
  {
    title: "Data Architecture & Infrastructure",
    desc: "Learn how to build the foundation of a modern data stack that scales with your enterprise.",
    color: "var(--accent)",
    links: [
      { name: "The 2026 Modern Data Stack", href: "/blog/modern-bi-stack-2026" },
      { name: "PostgreSQL vs Snowflake Benchmarks", href: "/blog/postgres-vs-snowflake-speed" },
    ]
  },
  {
    title: "Advanced BI & Visualization",
    desc: "Master the art of high-stakes executive reporting using industry-leading tools.",
    color: "var(--accent)",
    links: [
      { name: "Mastering Tableau LOD Expressions", href: "/blog/tableau-lods-tutorial" },
      { name: "7 UX Principles for Dashboards", href: "/blog/dashboard-ux-principles" },
      { name: "Power BI Performance Tuning", href: "/blog/bi-performance-tuning" },
    ]
  },
  {
    title: "Automation & Intelligence",
    desc: "Leverage Python and AI to automate the mundane and focus on strategic insights.",
    color: "var(--accent)",
    links: [
      { name: "Building Pipelines with Python & Prefect", href: "/blog/python-automation-pipelines" },
      { name: "Integrating GenAI into Tableau", href: "/blog/generative-ai-bi-dashboards" },
      { name: "Building a BI Scraper with Selenium", href: "/blog/python-selenium-bi-scraper" },
    ]
  }
];

const infraSections = [
  { title: 'Automation Systems', description: 'Autonomous workflows that handle everything from data collection to final publishing.', icon: '⚡', link: '/chains' },
  { title: 'AI Content Pipelines', description: 'Modular pipelines for high-fidelity technical writing and asset generation.', icon: '📚', link: '/templates' },
  { title: 'Execution Chains', description: 'Serialized logic structures for repeatable business and technical outcomes.', icon: '🌿', link: '/knowledge/architecture' }
];

const projects = [
  { title: 'Blinkit Sales Analysis Dashboard', category: 'Dashboard', description: 'Interactive sales and operations analysis dashboard resolving data freshness bottlenecks.', image: '/images/blog/bi_performance_hero_1777410226286.webp', liveUrl: '/dashboards/blinkit-sales', githubUrl: '#' },
  { title: 'Collection Intelligence Suite', category: 'Analysis', description: 'Enterprise collections performance tracking framework with deep telemetry logs.', image: '/images/blog/postgres_snowflake_1777410225102.webp', liveUrl: '/dashboards/collection-intelligence', githubUrl: '#' }
];

const jobs = [
  { title: "Field Collection Officer", department: "Operations", location: "Mumbai & Nearby Areas", salary: "₹18,000 - ₹25,000 + Incentives", experience: "Freshers & Experienced", description: "Responsible for field collection of outstanding payments from clients in assigned territories." },
  { title: "Collection Team Leader", department: "Operations", location: "Mumbai", salary: "₹30,000 - ₹45,000 + Incentives", experience: "2+ Years Experience", description: "Supervise collection executives, audit calling quality, and control slippage ratios." }
];

// Helper to convert React JSX styles to standard HTML inline styles
function convertStyleObject(jsx: string): string {
  return jsx.replace(/style=\{\{\s*([\s\S]*?)\s*\}\}/g, (match, styleBody) => {
    try {
      const declarations = styleBody.split(',').map((decl: string) => {
        const parts = decl.split(':');
        if (parts.length < 2) return '';
        const key = parts[0].trim()
          .replace(/([A-Z])/g, '-$1').toLowerCase(); // camelCase to kebab-case
        const val = parts.slice(1).join(':').trim()
          .replace(/^['"`]/, '').replace(/['"`]$/, ''); // strip quotes
        return `${key}: ${val};`;
      }).filter(Boolean).join(' ');
      return `style="${declarations}"`;
    } catch (e) {
      return '';
    }
  });
}

// Helper to clean JSX code into valid, styled HTML
function cleanJsxToHtml(jsx: string, slug: string): string {
  let html = jsx;

  // Replace className
  html = html.replace(/className=/g, 'class=');

  // Convert style objects to standard HTML inline styles
  html = convertStyleObject(html);

  // Replace Next.js Links
  html = html.replace(/<Link\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/Link>/gi, '<a href="$1">$2</a>');
  html = html.replace(/<Link\s+[^>]*href=\{\s*["']([^"']*)["']\s*\}[^>]*>([\s\S]*?)<\/Link>/gi, '<a href="$1">$2</a>');
  html = html.replace(/<\/Link>/gi, '</a>');

  // Replace Next.js Images
  html = html.replace(/<Image\s+[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/>/gi, '<img src="$1" alt="$2" />');
  html = html.replace(/<Image\s+[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '<img src="$1" alt="$2" />');
  html = html.replace(/<Image\s+([^>]+)\/>/gi, '<img $1 />');

  // Convert motion tags to standard tags
  html = html.replace(/<motion\.div[^>]*>/gi, '<div>');
  html = html.replace(/<\/motion\.div>/gi, '</div>');
  html = html.replace(/<motion\.section[^>]*>/gi, '<section>');
  html = html.replace(/<\/motion\.section>/gi, '</section>');
  html = html.replace(/<motion\.h1[^>]*>/gi, '<h1>');
  html = html.replace(/<\/motion\.h1>/gi, '</h1>');
  html = html.replace(/<motion\.p[^>]*>/gi, '<p>');
  html = html.replace(/<\/motion\.p>/gi, '</p>');
  html = html.replace(/<AnimatePresence[^>]*>/gi, '');
  html = html.replace(/<\/AnimatePresence>/gi, '');

  // Strip React-specific components
  html = html.replace(/<Navbar\s*\/>/gi, '');
  html = html.replace(/<Footer\s*\/>/gi, '');
  html = html.replace(/<Crosshair[^>]*\/>/gi, '');

  // Replace Lucide icons with matching emojis
  html = html.replace(/<ShieldCheck[^>]*\/>/gi, '🛡️');
  html = html.replace(/<HelpCircle[^>]*\/>/gi, '❓');
  html = html.replace(/<Briefcase[^>]*\/>/gi, '💼');
  html = html.replace(/<BookOpen[^>]*\/>/gi, '📖');
  html = html.replace(/<Target[^>]*\/>/gi, '🎯');
  html = html.replace(/<Zap[^>]*\/>/gi, '⚡');
  html = html.replace(/<BarChart3[^>]*\/>/gi, '📊');
  html = html.replace(/<Database[^>]*\/>/gi, '🗄️');
  html = html.replace(/<BrainCircuit[^>]*\/>/gi, '🧠');
  html = html.replace(/<ArrowRight[^>]*\/>/gi, '➔');
  html = html.replace(/<ExternalLink[^>]*\/>/gi, '🔗');
  html = html.replace(/<GitBranch[^>]*\/>/gi, '🌿');
  html = html.replace(/<Code2[^>]*\/>/gi, '💻');
  html = html.replace(/<Share2[^>]*\/>/gi, '📤');
  html = html.replace(/<Download[^>]*\/>/gi, '📥');
  html = html.replace(/<Workflow[^>]*\/>/gi, '⚙️');
  html = html.replace(/<ChevronRight[^>]*\/>/gi, '›');
  html = html.replace(/<Phone[^>]*\/>/gi, '📞');
  html = html.replace(/<MapPin[^>]*\/>/gi, '📍');
  html = html.replace(/<DollarSign[^>]*\/>/gi, '💵');
  html = html.replace(/<Calendar[^>]*\/>/gi, '📅');
  html = html.replace(/<Search[^>]*\/>/gi, '🔍');
  html = html.replace(/<CheckCircle2[^>]*\/>/gi, '✅');
  html = html.replace(/<CheckCircle[^>]*\/>/gi, '✅');
  html = html.replace(/<AlertCircle[^>]*\/>/gi, '⚠️');
  html = html.replace(/<Shield[^>]*\/>/gi, '🛡️');
  html = html.replace(/<Award[^>]*\/>/gi, '🏆');

  // Strip JSX comments
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // HTML entity escapes
  html = html.replace(/&apos;/g, "'");
  html = html.replace(/&quot;/g, '"');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');

  // Specific variables formatting
  if (slug === 'privacy') {
    html = html.replace(/\{lastUpdated\}/g, 'June 25, 2026');
  } else if (slug === 'terms') {
    html = html.replace(/\{lastUpdated\}/g, 'April 29, 2026');
  } else if (slug === 'disclaimer') {
    html = html.replace(/\{lastUpdated\}/g, 'April 30, 2026');
  }

  return html.trim();
}

const pagesConfig = [
  { slug: 'about', filePath: 'components/AboutContent.tsx', title: 'About Datta Sable', excerpt: 'Senior BI Developer & Data Architect specialized in Tableau, Power BI, SQL, and Python.' },
  { slug: 'services', filePath: 'components/ServicesContent.tsx', title: 'Professional BI & Data Analytics Services', excerpt: 'Enterprise-grade Dashboard Development, SQL Automation, Python Data Engineering, and SEO Optimization.' },
  { slug: 'careers', filePath: 'app/careers/CareersContent.tsx', title: 'Urgent Hiring Collection Officers & Team Leaders | Datta Sable Careers', excerpt: 'Apply for Collection Officer and Collection Team Leader jobs. Freshers welcome. 10th pass eligible.' },
  { slug: 'contact', filePath: 'app/contact/ContactPageClient.tsx', title: 'Contact Datta Sable | BI Consulting & Data Analytics', excerpt: 'Get in touch with Datta Sable — Business Intelligence expert available for dashboard development, data analytics consulting, SQL automation, and Python ETL projects.' },
  { slug: 'privacy', filePath: 'app/privacy/page.tsx', title: 'Privacy Policy | Datta Sable', excerpt: 'Privacy Policy for dattasable.com — data collection, usage, and protection practices.' },
  { slug: 'terms', filePath: 'app/terms/page.tsx', title: 'Terms of Service | Datta Sable', excerpt: 'Terms of Service for dattasable.com.' },
  { slug: 'cookies', filePath: 'app/cookies/page.tsx', title: 'Cookie Policy | Datta Sable', excerpt: 'Cookie Policy for dattasable.com.' },
  { slug: 'disclaimer', filePath: 'app/disclaimer/page.tsx', title: 'Disclaimer | Datta Sable', excerpt: 'Legal disclaimer for dattasable.com.' },
  { slug: 'editorial-policy', filePath: 'app/editorial-policy/page.tsx', title: 'Editorial Policy, AI Disclosure & Research Standards | Datta Sable', excerpt: 'Learn about our editorial standards, AI content disclosure, fact-checking process, research methodology, and testing protocols.' },
  { slug: 'faq', filePath: 'app/faq/FAQClientPage.tsx', title: 'Frequently Asked Questions (FAQ) | Datta Sable', excerpt: 'Answers to common questions about Business Intelligence services, Power BI optimization, SQL automation, and timelines.' },
  { slug: 'portfolio', filePath: 'app/portfolio/PortfolioClientPage.tsx', title: 'Portfolio & Case Studies | Datta Sable', excerpt: 'Explore successful BI projects, custom data engineering frameworks, Tableau/Power BI dashboards, and technical automation.' },
  { slug: 'infrastructure', filePath: 'app/infrastructure/page.tsx', title: 'Creator Infrastructure Hub | Surgical AI Systems | Datta Sable', excerpt: 'The definitive hub for automation systems, AI content pipelines, and execution chains.' },
  { slug: 'start-here', filePath: 'app/start-here/page.tsx', title: 'Start Your Data Journey | BI & Analytics Knowledge Hub | Datta Sable', excerpt: 'A structured learning pathway from data fundamentals to advanced enterprise orchestration.' }
];

async function main() {
  console.log('Starting static pages synchronization to database...');

  for (const page of pagesConfig) {
    const fullPath = path.resolve(process.cwd(), page.filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}, skipping...`);
      continue;
    }

    console.log(`Processing slug: ${page.slug} from ${page.filePath}`);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    
    let returnIndex = -1;
    if (page.slug === 'portfolio') {
      const contentIndex = fileContent.indexOf('function PortfolioContent');
      if (contentIndex !== -1) {
        returnIndex = fileContent.indexOf('return (', contentIndex);
      }
    } else {
      const exportDefaultIndex = fileContent.indexOf('export default');
      if (exportDefaultIndex !== -1) {
        returnIndex = fileContent.indexOf('return (', exportDefaultIndex);
      }
    }

    if (returnIndex === -1) {
      returnIndex = fileContent.indexOf('return (');
    }

    if (returnIndex === -1) {
      console.warn(`Could not find return statement for ${page.slug}, skipping...`);
      continue;
    }

    const startIndex = returnIndex + 8;
    let bracketCount = 1;
    let endIndex = startIndex;
    
    while (bracketCount > 0 && endIndex < fileContent.length) {
      const char = fileContent[endIndex];
      if (char === '(') {
        bracketCount++;
      } else if (char === ')') {
        bracketCount--;
      }
      endIndex++;
    }
    
    const jsx = fileContent.slice(startIndex, endIndex - 1);
    let html = cleanJsxToHtml(jsx, page.slug);

    // Dynamic Maps pre-rendering compilations
    if (page.slug === 'about') {
      const timelineHtml = timeline.map(t => `
        <div style="margin-bottom: 2rem; position: relative;">
          <div style="position: absolute; left: -3rem; top: 0; bottom: 0; width: 1px; background: var(--border);"></div>
          <div class="mono" style="font-size: 11px; color: var(--accent); margin-bottom: 0.5rem;">[${t.year}]</div>
          <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem; letter-spacing: 0.05em; color: var(--text);">${t.role}</h3>
          <div style="color: var(--muted); font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem;">${t.company}</div>
          <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.7; max-width: 500px;">${t.desc}</p>
        </div>
      `).join('');
      
      const certsHtml = certifications.map(c => `
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--accent); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; position: relative;">
          <div style="position: absolute; top: 1rem; right: 1rem; padding: 4px 10px; background: var(--surface2); font-size: 10px; color: var(--muted); border-radius: 4px;">${c.year}</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text); margin-bottom: 4px;">${c.name}</div>
          <div style="font-size: 0.85rem; color: var(--muted);">${c.issuer}</div>
        </div>
      `).join('');

      const credentialsHtml = credentials.map(c => `
        <div class="card-precision" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); display: flex; flex-direction: column; justify-content: space-between; min-height: 180px; margin-bottom: 1rem;">
          <div>
            <span class="mono" style="font-size: 10px; color: var(--accent); display: block; margin-bottom: 0.5rem;">// ${c.issuer.toUpperCase()}</span>
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; line-height: 1.3; color: var(--text);">${c.title}</h3>
          </div>
          <a href="/certs/${c.file}" target="_blank" class="btn-outline" style="font-size: 11px; padding: 0.6rem 1.2rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; width: fit-content; border: 1px solid var(--border); color: var(--text); background: transparent;">
            📥 VIEW_VERIFICATION
          </a>
        </div>
      `).join('');

      const valuesHtml = values.map((v, i) => `
        <div style="padding: 3rem; border-right: ${i < 2 ? '1px solid var(--border)' : 'none'}; border-bottom: 1px solid var(--border); background: ${i === 1 ? 'var(--surface2)' : 'transparent'};">
          <div class="mono" style="font-size: 12px; color: ${v.color}; margin-bottom: 1.5rem;">${v.id} //</div>
          <div style="color: ${v.color}; margin-bottom: 1.5rem; font-size: 1.5rem;">${v.icon}</div>
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem; letter-spacing: 0.1em; color: var(--text);">${v.title}</h3>
          <p style="color: var(--muted); font-size: 0.9rem; line-height: 1.7;">${v.desc}</p>
        </div>
      `).join('');

      const skillsHtml = skills.map(s => `
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span>${s.icon}</span>
              <span class="mono" style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: var(--text);">${s.name.toUpperCase()}</span>
            </div>
            <span class="mono" style="font-size: 10px; color: var(--muted);">${s.pct}%</span>
          </div>
          <div style="height: 4px; background: var(--surface2); position: relative; border: 1px solid var(--border);">
            <div style="height: 100%; background: var(--accent); width: ${s.pct}%;"></div>
          </div>
        </div>
      `).join('');

      html = html.replace(/\{timeline\.map\([\s\S]*?\)\}/g, timelineHtml);
      html = html.replace(/\{certifications\.map\([\s\S]*?\)\}/g, certsHtml);
      html = html.replace(/\{\s*\[\s*\{\s*title:\s*'Generative AI[\s\S]*?\}\s*\]\s*\.map\([\s\S]*?\)\}/g, credentialsHtml);
      html = html.replace(/\{values\.map\([\s\S]*?\)\}/g, valuesHtml);
      html = html.replace(/\{skills\.map\([\s\S]*?\)\}/g, skillsHtml);
    } else if (page.slug === 'services') {
      const servicesCardsHtml = services.map(s => `
        <div class="card" id="${s.id}" style="padding: 2.5rem; border-left: 2px solid ${s.color}; display: flex; flex-direction: column; height: 100%; background: var(--surface); border: 1px solid var(--border); border-left: 2px solid ${s.color}; position: relative; margin-bottom: 1.5rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">${s.icon}</div>
          <h3 style="font-size: 1.5rem; font-weight: 600; color: var(--text); margin-bottom: 1rem;">${s.title}</h3>
          <p style="color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">${s.desc}</p>
          <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.5rem;">
            ${s.features.map(f => `<li style="font-size: 0.85rem; color: var(--muted);">✓ ${f}</li>`).join('')}
          </ul>
          <div style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 1.25rem;">
            <div class="mono" style="color: ${s.color}; font-weight: 700; font-size: 1rem; margin-bottom: 1rem;">${s.price}</div>
            <a href="/contact" style="background: ${s.popular ? `linear-gradient(135deg, ${s.color}, var(--accent2))` : 'transparent'}; color: ${s.popular ? '#000' : s.color}; border: ${s.popular ? 'none' : `1px solid ${s.color}`}; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; py: 1rem; font-weight: 600; font-size: 0.85rem; border-radius: 4px; padding: 0.75rem 0;">
              ${s.cta} ➔
            </a>
          </div>
        </div>
      `).join('');

      const faqsListHtml = serviceFaqs.map(f => `
        <div style="border-bottom: 1px solid var(--border); padding: 1.25rem 0;">
          <h4 style="font-size: 1rem; color: var(--text); font-weight: 600; margin-bottom: 0.5rem;">${f.q}</h4>
          <p style="color: var(--muted); font-size: 0.9rem; line-height: 1.6;">${f.a}</p>
        </div>
      `).join('');

      const badgesHtml = trustBadges.map(b => `
        <div class="card flex items-center gap-2" style="border-radius: 4px; border: 1px solid var(--border); padding: 0.5rem 1.25rem; font-size: 0.875rem; color: var(--muted); display: inline-flex; align-items: center; gap: 0.5rem;">
          <span>${b.icon}</span> ${b.label}
        </div>
      `).join('');

      html = html.replace(/\{services\.map\([\s\S]*?\)\}/g, `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">${servicesCardsHtml}</div>`);
      html = html.replace(/\{faqs\.map\([\s\S]*?\)\}/g, faqsListHtml);
      html = html.replace(/\{trustBadges\.map\([\s\S]*?\)\}/g, `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">${badgesHtml}</div>`);
    } else if (page.slug === 'faq') {
      const faqItemsHtml = faqs.map(faq => `
        <div style="border-bottom: 1px solid var(--border); padding: 1.5rem 0;">
          <h3 style="font-size: 1.1rem; color: var(--text); font-weight: 600; margin-bottom: 0.5rem;">${faq.q}</h3>
          <p style="color: var(--muted); line-height: 1.75; font-size: 0.95rem;">${faq.a}</p>
        </div>
      `).join('');
      html = html.replace(/\{faqs\.map\([\s\S]*?\)\}/g, faqItemsHtml);
    } else if (page.slug === 'start-here') {
      const pathsHtml = paths.map(p => `
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">🔑 ${p.title}</h3>
          <p style="color: var(--muted); margin-bottom: 1.5rem; font-size: 0.95rem;">${p.desc}</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            ${p.links.map(l => `
              <li>
                <a href="${l.href}" style="color: var(--accent); text-decoration: none; font-weight: 500;">
                  ${l.name} ➔
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('');
      html = html.replace(/\{paths\.map\([\s\S]*?\)\}/g, `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem;">${pathsHtml}</div>`);
    } else if (page.slug === 'infrastructure') {
      const sectionsHtml = infraSections.map(s => `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="font-size: 1.5rem; margin-bottom: 1rem;">${s.icon}</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text); margin-bottom: 0.75rem;">${s.title}</h3>
            <p style="color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">${s.description}</p>
          </div>
          <a href="${s.link}" style="color: var(--accent); font-weight: 600; text-decoration: none;">Explore Hub ➔</a>
        </div>
      `).join('');
      html = html.replace(/\{INFRA_SECTIONS\.map\([\s\S]*?\)\}/g, `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem;">${sectionsHtml}</div>`);
    } else if (page.slug === 'portfolio') {
      const projectsHtml = projects.map(p => `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; margin-bottom: 1rem;">
          <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 160px; object-fit: cover;" />
          <div style="padding: 1.5rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">${p.category}</span>
            <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text); margin-top: 0.5rem; margin-bottom: 0.75rem;">${p.title}</h3>
            <p style="color: var(--muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem;">${p.description}</p>
            <a href="${p.liveUrl}" style="color: var(--accent); font-weight: 600; text-decoration: none; font-size: 0.85rem;">Live Demo ➔</a>
          </div>
        </div>
      `).join('');
      html = html.replace(/\{filtered\.map\([\s\S]*?\)\}/g, `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">${projectsHtml}</div>`);
      html = html.replace(/<AnimatePresence>[\s\S]*?<\/AnimatePresence>/g, `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">${projectsHtml}</div>`);
    } else if (page.slug === 'careers') {
      const jobsHtml = jobs.map(j => `
        <div style="background: var(--surface2); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
          <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text);">${j.title}</h3>
          <p style="font-size: 0.85rem; color: var(--accent); margin: 0.25rem 0;">💼 ${j.department} | 📍 ${j.location} | 💵 ${j.salary}</p>
          <p style="color: var(--muted); font-size: 0.9rem; margin-top: 0.75rem;">${j.description}</p>
        </div>
      `).join('');
      html = html.replace(/\{jobs\.map\([\s\S]*?\)\}/g, `<div>${jobsHtml}</div>`);
      html = html.replace(/<form[\s\S]*?<\/form>/g, '<div style="background: var(--surface); padding: 2rem; border-radius: 8px; text-align: center; border: 1px dashed var(--border);"><h3>Apply Online</h3><p style="color: var(--muted);">Please submit your CV and cover letter directly to our careers portal or contact email.</p></div>');
    } else if (page.slug === 'contact') {
      html = html.replace(/<form[\s\S]*?<\/form>/g, '<div style="background: var(--surface); padding: 2rem; border-radius: 8px; border: 1px dashed var(--border);"><h3 style="margin-bottom: 1rem;">Direct Contact Channels</h3><p>📩 Email: <strong>contact@dattasable.com</strong></p><p>📞 Mobile: <strong>+91 99999 99999</strong></p><p style="color: var(--muted); margin-top: 1rem; font-size: 0.85rem;">Send a detailed project description to receive a free consultation and customized quote within 24 hours.</p></div>');
    }

    // Upsert into database
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        excerpt: page.excerpt,
        content: html,
        published: true
      },
      create: {
        slug: page.slug,
        title: page.title,
        excerpt: page.excerpt,
        content: html,
        published: true
      }
    });

    console.log(`✓ Synchronized ${page.slug} successfully. (${html.length} chars)`);
  }

  console.log('Database synchronization completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during synchronization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
