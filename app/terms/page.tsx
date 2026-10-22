import type { Metadata } from 'next';
import { AlertTriangle, ArrowUpRight, Ban, Briefcase, CalendarDays, CheckCircle2, Code2, CreditCard, FileText, Gavel, Mail, Scale, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service | Datta Sable',
  description: 'Terms of Service for dattasable.com — rules governing use of this website, dashboards, digital templates, and consulting engagements.',
  openGraph: {
    title: 'Terms of Service | Datta Sable',
    description: 'Terms of Service for dattasable.com.',
    url: 'https://dattasable.com/terms',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Terms of Service | Datta Sable', description: 'Terms of Service for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/terms' },
  robots: { index: true, follow: true },
};

const standards = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms & Eligibility',
    label: 'Agreement',
    icon: CheckCircle2,
    content: (
      <>
        <p>By accessing, browsing, or utilizing <strong>dattasable.com</strong> (&quot;the Site&quot;), purchasing digital assets, creating an account, or commissioning consulting engagements, you signify that you have read, understood, and agreed to be legally bound by these Terms of Service.</p>
        <p>If you are entering into this agreement on behalf of a company, enterprise, or legal entity, you represent and warrant that you possess the lawful authority to bind that entity to these conditions. If you do not agree with any part of these terms, you must discontinue your use of this Site immediately.</p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property & Digital Product Licenses',
    label: 'IP & Licensing',
    icon: Code2,
    content: (
      <>
        <p>All content published on this website—including architectural articles, technical guides, visual designs, interactive charts, Power BI semantic models, Excel automation workbooks, and custom scripts—is the exclusive intellectual property of Datta Sable and protected by Indian and international copyright statutes.</p>
        <p>When you purchase or download a digital product from our catalog:</p>
        <ul>
          <li><strong>Granted License:</strong> You receive a non-exclusive, perpetual, worldwide, non-transferable license to use, adapt, customize, and incorporate the template within your internal personal or business projects.</li>
          <li><strong>Prohibited Redistribution:</strong> <strong>You may not resell, sub-license, bundle, rent, redistribute, or publicly host the raw source template files</strong> (.pbix, .xlsx, .py, or .sql) in any public repository, digital asset marketplace, or downloadable directory.</li>
          <li><strong>Derivative Works:</strong> Reports and charts populated with your own proprietary data and shared as finalized PDF/static exports or internal dashboards are fully permissible.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'consulting-agreements',
    title: 'Consulting Services & Custom Engagements',
    label: 'Client Work',
    icon: Briefcase,
    content: (
      <>
        <p>Professional services—including Microsoft Fabric architecture, data engineering pipelines, custom Power BI builds, and technical audits—are provided pursuant to formal Statements of Work (SOW) executed between Datta Sable and the commissioning client.</p>
        <ul>
          <li><strong>Deliverable Ownership:</strong> Upon final settlement of all agreed invoice fees, custom client deliverable assets and bespoke code created specifically for the client are assigned to the client according to the SOW terms.</li>
          <li><strong>Background Technology:</strong> Pre-existing frameworks, generic scripts, utility libraries, and developer tools developed independently by Datta Sable prior to or outside the scope of the project remain the intellectual property of Datta Sable.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'account-security',
    title: 'User Accounts & Authentication Security',
    label: 'Accounts',
    icon: User,
    content: (
      <>
        <p>Access to authenticated portions of this platform (including the product download library and saved dashboard configurations) requires sign-in via Google OAuth or verified email credentials.</p>
        <ul>
          <li>You are solely responsible for maintaining the confidentiality of your authentication tokens and session credentials.</li>
          <li>You agree to notify us immediately at <a href="mailto:info@dattasable.com">info@dattasable.com</a> of any unauthorized access or security breach affecting your account.</li>
          <li>We reserve the right to suspend or terminate accounts that violate system integrity, engage in fraudulent transactions, or execute unauthorized automated scraping.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'prohibited-conduct',
    title: 'Acceptable Use & Prohibited System Activities',
    label: 'System Rules',
    icon: Ban,
    content: (
      <>
        <p>When interacting with this platform, you expressly agree not to:</p>
        <ul>
          <li>Deploy automated crawlers, scrapers, bots, or extraction scripts against authenticated pages or private API endpoints without written permission.</li>
          <li>Attempt to probe, scan, or test the vulnerability of our cloud infrastructure, authentication handlers, or database networks.</li>
          <li>Circumvent or tamper with access controls, signed download links, or payment gateway verification mechanisms.</li>
          <li>Inject malicious scripts, viruses, SQL injection payloads, or cross-site scripting vectors into contact forms or user profile fields.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pricing-billing',
    title: 'Pricing, Currencies & Payment Processing',
    label: 'Billing & Taxes',
    icon: CreditCard,
    content: (
      <>
        <p>Prices for products and consulting are displayed in Indian Rupees (INR) or US Dollars (USD) as configured on the checkout interface. We process payments through certified, PCI-DSS compliant payment gateways (Razorpay, Stripe).</p>
        <p>Applicable Goods and Services Tax (GST) in India or local statutory taxes are calculated and displayed during checkout. You agree to provide current, accurate billing information and authorize our payment processors to charge your designated payment instrument.</p>
      </>
    ),
  },
  {
    id: 'disclaimer-warranties',
    title: 'Disclaimer of Warranties & Mock Demonstrations',
    label: 'Warranties',
    icon: AlertTriangle,
    content: (
      <>
        <p>This website, its educational tutorials, and demonstration dashboards are provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express, statutory, or implied.</p>
        <p>All metrics, business numbers, and revenue figures displayed within portfolio dashboards are <em>synthetic or mock datasets</em> created strictly for UI/UX demonstration. They do not represent financial performance guarantees for your organization.</p>
      </>
    ),
  },
  {
    id: 'liability-limitation',
    title: 'Limitation of Legal Liability',
    label: 'Liability Cap',
    icon: Scale,
    content: (
      <>
        <p>To the maximum extent permitted by applicable law, in no event shall Datta Sable, affiliates, or contractors be liable for any indirect, incidental, special, consequential, or punitive damages—including loss of profits, data corruption, business interruption, or hardware failure—arising from your use or inability to use the site, templates, or consulting recommendations.</p>
        <p>Our total cumulative liability for any dispute or claim arising under these terms shall not exceed the actual amount paid by you to Datta Sable in the twelve (12) months preceding the event giving rise to liability.</p>
      </>
    ),
  },
  {
    id: 'governing-jurisdiction',
    title: 'Governing Law & Legal Jurisdiction',
    label: 'Jurisdiction',
    icon: Gavel,
    content: (
      <>
        <p>These Terms of Service and any contractual disputes arising from them shall be governed by, construed, and enforced exclusively in accordance with the laws of the <strong>Republic of India</strong>, without regard to conflict of law principles.</p>
        <p>Any dispute, controversy, or claim arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent civil courts located in <strong>Mumbai, Maharashtra, India</strong>.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <FileText size={15} aria-hidden="true" /> Legal &amp; operational agreement
          </div>
          <h1>
            Terms of service<br />
            <span>and acceptable use.</span>
          </h1>
          <p className={styles.intro}>
            Terms governing the use of this website, digital asset licenses, custom engineering retainers, and mutual obligations.
          </p>
          <div className={styles.updated}>
            <CalendarDays size={15} aria-hidden="true" />
            <span>Updated <time dateTime="2026-10-22">October 22, 2026</time></span>
            <span className={styles.divider} aria-hidden="true" />
            <span>Mutual transparency. Commercial licenses. Mumbai jurisdiction.</span>
          </div>
        </header>

        <div className={styles.contextNote}>
          <span className={styles.noteIcon}>
            <CheckCircle2 size={22} aria-hidden="true" />
          </span>
          <div>
            <h2>Clear terms for modern engineering.</h2>
            <p>
              These terms establish the operational boundaries and licensing parameters for all resources provided on dattasable.com. They protect both your commercial usage rights and our intellectual property.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="Terms of service sections">
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
              <p>Need custom enterprise licensing or bespoke contract terms?</p>
              <a href="#terms-contact">
                Contact Legal Desk <ArrowUpRight size={14} aria-hidden="true" />
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

            <section id="terms-contact" className={styles.contact} aria-labelledby="terms-contact-title">
              <div>
                <span className={styles.eyebrow}>Enterprise &amp; Contracts</span>
                <h2 id="terms-contact-title">Need custom contract terms or enterprise MSAs?</h2>
                <p>We work with enterprise clients globally on structured master service agreements, vendor setups, and mutual NDAs.</p>
              </div>
              <a href="mailto:info@dattasable.com" className={styles.contactButton}>
                Contact Contracts Desk <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
