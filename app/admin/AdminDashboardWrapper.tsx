'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeProvider';
import { getCompanyProfile } from './org-actions';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Briefcase,
  Settings,
  Star,
  Edit,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Inbox,
  TrendingUp,
  Zap,
  Users,
  Building,
  CreditCard,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Terminal,
  LifeBuoy,
} from 'lucide-react';

const navItems = [
  {
    category: 'Core',
    links: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true, badge: null },
      { name: 'SEO Intelligence', href: '/admin/seo', icon: TrendingUp, exact: false },
      { name: 'Knowledge Graph', href: '/admin/knowledge', icon: Zap, exact: false },
      { name: 'Fabric Master', href: '/admin/fabric', icon: Layers, exact: false },
    ],
  },
  {
    category: 'Management',
    links: [
      {
        name: 'User Management',
        icon: Users,
        submenu: [
          { name: 'All Users', href: '/admin/users', exact: false },
          { name: 'Roles & Permissions', href: '/admin/users/roles', exact: false },
        ]
      },
      {
        name: 'Organization',
        icon: Building,
        submenu: [
          { name: 'Company Profile', href: '/admin/org/profile', exact: false },
          { name: 'Branches & Locations', href: '/admin/org/branches', exact: false },
        ]
      },
    ]
  },
  {
    category: 'Sales & Finance',
    links: [
      {
        name: 'Billing & Subscriptions',
        icon: CreditCard,
        submenu: [
          { name: 'Subscriptions', href: '/admin/billing/subs', exact: false },
          { name: 'Invoices', href: '/admin/billing/invoices', exact: false },
          { name: 'Payment Methods', href: '/admin/billing/methods', exact: false },
        ]
      },
      {
        name: 'Orders / Transactions',
        icon: ShoppingBag,
        submenu: [
          { name: 'Orders List', href: '/admin/orders', exact: false },
          { name: 'Transactions', href: '/admin/orders/transactions', exact: false },
        ]
      },
    ]
  },
  {
    category: 'Marketing & Analytics',
    links: [
      {
        name: 'Analytics',
        icon: BarChart3,
        submenu: [
          { name: 'Overview', href: '/admin/analytics', exact: false },
          { name: 'Traffic & Behavior', href: '/admin/analytics/traffic', exact: false },
          { name: 'Custom Reports', href: '/admin/analytics/reports', exact: false },
        ]
      },
      {
        name: 'Marketing',
        icon: Megaphone,
        submenu: [
          { name: 'Campaigns', href: '/admin/marketing/campaigns', exact: false },
          { name: 'Coupons & Deals', href: '/admin/marketing/coupons', exact: false },
        ]
      },
    ]
  },
  {
    category: 'CMS & Services',
    links: [
      {
        name: 'CMS',
        icon: Layers,
        submenu: [
          { name: 'Pages', href: '/admin/pages', exact: false },
          { name: 'Blog', href: '/admin/blog', exact: false },
          { name: 'Users & Subscribers', href: '/admin/users', exact: false },
          { name: 'Media Library', href: '/admin/cms/media', exact: false },
          { name: 'Projects', href: '/admin/projects', exact: false },
          { name: 'Services', href: '/admin/services', exact: false },
        ]
      },
      {
        name: 'Careers (ATS)',
        href: '/admin/careers',
        icon: Briefcase,
        exact: false
      },
    ]
  },
  {
    category: 'System Configuration',
    links: [
      {
        name: 'System Settings',
        icon: Settings,
        submenu: [
          { name: 'General Settings', href: '/admin/settings', exact: false },
          { name: 'Security & Auth', href: '/admin/settings/security', exact: false },
          { name: 'Integrations', href: '/admin/settings/integrations', exact: false },
        ]
      },
      {
        name: 'Notifications',
        icon: Bell,
        submenu: [
          { name: 'Inbox Messages', href: '/admin/messages', exact: false, badge: '4' },
          { name: 'Alerts & Events', href: '/admin/notifications/alerts', exact: false },
        ]
      },
      {
        name: 'Developer Tools',
        icon: Terminal,
        submenu: [
          { name: 'API Keys', href: '/admin/developer/keys', exact: false },
          { name: 'Webhooks', href: '/admin/developer/webhooks', exact: false },
          { name: 'System Logs', href: '/admin/developer/logs', exact: false },
        ]
      },
    ]
  },
  {
    category: 'Support',
    links: [
      {
        name: 'Support / Tickets',
        icon: LifeBuoy,
        submenu: [
          { name: 'All Tickets', href: '/admin/support/tickets', exact: false },
          { name: 'Testimonials', href: '/admin/testimonials', exact: false },
        ]
      },
    ]
  }
];

export default function AdminDashboardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [companyName, setCompanyName] = useState('dattasable.');
  const [typography, setTypography] = useState({
    fontFamily: 'Inter',
    fontSize: '14px',
    color: '',
    fontWeight: '500',
  });

  useEffect(() => {
    const loadCompanyName = async () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('company_name');
        if (cached) setCompanyName(cached);
      }

      const profile = await getCompanyProfile();
      if (profile && profile.company_name) {
        setCompanyName(profile.company_name);
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_name', profile.company_name);
        }
      }
    };

    loadCompanyName();

    const handleProfileChange = () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('company_name');
        if (cached) setCompanyName(cached);
      }
    };

    window.addEventListener('company_profile_changed', handleProfileChange);
    return () => {
      window.removeEventListener('company_profile_changed', handleProfileChange);
    };
  }, []);


  const isDark = theme === 'dark';

  // Load typography from localStorage
  useEffect(() => {
    const loadTypography = () => {
      const saved = localStorage.getItem('admin_typography');
      if (saved) {
        try {
          setTypography(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse typography settings in wrapper', e);
        }
      }
    };
    loadTypography();
    window.addEventListener('admin_typography_changed', loadTypography);
    return () => {
      window.removeEventListener('admin_typography_changed', loadTypography);
    };
  }, []);

  // Sync typography on route changes
  useEffect(() => {
    const saved = localStorage.getItem('admin_typography');
    if (saved) {
      try {
        setTypography(JSON.parse(saved));
      } catch (e) {}
    }
  }, [pathname]);

  // Inject selected Google Font dynamically
  useEffect(() => {
    if (typography.fontFamily && typography.fontFamily !== 'Inter' && typeof window !== 'undefined') {
      const linkId = 'google-font-import';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${typography.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    }
  }, [typography.fontFamily]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved !== null) setIsCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setNotifOpen(false);
      setProfileOpen(false);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  useEffect(() => {
    const close = () => { setProfileOpen(false); setNotifOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // FontAwesome for dashboard icons
  useEffect(() => {
    const existing = document.querySelector('link[data-fa]');
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-fa', '1');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('admin_sidebar_collapsed', String(next));
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const bypassLayout =
    pathname === '/admin/login' ||
    pathname?.startsWith('/admin/editor') ||
    pathname?.startsWith('/admin/auth');

  if (bypassLayout) return <>{children}</>;

  const userName = session?.user?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = session?.user?.email || 'admin@dattasable.com';

  const getGlow = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const r = parseInt(c.substring(0, 2), 16) || 99;
    const g = parseInt(c.substring(2, 4), 16) || 102;
    const b = parseInt(c.substring(4, 6), 16) || 241;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const defaultAccent = isDark ? '#6366f1' : '#4f46e5';
  const currentAccent = typography.color || defaultAccent;
  const currentAccentGlow = typography.color ? getGlow(typography.color, isDark ? 0.15 : 0.08) : (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(79,70,229,0.08)');

  // CSS variables for theming
  const css = isDark
    ? {
        bg: '#000000',
        surface: '#000000',
        surface2: '#121212',
        border: '#1a1a1a',
        text: '#f1f5f9',
        muted: '#64748b',
        accent: currentAccent,
        accentGlow: currentAccentGlow,
        headerBg: 'rgba(0,0,0,0.9)',
        sidebarBg: 'linear-gradient(180deg, #000000 0%, #000000 100%)',
        cardBg: '#000000',
        badgeBg: currentAccent,
        activeBg: currentAccentGlow,
        activeBorder: currentAccent,
        hoverBg: getGlow(currentAccent, 0.06),
        shadow: '0 4px 24px rgba(0,0,0,0.8)',
        glassBg: 'rgba(0,0,0,0.8)',
      }
    : {
        bg: '#f0f4ff',
        surface: '#ffffff',
        surface2: '#f8faff',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: currentAccent,
        accentGlow: currentAccentGlow,
        headerBg: 'rgba(255,255,255,0.92)',
        sidebarBg: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
        cardBg: '#ffffff',
        badgeBg: currentAccent,
        activeBg: currentAccentGlow,
        activeBorder: currentAccent,
        hoverBg: getGlow(currentAccent, 0.04),
        shadow: '0 4px 24px rgba(0,0,0,0.08)',
        glassBg: 'rgba(255,255,255,0.9)',
      };

  const sidebarW = isCollapsed ? 72 : 260;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: css.bg,
        color: css.text,
        fontFamily: typography.fontFamily !== 'Inter' ? `'${typography.fontFamily}', sans-serif` : "'Inter', sans-serif",
        fontSize: typography.fontSize || '14px',
        fontWeight: parseInt(typography.fontWeight) || 400,
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* ── Mobile overlay ── */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 65,
          }}
        />
      )}


      {/* Mobile sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 260,
          background: css.sidebarBg,
          borderRight: `1px solid ${css.border}`,
          zIndex: 70,
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(0,0,0,0.1)',
          overflowX: 'hidden',
        }}
        className="flex flex-col md:hidden"
      >
        <SidebarContent
          isCollapsed={false}
          isDark={isDark}
          css={css}
          pathname={pathname}
          isActive={isActive}
          navItems={navItems}
          userName={userName}
          userEmail={userEmail}
          userInitial={userInitial}
          onClose={() => setIsMobileOpen(false)}
          onToggleCollapse={toggleCollapse}
          onSignOut={() => signOut({ callbackUrl: '/' })}
          isMobile={true}
          companyName={companyName}
        />

      </aside>

      {/* Desktop sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: sidebarW,
          background: css.sidebarBg,
          borderRight: `1px solid ${css.border}`,
          zIndex: 50,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.3)' : '4px 0 24px rgba(0,0,0,0.05)',
          overflowX: 'hidden',
        }}
        className="hidden md:flex md:flex-col"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          isDark={isDark}
          css={css}
          pathname={pathname}
          isActive={isActive}
          navItems={navItems}
          userName={userName}
          userEmail={userEmail}
          userInitial={userInitial}
          onClose={() => setIsMobileOpen(false)}
          onToggleCollapse={toggleCollapse}
          onSignOut={() => signOut({ callbackUrl: '/' })}
          isMobile={false}
          companyName={companyName}
        />

      </aside>

      {/* ══════════ MAIN AREA ══════════ */}
      <div
        style={{
          marginLeft: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="md:ml-[260px]"
        data-collapsed={isCollapsed}
      >
        <style>{`
          [data-collapsed="true"] { margin-left: 0 !important; }
          @media (min-width: 768px) {
            [data-collapsed="false"] { margin-left: 260px !important; }
            [data-collapsed="true"] { margin-left: 72px !important; }
          }
        `}</style>

        {/* ── TOP HEADER ── */}
        <header
          style={{
            height: 64,
            background: css.headerBg,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${css.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 60,
            overflow: 'visible',
            boxShadow: isDark
              ? '0 1px 0 rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.2)'
              : '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          {/* Left: hamburger + search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: css.muted,
                padding: 8,
                borderRadius: 10,
                transition: 'background 0.15s, color 0.15s',
              }}
              className="flex items-center md:hidden"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = css.hoverBg;
                (e.currentTarget as HTMLElement).style.color = css.text;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'none';
                (e.currentTarget as HTMLElement).style.color = css.muted;
              }}
            >
              <Menu size={20} />
            </button>

            {/* Search bar */}
            <div
              style={{
                background: css.surface2,
                border: `1px solid ${css.border}`,
                borderRadius: 12,
                padding: '8px 14px',
                width: 260,
              }}
              className="hidden md:flex md:items-center md:gap-2"
            >
              <Search size={14} color={css.muted} />
              <span style={{ fontSize: 13, color: css.muted, userSelect: 'none' }}>
                Search console...
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 10,
                  color: css.muted,
                  background: css.surface,
                  border: `1px solid ${css.border}`,
                  borderRadius: 5,
                  padding: '1px 5px',
                  fontWeight: 600,
                }}
              >
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: theme + notifications + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* System live pill */}
            <div
              style={{
                padding: '5px 12px',
                background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 999,
              }}
              className="hidden sm:flex sm:items-center sm:gap-1.5"
            >
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                    opacity: 0.6,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    borderRadius: '50%',
                    width: 8,
                    height: 8,
                    background: '#10b981',
                  }}
                />
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.05em' }}>
                LIVE
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              style={{
                background: css.surface2,
                border: `1px solid ${css.border}`,
                cursor: 'pointer',
                color: css.muted,
                padding: 8,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                width: 38,
                height: 38,
              }}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = css.accentGlow;
                (e.currentTarget as HTMLElement).style.color = css.accent;
                (e.currentTarget as HTMLElement).style.borderColor = css.accent;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = css.surface2;
                (e.currentTarget as HTMLElement).style.color = css.muted;
                (e.currentTarget as HTMLElement).style.borderColor = css.border;
              }}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); }}
                style={{
                  background: css.surface2,
                  border: `1px solid ${css.border}`,
                  cursor: 'pointer',
                  color: css.muted,
                  padding: 8,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  transition: 'all 0.2s',
                  width: 38,
                  height: 38,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = css.accentGlow;
                  (e.currentTarget as HTMLElement).style.color = css.accent;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = css.surface2;
                  (e.currentTarget as HTMLElement).style.color = css.muted;
                }}
              >
                <Bell size={17} />
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    background: '#ef4444',
                    borderRadius: '50%',
                    border: `2px solid ${css.surface2}`,
                  }}
                />
              </button>

              {notifOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 320,
                    background: css.cardBg,
                    border: `1px solid ${css.border}`,
                    borderRadius: 16,
                    boxShadow: css.shadow,
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '14px 18px',
                      borderBottom: `1px solid ${css.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: css.text }}>Notifications</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: css.accent, fontWeight: 700 }}>
                      Mark all read
                    </button>
                  </div>
                  {[
                    { icon: '💬', text: 'New message from Sarah Johnson', time: '2 hrs ago', unread: true },
                    { icon: '⭐', text: 'Testimonial pending review', time: '5 hrs ago', unread: true },
                    { icon: '✅', text: 'Database backup completed', time: '1 day ago', unread: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 18px',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        background: n.unread ? css.accentGlow : 'transparent',
                        borderBottom: `1px solid ${css.border}`,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{n.icon}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: css.text, margin: 0 }}>{n.text}</p>
                        <p style={{ fontSize: 11, color: css.muted, margin: '2px 0 0' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 18px', textAlign: 'center' }}>
                    <Link href="/admin/messages" style={{ fontSize: 12, color: css.accent, fontWeight: 700, textDecoration: 'none' }}>
                      View all messages →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar / Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: 12,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    boxShadow: `0 0 0 2px ${css.surface}, 0 0 0 3px ${css.accent}40`,
                  }}
                >
                  {userInitial}
                </div>
                <ChevronDown size={12} color={css.muted} className="hidden sm:block" />
              </button>

              {profileOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 240,
                    background: css.cardBg,
                    border: `1px solid ${css.border}`,
                    borderRadius: 16,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                    zIndex: 9999,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${css.border}` }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    >
                      {userInitial}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: css.text, margin: 0 }}>{userName}</p>
                    <p style={{ fontSize: 11, color: css.muted, margin: '2px 0 4px', wordBreak: 'break-all' }}>{userEmail}</p>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: css.accentGlow,
                        color: css.accent,
                        border: `1px solid ${css.accent}30`,
                        padding: '2px 8px',
                        borderRadius: 999,
                        letterSpacing: '0.08em',
                      }}
                    >
                      ADMINISTRATOR
                    </span>
                  </div>
                  <Link
                    href="/"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, color: css.text, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <Globe size={14} color={css.muted} /> View Live Site
                  </Link>
                  <Link
                    href="/admin/settings"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, color: css.text, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <Settings size={14} color={css.muted} /> Security Settings
                  </Link>
                  <div style={{ height: 1, background: css.border, margin: '4px 0' }} />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      fontSize: 13,
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main
          style={{
            flex: 1,
            padding: pathname === '/admin' ? 0 : '28px 28px',
            overflowY: 'auto',
          }}
          className="admin-main-content"
        >
          <div
            style={{
              animation: 'fadeSlideIn 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {children}
          </div>
        </main>
      </div>

      <style>{`
        body, input, select, textarea, button, p, span, h1, h2, h3, h4, h5, h6, th, td, a, aside, nav, header, main {
          font-family: ${typography.fontFamily !== 'Inter' ? `'${typography.fontFamily}', sans-serif !important` : 'inherit'};
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${css.border}; border-radius: 999px; }
        @media (max-width: 768px) {
          .admin-main-content {
            padding: ${pathname === '/admin' ? '0' : '16px 16px'} !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Sidebar Inner Content (shared between mobile and desktop) ───
function SidebarContent({
  isCollapsed, isDark, css, pathname, isActive, navItems,
  userName, userEmail, userInitial, onClose, onToggleCollapse, onSignOut, isMobile,
  companyName,
}: {
  isCollapsed: boolean;
  isDark: boolean;
  css: Record<string, string>;
  pathname: string | null;
  isActive: (href: string, exact: boolean) => boolean;
  navItems: any[];
  userName: string;
  userEmail: string;
  userInitial: string;
  onClose: () => void;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  isMobile: boolean;
  companyName: string;
}) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  useEffect(() => {
    // Automatically expand the submenu containing the active item
    const newExpanded: Record<string, boolean> = {};
    navItems.forEach((group: any) => {
      group.links.forEach((link: any) => {
        if (link.submenu) {
          const hasActiveChild = link.submenu.some((sub: any) => isActive(sub.href, !!sub.exact));
          if (hasActiveChild) {
            newExpanded[link.name] = true;
          }
        }
      });
    });
    setExpandedMenus(prev => ({ ...newExpanded, ...prev }));
  }, [pathname, navItems]);

  return (
    <>
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: isCollapsed ? '0 16px' : '0 20px',
          borderBottom: `1px solid ${css.border}`,
          gap: 10,
          flexShrink: 0,
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: 16,
              flexShrink: 0,
              boxShadow: `0 4px 12px ${css.accent}40`,
            }}
          >
            {companyName ? companyName.charAt(0).toUpperCase() : 'D'}
          </div>
          {!isCollapsed && (
            <span
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: css.text,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {companyName.endsWith('.') ? (
                <>
                  {companyName.slice(0, -1)}
                  <span style={{ color: css.accent }}>.</span>
                </>
              ) : (
                companyName
              )}
            </span>
          )}

        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: css.muted,
              display: 'flex',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '12px 8px' : '12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {navItems.map((group: any) => (
          <div key={group.category} style={{ marginBottom: 4 }}>
            {!isCollapsed ? (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: isDark ? 'rgba(255, 255, 255, 0.45)' : css.muted,
                  textTransform: 'uppercase',
                  padding: '10px 10px 4px',
                  margin: 0,
                }}
              >
                {group.category}
              </p>
            ) : (
              <div style={{ height: 1, background: css.border, margin: '8px 4px' }} />
            )}
            {group.links.map((link: any) => {
              const hasSubmenu = !!link.submenu;
              const active = hasSubmenu 
                ? link.submenu.some((sub: any) => isActive(sub.href, !!sub.exact))
                : isActive(link.href, !!link.exact);
              const isExpanded = !!expandedMenus[link.name];
              const Icon = link.icon;

              return (
                <div key={link.name} style={{ display: 'flex', flexDirection: 'column' }}>
                  {hasSubmenu ? (
                    <button
                      onClick={() => {
                        if (isCollapsed) {
                          onToggleCollapse();
                          setExpandedMenus(prev => ({ ...prev, [link.name]: true }));
                        } else {
                          toggleSubmenu(link.name);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: isCollapsed ? '10px 0' : '9px 10px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13.5,
                        fontWeight: active ? 700 : 500,
                        color: active ? (isDark ? '#ffffff' : css.accent) : (isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted),
                        background: active ? css.activeBg : 'transparent',
                        borderLeft: active && !isCollapsed ? `3px solid ${css.activeBorder}` : '3px solid transparent',
                        transition: 'all 0.15s',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        marginBottom: 1,
                        position: 'relative',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = css.hoverBg;
                          (e.currentTarget as HTMLElement).style.color = isDark ? '#ffffff' : css.text;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted;
                        }
                      }}
                    >
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {!isCollapsed && (
                        <>
                          <span style={{ flex: 1 }}>{link.name}</span>
                          <ChevronDown 
                            size={14} 
                            style={{ 
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                              color: 'inherit',
                              opacity: 0.7
                            }} 
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      title={isCollapsed ? link.name : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: isCollapsed ? '10px 0' : '9px 10px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        fontSize: 13.5,
                        fontWeight: active ? 700 : 500,
                        color: active ? (isDark ? '#ffffff' : css.accent) : (isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted),
                        background: active ? css.activeBg : 'transparent',
                        borderLeft: active && !isCollapsed ? `3px solid ${css.activeBorder}` : '3px solid transparent',
                        transition: 'all 0.15s',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        marginBottom: 1,
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = css.hoverBg;
                          (e.currentTarget as HTMLElement).style.color = isDark ? '#ffffff' : css.text;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted;
                        }
                      }}
                    >
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {!isCollapsed && (
                        <>
                          <span style={{ flex: 1 }}>{link.name}</span>
                          {link.badge && (
                            <span
                              style={{
                                background: css.accent,
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '1px 7px',
                                borderRadius: 999,
                              }}
                            >
                              {link.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )}

                  {/* Nested Submenu rendering */}
                  {hasSubmenu && isExpanded && !isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 24, gap: 1, marginTop: 1, marginBottom: 4 }}>
                      {link.submenu.map((sub: any) => {
                        const subActive = isActive(sub.href, !!sub.exact);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '7px 10px',
                              borderRadius: 8,
                              textDecoration: 'none',
                              fontSize: 12.5,
                              fontWeight: subActive ? 700 : 500,
                              color: subActive ? (isDark ? '#ffffff' : css.accent) : (isDark ? 'rgba(255, 255, 255, 0.55)' : css.muted),
                              background: subActive ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)') : 'transparent',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                              if (!subActive) {
                                (e.currentTarget as HTMLElement).style.background = css.hoverBg;
                                (e.currentTarget as HTMLElement).style.color = isDark ? '#ffffff' : css.text;
                              }
                            }}
                            onMouseLeave={e => {
                              if (!subActive) {
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = isDark ? 'rgba(255, 255, 255, 0.55)' : css.muted;
                              }
                            }}
                          >
                            <span style={{ flex: 1 }}>{sub.name}</span>
                            {sub.badge && (
                              <span
                                style={{
                                  background: css.accent,
                                  color: '#fff',
                                  fontSize: 9,
                                  fontWeight: 700,
                                  padding: '1px 5px',
                                  borderRadius: 999,
                                }}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar footer */}
      <div
        style={{
          padding: isCollapsed ? '12px 8px' : '12px 16px',
          borderTop: `1px solid ${css.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* User mini-card */}
        {!isCollapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: css.surface2,
              borderRadius: 12,
              border: `1px solid ${css.border}`,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 12, color: css.text, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {userName}
              </p>
              <p style={{ fontSize: 10, color: css.muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </p>
            </div>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              padding: '8px',
              background: 'none',
              border: `1px solid ${css.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted,
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = css.hoverBg;
              (e.currentTarget as HTMLElement).style.color = isDark ? '#ffffff' : css.text;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'none';
              (e.currentTarget as HTMLElement).style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : css.muted;
            }}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> <span>Collapse</span></>}
          </button>
        )}
      </div>
    </>
  );
}
