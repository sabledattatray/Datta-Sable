import Link from 'next/link';
import { ArrowUpRight, Layers, BarChart3, Code2, Cpu, Route } from 'lucide-react';
import styles from './StartHere.module.css';

const tracks = [
  { title: 'Microsoft Fabric', level: 'Start with the foundations', desc: 'Connect the dots between OneLake, Direct Lake, and your Fabric certification roadmap.', topics: ['OneLake', 'Architecture', 'DP-600'], href: '/blog/microsoft-fabric-certification-roadmap-2026', icon: Layers },
  { title: 'Power BI & analytics', level: 'Design with purpose', desc: 'Turn complex data into clear decisions with thoughtful dashboards and stronger analytical models.', topics: ['Dashboard design', 'DAX', 'Data modeling'], href: '/blog/psychology-of-high-fidelity-dashboard-design', icon: BarChart3 },
  { title: 'Next.js & performance', level: 'Build for the modern web', desc: 'Explore rendering, technical SEO, and the performance decisions behind fast web experiences.', topics: ['React', 'Technical SEO', 'Performance'], href: '/blog/nextjs-15-react-19-performance-manifesto-2026', icon: Code2 },
  { title: 'AI & automation', level: 'Make your workflows work', desc: 'Discover practical orchestration patterns for connecting tools, agents, and repeatable workflows.', topics: ['n8n', 'AI agents', 'Orchestration'], href: '/blog/case-study-n8n-automated-authority-scaling', icon: Cpu },
];

export default function StartHere() {
  return <section className={styles.section} aria-labelledby="learning-paths-title">
    <div className="container">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}><Route size={14} /> FIND YOUR NEXT STEP</span>
          <h2 id="learning-paths-title">A clearer path.<br /><span>A stronger skill set.</span></h2>
        </div>
        <div className={styles.intro}><p>Choose what you want to build. Find a practical starting point, then go deeper at your own pace.</p><span>04 pathways <i /> One place to begin</span></div>
      </div>
      <div className={styles.grid}>
        {tracks.map(({ title, level, desc, topics, href, icon: Icon }, index) => <Link key={href} href={href} className={styles.card}>
          <div className={styles.visual} aria-hidden="true"><div className={styles.orbit} /><div className={styles.icon}><Icon size={28} strokeWidth={1.5} /></div><span className={styles.number}>0{index + 1}</span></div>
          <div className={styles.body}><span className={styles.level}>{level}</span><h3>{title}</h3><p>{desc}</p><div className={styles.topics}>{topics.map(topic => <span key={topic}>{topic}</span>)}</div></div>
          <span className={styles.arrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
        </Link>)}
      </div>
      <div className={styles.foot}><span>Curiosity is the only prerequisite.</span><Link href="/blog">Explore all guides <ArrowUpRight size={14} /></Link></div>
    </div>
  </section>;
}
