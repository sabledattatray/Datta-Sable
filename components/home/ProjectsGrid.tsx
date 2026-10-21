import Link from 'next/link';
import { ArrowUpRight, BarChart3, Database, Workflow, ShieldCheck } from 'lucide-react';
import styles from './HomeFinish.module.css';

const projects = [
  { title:'Sales reporting, thoughtfully modeled',desc:'Work through targets, returns, and source reconciliation in a small sales model.',tools:['Power BI','DAX','Fabric'],label:'ANALYTICS',icon:BarChart3,href:'/blog/sales-performance-ecosystem-2026',steps:['Source','Model','Report'] },
  { title:'AI extraction you can evaluate',desc:'Separate valid JSON, schema conformance, and factual accuracy in an extraction workflow.',tools:['Next.js','AI','Zod'],label:'STRUCTURED AI',icon:ShieldCheck,href:'/blog/case-study-precision-prompt-architecture-consistency',steps:['Extract','Validate','Review'] },
  { title:'A closer look at columnstore',desc:'Explore storage choices and validate query performance against your own workload.',tools:['SQL Server','ETL','T-SQL'],label:'DATA SYSTEMS',icon:Database,href:'/blog/sql-server-columnstore-indexes-optimization-guide',steps:['Store','Query','Measure'] },
  { title:'A workflow with review built in',desc:'Design a source-tracked draft queue with explicit editorial review before publication.',tools:['Python','n8n','AI agents'],label:'AUTOMATION',icon:Workflow,href:'/blog/case-study-n8n-automated-authority-scaling',steps:['Draft','Review','Publish'] },
];

export default function ProjectsGrid() {
  return <section className={styles.section} aria-labelledby="implementation-title"><div className="container">
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE IMPLEMENTATION NOTEBOOK</span><h2 className={styles.title} id="implementation-title">Ideas, put <span>to work.</span></h2></div><p>Go beyond the overview.<br/>See how the pieces fit together.</p></div>
    <div className={styles.projectGrid}>{projects.map(({title,desc,tools,label,icon:Icon,href,steps},i)=><Link href={href} key={href} className={styles.project}>
      <div className={styles.projectVisual} aria-hidden="true"><span className={styles.projectIcon}><Icon size={25} strokeWidth={1.5}/></span><div className={styles.flow}>{steps.map((step,j)=><span key={step}><i>{j+1}</i>{step}</span>)}</div><span className={styles.projectNumber}>0{i+1}</span></div>
      <div className={styles.projectBody}><span className={styles.projectLabel}>{label}</span><h3>{title}</h3><p>{desc}</p><div className={styles.projectBottom}><div className={styles.tags}>{tools.map(t=><span key={t}>{t}</span>)}</div><span className={styles.projectArrow}><ArrowUpRight size={18}/></span></div></div>
    </Link>)}</div>
  </div></section>;
}
