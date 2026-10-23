'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { servicesData, ServiceItem } from '@/data/servicesData';
import {
  BarChart3,
  BrainCircuit,
  Workflow,
  Globe,
  Sparkles,
  Palette,
  PenTool,
  Check,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
  ChevronDown,
  Lock,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Database,
  Search,
  MessageSquare
} from 'lucide-react';
import styles from './ServicesContent.module.css';

// Map icon string or category to Lucide component
const serviceIcons: Record<string, React.ReactNode> = {
  dashboards: <BarChart3 size={24} />,
  consulting: <BrainCircuit size={24} />,
  'fabric-architecture': <Database size={24} />,
  automation: <Workflow size={24} />,
  'database-optimization': <Zap size={24} />,
  'web-solutions': <Globe size={24} />,
  'seo-optimization': <Sparkles size={24} />,
  'technical-seo-audit': <Search size={24} />,
  'web-design': <Palette size={24} />,
  'graphic-design': <PenTool size={24} />,
};

// Category mapping for interactive filtering
const serviceCategories: Record<string, string> = {
  dashboards: 'bi',
  consulting: 'bi',
  'fabric-architecture': 'bi',
  automation: 'engineering',
  'database-optimization': 'engineering',
  'web-solutions': 'web',
  'web-design': 'web',
  'graphic-design': 'web',
  'seo-optimization': 'growth',
  'technical-seo-audit': 'growth',
};

// Editorial category kickers matching Blog style
const serviceKickers: Record<string, string> = {
  consulting: 'BI STRATEGY & AUDITS',
  dashboards: 'BUSINESS INTELLIGENCE & DAX',
  'fabric-architecture': 'MICROSOFT FABRIC & LAKEHOUSE',
  automation: 'PYTHON ETL & AUTOMATION',
  'database-optimization': 'SQL & DATABASE TUNING',
  'web-solutions': 'FULL-STACK WEB & APIS',
  'web-design': 'UI/UX & DESIGN SYSTEMS',
  'graphic-design': 'DATA VISUALIZATION & DESIGN',
  'seo-optimization': 'ON-PAGE SEO & CONTENT',
  'technical-seo-audit': 'TECHNICAL SEO & AUDITS',
};

const filterTabs = [
  { id: 'all', label: 'All Services', count: 10 },
  { id: 'bi', label: 'BI & Dashboards', count: 3 },
  { id: 'engineering', label: 'Pipelines & SQL', count: 2 },
  { id: 'web', label: 'Web & UI/UX', count: 3 },
  { id: 'growth', label: 'Technical SEO', count: 2 },
];

const roadmapSteps = [
  {
    step: 'PHASE 01',
    title: 'Discovery & Metric Audit',
    desc: 'We map grain, measure ownership, source systems, and business questions before building. No assumptions.',
  },
  {
    step: 'PHASE 02',
    title: 'Star-Schema & Data Model',
    desc: 'Architecting clean Kimball dimensional models, calculated measure taxonomy, and prototype validation.',
  },
  {
    step: 'PHASE 03',
    title: 'Engineering & Reconciliation',
    desc: 'Writing optimized DAX/SQL queries, configuring automated refresh gateways, Row-Level Security (RLS), and testing edge cases.',
  },
  {
    step: 'PHASE 04',
    title: 'Handover & Team Training',
    desc: 'Complete schema documentation handbook, video walkthrough, and 30-day post-launch warranty support.',
  },
];

const comparisonData = [
  {
    feature: 'Engineering Ownership',
    datta: 'Direct Senior Engineer (Datta Sable builds your system)',
    agencies: 'Account manager translates to revolving junior contractors',
    freelancers: 'Unverified skills, unpredictable availability',
  },
  {
    feature: 'Data Modeling Standard',
    datta: 'Kimball Star-Schema with audited dimensional relationships',
    agencies: 'Often flat, unoptimized datasets with severe query lag',
    freelancers: 'Brittle Excel formulas and ad-hoc calculated columns',
  },
  {
    feature: 'Calculation Accuracy',
    datta: '100% mathematical reconciliation against balance sheets',
    agencies: 'Visual charts delivered without source accounting checks',
    freelancers: 'Frequent metric discrepancies and unvalidated edge cases',
  },
  {
    feature: 'Delivery Velocity',
    datta: '1 - 2 weeks rapid production sprints with daily updates',
    agencies: '6 - 12 weeks bloated timelines with heavy bureaucratic delay',
    freelancers: 'Irregular schedules with risk of project abandonment',
  },
  {
    feature: 'Handover Documentation',
    datta: 'Complete schema handbook, measure catalog & video walkthrough',
    agencies: 'Minimal documentation to force costly ongoing retainer contracts',
    freelancers: 'Rarely provided, leaving internal teams stranded',
  },
  {
    feature: 'Security & NDAs',
    datta: 'Mutual enterprise NDA signed upfront; role-based RLS rules',
    agencies: 'Generic agency terms with third-party offshore exposure',
    freelancers: 'Reluctant or unprepared to sign formal legal agreements',
  },
];

const scopingChecklist = [
  {
    number: '01',
    title: 'Key Business Decision & Target Audience',
    desc: 'Who will look at this dashboard or report, and what operational or financial decision must they make within 60 seconds?',
  },
  {
    number: '02',
    title: 'Current Source Systems & Data Grain',
    desc: 'Where does the truth live? (PostgreSQL, SQL Server, ERP, CRM, Excel exports, or cloud APIs) and at what transaction frequency?',
  },
  {
    number: '03',
    title: 'Refresh Frequency & Performance SLAs',
    desc: 'Do you need sub-second real-time streaming, hourly scheduled automated refreshes, or daily consolidated morning packs?',
  },
  {
    number: '04',
    title: 'Access Control & Row-Level Security (RLS)',
    desc: 'Are there regional branch managers, department heads, or executive tiers that require restricted, role-based data isolation?',
  },
];

const generalFaqs = [
  {
    q: 'How does a typical client engagement begin?',
    a: 'We start with a 30-minute scoping discussion to audit your current data bottlenecks, source schemas, and deliverables. Once approved, I deliver a defined statement of work with milestone timelines and a fixed-price quote.',
  },
  {
    q: 'Are you available for international clients and remote teams?',
    a: 'Yes. I regularly work with founders, executives, and analytics leads across the US, UK, Europe, Australia, and India. Communication happens via Slack, Teams, email, and scheduled video checkpoints.',
  },
  {
    q: 'Can you work with our existing internal data team or contractors?',
    a: 'Absolutely. I seamlessly embed into existing engineering workflows — collaborating directly with internal database administrators, business analysts, and product managers to accelerate project delivery.',
  },
  {
    q: 'What is your guarantee on metric accuracy?',
    a: 'Every dashboard, SQL model, and pipeline goes through a rigorous mathematical reconciliation protocol. Before handover, every KPI total is validated against your audited source accounting records to ensure zero discrepancy.',
  },
  {
    q: 'Do you offer ongoing maintenance after project delivery?',
    a: 'Yes. Every project includes 30 days of post-handover warranty support. For teams requiring continuous updates, new metrics, and gateway monitoring, I offer flexible monthly sprint retainers.',
  },
  {
    q: 'How do you protect sensitive company data?',
    a: 'Confidentiality is fundamental. I execute mutual Non-Disclosure Agreements (NDAs) before inspecting any architecture or datasets, follow strict least-privilege access rules, and never retain unmasked customer PII.',
  },
];

export default function ServicesContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredServices = servicesData.filter((service: ServiceItem) => {
    if (activeTab === 'all') return true;
    return serviceCategories[service.id] === activeTab;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

        <main id="main-content" className={styles.container}>
        {/* ==========================================================================
            Hero Section
            ========================================================================== */}
        <section className={styles.hero} aria-labelledby="services-heading">
          <div className={styles.heroContent}>
            <div className={styles.statusBadge}>
              <span className={styles.pulseOrb} aria-hidden="true" />
              <span>ENTERPRISE BI & DATA SYSTEMS • OPEN FOR CLIENTS & ROLES</span>
            </div>

            <h1 id="services-heading" className={styles.heroTitle}>
              Turn Complex Data Into{' '}
              <span className={styles.heroTitleHighlight}>Clear, Confident Decisions.</span>
            </h1>

            <p className={styles.heroDesc}>
              Independent Business Intelligence Consultant, Data Architect & Full-Stack Engineer with 8+ years of enterprise experience. 
              Delivering executive-ready Power BI & Tableau dashboards, automated Python ETL pipelines, and robust data platforms with guaranteed mathematical accuracy.
            </p>

            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.btnPrimary} id="hero-schedule-cta">
                <span>Schedule a Scoping Call</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/portfolio" className={styles.btnSecondary} id="hero-portfolio-cta">
                <span>Browse Live Portfolio</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <a
                href="https://wa.me/918010803756?text=Hi%20Datta%2C%20I%20am%20interested%20in%20discussing%20a%20data%2Fdashboard%20service."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnWhatsApp}
                aria-label="Chat directly with Datta Sable on WhatsApp"
              >
                <MessageSquare size={15} aria-hidden="true" />
                <span>Quick Chat on WhatsApp</span>
              </a>
            </div>

            {/* In-Hero Proof Numbers Bar */}
            <div className={styles.proofRow} aria-label="Key delivery metrics">
              <div className={styles.proofItem}>
                <div className={styles.proofNumber}>50<span>+</span></div>
                <div className={styles.proofLabel}>Production Dashboards</div>
                <div className={styles.proofSub}>Delivered on-time with zero downtime</div>
              </div>
              <div className={styles.proofItem}>
                <div className={styles.proofNumber}>100<span>%</span></div>
                <div className={styles.proofLabel}>Math Reconciliation</div>
                <div className={styles.proofSub}>Verified against accounting balance sheets</div>
              </div>
              <div className={styles.proofItem}>
                <div className={styles.proofNumber}>40-60<span>%</span></div>
                <div className={styles.proofLabel}>Reporting Time Saved</div>
                <div className={styles.proofSub}>Manual spreadsheet tasks eliminated</div>
              </div>
              <div className={styles.proofItem}>
                <div className={styles.proofNumber}>8<span>+ Yrs</span></div>
                <div className={styles.proofLabel}>Enterprise Experience</div>
                <div className={styles.proofSub}>Fabric, Power BI, SQL, Python, Next.js</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            Service Offerings & Interactive Filter
            ========================================================================== */}
        <section aria-labelledby="offerings-title" className={styles.offeringsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span>CURATED SPECIALIZATIONS</span>
            </div>
            <h2 id="offerings-title" className={styles.sectionTitle}>
              End-to-End Analytics & Engineering Capabilities
            </h2>
            <p className={styles.sectionDesc}>
              Select a specialized engagement tier based on your technical objectives. Every project includes defined milestone reviews, source code handover, and 30 days of post-launch warranty.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Filter services by specialization">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                id={`tab-${tab.id}`}
                className={`${styles.filterBtn} ${activeTab === tab.id ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span className={styles.filterCount}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Service Cards Grid - 2-column landscape cards matching Blog layout */}
          <div className={styles.servicesGrid} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {filteredServices.map(service => {
              const kicker = serviceKickers[service.id] || 'ENTERPRISE SERVICE';
              return (
                <article key={service.id} className={styles.cardItem}>
                  <Link
                    href={`/services/${service.slug}`}
                    className={styles.card}
                    id={service.id}
                    aria-labelledby={`service-title-${service.id}`}
                  >
                    {/* Landscape Left Column: Visual Thumbnail Box */}
                    <div className={styles.cardImage}>
                      {service.deliveryTime && (
                        <span className={styles.imageDuration}>
                          <Clock3 size={11} aria-hidden="true" />
                          <span>{service.deliveryTime}</span>
                        </span>
                      )}

                      <div className={styles.thumbnail}>
                        <Image
                          src={service.image || '/images/editorial-placeholder.svg'}
                          alt=""
                          fill
                          sizes="(max-width: 540px) 110px, (max-width: 1024px) 240px, 220px"
                          priority={false}
                        />
                      </div>

                      <span className={styles.imageArrow} aria-hidden="true">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>

                    {/* Landscape Right Column: Service Details */}
                    <div className={styles.cardBody}>
                      <div className={styles.categoryRow}>
                        <span className={styles.category}>{kicker}</span>
                        {service.popular && (
                          <span className={styles.popularBadge}>Most Requested</span>
                        )}
                      </div>

                      <h3 id={`service-title-${service.id}`}>
                        {service.title}
                      </h3>

                      <p>{service.desc}</p>

                      {/* Technology Pills */}
                      <div className={styles.techStrip} aria-label="Key Technologies">
                        {service.technologies.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className={styles.techPill}>{tech}</span>
                        ))}
                      </div>

                      {/* Card Footer with Price and Explore Scope link */}
                      <div className={styles.cardFooter}>
                        <div className={styles.cardPricing}>
                          <span className={styles.priceTag}>{service.price}</span>
                        </div>

                        <span className={styles.readLabel}>
                          <span>Explore Scope</span>
                          <ArrowRight size={12} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* ==========================================================================
            The 4-Step Engineering Protocol (Engagement Roadmap)
            ========================================================================== */}
        <section className={styles.protocolSection} aria-labelledby="roadmap-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span>THE DELIVERY FRAMEWORK</span>
            </div>
            <h2 id="roadmap-heading" className={styles.sectionTitle}>
              How We Build: The 4-Step Engineering Protocol
            </h2>
            <p className={styles.sectionDesc}>
              A transparent, battle-tested methodology ensuring every project is delivered on schedule, mathematically verified, and fully adopted by your team.
            </p>
          </div>

          <div className={styles.protocolGrid}>
            {roadmapSteps.map((item, idx) => (
              <div key={idx} className={styles.protocolCard}>
                <span className={styles.protocolStep}>{item.step}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            Value Matrix: Working With Datta vs Typical Alternatives
            ========================================================================== */}
        <section className={styles.comparisonSection} aria-labelledby="comparison-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span>PROVEN VALUE COMPARISON</span>
            </div>
            <h2 id="comparison-heading" className={styles.sectionTitle}>
              Why Forward-Thinking Teams Hire Datta Directly
            </h2>
            <p className={styles.sectionDesc}>
              Cut through agency bureaucracy and junior trial-and-error. Get enterprise data architecture delivered directly by an engineer who owns the result.
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th scope="col">Decision Criteria</th>
                  <th scope="col" className={styles.highlightTh}>Working With Datta</th>
                  <th scope="col">Traditional Agencies</th>
                  <th scope="col">Generic Freelancers</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.feature}</strong></td>
                    <td className={styles.highlightTd}>{row.datta}</td>
                    <td>{row.agencies}</td>
                    <td>{row.freelancers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==========================================================================
            Scoping Preparation Checklist (Preserving Scoping Content)
            ========================================================================== */}
        <section className={styles.scopingSection} aria-labelledby="scoping-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span>PROJECT PREPARATION</span>
            </div>
            <h2 id="scoping-heading" className={styles.sectionTitle}>
              What to Prepare Before Our Scoping Call
            </h2>
            <p className={styles.sectionDesc}>
              To make our first conversation immediately productive, having these four core parameters identified helps us arrive at an accurate timeline and milestone price within 24 hours.
            </p>
          </div>

          <div className={styles.scopingGrid}>
            {scopingChecklist.map((item, idx) => (
              <div key={idx} className={styles.scopingCard}>
                <div className={styles.scopingNumber} aria-hidden="true">{item.number}</div>
                <div className={styles.scopingCardContent}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.securityNote}>
            <Lock size={18} aria-hidden="true" />
            <div>
              <strong>Strict Privacy &amp; Data Security Protocol:</strong> Never send production database passwords, unmasked credentials, or raw personal customer records via contact forms. We execute mutual Non-Disclosure Agreements (NDAs) upfront and establish encrypted channels before any schema review.
            </div>
          </div>
        </section>

        {/* ==========================================================================
            Frequently Asked Questions
            ========================================================================== */}
        <section className={styles.faqSection} aria-labelledby="faq-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 id="faq-heading" className={styles.sectionTitle}>
              Common Questions About Working Together
            </h2>
            <p className={styles.sectionDesc}>
              Clear answers regarding turnaround times, data privacy, technical handover, and engagement pricing.
            </p>
          </div>

          <div className={styles.faqList}>
            {generalFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`${styles.faqItem} ${openFaq === idx ? styles.faqItemOpen : ''}`}
              >
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={styles.faqIcon}
                    style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}
                    size={16}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className={styles.faqAnswer}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            Final High-Impact Conversion Banner
            ========================================================================== */}
        <section className={styles.ctaBanner} aria-labelledby="cta-banner-heading">
          <h2 id="cta-banner-heading">Ready to Turn Your Data Into a Competitive Advantage?</h2>
          <p>
            Whether you need an executive dashboard built next week, a fragile pipeline automated, or a senior BI consultant for your team — let’s scope your requirements and build something solid.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.btnPrimary} id="cta-schedule-bottom">
              <span>Schedule a Scoping Call</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/portfolio" className={styles.btnSecondary} id="cta-portfolio-bottom">
              <span>View Case Studies &amp; Dashboards</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <a
              href="https://wa.me/918010803756?text=Hi%20Datta%2C%20I%20would%20like%20to%20discuss%20a%20project%2Frole."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhatsApp}
              aria-label="Connect on WhatsApp"
            >
              <MessageSquare size={15} aria-hidden="true" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </section>
        </main>

        <Crosshair position="br" />
      </div>

      <Footer />
    </div>
  );
}
