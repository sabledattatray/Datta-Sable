import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, Code2, FlaskConical, ArrowRight } from 'lucide-react';
import styles from './HomeFinish.module.css';

const resources = [
  ['Microsoft Fabric roadmap', 'Architecture & certification', '/blog/microsoft-fabric-certification-roadmap-2026'],
  ['DP-600 study guide', 'Analytics engineering', '/blog/dp-600-study-guide-2026'],
  ['Beyond the SELECT', 'SQL patterns & query design', '/blog/beyond-the-select-advanced-sql-for-bi'],
  ['DAX performance patterns', 'Sharper analytical models', '/blog/mastering-dax-patterns-2026'],
  ['Next.js performance guide', 'Rendering & discoverability', '/blog/nextjs-15-react-19-performance-manifesto-2026'],
];

export default function AboutAuthor() {
  return <section className={styles.section} aria-labelledby="learning-approach-title"><div className="container">
    <div className={styles.resourceLayout}>
      <div className={styles.approach}>
        <span className={styles.eyebrow}>FROM CONCEPT TO CONFIDENCE</span>
        <h2 id="learning-approach-title" className={styles.title}>Understand it.<br />Build it.<br /><span>Make it yours.</span></h2>
        <p className={styles.intro}>Practical ideas deserve practical next steps. Explore the reasoning, try the implementation, and adapt it to your own work.</p>
        <div className={styles.method}>
          {[{icon:Compass,title:'Find the why',text:'Architecture, context, and tradeoffs.'},{icon:Code2,title:'Explore the how',text:'Patterns, examples, and implementation.'},{icon:FlaskConical,title:'Test your thinking',text:'Measure results in your own environment.'}].map(({icon:Icon,title,text},i)=><div key={title}><span className={styles.methodIcon}><Icon size={17}/></span><div><h3>{title}</h3><p>{text}</p></div><span className={styles.smallIndex}>0{i+1}</span></div>)}
        </div>
        <Link href="/about" className={styles.textLink}>Meet the person behind the guides <ArrowUpRight size={15}/></Link>
      </div>
      <div className={styles.resourceShelf}>
        <div className={styles.shelfHeading}><span className={styles.shelfIcon}><BookOpen size={21}/></span><div><span className={styles.eyebrow}>KEEP THESE CLOSE</span><h3>Your reference shelf</h3></div><span className={styles.shelfCount}>05</span></div>
        <p className={styles.shelfIntro}>A few useful places to return to when you need a clearer answer.</p>
        <div className={styles.resourceList}>{resources.map(([title,detail,href],i)=><Link href={href} key={href}><span className={styles.resourceNumber}>0{i+1}</span><div><h4>{title}</h4><p>{detail}</p></div><ArrowUpRight size={16}/></Link>)}</div>
        <Link href="/blog" className={styles.shelfFooter}>Open the full library <ArrowRight size={15}/></Link>
      </div>
    </div>
  </div></section>;
}
