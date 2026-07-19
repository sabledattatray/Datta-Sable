import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';
import { getDynamicPage } from '@/lib/dynamic-page';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export const metadata: Metadata = {
  title: 'Cookie Policy | Datta Sable',
  description: 'Cookie Policy for dattasable.com — explaining how we use cookies, tracking technologies, and Google AdSense integration.',
  alternates: { canonical: 'https://dattasable.com/cookies' },
  robots: { index: false, follow: true },
};

export default async function CookiesPage() {
  const dynamicPage = await getDynamicPage('cookies');
  if (dynamicPage) {
    return <DynamicPageRenderer title={dynamicPage.title} excerpt={dynamicPage.excerpt} content={dynamicPage.content} />;
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem', maxWidth: 800 }}>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={20} style={{ color: 'var(--accent)' }} />
          <span className="label-tech">TRANSPARENCY</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '3rem' }}>Cookie Policy</h1>
        <div className="prose prose-invert" style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
          <p>Last Updated: May 01, 2026</p>
          <p>This Cookie Policy explains how Datta Sable ("we", "us", or "our") uses cookies and similar technologies when you visit our website at <a href="https://dattasable.com" style={{ color: 'var(--accent)' }}>dattasable.com</a>.</p>
          
          <h2 style={{ color: 'var(--text)', marginTop: '2rem' }}>1. What are cookies?</h2>
          <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information.</p>

          <h2 style={{ color: 'var(--text)', marginTop: '2rem' }}>2. How we use cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> To understand how visitors interact with the site (e.g., Google Analytics).</li>
            <li><strong>Preference Cookies:</strong> To remember your settings, such as theme choice (Light/Dark mode).</li>
          </ul>

          <h2 style={{ color: 'var(--text)', marginTop: '2rem' }}>3. Third-party cookies</h2>
          <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service and deliver advertisements on and through the service (e.g., Google AdSense).</p>

          <h2 style={{ color: 'var(--text)', marginTop: '2rem' }}>4. Managing your cookies</h2>
          <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
