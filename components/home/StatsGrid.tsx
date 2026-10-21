import { ArrowUpRight, Library } from 'lucide-react';
import Link from 'next/link';
import styles from './HomeFinish.module.css';

export default function StatsGrid({ articleCount, categoryCount }: { articleCount: number; categoryCount: number }) {
  return <section className={styles.statsSection} aria-labelledby="publication-title"><div className="container"><div className={styles.statsStrip}>
    <div className={styles.statsLead}><Library size={23}/><div><span className={styles.eyebrow}>THE PUBLICATION</span><h2 id="publication-title">Room to keep exploring.</h2></div></div>
    <div className={styles.stat}><strong>{articleCount.toLocaleString('en-IN')}</strong><span>Published articles</span></div>
    <div className={styles.stat}><strong>{categoryCount.toLocaleString('en-IN')}</strong><span>Article categories</span></div>
    <Link className={styles.statsLink} href="/blog" aria-label="Explore the publication"><ArrowUpRight size={23}/></Link>
  </div></div></section>;
}
