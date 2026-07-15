'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HelpCircle, Terminal, Zap, Shield, BarChart3, Database } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    id: "FAB-01",
    tag: "Microsoft Fabric",
    icon: <BarChart3 size={16} className="text-[var(--accent)]" />,
    question: "What is Microsoft Fabric and how does it benefit enterprise data systems?",
    answer: "Microsoft Fabric is an all-in-one analytics solution for enterprises that covers everything from data movement to data science, Real-Time Analytics, and business intelligence. It integrates separate services like Azure Synapse, Data Factory, and Power BI into a single, unified SaaS platform built on an open OneLake data foundation."
  },
  {
    id: "CERT-02",
    tag: "Certifications",
    icon: <Terminal size={16} className="text-[#00C9F2]" />,
    question: "Which Microsoft Fabric certification should I take first?",
    answer: "If you are focusing on data engineering and analytics engineering within Fabric, the DP-600 (Microsoft Fabric Analytics Engineer Associate) is the standard and most relevant certification. For broader data platform architectural designs, you can prepare for the DP-700 or DP-800 tracks."
  },
  {
    id: "STOR-03",
    tag: "Direct Lake Mode",
    icon: <Database size={16} className="text-[#00D4FF]" />,
    question: "What is Direct Lake mode in Power BI and Fabric?",
    answer: "Direct Lake is a ground-breaking semantic model capability for analyzing very large volumes of data in Power BI. It allows loading data directly from Delta tables in OneLake into the Power BI engine without converting it or executing queries in DirectQuery or Import modes, keeping dashboard rendering speeds incredibly fast."
  },
  {
    id: "LEARN-04",
    tag: "Power BI Learning",
    icon: <Zap size={16} className="text-[#FFF134]" />,
    question: "How do I start learning Power BI effectively?",
    answer: "Begin by mastering clean star-schema data modeling practices, followed by learning fundamental DAX calculations. We recommend official Microsoft Learn pathways, running hands-on exercises with real datasets, and studying technical blogs like our collection to understand enterprise patterns."
  },
  {
    id: "SQL-05",
    tag: "SQL Certifications",
    icon: <Terminal size={16} className="text-[#00C9F2]" />,
    question: "Which SQL database certification is best for data professionals?",
    answer: "For cloud data engineers, Snowflake SnowPro Core or Microsoft Azure Database Administrator certifications are highly valued. However, a deep understanding of standard ANSI SQL, query plan analysis, and indexing mechanics is far more critical in day-to-day work than any specific certificate."
  },
  {
    id: "TOOLS-06",
    tag: "Technical Stack",
    icon: <Shield size={16} className="text-[#00D4FF]" />,
    question: "What tools and technologies do you use for data automation?",
    answer: "Our typical technical stack includes Microsoft Fabric, Power BI, PostgreSQL, DuckDB, Python (for ETL pipelines), dbt (for data transformations), and n8n (for cloud service and API workflow orchestrations)."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', paddingBottom: '2.5rem', background: 'var(--bg)' }}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-28">
            <div className="label-tech mb-4">RESOURCES & FAQ</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              Technical Insights &amp; <span style={{ color: 'var(--accent)' }}>Search Q&amp;A</span>
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '2rem' }}>
              Deep-diving into core concepts of Microsoft Fabric, Power BI modeling, and database certification tracks.
            </p>
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-sm hidden lg:block relative overflow-hidden" style={{ padding: '2.5rem 2rem', marginTop: '2rem' }}>
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={16} className="text-[var(--accent)]" />
                <span className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--text)]">Have a custom question?</span>
              </div>
              <p className="text-[13px] text-[var(--muted)] mb-6 leading-relaxed">
                Looking for a deep-dive tutorial or want us to cover a specific Fabric topic? Share your feedback.
              </p>
              <a href="/sitemap" className="mono text-[11px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1">
                BROWSE SITEMAP DIRECTORY →
              </a>
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={faq.id}
                  className="group relative rounded-sm overflow-hidden transition-all duration-500"
                  style={{ 
                    border: '1px solid var(--border)', 
                    background: isOpen ? 'var(--surface2)' : 'var(--surface)',
                  }}
                >
                  {/* Glowing left accent bar on active */}
                  <div 
                    className="absolute top-0 left-0 w-[2px] h-full transition-all duration-500"
                    style={{ background: isOpen ? 'var(--accent)' : 'transparent' }} 
                  />

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left flex items-start justify-between gap-6"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2rem' }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="mono text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded font-bold" style={{ color: 'var(--accent)' }}>
                          {faq.id}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-mono uppercase tracking-wider">
                          {faq.icon} {faq.tag}
                        </div>
                      </div>
                      <h3 
                        style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: 700, 
                          color: isOpen ? 'var(--text)' : 'var(--text)', 
                          lineHeight: 1.4,
                          transition: 'color 0.3s ease'
                        }}
                        className="group-hover:text-[var(--accent)]"
                      >
                        {faq.question}
                      </h3>
                    </div>
                    
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 mt-2 border"
                      style={{ 
                        background: isOpen ? 'var(--accent)' : 'var(--surface2)',
                        borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
                        color: isOpen ? '#000' : 'var(--text)'
                      }}
                    >
                      <ChevronRight 
                        size={16} 
                        className="transition-transform duration-500"
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} 
                      />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div 
                          className="border-t border-[var(--border)] border-opacity-50"
                          style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '1.05rem', padding: '2rem 2rem 2.5rem 2rem', marginTop: '1rem' }}
                        >
                          <p className="pl-6 border-l-2 border-[var(--accent)] border-opacity-40 my-2 py-2">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── FAQ Schema (SEO) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
}
