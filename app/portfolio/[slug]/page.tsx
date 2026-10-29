import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WorkImage } from '@/components/showcase/Showcase';
import { flagshipProjects } from '../data';
import styles from '@/components/portfolio/PortfolioV2.module.css';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return flagshipProjects.map(project => ({ slug: project.flagship!.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = flagshipProjects.find(item => item.flagship!.slug === slug);
  if (!project) return {};
  const title = `${project.title} | Datta Sable`;
  const url = `https://dattasable.com/portfolio/${slug}`;
  return { title: { absolute: title }, description: project.desc, alternates: { canonical: url }, openGraph: { title, description: project.desc, url, type: 'article', images: [{ url: `https://dattasable.com${project.image}`, alt: project.flagship!.gallery[0].alt }] }, twitter: { card: 'summary_large_image', title, description: project.desc, images: [`https://dattasable.com${project.image}`] } };
}
export default async function ProjectCaseStudy({ params }: Props) {
  const { slug } = await params;
  const project = flagshipProjects.find(item => item.flagship!.slug === slug);
  if (!project) notFound();
  const detail = project.flagship!;
  const url = `https://dattasable.com/portfolio/${slug}`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CreativeWork', '@id': `${url}#project`, name: project.title, description: project.desc, url, image: `https://dattasable.com${project.image}`, author: { '@type': 'Person', name: 'Datta Sable', url: 'https://dattasable.com' }, keywords: project.tools.join(', '), isBasedOn: detail.sources.map(source => source.url) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dattasable.com' }, { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://dattasable.com/portfolio' }, { '@type': 'ListItem', position: 3, name: project.title, item: url }] },
  ] };
  return <div data-typography-reference><Navbar /><main className={styles.casePage}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/portfolio">Portfolio</Link><span>/</span><span>{project.category}</span></nav>
    <header className={styles.caseHeader}><span className={styles.eyebrow}>ENGINEERING CASE STUDY / {String(detail.order).padStart(2, '0')}</span><h1>{project.title}</h1><p>{project.desc}</p><div className={styles.caseStatus}>{project.statusBadge} · Evidence reviewed {detail.verifiedAt}</div><div className={styles.actions}><a className={styles.primary} href={project.live || project.github} target="_blank" rel="noopener noreferrer">{detail.cta}<ArrowUpRight size={14} /></a>{project.live && project.github && <a className={styles.secondary} href={project.github} target="_blank" rel="noopener noreferrer">View Source Code <ArrowUpRight size={14} /></a>}{detail.release && <a className={styles.secondary} href={detail.release} target="_blank" rel="noopener noreferrer">View v1.0.0 Release <ArrowUpRight size={14} /></a>}</div></header>
    <section className={styles.caseSection}><h2>Project overview</h2><p>{project.client}. {project.desc} The scope is documented below so reviewers can distinguish delivered capabilities from design targets.</p></section>
    <section className={styles.caseSection}><h2>The engineering challenge</h2><p>{project.problem}</p></section>
    <section className={styles.caseSection}><h2>Solution architecture</h2><p>{project.solution}</p><div className={styles.architecture}>{detail.architecture.map((step,index) => <div key={step}><small>0{index+1} / ARCHITECTURE</small><p>{step}</p></div>)}</div></section>
    <section className={styles.caseSection}><h2>Implementation</h2><ul>{detail.implementation.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className={styles.caseSection}><h2>Visual gallery</h2><p>Each asset is classified and linked to its source. Design references are not presented as completed application screens.</p><div className={styles.caseGallery}>{detail.gallery.map((item,index) => <figure key={item.src}><WorkImage src={item.src} alt={item.alt} sizes={index === 0 ? '(max-width: 1120px) 100vw, 1064px' : '(max-width: 650px) 100vw, 520px'} /><figcaption><strong>{item.classification}</strong>{item.alt}<br /><a href={item.source} target="_blank" rel="noopener noreferrer">View original source ↗</a></figcaption></figure>)}</div></section>
    <section className={styles.caseSection}><h2>Technical evidence</h2><p>{project.impact}</p><div className={styles.evidence}>{detail.evidence.map(item => <a key={item.label} href={item.source} target="_blank" rel="noopener noreferrer"><strong>{item.value}</strong><span>{item.label} ↗</span></a>)}</div><p>Reviewed from public interfaces and repository documentation on 29 October 2026. Upstream tests and benchmarks were not rerun as part of this website implementation.</p></section>
    <section className={`${styles.caseSection} ${styles.limitation}`}><h2>Limitations &amp; scope</h2><ul>{detail.limitations.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className={styles.caseSection}><h2>Technology stack</h2><ul className={styles.tags}>{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></section>
    <section className={styles.caseSection}><h2>Explore the evidence &amp; next steps</h2><ul className={styles.sourceList}>{detail.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul><div className={styles.actions}><Link className={styles.primary} href="/portfolio#contact-section">Discuss a similar project <ArrowUpRight size={14} /></Link><Link className={styles.secondary} href="/portfolio#selected-work">Back to selected work</Link></div></section>
  </main><Footer /></div>;
}
