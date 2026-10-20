import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'BI, Dashboard and Data Automation Services | Datta Sable' },
  description: 'Explore dashboard development, SQL reporting, data pipelines and website services, with practical scoping, validation and handover details.',
  alternates: { canonical: 'https://dattasable.com/services' },
};
// Source-managed overview: the existing CMS summary had replaced this route with 56 words.
const services = [
  { href: '/services/dashboards', title: 'Dashboard design and development', body: 'Start with the decisions a dashboard needs to support. Define each metric, its grain, its owner and the source records before choosing charts. A dashboard engagement can cover a Power BI or Tableau model, calculated measures, filters, refresh behavior and access rules. Review sample totals against the source and test how missing values, late records and restricted users affect the result. Ask for a walkthrough of the model and a list of known limitations at handover.' },
  { href: '/services/automation', title: 'Reporting and data automation', body: 'Use automation for a repeatable workflow whose inputs and acceptance checks are understood. Examples include importing a scheduled file, cleaning data, reconciling totals and distributing a report to an approved audience. Scope duplicate detection, rejected-row handling, retries, notifications and recovery before scheduling the job. A successful run should record what it processed and how an operator can investigate failures. Time savings need a measured baseline and follow-up; they are not guaranteed by using a particular tool.' },
  { href: '/services/consulting', title: 'BI and SQL consulting', body: 'A consulting review can help diagnose slow reporting, inconsistent definitions or unclear ownership. Bring a representative query, the relevant execution plan where available, sample schemas and a description of the expected result. Agree which environment may be accessed and how sensitive fields will be protected. Recommendations should explain the trade-off, the evidence needed to validate it and a rollback path. A proposal can separate urgent corrections from improvements that require more data or business decisions.' },
  { href: '/services/web-solutions', title: 'Websites and data interfaces', body: 'A website or data interface needs a clear visitor task, accessible navigation and accurate descriptions of what the product does. Scope forms, authentication, content management and integrations explicitly. Validate error states and empty results as well as the main flow. For data-heavy interfaces, decide which content must render on the server and which interactions need the browser. Include ownership of hosting, domains, analytics and ongoing maintenance in the handover agreement.' },
];
export default function ServicesPage() {
  return <><Navbar /><main id="main-content" className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', maxWidth: 960 }}>
    <h1>BI, dashboard and data automation services</h1>
    <p>Choose a service by the problem you need to solve: a report people cannot reconcile, a manual process that fails unpredictably, or an interface that makes useful data difficult to reach. This overview explains typical work and the questions to settle before agreeing a project. Deliverables, schedule and price depend on the approved scope.</p>
    {services.map(service => <section key={service.href} style={{ marginTop: '2.5rem' }}><h2><Link href={service.href}>{service.title}</Link></h2><p>{service.body}</p></section>)}
    <section style={{ marginTop: '2.5rem' }}><h2>What to prepare for a scoping conversation</h2><p>Describe who will use the result, the decisions they need to make and the current source of truth. Share a redacted sample only after agreeing a secure channel; do not send production passwords or personal customer records through the contact form. Include data volume, refresh expectations, software constraints and the person who can approve definitions. We can then discuss acceptance checks, responsibilities and a realistic first milestone.</p><p><Link href="/contact">Discuss your project</Link> or <Link href="/portfolio">browse demonstration projects</Link>. Portfolio examples illustrate an approach and are not a promise of customer results.</p></section>
  </main><Footer /></>;
}
