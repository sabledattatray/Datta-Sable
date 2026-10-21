'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, CheckCircle2, ShieldCheck, Download, 
  HelpCircle, FileText, ChevronDown, Sparkles, MessageCircle, 
  ExternalLink, Layers, Terminal, X, Eye, BookOpen, Clock, AlertCircle
} from 'lucide-react';
import styles from './ProductDetail.module.css';
import Checkout from './Checkout';
import { money } from '@/lib/commerce/format';
import { PRODUCT_EXTRAS } from '@/lib/commerce/catalog';
import { trackViewItem, trackWhatsAppInquiry } from '@/lib/commerce/analytics';

interface ProductData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  image: string | null;
  priceMinor: number;
  currency: string;
  status: string;
  salesEnabled: boolean;
  deliveryReady: boolean;
  features: string[];
  includedResources: string[];
  resourcesCount: number;
}

interface ProductDetailClientProps {
  product: ProductData;
  isConfigured: boolean;
  isAdmin: boolean;
}

export default function ProductDetailClient({
  product,
  isConfigured,
  isAdmin,
}: ProductDetailClientProps) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'roadmap' | 'scenarios' | 'checklists'>('roadmap');

  const extra = PRODUCT_EXTRAS[product.slug] || {
    level: 'Professional',
    technologies: ['Data Analytics', 'BI'],
    whoIsFor: [
      'Professionals seeking hands-on mastery in data analytics.',
      'Engineers wanting clear, practical implementation roadmaps.'
    ],
    outcomes: [
      'Build end-to-end practical pipelines.',
      'Gain structured technical skills backed by verified exercises.'
    ],
    specs: {
      format: 'Digital Download',
      files: 'Documentation & Resource Files',
      version: '1.0',
      lastUpdated: '2026',
      prerequisites: 'Foundational data analytics concepts.',
      deliveryMethod: 'Instant Account Download',
      license: 'Single-User License',
      supportTerms: 'Email and WhatsApp inquiry support.',
    },
    faqs: [
      {
        question: 'How do I download my resources?',
        answer: 'After verified payment confirmation, access your purchased resources anytime under your account library at "/account/purchases".'
      },
      {
        question: 'Are payments secure?',
        answer: 'Yes. All transactions are securely authenticated with industry-standard cryptographic verification.'
      }
    ],
    disclaimer: 'This is an independently developed study and learning resource.',
  };

  // Track product view on load
  useEffect(() => {
    trackViewItem({
      item_id: product.slug,
      item_name: product.title,
      item_category: product.category,
      price: product.priceMinor / 100,
      currency: product.currency,
    });
  }, [product]);

  const whatsappMessage = encodeURIComponent(
    `Hi Datta, I am inquiring about the "${product.title}" (${money(product.priceMinor, product.currency)}) on dattasable.com. Could you provide more details?`
  );

  const isPurchasable = 
    isConfigured && 
    product.status === 'PUBLISHED' && 
    product.salesEnabled && 
    product.deliveryReady && 
    product.resourcesCount > 0;

  return (
    <>
      {/* --------------------------------------------------------------------
          Product Hero (2-Column Grid)
          -------------------------------------------------------------------- */}
      <section className={styles.productHero}>
        {/* Left: Media & Visuals */}
        <div className={styles.heroMedia}>
          <div className={styles.coverFrame}>
            <div className={styles.coverGridPattern} />
            <div className={styles.coverGlowOrb} />
            <div className={styles.coverContent}>
              <div className={styles.coverIcon}>
                <Award size={40} />
              </div>
              <div>
                <span className={styles.coverBadge}>{product.category}</span>
                <h2 className={styles.coverTitle}>{product.title}</h2>
              </div>
            </div>
          </div>

          <div className={styles.previewThumbRow}>
            <button 
              type="button" 
              className={styles.thumbBtn}
              onClick={() => { setPreviewTab('roadmap'); setPreviewModalOpen(true); }}
            >
              <Eye size={15} />
              Preview Study Roadmap
            </button>
            <button 
              type="button" 
              className={styles.thumbBtn}
              onClick={() => { setPreviewTab('scenarios'); setPreviewModalOpen(true); }}
            >
              <Terminal size={15} />
              Sample Exercises Outline
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Card */}
        <div className={styles.heroContent}>
          <div className={styles.categoryTag}>{product.category}</div>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <p className={styles.productExcerpt}>{product.excerpt}</p>

          {/* Quick Highlights */}
          <div className={styles.highlightsList}>
            {product.features.slice(0, 4).map((feat, i) => (
              <div key={i} className={styles.highlightItem}>
                <CheckCircle2 size={16} className={styles.highlightIcon} />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Purchase Action Card */}
          <div className={styles.purchaseCard}>
            <div className={styles.purchasePriceRow}>
              <span className={styles.purchasePriceAmount}>
                {money(product.priceMinor, product.currency)}
              </span>
              <span className={styles.purchasePriceType}>
                One-Time Purchase
              </span>
            </div>

            <p className={styles.currencyNotice}>
              The displayed amount and currency are authoritative for checkout. Zero hidden fees.
            </p>

            {/* Razorpay Test Mode Checkout */}
            <Checkout
              productId={product.id}
              title={product.title}
              available={isPurchasable}
              amountMinor={product.priceMinor}
              currency={product.currency}
            />

            <div className={styles.deliveryMeta}>
              <Download size={15} style={{ color: 'var(--accent)' }} />
              <span>Instant digital download via My Purchases after verified checkout</span>
            </div>

            <div className={styles.policyLinksRow}>
              <Link href="/refund-policy">Refund Policy</Link>
              <span>·</span>
              <Link href="/delivery-policy">Delivery Policy</Link>
              <span>·</span>
              <Link href="/terms">Terms</Link>
              <span>·</span>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>

          {/* WhatsApp Direct Inquiry */}
          <a
            href={`https://wa.me/918010803756?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappRow}
            onClick={() => trackWhatsAppInquiry(product.slug, product.title)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} />
              Have questions? Chat directly on WhatsApp
            </span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Product Information Sections
          -------------------------------------------------------------------- */}
      <div className={styles.sectionsContainer}>
        {/* Overview & Description */}
        <section className={styles.infoBlock}>
          <h2 className={styles.blockTitle}>
            <BookOpen size={20} className={styles.blockTitleIcon} />
            Package Overview
          </h2>
          <div className={styles.proseText}>
            {product.description}
          </div>
        </section>

        {/* What's Included */}
        <section className={styles.infoBlock}>
          <h2 className={styles.blockTitle}>
            <Layers size={20} className={styles.blockTitleIcon} />
            What&apos;s Included in this Package
          </h2>
          <div className={styles.deliverablesGrid}>
            {product.features.map((feat, i) => (
              <div key={i} className={styles.deliverableCard}>
                <CheckCircle2 size={16} className={styles.deliverableCardIcon} />
                <p className={styles.deliverableCardText}>{feat}</p>
              </div>
            ))}
            {product.includedResources.map((res, i) => (
              <div key={`res-${i}`} className={styles.deliverableCard} style={{ borderColor: 'rgba(201, 243, 29, 0.2)' }}>
                <Sparkles size={16} className={styles.deliverableCardIcon} />
                <p className={styles.deliverableCardText}><strong>Deliverable:</strong> {res}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who This Is For & Learning Outcomes */}
        <section className={styles.infoBlock}>
          <h2 className={styles.blockTitle}>
            <Sparkles size={20} className={styles.blockTitleIcon} />
            Who This Is For & Learning Outcomes
          </h2>
          
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '16px 0 10px', color: 'var(--text)' }}>
            Intended Audience
          </h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px' }}>
            {extra.whoIsFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text)' }}>
            Practical Skills You Will Develop
          </h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
            {extra.outcomes.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Product Specifications Table */}
        <section className={styles.infoBlock}>
          <h2 className={styles.blockTitle}>
            <FileText size={20} className={styles.blockTitleIcon} />
            Specifications & Details
          </h2>
          <table className={styles.specsTable}>
            <tbody>
              <tr>
                <th>Format</th>
                <td>{extra.specs.format}</td>
              </tr>
              <tr>
                <th>Included Files</th>
                <td>{extra.specs.files}</td>
              </tr>
              <tr>
                <th>Version</th>
                <td>{extra.specs.version}</td>
              </tr>
              <tr>
                <th>Last Updated</th>
                <td>{extra.specs.lastUpdated}</td>
              </tr>
              <tr>
                <th>Prerequisites</th>
                <td>{extra.specs.prerequisites}</td>
              </tr>
              <tr>
                <th>Delivery Method</th>
                <td>{extra.specs.deliveryMethod}</td>
              </tr>
              <tr>
                <th>License</th>
                <td>{extra.specs.license}</td>
              </tr>
              <tr>
                <th>Support</th>
                <td>{extra.specs.supportTerms}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Frequently Asked Questions */}
        {extra.faqs.length > 0 && (
          <section className={styles.infoBlock}>
            <h2 className={styles.blockTitle}>
              <HelpCircle size={20} className={styles.blockTitleIcon} />
              Frequently Asked Questions
            </h2>
            <div>
              {extra.faqs.map((faq, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary>
                    {faq.question}
                    <ChevronDown size={16} />
                  </summary>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Independent Resource Legal Disclaimer */}
        <section className={styles.disclaimerBox}>
          <strong>Independent Publication Notice:</strong> {extra.disclaimer}
        </section>
      </div>

      {/* --------------------------------------------------------------------
          Sample Preview Modal
          -------------------------------------------------------------------- */}
      {previewModalOpen && (
        <div 
          className={styles.modalBackdrop} 
          onClick={() => setPreviewModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className={styles.modalContent} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button" 
              className={styles.modalCloseBtn}
              onClick={() => setPreviewModalOpen(false)}
              aria-label="Close preview modal"
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px', color: 'var(--text)' }}>
              {previewTab === 'roadmap' ? '12-Week Study Roadmap Preview' : 'Hands-On Exercises Outline'}
            </h3>

            {previewTab === 'roadmap' ? (
              <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--muted)' }}>
                <p>Here is an outline of the structured self-study preparation syllabus:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--text)' }}>Weeks 1–3: OneLake Architecture & Lakehouse Ingestion</strong>
                    <p style={{ margin: '4px 0 0' }}>OneLake shortcut design, Delta Lake table formats, V-Order optimization, and Medallion architecture implementation.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--text)' }}>Weeks 4–6: PySpark Transformation & Delta Lake Operations</strong>
                    <p style={{ margin: '4px 0 0' }}>Data engineering with Spark notebooks, PySpark DataFrame API, schema enforcement, Delta merge, and partition strategies.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--text)' }}>Weeks 7–9: Data Factory Pipelines & Dataflows Gen2</strong>
                    <p style={{ margin: '4px 0 0' }}>Orchestrating batch pipelines, parameterized activities, incremental lakehouse loading, and CI/CD deployment considerations.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--text)' }}>Weeks 10–12: Real-Time Intelligence, Security & Mock Exam Assessment</strong>
                    <p style={{ margin: '4px 0 0' }}>KQL queries, Eventstream routing, Fabric governance/RBAC, and full scenario-based readiness revision questions.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--muted)' }}>
                <p>The package contains original, practical scenario-driven exercises covering:</p>
                <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
                  <li><strong>Scenario 1:</strong> Ingesting streaming logs into Eventhouse using Eventstream with KQL filtering.</li>
                  <li><strong>Scenario 2:</strong> High-throughput PySpark Delta Lake compaction and partition pruning.</li>
                  <li><strong>Scenario 3:</strong> Incremental pipeline load from Azure SQL into OneLake using Data Factory CDC.</li>
                  <li><strong>Scenario 4:</strong> End-to-end Medallion bronze, silver, and gold transformation with Dataflows Gen2.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
