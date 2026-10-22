import type { Metadata } from 'next';
import { Activity, AlertTriangle, ArrowUpRight, CalendarDays, ExternalLink, Info, Layers, Mail, RefreshCw, ShieldAlert, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Disclaimer & Legal Disclosures | Datta Sable',
  description: 'Legal disclaimer for dattasable.com — technical advice, simulated demonstration metrics, benchmarks, brand disclosures, and external links.',
  openGraph: {
    title: 'Disclaimer | Datta Sable',
    description: 'Legal disclaimer for dattasable.com.',
    url: 'https://dattasable.com/disclaimer',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Disclaimer | Datta Sable', description: 'Legal disclaimer for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/disclaimer' },
  robots: { index: true, follow: true },
};

const standards = [
  {
    id: 'technical-advice',
    title: 'Professional Technical & Architectural Disclaimer',
    label: 'Technical Context',
    icon: AlertTriangle,
    content: (
      <>
        <p>The technical articles, tutorials, sample DAX calculations, SQL scripts, and architectural patterns published on <strong>dattasable.com</strong> (&quot;the Site&quot;) are created for general educational, illustrative, and professional reference purposes only.</p>
        <p>Every enterprise database environment, cloud tenant, network configuration, and data schema possesses unique security constraints and workload characteristics. <strong>You should thoroughly test all code snippets and templates in an isolated sandbox or staging environment before deploying them to production systems.</strong></p>
        <p>Datta Sable accepts no liability for data loss, service degradation, unexpected cloud consumption billing, or system outages resulting from the implementation of technical examples found on this Site.</p>
      </>
    ),
  },
  {
    id: 'synthetic-demonstrations',
    title: 'Interactive Demonstrations & Synthetic Data',
    label: 'Demonstrations',
    icon: Layers,
    content: (
      <>
        <p>The interactive dashboards, portfolio showcases, and embedded reporting interfaces presented on this Site are powered by <strong>synthetic, anonymized, or mock datasets</strong> developed strictly to exhibit data modeling, UI/UX aesthetics, and interactive analytical capabilities.</p>
        <ul>
          <li>Fictitious company names, customer personas, transactional numbers, and revenue metrics are generated algorithmically for illustrative realism.</li>
          <li>They do not reflect confidential client records or proprietary enterprise data of any current or previous client engagements.</li>
          <li>Mock figures should never be cited as actual corporate financial benchmarks.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'benchmarks-evidence',
    title: 'Performance Benchmarks & Measured Outcomes',
    label: 'Reproducibility',
    icon: Activity,
    content: (
      <>
        <p>Where performance figures, execution latencies, or query speedup percentages are discussed in technical articles, those outcomes reflect specific observed runs on designated hardware configurations, dataset sizes, and software builds.</p>
        <p>A percentage improvement or latency reduction achieved in a specific laboratory benchmark does not constitute a contractual warranty or guarantee of identical gains in your production environment. Workload concurrency, cloud capacity tiers, network topology, and schema design dictate real-world outcomes.</p>
      </>
    ),
  },
  {
    id: 'external-links',
    title: 'External Links & Third-Party Platforms',
    label: 'External Sources',
    icon: ExternalLink,
    content: (
      <>
        <p>This Site contains links to external documentation, cloud vendor consoles (such as Microsoft Learn, Power BI, GitHub, Snowflake, and PostgreSQL), and third-party developer utilities. These external resources are provided solely for reader convenience and technical context.</p>
        <p>We do not operate, control, monitor, or endorse third-party websites or their content, terms, or privacy standards. Clicking external hyperlinks is entirely at your own discretion and risk.</p>
      </>
    ),
  },
  {
    id: 'brand-disclosures',
    title: 'Brand Distinctions & Non-Affiliation Disclosures',
    label: 'Independence',
    icon: ShieldAlert,
    content: (
      <>
        <div className={styles.highlightBox}>
          <p>
            <strong>Independence Notice:</strong> <strong>Datta Sable</strong> is an independent Business Intelligence consultant, Data Engineer, and technical author. This practice is entirely independent and is <strong>not affiliated with, sponsored by, authorized by, or associated with</strong> the CodedThemes / AppSeed &quot;Datta Able&quot; admin dashboard software template.
          </p>
        </div>
        <p>Microsoft Fabric, Power BI, Azure, SQL Server, Excel, and related trademarks referenced in technical guides belong to Microsoft Corporation. Mentions of vendor products, frameworks, and tools are made under nominative fair use for technical educational and comparative evaluation purposes.</p>
      </>
    ),
  },
  {
    id: 'outcomes-testimonials',
    title: 'Client Results, Testimonials & Case Studies',
    label: 'Real Outcomes',
    icon: TrendingUp,
    content: (
      <>
        <p>Case studies, testimonials, and consulting impact summaries documented across this Site reflect authentic client experiences and measurable outcomes achieved on individual enterprise engagements.</p>
        <p>However, past engineering successes are unique to the specific scope, technical debt, organizational alignment, and team execution of those particular projects. We do not claim, warrant, or guarantee that every organization will achieve identical financial or efficiency results.</p>
      </>
    ),
  },
  {
    id: 'errors-updates',
    title: 'Errors, Omissions & Continuous Improvements',
    label: 'Accountability',
    icon: RefreshCw,
    content: (
      <>
        <p>While we make every conscientious effort to maintain accuracy, verify technical documentation, and update guides against changing software versions, technical products and cloud APIs evolve rapidly. Information on this Site may occasionally contain unintentional typographical errors, deprecations, or outdated syntax.</p>
        <p>We encourage readers and practitioners to submit factual corrections or outdated references directly to <a href="mailto:info@dattasable.com">info@dattasable.com</a>. Verified corrections are incorporated promptly into the public knowledge base.</p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <AlertTriangle size={15} aria-hidden="true" /> Legal &amp; technical disclosures
          </div>
          <h1>
            Legal disclaimer<br />
            <span>and professional disclosures.</span>
          </h1>
          <p className={styles.intro}>
            Important context regarding technical tutorials, synthetic demonstration data, measured benchmarks, and independent professional standing.
          </p>
          <div className={styles.updated}>
            <CalendarDays size={15} aria-hidden="true" />
            <span>Updated <time dateTime="2026-10-22">October 22, 2026</time></span>
            <span className={styles.divider} aria-hidden="true" />
            <span>Educational intent. Measured evidence. Independent practice.</span>
          </div>
        </header>

        <div className={styles.contextNote}>
          <span className={styles.noteIcon}>
            <Info size={22} aria-hidden="true" />
          </span>
          <div>
            <h2>Independent practice, grounded in context.</h2>
            <p>
              Our guides, templates, and interactive dashboards reflect real engineering practice. However, enterprise systems demand independent validation. Use our materials as high-quality accelerators, tested in your own staging environments.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="Disclaimer sections">
              <span className={styles.navLabel}>On this page</span>
              <ol>
                {standards.map((standard, index) => (
                  <li key={standard.id}>
                    <a href={`#${standard.id}`}>
                      <span className={styles.navNumber}>{String(index + 1).padStart(2, '0')}</span>
                      <span>{standard.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={styles.sidebarNote}>
              <Mail size={18} aria-hidden="true" />
              <p>Found a broken reference or outdated code snippet?</p>
              <a href="#disclaimer-contact">
                Submit a correction <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </aside>

          <div className={styles.standards}>
            {standards.map(({ id, title, label, icon: Icon, content }, index) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`} className={styles.standard}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className={styles.cardLabel}>{label}</span>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 id={`${id}-title`}>{title}</h2>
                <div>{content}</div>
              </section>
            ))}

            <section id="disclaimer-contact" className={styles.contact} aria-labelledby="disclaimer-contact-title">
              <div>
                <span className={styles.eyebrow}>Editorial &amp; Verification Desk</span>
                <h2 id="disclaimer-contact-title">Have feedback or spotted an inaccuracy?</h2>
                <p>We welcome technical peer review. Share the specific article passage and link so our team can investigate and update.</p>
              </div>
              <a href="mailto:info@dattasable.com" className={styles.contactButton}>
                Submit Technical Feedback <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
