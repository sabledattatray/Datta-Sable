import type { Metadata } from 'next';
import { ArrowUpRight, BarChart3, CalendarDays, Cookie, Mail, Megaphone, Settings, ShieldCheck, Sliders, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Cookie Policy & Tracking Technologies | Datta Sable',
  description: 'Cookie Policy for dattasable.com — explaining how we use cookies, local storage, analytics, and Google AdSense preferences with full user control.',
  openGraph: {
    title: 'Cookie Policy | Datta Sable',
    description: 'Cookie Policy for dattasable.com — user controls and tracking transparency.',
    url: 'https://dattasable.com/cookies',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Cookie Policy | Datta Sable', description: 'Cookie Policy for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/cookies' },
  robots: { index: true, follow: true },
};

const standards = [
  {
    id: 'what-are-cookies',
    title: 'What Are Cookies & Web Storage Technologies?',
    label: 'Overview',
    icon: Cookie,
    content: (
      <>
        <p>Cookies are small text data files placed onto your computer, smartphone, or tablet when you visit websites. They are widely used by modern web platforms to make sites function reliably, maintain signed-in sessions, remember aesthetic preferences, and provide analytical telemetry.</p>
        <p>In addition to standard HTTP cookies, modern web applications utilize client-side storage technologies such as <code>localStorage</code> and <code>sessionStorage</code> to store client-side parameters (such as your light/dark theme preference and consent choices) without transmitting them across the network with every asset request.</p>
      </>
    ),
  },
  {
    id: 'essential-cookies',
    title: 'Strictly Essential & Operational Storage',
    label: 'Essential Storage',
    icon: ShieldCheck,
    content: (
      <>
        <p>Essential storage mechanisms are required for the fundamental operation, security, and rendering of <strong>dattasable.com</strong>. Because the website cannot function properly without them, they cannot be switched off in our preference controls:</p>
        <ul>
          <li><strong>Theme Preferences (<code>localStorage.theme</code>):</strong> Retains your selected color mode (Dark mode or Light mode) to prevent visual flashes during page navigation.</li>
          <li><strong>Authentication &amp; Session Tokens:</strong> Secure HTTP-only cookies utilized by NextAuth to maintain authenticated sessions when accessing your purchased resources library or administration console.</li>
          <li><strong>Consent State Records:</strong> LocalStorage keys (<code>analytics_consent_choice</code>) that record your affirmative acceptance or rejection of optional analytics.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'analytics-cookies',
    title: 'Analytics & Performance Telemetry (Google Analytics)',
    label: 'Analytics',
    icon: BarChart3,
    content: (
      <>
        <p>We utilize privacy-governed Google Analytics (GA4) with Google Consent Mode v2 to evaluate aggregate traffic patterns, monitor page loading speeds, and understand which technical guides resonate most with practitioners.</p>
        <p><strong>Consent-First Protection:</strong> On this website, optional analytics scripts and first-party visit tracking remain completely disabled until you grant affirmative consent via the cookie banner or footer preferences. If you decline, analytics scripts are never loaded into your browser session.</p>
      </>
    ),
  },
  {
    id: 'advertising-cookies',
    title: 'Advertising Cookies & Third-Party Vendors (Google AdSense)',
    label: 'Advertising',
    icon: Megaphone,
    content: (
      <>
        <p>This website has applied to and participates in the <strong>Google AdSense</strong> publisher programme. When advertising is active, Google and third-party advertising vendors may deploy cookies and identifiers to serve, personalize, and measure advertisements.</p>
        <div className={styles.highlightBox}>
          <p>
            <strong>Ad Controls:</strong> Advertising consent is managed independently from analytics. Where Google&apos;s certified Consent Management Platform (CMP) is displayed, you can review specific vendor permissions, adjust ad personalization settings, or revoke advertising consent at any time via the <em>Advertising Preferences</em> link in the site footer.
          </p>
        </div>
        <p>To opt out of personalized ad targeting globally across Google networks, visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">AboutAds.info</a>.</p>
      </>
    ),
  },
  {
    id: 'cookie-inventory',
    title: 'Detailed Storage & Cookie Inventory',
    label: 'Cookie Roster',
    icon: Settings,
    content: (
      <>
        <p>The following table details the primary cookies and local storage keys deployed on this platform:</p>
        <ul>
          <li><strong><code>theme</code> (localStorage):</strong> Functional preference. Persists your choice of Dark or Light theme. Duration: Persistent until cleared by user.</li>
          <li><strong><code>analytics_consent_choice</code> (localStorage):</strong> Consent record. Retains your acceptance or refusal of optional analytics. Duration: 12 months.</li>
          <li><strong><code>__Secure-next-auth.session-token</code> (Cookie):</strong> Essential security. Authenticates signed-in sessions over HTTPS. Duration: Session / 30 days.</li>
          <li><strong><code>_ga</code>, <code>_ga_*</code> (Cookie, Google):</strong> Optional analytics. Distinguishes unique users across sessions when consent is granted. Duration: Up to 2 years.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'managing-cookies',
    title: 'How to Manage, Control & Delete Cookies',
    label: 'User Control',
    icon: Trash2,
    content: (
      <>
        <p>You have full authority to manage and remove cookies at any time through multiple channels:</p>
        <ul>
          <li><strong>On-Site Preferences:</strong> Click the <strong>Cookie Preferences</strong> button in our website footer at any time to reopen your consent dialog and switch analytics tracking on or off. Withdrawing consent reloads the session without tracking scripts.</li>
          <li><strong>Browser Controls:</strong> All major web browsers (Chrome, Edge, Firefox, Safari) allow you to review stored cookies, block third-party trackers, or clear your browsing cache entirely. Consult your browser&apos;s Help menu for step-by-step guidance.</li>
          <li><strong>Global Privacy Control (GPC):</strong> We respect browser-level Global Privacy Control signals where technologically supported.</li>
        </ul>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <Cookie size={15} aria-hidden="true" /> Transparency &amp; privacy controls
          </div>
          <h1>
            Cookie policy<br />
            <span>and tracking technologies.</span>
          </h1>
          <p className={styles.intro}>
            Understand how cookies, local storage, analytics, and advertising preferences operate across dattasable.com with complete user control.
          </p>
          <div className={styles.updated}>
            <CalendarDays size={15} aria-hidden="true" />
            <span>Updated <time dateTime="2026-10-22">October 22, 2026</time></span>
            <span className={styles.divider} aria-hidden="true" />
            <span>Consent-first analytics. Self-service controls. Transparent storage.</span>
          </div>
        </header>

        <div className={styles.contextNote}>
          <span className={styles.noteIcon}>
            <Sliders size={22} aria-hidden="true" />
          </span>
          <div>
            <h2>You are in full control of your tracking settings.</h2>
            <p>
              Optional analytics and advertising cookies remain disabled by default until you affirmatively grant consent. You can modify or withdraw your preferences at any time through our self-service controls in the footer.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="Cookie policy sections">
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
              <p>Questions about tracking technologies or consent controls?</p>
              <a href="#cookie-help">
                Get in touch <ArrowUpRight size={14} aria-hidden="true" />
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

            <section id="cookie-help" className={styles.contact} aria-labelledby="cookie-help-title">
              <div>
                <span className={styles.eyebrow}>Privacy &amp; Compliance</span>
                <h2 id="cookie-help-title">Have questions regarding cookies or data tracking?</h2>
                <p>Reach out to our privacy officer with any questions or click Cookie Preferences in the footer to modify your settings.</p>
              </div>
              <a href="mailto:info@dattasable.com" className={styles.contactButton}>
                Contact Privacy Desk <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
