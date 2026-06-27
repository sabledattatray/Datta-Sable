'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, ChevronDown, ArrowRight, Shield, Star } from 'lucide-react';
import Crosshair from '@/components/Crosshair';

const services = [
  {
    icon: '📊',
    title: 'Dashboard Development',
    id: 'dashboards',
    desc: 'Custom, interactive dashboards in Tableau and Power BI that give your team real-time visibility into what matters most.',
    features: ['KPI tracking & monitoring', 'Drill-down & filter capabilities', 'Cross-platform compatibility', 'Automated data refresh', 'Executive-ready design', 'Mobile responsive'],
    price: 'Starting at ₹15,000',
    cta: 'Get a Dashboard',
    color: 'var(--accent)',
    popular: false,
  },
  {
    icon: '🔬',
    title: 'Data Analytics Consulting',
    id: 'consulting',
    desc: 'End-to-end analytics strategy — from data audit to insight delivery. I help you understand your data and act on it.',
    features: ['Data audit & gap analysis', 'KPI framework design', 'SQL query optimization', 'Predictive modeling basics', 'Insight reporting', 'Team upskilling sessions'],
    price: 'Starting at ₹25,000',
    cta: 'Get a Dashboard',
    color: 'var(--accent2)',
    popular: true,
  },
  {
    icon: '⚙️',
    title: 'Automation Solutions',
    id: 'automation',
    desc: 'Eliminate manual reporting forever. Python & Excel VBA automation that runs your reports on autopilot.',
    features: ['Python ETL pipelines', 'Excel macro automation', 'Email report scheduling', 'API data integration', 'Error monitoring & alerts', 'Documentation & handover'],
    price: 'Starting at ₹20,000',
    cta: 'Automate My Reports',
    color: 'var(--accent3)',
    popular: false,
  },
  {
    icon: '🌐',
    title: 'Enterprise Web Solutions',
    id: 'web-solutions',
    desc: 'High-performance WordPress and Next.js development tailored for data-heavy organizations and professional portfolios.',
    features: ['Custom WordPress Themes', 'Next.js Performance tuning', 'SEO architecture setup', 'Security & Speed optimization', 'Content management training', 'API & Database integration'],
    price: 'Starting at ₹30,000',
    cta: 'Build My Platform',
    color: 'var(--accent)',
    popular: false,
  },
  {
    icon: '🚀',
    title: 'On-Page SEO Optimization',
    id: 'seo-optimization',
    desc: 'Technical SEO audits and on-page optimization strategies that align your content with search engine algorithms for maximum visibility.',
    features: ['Keyword research & mapping', 'Meta tags & header optimization', 'Content gap analysis', 'Internal linking strategy', 'Image alt-text & compression', 'Core Web Vitals tuning'],
    price: 'Starting at ₹10,000',
    cta: 'Boost My Ranking',
    color: 'var(--accent2)',
    popular: false,
  },
  {
    icon: '🎨',
    title: 'Custom Web Design',
    id: 'web-design',
    desc: 'Bespoke, high-fidelity UI/UX designs that balance aesthetic excellence with functional performance for a premium digital presence.',
    features: ['High-fidelity UI/UX design', 'CorelDRAW Asset Creation', 'Responsive & adaptive layouts', 'Custom iconography', 'Brand identity integration', 'Performance-first architecture'],
    price: 'Starting at ₹25,000',
    cta: 'Start Designing',
    color: 'var(--accent3)',
    popular: false,
  },
  {
    icon: '🔗',
    title: 'n8n Workflow Automation',
    id: 'n8n-automation',
    desc: 'Self-hosted and scalable workflow automation using n8n to connect your entire toolstack and eliminate manual data silos.',
    features: ['Custom n8n nodes & triggers', 'Multi-app workflow design', 'Self-hosted setup & security', 'Error handling & retry logic', 'API & Webhook integration', 'Data synchronization & cleanup'],
    price: 'Starting at ₹15,000',
    cta: 'Connect My Stack',
    color: 'var(--accent)',
    popular: false,
  },
  {
    icon: '✒️',
    title: 'Professional Graphic Design',
    id: 'graphic-design',
    desc: 'Expert vector design and branding solutions powered by CorelDRAW, delivering high-impact visual communication for print and digital media.',
    features: ['Vector logo design', 'Brand identity development', 'Print-ready marketing assets', 'Custom typography & layouts', 'Icon set creation', 'File conversion & vectorization'],
    price: 'Starting at ₹5,000',
    cta: 'Get a Quote',
    color: 'var(--accent2)',
    popular: false,
  },
];

const faqs = [
  { q: 'What tools do you use for dashboards?', a: 'I primarily use Tableau and Power BI, connecting to SQL, Excel, and APIs. Tool choice depends on your existing tech stack.' },
  { q: 'How long does a typical project take?', a: 'Standard projects take 1–2 weeks. Complex pipelines or enterprise platforms take 3–6 weeks. I provide detailed milestones upfront.' },
  { q: 'Do you offer ongoing support?', a: 'Yes. I offer monthly maintenance packages for data updates and feature additions, starting at ₹5,000/month.' },
  { q: 'Can you work with our data infrastructure?', a: 'Absolutely. I integrate with AWS, Azure, GCP, Salesforce, SAP, and most modern databases via custom ETL pipelines.' },
  { q: 'How do you ensure data accuracy?', a: 'I implement automated validation checks at every ETL stage, with error logging and instant alerts to prevent data drift.' },
  { q: 'Can you integrate custom APIs?', a: 'Yes. I build custom Python scripts to pull data from any REST/SOAP API, transforming it into BI-ready schemas.' },
  { q: 'Do you provide model documentation?', a: 'Every project includes a technical handbook covering data lineage, schema definitions, and refresh logic for your team.' },
  { q: 'How do you handle slow dashboards?', a: 'I specialize in performance tuning via SQL optimization, indexing, and efficient calculation logic (DAX/LODs).' },
  { q: 'Can you assist with data security?', a: 'Yes. I implement Row-Level Security (RLS), role-based access, and governance frameworks to keep your data protected.' },
  { q: 'Do you sign NDAs?', a: 'Yes. Confidentiality is paramount. I sign NDAs before accessing any sensitive systems or internal data.' },
];

const trustBadges = [
  { label: 'Microsoft Certified', icon: '🏆' },
  { label: 'Tableau Specialist', icon: '📊' },
  { label: 'Google Analytics Certified', icon: '🔍' },
  { label: '50+ Projects Delivered', icon: '✅' },
  { label: '5★ Average Rating', icon: '⭐' },
  { label: 'NDA Protected', icon: '🔒' },
];

export default function ServicesContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <Crosshair position="tl" />

        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', justifyContent: 'center' }}>SERVICE-PACKAGES</div>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 48px)', 
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Services & <span className="hero-title">Packages</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
              High-fidelity analytics, technical automation, and scalable dashboard structures built for enterprise-grade growth.
            </p>
          </motion.div>

          {/* Service cards */}
          <div className="grid-auto-fill-300" style={{ marginBottom: '5rem' }}>
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ position: 'relative' }}
              >
                {s.popular && (
                  <div
                    style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, var(--accent), #00C9F2)',
                      color: '#000', fontSize: '10px', fontWeight: 700,
                      padding: '0.3rem 1.2rem', borderRadius: 0, whiteSpace: 'nowrap', zIndex: 1,
                      fontFamily: 'var(--mono)', letterSpacing: '0.1em'
                    }}
                  >
                    SYSTEM FAVORITE
                  </div>
                )}
                  <div
                    className="card"
                    id={s.id}
                    style={{
                    padding: '2.5rem',
                    borderLeft: '2px solid',
                    borderImage: `linear-gradient(to bottom, ${s.color}, #00C9F2) 1`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`, border: `1px solid ${s.color}33` }}
                  >
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{s.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{s.desc}</p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flex: 1 }}>
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                        <Check size={14} style={{ color: s.color, flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                    <div className="mono" style={{ color: s.color, fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>{s.price}</div>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 w-full py-5 font-semibold text-sm transition-all duration-200"
                      style={{
                        background: s.popular ? `linear-gradient(135deg, ${s.color}, var(--accent2))` : 'transparent',
                        color: s.popular ? '#000' : s.color,
                        border: s.popular ? 'none' : `1px solid ${s.color}`,
                        textDecoration: 'none',
                        display: 'flex',
                        borderRadius: '4px',
                      }}
                    >
                      {s.cta} <ArrowRight size={14} color={s.popular ? '#000' : s.color} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '5rem' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p className="section-label">Trust & Credibility</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {trustBadges.map(b => (
                <div
                  key={b.label}
                  className="card flex items-center gap-2"
                  style={{ borderRadius: '0', padding: '0.5rem 1.25rem', fontSize: '0.875rem', color: 'var(--muted)' }}
                >
                  <span>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p className="section-label">Frequently Asked Questions</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>Common Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--border)' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ overflow: 'hidden' }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4"
                    style={{ 
                      padding: '0.2rem 0.6rem', 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: i === faqs.length - 1 && openFaq !== i ? 'none' : '1px solid var(--border)',
                      cursor: 'pointer', 
                      textAlign: 'left', 
                      color: 'var(--text)' 
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} style={{ color: 'var(--accent)', flexShrink: 0 }}>
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ 
                          padding: '0 0.8rem 0.6rem', 
                          color: 'var(--muted)', 
                          fontSize: '0.75rem', 
                          lineHeight: 1.5,
                          borderBottom: i === faqs.length - 1 ? 'none' : '1px solid var(--border)'
                        }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Section */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>SERVICES_INTELLIGENCE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 700, marginBottom: '2rem', color: 'var(--text)', lineHeight: 1.25 }}>
            Why Professional BI Services Deliver Compounding Returns on Investment
          </h2>
          <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.85 }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Business Intelligence is not a cost center — it is the infrastructure that makes every other business function more effective. When your sales team has a live pipeline dashboard that updates every 15 minutes, they close deals faster. When your finance team has an automated variance report instead of a 4-hour Excel consolidation exercise, they catch anomalies before they become write-offs. When your operations team has an OEE dashboard instead of a weekly email from the plant manager, they make decisions on Tuesday instead of waiting for Friday's meeting.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              The measurable ROI of professional BI implementation is well-documented. Organizations that move from manual Excel reporting to automated BI dashboards consistently report 40-60% reductions in report preparation time, 25-35% improvements in forecast accuracy (due to better data quality and consistency), and significant reductions in decision lag — the time between a business event occurring and leadership becoming aware of it and responding.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              Dashboard Development: Beyond Visualization
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              A professionally built Power BI or Tableau dashboard is much more than a set of charts. It is a data product with a defined architecture: a star-schema data model optimized for fast aggregation, a semantic layer of DAX measures or Tableau calculated fields that enforce consistent business logic, row-level security that ensures each user sees only the data they are authorized to access, and a refresh schedule that keeps every metric current without any manual intervention. When these four layers are built correctly, the dashboard becomes a trusted system of record that reduces the need for ad-hoc analysis requests and frees your analysts for higher-value strategic work.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              Data Automation: Eliminating the Manual Reporting Tax
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              Every organization has what I call a "manual reporting tax" — the cumulative hours per week that skilled analysts spend on tasks that should be automated. Copying data from ERP systems into Excel, running the same SQL query every Monday morning, formatting and emailing the same PDF report to 12 stakeholders every Friday. These tasks are not analysis — they are data plumbing. My automation service identifies this manual reporting tax, quantifies it (typically ₹5-15 lakh per year in analyst time for a team of 3-5), and eliminates it with Python ETL pipelines and scheduled reporting workflows that run without human intervention.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              Enterprise Web Solutions for Data-Heavy Organizations
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              Data organizations have unique web requirements that generic web developers cannot meet: embedded interactive dashboards (Tableau Public, Power BI Embedded), large dataset visualizations using D3.js or Chart.js, API integrations with data platforms, and performance optimization for pages that load complex analytics components. My enterprise web service bridges the gap between data engineering and web development — building platforms that are not just fast and well-designed, but capable of rendering the complex data visualizations that make a data-first organization's web presence distinctive and authoritative.
            </p>

            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--border)', paddingLeft: '1rem', marginTop: '2.5rem', color: 'var(--text)' }}>
              "The organizations that win the next decade are not those with the most data — they are those with the shortest path from data to decision." — Datta Sable
            </p>
          </div>
        </div>
      </section>

      <Footer />
        <Crosshair position="br" />
      </div>
      <Footer />
    </div>
  );
}

