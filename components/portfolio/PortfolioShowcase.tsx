import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Database, Workflow, Layers, Code2 } from 'lucide-react';
import { WorkImage } from '@/components/showcase/Showcase';
import { flagshipProjects, type ProjectData } from '@/app/portfolio/data';
import styles from './PortfolioV2.module.css';

export function PortfolioHero() {
  return <section className={styles.hero} aria-labelledby="portfolio-title">
    <div className={styles.heroCopy}>
      <span className={styles.eyebrow}>SELECTED WORK / ENGINEERING PORTFOLIO</span>
      <h1 id="portfolio-title">Engineering Intelligence.<br /><span>Designing Better Decisions.</span></h1>
      <p>Explore Microsoft Fabric engineering tools, intelligent automation systems, enterprise Power BI solutions, and modern analytics applications — built with technical depth, thoughtful design, and documented implementation evidence.</p>
      <div className={styles.actions}><Link className={styles.primary} href="#selected-work">Explore Featured Projects <ArrowDown size={15} /></Link><a className={styles.secondary} href="https://github.com/sabledattatray" target="_blank" rel="noopener noreferrer">View GitHub <ArrowUpRight size={15} /></a></div>
      <div className={styles.capabilities}><span><Database size={13} /> Fabric & SQL</span><span><Layers size={13} /> Power BI & Excel</span><span><Workflow size={13} /> AI & Automation</span><span><Code2 size={13} /> Web applications</span></div>
    </div>
    <aside className={styles.heroIndex} aria-label="Evidence and project scope"><span className={styles.eyebrow}>A PORTFOLIO YOU CAN INSPECT</span><h2>Built with intent.<br />Documented with care.</h2><p>Live applications, source-backed engineering and clearly labeled design studies.</p><div><Link href="#selected-work"><span>01 / LIVE PLATFORMS</span><strong>Fabric &amp; Excel engineering tools</strong><ArrowUpRight size={15} /></Link><Link href="/portfolio/enterprise-n8n-intelligence-automation"><span>02 / SYSTEMS ENGINEERING</span><strong>Automation, with recovery built in</strong><ArrowUpRight size={15} /></Link><Link href="/portfolio/enterprise-global-business-analytics-3m"><span>03 / ANALYTICS FOUNDATIONS</span><strong>Models, validation &amp; honest limits</strong><ArrowUpRight size={15} /></Link></div></aside>
  </section>;
}

export function FlagshipCard({ project, lead = false }: { project: ProjectData; lead?: boolean }) {
  const detail = project.flagship!;
  const visual = detail.gallery[0];
  const destination = project.live || project.github;
  return <article className={`${styles.card} ${lead ? styles.leadCard : ''}`} data-flagship={detail.slug}>
    <Link href={`/portfolio/${detail.slug}`} className={styles.mediaLink} aria-label={`View case study: ${project.title}`}>
      <WorkImage src={project.image} alt={visual.alt} sizes={lead ? '(max-width: 850px) 100vw, 60vw' : '(max-width: 700px) 100vw, 45vw'} />
      <span className={styles.mediaLabel}>{visual.classification}</span><span className={styles.mediaArrow}><ArrowUpRight size={18} /></span>
    </Link>
    <div className={styles.cardCopy}><div className={styles.cardTop}><span>{String(detail.order).padStart(2, '0')} / {project.category}</span><small>{project.statusBadge}</small></div><h3>{project.title}</h3><p>{project.desc}</p>
      <ul className={styles.tags}>{project.tools.slice(0, 4).map(tool => <li key={tool}>{tool}</li>)}</ul>
      <div className={styles.evidence}>{detail.evidence.slice(0, 2).map(item => <a href={item.source} target="_blank" rel="noopener noreferrer" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></a>)}</div>
      <div className={styles.cardActions}><Link href={`/portfolio/${detail.slug}`}>View Case Study <ArrowUpRight size={13} /></Link><a href={destination} target="_blank" rel="noopener noreferrer">{detail.cta}<ArrowUpRight size={13} /></a>{project.live && project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">View Source Code <ArrowUpRight size={13} /></a>}{detail.release && <a href={detail.release} target="_blank" rel="noopener noreferrer">View v1.0.0 Release <ArrowUpRight size={13} /></a>}</div>
    </div>
  </article>;
}

export function FeaturedProjectShowcase() {
  return <section id="selected-work" className={styles.showcase} aria-labelledby="flagship-title"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>01 / ENGINEERED TO BE EXPLORED</span><h2 id="flagship-title">The work. The thinking.<br /><span>The evidence.</span></h2></div><p>Five independent projects, from live engineering tools to documented analytics foundations. Open the case studies for implementation details, source material, and limitations.</p></div><div className={styles.featureGrid}>{flagshipProjects.map((project, index) => <FlagshipCard key={project.id} project={project} lead={index === 0} />)}</div><p className={styles.disclosure}>Evidence reviewed 29 October 2026. Demonstration datasets are synthetic. Repository test results and local benchmarks are attributed to their sources; design mockups are labeled separately from captured interfaces.</p></section>;
}
