import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Layers,
  BarChart3,
  Database,
  Cpu,
  Workflow,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  BookOpen,
  Target,
  Zap,
  Clock,
  Terminal,
  HelpCircle,
  Award,
} from 'lucide-react';
import styles from './StartHerePage.module.css';

export const metadata: Metadata = {
  title: 'Start Your Data Journey — Curated Pathways & Knowledge Hub | Datta Sable',
  description:
    'A structured, battle-tested learning pathway from BI and SQL fundamentals to Microsoft Fabric lakehouses, high-performance DAX, and autonomous AI pipelines.',
  openGraph: {
    title: 'Start Your Data Journey — Curated Pathways & Knowledge Hub | Datta Sable',
    description:
      'A structured, battle-tested learning pathway from BI and SQL fundamentals to Microsoft Fabric lakehouses, high-performance DAX, and autonomous AI pipelines.',
    url: 'https://dattasable.com/start-here',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Start Your Data Journey — Datta Sable' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start Your Data Journey — Curated Pathways & Knowledge Hub | Datta Sable',
    description:
      'A structured, battle-tested learning pathway from BI and SQL fundamentals to Microsoft Fabric lakehouses, high-performance DAX, and autonomous AI pipelines.',
    images: ['/images/dattasable.com.webp'],
  },
  alternates: { canonical: 'https://dattasable.com/start-here' },
};

const tracks = [
  {
    id: 'track-fabric',
    number: '01',
    level: 'FOUNDATION TO CLOUD ARCHITECT',
    title: 'Microsoft Fabric & Modern Lakehouse Architecture',
    desc: 'Build a practical understanding of OneLake, lakehouses, medallion layers, and semantic models. Follow the path from platform architecture to certification planning.',
    cert: 'DP-600 & DP-700 FOCUS',
    icon: Layers,
    modules: [
      { name: '1. Microsoft Fabric Architecture Explained', href: '/blog/microsoft-fabric-architecture-explained-2026' },
      { name: '2. OneLake Architecture & Unified Storage Guide', href: '/blog/microsoft-fabric-onelake-architecture-guide' },
      { name: '3. Medallion Architecture (Bronze, Silver, Gold)', href: '/blog/microsoft-fabric-medallion-architecture-guide' },
      { name: '4. Fabric Warehouse vs. Lakehouse Internal Mechanics', href: '/blog/microsoft-fabric-warehouse-explained-2026' },
      { name: '5. PL-300 vs DP-600 vs DP-700 Certification Guide', href: '/blog/pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026' },
    ],
    skills: ['OneLake', 'Direct Lake', 'TMDL', 'Delta Parquet', 'PySpark', 'Purview'],
  },
  {
    id: 'track-bi',
    number: '02',
    level: 'ANALYST TO PRINCIPAL BI ARCHITECT',
    title: 'Advanced Power BI & Executive Cockpit Design',
    desc: 'Connect data modeling, DAX, and dashboard UX to create clearer reporting experiences. Explore the principles behind measures, navigation, and executive decision support.',
    cert: 'PL-300 & ENTERPRISE BI',
    icon: BarChart3,
    modules: [
      { name: '1. Psychology of High-Fidelity Dashboard Design', href: '/blog/psychology-of-high-fidelity-dashboard-design' },
      { name: '2. The Surgical Cockpit: BI UX Engineering', href: '/blog/the-surgical-cockpit-bi-ux-design' },
      { name: '3. 7 Core Dashboard UX Principles for Leaders', href: '/blog/dashboard-ux-principles' },
      { name: '4. How Strategic MIS Reports Drive C-Suite Decisions', href: '/blog/how-mis-reports-drive-business-decisions' },
      { name: '5. Mastering Surgical UI Dashboard Engineering', href: '/blog/mastering-surgical-ui-dashboard-engineering' },
    ],
    skills: ['Advanced DAX', 'VertiPaq Engine', 'Star Schema', 'RLS/OLS', 'Cognitive UX'],
  },
  {
    id: 'track-sql',
    number: '03',
    level: 'DATABASE & PLATFORM OPTIMIZATION',
    title: 'SQL Performance & High-Throughput Engineering',
    desc: 'Explore query execution, data validation, and reporting architecture. Work through patterns for diagnosing bottlenecks and building trustworthy analytics pipelines.',
    cert: 'DATABASE ARCHITECTURE',
    icon: Database,
    modules: [
      { name: '1. Building a Zero-Trust Data Quality Framework', href: '/blog/data-quality-frameworks' },
      { name: '2. The 2026 Modern BI & Data Infrastructure Stack', href: '/blog/modern-bi-stack-2026' },
      { name: '3. Building an Enterprise Analytics War Room', href: '/blog/building-analytics-war-room' },
      { name: '4. Financial BI Impact & Revenue Integrity Audits', href: '/blog/financial-bi-impact' },
    ],
    skills: ['Columnstore Indexing', 'Execution Plans', 'Data Quality', 'Schema Validation', 'Batch Mode'],
  },
  {
    id: 'track-ai',
    number: '04',
    level: 'AUTOMATION & AGENTIC SYSTEMS',
    title: 'Autonomous AI Workflows & Production Orchestration',
    desc: 'Design workflows with clear triggers, tool boundaries, validation, and observability. Explore modular automation and agent orchestration through practical guides.',
    cert: 'AGENTIC AI SYSTEMS',
    icon: Workflow,
    modules: [
      { name: '1. Mastering Autonomous AI Agents & Workflows (2026)', href: '/blog/mastering-autonomous-ai-agents-workflows-2026' },
      { name: '2. Case Study: n8n Automated Authority Scaling', href: '/blog/case-study-n8n-automated-authority-scaling' },
      { name: '3. Building Modular AI Workflow Systems', href: '/blog/building-modular-ai-workflow-systems' },
      { name: '4. Precision Prompt Architecture Framework', href: '/blog/precision-prompt-architecture-framework' },
      { name: '5. Execution Chain Infrastructure Explained', href: '/blog/execution-chain-infrastructure-explained' },
    ],
    skills: ['n8n Orchestration', 'Multi-Agent Routers', 'Context Compression', 'Deterministic Loops', 'FastAPI'],
  },
];

const foundationalGuides = [
  {
    title: 'Microsoft Fabric Architecture Explained (2026 Edition)',
    category: 'MICROSOFT FABRIC',
    time: '28 MIN READ',
    difficulty: 'ARCHITECTURAL',
    desc: 'A comprehensive, layer-by-layer exploration of OneLake, Lakehouse engines, Polaris SQL Warehouses, and Direct Lake modeling.',
    href: '/blog/microsoft-fabric-architecture-explained-2026',
  },
  {
    title: 'Psychology of High-Fidelity Dashboard Design',
    category: 'EXECUTIVE BI',
    time: '16 MIN READ',
    difficulty: 'ALL LEVELS',
    desc: 'How cognitive load theory, pre-attentive attributes, and focal hierarchy transform cluttered reports into decision tools.',
    href: '/blog/psychology-of-high-fidelity-dashboard-design',
  },
  {
    title: 'PL-300 vs DP-600 vs DP-700: Microsoft Certification Blueprint',
    category: 'CAREER STRATEGY',
    time: '22 MIN READ',
    difficulty: 'CAREER BLUEPRINT',
    desc: 'The definitive breakdown of syllabus, industry compensation premiums, and study roadmaps across Power BI and Fabric.',
    href: '/blog/pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026',
  },
  {
    title: 'Zero-Trust Data Quality & Automated Validation Pipelines',
    category: 'DATA ENGINEERING',
    time: '18 MIN READ',
    difficulty: 'INTERMEDIATE',
    desc: 'Implement automated schema checks, range validations, and Python interceptors to stop bad data before it hits production.',
    href: '/blog/data-quality-frameworks',
  },
  {
    title: 'Mastering Autonomous AI Agent Workflows in Production',
    category: 'AI & AUTOMATION',
    time: '20 MIN READ',
    difficulty: 'ADVANCED',
    desc: 'Construct supervisor-router agent topologies, prevent infinite API failure loops, and manage token context budgets.',
    href: '/blog/mastering-autonomous-ai-agents-workflows-2026',
  },
  {
    title: 'The 2026 Modern BI Stack: Architectural Blueprint',
    category: 'INFRASTRUCTURE',
    time: '15 MIN READ',
    difficulty: 'STRATEGIC',
    desc: 'An objective architectural evaluation of cloud data lakes, semantic caching layers, and decoupled visualization stacks.',
    href: '/blog/modern-bi-stack-2026',
  },
];

const comparisonMatrix = [
  {
    role: 'Power BI Data Analyst',
    cert: 'PL-300',
    experience: '0 – 2 Years',
    focus: 'Power Query M, DAX Measures, Visual Storytelling, Report Service Admin',
    salary: '₹6L – ₹14L / $75K – $105K',
    nextStep: 'Master DAX internals, then transition to DP-600 Fabric Semantic Modeling.',
  },
  {
    role: 'Fabric Analytics Engineer',
    cert: 'DP-600',
    experience: '2 – 5 Years',
    focus: 'Direct Lake Mode, OneLake Storage, TMDL, Lakehouse T-SQL, Capacity Management',
    salary: '₹12L – ₹28L / $115K – $155K',
    nextStep: 'Target hybrid data modeling and enterprise Purview governance frameworks.',
  },
  {
    role: 'Fabric Data Engineer',
    cert: 'DP-700',
    experience: '3 – 6+ Years',
    focus: 'Apache Spark, PySpark transformations, OneLake Shortcuts, Real-Time Streams',
    salary: '₹16L – ₹35L / $130K – $180K',
    nextStep: 'Build enterprise medallion pipelines and automated CI/CD deployment chains.',
  },
  {
    role: 'Full-Stack Data Architect',
    cert: 'Architect Mastery',
    experience: '6+ Years',
    focus: 'End-to-End Governance, Zero-Trust Quality, Multi-Agent AI Pipelines, FinOps',
    salary: '₹28L – ₹60L+ / $165K – $240K+',
    nextStep: 'Lead platform transformations and architect high-fidelity decision cockpits.',
  },
];

const faqs = [
  {
    q: 'Where should I start if I currently only use Excel and basic formulas?',
    a: 'Start with Track 02: Advanced Power BI & Executive Cockpit Design. The foundational jump from Excel to Power Query and basic Star Schemas is the most natural stepping stone. Learn how Power Query automates data cleaning, then learn DAX to replace fragile VLOOKUPs and SUMIFs. Once comfortable, branch into Track 03 for SQL fundamentals.',
  },
  {
    q: 'Should I learn Microsoft Fabric or Databricks first in 2026?',
    a: 'If your organization or target job market heavily uses Power BI, Microsoft 365, and Azure SQL, Microsoft Fabric is the most strategic choice because of its zero-copy Direct Lake integration with Power BI. If you are aiming for heavy machine learning and big-data engineering in open cloud stacks (AWS/GCP), Databricks remains industry-leading. Both rely heavily on Delta Lake and PySpark, so the core skills transfer seamlessly.',
  },
  {
    q: 'Will Generative AI and AI Agents replace Business Intelligence developers?',
    a: 'AI does not replace BI developers; it replaces developers who only build static tabular charts. Generative AI struggles with nuanced semantic definitions (e.g. what constitutes "active churned user" across multiple business units). Developers who master data modeling, VertiPaq tuning, and who can orchestrate AI agents to automate data tasks are commanding higher compensation than ever.',
  },
  {
    q: 'What is the "Data Copy Tax", and why does Microsoft Fabric solve it?',
    a: 'Historically, data was extracted from databases, copied into an S3/ADLS data lake, copied into a cloud data warehouse (Synapse/Snowflake), and then copied a fourth time into a Power BI VertiPaq file. Each copy introduced latency, storage costs, and security risks. Fabric stores data once in OneLake as open Delta Parquet files; every compute engine queries the same physical data directly without copying.',
  },
  {
    q: 'Are all tutorials, blueprints, and code examples on this site free?',
    a: 'Yes, 100%. All 97+ technical deep-dives, architectural blueprints, cheat sheets, and code repositories are published as open-access resources without paywalls. They reflect real production deployments designed over 10+ years in enterprise analytics.',
  },
  {
    q: 'How can I get custom roadmap guidance or enterprise consultation?',
    a: 'You can reach out directly via the Contact page or book a private strategy session. I work with business leaders, data engineering teams, and enterprise clients to audit analytics infrastructure, optimize capacity licensing, and design executive decision cockpits.',
  },
];

const learningMaps: Record<string, string[]> = {
  'track-fabric': ['OneLake', 'Lakehouse', 'Analytics'],
  'track-bi': ['Model', 'DAX', 'Dashboard'],
  'track-sql': ['Profile', 'Optimize', 'Validate'],
  'track-ai': ['Trigger', 'Orchestrate', 'Observe'],
};

function LearningMap({ id, title }: { id: string; title: string }) {
  const nodes = learningMaps[id];
  return <div className={styles.learningMap}><div className={styles.mapCaption}><span>YOUR CONCEPT MAP</span><span>LEARN → CONNECT → APPLY</span></div><svg viewBox="0 0 380 70" role="img" aria-label={`${title}: ${nodes.join(' → ')}`}><defs><marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="var(--accent)" strokeWidth="1.3" /></marker></defs>{[0, 1].map(index => <path key={index} d={`M${110 + index * 133} 35H${132 + index * 133}`} fill="none" stroke="var(--accent)" strokeOpacity=".6" markerEnd={`url(#${id}-arrow)`} />)}{nodes.map((node, index) => <g key={node} transform={`translate(${2 + index * 133},14)`}><rect width="108" height="42" rx="8" fill="var(--surface)" stroke="var(--border)" /><rect x="0" y="11" width="2" height="20" rx="1" fill="var(--accent)" opacity={.35 + index * .3} /><text x="12" y="26" fill="var(--text)" fontFamily="var(--font-syne)" fontSize="14" fontWeight="500">{node}</text></g>)}</svg></div>;
}

export default function StartHerePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <div className="boxed-wrapper" style={{ position: 'relative' }}>
        <Crosshair position="tl" />

        <main className={styles.wrapper}>
          <div className="container">
            {/* ── HERO LAUNCHPAD ── */}
            <section className={styles.hero} aria-labelledby="start-here-heading">
              <div className={styles.heroGrid}>
                <div className={styles.heroCopy}>
                  <div className={styles.eyebrow}>
                    <span className={styles.eyebrowDot} />
                    <span>// KNOWLEDGE_BASE_2026 // ARCHITECTURAL_START_HERE</span>
                  </div>

                  <h1 id="start-here-heading" className={styles.heroTitle}>
                    Start Your Data Journey.<br />
                    <span>From Zero to Enterprise Architect.</span>
                  </h1>

                  <p className={styles.heroDesc}>
                    A structured, battle-tested curriculum designed by Datta Sable (10+ years in Enterprise BI &amp; Analytics).
                    Connect the dots between raw databases, Microsoft Fabric lakehouses, high-performance DAX, and autonomous AI orchestration.
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <a href="#learning-tracks" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      EXPLORE 4 LEARNING TRACKS <ArrowRight size={16} />
                    </a>
                    <a href="#decision-tree" className="secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: 'var(--text-small)' }}>
                      <Compass size={16} /> CAREER DECISION MATRIX
                    </a>
                  </div>

                  <div className={styles.heroStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>97+</span>
                      <span className={styles.statLabel}>DEEP GUIDES</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>04</span>
                      <span className={styles.statLabel}>CORE TRACKS</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>10+</span>
                      <span className={styles.statLabel}>YEARS EXP.</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>100%</span>
                      <span className={styles.statLabel}>OPEN ACCESS</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Radar / Architecture Schematic */}
                <div className={styles.heroVisual} aria-hidden="true">
                  <div className={styles.radarCard}>
                    <div className={styles.radarHeader}>
                      <div className={styles.radarTitle}>
                        <Terminal size={14} /> MODERN_DATA_STACK_RADAR
                      </div>
                      <span className={styles.radarBadge}>ONLINE // 2026</span>
                    </div>

                    <div className={styles.radarScreen}>
                      <div className={styles.radarRings}>
                        <div className={styles.radarRing1} />
                        <div className={styles.radarRing2} />
                        <div className={styles.radarRing3} />
                      </div>

                      <div className={styles.layerStack}>
                        <div className={styles.stackLayer}>
                          <div className={styles.layerLeft}>
                            <span className={styles.layerTag}>L4</span>
                            <span className={styles.layerName}>Executive Decision Cockpit (Power BI)</span>
                          </div>
                          <span className={styles.layerStatus}>
                            <span className={styles.layerStatusDot} /> 3s UX
                          </span>
                        </div>

                        <div className={styles.stackLayer}>
                          <div className={styles.layerLeft}>
                            <span className={styles.layerTag}>L3</span>
                            <span className={styles.layerName}>Direct Lake Semantic Models (TMDL)</span>
                          </div>
                          <span className={styles.layerStatus}>
                            <span className={styles.layerStatusDot} /> Zero Copy
                          </span>
                        </div>

                        <div className={styles.stackLayer}>
                          <div className={styles.layerLeft}>
                            <span className={styles.layerTag}>L2</span>
                            <span className={styles.layerName}>Medallion Storage (Gold / Silver)</span>
                          </div>
                          <span className={styles.layerStatus}>
                            <span className={styles.layerStatusDot} /> Delta Parquet
                          </span>
                        </div>

                        <div className={styles.stackLayer}>
                          <div className={styles.layerLeft}>
                            <span className={styles.layerTag}>L1</span>
                            <span className={styles.layerName}>OneLake Unified Ingestion (Bronze)</span>
                          </div>
                          <span className={styles.layerStatus}>
                            <span className={styles.layerStatusDot} /> Multi-Cloud
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 1: THE 4 CORE TRACKS ── */}
            <section id="learning-tracks" className={styles.sectionBlock} aria-labelledby="tracks-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <Compass size={14} /> CURATED LEARNING PATHWAYS
                  </div>
                  <h2 id="tracks-heading" className={styles.sectionTitle}>
                    Choose Your Focus.<br />
                    <span>Master The Core Skills.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Each pathway connects architectural concepts with practical guides, code patterns, and a clear reading sequence. Pick your focus, then build one skill at a time.
                </p>
              </div>

              <div className={styles.tracksGrid}>
                {tracks.map(track => {
                  const Icon = track.icon;
                  return <article id={track.id} key={track.id} className={styles.trackCard} aria-labelledby={`${track.id}-title`}>
                    <div className={styles.trackIntro}>
                      <div className={styles.trackCardHeader}><span className={styles.trackIconWrap}><Icon size={19} strokeWidth={1.5} /></span><span className={styles.trackNumber}>PATH {track.number}<small>{track.level}</small></span><span className={styles.certBadge}>{track.cert}</span></div>
                      <h3 id={`${track.id}-title`} className={styles.trackTitle}>{track.title}</h3>
                      <p className={styles.trackDesc}>{track.desc}</p>
                      <LearningMap id={track.id} title={track.title} />
                    </div>
                    <div className={styles.trackResources}>
                      <details className={styles.readingDetails}><summary className={styles.readingHeader}><span><BookOpen size={13} /> Explore reading path</span><small>{track.modules.length} GUIDES <ArrowRight size={12} /></small></summary><p className={styles.readingDescription}>{track.desc}</p>
                      <ol className={styles.trackModules}>{track.modules.map((module, index) => <li key={module.href}><Link href={module.href} className={styles.moduleItem}><span className={styles.moduleIndex}>{String(index + 1).padStart(2, '0')}</span><span className={styles.moduleName}>{module.name.replace(/^\d+\.\s*/, '')}</span><ArrowUpRight size={13} className={styles.moduleArrow} /></Link></li>)}</ol></details>
                      <div className={styles.trackPills} aria-label="Skills in this pathway">{track.skills.map(skill => <span key={skill} className={styles.trackPill}>{skill}</span>)}<span className={styles.moreSkills}>+{track.skills.length - 3} skills</span></div>
                    </div>
                  </article>;
                })}
              </div>
            </section>

            {/* ── SECTION 2: 3-TIER ARCHITECTURAL BLUEPRINT ── */}
            <section className={styles.sectionBlock} aria-labelledby="blueprint-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <Layers size={14} /> ENTERPRISE DATA ARCHITECTURE
                  </div>
                  <h2 id="blueprint-heading" className={styles.sectionTitle}>
                    How The Stack Fits Together.<br />
                    <span>The 3-Tier Enterprise Blueprint.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Modern platforms avoid monolithic designs. Here is how modern cloud analytics separates storage, compute, and consumption.
                </p>
              </div>

              <div className={styles.architectureContainer}>
                <div className={styles.architectureFlow}>
                  <div className={styles.tierCard}>
                    <div className={styles.tierHeader}>
                      <span className={styles.tierNumber}>TIER 01</span>
                      <Database size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className={styles.tierTitle}>Ingestion &amp; OneLake Storage</h3>
                    <p className={styles.tierDesc}>
                      Raw data enters through Data Factory pipelines, EventStreams, and OneLake shortcuts. Stored permanently in open Delta Parquet format to prevent proprietary lock-in.
                    </p>
                    <div className={styles.tierList}>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> Multi-Cloud S3 / ADLS Shortcuts</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> High-Throughput CDC Ingestion</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> Medallion Bronze Landing Zone</div>
                    </div>
                  </div>

                  <div className={styles.tierCard}>
                    <div className={styles.tierHeader}>
                      <span className={styles.tierNumber}>TIER 02</span>
                      <Cpu size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className={styles.tierTitle}>Serverless Transformation &amp; Modeling</h3>
                    <p className={styles.tierDesc}>
                      Decoupled compute engines (Synapse Spark and Polaris SQL) transform Bronze into clean Silver tables and optimized Gold star schemas without duplicating storage.
                    </p>
                    <div className={styles.tierList}>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> PySpark &amp; SQL Transformation</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> V-Order Delta Compaction</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> Zero-Trust Schema Validation</div>
                    </div>
                  </div>

                  <div className={styles.tierCard}>
                    <div className={styles.tierHeader}>
                      <span className={styles.tierNumber}>TIER 03</span>
                      <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className={styles.tierTitle}>Direct Lake &amp; Executive Cockpits</h3>
                    <p className={styles.tierDesc}>
                      Power BI semantic models transcode Delta tables straight into VertiPaq memory on query demand. Executive dashboards render sub-second insights with zero refresh lag.
                    </p>
                    <div className={styles.tierList}>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> Direct Lake Memory Paging</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> 3-Second Executive Cockpit UX</div>
                      <div className={styles.tierListItem}><CheckCircle2 size={13} /> Autonomous AI Alerting Triggers</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 3: MUST-READ MASTERCLASSES ── */}
            <section className={styles.sectionBlock} aria-labelledby="guides-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <Sparkles size={14} /> ESSENTIAL FOUNDATIONS
                  </div>
                  <h2 id="guides-heading" className={styles.sectionTitle}>
                    Top 6 Starting Points.<br />
                    <span>Read These First.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Hand-picked deep dives that establish core architectural intuition before jumping into advanced implementation.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
                {foundationalGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '24px',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    className="group hover:border-[var(--accent)] hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[length:var(--text-small)] text-[var(--accent)] tracking-wider uppercase font-semibold">{guide.category}</span>
                        <div className="flex items-center gap-1 text-[length:var(--text-small)] text-[var(--muted)] font-medium">
                          <Clock size={11} /> {guide.time}
                        </div>
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'var(--font-syne)' }}>
                        {guide.title}
                      </h3>
                      <p style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                        {guide.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <span className="text-[length:var(--text-small)] font-semibold tracking-wider uppercase px-2 py-1 bg-[var(--surface2)] border border-[var(--border)] rounded text-[var(--muted)]">
                        {guide.difficulty}
                      </span>
                      <span className="text-[length:var(--text-small)] font-semibold text-[var(--accent)] flex items-center gap-1 group-hover:underline tracking-wide">
                        READ ARTICLE <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── SECTION 4: CAREER DECISION MATRIX ── */}
            <section id="decision-tree" className={styles.sectionBlock} aria-labelledby="decision-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <Award size={14} /> CERTIFICATIONS &amp; CAREER PATHS
                  </div>
                  <h2 id="decision-heading" className={styles.sectionTitle}>
                    Which Credential Should You Target?<br />
                    <span>The 2026 Decision Matrix.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Understand how hiring managers evaluate certifications and where the highest compensation premiums are concentrated.
                </p>
              </div>

              <div className={styles.matrixViewport}>
                <table className={styles.matrixTable} role="table" aria-label="Certification and career comparison">
                  <thead>
                    <tr>
                      <th scope="col">Target Role</th>
                      <th scope="col">Primary Exam</th>
                      <th scope="col">Experience Level</th>
                      <th scope="col">Core Technology Stack</th>
                      <th scope="col">Market Compensation Range</th>
                      <th scope="col">Recommended Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.map((row) => (
                      <tr key={row.cert}>
                        <td data-label="Target role">
                          <div className={styles.certName}>{row.role}</div>
                        </td>
                        <td data-label="Primary exam">
                          <span className="text-[length:var(--text-small)] font-bold px-2 py-1 bg-[var(--surface2)] border border-[var(--border)] rounded text-[var(--text)]">
                            {row.cert}
                          </span>
                        </td>
                        <td data-label="Experience level">{row.experience}</td>
                        <td data-label="Core technology stack" style={{ maxWidth: '240px' }}>{row.focus}</td>
                        <td data-label="Market compensation range" className="text-[length:var(--text-small)] font-semibold text-[var(--accent)]">{row.salary}</td>
                        <td data-label="Recommended next step" style={{ maxWidth: '260px', color: 'var(--muted)', fontSize: 'var(--text-small)' }}>{row.nextStep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Link href="/certification" className="text-[length:var(--text-small)] font-semibold text-[var(--accent)] flex items-center gap-1 hover:underline tracking-wide">
                  VIEW FULL CERTIFICATIONS DIRECTORY <ArrowRight size={14} />
                </Link>
              </div>
            </section>

            {/* ── SECTION 5: VIDEO WORKSHOP SHOWCASE ── */}
            <section className={styles.sectionBlock} aria-labelledby="workshop-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <Zap size={14} /> HANDS-ON VIDEO WORKSHOPS
                  </div>
                  <h2 id="workshop-heading" className={styles.sectionTitle}>
                    See Architecture In Action.<br />
                    <span>Engineering Masterclasses.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Watch end-to-end setups recorded live, demonstrating how to deploy digital infrastructure, domains, and analytics environments.
                </p>
              </div>

              <div className={styles.workshopCard}>
                <div>
                  <span className="text-[length:var(--text-small)] text-[var(--accent)] tracking-widest uppercase block mb-3 font-semibold">
                    FEATURED WORKSHOP // 35 MINS
                  </span>
                  <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text)', marginBottom: '14px', lineHeight: 1.25 }}>
                    Full-Stack Web &amp; BI Orchestration Masterclass
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--muted)', marginBottom: '24px' }}>
                    A step-by-step technical session covering scalable web environments, DNS routing, responsive architectures, and analytics integration. This session has guided over 9,000+ practitioners worldwide.
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <div className="text-[20px] font-bold text-[var(--text)]">9K+</div>
                      <div className="text-[length:var(--text-small)] font-semibold text-[var(--muted)] tracking-wider">VIEWS LOGGED</div>
                    </div>
                    <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />
                    <div>
                      <div className="text-[20px] font-bold text-[var(--text)]">1K+</div>
                      <div className="text-[length:var(--text-small)] font-semibold text-[var(--muted)] tracking-wider">SUBSCRIBERS</div>
                    </div>
                    <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />
                    <div>
                      <div className="text-[20px] font-bold text-[var(--accent)]">100%</div>
                      <div className="text-[length:var(--text-small)] font-semibold text-[var(--muted)] tracking-wider">FREE ON YOUTUBE</div>
                    </div>
                  </div>

                  <a
                    href="https://youtu.be/5sXT6HuV61w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    WATCH ON YOUTUBE DIRECTLY <ArrowUpRight size={16} />
                  </a>
                </div>

                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/5sXT6HuV61w"
                    title="Full-Stack Web Orchestration Masterclass by Datta Sable"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* ── SECTION 6: FREQUENTLY ASKED QUESTIONS ── */}
            <section className={styles.sectionBlock} aria-labelledby="faq-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionMeta}>
                    <HelpCircle size={14} /> ONBOARDING INTELLIGENCE
                  </div>
                  <h2 id="faq-heading" className={styles.sectionTitle}>
                    Frequently Asked Questions.<br />
                    <span>Clear Answers for Career Growth.</span>
                  </h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Straight answers to the most common questions asked by engineers, data analysts, and career switchers.
                </p>
              </div>

              <div className={styles.faqGrid}>
                {faqs.map((faq, i) => (
                  <div key={i} className={styles.faqCard}>
                    <h3 className={styles.faqQuestion}>
                      <HelpCircle size={18} />
                      <span>{faq.q}</span>
                    </h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 7: FINAL CTA ── */}
            <section className={styles.ctaBox} aria-labelledby="cta-heading">
              <span className="text-[length:var(--text-small)] text-[var(--accent)] tracking-widest uppercase block mb-3 font-semibold">
                TAILORED ROADMAPS &amp; CONSULTATION
              </span>
              <h2 id="cta-heading" className={styles.ctaTitle}>
                Ready to Architect High-Performance <span>Analytics Systems?</span>
              </h2>
              <p className={styles.ctaDesc}>
                Whether you are evaluating a migration to Microsoft Fabric, optimizing memory footprint on million-row tabular models, or training an enterprise data team, let&apos;s build clarity together.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  BOOK AN ARCHITECTURAL CONSULTATION <Target size={16} />
                </Link>
                <Link href="/blog" className="secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  BROWSE ALL 97+ GUIDES <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          </div>
        </main>

        <Crosshair position="br" />
      </div>

      <Footer />

      {/* Structured Schema.org Course & Video Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Course',
                'name': 'Enterprise BI & Microsoft Fabric Learning Pathway',
                'description': 'A comprehensive, structured curriculum covering Microsoft Fabric, Power BI, Advanced DAX, SQL, and Agentic AI.',
                'provider': {
                  '@type': 'Person',
                  'name': 'Datta Sable',
                  'url': 'https://dattasable.com',
                },
                'educationalLevel': 'Beginner to Advanced Enterprise Architect',
                'hasCourseInstance': [
                  {
                    '@type': 'CourseInstance',
                    'courseMode': 'Online, Self-Paced',
                    'name': 'Microsoft Fabric & Modern Cloud Architecture Track',
                  },
                  {
                    '@type': 'CourseInstance',
                    'courseMode': 'Online, Self-Paced',
                    'name': 'Advanced Power BI & Executive Cockpit Design Track',
                  },
                  {
                    '@type': 'CourseInstance',
                    'courseMode': 'Online, Self-Paced',
                    'name': 'SQL Performance & High-Throughput Engineering Track',
                  },
                  {
                    '@type': 'CourseInstance',
                    'courseMode': 'Online, Self-Paced',
                    'name': 'Autonomous AI Workflows & Production Orchestration Track',
                  },
                ],
              },
              {
                '@type': 'VideoObject',
                'name': 'Full-Stack Web Orchestration Masterclass',
                'description': 'A comprehensive workshop demonstrating the engineering fundamentals of scalable digital infrastructure for BI and Data environments.',
                'thumbnailUrl': [
                  'https://img.youtube.com/vi/5sXT6HuV61w/maxresdefault.jpg',
                  'https://img.youtube.com/vi/5sXT6HuV61w/sddefault.jpg',
                  'https://img.youtube.com/vi/5sXT6HuV61w/hqdefault.jpg',
                ],
                'uploadDate': '2021-01-15T00:00:00Z',
                'duration': 'PT35M',
                'embedUrl': 'https://www.youtube.com/embed/5sXT6HuV61w',
                'interactionStatistic': {
                  '@type': 'InteractionCounter',
                  'interactionType': { '@type': 'WatchAction' },
                  'userInteractionCount': 9200,
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
