'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: "What Business Intelligence tools do you specialize in?",
    a: "I specialize in the full Microsoft BI stack — Power BI, Power Query, DAX, SQL Server, and SSRS — as well as Tableau Desktop and Advanced Excel automation using VBA and Power Query. For data engineering tasks I work with Python (pandas, SQLAlchemy, Prefect) and for cloud deployments, Azure Data Factory and AWS S3. My primary tool selection always depends on your existing infrastructure and team's technical capability, not on personal tool preference."
  },
  {
    q: "Do you handle custom data automation projects?",
    a: "Yes, automation is a core service. I build Python and SQL-based ETL pipelines that replace manual data exports, scheduled email report generation using SMTP automation, Excel-to-dashboard pipelines with Power Query, and API integrations to pull live data from external platforms (Salesforce, HubSpot, SAP, Tally). Every automation project includes documentation and a handover session so your team can maintain and modify the workflow independently."
  },
  {
    q: "Can you optimize existing slow Power BI reports?",
    a: "Absolutely. Slow Power BI reports are almost always caused by one of three issues: inefficient DAX measures that calculate at the row-level instead of the filter context, a star-schema data model that hasn't been properly normalized, or DirectQuery connections pulling from unindexed tables. I perform a full report audit covering data model structure, DAX query plans (using DAX Studio), and Power Query step efficiency. Most reports can be reduced from 30+ second load times to under 3 seconds after optimization."
  },
  {
    q: "Do you provide MIS reporting services for Finance and Operations?",
    a: "Yes, MIS reporting is one of my primary specializations. Over 10 years I have built automated MIS dashboards for banking (NPA tracking, collection efficiency, portfolio risk), telecom (churn analysis, revenue per circle), and manufacturing (OEE, downtime analysis, production variance). My MIS reports replace manual Excel consolidation with auto-refreshing dashboards that pull data directly from your ERP or source system."
  },
  {
    q: "What is your typical project timeline?",
    a: "For a standard Power BI or Tableau dashboard project, the timeline is 2-4 weeks from data source access to final delivery. This includes a discovery call (1-2 days), data model design and ETL setup (3-5 days), dashboard development (5-7 days), and testing/feedback rounds (3-5 days). Complex automation projects with multiple data sources and scheduled pipelines typically run 4-6 weeks. I provide a detailed project timeline estimate after the initial requirements call."
  },
  {
    q: "Do you work with clients outside of India?",
    a: "Yes. I work with clients across India, the UAE, the UK, and the US. For international clients, all project communication happens over Google Meet or Zoom, deliverables are shared via Google Drive or GitHub, and billing is handled in USD or INR via Razorpay or wire transfer. Time zone differences are managed through async updates on Notion or Slack, with scheduled sync calls at mutually convenient times."
  },
  {
    q: "What data sources can you connect to Power BI or Tableau?",
    a: "I can connect to virtually any data source: SQL Server, PostgreSQL, MySQL, Azure SQL, Snowflake, Google BigQuery, Oracle, SAP HANA, Excel/CSV files, SharePoint lists, REST APIs (via custom connectors), Salesforce, Google Analytics 4, HubSpot, and Tally ERP. For sources without native connectors, I build Python scripts that extract data and load it into a staging database that Power BI or Tableau can query directly."
  },
  {
    q: "How do you handle data privacy and confidentiality?",
    a: "All client data is treated with strict confidentiality. I sign Non-Disclosure Agreements before accessing any production data systems. During development, I work with anonymized data samples wherever possible and only access production systems directly when strictly necessary for connectivity testing. Client data is never stored on personal devices — all work is done within your approved environments (Azure, AWS, SharePoint) or in password-protected, encrypted working directories that are deleted after project delivery."
  },
  {
    q: "Can you build dashboards that non-technical users can update themselves?",
    a: "Yes. Every dashboard I deliver is designed for self-service. I configure Power BI Gateway for automatic data refresh, build guided Power Query templates that business users can update by replacing source files, and document every measure and calculated column in plain language. I also conduct a 1-2 hour handover training session where your team learns to filter, slice, and export data independently. The goal is a tool your team owns — not one they depend on me to operate."
  },
  {
    q: "Do you offer ongoing maintenance and support after project delivery?",
    a: "Yes, I offer monthly retainer packages for ongoing maintenance, which include up to 10 hours of updates per month, priority response for critical dashboard breaks, and quarterly performance reviews to catch model drift or new data source issues. Clients on retainer also get priority scheduling for new feature requests. Ad-hoc support is also available on an hourly basis for clients who need occasional help without a recurring commitment."
  },
  {
    q: "What is the difference between a BI dashboard and a standard Excel report?",
    a: "A BI dashboard (Power BI, Tableau) automatically refreshes data from your source system without any manual intervention, supports real-time interactivity (drill-downs, cross-filtering, dynamic date ranges), can handle millions of rows without performance issues, includes visual alerts for KPIs crossing thresholds, and is accessible from any device via browser without needing the application installed. An Excel report requires manual data refreshes, breaks at large data volumes, has no live alerting, and cannot be shared interactively without sending a file. For any recurring reporting use case, a BI dashboard delivers dramatically higher ROI over time."
  },
  {
    q: "How do I get started working with you?",
    a: "The simplest first step is to use the Contact page to send a brief description of your project — what data you have, what decisions you need to support, and what your current reporting process looks like. I respond within 24 hours with an initial assessment and a link to book a 30-minute discovery call. During that call I ask structured questions about your data architecture, team size, and reporting frequency to produce an accurate project scope and quote. There is no obligation — the discovery call is free."
  }
];

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
      >
        <span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 600, lineHeight: 1.5 }}>{q}</span>
        <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ marginTop: '1rem', color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>{a}</p>
      </motion.div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: 800 }}>
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
          <span className="label-tech">KNOWLEDGE BASE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem', maxWidth: 640 }}>
          Answers to the most common questions about Business Intelligence consulting, Power BI and Tableau development, data automation, pricing, timelines, and what to expect when working with Datta Sable.
        </p>
        <div style={{ marginTop: '2rem' }}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Editorial Section */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>BI_CONSULTING_EXPLAINED</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 700, marginBottom: '2rem', color: 'var(--text)', lineHeight: 1.25 }}>
            When Does a Business Intelligence Consultant Add Real Value?
          </h2>
          <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.85 }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Most organizations reach the same inflection point eventually: the Excel files that once managed the business are now too large to open, too slow to refresh, and too fragile to share. Analysts spend more time fixing broken formulas and consolidating weekly exports than they do actually analyzing data. This is the moment a Business Intelligence consultant becomes not just useful but essential.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              A BI consultant does not just build dashboards — they design the data architecture that makes those dashboards reliable. This means auditing your existing data sources for quality and consistency, designing a data model that enables fast queries across millions of rows, and building the automated refresh pipeline that ensures your reports are always current without anyone pressing a button.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              The Hidden Cost of Manual Reporting
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              Research consistently shows that analysts in data-heavy organizations spend 60-80% of their time on data preparation — collecting, cleaning, and consolidating data — and only 20-40% on actual analysis. This ratio is the inverse of what it should be. Every hour an analyst spends copying data between spreadsheets is an hour not spent identifying trends, anomalies, or opportunities that leadership needs to act on. The compounding cost of delayed insight is almost always larger than the one-time cost of building a proper BI infrastructure.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              Power BI vs Tableau: Choosing the Right Platform
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              The most common question organizations face when starting a BI project is which tool to use. Power BI is the right choice if your organization is already in the Microsoft ecosystem — you use Azure, Office 365, SharePoint, or SQL Server. Its licensing model (Power BI Pro at approximately USD 10/user/month) is economical for large teams, and its native integration with Excel makes adoption easier. Tableau is the right choice when your data visualization requirements are complex — custom chart types, advanced spatial analysis, or pixel-perfect executive dashboards. Both tools are world-class; the right choice depends on your existing infrastructure, team skills, and budget.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '2.5rem', marginBottom: '0.85rem' }}>
              What Separates a Good BI Project from a Great One
            </h3>
            <p style={{ marginBottom: '1.25rem' }}>
              The difference between a BI project that gets used every day and one that gets abandoned within three months is almost never about the technology — it is about whether the dashboard answers questions that real decision-makers actually have. A great BI project starts with structured stakeholder interviews, not with data modeling. Understanding the specific decisions the CFO, operations manager, and sales director need to make every week dictates the KPIs, the data model, and the dashboard layout. When a dashboard is built backward from decision-making needs, adoption is natural. When it is built forward from available data, it becomes a technical artifact that nobody opens.
            </p>

            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--border)', paddingLeft: '1rem', marginTop: '2.5rem', color: 'var(--text)' }}>
              "The best BI system is the one your team uses every morning without being told to — because it answers the question they were going to ask anyway." — Datta Sable
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
