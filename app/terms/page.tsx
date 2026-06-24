import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Datta Sable',
  description: 'Terms of Service for dattasable.com — rules governing use of this website, dashboards, and content.',
  openGraph: {
    title: 'Terms of Service | Datta Sable',
    description: 'Terms of Service for dattasable.com.',
    url: 'https://dattasable.com/terms',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable' }],
  },
  twitter: { card: 'summary', title: 'Terms of Service | Datta Sable', description: 'Terms of Service for dattasable.com.', images: ['/images/dattasable.com.webp'] },
  alternates: { canonical: 'https://dattasable.com/terms' },
};

export default function TermsPage() {
  const lastUpdated = "April 29, 2026";

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>LEGAL-DOCUMENT</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 40px)', fontWeight: 600, marginBottom: '1rem' }}>Terms of Service</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>Last Updated: {lastUpdated}</p>

          <div className="card" style={{ padding: '3rem', lineHeight: '1.8' }}>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Acceptance of Terms</h2>
              <p>By accessing and using Datta Sable's portfolio and BI platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Use of Services</h2>
              <p>The content provided on this site, including dashboards, case studies, and technical logs, is for portfolio demonstration and informational purposes. Unauthorized use of this site or its contents may violate copyright, trademark, and other laws.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3. Authentication & Access</h2>
              <p>Access to certain features (like dashboards) requires authentication via Google or other social providers. You are responsible for maintaining the confidentiality of your session and account.</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4. Limitation of Liability</h2>
              <p>The data and insights provided in demonstration dashboards are based on mock or sample data. Datta Sable is not liable for any business decisions made based on the demonstration content of this portfolio.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5. Modifications</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the site after such changes constitutes your acceptance of the new terms.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
