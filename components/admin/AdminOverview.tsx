'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, BookOpen, Briefcase, Check, ChevronRight, CirclePause, CirclePlay, Clock3, FileText, Globe2, Layers, Mail, Network, Plus, RefreshCw, Search, ShieldCheck, ShoppingBag, Users, WifiOff } from 'lucide-react';
import type { AdminOverviewData } from '@/lib/admin/overview';
import { publishingProgress } from '@/lib/admin/overview-display';
import styles from './AdminOverview.module.css';

function format(value: number | null | undefined) { return value == null ? '—' : value.toLocaleString('en-IN'); }
function timeLabel(value: string) { return new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
function dateLabel(value: string) { return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }

export default function AdminOverview({ previewData }: { previewData?: AdminOverviewData }) {
  const [data, setData] = useState<AdminOverviewData | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [paused, setPaused] = useState(false);
  const [clock, setClock] = useState('');
  const inFlight = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (previewData || (inFlight.current && !abort.current?.signal.aborted)) return;
    inFlight.current = true;
    const controller = new AbortController();
    abort.current = controller;
    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(response.status === 401 ? 'Your session has expired. Sign in again to refresh.' : 'Unable to refresh. Your last snapshot is still visible.');
      const next: AdminOverviewData = await response.json();
      setData(next);
      setError(next.availableSources === 0 ? 'Data sources are unavailable. Try refreshing shortly.' : '');
    } catch (caught) {
      if (!(caught instanceof Error && caught.name === 'AbortError')) setError(caught instanceof Error ? caught.message : 'Unable to refresh metrics.');
    } finally {
      if (abort.current === controller) { inFlight.current = false; setRefreshing(false); setLoading(false); }
    }
  }, [previewData]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }));
    tick(); const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    refresh();
    return () => { abort.current?.abort(); };
  }, [refresh]);
  useEffect(() => {
    if (paused || previewData) return;
    const update = () => { if (document.visibilityState === 'visible') refresh(); };
    const interval = setInterval(update, 60000);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', update); };
  }, [paused, previewData, refresh]);

  const counts = data?.counts;
  const connected = !!data?.availableSources && !error;
  const status = previewData ? 'SAMPLE DATA' : loading ? 'CONNECTING' : error ? 'REFRESH ISSUE' : paused ? 'UPDATES PAUSED' : data?.availableSources !== data?.sourceCount ? 'PARTIAL DATA' : 'AUTO REFRESH';
  const cards = [
    { label: 'Page views', value: counts?.views24h, detail: 'Recorded in the last 24 hours', icon: Globe2, href: '/admin/analytics/traffic' },
    { label: 'Published articles', value: counts?.published, detail: `${format(counts?.drafts)} drafts in your studio`, icon: FileText, href: '/admin/blog' },
    { label: 'Portfolio projects', value: counts?.projects, detail: 'Published work & case studies', icon: Briefcase, href: '/admin/projects' },
    { label: 'User accounts', value: counts?.users, detail: 'People in your community', icon: Users, href: '/admin/users' },
    { label: 'Subscribers', value: counts?.subscribers, detail: 'Your newsletter audience', icon: BookOpen, href: '/admin/users' },
    { label: 'Unread messages', value: counts?.unread, detail: 'Enquiries awaiting your attention', icon: Mail, href: '/admin/messages' },
  ];
  const traffic = data?.traffic;
  const peak = Math.max(...(traffic?.map(point => point.count) || [0]), 1);
  const points = traffic?.map((point, index) => `${24 + index * (712 / 23)},${190 - (point.count / peak) * 145}`).join(' ');
  const publishedRatio = publishingProgress(counts?.published, counts?.drafts);
  const quickActions = [
    { label: 'Write an article', desc: 'Open your content editor', href: '/admin/editor', icon: FileText },
    { label: 'Manage products', desc: 'Resources, pricing & delivery', href: '/admin/products', icon: ShoppingBag },
    { label: 'Create a campaign', desc: 'Reach your subscribers', href: '/admin/marketing/campaigns', icon: Mail },
    { label: 'Review payments', desc: 'Orders, refunds & receipts', href: '/admin/payments', icon: Layers },
  ];

  return <div className={styles.overview}>
    <div className={styles.pageIntro}><div><span className={styles.eyebrow}>YOUR CONTROL ROOM</span><h1>Workspace overview</h1></div><span className={styles.snapshotDate}>{data ? new Date(data.updatedAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }) : 'Your daily perspective'}</span></div>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><div className={styles.eyebrow}><span /> YOUR DIGITAL OPERATIONS, IN FOCUS</div><h2>Your next move.<br /><span>In clear view.</span></h2><p>A little clarity for everything you’re building. Publish your ideas, follow your audience, and keep business moving.</p><div className={styles.heroActions}><Link className={styles.primary} href="/admin/editor"><Plus size={15} /> Create an article</Link><Link className={styles.secondary} href="/" target="_blank" rel="noopener noreferrer">Open website <ArrowUpRight size={15} /></Link></div></div>
      <div className={styles.heroMonitor}><div className={styles.monitorTop}><span><Activity size={13} /> WORKSPACE PULSE</span><span>{clock || '—'} IST</span></div><div className={styles.monitorCenter}><div className={styles.orbital} aria-hidden="true"><div /><div /><span><Network size={31} strokeWidth={1.25} /></span><i /></div><div><strong>{previewData ? 'Design preview' : loading ? 'Connecting…' : connected ? 'Workspace connected' : 'Connection needs attention'}</strong><p>{previewData ? 'Illustrative metrics · no live requests' : connected ? `${data?.availableSources} of ${data?.sourceCount} data queries available` : 'Check the data source status below'}</p></div></div><div className={styles.attentionLinks}><Link href="/admin/blog"><span><FileText size={14} /> Drafts to refine</span><strong>{format(counts?.drafts)}<ChevronRight size={13} /></strong></Link><Link href="/admin/messages"><span><Mail size={14} /> Unread enquiries</span><strong>{format(counts?.unread)}<ChevronRight size={13} /></strong></Link></div><div className={styles.monitorFooter}><span><ShieldCheck size={12} /> Private admin workspace</span></div></div>
    </section>
    <div className={styles.syncBar}><div className={styles.syncStatus} role="status"><span className={styles.statusDot} data-connected={connected && !paused} />{status}<span className={styles.syncTimestamp}>{data ? `Last snapshot ${timeLabel(data.updatedAt)}` : 'Waiting for first snapshot'}</span></div><div className={styles.syncActions}>{!previewData && <button aria-label={paused ? 'Resume automatic updates' : 'Pause automatic updates'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <CirclePlay size={14} /> : <CirclePause size={14} />}<span>{paused ? 'Resume' : 'Pause'}</span></button>}<button disabled={refreshing || !!previewData} onClick={refresh}><RefreshCw size={13} className={refreshing ? styles.spinning : ''} />{refreshing ? 'Refreshing' : 'Refresh'}</button></div></div>
    {error && <div className={styles.error} role="alert"><WifiOff size={16} /><span>{error}</span><button onClick={refresh} disabled={refreshing}>Retry</button></div>}
    <section className={styles.metrics} aria-label="Workspace metrics" aria-busy={loading}>{cards.map((card, index) => <Link className={styles.metricCard} href={card.href} key={card.label} style={{ '--card-index': index } as React.CSSProperties}><div className={styles.metricTop}><span>{card.label}</span><span className={styles.metricIcon}><card.icon size={17} /></span></div><strong className={styles.metricValue} key={data?.updatedAt}>{loading ? <span className={styles.skeleton} /> : format(card.value)}</strong><div className={styles.metricBottom}><span>{card.detail}</span><ArrowUpRight size={13} /></div></Link>)}</section>
    <div className={styles.mainGrid}>
      <section className={`${styles.panel} ${styles.trafficPanel}`}><div className={styles.panelHeading}><div><div className={styles.eyebrow}>AUDIENCE ACTIVITY</div><h2>Every visit tells a story.</h2></div><span className={styles.period}>LAST 24 HOURS</span></div><div className={styles.trafficSummary}><div><strong>{format(counts?.views24h)}</strong><span>recorded page views</span></div><div className={styles.recentActivity}><span className={styles.statusDot} data-connected={connected && !paused && (counts?.views5m ?? 0) > 0} /><strong>{format(counts?.views5m)}</strong><span>views / last 5 min</span></div></div><div className={styles.chart} aria-label="Hourly page views"><svg viewBox="0 0 760 220" role="img" aria-label={traffic ? `Hourly recorded page views. Peak ${peak === 1 && !traffic.some(p => p.count) ? 0 : peak} views per hour.` : 'Hourly traffic unavailable'}><defs><linearGradient id="admin-traffic-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".23" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>{[45,94,142,190].map((y, i) => <g key={y}><line x1="24" x2="736" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 6" /><text x="4" y={y - 6} fill="var(--muted)" fontSize="8">{Math.round(peak * (1 - i / 3))}</text></g>)}{traffic && points && <><polygon points={`24,190 ${points} 736,190`} fill="url(#admin-traffic-fill)" /><polyline points={points} className={styles.chartLine} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />{traffic.map((point, index) => <circle key={point.at} cx={24 + index * (712 / 23)} cy={190 - point.count / peak * 145} r="3" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5"><title>{`${timeLabel(point.at)}: ${point.count} views`}</title></circle>)}</>}{traffic?.filter((_, i) => [0,6,12,18,23].includes(i)).map(point => <text key={point.at} x={24 + traffic.indexOf(point) * (712 / 23)} y="215" textAnchor="middle" fill="var(--muted)" fontSize="9">{timeLabel(point.at)}</text>)}</svg>{!traffic && <div className={styles.chartEmpty}>{loading ? 'Loading recorded traffic…' : 'Traffic data is currently unavailable.'}</div>}</div><div className={styles.chartCaption}><span><i /> Hourly views · your local time</span><Link href="/admin/analytics/traffic">Traffic details <ArrowUpRight size={12} /></Link></div><details className={styles.chartTable}><summary>View hourly data</summary><div><table><thead><tr><th>Hour</th><th>Recorded views</th></tr></thead><tbody>{traffic?.map(point => <tr key={point.at}><td>{dateLabel(point.at)} · {timeLabel(point.at)}</td><td>{point.count}</td></tr>)}</tbody></table></div></details></section>
      <section className={`${styles.panel} ${styles.quickPanel}`}><div className={styles.panelHeading}><div><div className={styles.eyebrow}>MAKE YOUR NEXT MOVE</div><h2>Quick actions</h2></div><ArrowUpRight size={17} /></div><div className={styles.quickActions}>{quickActions.map(action => <Link key={action.href} href={action.href}><span className={styles.actionIcon}><action.icon size={18} /></span><span><strong>{action.label}</strong><small>{action.desc}</small></span><ChevronRight size={14} /></Link>)}</div><div className={styles.quickNote}><ShieldCheck size={15} /><p>Payment mode and checkout settings remain managed in your commerce configuration.</p></div></section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><div className={styles.eyebrow}>YOUR PUBLISHING DESK</div><h2>Content at a glance</h2></div><Link href="/admin/blog" aria-label="Manage blog articles"><ArrowUpRight size={16} /></Link></div><div className={styles.contentHealth}><div className={styles.progressRing} style={{ '--progress': `${publishedRatio ?? 0}%` } as React.CSSProperties}><div><strong>{publishedRatio == null ? '—' : `${publishedRatio}%`}</strong><span>{publishedRatio == null ? 'UNAVAILABLE' : 'PUBLISHED'}</span></div></div><div className={styles.contentNumbers}><div><span><i />Published articles</span><strong>{format(counts?.published)}</strong></div><div><span><i />Drafts in progress</span><strong>{format(counts?.drafts)}</strong></div><small>Share of articles in the database</small></div></div><div className={styles.categoryBars}>{data?.categories?.map(category => <div key={category.name}><div><span>{category.name}</span><strong>{format(category.count)}</strong></div><div className={styles.barTrack}><span style={{ width: `${counts?.published ? category.count / counts.published * 100 : 0}%` }} /></div></div>)}{!data?.categories?.length && <p className={styles.emptyText}>{loading ? 'Loading your collections…' : 'No category data available yet.'}</p>}</div></section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><div className={styles.eyebrow}>PICK UP WHERE YOU LEFT OFF</div><h2>Recently updated</h2></div><Link href="/admin/blog" aria-label="View all articles"><ArrowUpRight size={16} /></Link></div><div className={styles.recentPosts}>{data?.posts?.map(post => <Link key={post.id} href="/admin/blog"><span className={styles.postIcon}><FileText size={17} /></span><span><small>{post.category} <span>· {dateLabel(post.updatedAt)}</span></small><strong>{post.title}</strong><em data-published={post.published}>{post.published ? 'Published' : 'Draft'}</em></span><ArrowUpRight size={14} /></Link>)}{!data?.posts?.length && <p className={styles.emptyText}>{loading ? 'Loading recent articles…' : 'No recent articles to show.'}</p>}</div></section>
    </div>
    <section className={styles.toolsStrip}><div><div className={styles.eyebrow}>EXPLORE YOUR WORKSPACE</div><h2>The right tools. Within reach.</h2></div><div><Link href="/admin/seo"><Search size={16} /> SEO intelligence <ArrowUpRight size={12} /></Link><Link href="/admin/knowledge"><Network size={16} /> Knowledge graph <ArrowUpRight size={12} /></Link><Link href="/admin/topic-authority"><BookOpen size={16} /> Topic authority <ArrowUpRight size={12} /></Link></div></section>
    <section className={`${styles.panel} ${styles.activityPanel}`}><div className={styles.panelHeading}><div><div className={styles.eyebrow}>RECORDED OPERATIONS</div><h2>Workspace activity</h2></div><Link href="/admin/developer/logs">System logs <ArrowUpRight size={12} /></Link></div><div className={styles.events}>{data?.events?.map(event => <div key={event.id}><span className={styles.eventIcon} data-success={event.status === 'SUCCESS'}>{event.status === 'SUCCESS' ? <Check size={14} /> : <Activity size={14} />}</span><span><strong>{event.action.replace(/_/g, ' ').toLowerCase()}</strong><small>{dateLabel(event.createdAt)} · {timeLabel(event.createdAt)}</small></span><span className={styles.eventStatus} data-success={event.status === 'SUCCESS'}>{event.status}</span></div>)}{!data?.events?.length && <p className={styles.emptyText}>{loading ? 'Loading recorded events…' : 'No recent audit events. New recorded activity will appear here.'}</p>}</div></section>
    <p className={styles.dataNote}><Clock3 size={12} /> {previewData ? 'Design preview uses illustrative data only.' : 'Database counts refresh every 60 seconds while this tab is visible. Traffic reflects recorded page views, not concurrent visitors.'}</p>
  </div>;
}
