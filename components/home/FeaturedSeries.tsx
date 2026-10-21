import Link from 'next/link';
import { ArrowUpRight, ArrowRight, BookOpen, Layers, BarChart3, Code2 } from 'lucide-react';
import styles from './FeaturedSeries.module.css';

const series = [
  { title: 'Inside Microsoft Fabric', label: 'THE DATA PLATFORM', desc: 'Understand how OneLake, Direct Lake, and pipelines fit together.', chapters: ['OneLake architecture', 'Capacity & performance', 'Data pipelines'], slug: 'microsoft-fabric', icon: Layers },
  { title: 'The Power BI playbook', label: 'THE ANALYTICS STACK', desc: 'Build sharper models and dashboards that make complex data useful.', chapters: ['DAX & semantic models', 'Query folding', 'Refresh strategies'], slug: 'power-bi', icon: BarChart3 },
  { title: 'Build a faster web', label: 'THE WEB ENGINEERING SERIES', desc: 'Connect rendering, discoverability, and performance in Next.js.', chapters: ['Server Components', 'Metadata & indexing', 'Core Web Vitals'], slug: 'nextjs', icon: Code2 },
];

function CoverArt({ variant }: { variant: number }) {
  return <svg viewBox="0 0 240 100" fill="none" aria-hidden="true" className={styles.art}>
    <defs><pattern id={`series-grid-${variant}`} width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" stroke="currentColor" strokeOpacity=".07" /></pattern></defs>
    <rect width="240" height="100" fill={`url(#series-grid-${variant})`} />
    {variant === 0 ? <>
      <path d="M45 49H195M83 49V24H157V49M83 49V76H157V49" stroke="currentColor" opacity=".25" />
      {[45,120,195].map((x,i)=><g key={x}><rect x={x-15} y="34" width="30" height="30" rx="7" fill="var(--surface)" stroke="currentColor" strokeOpacity={i===1?'.8':'.25'} /><path d={`M${x-7} 46l7-4 7 4-7 4-7-4zm0 5l7 4 7-4`} stroke="currentColor" strokeOpacity={i===1?'1':'.45'} /></g>)}
      <circle cx="83" cy="24" r="3" fill="currentColor" /><circle cx="157" cy="76" r="3" fill="currentColor" />
    </> : variant === 1 ? <>
      <path d="M42 78H199" stroke="currentColor" opacity=".2" />
      {[27,43,35,60,51,69].map((h,i)=><g key={i}><rect x={50+i*24} y={78-h} width="8" height={h} rx="2" fill="currentColor" opacity={.25+i*.1} /><rect x={60+i*24} y={84-h} width="5" height={h-6} rx="2" fill="currentColor" opacity=".12" /></g>)}
      <path d="M47 38l30-8 26 5 25-16 25 6 38-16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" opacity=".6" />
    </> : <>
      <rect x="46" y="15" width="148" height="72" rx="7" fill="var(--surface)" stroke="currentColor" strokeOpacity=".25" /><path d="M46 31H194" stroke="currentColor" opacity=".18" />
      {[55,62,69].map(x=><circle key={x} cx={x} cy="23" r="1.5" fill="currentColor" opacity=".5" />)}
      <path d="M76 45l-9 9 9 9m18-18l9 9-9 9m-7-22l-6 26" stroke="currentColor" strokeWidth="1.5" /><path d="M118 46h49m-49 9h32m-32 9h43" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".2" /><path d="M148 76h29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".6" />
    </>}
  </svg>;
}

export default function FeaturedSeries() {
  return <section className={styles.section} aria-labelledby="learning-series-title"><div className="container">
    <div className={styles.heading}><div><span className={styles.eyebrow}><BookOpen size={14} /> THE DEEPER READ</span><h2 id="learning-series-title">Less searching.<br /><span>More understanding.</span></h2></div><p>Explore a subject from the inside out.<br />Three focused collections for your next deep dive.</p></div>
    <div className={styles.grid}>{series.map(({ title, label, desc, chapters, slug, icon: Icon }, i) => <Link href={`/category/${slug}`} className={styles.card} key={slug}>
      <div className={styles.cover}><div className={styles.coverTop}><span>COLLECTION / 0{i+1}</span><Icon size={16} strokeWidth={1.5} /></div><CoverArt variant={i} /><span className={styles.coverLabel}>{label}</span></div>
      <div className={styles.body}><h3>{title}</h3><p>{desc}</p><div className={styles.chapters}>{chapters.map((chapter,j)=><div key={chapter}><span>0{j+1}</span>{chapter}<ArrowRight size={11} /></div>)}</div><div className={styles.footer}><span>Explore collection</span><span className={styles.arrow}><ArrowUpRight size={17} /></span></div></div>
    </Link>)}</div>
  </div></section>;
}
