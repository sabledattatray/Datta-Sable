import CookiePreferencesButton from './CookiePreferencesButton';
import AdvertisingPreferencesButton from './AdvertisingPreferencesButton';
import Link from 'next/link';
import LogoIcon from './LogoIcon';
import styles from './Footer.module.css';
import { ArrowUpRight, Mail, MapPin, Phone, BarChart3, BookOpen, LayoutDashboard, Zap, BrainCircuit, PieChart, Database, Code2, User, MessageSquare, Users, GitBranch, LucideIcon, Globe, PenTool, Sparkles, Activity, Library, Search, Shield, Layers, ShieldCheck } from 'lucide-react';
import {
  MicrosoftCertifiedBadge,
  SslSecurityBadge,
  ConfidentialityBadge,
  QualityAssuranceBadge,
} from './TrustBadgeIcons';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

interface NavSection {
  heading: string;
  links: NavLink[];
}

interface TrustPillar {
  badgeComponent: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  desc: string;
  badge: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    badgeComponent: MicrosoftCertifiedBadge,
    title: 'Certified BI Specialist',
    desc: 'Microsoft Certified Power BI & Data Analyst with 10+ years delivering production-grade enterprise intelligence.',
    badge: 'Microsoft Certified',
  },
  {
    badgeComponent: SslSecurityBadge,
    title: 'Bank-Grade 256-Bit SSL',
    desc: 'End-to-end TLS security across all sessions, authenticated digital downloads, and protected payment transactions.',
    badge: '256-Bit SSL / TLS',
  },
  {
    badgeComponent: ConfidentialityBadge,
    title: 'Strict Client Confidentiality',
    desc: '100% data privacy guarantee. Enterprise NDA standard with zero third-party telemetry or client data sharing.',
    badge: 'NDA & Privacy',
  },
  {
    badgeComponent: QualityAssuranceBadge,
    title: 'Production Quality Assured',
    desc: 'Battle-tested formulas, verified DAX models, automated ETL workflows, and transparent audit documentation.',
    badge: 'Quality Guarantee',
  },
];

const NAV_LINKS: NavSection[] = [
  {
    heading: 'Work',
    links: [
      { label: 'Start Here',    href: '/start-here', icon: Sparkles },
      { label: 'Portfolio',     href: '/portfolio', icon: BarChart3 },
      { label: 'Digital Products', href: '/products', icon: Sparkles },
      { label: 'Certifications',  href: '/certification', icon: Sparkles },
      { label: 'Case Studies',  href: '/portfolio?category=Analysis', icon: BookOpen },
      { label: 'Dashboards',    href: '/portfolio?category=Dashboard', icon: LayoutDashboard },
      { label: 'Automation',    href: '/portfolio?category=Automation', icon: Zap },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'BI Consulting',      href: '/services/consulting', icon: BrainCircuit },
      { label: 'Dashboard Design',   href: '/services/dashboards', icon: PieChart },
      { label: 'Web Solutions',      href: '/services/web-solutions', icon: Globe },
      { label: 'Graphic Design',     href: '/services/graphic-design', icon: PenTool },
      { label: 'SEO Optimization',   href: '/services/seo-optimization', icon: Sparkles },
      { label: 'Automation Solutions', href: '/services/automation', icon: Zap },
    ],
  },
  {
    heading: 'Workspace',
    links: [
      { label: 'Aura FinTech BI (Excel)', href: '/dashboards/aura-capital-sales', icon: BarChart3 },
      { label: 'Open MIS Tool',    href: '/tools/open-mis',         icon: BarChart3 },
      { label: 'Excel Dashboard Generator', href: 'https://excel.dattasable.com/', icon: BarChart3, external: true },
      { label: 'Surgical Tools',   href: '/tools',                  icon: Zap },
      { label: 'Templates Hub',    href: '/templates',              icon: Library },
      { label: 'Workflow Chains',  href: '/chains',                 icon: GitBranch },
      { label: 'Knowledge Hub',    href: '/knowledge',              icon: BookOpen },
      { label: 'Infrastructure Hub', href: '/infrastructure',       icon: Layers },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'About',       href: '/about',                                   icon: User },
      { label: 'Contact',     href: '/contact',                                 icon: MessageSquare },
      { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/dattasable/',  icon: Users,          external: true },
      { label: 'Twitter / X', href: 'https://x.com/sabledattatray',             icon: MessageSquare,  external: true },
      { label: 'GitHub',      href: 'https://github.com/sabledattatray',        icon: Code2,          external: true },
      { label: 'YouTube',     href: 'https://www.youtube.com/@sabledatttatray', icon: Globe,          external: true },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Live Feed',      href: '/analytics-live', icon: Activity },
      { label: 'Technical Blog', href: '/blog',           icon: BookOpen },
      { label: 'AI Glossary',    href: '/glossary',       icon: Search },
      { label: 'Editorial Policy', href: '/editorial-policy', icon: Shield },
      { label: 'Disclaimer',     href: '/disclaimer',     icon: Shield },
      { label: 'HTML Sitemap',   href: '/sitemap',        icon: Globe },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Excel Dashboard Generator', href: 'https://excel.dattasable.com/', icon: BarChart3, external: true },
      { label: 'n8n Automation',   href: 'https://n8n.io',             icon: Zap,       external: true },
      { label: 'Live Analytics',    href: '/analytics-live',            icon: Activity },
      { label: 'Microsoft BI',     href: 'https://powerbi.microsoft.com/', icon: Database, external: true },
      { label: 'Next.js 15',       href: 'https://nextjs.org/',        icon: Code2,     external: true },
      { label: 'Vercel Cloud',     href: 'https://vercel.com/',        icon: Globe,     external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.invitation}>
          <div>
            <span className={styles.eyebrow}>Clarity in data. Confidence in decisions.</span>
            <h2>Let’s build something <span>that matters.</span></h2>
            <p>Thoughtful dashboards, reliable automation, and data systems built around your business.</p>
          </div>
          <Link href="/contact" className={styles.cta}>Let’s talk <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </div>

        {/* ── TRUST & SECURITY SHIELD SECTION ── */}
        <section className={styles.trustBar} aria-label="Enterprise trust and security assurance">
          <div className={styles.trustHeader}>
            <div className={styles.trustBadgeWrapper}>
              <div className={styles.trustShieldPill}>
                <span className={styles.trustPulseDot} aria-hidden="true" />
                <ShieldCheck size={14} className={styles.trustShieldIcon} aria-hidden="true" />
                <span>Enterprise Trust &amp; Security Shield</span>
              </div>
            </div>
            <div className={styles.trustMetaNote}>
              <span>Verified independent data practice</span>
              <span className={styles.trustDivider} aria-hidden="true">·</span>
              <span>256-Bit SSL / TLS Protected</span>
              <span className={styles.trustDivider} aria-hidden="true">·</span>
              <Link href="/certification" className={styles.trustCertLink}>
                View Certifications <ArrowUpRight size={11} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.trustGrid}>
            {TRUST_PILLARS.map((item, index) => {
              const BadgeComponent = item.badgeComponent;
              return (
                <article key={item.title} className={styles.trustCard}>
                  <div className={styles.trustCardTop}>
                    <div className={styles.trustIconWrap}>
                      <BadgeComponent size={72} />
                    </div>
                    <span className={styles.trustIndex} aria-hidden="true">0{index + 1}<span> / 04</span></span>
                  </div>
                  <span className={styles.trustTag}>{item.badge}</span>
                  <h3 className={styles.trustTitle}>{item.title}</h3>
                  <p className={styles.trustDesc}>{item.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="Datta Sable — Home">
              <span className={styles.logoMark}><LogoIcon className={styles.logoIcon} color="var(--accent)" /></span>
              <span>Datta Sable<span className={styles.brandCaption}>Business intelligence &amp; data strategy</span></span>
            </Link>
            <p className={styles.description}>Turning complex data into clear, practical solutions. Independent BI consulting, automated reporting, and data engineering from India.</p>

            {/* Brand Card Trust Badge */}
            <div className={styles.brandTrustBadge}>
              <div className={styles.brandTrustIcon}>
                <MicrosoftCertifiedBadge size={32} />
              </div>
              <div className={styles.brandTrustText}>
                <strong>Verified BI &amp; Analytics Practice</strong>
                <span>Microsoft Certified · End-to-End SSL Protection</span>
              </div>
            </div>

            <div className={styles.contact}>
              <a href="mailto:info@dattasable.com"><Mail size={16} aria-hidden="true" /><span>info@dattasable.com</span><ArrowUpRight size={13} aria-hidden="true" /></a>
              <a href="tel:+918010803756"><Phone size={16} aria-hidden="true" /><span>+91 8010803756</span></a>
              <span><MapPin size={16} aria-hidden="true" />Mumbai, Maharashtra, India</span>
            </div>
            <div className={styles.socials} aria-label="Follow Datta Sable">
              <a href="https://www.linkedin.com/in/dattasable/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a>
              <a href="https://github.com/sabledattatray" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
              <a href="https://www.youtube.com/@sabledatttatray?sub_confirmation=1" target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={13} aria-hidden="true" /></a>
            </div>
          </div>

          <nav className={styles.navigation} aria-label="Footer navigation">
            {NAV_LINKS.map(section => (
              <div key={section.heading} className={styles.column}>
                <h3>{section.heading}</h3>
                <ul>{section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>
                      <span>{link.label}</span>{link.external && <ArrowUpRight size={12} aria-hidden="true" />}
                    </Link>
                  </li>
                ))}</ul>
              </div>
            ))}
          </nav>
        </div>

        <p className={styles.notice}><strong>Independent by design.</strong> Datta Sable is an independent BI consultant and is not affiliated with, sponsored by, or related to the CodedThemes/AppSeed “Datta Able” admin dashboard template.</p>
        <div className={styles.bottom}>
          <div className={styles.legalHeading}><ShieldCheck size={19} aria-hidden="true"/><h3>Policies &amp; privacy</h3></div>
          <p className={styles.copyright}><span>© {year} Datta Sable.</span> <span>All rights reserved.</span></p>
          <nav className={styles.legal} aria-label="Legal and privacy">
            <Link href="/editorial-policy">Editorial policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refund policy</Link>
            <Link href="/delivery-policy">Delivery policy</Link>
            <Link href="/cookies">Cookies</Link>
            <div className={styles.privacyControls}>
              <CookiePreferencesButton />
              <AdvertisingPreferencesButton />
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
