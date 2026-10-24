import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { servicesData, getServiceBySlug } from '@/data/servicesData';
import { Check, ArrowRight, ArrowLeft, Shield, Clock, DollarSign, Sparkles, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  servicesData.forEach((s) => {
    params.push({ slug: s.slug });
    s.aliases.forEach((alias) => {
      params.push({ slug: alias });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Datta Sable',
    };
  }

  const canonicalUrl = `https://dattasable.com/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: '/images/datta.webp',
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'Person',
      name: 'Datta Sable',
      url: 'https://dattasable.com',
      jobTitle: 'BI Expert & Data Engineer',
    },
    serviceType: service.title,
    offers: {
      '@type': 'Offer',
      price: service.price.replace(/[^\d]/g, '') || '10000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    url: `https://dattasable.com/services/${service.slug}`,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://dattasable.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://dattasable.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://dattasable.com/services/${service.slug}`,
      },
    ],
  };

  const otherServices = servicesData.filter((s) => s.id !== service.id);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <Navbar />

      <main className="boxed-wrapper" style={{ position: 'relative', marginBottom: '60px' }}>
        <Crosshair position="tl" />

        {/* ── Breadcrumb & Navigation Bar ── */}
        <div style={{ paddingTop: 'clamp(5rem, 8vw, 6.5rem)', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-small)', color: 'var(--muted)' }}>
              <Link href="/services" style={{ color: 'var(--muted)', textDecoration: 'none' }} className="hover:text-white transition-colors">
                Services
              </Link>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--accent)' }}>{service.title}</span>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} /> All Services
            </Link>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <section className="section" style={{ paddingTop: '3rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ maxWidth: '850px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{service.icon}</span>
                <span className="mono" style={{ fontSize: 'var(--text-small)', letterSpacing: '0.15em', textTransform: 'uppercase', color: service.color, fontWeight: 700 }}>
                  SPECIALIZED SERVICE PACKAGE
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 48px)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                {service.title}
              </h1>

              <p style={{ fontSize: '1.2rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '1.25rem', opacity: 0.9 }}>
                {service.tagline}
              </p>

              <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                {service.desc}
              </p>

              {/* Pricing & Guarantee Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${service.color}`,
                  marginBottom: '2.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-small)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.25rem' }}>INVESTMENT</div>
                  <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: service.color }}>{service.price}</div>
                </div>

                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} className="hidden sm:block" />

                <div>
                  <div style={{ fontSize: 'var(--text-small)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.25rem' }}>TYPICAL TIMELINE</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} style={{ color: 'var(--muted)' }} /> {service.deliveryTime}
                  </div>
                </div>

                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} className="hidden sm:block" />

                <div>
                  <div style={{ fontSize: 'var(--text-small)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.25rem' }}>GOVERNANCE</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={16} style={{ color: 'var(--accent)' }} /> NDA Protected & Audited
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="btn-primary inline-flex items-center gap-2"
                  style={{
                    padding: '0.9rem 2rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                  }}
                >
                  <span>{service.cta}</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href={`https://wa.me/918010803756?text=${encodeURIComponent(`Hi Datta, I am interested in discussing your ${service.title} services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                  style={{
                    padding: '0.9rem 1.75rem',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Deliverables Checklist ── */}
        <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>WHAT IS INCLUDED</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 32px)', fontWeight: 600, marginBottom: '2.5rem' }}>
              Standard Deliverables & Guarantees
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    borderLeft: `2px solid ${service.color}`,
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(201, 243, 29, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Check size={14} style={{ color: service.color }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>{feat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Capabilities Deep-Dive ── */}
        <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>TECHNICAL EXCELLENCE</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 32px)', fontWeight: 600, marginBottom: '2.5rem' }}>
              Core Capabilities & Methodology
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '2rem',
                    background: 'var(--surface)',
                  }}
                >
                  <div className="mono text-xs mb-2" style={{ color: service.color }}>0{idx + 1} // CAPABILITY</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>{cap.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tools & Technologies ── */}
        <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>STACK ARCHITECTURE</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 32px)', fontWeight: 600, marginBottom: '2rem' }}>
              Technologies & Infrastructure Deployed
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {service.technologies.map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.6rem 1.25rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: service.color }} />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service Specific FAQs ── */}
        <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>FREQUENTLY ASKED QUESTIONS</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 32px)', fontWeight: 600, marginBottom: '2.5rem' }}>
              Got Questions About {service.title}?
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '850px' }}>
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    background: 'var(--surface)',
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <HelpCircle size={18} style={{ color: service.color, flexShrink: 0 }} />
                    {faq.q}
                  </h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, paddingLeft: '1.75rem' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conversion Section ── */}
        <section className="section" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em', justifyContent: 'center' }}>ENGAGEMENT SPRINT</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 36px)', fontWeight: 700, marginBottom: '1.25rem' }}>
              Ready to execute on <span style={{ color: service.color }}>{service.title}</span>?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              Let’s schedule a technical walkthrough to review your data schemas, KPIs, or site architecture and produce a definitive project milestone plan.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="btn-primary inline-flex items-center gap-2"
                style={{
                  padding: '1rem 2.5rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}
              >
                <span>{service.cta}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Explore Other Services ── */}
        <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="container">
            <div className="label-tech mb-3" style={{ letterSpacing: '0.25em' }}>EXPLORE MORE</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 32px)', fontWeight: 600, marginBottom: '2.5rem' }}>
              Explore Other Specialized Packages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherServices.map((other) => (
                <Link
                  key={other.id}
                  href={`/services/${other.slug}`}
                  className="card group hover:border-[var(--accent)] transition-all"
                  style={{
                    padding: '1.75rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{other.icon}</div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }} className="group-hover:text-[var(--accent)] transition-colors">
                      {other.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {other.tagline}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <span className="mono" style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: other.color }}>{other.price}</span>
                    <span style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
