'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ArrowUpRight, Bell, ChevronDown, ChevronLeft, ChevronRight, Command, Globe, LayoutGrid, LogOut, Menu, Moon, Search, Settings, ShieldCheck, Sun, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { readLocalStorage, writeLocalStorage } from '@/lib/browser-storage';
import { getCompanyProfile } from './org-actions';
import { activeAdminDestination, adminDestinations, adminNavigation } from '@/components/admin/navigation';
import styles from '@/components/admin/AdminWorkspace.module.css';

export default function AdminDashboardWrapper({ children, previewOnly = false, previewPath = '/admin/marketing/campaigns' }: { children: React.ReactNode; previewOnly?: boolean; previewPath?: string }) {
  const currentPath = usePathname();
  const pathname = previewOnly ? previewPath : currentPath || '/admin';
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [companyName, setCompanyName] = useState('Datta Sable');
  const mobilePanel = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const searchPanel = useRef<HTMLDivElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const dropdowns = useRef<HTMLDivElement>(null);
  const active = activeAdminDestination(pathname);
  const userName = previewOnly ? 'Design preview' : session?.user?.name || 'Administrator';
  const userEmail = previewOnly ? 'Sample workspace · no live data' : session?.user?.email || '';

  useEffect(() => {
    setCollapsed(readLocalStorage('admin_sidebar_collapsed') === 'true');
    if (previewOnly) return;
    const update = () => setCompanyName(readLocalStorage('company_name') || 'Datta Sable');
    update();
    let disposed = false;
    getCompanyProfile().then(profile => {
      if (!disposed && profile?.company_name) {
        setCompanyName(profile.company_name);
        writeLocalStorage('company_name', profile.company_name);
      }
    }).catch(() => {});
    window.addEventListener('company_profile_changed', update);
    return () => { disposed = true; window.removeEventListener('company_profile_changed', update); };
  }, [previewOnly]);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); setNotificationsOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeMobile = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeMobile);
    return () => desktop.removeEventListener('change', closeMobile);
  }, []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen(open => !open); setQuery('');
      }
      if (event.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); setProfileOpen(false); setNotificationsOpen(false); }
    };
    const outside = (event: PointerEvent) => {
      if (!dropdowns.current?.contains(event.target as Node)) { setProfileOpen(false); setNotificationsOpen(false); }
    };
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); };
  }, []);

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const panel = searchOpen ? searchPanel.current : mobilePanel.current;
    const trigger = searchOpen ? searchTrigger.current : mobileTrigger.current;
    const nodes = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex="0"]') || []).filter(node => node.getClientRects().length);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nodes()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = nodes(), first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', trap); trigger?.focus(); };
  }, [mobileOpen, searchOpen]);

  const bypass = pathname === '/admin/login' || pathname.startsWith('/admin/editor') || pathname.startsWith('/admin/auth');
  if (bypass) return <>{children}</>;
  const toggleCollapsed = () => { setCollapsed(!collapsed); writeLocalStorage('admin_sidebar_collapsed', String(!collapsed)); };
  const results = adminDestinations.filter(item => `${item.label} ${item.parent} ${item.group}`.toLowerCase().includes(query.toLowerCase()));

  return <div className={styles.workspace} data-sidebar-collapsed={collapsed}>
    <a className={styles.skipLink} href="#admin-content">Skip to workspace content</a>
    {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} aria-hidden="true" />}
    <aside className={styles.desktopSidebar} aria-label="Administration sidebar" inert={searchOpen || undefined}>
      <Sidebar collapsed={collapsed} pathname={pathname} companyName={companyName} userName={userName} userEmail={userEmail} onCollapse={toggleCollapsed} onExpand={() => { setCollapsed(false); writeLocalStorage('admin_sidebar_collapsed', 'false'); }} />
    </aside>
    <aside ref={mobilePanel} id="admin-mobile-sidebar" className={styles.mobileSidebar} data-open={mobileOpen} role="dialog" aria-label="Administration navigation" aria-modal={mobileOpen || undefined} aria-hidden={!mobileOpen || searchOpen} inert={!mobileOpen || searchOpen}>
      <Sidebar collapsed={false} pathname={pathname} companyName={companyName} userName={userName} userEmail={userEmail} onClose={() => setMobileOpen(false)} />
    </aside>
    <div className={styles.mainColumn} inert={mobileOpen || searchOpen || undefined}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button className={`${styles.iconButton} ${styles.mobileMenu}`} ref={mobileTrigger} onClick={() => setMobileOpen(true)} aria-label="Open administration navigation" aria-expanded={mobileOpen} aria-controls="admin-mobile-sidebar"><Menu size={19} /></button>
          <div className={styles.breadcrumb}><span>{active?.group || 'Workspace'}</span><ChevronRight size={12} /><strong>{active?.label || 'Administration'}</strong></div>
        </div>
        <div className={styles.topbarActions} ref={dropdowns}>
          <button ref={searchTrigger} className={styles.searchTrigger} onClick={() => { setQuery(''); setSearchOpen(true); }} aria-label="Search administration menu"><Search size={15} /><span>Find anything</span><kbd><Command size={10} /> K</kbd></button>
          <Link className={styles.siteLink} href="/" target="_blank" rel="noopener noreferrer">View site <ArrowUpRight size={13} /></Link>
          <button className={styles.iconButton} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <div className={styles.dropdownAnchor}>
            <button className={styles.iconButton} aria-label="Open notifications" aria-expanded={notificationsOpen} aria-controls="admin-notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}><Bell size={17} /></button>
            {notificationsOpen && <div className={styles.dropdown} id="admin-notifications"><div className={styles.dropdownHeading}><Bell size={16} /><strong>Your inbox</strong></div><p>Review customer enquiries, delivery jobs, and system alerts in their dedicated queues.</p><Link href="/admin/messages">Customer messages <ArrowUpRight size={14} /></Link><Link href="/admin/email-logs">Receipt delivery logs <ArrowUpRight size={14} /></Link><Link href="/admin/notifications/alerts">System alerts <ArrowUpRight size={14} /></Link></div>}
          </div>
          <div className={styles.dropdownAnchor}>
            <button className={styles.profileButton} aria-label="Open administrator profile" aria-expanded={profileOpen} aria-controls="admin-profile" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}><span className={styles.avatar}>{userName.charAt(0).toUpperCase()}</span><ChevronDown size={12} /></button>
            {profileOpen && <div className={styles.dropdown} id="admin-profile"><div className={styles.profileDetails}><strong>{userName}</strong><span>{userEmail}</span><small>ADMINISTRATOR</small></div><Link href="/admin/settings"><Settings size={15} /> Workspace settings</Link><Link href="/"><Globe size={15} /> Open website</Link><button disabled={previewOnly} onClick={() => signOut({ callbackUrl: '/' })}><LogOut size={15} /> Sign out</button></div>}
          </div>
        </div>
      </header>
      <main id="admin-content" tabIndex={-1} className={`${styles.content} admin-main-content`} data-overview={pathname === '/admin'}>{children}</main>
      <footer className={styles.workspaceFooter}><span>DATTA SABLE <span>/</span> ADMINISTRATION</span><span><ShieldCheck size={12} /> {previewOnly ? 'Design preview · sample data' : 'Private workspace'}</span></footer>
    </div>
    {searchOpen && <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}><div ref={searchPanel} className={styles.searchDialog} role="dialog" aria-modal="true" aria-label="Search administration" onClick={event => event.stopPropagation()}><div className={styles.commandInput}><Search size={19} /><input aria-label="Find an admin page" placeholder="Search pages, products, settings…" value={query} onChange={event => setQuery(event.target.value)} /><button className={styles.iconButton} aria-label="Close menu search" onClick={() => setSearchOpen(false)}><X size={17} /></button></div><div className={styles.commandResults}>{results.length ? results.map(item => <Link key={item.href} href={item.href} onClick={() => setSearchOpen(false)}><span><strong>{item.label}</strong><small>{item.group}{item.parent ? ` / ${item.parent}` : ''}</small></span><ArrowUpRight size={15} /></Link>) : <p>No pages found. Try “products”, “blog” or “settings”.</p>}</div><div className={styles.commandHint}>Navigate with Tab · Enter to open · Esc to close</div></div></div>}
  </div>;
}

function Sidebar({ collapsed, pathname, companyName, userName, userEmail, onCollapse, onExpand, onClose }: { collapsed: boolean; pathname: string; companyName: string; userName: string; userEmail: string; onCollapse?: () => void; onExpand?: () => void; onClose?: () => void }) {
  const active = activeAdminDestination(pathname);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('');
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) { setFilter(''); previousPath.current = pathname; }
    if (active?.parent) setExpanded(current => ({ ...current, [active.parent]: true }));
  }, [pathname, active?.parent]);
  const normalized = filter.trim().toLowerCase();
  const groups = adminNavigation.map(group => ({ ...group, items: group.items.filter(item => !normalized || item.label.toLowerCase().includes(normalized) || ('children' in item && item.children?.some(child => child.label.toLowerCase().includes(normalized)))) })).filter(group => group.items.length);

  return <>
    <div className={styles.sidebarBrand}><Link href="/admin" aria-label="Datta Sable administration"><span className={styles.brandMark}><LayoutGrid size={20} /></span>{!collapsed && <span><strong>{companyName}</strong><small>CONTROL ROOM</small></span>}</Link>{onClose && <button className={styles.iconButton} aria-label="Close administration navigation" onClick={onClose}><X size={18} /></button>}</div>
    {!collapsed && <div className={styles.sidebarSearch}><Search size={14} /><input aria-label="Filter navigation" placeholder="Filter navigation…" value={filter} onChange={event => setFilter(event.target.value)} />{filter && <button onClick={() => setFilter('')} aria-label="Clear navigation filter"><X size={13} /></button>}</div>}
    <nav className={styles.navigation} aria-label={onClose ? 'Mobile admin pages' : 'Admin pages'}>
      {groups.map(group => <div className={styles.navGroup} key={group.label}>{!collapsed && <div className={styles.groupLabel}>{group.label}</div>}{group.items.map(item => {
        const Icon = item.icon;
        const children = 'children' in item ? item.children : undefined;
        const parentActive = children?.some(child => child.href === active?.href);
        const isExpanded = !!expanded[item.label] || !!normalized;
        const menuId = `${onClose ? 'mobile' : 'desktop'}-${item.label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
        const className = `${styles.navItem} ${parentActive || ('href' in item && item.href === active?.href) ? styles.navActive : ''}`;
        return <div key={item.label}>{children ? <><button className={className} title={collapsed ? item.label : undefined} aria-label={collapsed ? `Expand ${item.label}` : undefined} aria-expanded={!collapsed && isExpanded} aria-controls={menuId} onClick={() => { if (collapsed) { onExpand?.(); setExpanded(current => ({ ...current, [item.label]: true })); } else setExpanded(current => ({ ...current, [item.label]: !isExpanded })); }}><Icon size={17} />{!collapsed && <><span>{item.label}</span><ChevronDown size={13} className={styles.menuChevron} data-expanded={isExpanded} /></>}</button><div id={menuId} className={styles.submenu} hidden={collapsed || !isExpanded}>{children.filter(child => !normalized || item.label.toLowerCase().includes(normalized) || child.label.toLowerCase().includes(normalized)).map(child => <Link href={child.href} key={child.href} aria-current={child.href === active?.href ? 'page' : undefined} onClick={onClose}>{child.label}{child.href === active?.href && <span className={styles.activeDot} />}</Link>)}</div></> : 'href' in item && item.href && <Link href={item.href} className={className} title={collapsed ? item.label : undefined} aria-label={collapsed ? item.label : undefined} aria-current={item.href === active?.href ? 'page' : undefined} onClick={onClose}><Icon size={17} />{!collapsed && <span>{item.label}</span>}</Link>}</div>;
      })}</div>)}
      {!groups.length && <p className={styles.noNavigation}>No matching pages.</p>}
    </nav>
    <div className={styles.sidebarFooter}>{!collapsed && <div className={styles.sidebarUser}><span className={styles.avatar}>{userName.charAt(0).toUpperCase()}</span><span><strong>{userName}</strong><small>{userEmail}</small></span><ShieldCheck size={14} /></div>}{onCollapse && <button className={styles.collapseButton} onClick={onCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={15} /><span>Collapse workspace</span></>}</button>}</div>
  </>;
}
