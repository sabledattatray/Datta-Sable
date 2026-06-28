import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Editorial Policy, AI Disclosure & Research Standards | Datta Sable',
  description: 'Learn about our editorial standards, AI content disclosure, fact-checking process, research methodology, and testing protocols for technical guides.',
  alternates: { canonical: 'https://dattasable.com/editorial-policy' },
};

export default async function EditorialPolicyPage() {
  const dynamicPage = await getDynamicPage('editorial-policy');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)', paddingBottom: '6rem' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="label-tech mb-6">EEAT_TRUST_DOCUMENT // V1.1</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 42px)', lineHeight: 1.2, marginBottom: '2rem', fontFamily: "'Syne', sans-serif" }}>
              Editorial Policy, AI Disclosure &amp; <span className="hero-title">Research Standards</span>
            </h1>
            
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              At Datta Sable BI &amp; Analytics Consulting, we are committed to providing the highest quality technical tutorials, guides, and benchmarks in the data engineering and business intelligence space. This document outlines our editorial rigor, testing methodologies, AI disclosure rules, and citation standards.
            </p>

            <hr style={{ border: 0, height: '1px', background: 'var(--border)', margin: '2.5rem 0' }} />

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>1. Core Editorial Standards</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--text)' }}>
              All technical guides and reviews published on this platform must meet the following criteria:
            </p>
            <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--muted)' }}>
              <li><strong>Technical Accuracy:</strong> Every code block, SQL query, DAX expression, and n8n workflow must be verified and run in a local or cloud sandbox before publication.</li>
              <li><strong>Originality:</strong> We do not publish shallow, AI-summarized rehashes of official documentation. Every article must offer original commentary, real-world case experiences, or benchmark calculations.</li>
              <li><strong>Objectivity:</strong> Tool comparisons (e.g. Postgres vs Snowflake) are based on raw telemetry, query profiles, and latency calculations rather than marketing claims.</li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>2. AI Content Disclosure</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--muted)' }}>
              In the spirit of complete transparency, we disclose our policy regarding generative AI tools (such as ChatGPT, Claude, or Copilot):
            </p>
            <div style={{ background: 'var(--surface2)', borderLeft: '3px solid var(--accent)', padding: '1.5rem', marginBottom: '2rem', borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>
                <strong>How AI is used:</strong> We occasionally utilize AI models to assist with structure brainstorming, draft outlines, typo identification, or code refactoring optimization. 
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text)', margin: '0.75rem 0 0 0' }}>
                <strong>How AI is NOT used:</strong> We do not publish raw, auto-generated AI text. Every sentence is manually reviewed, verified, expanded, and edited by Datta Sable. Every piece of code is manually tested in sandbox environments to ensure it works under actual system workloads. All perspectives and experience logs represent real, human-conducted consulting assignments.
              </p>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>3. Fact-Checking &amp; Research Process</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--muted)' }}>
              To ensure all guidelines stand up to production demands:
            </p>
            <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--muted)' }}>
              <li><strong>Primary Documentation Review:</strong> Every tutorial is double-checked against current documentation of Microsoft Fabric, Power BI, SQL Server, and Next.js. We monitor vendor release notes weekly for feature changes.</li>
              <li><strong>GitHub Issue Logs:</strong> We cross-reference known issues and bug trackers of open-source frameworks (e.g. Prisma ORM, Next.js) to confirm if workarounds suggested in our guides are up-to-date.</li>
              <li><strong>Performance Profiling:</strong> We record raw query plans and CPU capacities, profiling query latency with warm and cold caches to provide authentic benchmarks.</li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>4. Research &amp; "How We Test" Protocol</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--text)' }}>
              To maintain the integrity of our benchmarking data, we follow a strict test engineering process:
            </p>
            <div style={{ background: 'var(--surface2)', borderLeft: '3px solid var(--accent)', padding: '1.5rem', marginBottom: '2rem', borderRadius: '0 8px 8px 0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Local &amp; Cloud Sandbox Environments</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
                Performance tests are conducted on dedicated Microsoft Fabric capacities (F2 to F64 workloads) or local workstation sandboxes. SQL query optimization guides are benchmarked using synthetic datasets (like TPC-H or custom 10M-row generated files) to record exact cold-cache execution times, memory paging, and logical reads.
              </p>
            </div>
            <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--muted)' }}>
              <li><strong>Power BI &amp; Fabric Testing:</strong> Capacity consumption metrics (CU usage) are calculated using the Microsoft Fabric Capacity Metrics App, rather than arbitrary estimations.</li>
              <li><strong>Database Benchmarking:</strong> Query executions are timed with `SET STATISTICS IO, TIME ON` in SQL Server, or `EXPLAIN ANALYZE` in PostgreSQL to ensure transparency.</li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>5. Citation &amp; Source Verifiability</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--text)' }}>
              We believe in cross-linking our technical assertions with official research. We cite:
            </p>
            <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--muted)' }}>
              <li>Official vendor documentation (Microsoft Learn, Snowflake Documentation, W3C standards).</li>
              <li>Academic research papers (e.g. database indexing papers, prompt architecture studies).</li>
              <li>Open-source repositories where readers can download, audit, and run the test scripts themselves.</li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: "'Syne', sans-serif" }}>6. Content Freshness &amp; Update Policy</h2>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--muted)' }}>
              Technology evolves rapidly. Our editorial team reviews top informational guides every six months to verify if the code snippets or APIs remain accurate. When a guide is modified, the <strong>Last Updated</strong> date is refreshed. If a reader finds an issue in a code sample, we review and apply corrections within 48 hours.
            </p>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4rem', fontStyle: 'italic' }}>
              For editorial concerns or suggestions regarding our testing standards, contact info@dattasable.com.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
