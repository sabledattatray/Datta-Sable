import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getPublishedBlogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'HTML Sitemap | Datta Sable',
  description: 'Sitemap for Datta Sable BI & Analytics Consulting. Access all tutorials, case studies, dashboards, tools, and technical articles.',
  alternates: { canonical: 'https://dattasable.com/sitemap' },
};

export default async function HtmlSitemapPage() {
  const posts = await getPublishedBlogPosts().catch(() => []);

  const mainPages = [
    { label: 'Home Page', href: '/' },
    { label: 'About & E-E-A-T Portfolio', href: '/about' },
    { label: 'BI & Data Engineering Services', href: '/services' },
    { label: 'Contact & Inquiries', href: '/contact' },
    { label: 'Project Portfolio', href: '/portfolio' },
    { label: 'Technical Blog Logs', href: '/blog' },
    { label: 'AI Glossary Hub', href: '/glossary' },
    { label: 'Editorial Policy & Testing Standards', href: '/editorial-policy' },
    { label: 'Frequently Asked Questions (FAQ)', href: '/faq' },
    { label: 'Careers & Positions', href: '/careers' },
    { label: 'Disclaimer Notice', href: '/disclaimer' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)', paddingBottom: '6rem' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="label-tech mb-6">SITE_MAP_DIRECTORY // INDEX</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 42px)', lineHeight: 1.2, marginBottom: '2rem', fontFamily: "'Syne', sans-serif" }}>
              HTML <span className="hero-title">Sitemap</span>
            </h1>

            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
              Welcome to the HTML sitemap. Below you will find a categorized index of all public-facing pages, tools, and technical articles hosted on this domain.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Main Pages */}
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: "'Syne', sans-serif", borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  Core Navigation Pages
                </h2>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }} className="flex flex-col gap-3">
                  {mainPages.map(page => (
                    <li key={page.href} className="text-[14px]">
                      <Link href={page.href} className="text-[var(--text)] hover:text-[var(--accent)] underline transition-colors">
                        {page.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Blog Posts */}
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: "'Syne', sans-serif", borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  Published Technical Articles ({posts.length})
                </h2>
                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '1rem' }} className="custom-scrollbar">
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }} className="flex flex-col gap-3">
                    {posts.map(post => (
                      <li key={post.slug} className="text-[14px]">
                        <Link href={`/blog/${post.slug}`} className="text-[var(--text)] hover:text-[var(--accent)] underline transition-colors block">
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
