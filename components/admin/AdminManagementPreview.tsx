'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, Globe2, Mail, Plus, Search, Users } from 'lucide-react';
import styles from './AdminCommon.module.css';

const articles = [
  { title: 'A practical guide to Microsoft Fabric', category: 'Microsoft Fabric', status: 'Published', date: '22 Oct 2026', views: '2,480' },
  { title: 'Designing dashboards that make decisions easier', category: 'Power BI', status: 'Published', date: '21 Oct 2026', views: '1,362' },
  { title: 'A thoughtful foundation for your data platform', category: 'Data engineering', status: 'Draft', date: '20 Oct 2026', views: '—' },
  { title: 'From manual reports to reliable automation', category: 'Automation', status: 'Published', date: '19 Oct 2026', views: '986' },
];

export default function AdminManagementPreview() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All articles');
  const rows = articles.filter(article => article.title.toLowerCase().includes(search.toLowerCase()) && (tab === 'All articles' || article.status === tab));
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.headerCopy}><div className={styles.eyebrow}><span className={styles.eyebrowDot} /> CONTENT STUDIO</div><h1 className={styles.title}>Ideas worth sharing.<br /><span className={styles.titleAccent}>Beautifully organized.</span></h1><p className={styles.subtitle}>Your articles, drafts, and publishing workflow. Give every idea the space it deserves.</p></div><div className={styles.headerActions}><Link className={styles.secondary} href="/admin-design-preview">Overview <ArrowUpRight size={14} /></Link><Link className={styles.primary} href="/admin-design-preview?view=settings"><Plus size={14} /> Preview settings</Link></div></header>
    <div className={styles.notice}>Design preview · Illustrative records only. Search and filters work with the sample articles below.</div>
    <section className={styles.metricGrid} aria-label="Sample workspace metrics">{[
      { label: 'Published articles', value: '122', detail: 'Your ideas, out in the world', icon: FileText },
      { label: 'Drafts in progress', value: '8', detail: 'A little more room to refine', icon: Mail },
      { label: 'Recorded page views', value: '24,812', detail: 'Sample audience activity', icon: Globe2 },
      { label: 'User accounts', value: '39', detail: 'A growing community', icon: Users },
    ].map(metric => <div className={styles.metricCard} key={metric.label}><div className={styles.metricTop}>{metric.label}<metric.icon size={16} /></div><strong className={styles.metricValue}>{metric.value}</strong><div className={styles.metricBottom}>{metric.detail}</div></div>)}</section>
    <div className={styles.panel}>
      <div className={styles.panelHeading}><div><div className={styles.eyebrow}>YOUR PUBLISHING DESK</div><h2>Article library</h2></div><span className={styles.badgeNeutral}>{rows.length} sample articles</span></div>
      <div className={styles.headerActions} style={{ justifyContent: 'space-between', alignItems: 'start' }}><div className={styles.tabs}>{['All articles', 'Published', 'Draft'].map(label => <button className={`${styles.tabButton} ${tab === label ? styles.tabButtonActive : ''}`} key={label} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>)}</div><div className={styles.searchBar}><Search size={15} /><input aria-label="Search sample articles" placeholder="Search your articles…" value={search} onChange={event => setSearch(event.target.value)} /></div></div>
      <div className={styles.tableWrapper}><table className={styles.table}><thead><tr>{['Article', 'Status', 'Updated', 'Views'].map(title => <th className={styles.th} key={title}>{title}</th>)}</tr></thead><tbody>{rows.map(article => <tr className={styles.tr} key={article.title}><td className={styles.td}><strong style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>{article.title}</strong><small style={{ color: 'var(--muted)' }}>{article.category}</small></td><td className={styles.td}><span className={article.status === 'Published' ? styles.badge : styles.badgeNeutral}>{article.status === 'Published' && <span className={styles.badgeLiveDot} />}{article.status}</span></td><td className={styles.td} style={{ whiteSpace: 'nowrap' }}>{article.date}</td><td className={styles.td}>{article.views}</td></tr>)}{!rows.length && <tr><td className={styles.td} colSpan={4}>No matching sample articles. Try another search.</td></tr>}</tbody></table></div>
    </div>
    <section className={styles.panel}><div className={styles.sectionTitle}><span className={styles.sectionIcon}><FileText size={20} /></span><div><h2>A consistent workspace, everywhere.</h2><p>The shared cards, forms, tables, and page headers carry through the management pages.</p></div></div></section>
  </div>;
}
