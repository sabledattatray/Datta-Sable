import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata: Metadata = {
  title: 'Editorial Policy & Research Standards',
  description: 'Authorship, AI assistance, examples, evidence and corrections for Datta Sable technical articles.',
  alternates: { canonical: 'https://dattasable.com/editorial-policy' },
};
export default function EditorialPolicyPage() {
  return <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <Navbar /><section className="container" style={{ maxWidth: 800, paddingTop: '8rem', paddingBottom: '6rem', lineHeight: 1.8 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 24 }}>Editorial policy and research standards</h1>
      <p>Updated October 20, 2026. Datta Sable is responsible for the technical articles and demonstrations on this website. These standards guide publication and corrections; they are not a certification that every historical article or code sample has been independently audited.</p>
      <h2>Authorship and AI assistance</h2>
      <p>AI tools may assist with research, outlines, drafting, images or code. Their output can contain errors. The author remains responsible for accuracy, useful explanations and appropriate attribution. AI assistance does not establish first-hand experience or prove that an example was executed. Article-specific disclosures should describe material assistance where relevant.</p>
      <h2>Useful, original material</h2>
      <p>A technical article should answer a clear question and provide topic-specific reasoning, an example, a diagnostic method or a reproducible exercise. Repeating generic architecture advice across unrelated subjects does not add useful evidence. Stock passages identified during our content audit are being removed from public output while articles undergo further review.</p>
      <h2>Examples, demonstrations and client work</h2>
      <p>Practice datasets and illustrative scenarios should be labelled. A demonstration, invented organization name or sample workbook must not be presented as a verified client engagement. Confidential client information should not be published without authorization. Where the source of a dataset or an engagement is unclear, readers should request clarification before relying on a business claim.</p>
      <h2>Code and performance evidence</h2>
      <p>Code examples may need adaptation for your software version, permissions and environment. Test them in an isolated environment before using them with production data. A measured benchmark should identify the workload, dataset, software versions, configuration, method and limitations. A percentage improvement without that context is not a reproducible result or a promise of your performance.</p>
      <h2>Sources and changing products</h2>
      <p>Product-specific claims should link to primary documentation. Vendor services, certifications, pricing and limits change, so check the linked official source before making a purchase or an exam booking. An update date should reflect a substantive revision; it should not refresh merely because a page was viewed or rebuilt.</p>
      <h2>Corrections and commercial interests</h2>
      <p>Report a factual error, broken example, missing attribution or unclear sponsorship to <a href="mailto:info@dattasable.com">info@dattasable.com</a>, including the article URL and the relevant passage. Corrections should address the underlying error and disclose material changes when appropriate. Sponsored placements or affiliate relationships should be identified where they appear. Advertising does not make a tutorial an official endorsement by the vendor discussed.</p>
    </section><Footer />
  </div>;
}
