import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MasterResume from '@/components/MasterResume';
import ResumeDownloads from '@/components/ResumeDownloads';
import { ArrowUpRight, ArrowRight, MapPin, Layers, Database, Workflow, BarChart3, Compass, ShieldCheck, ScanLine, BookOpen, Plus, Sparkles } from 'lucide-react';
import styles from './AboutContent.module.css';

const experience = [
  { date: 'Jun 2025 — Sep 2026', role: 'MIS Manager', company: 'DBS Mintek Pvt. Ltd.', desc: 'Developed reporting workflows with Power BI, SQL Server, Excel and Power Query.', tags: ['Reporting systems', 'Automation'] },
  { date: 'Oct 2023 — May 2025', role: 'Information System Analyst', company: 'SASCO', desc: 'Prepared management reports, KPI dashboards and SQL analysis for operational reviews.', tags: ['Business analysis', 'SQL'] },
  { date: 'Jan 2020 — Sep 2023', role: 'Assistant Manager, MIS & Analytics', company: 'Kissht Finance Ltd.', desc: 'Managed PAN-India collections MIS, team performance reporting and Excel dashboards.', tags: ['Risk analytics', 'Performance reporting'] },
  { date: 'Aug 2015 — Jan 2020', role: 'Deputy Manager', company: 'HDFC Bank Ltd.', desc: 'Managed credit-card delinquency and NPA portfolios in Mumbai, coordinating six agencies and supporting audit reporting.', tags: ['Banking', 'Portfolio operations'] },
];
const capabilities = [
  { icon: BarChart3, name: 'Decision interfaces', desc: 'Reporting that respects the person using it.', tools: ['Power BI', 'Tableau', 'Advanced Excel'], detail: 'Dashboard structure, analytical models, DAX, and performance reporting—designed around the questions people actually need to answer.' },
  { icon: Database, name: 'Data foundations', desc: 'Reliable answers start below the surface.', tools: ['SQL Server', 'Python', 'Microsoft Fabric'], detail: 'Query design, data preparation, and connected reporting foundations. The aim is a traceable path from source data to the final measure.' },
  { icon: Workflow, name: 'Connected workflows', desc: 'Less repetitive work. More room to think.', tools: ['Power Query', 'n8n', 'MIS systems'], detail: 'Repeatable transformations, reporting workflows, and thoughtful automation, with human review where judgment matters.' },
];
const certificates = [
  { title: 'Generative AI for Digital Marketers', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Generative AI for Digital Marketers.pdf' },
  { title: 'AI and the Future of the Public Sector', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_AI and the Future of the Public Sector.pdf' },
  { title: 'Google Analytics', issuer: 'Google Analytics', file: 'Google Analytics Certifiacte.pdf' },
  { title: 'Content Strategy for Marketers', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Content Strategy for Marketers.pdf' },
  { title: 'Digital Marketing Tools', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Digital Marketing Tools Create a Marketing Campaign from Start to Finish.pdf' },
  { title: 'Marketing on LinkedIn', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Marketing on LinkedIn.pdf' },
];
const portraits = [
  { file: 'datta-office-portrait', title: 'Start with the person.', label: 'PERSPECTIVE', alt: 'Datta Sable seated at a desk in a blue jacket', story: 'Before choosing a tool or building a report, I want to understand the person who will use it. What do they need to know? What decision comes next? That business context gives the technical work a purpose.', note: 'The question comes before the chart.' },
  { file: 'datta-dashboard-presentation', title: 'Give the data a voice.', label: 'TRANSLATION', alt: 'Datta Sable standing beside a Power BI dashboard', story: 'A useful dashboard brings the important relationships into focus. My interest lies in that translation: taking a complex model and shaping a clear, readable view that helps someone ask a better question.', note: 'Clarity is a design decision.' },
  { file: 'datta-analytics-portrait', title: 'Look a little closer.', label: 'CURIOSITY', alt: 'Datta Sable pointing to a chart on a Power BI display', story: 'The first number is rarely the whole story. I look for the context behind a trend, the assumptions inside a measure, and the details that change how an answer should be interpreted.', note: 'A good insight can begin with another question.' },
  { file: 'datta-workspace-portrait', title: 'Make room for the craft.', label: 'EXPLORATION', alt: 'Datta Sable seated with a laptop and dashboard visuals', story: 'This is the side of the work I enjoy sharing: exploring an idea, testing an approach, and making the reasoning easier to follow. Writing guides is one way to turn that process into something useful to someone else.', note: 'Learn it. Try it. Share the reasoning.' },
  { file: 'datta-outdoor-portrait', title: 'Keep the wider view.', label: 'BALANCE', alt: 'Datta Sable standing on an outdoor balcony', story: 'Beyond the tools and technical details, I come back to a simple aim: make the work more useful for people. A wider perspective helps keep the system connected to the problem it was meant to solve.', note: 'The work matters because people use it.' },
];
export default function AboutContent() {
  return <div className={styles.page}>
    <Navbar />
    <main className={`boxed-wrapper ${styles.main}`}>
      <section className={styles.hero} aria-labelledby="about-title"><div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}><span className={styles.eyebrow}><span className={styles.dot}/> THE PERSON BEHIND THE PIXELS</span><p className={styles.hello}>Hi, I’m Datta Sable.</p><h1 id="about-title">A mind for data.<br/>An eye for detail.<br/><span>A reason to build.</span></h1><p className={styles.heroDescription}>I bring business context, analytical thinking, and thoughtful design together—turning complex information into something people can confidently use.</p><div className={styles.heroActions}><Link href="/contact" className={styles.primary}>Let’s talk about your idea <ArrowUpRight size={17}/></Link><a href="#my-journey" className={styles.secondary}>Explore my journey <ArrowRight size={15}/></a></div><div className={styles.heroMeta}><span><MapPin size={13}/> Mumbai, India</span><span><Layers size={13}/> Business intelligence & data strategy</span></div></div>
          <div className={styles.portraitComposition}><div className={styles.portraitOrbit}/><span className={styles.portraitSide}>CONTEXT / CRAFT / CLARITY</span><div className={styles.portrait}><Image src="/images/datta.webp" alt="Datta Sable, business intelligence and data strategy professional" fill priority sizes="(max-width: 800px) 85vw, 440px"/><div className={styles.portraitCaption}><span>DATTA SABLE</span><strong>Thoughtful systems.<br/>Human outcomes.</strong></div></div><div className={styles.portraitSeal} aria-hidden="true"><ScanLine size={23}/><span>BUILT WITH<br/>INTENTION</span></div><div className={styles.portraitFoot}><span>01 / A PERSONAL INTRODUCTION</span><Sparkles size={13}/></div></div>
        </div>
      </div></section>
      <nav className={styles.chapterNav} aria-label="About page sections"><div className="container"><div>{[['01','The perspective','#perspective'],['02','The craft','#the-craft'],['03','The journey','#my-journey'],['04','The learning','#always-learning']].map(([n,label,href])=><a href={href} key={n}><span>{n}</span>{label}<ArrowUpRight size={13}/></a>)}</div></div></nav>

      <section id="perspective" className={styles.section} aria-labelledby="perspective-title"><div className="container"><div className={styles.storyGrid}>
        <div><span className={styles.eyebrow}>01 / THE PERSPECTIVE</span><h2 className={styles.heading} id="perspective-title">The dashboard<br/>is only <span>the beginning.</span></h2><div className={styles.storyNote}><span className={styles.noteLine}/><p>The real work is understanding what happens on the other side of the screen.</p></div></div>
        <div className={styles.storyCopy}><p className={styles.storyLead}>My path into analytics began with the business itself.</p><p>Banking, portfolio operations, and MIS taught me to look beyond the chart: who needs the information, what decision comes next, and how much confidence the underlying data deserves.</p><p>That perspective shapes how I work today. I connect reporting, data systems, and automation with the practical realities of the teams using them.</p><div className={styles.storySignature}><span>Business context first.<br/>Technology with a purpose.</span><span className={styles.monogram}>DS<span>.</span></span></div></div>
      </div></div></section>

      <section className={styles.photoStorySection} aria-labelledby="portraits-title"><div className="container">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE THREAD THAT CONNECTS IT ALL</span><h2 className={styles.heading} id="portraits-title">More than a portrait.<br/><span>A way of seeing.</span></h2></div><p>Five perspectives on the work.<br/>One chapter at a time.</p></div>
        <ol className={styles.photoTimeline}>
          {portraits.map(({file,title,label,alt,story,note},i)=><li className={styles.photoChapter} key={file}>
            <span className={styles.chapterMarker}>0{i+1}</span>
            <figure className={styles.storyPhoto}><div><Image src={`/images/about/${file}.webp`} alt={alt} fill sizes="(max-width: 480px) 75vw, (max-width: 800px) 42vw, 320px"/></div><figcaption><span>DATTA SABLE / PORTRAIT 0{i+1}</span><span>DS.</span></figcaption></figure>
            <div className={styles.photoStory}><span className={styles.eyebrow}>CHAPTER 0{i+1} / {label}</span><h3>{title}</h3><p>{story}</p><div className={styles.storyTakeaway}><span/>{note}</div></div>
          </li>)}
        </ol>
      </div></section>

      <section id="the-craft" className={styles.section} aria-labelledby="craft-title"><div className="container"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>02 / THE CRAFT</span><h2 className={styles.heading} id="craft-title">Different layers.<br/><span>One connected picture.</span></h2></div><p>From the first source to the final decision.<br/>Explore the areas where I focus my work.</p></div>
        <div className={styles.craftGrid}><div className={styles.systemMap} aria-hidden="true"><div className={styles.mapTop}><span>THE CLARITY MODEL</span><span>INPUT → OUTCOME</span></div><div className={styles.mapLines}/><div className={styles.mapSource}><Database size={17}/><span>DATA & CONTEXT</span></div><div className={styles.mapCenter}><Layers size={30} strokeWidth={1.25}/><strong>Make it<br/>meaningful.</strong></div><div className={styles.mapOutputs}><span><BarChart3 size={16}/>Understand</span><span><Workflow size={16}/>Act</span></div><div className={styles.mapBottom}><span className={styles.dot}/> Human judgment stays in the loop.</div></div>
          <div className={styles.capabilities}>{capabilities.map(({icon:Icon,name,desc,tools,detail},i)=><details className={styles.capability} key={name} open={i===0}><summary><span className={styles.capabilityIcon}><Icon size={20} strokeWidth={1.5}/></span><span><h3>{name}</h3><span className={styles.capabilityDesc}>{desc}</span></span><Plus size={16} className={styles.plus}/></summary><div className={styles.capabilityDetail}><p>{detail}</p><div className={styles.tags}>{tools.map(t=><span key={t}>{t}</span>)}</div></div></details>)}</div>
        </div>
      </div></section>

      <section id="my-journey" className={styles.section} aria-labelledby="journey-title"><div className="container"><div className={styles.journeyGrid}><div className={styles.journeyIntro}><span className={styles.eyebrow}>03 / THE JOURNEY</span><h2 className={styles.heading} id="journey-title">Built through<br/><span>real experience.</span></h2><p>A path from banking operations to analytics and reporting systems. Each role added a different way to see the same problem.</p><MasterResume/><div className={styles.journeyArt} aria-hidden="true"><span>OPERATIONS</span><i/><span>ANALYTICS</span><i/><span>CONNECTED SYSTEMS</span></div></div>
        <ol className={styles.timeline}>{experience.map(({date,role,company,desc,tags},i)=><li key={company}><span className={`${styles.timelineDot} ${i===0?styles.current:''}`}/><div className={styles.timelineTop}><span>{date}</span>{i===0&&<span className={styles.present}>MOST RECENT ROLE</span>}</div><h3>{role}</h3><span className={styles.company}>{company}</span><p>{desc}</p><div className={styles.tags}>{tags.map(t=><span key={t}>{t}</span>)}</div></li>)}</ol></div></div></section>

      <section className={styles.section} aria-labelledby="principles-title"><div className="container"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE CONSTANTS</span><h2 id="principles-title" className={styles.heading}>Tools change.<br/><span>These principles stay.</span></h2></div><p>The quiet decisions behind the work.</p></div><div className={styles.principles}>{[{icon:ShieldCheck,title:'Trust the foundation.',desc:'Question the source. Check the calculation. Make the path from input to insight easier to follow.',word:'INTEGRITY'},{icon:Compass,title:'Design for a person.',desc:'A clear hierarchy, a useful measure, and a thoughtful interaction matter more than another layer of decoration.',word:'EMPATHY'},{icon:Workflow,title:'Simplify with intention.',desc:'Automate the repeatable. Keep review where it adds value. Make the system easier to understand and maintain.',word:'PURPOSE'}].map(({icon:Icon,title,desc,word},i)=><article className={styles.principle} key={word}><div><span>0{i+1}</span><Icon size={23} strokeWidth={1.4}/></div><h3>{title}</h3><p>{desc}</p><span className={styles.principleWord}>{word}</span></article>)}</div></div></section>

      <section id="always-learning" className={styles.section} aria-labelledby="learning-title"><div className="container"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>04 / ALWAYS A STUDENT</span><h2 className={styles.heading} id="learning-title">Curiosity doesn’t<br/><span>have a finish line.</span></h2></div><p>A selection of completed learning.<br/>Open a certificate to see the original document.</p></div><div className={styles.certificateGrid}>{certificates.map(({title,issuer,file},i)=><a href={`/certs/${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer" className={styles.certificate} key={file}><div className={styles.certificateMark}><BookOpen size={19} strokeWidth={1.5}/><span>0{i+1}</span></div><div><span className={styles.issuer}>{issuer}</span><h3>{title}</h3><span className={styles.certificateAction}>View certificate <ArrowUpRight size={12}/></span></div><div className={styles.perforation}/></a>)}</div>
      <div className={styles.learningNote}><BookOpen size={20}/><p>Learning is more useful when it travels.<br/><span>I share technical guides, implementation ideas, and the questions worth exploring.</span></p><Link href="/blog">Read the field notes <ArrowUpRight size={15}/></Link></div></div></section>

      <section className={styles.closingSection} aria-labelledby="about-contact-title"><div className="container"><div className={styles.closing}><div className={styles.closingGraphic} aria-hidden="true"><div/><div/><span><ArrowUpRight size={48} strokeWidth={1}/></span></div><div className={styles.closingCopy}><span className={styles.eyebrow}>THE NEXT CHAPTER COULD BE YOURS</span><h2 id="about-contact-title">Good work starts<br/>with a <span>good conversation.</span></h2><p>Have a reporting challenge, an idea to explore, or a system that could work better? Let’s start there.</p><Link href="/contact" className={styles.primary}>Tell me what you’re building <ArrowUpRight size={17}/></Link></div></div><p className={styles.identityNote}>Datta Sable is an independent professional practice. This website is not affiliated with the “Datta Able” admin dashboard template.</p></div></section>
    </main>
    <Footer />
  </div>;
}
