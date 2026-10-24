import Link from 'next/link';
import { ArrowUpRight, Database, Code2, Workflow } from 'lucide-react';
import HeroDashboard from './HeroDashboard';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}><span /> Independent thinking. Connected data.</div>
          <p className={styles.introduction}>Hi, I&apos;m Datta Sable</p>
          <h1 id="home-hero-title">Complex data.<br /><span>Clear decisions.</span></h1>
          <p className={styles.description}>Business intelligence, thoughtful automation, and the engineering behind it. Explore practical guides and interactive projects built to make your next decision clearer.</p>
          <div className={styles.actions}>
            <Link href="/dashboards" className="btn-primary">Explore my work <ArrowUpRight size={17} /></Link>
            <Link href="/blog" className={styles.secondary}>Read the guides <ArrowUpRight size={16} /></Link>
          </div>
          <div className={styles.expertise} aria-label="Areas of expertise">
            <span><Database size={15} /> Microsoft Fabric</span>
            <span><Code2 size={15} /> Data engineering</span>
            <span><Workflow size={15} /> AI &amp; automation</span>
          </div>
        </div>
        <div className={styles.visual}>
          <HeroDashboard />
          <div className={styles.visualCaption}><span>01 / THE INTERACTIVE WORKSPACE</span></div>
        </div>
      </div>
    </section>
  );
}
