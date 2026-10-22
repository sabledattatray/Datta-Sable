import type { Metadata } from 'next';
import { ArrowUpRight, CalendarDays, Database, Eye, Globe, Lock, Mail, Megaphone, Share2, ShieldCheck, Sliders } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Datta Sable',
  description: 'Privacy Policy for dattasable.com — how we collect, use, and protect your personal data, including GDPR, CCPA, and Google AdSense disclosures.',
  openGraph: {
    title: 'Privacy Policy | Datta Sable',
    description: 'Privacy Policy for dattasable.com — data collection, usage, and protection practices.',
    url: 'https://dattasable.com/privacy',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Privacy Policy | Datta Sable', description: 'Privacy Policy for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/privacy' },
  robots: { index: true, follow: true },
};

const standards = [
  {
    id: 'introduction-scope',
    title: 'Introduction & Scope of Policy',
    label: 'Overview',
    icon: Lock,
    content: (
      <>
        <p>Welcome to <strong>dattasable.com</strong> (&quot;the Website&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated independently by <strong>Datta Sable</strong>, Principal Business Intelligence &amp; Data Engineering Consultant based in Mumbai, Maharashtra, India.</p>
        <p>We respect your privacy and are committed to protecting your personal data. This privacy policy informs you how we handle, process, and safeguard your personal information when you visit this website, interact with demonstration dashboards, purchase digital templates, or commission engineering services, regardless of where you access this site from.</p>
      </>
    ),
  },
  {
    id: 'data-collection',
    title: 'Categories of Personal Data We Collect',
    label: 'Data Collection',
    icon: Eye,
    content: (
      <>
        <p>We collect and process only the minimal data strictly required to deliver our services, divided into the following categories:</p>
        <ul>
          <li><strong>Identity Data:</strong> Includes your first name, last name, and profile username (collected when signing in via Google One-Tap or NextAuth).</li>
          <li><strong>Contact Data:</strong> Includes your email address and telephone numbers provided via the contact form or checkout portal.</li>
          <li><strong>Financial &amp; Transaction Data:</strong> When purchasing digital products, financial transactions are processed securely through PCI-DSS Level 1 compliant payment gateways (Razorpay, Stripe). We <strong>never</strong> store or have access to raw credit card numbers, CVVs, or bank account credentials on our servers.</li>
          <li><strong>Technical Data:</strong> Includes your internet protocol (IP) address, browser type and version, time zone setting, operating system, and hardware identifiers.</li>
          <li><strong>Usage Data:</strong> Aggregated information regarding pages viewed, session durations, technical articles read, and interactive dashboard filters exercised.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-usage',
    title: 'Purposes for Processing Personal Data',
    label: 'Data Usage',
    icon: Share2,
    content: (
      <>
        <p>We only use your personal data when lawful grounds exist under data protection statutes (including GDPR, Indian IT Act, and CCPA):</p>
        <ul>
          <li><strong>Digital Fulfillment:</strong> To authenticate your account session, process orders, and provide download access to purchased templates in your library.</li>
          <li><strong>Client Inquiries:</strong> To respond to enterprise inquiries, consulting proposals, and technical support requests submitted through our contact forms.</li>
          <li><strong>Performance Optimization:</strong> To diagnose latency issues, audit server logs, and monitor web vitals across global visitor locations.</li>
          <li><strong>Legal &amp; Regulatory Compliance:</strong> To maintain verifiable accounting records, dispute logs, and tax compliance documentation.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'advertising-adsense',
    title: 'Advertising & Cookie Disclosure (Google AdSense)',
    label: 'AdSense Compliance',
    icon: Megaphone,
    content: (
      <>
        <div className={styles.highlightBox}>
          <p>
            <strong>📢 Official Advertising Disclosure:</strong> This website, <strong>dattasable.com</strong>, has applied to and participates in the <strong>Google AdSense programme</strong>. When advertising is active, Google and third-party advertising vendors may use cookies, device identifiers, and similar technologies to serve and measure advertisements, including personalized ads based on your prior visits to this and other websites across the Internet, subject to your explicit consent choices where required by regional law.
          </p>
        </div>
        <p>Google&apos;s use of advertising cookies enables it and its certified advertising partners to serve relevant ads based on browsing history. You have complete freedom to control or disable personalized advertising at any time:</p>
        <ul>
          <li>Manage Google Ads personalization directly via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          <li>Opt out of third-party interest-based advertising via <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a> or <a href="https://youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">Your Online Choices (EU)</a>.</li>
          <li>Review Google&apos;s data practices at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Advertising Policies</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
        </ul>
        <p>Browsing this website does not automatically grant consent for advertising or analytics. You can adjust your consent choices at any time using the <em>Advertising Preferences</em> or <em>Cookie Preferences</em> buttons in the site footer.</p>
      </>
    ),
  },
  {
    id: 'gdpr-rights',
    title: 'GDPR & International Visitor Rights (EU / EEA / UK)',
    label: 'European Rights',
    icon: Globe,
    content: (
      <>
        <p>Under the General Data Protection Regulation (GDPR) and UK Data Protection Act, visitors from the European Economic Area enjoy extensive statutory rights:</p>
        <ul>
          <li><strong>Right of Access:</strong> Request a full copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> Request correction of incomplete or inaccurate data.</li>
          <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of your account and personal identifiers where no overriding legal obligation exists.</li>
          <li><strong>Right to Restrict or Object to Processing:</strong> Restrict automated processing or object to legitimate-interest handling.</li>
          <li><strong>Right to Data Portability:</strong> Receive your personal data in a structured, machine-readable format (.json or .csv).</li>
          <li><strong>Right to Withdraw Consent:</strong> Revoke previously granted consent for analytics or marketing at any time without negative consequence.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ccpa-rights',
    title: 'California Consumer Privacy Act (CCPA / CPRA)',
    label: 'California Rights',
    icon: Sliders,
    content: (
      <>
        <p>For residents of California, the California Consumer Privacy Act provides specific rights regarding personal information:</p>
        <ul>
          <li><strong>Right to Know &amp; Access:</strong> You may request disclosure of the specific pieces of personal information collected about you over the preceding 12 months.</li>
          <li><strong>No Sale of Personal Data:</strong> <strong>We do not sell, rent, or monetize your personal data to data brokers or third parties for monetary consideration.</strong></li>
          <li><strong>Non-Discrimination:</strong> We will never discriminate against you, deny access, or charge differential pricing because you exercised any of your CCPA privacy rights.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'security-retention',
    title: 'Data Security, Retention & Encryption Protocols',
    label: 'Security & Storage',
    icon: Database,
    content: (
      <>
        <p>All data transmitted between your browser and <strong>dattasable.com</strong> is strictly encrypted in transit using Transport Layer Security (TLS 1.3) with modern cryptographic cipher suites. Our database infrastructure enforces encrypted storage, strict access control lists, and automated vulnerability scanning.</p>
        <p>We retain personal information only for as long as strictly necessary to fulfill the operational purposes documented in this policy, satisfy accounting and audit regulations, or comply with statutory retention mandates under Indian law.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <ShieldCheck size={15} aria-hidden="true" /> Data protection &amp; transparency
          </div>
          <h1>
            Privacy policy<br />
            <span>and personal data protection.</span>
          </h1>
          <p className={styles.intro}>
            How Datta Sable collects, processes, and safeguards your personal information in full compliance with GDPR, CCPA, and global privacy standards.
          </p>
          <div className={styles.updated}>
            <CalendarDays size={15} aria-hidden="true" />
            <span>Updated <time dateTime="2026-10-22">October 22, 2026</time></span>
            <span className={styles.divider} aria-hidden="true" />
            <span>GDPR &amp; CCPA compliant. Google AdSense disclosure. Zero data selling.</span>
          </div>
        </header>

        <div className={styles.contextNote}>
          <span className={styles.noteIcon}>
            <Lock size={22} aria-hidden="true" />
          </span>
          <div>
            <h2>Your privacy is fundamental to our practice.</h2>
            <p>
              We treat visitor data with the same rigorous engineering discipline we apply to enterprise data systems. We collect only what is strictly necessary, never sell user data, and provide complete self-service controls over consent.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="Privacy policy sections">
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
              <p>Need to exercise your data rights or request account deletion?</p>
              <a href="#privacy-contact">
                Contact Data Protection <ArrowUpRight size={14} aria-hidden="true" />
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

            <section id="privacy-contact" className={styles.contact} aria-labelledby="privacy-contact-title">
              <div>
                <span className={styles.eyebrow}>Data Protection Office</span>
                <h2 id="privacy-contact-title">Have privacy questions or data requests?</h2>
                <p>Send an email to our data privacy desk to request an export of your stored details or initiate full account deletion.</p>
              </div>
              <a href="mailto:info@dattasable.com" className={styles.contactButton}>
                Contact Data Privacy Officer <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
