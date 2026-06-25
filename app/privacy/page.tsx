import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Datta Sable',
  description: 'Privacy Policy for dattasable.com — how we collect, use, and protect your personal data, including Google AdSense advertising disclosure and cookie policy.',
  openGraph: {
    title: 'Privacy Policy | Datta Sable',
    description: 'Privacy Policy for dattasable.com — data collection, usage, and protection practices.',
    url: 'https://dattasable.com/privacy',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Privacy Policy | Datta Sable', description: 'Privacy Policy for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/privacy' },
};

export default function PrivacyPage() {
  const lastUpdated = "June 25, 2026";

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>LEGAL-DOCUMENT</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 40px)', fontWeight: 600, marginBottom: '1rem' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>Last Updated: {lastUpdated}</p>

          <div className="card" style={{ padding: '3rem', lineHeight: '1.8' }}>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Introduction</h2>
              <p>Welcome to Datta Sable&apos;s Portfolio (dattasable.com). We respect your privacy and are committed to protecting your personal data. This privacy policy informs you how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                <li><strong>Identity Data</strong>: Includes first name, last name, or similar identifier (collected via Google One-Tap).</li>
                <li><strong>Contact Data</strong>: Includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong>: Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Usage Data</strong>: Includes information about how you use our website and services.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                <li>To provide access to specialized BI dashboards and analytics content.</li>
                <li>To respond to your inquiries via our contact form.</li>
                <li>To optimize website performance and user experience through analytics.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4. GDPR Rights (EU Users)</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5. CCPA Compliance (California Users)</h2>
              <p>The California Consumer Privacy Act (CCPA) provides California residents with specific rights regarding their personal information. You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. We do not sell your personal data to third parties.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>6. Advertising & Cookies (Google AdSense)</h2>

              {/* AdSense disclosure banner — required by AdSense programme policies */}
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>📢</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong>Advertising Disclosure:</strong> This website, <strong>dattasable.com</strong>, participates in the <strong>Google AdSense programme</strong>. Google, as a third-party vendor, uses cookies to serve ads on this site. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your prior visits to this and other websites.
                </p>
              </div>

              <p>This website uses Google AdSense, a third-party advertising service provided by Google LLC. Google AdSense uses cookies, including the DoubleClick DART cookie, to serve advertisements to visitors based on their visit to this site and other websites on the Internet.</p>
              <p style={{ marginTop: '1rem' }}>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet. These cookies allow Google and its partners to show you relevant ads across the web.</p>
              <p style={{ marginTop: '1rem' }}>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s advertising cookies enable Google and its partners to serve ads based on visits to this site and/or other sites on the Internet.</p>
              <p style={{ marginTop: '1rem' }}>You may opt out of personalized advertising in the following ways:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
                <li>Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google Ads Settings</a></li>
                <li>Visit <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>www.aboutads.info</a></li>
                <li>Visit <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google&apos;s Privacy Policy</a></li>
                <li>Visit <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google&apos;s Advertising Policies</a></li>
              </ul>
              <p style={{ marginTop: '1rem' }}>By using this website, you consent to the processing of data about you by Google in the manner and for the purposes set out above. If you do not want Google to use information based on your site activity for personalizing ads, you may opt out by visiting Ads Settings.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>7. Cookies Policy</h2>
              <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>8. Data Retention</h2>
              <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>9. Contact Us</h2>
              <p>If you have any questions about this privacy policy or our data practices, please contact us at: <a href="mailto:info@dattasable.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>info@dattasable.com</a></p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
