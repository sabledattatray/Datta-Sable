'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, Plus, User, X } from 'lucide-react';
import LogoIcon from './LogoIcon';
import ThemeToggle from './ThemeToggle';
import HeaderAccount from './HeaderAccount';
import { navLinks, megaMenuData } from './navigationData';
import styles from './Navbar.module.css';

type Destination = { title: string; desc: string; href: string; icon: React.ReactNode };
type NavigationGroup = { featured: { title: string; desc: string; href: string }; items: Destination[] };
const groups = megaMenuData as Record<string, NavigationGroup>;
const introductions: Record<string, { title: string; desc: string }> = {
  Services: { title: 'From idea to working system.', desc: 'Thoughtful interfaces, connected data, and practical engineering.' },
  Portfolio: { title: 'See the thinking in the work.', desc: 'Explore interfaces, analytics, and automation through the project collection.' },
  Dashboards: { title: 'A clearer view of your data.', desc: 'Discover reporting experiences, dashboard examples, and analytical tools.' },
  Workspace: { title: 'Useful tools. Less friction.', desc: 'A place for practical resources, templates, and connected workflows.' },
  Blog: { title: 'Follow your next question.', desc: 'Explore technical guides and ideas across data, engineering, and AI.' },
  Connect: { title: 'Good work starts here.', desc: 'Meet the person behind the work, explore the channels, or start a conversation.' },
};

function AtlasArt() {
  return <div className={styles.atlas} aria-hidden="true"><svg viewBox="0 0 220 103" fill="none"><ellipse cx="110" cy="51" rx="88" ry="30" stroke="currentColor" strokeOpacity=".14" transform="rotate(-18 110 51)"/><ellipse cx="110" cy="51" rx="88" ry="30" stroke="currentColor" strokeOpacity=".1" transform="rotate(18 110 51)"/><path d="M32 51h156M110 10v83" stroke="currentColor" strokeOpacity=".12" strokeDasharray="3 5"/><rect x="88" y="29" width="44" height="44" rx="12" fill="var(--bg)" stroke="currentColor" strokeOpacity=".45"/><path d="M99 51l11-6 11 6-11 6-11-6zm0 7l11 6 11-6m-22-14l11-6 11 6" stroke="currentColor" strokeWidth="1.2"/><circle cx="32" cy="51" r="4" fill="var(--surface)" stroke="currentColor" strokeOpacity=".6"/><circle cx="188" cy="51" r="4" fill="currentColor"/><circle cx="110" cy="10" r="2.5" fill="currentColor" fillOpacity=".4"/><circle cx="110" cy="93" r="2.5" fill="currentColor" fillOpacity=".4"/></svg></div>;
}

function DestinationLink({ item, onSelect }: { item: Destination; onSelect: () => void }) {
  const external = item.href.startsWith('http');
  return <Link href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} onClick={onSelect} className={styles.destination}>
    <span className={styles.destinationIcon} aria-hidden="true">{item.icon}</span><div className={styles.destinationText}><h3>{item.title}</h3><p>{item.desc}</p></div><ArrowUpRight className={styles.destinationArrow} aria-hidden="true"/>
  </Link>;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open,setOpen] = useState<string|null>(null);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [mobileSection,setMobileSection] = useState<string|null>(null);
  const [scrolled,setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const closeMobile = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement|null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const active = open ? groups[open] : null;
  const intro = open ? introductions[open] : null;
  const closeAll = () => { setOpen(null);setMobileOpen(false);setMobileSection(null); };
  const cancelClose = () => { if(closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose();if(root.current?.querySelector('[id^="navigation-panel-"]')?.contains(document.activeElement))return;closeTimer.current=setTimeout(()=>setOpen(null),180); };

  useEffect(()=>{
    const update=()=>setScrolled(window.scrollY>20);
    update();window.addEventListener('scroll',update,{passive:true});
    const breakpoint=window.matchMedia('(min-width:1100px)');
    const resize=()=>{setOpen(null);setMobileOpen(false);setMobileSection(null);};
    breakpoint.addEventListener('change',resize);
    return()=>{window.removeEventListener('scroll',update);breakpoint.removeEventListener('change',resize);if(closeTimer.current)clearTimeout(closeTimer.current);};
  },[]);

  useEffect(()=>{
    if(!open&&!mobileOpen)return;
    const pointer=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node)){setOpen(null);setMobileOpen(false);}};
    const keyboard=(event:KeyboardEvent)=>{
      if(event.key==='Escape') {event.preventDefault();setOpen(null);setMobileOpen(false);if(mobileOpen)mobileTrigger.current?.focus();else lastTrigger.current?.focus();}
      if(event.key==='Tab'&&mobileOpen){
        const focusable=Array.from(root.current?.querySelector('#mobile-navigation')?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')||[]).filter(el=>el.getClientRects().length>0);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    document.addEventListener('pointerdown',pointer);document.addEventListener('keydown',keyboard);
    return()=>{document.removeEventListener('pointerdown',pointer);document.removeEventListener('keydown',keyboard);};
  },[open,mobileOpen]);

  useEffect(()=>{
    if(!mobileOpen)return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';closeMobile.current?.focus();
    return()=>{document.body.style.overflow=previous;};
  },[mobileOpen]);

  const focusPanel=(label:string)=>{
    setOpen(label);
    requestAnimationFrame(()=>root.current?.querySelector<HTMLElement>(`#navigation-panel-${label} a`)?.focus());
  };
  const accountRole=(session?.user as {role?:string}|undefined)?.role;

  return <>
    <header ref={root} className={`${styles.header} ${scrolled?styles.scrolled:''} ${open||mobileOpen?styles.expanded:''}`} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} onBlur={event=>{if(!mobileOpen&&!event.currentTarget.contains(event.relatedTarget as Node|null))setOpen(null);}}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label="Datta Sable — Home" onClick={closeAll}><span className={styles.logoMark}><LogoIcon color="var(--accent)"/></span><span className={styles.wordmark}><strong>Datta Sable</strong><span>DATA / DESIGN / ENGINEERING</span></span></Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">{navLinks.map(link=>link.mega?<Link key={link.label} href={link.href} className={styles.navLink} aria-expanded={open===link.label} aria-controls={`navigation-panel-${link.label}`} aria-current={pathname===link.href?'page':undefined} onMouseEnter={event=>{cancelClose();lastTrigger.current=event.currentTarget;setOpen(link.label);}} onClick={closeAll} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();lastTrigger.current=event.currentTarget;focusPanel(link.label);}}}>{link.label}<ChevronDown size={11}/></Link>:<Link key={link.label} href={link.href} className={styles.navLink} aria-current={pathname===link.href?'page':undefined} onMouseEnter={()=>setOpen(null)} onClick={closeAll}>{link.label}</Link>)}</nav>
        <div className={styles.actions}>
          <div className={styles.theme} onFocusCapture={()=>setOpen(null)}><ThemeToggle/></div>
          {session?<HeaderAccount name={session.user?.name} isAdmin={accountRole?.toUpperCase()==='ADMIN'} onSignOut={()=>signOut()}/>:<Link className={styles.signIn} aria-label="Sign in" href={`/sign-in?callbackUrl=${encodeURIComponent(pathname || "/")}`} onClick={closeAll}><User size={14}/><span>Sign in</span></Link>}
          <button ref={mobileTrigger} type="button" className={styles.menuToggle} aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={()=>{setOpen(null);setMobileOpen(value=>!value);}}>{mobileOpen?<X size={19}/>:<Menu size={19}/>}</button>
        </div>
      </div>
      {active&&intro&&open&&<div className={styles.mega} id={`navigation-panel-${open}`} onMouseEnter={cancelClose}>
        <div className={styles.megaInner}>
          <aside className={styles.spotlight}><span className={styles.kicker}><i/> EXPLORE / {open.toUpperCase()}</span><h2>{intro.title}</h2><p>{intro.desc}</p><AtlasArt/><Link href={active.featured.href} target={active.featured.href.startsWith('http')?'_blank':undefined} rel={active.featured.href.startsWith('http')?'noopener noreferrer':undefined} className={styles.featured} onClick={closeAll}><div><span>A PLACE TO BEGIN</span><strong>{active.featured.title}</strong></div><ArrowUpRight size={16}/></Link></aside>
          <div className={styles.directory}><div className={styles.directoryTop}><span>CHOOSE YOUR NEXT DIRECTION</span><Link className={styles.overview} href={navLinks.find(link=>link.label===open)?.href||'/'} onClick={closeAll}>Explore {open.toLowerCase()} <ArrowUpRight size={13}/></Link></div><div className={styles.menuGrid}>{active.items.map(item=><DestinationLink key={item.title} item={item} onSelect={closeAll}/>)}</div><div className={styles.directoryFoot}><span>{String(active.items.length).padStart(2,'0')} DESTINATIONS / {open.toUpperCase()}</span><button type="button" className={styles.closeDesktop} onClick={()=>{setOpen(null);lastTrigger.current?.focus();}}><kbd>ESC</kbd> Close panel</button></div></div>
        </div>
      </div>}
      {mobileOpen&&<div id="mobile-navigation" className={styles.mobilePanel} role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title"><div className={styles.mobileIntro}><div><span className={styles.kicker}><i/> THE NAVIGATION ATLAS</span><h2 id="mobile-navigation-title">Where to next?</h2></div><button ref={closeMobile} type="button" className={styles.closeMobile} aria-label="Close navigation panel" onClick={()=>{setMobileOpen(false);mobileTrigger.current?.focus();}}><X size={17}/></button></div><nav className={styles.mobileScroll} aria-label="Mobile navigation">
        {navLinks.map((link,i)=><div className={styles.mobileSection} key={link.label}>{link.mega?<><button className={styles.mobileTrigger} type="button" aria-expanded={mobileSection===link.label} aria-controls={`mobile-section-${link.label}`} onClick={()=>setMobileSection(current=>current===link.label?null:link.label)}><span className={styles.mobileIndex}>0{i+1}</span>{link.label}<Plus size={18}/></button>{mobileSection===link.label&&<div className={styles.mobileSubmenu} id={`mobile-section-${link.label}`}><Link className={styles.mobileOverview} href={link.href} onClick={closeAll}>EXPLORE ALL {link.label.toUpperCase()} <ArrowRight size={12}/></Link>{groups[link.label].items.map(item=><DestinationLink key={item.title} item={item} onSelect={closeAll}/>)}</div>}</>:<Link href={link.href} className={styles.mobileTrigger} onClick={closeAll}><span className={styles.mobileIndex}>0{i+1}</span>{link.label}<ArrowUpRight size={17}/></Link>}</div>)}
        <div className={styles.mobileFooter}><span>DATA / DESIGN / ENGINEERING</span><Link href="/about" onClick={closeAll}>Meet Datta <ArrowUpRight size={12}/></Link></div>
      </nav></div>}
    </header>
  </>;
}
