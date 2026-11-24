import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, ArrowRight, ShieldCheck, Zap, BookOpen, UserCheck, Layers, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Plans — Transparent Rates for BI, Mentorship & eBooks | Datta Sable',
  description: 'Transparent pricing for Power BI architecture audits, Microsoft Fabric consulting, 1:1 technical mentorship, and practical engineering eBooks by Datta Sable.',
  alternates: {
    canonical: 'https://dattasable.com/pricing',
  },
  openGraph: {
    title: 'Pricing & Plans | Datta Sable',
    description: 'Clear, transparent pricing for independent BI consulting, technical mentorship, and digital engineering resources.',
    url: 'https://dattasable.com/pricing',
    type: 'website',
    images: [{ url: '/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Datta Sable Pricing & Plans' }],
  },
};

const PRICING_PLANS = [
  {
    id: 'ebooks',
    name: 'Digital Learning eBooks',
    category: 'Self-Paced Guides',
    price: 499,
    priceDisplay: '₹499',
    usdEquivalent: '~$6 USD',
    billing: 'One-time payment · Instant PDF download',
    description: 'Comprehensive, battle-tested practical guides covering Power BI calculation groups, DAX patterns, and modern data modeling.',
    badge: 'Popular Resource',
    icon: BookOpen,
    features: [
      'Full unabridged PDF delivery to private library',
      'Downloadable DAX code samples and model templates',
      'Production-tested calculation group architectures',
      'Free lifetime updates for minor editions',
      'Verified Razorpay checkout with instant invoice',
    ],
    ctaLabel: 'Browse eBook Library',
    ctaHref: '/ebooks',
    primary: false,
  },
  {
    id: 'mentorship',
    name: '1:1 Technical Mentorship',
    category: 'Direct Coaching',
    price: 1499,
    priceDisplay: '₹1,499',
    usdEquivalent: '~$18 USD',
    billing: 'Per 60-minute session · Scheduled directly',
    description: 'One-on-one session with Datta Sable covering Power BI architecture, SQL query performance, DP-600 roadmap, or portfolio reviews.',
    badge: 'Most Booked',
    icon: UserCheck,
    features: [
      '60-minute private video session (Google Meet)',
      'Live code review and architecture troubleshooting',
      'Portfolio, resume, or technical interview guidance',
      'Actionable written summary and resource links after call',
      'Direct WhatsApp follow-up for 7 days post-session',
    ],
    ctaLabel: 'Book 1:1 Mentorship',
    ctaHref: '/mentorship',
    primary: true,
  },
  {
    id: 'architecture-audit',
    name: 'Power BI & Fabric Audit',
    category: 'Fixed-Scope Consulting',
    price: 14999,
    priceDisplay: '₹14,999',
    usdEquivalent: '~$180 USD',
    billing: 'Fixed-scope engagement · 3 business days',
    description: 'In-depth diagnostic review of your enterprise Power BI semantic models, Direct Lake partition strategy, and DAX execution plans.',
    badge: 'Enterprise Quality',
    icon: Layers,
    features: [
      'Complete VertiPaq memory analyzer and footprint audit',
      'DAX query plan bottleneck identification',
      'Direct Lake vs Import mode trade-off assessment',
      'Row-Level Security (RLS) and governance validation',
      'Detailed PDF audit report with step-by-step remediation plan',
    ],
    ctaLabel: 'Request Model Audit',
    ctaHref: '/contact?service=audit',
    primary: false,
  },
  {
    id: 'enterprise-consulting',
    name: 'Enterprise BI Consulting',
    category: 'Custom Engineering',
    price: 49999,
    priceDisplay: '₹49,999+',
    usdEquivalent: '~$600+ USD',
    billing: 'Per milestone / Retainer engagement',
    description: 'Full-cycle analytics delivery: Microsoft Fabric Lakehouse setup, Medallion ETL pipeline architecture, and executive dashboard design.',
    badge: 'Custom Scope',
    icon: Zap,
    features: [
      'End-to-end Medallion architecture (Bronze/Silver/Gold)',
      'Automated data ingestion via Fabric pipelines and n8n',
      'High-fidelity executive dashboard design',
      'CI/CD deployment pipelines with Git integration',
      'Strict enterprise NDA and confidentiality guarantee',
    ],
    ctaLabel: 'Enquire for Consulting',
    ctaHref: '/contact?service=consulting',
    primary: false,
  },
];

const PRICING_FAQS = [
  {
    q: 'What payment methods are supported?',
    a: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), NetBanking, and international cards securely processed via Razorpay. International clients can also pay via PayPal or Wire Transfer.',
  },
  {
    q: 'Do you offer refunds on digital eBooks or mentorship sessions?',
    a: 'Mentorship sessions can be rescheduled up to 12 hours before the scheduled time with zero fee. Digital eBooks are non-refundable once downloaded, but we are committed to your complete satisfaction—please reach out if you experience any issue.',
  },
  {
    q: 'Can enterprise engagements be billed against a corporate GST invoice?',
    a: 'Yes, full tax invoices with corporate GST details are provided for Indian entities. International enterprise clients receive standard commercial invoices with bank wiring details.',
  },
  {
    q: 'Is an NDA signed before accessing our proprietary data or models?',
    a: 'Absolutely. A mutual Non-Disclosure Agreement (NDA) is signed prior to inspecting any proprietary semantic models, database structures, or analytical pipelines.',
  },
];

export default function PricingPage() {
  const schemaOffers = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Datta Sable Services and Digital Products Pricing',
    description: 'Transparent pricing catalog for digital eBooks, 1:1 technical mentorship, and enterprise BI architecture consulting.',
    url: 'https://dattasable.com/pricing',
    itemListElement: PRICING_PLANS.map((plan, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': plan.id === 'ebooks' ? 'Product' : 'Service',
        name: plan.name,
        description: plan.description,
        url: `https://dattasable.com${plan.ctaHref}`,
      },
      price: plan.price.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://dattasable.com${plan.ctaHref}`,
      seller: {
        '@type': 'Person',
        name: 'Datta Sable',
        url: 'https://dattasable.com',
      },
    })),
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOffers) }}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            marginBottom: '1rem',
          }}>
            <ShieldCheck size={14} /> Transparent &amp; Direct Pricing
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Clear value.<br /><span style={{ color: 'var(--accent)' }}>No hidden surprises.</span>
          </h1>
          <p style={{
            maxWidth: '680px',
            margin: '0 auto',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--muted)',
          }}>
            Whether you are looking for practical eBooks, personalized 1:1 technical mentorship, or high-impact enterprise BI architecture audits, find the exact package that fits your goals.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.5rem',
          marginBottom: '5rem',
          alignItems: 'stretch',
        }}>
          {PRICING_PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--surface)',
                  border: plan.primary ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  position: 'relative',
                  boxShadow: plan.primary ? '0 12px 30px rgba(0, 0, 0, 0.2)' : 'none',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '1.5rem',
                    background: plan.primary ? 'var(--accent)' : 'var(--surface2)',
                    color: plan.primary ? '#000' : 'var(--text)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--border)',
                  }}>
                    {plan.badge}
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--surface2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', fontWeight: 600 }}>
                      {plan.category}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{plan.name}</h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, minHeight: '3.5rem', marginBottom: '1.5rem' }}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                      {plan.priceDisplay}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                      INR ({plan.usdEquivalent})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginTop: '0.25rem' }}>
                    {plan.billing}
                  </span>
                </div>

                {/* Features List */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', lineHeight: 1.4 }}>
                      <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Link */}
                <Link
                  href={plan.ctaHref}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    background: plan.primary ? 'var(--btn-primary-bg)' : 'var(--surface2)',
                    color: plan.primary ? 'var(--btn-primary-text)' : 'var(--text)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {plan.ctaLabel} <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>Clear answers on payment security, delivery, and corporate engagements.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={16} style={{ color: 'var(--accent)' }} /> {faq.q}
                </h4>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
