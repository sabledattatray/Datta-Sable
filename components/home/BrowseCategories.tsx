import Link from 'next/link';
import { ArrowUpRight, Database, BarChart3, Layers, Code2, Search, Cpu, Workflow, Braces } from 'lucide-react';
import styles from './BrowseCategories.module.css';

const topics = [
  { slug: 'microsoft-fabric', name: 'Microsoft Fabric', detail: 'OneLake / Lakehouse / Real-time', icon: Layers },
  { slug: 'power-bi', name: 'Power BI', detail: 'DAX / Modeling / Visual storytelling', icon: BarChart3 },
  { slug: 'sql', name: 'SQL & Databases', detail: 'Queries / Architecture / Performance', icon: Database },
  { slug: 'python', name: 'Python Engineering', detail: 'Pipelines / Analytics / Data tooling', icon: Braces },
  { slug: 'nextjs', name: 'Next.js & React', detail: 'Rendering / Web architecture / Speed', icon: Code2 },
  { slug: 'seo', name: 'SEO Strategy', detail: 'Discovery / Indexing / Search intent', icon: Search },
  { slug: 'ai-automation', name: 'AI & Automation', detail: 'Connect your stack. Build smarter workflows.', icon: Workflow },
];

export default function BrowseCategories() {
  return <section className={styles.section} aria-labelledby="technical-topics-title"><div className="container">
    <div className={styles.layout}>
      <div className={styles.editorial}>
        <span className={styles.eyebrow}><span /> THE KNOWLEDGE INDEX</span>
        <h2 id="technical-topics-title">Go deeper.<br /><span>By design.</span></h2>
        <p>Follow your curiosity through the tools, systems, and ideas that shape better engineering.</p>
        <div className={styles.map} aria-hidden="true">
          <div className={styles.mapGrid} />
          <div className={styles.ring} />
          <div className={styles.core}><Cpu size={30} strokeWidth={1.25} /></div>
          <span className={`${styles.node} ${styles.nodeTop}`}><Database size={16} /></span>
          <span className={`${styles.node} ${styles.nodeRight}`}><Code2 size={16} /></span>
          <span className={`${styles.node} ${styles.nodeBottom}`}><Workflow size={16} /></span>
          <span className={styles.mapLabel}>CONNECTED KNOWLEDGE</span>
          <span className={styles.coordinates}>07 / DOMAINS</span>
        </div>
        <Link href="/blog" className={styles.browse}>View the full library <ArrowUpRight size={16} /></Link>
      </div>
      <div className={styles.directory}>
        <div className={styles.directoryHeader}><span>EXPLORE A DOMAIN</span><span>INDEX / 01—07</span></div>
        <div className={styles.topics}>
          {topics.map(({ slug, name, detail, icon: Icon }, i) => <Link className={`${styles.topic} ${i === 6 ? styles.wide : ''}`} href={`/category/${slug}`} key={slug}>
            <div className={styles.topicTop}><span className={styles.topicIcon}><Icon size={19} strokeWidth={1.5} /></span><span className={styles.index}>0{i + 1}</span><ArrowUpRight className={styles.arrow} size={17} /></div>
            <div className={styles.topicText}><h3>{name}</h3><p>{detail}</p></div>
            {i === 6 && <span className={styles.connection} aria-hidden="true"><i /><b /><i /><b /><i /></span>}
          </Link>)}
        </div>
        <div className={styles.directoryFooter}><span className={styles.status} /> Pick a topic. Find your next idea.</div>
      </div>
    </div>
  </div></section>;
}
