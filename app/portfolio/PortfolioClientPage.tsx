'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, FileCheck2, FileText, Layers, Loader2, Mail, Search, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { WorkDialog, WorkImage, WorkLink } from '@/components/showcase/Showcase';
import sharedStyles from '@/components/showcase/Showcase.module.css';
import portfolioStyles from './Portfolio.module.css';
const styles = { ...sharedStyles, ...portfolioStyles };
import { featuredProjects, projects, projectCategories, matchesProjectCategory, processSteps, services, type FeaturedProject, type ProjectData } from './data';

const categories: readonly string[] = projectCategories;
const matchesCategory = matchesProjectCategory;
function SectionHeading({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className={styles.sectionHeading}><div><span className={styles.kicker}><i /> {number} / {eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}


function PortfolioContent({ hero, showcase }: { hero?: React.ReactNode; showcase?: React.ReactNode } = {}) {
  const params = useSearchParams();
  const [category, setCategory] = useState('All');
  const [tool, setTool] = useState('All tools');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(6);
  const [featured, setFeatured] = useState<FeaturedProject | null>(null);
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [form, setForm] = useState({ name: '', email: '', service: services[0].title, timeline: 'Within 2–4 weeks', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const submitting = useRef(false);
  useEffect(() => {
    const requested = params.get('category');
    const aliases: Record<string, string> = { Dashboard: 'Power BI', Excel: 'Excel & MIS', MIS: 'Excel & MIS', Data: 'SQL & Data Engineering', SQL: 'SQL & Data Engineering', 'SQL & Data': 'SQL & Data Engineering', Automation: 'AI & Automation' };
    setCategory(requested && categories.includes(aliases[requested] || requested) ? aliases[requested] || requested : 'All');
  }, [params]);
  const filtered = useMemo(() => projects.filter(project => (category !== 'All' || !project.flagship) && matchesCategory(project, category) && (tool === 'All tools' || project.tools.some(item => item.toLowerCase().includes(tool.toLowerCase()))) && `${project.title} ${project.desc} ${project.tools.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())), [category, tool, search]);
  function chooseCategory(value: string) {
    setCategory(value); setVisible(6);
    const url = new URL(window.location.href);
    if (value === 'All') url.searchParams.delete('category'); else url.searchParams.set('category', value);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  function enquire(title: string) {
    setFeatured(null); setSelected(null);
    setForm(current => ({ ...current, message: current.message || `Hello Datta, I would like to discuss a project similar to ${title}.` }));
    window.setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }), 0);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (form.honeypot || submitting.current) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setStatus('error'); setFeedback('Please add your name, email address, and a short project brief.'); return; }
    submitting.current = true;
    setStatus('sending'); setFeedback('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, subject: `[Portfolio enquiry] ${form.service}`, message: `Service: ${form.service}\nTimeline: ${form.timeline}\n\n${form.message}` }) });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Your message could not be saved. Please try again.');
      setStatus('success'); setFeedback('Thank you. Your enquiry has been received. I’ll get back to you using the email you provided.');
      setForm(current => ({ ...current, name: '', email: '', message: '' }));
    } catch (error) { setStatus('error'); setFeedback(error instanceof Error ? error.message : 'Could not send your enquiry. Email info@dattasable.com instead.'); } finally { submitting.current = false; }
  }
  return <div className={styles.page} data-typography-reference><Navbar />
    <div className={styles.frame}>

      <div className={styles.main}>
        {hero}
        <div className={styles.indexBar}><span>EXPLORE THE PORTFOLIO</span><nav aria-label="Portfolio sections"><a href="#selected-work"><small>01</small> Selected work</a><a href="#project-library"><small>02</small> Project library</a><a href="#working-together"><small>03</small> My approach</a><a href="#contact-section"><small>04</small> Let’s talk <ArrowUpRight size={11} /></a></nav></div>
        {showcase}

        <div className={styles.principles}>{[{ icon: FileCheck2, title: 'Evidence before adjectives.', text: 'Explore the source assumptions, validation checks, and limitations behind the work.' }, { icon: Layers, title: 'Built from the question up.', text: 'Business context, data modeling, and interface design belong in the same conversation.' }, { icon: BarChart3, title: 'Made to be explored.', text: 'Open a demonstration, review a calculation, or inspect a downloadable workbook.' }].map(item => <div key={item.title}><item.icon size={19} /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>
        <section id="project-library" className={styles.section}><SectionHeading number="02" eyebrow="THE PROJECT LIBRARY" title="Find the work that speaks to you."><WorkLink href="/dashboards">Explore dashboard gallery</WorkLink></SectionHeading><div className={styles.toolbar}><div className={styles.filterChips} aria-label="Project categories">{categories.map(value => <button key={value} aria-pressed={category === value} onClick={() => chooseCategory(value)}>{value}<small>{projects.filter(project => (value !== 'All' || !project.flagship) && matchesCategory(project, value)).length}</small></button>)}</div><div className={styles.search}><Search size={15} /><input aria-label="Search projects" placeholder="Search projects or technologies…" value={search} onChange={event => { setSearch(event.target.value); setVisible(6); }} /></div></div><div className={styles.resultBar}><span role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'} to explore</span><label>Filter by tool <select value={tool} onChange={event => { setTool(event.target.value); setVisible(6); }} aria-label="Filter projects by tool">{['All tools', 'Power BI', 'Excel', 'SQL', 'Python', 'React', 'TypeScript', 'n8n'].map(value => <option key={value}>{value}</option>)}</select></label></div><div className={styles.grid}>{filtered.slice(0, visible).map(project => <article className={styles.workCard} key={project.id}><button className={`${styles.cardMedia} ${styles.mediaButton}`} onClick={() => setSelected(project)} aria-label={`Inspect ${project.title}`}><WorkImage src={project.image} alt={`${project.title} project cover`} sizes="(max-width: 650px) 100vw, 28vw" /><span className={`${styles.badge} ${styles.mediaBadge}`}>{project.statusBadge || 'Portfolio study'}</span></button><div className={styles.cardContent}><div className={styles.cardMeta}><span>{project.category}</span><span>STUDY / {String(project.id).padStart(2, '0')}</span></div><h3>{project.title}</h3><p>{project.desc}</p><div className={styles.tags}>{project.tools.slice(0, 3).map(value => <span key={value}>{value}</span>)}</div><div className={styles.cardFooter}><>{project.flagship ? <Link href={`/portfolio/${project.flagship.slug}`}>View Case Study <ArrowUpRight size={12} /></Link> : <button onClick={() => { const study = featuredProjects.find(study => study.liveUrl === project.live); if (study) setFeatured(study); else setSelected(project); }}>{featuredProjects.some(study => study.liveUrl === project.live) ? 'Read case study' : 'Project notes'} <ArrowUpRight size={12} /></button>}</>{project.live && project.live !== '#' && <Link href={project.live} target={project.live.startsWith('http') ? '_blank' : undefined} rel={project.live.startsWith('http') ? 'noopener noreferrer' : undefined}>{project.live.includes('tableau.com') ? 'External example' : 'Explore'}<ArrowUpRight size={12} /></Link>}</div></div></article>)}</div>{!filtered.length && <div className={styles.empty}>No projects match those filters.<button onClick={() => { chooseCategory('All'); setTool('All tools'); setSearch(''); }}>Reset filters</button></div>}{visible < filtered.length && <div className={styles.loadMore}><button className={styles.secondary} onClick={() => setVisible(value => value + 6)}>Explore more projects <ArrowDown size={14} /></button></div>}</section>
        <section id="working-together" className={styles.section}><SectionHeading number="03" eyebrow="HOW I WORK" title="Clarity is a process."><p>A considered path from the first business question to a report your team can use and understand.</p></SectionHeading><div className={styles.process}>{processSteps.map(step => <div key={step.step}><small>{step.step} /</small><h3>{step.title}</h3><p>{step.description}</p><span>{step.deliverable}</span></div>)}</div></section>
        <section id="contact-section" className={styles.section}><div className={styles.contact}><div><span className={styles.kicker}><i /> YOUR NEXT PROJECT STARTS WITH A CONVERSATION</span><h2>A reporting challenge?<br /><span>Let’s make it clearer.</span></h2><p>Tell me what your team needs to understand, improve, or build. Hiring for a role? I’d be happy to discuss the work and how I could contribute.</p><div className={styles.contactLinks}><a href="mailto:info@dattasable.com"><Mail size={15} />info@dattasable.com</a><a href="https://www.linkedin.com/in/dattasable/" target="_blank" rel="noopener noreferrer"><ArrowUpRight size={15} />Connect on LinkedIn</a><a href="/Dattatray_Sable_Resume.pdf" download><FileText size={15} />Download master résumé</a></div></div><form className={styles.form} onSubmit={submit}>{feedback && <div className={styles.feedback} role={status === 'error' ? 'alert' : 'status'}>{status === 'success' && <Check size={15} />} {feedback}</div>}<fieldset disabled={status === 'sending'}><div className={styles.fieldGrid}><label>Your name<input required name="name" autoComplete="name" maxLength={80} placeholder="Alex Morgan" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Email address<input required name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label></div><label>What can I help with?<select value={form.service} onChange={event => setForm({ ...form, service: event.target.value })}>{services.map(service => <option key={service.id}>{service.title}</option>)}<option>Career / full-time opportunity</option><option>Something else</option></select></label><label>Your timeline<select value={form.timeline} onChange={event => setForm({ ...form, timeline: event.target.value })}>{['Within 2–4 weeks', 'Within 1–3 months', 'Exploring possibilities', 'Hiring / interview discussion'].map(value => <option key={value}>{value}</option>)}</select></label><label>A little about your project<textarea name="message" required maxLength={5000} placeholder="The challenge, the tools you use, and what a useful outcome would look like…" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} /></label><label className={styles.honeypot} aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={event => setForm({ ...form, honeypot: event.target.value })} /></label><button className={styles.primary} type="submit">{status === 'sending' ? <Loader2 size={14} /> : <Send size={14} />}{status === 'sending' ? 'Sending your enquiry…' : 'Start the conversation'}<ArrowRight size={14} /></button></fieldset><small>Your details are used to respond to this enquiry. <Link href="/privacy">Privacy policy</Link>.</small></form></div></section>
      </div>

    </div>
    <Footer />
  <WorkDialog open={!!featured} onClose={() => setFeatured(null)} title={featured?.title || 'Case study'} description={featured?.subtitle || ''}>{featured && <><WorkImage src={featured.image} alt={`${featured.title} case study cover`} /><p className={styles.note}>{featured.provenanceLabel} · {featured.statusLabel}</p><h3>The business question</h3><p>{featured.businessQuestion}</p><p>{featured.caseStudy.problemContext}</p><h3>Dataset & provenance</h3><div className={styles.evidenceGrid}>{Object.entries(featured.caseStudy.datasetInfo).map(([label, value]) => <div key={label}><small>{label.toUpperCase()}</small><p>{value}</p></div>)}</div><h3>Tools & responsibilities</h3><ul>{featured.caseStudy.toolsAndRoles.map(item => <li key={item.tool}><strong>{item.tool}:</strong> {item.role}</li>)}</ul><h3>The approach</h3><ol>{featured.caseStudy.methodology.map(item => <li key={item}>{item}</li>)}</ol><h3>Metric definitions</h3>{featured.caseStudy.kpiDefinitions.map(item => <div key={item.name}><p><strong>{item.name}</strong> — {item.description}</p><code className={styles.formula}>{item.formula}</code></div>)}<h3>Findings in the illustrative dataset</h3><ul>{featured.caseStudy.keyFindings.map(item => <li key={item}>{item}</li>)}</ul><h3>Validation checks</h3><ul>{featured.caseStudy.validationChecks.map(item => <li key={item}>{item}</li>)}</ul><h3>Limitations & next steps</h3><p>{featured.caseStudy.limitationsAndNextSteps}</p><h3>What the project includes</h3><ul>{featured.deliverables.map(item => <li key={item}>{item}</li>)}</ul><div className={styles.actions}><WorkLink href={featured.liveUrl} primary>Explore the demonstration</WorkLink><button className={styles.secondary} onClick={() => enquire(featured.title)}>Discuss a similar project <Mail size={14} /></button></div></>}</WorkDialog>
  <WorkDialog open={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Project notes'} description={selected?.desc || ''}>{selected && <><WorkImage src={selected.image} alt={`${selected.title} project cover`} /><h3>The challenge</h3><p>{selected.problem}</p><h3>The approach</h3><p>{selected.solution}</p><h3>Demonstrated result</h3><p>{selected.impact}</p><div className={styles.tags}>{selected.tools.map(value => <span key={value}>{value}</span>)}</div><p className={styles.note}>Portfolio study. Any demonstration values are illustrative, not verified client results. External examples remain on their original provider’s site.</p><div className={styles.actions}>{selected.live && selected.live !== '#' && <WorkLink href={selected.live} primary>Explore project</WorkLink>}{selected.github && selected.github !== '#' && <WorkLink href={selected.github}>Source repository</WorkLink>}<button className={styles.secondary} onClick={() => enquire(selected.title)}>Discuss a similar project <Mail size={14} /></button></div></>}</WorkDialog>
  </div>;
}
export default function PortfolioClientPage({ hero, showcase }: { hero?: React.ReactNode; showcase?: React.ReactNode } = {}) { return <Suspense fallback={<div className={styles.page} style={{ minHeight: '100vh' }} />}><PortfolioContent hero={hero} showcase={showcase} /></Suspense>; }
