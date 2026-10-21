import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import styles from './HomeFinish.module.css';
const faqs = [
  {
    id: "FAB-01",
    tag: "Microsoft Fabric",
    question: "What is Microsoft Fabric and how does it benefit enterprise data systems?",
    answer: "Microsoft Fabric is an all-in-one analytics solution for enterprises that covers everything from data movement to data science, Real-Time Analytics, and business intelligence. It integrates separate services like Azure Synapse, Data Factory, and Power BI into a single, unified SaaS platform built on an open OneLake data foundation."
  },
  {
    id: "CERT-02",
    tag: "Certifications",
    question: "Which Microsoft Fabric certification should I take first?",
    answer: "Choose by role: DP-600 covers Fabric analytics engineering, DP-700 covers Fabric data engineering, and DP-800 covers AI-enabled database development across Microsoft SQL platforms. Compare the current Microsoft Learn study guides with the work you want to do."
  },
  {
    id: "STOR-03",
    tag: "Direct Lake Mode",
    question: "What is Direct Lake mode in Power BI and Fabric?",
    answer: "Direct Lake is a ground-breaking semantic model capability for analyzing very large volumes of data in Power BI. It allows loading data directly from Delta tables in OneLake into the Power BI engine without converting it or executing queries in DirectQuery or Import modes, keeping dashboard rendering speeds incredibly fast."
  },
  {
    id: "LEARN-04",
    tag: "Power BI Learning",
    question: "How do I start learning Power BI effectively?",
    answer: "Begin by mastering clean star-schema data modeling practices, followed by learning fundamental DAX calculations. We recommend official Microsoft Learn pathways, running hands-on exercises with real datasets, and studying technical blogs like our collection to understand enterprise patterns."
  },
  {
    id: "SQL-05",
    tag: "SQL Certifications",
    question: "Which SQL database certification is best for data professionals?",
    answer: "For cloud data engineers, Snowflake SnowPro Core or Microsoft Azure Database Administrator certifications are highly valued. However, a deep understanding of standard ANSI SQL, query plan analysis, and indexing mechanics is far more critical in day-to-day work than any specific certificate."
  },
  {
    id: "TOOLS-06",
    tag: "Technical Stack",
    question: "What tools and technologies do you use for data automation?",
    answer: "Our typical technical stack includes Microsoft Fabric, Power BI, PostgreSQL, DuckDB, Python (for ETL pipelines), dbt (for data transformations), and n8n (for cloud service and API workflow orchestrations)."
  }
];

export default function FAQ() {
  return <section className={styles.section} aria-labelledby="home-faq-title"><div className="container"><div className={styles.faqLayout}>
    <div className={styles.faqIntro}><span className={styles.eyebrow}>A FEW GOOD QUESTIONS</span><h2 className={styles.title} id="home-faq-title">Clear answers.<br/><span>Better next steps.</span></h2><p>A starting point for the questions behind your data, your tools, and your next skill.</p><Link href="/sitemap" className={styles.textLink}>Find a guide in the directory <ArrowUpRight size={15}/></Link><div className={styles.questionStamp} aria-hidden="true"><span>?</span></div></div>
    <div className={styles.faqList}>{faqs.map((faq,index)=><details key={faq.id} className={styles.faqItem}><summary><span className={styles.faqNumber}>0{index+1}</span><div className={styles.faqQuestion}><span className={styles.faqTag}>{faq.tag}</span><h3>{faq.question}</h3></div><span className={styles.faqToggle} aria-hidden="true"><Plus size={15}/></span></summary><p className={styles.faqAnswer}>{faq.answer}</p></details>)}</div>
  </div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(faq=>({'@type':'Question',name:faq.question,acceptedAnswer:{'@type':'Answer',text:faq.answer}}))}).replace(/</g,'\u003c')}}/></div></section>;
}
