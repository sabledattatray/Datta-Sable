import Link from 'next/link';
import LogoIcon from './LogoIcon';
import { ArrowUpRight, Mail, MapPin, Clock, Phone, Smartphone, BarChart3, BookOpen, LayoutDashboard, Zap, BrainCircuit, PieChart, Database, Code2, User, MessageSquare, Users, GitBranch, Send, LucideIcon, Globe, PenTool, Sparkles, Activity, Library, Search, Shield, Layers } from 'lucide-react';

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

const NAV_LINKS: NavSection[] = [
  {
    heading: 'Work',
    links: [
      { label: 'Start Here',    href: '/start-here', icon: Sparkles },
      { label: 'Portfolio',     href: '/portfolio', icon: BarChart3 },
      { label: 'Case Studies',  href: '/portfolio?category=Analysis', icon: BookOpen },
      { label: 'Dashboards',    href: '/portfolio?category=Dashboard', icon: LayoutDashboard },
      { label: 'Automation',    href: '/portfolio?category=Automation', icon: Zap },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'BI Consulting',      href: '/services#consulting', icon: BrainCircuit },
      { label: 'Dashboard Design',   href: '/services#dashboards', icon: PieChart },
      { label: 'Web Solutions',      href: '/services#web-solutions', icon: Globe },
      { label: 'Graphic Design',     href: '/services#graphic-design', icon: PenTool },
      { label: 'SEO Optimization',   href: '/services#seo-optimization', icon: Sparkles },
      { label: 'n8n Automation',     href: '/services#n8n-automation', icon: Zap },
    ],

  },
  {
    heading: 'Workspace',
    links: [
      { label: 'Surgical Tools',   href: '/tools',          icon: Zap },
      { label: 'Templates Hub',    href: '/templates',      icon: Library },
      { label: 'Workflow Chains',  href: '/chains',         icon: GitBranch },
      { label: 'Knowledge Hub',    href: '/knowledge',      icon: BookOpen },
      { label: 'Infrastructure Hub', href: '/infrastructure', icon: Layers },
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
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Live Feed',       href: '/analytics-live', icon: Activity },
      { label: 'Technical Blog',  href: '/blog',           icon: BookOpen },
      { label: 'AI Glossary',     href: '/glossary',       icon: Search },
      { label: 'Privacy Policy',  href: '/privacy',        icon: Shield },
      { label: 'Disclaimer',      href: '/disclaimer',     icon: Shield },
      { label: 'Sitemap',         href: '/sitemap.xml',    icon: Globe, external: true },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'n8n Automation', href: 'https://n8n.io', icon: Zap, external: true },
      { label: 'Live Analytics',  href: '/analytics-live',  icon: Activity  },
      { label: 'Microsoft BI',   href: 'https://powerbi.microsoft.com/', icon: Database, external: true },
      { label: 'Next.js 15',     href: 'https://nextjs.org/',            icon: Code2,    external: true },
      { label: 'Vercel Cloud',   href: 'https://vercel.com/',            icon: Globe,    external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--footer-bg)',
        borderTop: '1px solid var(--border)',
        width: '100%',
        paddingTop: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Clean Solid Background */}


      <div 
        className="relative z-10 footer-container-pad"
        style={{ 
          maxWidth: '1448px', 
          margin: '0 auto', 
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-10">
          <div 
            className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between rounded-2xl bg-[var(--footer-card-bg)] border border-[var(--border)] transition-all duration-500 relative overflow-hidden footer-card-pad"
          >
            <div>
              <Link
                href="/"
                className="group no-underline"
                aria-label="Datta Sable - Home"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  marginBottom: '1.75rem',
                }}
              >
                <div className="p-2 bg-white/5 border border-white/10 rounded-sm group-hover:border-[var(--accent)] transition-all duration-500">
                  <LogoIcon className="w-6 h-6 group-hover:rotate-[30deg] transition-transform duration-500" color="var(--accent)" />
                </div>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                  className="group-hover:text-[var(--accent)] transition-colors"
                >
                  Datta Sable
                </span>
              </Link>

              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  maxWidth: '90%',
                  marginBottom: '1.5rem',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Premier <strong className="text-[var(--text)]">Business Intelligence Expert</strong> and <strong className="text-[var(--text)]">Data Strategy Consultant</strong> in India. Specializing in reliable <strong className="text-[var(--text)]">Automated Reporting Solutions</strong> and <strong className="text-[var(--text)]">Data Engineering</strong>.
              </p>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed mb-6 border-t border-white/10 pt-3">
                <em>Brand Notice:</em> Datta Sable is an independent BI consultant. This platform is not affiliated with, sponsored by, or related to the CodedThemes/AppSeed &quot;Datta Able&quot; admin dashboard template.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem', paddingTop: '1.5rem' }} className="border-t border-[var(--border)] border-opacity-60">
                <a
                  href="mailto:info@dattasable.com"
                  className="group/contact flex items-center gap-3 text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline"
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <Mail size={15} className="text-[var(--accent)] group-hover/contact:scale-110 transition-transform flex-shrink-0" />
                  info@dattasable.com
                </a>
                <a
                  href="tel:+918010803756"
                  className="group/contact flex items-center gap-3 text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline"
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <Phone size={15} className="text-[var(--accent)] group-hover/contact:scale-110 transition-transform flex-shrink-0" />
                  +91 8010803756
                </a>
                <span
                  className="flex items-center gap-3 text-[var(--muted)]"
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <MapPin size={15} className="text-[var(--accent)] flex-shrink-0" />
                  Mumbai, Maharashtra, India
                </span>

                {/* Official Theme-Aware Google Play Store Badge */}
                <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3.5 rounded-[8px] transition-all duration-300 no-underline transform hover:-translate-y-0.5"
                    style={{ 
                      background: 'var(--playstore-bg)',
                      border: '1px solid var(--playstore-border)',
                      minWidth: '170px',
                      padding: '10px 18px'
                    }}
                  >
                    {/* Official Google Play SVG Logo */}
                    <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.609 1.814C3.218 2.078 3 2.553 3 3.204v17.592c0 .651.218 1.126.609 1.39l.065.037L13.51 12.38 3.674 1.777l-.065.037z" fill="#00c853"/>
                      <path d="M17.411 16.142l-3.901-3.762 3.901-3.762.083.047 4.636 2.632c.66.375.66.985 0 1.36l-4.636 2.632-.083.053z" fill="#ffd54f"/>
                      <path d="M17.494 7.865L13.51 11.75 3.674 1.777C4.168 1.332 4.96.166 5.892.694l11.602 6.586.002.585z" fill="#2979ff"/>
                      <path d="M17.494 16.135l-.002.585-11.602 6.586c-.932.528-1.724-.638-2.218-1.083l9.836-9.973 3.986 3.885z" fill="#ff1744"/>
                    </svg>

                    <div className="flex flex-col text-left">
                      <span 
                        style={{ 
                          fontSize: '10px', 
                          fontFamily: 'Roboto, sans-serif', 
                          fontWeight: 500,
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px', 
                          color: 'var(--playstore-text)',
                          lineHeight: '11px',
                          marginBottom: '1px'
                        }}
                      >
                        GET IT ON
                      </span>
                      <span 
                        style={{ 
                          fontSize: '18px', 
                          fontFamily: 'Roboto, sans-serif', 
                          fontWeight: 600, 
                          color: 'var(--playstore-text)',
                          letterSpacing: '-0.3px',
                          lineHeight: '19px'
                        }}
                      >
                        Google Play
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Columns Glass Container */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:col-span-8 xl:col-span-8 gap-10 rounded-2xl bg-[var(--footer-card-bg)] border border-[var(--border)] transition-all duration-500 footer-card-pad"
          >
            {NAV_LINKS.map((col) => (
              <div key={col.heading} className="flex flex-col">
                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginBottom: '2rem',
                  }}
                  className="flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  {col.heading}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {col.links.map((lnk) => {
                    const IconComponent = lnk.icon;
                    return (
                      <li key={lnk.label}>
                        <Link
                          href={lnk.href}
                          target={lnk.external ? '_blank' : undefined}
                          rel={lnk.external ? 'noopener noreferrer' : undefined}
                          className="group/link flex items-center gap-2.5 text-[var(--muted)] hover:text-[var(--accent)] hover:translate-x-1 transition-all duration-300 no-underline"
                          style={{
                            fontSize: '0.9rem',
                            fontFamily: "'Syne', sans-serif",
                          }}
                        >
                          {IconComponent && (
                            <IconComponent size={14} className="text-[var(--muted)] group-hover/link:text-[var(--accent)] transition-colors flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
                          )}
                          <span>{lnk.label}</span>
                          {lnk.external && (
                            <ArrowUpRight size={12} className="opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="footer-bottom-pad"
        style={{
          background: 'var(--footer-bottom-bg)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div 
          className="flex flex-col items-center justify-center text-center gap-4 md:flex-row md:justify-between md:text-left"
          style={{ 
            maxWidth: '1448px', 
            margin: '0 auto', 
          }}
        >
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.8rem',
              color: 'var(--muted)',
            }}
          >
            <span className="hidden sm:inline">© {year} Datta Sable. Built for technical creators & enterprise BI architectures.</span>
            <span className="sm:hidden">© {year} Datta Sable. Enterprise BI Architect.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors no-underline" style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', fontWeight: 'bold' }}>
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors no-underline" style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', fontWeight: 'bold' }}>
              TERMS
            </Link>
            <Link href="/cookies" className="hover:text-[var(--accent)] transition-colors no-underline" style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', fontWeight: 'bold' }}>
              COOKIES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
