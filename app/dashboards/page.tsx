'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Download, FileSpreadsheet, Grid2X2, Layers, LayoutDashboard, ListFilter, Search, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { SectionHeading, WorkDialog, WorkImage, WorkLink } from '@/components/showcase/Showcase';
import styles from '@/components/showcase/Showcase.module.css';
import gallery from './Gallery.module.css';
import { dashboards, type DashboardItem } from './catalog';
import { dashboardDestination, dashboardKind, filterDashboards } from './filters';
import { EXCEL_PROJECTS } from '@/data/excelProjects';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';

const scopes = [{ id: 'built', label: 'Interactive work', icon: LayoutDashboard }, { id: 'excel', label: 'Excel workbooks', icon: FileSpreadsheet }, { id: 'reference', label: 'Community references', icon: Layers }, { id: 'concept', label: 'Concept studies', icon: Grid2X2 }];
const industries = ['All industries', 'Sales', 'Operations', 'Finance', 'HR', 'Marketing', 'Analytics'];
const tools = ['All tools', 'Excel', 'Power BI', 'Tableau', 'Looker', 'Python'];
function previewImage(item: DashboardItem) { return item.id === 7 ? '/images/showcase/pipeline-interface.png' : item.image; }
function toolLabel(item: DashboardItem) { return item.tool === 'Internal' ? 'Web dashboard' : item.tool; }
function title(item: DashboardItem) { return item.title.replace(/ — Executive Sales Dashboard$/, '').replace(/ & FinTech Group/, ' FinTech'); }
function workbook(item: DashboardItem) { return EXCEL_PROJECTS.find(project => dashboardDestination(item) === `/dashboards/${project.slug}`); }

export default function DashboardsPage() {
  const [scope, setScope] = useState('built');
  const [category, setCategory] = useState('All industries');
  const [tool, setTool] = useState('All tools');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(8);
  const [preview, setPreview] = useState<DashboardItem | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = useMemo(() => {
    const rows = filterDashboards(dashboards, { scope, category, tool, search });
    const order = [7, 115, 102, 201, 103, 110, 202, 100];
    return scope === 'built' ? rows.sort((a, b) => (order.includes(a.id) ? order.indexOf(a.id) : 100) - (order.includes(b.id) ? order.indexOf(b.id) : 100)) : rows;
  }, [scope, category, tool, search]);
  const inScope = useMemo(() => filterDashboards(dashboards, { scope, category: 'All industries', tool: 'All tools', search: '' }), [scope]);
  const builtCount = dashboards.filter(item => dashboardKind(item) === 'built').length;
  function reset() { setCategory('All industries'); setTool('All tools'); setSearch(''); setVisible(8); }
  function changeScope(value: string) { setScope(value); reset(); }
  const currentScope = scopes.find(item => item.id === scope)!;
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={`boxed-wrapper ${gallery.boxedWrapper}`} style={{ position: 'relative', marginBottom: '40px', overflow: 'visible' }}>
        <Crosshair position="tl" />
        <div className={styles.main}>
    <section className={`${styles.hero} ${gallery.hero}`} aria-labelledby="dashboard-title">
      <div className={gallery.heroTopBanner}>
        <div className={gallery.heroCopyBlock}>
          <span className={styles.kicker}><i /> THE DASHBOARD COLLECTION</span>
          <h1 id="dashboard-title" className={gallery.heroTitle}>Less noise.<br /><span>More perspective.</span></h1>
          <p className={gallery.heroLead}>A gallery you can get your hands on. Explore interactive interfaces, inspect Excel models, and see how a business question becomes a clearer view.</p>
        </div>
        <div className={gallery.heroActionsBlock}>
          <div className={styles.actions}>
            <a className={styles.primary} href="#dashboard-gallery">Find your next dashboard <ArrowDown size={14} /></a>
            <WorkLink href="/portfolio">Meet the thinking behind it</WorkLink>
          </div>
          <div className={gallery.heroProof}>
            <span><Check size={12} /> {builtCount} linked demonstrations & tools</span>
            <span><FileSpreadsheet size={12} /> {EXCEL_PROJECTS.length} Excel project models</span>
          </div>
        </div>
      </div>
      <div className={gallery.landscapeDashboardContainer}>
        <ExecutiveDashboard />
      </div>
    </section>
    <div className={styles.indexBar}><span>MADE TO BE OPENED. BUILT TO BE UNDERSTOOD.</span><nav aria-label="Dashboard shortcuts"><a href="#dashboard-gallery">Explore the collection <ArrowDown size={11} /></a><Link href="/portfolio#selected-work">Read the case studies <ArrowUpRight size={11} /></Link><Link href="/portfolio#contact-section">Discuss a project <ArrowUpRight size={11} /></Link></nav></div>
    <section id="dashboard-gallery" className={`${styles.section} ${gallery.collection}`}><SectionHeading number="01" eyebrow="A MORE CONSIDERED COLLECTION" title="Find the view that fits."><p>Choose a discipline, explore a tool, or follow a business question. Every piece has room for a closer look.</p></SectionHeading>
      <div className={gallery.layout}>
        <aside className={gallery.sidebar} aria-label="Filter dashboards"><button className={gallery.filterToggle} aria-expanded={filtersOpen} aria-controls="dashboard-filters" onClick={() => setFiltersOpen(value => !value)}><ListFilter size={15} /><span>Refine your view</span>{(category !== 'All industries' || tool !== 'All tools' || scope !== 'built') && <span className={gallery.activeBadge}>{[scope !== 'built' ? currentScope.label : null, category !== 'All industries' ? category : null, tool !== 'All tools' ? tool : null].filter(Boolean).join(' · ')}</span>}<ChevronDown size={14} /></button><div id="dashboard-filters" className={gallery.sidebarContent} data-open={filtersOpen}>
          <div className={gallery.sidebarHead}><span>THE COLLECTION</span><small>{dashboards.length} ENTRIES</small></div><nav className={gallery.scopeNav} aria-label="Collection types">{scopes.map(item => <button key={item.id} aria-pressed={scope === item.id} onClick={() => changeScope(item.id)}><item.icon size={15} /><span>{item.label}</span><small>{filterDashboards(dashboards, { scope: item.id, category: 'All industries', tool: 'All tools', search: '' }).length}</small></button>)}</nav>
          <div className={gallery.filterGroup}><h3>BUSINESS CONTEXT</h3>{industries.map(value => <button key={value} aria-pressed={category === value} onClick={() => { setCategory(value); setVisible(8); }}><span className={gallery.radio} />{value}<small>{value === 'All industries' ? inScope.length : inScope.filter(item => item.category === value).length}</small></button>)}</div>
          <div className={gallery.filterGroup}><h3>BUILT WITH</h3>{tools.map(value => <button key={value} aria-pressed={tool === value} onClick={() => { setTool(value); setVisible(8); }}><span className={gallery.radio} />{value}</button>)}</div><button className={gallery.reset} onClick={reset}>Reset filters <ArrowUpRight size={11} /></button><div className={gallery.sidebarNote}><ShieldCheck size={16} /><p>Demonstration data is illustrative. Public references are credited separately from portfolio work.</p></div>
        </div></aside>
        <div className={gallery.results}>
          <div className={gallery.galleryToolbar}><div className={styles.search}><Search size={15} /><input value={search} onChange={event => { setSearch(event.target.value); setVisible(8); }} placeholder="Search dashboards, tools, or industries…" aria-label="Search dashboards" /></div><span className={gallery.viewLabel}><Grid2X2 size={14} /> LANDSCAPE VIEW</span></div>
          <div className={styles.resultBar}><span role="status">{filtered.length} {filtered.length === 1 ? 'result' : 'results'} · {currentScope.label}</span>{(category !== 'All industries' || tool !== 'All tools' || search) && <button className={gallery.clear} onClick={reset}>Clear filters</button>}</div>
          {scope === 'reference' && <p className={gallery.contextNote}>Public examples hosted by their original Tableau or Looker creators. These are inspiration and learning references, not claims of client work or authorship.</p>}
          {scope === 'concept' && <p className={gallery.contextNote}>Concept studies explore reporting problems and possible approaches. An interactive implementation is not currently linked for these entries.</p>}
          <div className={gallery.cardGrid}>{filtered.slice(0, visible).map(item => {
            const kind = dashboardKind(item), target = dashboardDestination(item), excel = workbook(item);
            const description = kind === 'reference' ? `A public ${toolLabel(item)} example exploring ${item.tags.slice(0, 2).join(' and ').toLowerCase()}. Open the original provider page to review the visualization and its creator.` : kind === 'concept' ? `A reporting concept for ${item.tags.slice(0, 3).join(', ').toLowerCase()}. Explore the study notes and potential use cases.` : item.desc;
            return <article className={`${styles.workCard} ${gallery.landscapeCard}`} key={item.id}><button className={`${styles.cardMedia} ${styles.mediaButton}`} onClick={() => setPreview(item)} aria-label={`Inspect ${item.title}`}><WorkImage src={previewImage(item)} alt={`${item.title} ${item.id === 7 || excel ? 'interface preview' : 'project cover'}`} sizes="(max-width: 500px) 45vw, (max-width: 1200px) 35vw, 22vw" /><span className={`${styles.badge} ${styles.mediaBadge}`}>{kind === 'reference' ? 'COMMUNITY REFERENCE' : kind === 'concept' ? 'CONCEPT STUDY' : excel ? 'EXCEL MODEL' : 'INTERACTIVE DEMO'}</span></button><div className={styles.cardContent}><div className={styles.cardMeta}><span>{item.category}</span><span>{toolLabel(item)}</span></div><h3>{title(item)}</h3><p>{description}</p><div className={styles.tags}>{(excel ? [`${excel.sheetsCount} sheets`, `${excel.totalRecordsCount.toLocaleString('en-IN')} sample rows`] : item.tags.slice(0, 2)).map(value => <span key={value}>{value}</span>)}</div><div className={styles.cardFooter}>{target ? <Link href={target} target={target.startsWith('http') ? '_blank' : undefined} rel={target.startsWith('http') ? 'noopener noreferrer' : undefined}>{kind === 'reference' ? 'View original' : 'Open dashboard'}<ArrowUpRight size={12} /></Link> : <span>Study notes</span>}<button onClick={() => setPreview(item)}>Details <ArrowUpRight size={12} /></button></div></div></article>;
          })}</div>
          {!filtered.length && <div className={styles.empty}><Search size={24} style={{ margin: '0 auto 14px' }} /><p>No dashboards match this combination. Try a different tool or a broader search.</p><button onClick={reset}>Reset filters</button></div>}
          {visible < filtered.length && <div className={styles.loadMore}><button className={styles.secondary} onClick={() => setVisible(value => value + 8)}>Show more dashboards <ArrowDown size={14} /></button></div>}
          <div className={gallery.collectionFoot}><span>{Math.min(visible, filtered.length)} / {filtered.length} SHOWN</span><span>TAKE YOUR TIME. THE DETAILS MATTER.</span></div>
        </div>
      </div>
    </section>
    <section className={styles.section}><div className={styles.cta}><div><span className={styles.kicker}><i /> FOR YOUR NEXT BUSINESS QUESTION</span><h2>Imagine this, built around your team.</h2><p>Let’s discuss your reporting workflow, the decisions it needs to support, and a thoughtful way forward.</p></div><div className={styles.actions}><WorkLink primary href="/portfolio#contact-section">Discuss a dashboard</WorkLink><WorkLink href="/portfolio">View my portfolio</WorkLink></div></div></section>
        </div>
        <Crosshair position="br" />
      </div>
      <Footer />
    </div>
  );
}
