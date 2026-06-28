import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Disclaimer | Datta Sable',
  description: 'Legal disclaimer for dattasable.com — professional, external links, and results disclaimers.',
  openGraph: {
    title: 'Disclaimer | Datta Sable',
    description: 'Legal disclaimer for dattasable.com.',
    url: 'https://dattasable.com/disclaimer',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Disclaimer | Datta Sable', description: 'Legal disclaimer for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/disclaimer' },
};

export default async function DisclaimerPage() {
  const dynamicPage = await getDynamicPage('disclaimer');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  const lastUpdated = "April 30, 2026";

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>LEGAL-DOCUMENT</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 40px)', fontWeight: 600, marginBottom: '1rem' }}>Disclaimer</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>Last Updated: {lastUpdated}</p>

          <div className="card" style={{ padding: '3rem', lineHeight: '1.8' }}>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Professional Disclaimer</h2>
              <p>The information provided by Datta Sable (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on dattasable.com (the &quot;Site&quot;) is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
              <p style={{ marginTop: '1rem' }}>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. External Links Disclaimer</h2>
              <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3. Professional Results Disclaimer</h2>
              <p>The Site cannot and does not contain professional financial, legal, or data engineering advice. The technical information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4. Testimonials Disclaimer</h2>
              <p>The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5. Errors and Omissions Disclaimer</h2>
              <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Datta Sable is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
