import type { Metadata } from 'next';
import { ArrowUpRight, BookOpen, CalendarDays, Code2, FileCheck2, Fingerprint, Mail, PenLine, RefreshCw, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './EditorialPolicy.module.css';

export const metadata: Metadata = {
  title: 'Editorial Policy & Research Standards',
  description: 'Authorship, AI assistance, examples, evidence and corrections for Datta Sable technical articles.',
  alternates: { canonical: 'https://dattasable.com/editorial-policy' },
};

const standards = [
  {
    id: 'authorship', title: 'Authorship and AI assistance', label: 'Accountability', icon: PenLine,
    content: 'AI tools may assist with research, outlines, drafting, images or code. Their output can contain errors. The author remains responsible for accuracy, useful explanations and appropriate attribution. AI assistance does not establish first-hand experience or prove that an example was executed. Article-specific disclosures should describe material assistance where relevant.',
  },
  {
    id: 'original-material', title: 'Useful, original material', label: 'Originality', icon: Fingerprint,
    content: 'A technical article should answer a clear question and provide topic-specific reasoning, an example, a diagnostic method or a reproducible exercise. Repeating generic architecture advice across unrelated subjects does not add useful evidence. Stock passages identified during our content audit are being removed from public output while articles undergo further review.',
  },
  {
    id: 'examples', title: 'Examples, demonstrations and client work', label: 'Transparency', icon: BookOpen,
    content: 'Practice datasets and illustrative scenarios should be labelled. A demonstration, invented organization name or sample workbook must not be presented as a verified client engagement. Confidential client information should not be published without authorization. Where the source of a dataset or an engagement is unclear, readers should request clarification before relying on a business claim.',
  },
  {
    id: 'code-and-evidence', title: 'Code and performance evidence', label: 'Reproducibility', icon: Code2,
    content: 'Code examples may need adaptation for your software version, permissions and environment. Test them in an isolated environment before using them with production data. A measured benchmark should identify the workload, dataset, software versions, configuration, method and limitations. A percentage improvement without that context is not a reproducible result or a promise of your performance.',
  },
  {
    id: 'sources', title: 'Sources and changing products', label: 'Context', icon: RefreshCw,
    content: 'Product-specific claims should link to primary documentation. Vendor services, certifications, pricing and limits change, so check the linked official source before making a purchase or an exam booking. An update date should reflect a substantive revision; it should not refresh merely because a page was viewed or rebuilt.',
  },
  {
    id: 'corrections', title: 'Corrections and commercial interests', label: 'Editorial independence', icon: FileCheck2,
    content: <>Report a factual error, broken example, missing attribution or unclear sponsorship to <a href="mailto:info@dattasable.com">info@dattasable.com</a>, including the article URL and the relevant passage. Corrections should address the underlying error and disclose material changes when appropriate. Sponsored placements or affiliate relationships should be identified where they appear. Advertising does not make a tutorial an official endorsement by the vendor discussed.</>,
  },
];

export default function EditorialPolicyPage() {
  return <div className={styles.page}>
    <Navbar />
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}><ShieldCheck size={15} aria-hidden="true" /> Behind the articles</div>
        <h1>Editorial policy<br /><span>and research standards.</span></h1>
        <p className={styles.intro}>Datta Sable is responsible for the technical articles and demonstrations on this website.</p>
        <div className={styles.updated}><CalendarDays size={15} aria-hidden="true" /><span>Updated <time dateTime="2026-10-20">October 20, 2026</time></span><span className={styles.divider} aria-hidden="true" /><span>Authorship. Evidence. Corrections.</span></div>
      </header>
      <div className={styles.contextNote}>
        <span className={styles.noteIcon}><ShieldCheck size={22} aria-hidden="true" /></span>
        <div><h2>Our standards, with context.</h2><p>These standards guide publication and corrections; they are not a certification that every historical article or code sample has been independently audited.</p></div>
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav aria-label="Editorial policy sections">
            <span className={styles.navLabel}>On this page</span>
            <ol>{standards.map((standard, index) => <li key={standard.id}><a href={`#${standard.id}`}><span className={styles.navNumber}>{String(index + 1).padStart(2, '0')}</span><span>{standard.title}</span></a></li>)}</ol>
          </nav>
          <div className={styles.sidebarNote}><Mail size={18} aria-hidden="true" /><p>Something needs a closer look?</p><a href="#report-an-issue">Help us improve <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </aside>
        <div className={styles.standards}>
          {standards.map(({ id, title, label, icon: Icon, content }, index) => <section key={id} id={id} aria-labelledby={`${id}-title`} className={styles.standard}>
            <div className={styles.cardTop}><span className={styles.icon}><Icon size={21} aria-hidden="true" /></span><span className={styles.cardLabel}>{label}</span><span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span></div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{content}</p>
          </section>)}
          <section id="report-an-issue" className={styles.contact} aria-labelledby="report-title">
            <div><span className={styles.eyebrow}>Keep the conversation open</span><h2 id="report-title">Found something we should review?</h2><p>Send the article URL and the relevant passage so we can understand the issue.</p></div>
            <a href="mailto:info@dattasable.com" className={styles.contactButton}>Contact the author <ArrowUpRight size={17} aria-hidden="true" /></a>
          </section>
        </div>
      </div>
    </div>
    <Footer />
  </div>;
}
