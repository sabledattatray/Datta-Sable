import type { Metadata } from 'next';
import { ArrowUpRight, CalendarDays, Receipt, ShieldCheck, Download, Briefcase, Calendar, CreditCard, AlertCircle, FileText, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Datta Sable',
  description: 'Refund, cancellation, and dispute policies for digital products, templates, consulting retainers, and mentorship sessions by Datta Sable.',
  alternates: { canonical: 'https://dattasable.com/refund-policy' },
  robots: { index: true, follow: true },
};

const standards = [
  {
    id: 'digital-products',
    title: 'Digital Templates & Instant Downloads',
    label: 'Digital Assets',
    icon: Download,
    content: (
      <>
        <p>Digital products—including Power BI template files (.pbix), Excel automation workbooks (.xlsx, .xlsm), SQL scripts, Python notebooks, and architecture diagrams—are delivered electronically and immediately upon successful payment authorization.</p>
        <p>Because digital downloads are non-tangible, irrevocable assets that cannot be physically retrieved once delivered, <strong>all digital product sales are generally considered final</strong>. However, we honor full refunds under the following explicit circumstances:</p>
        <ul>
          <li><strong>Duplicate Transactions:</strong> If you accidentally place duplicate orders or encounter a double charge from the payment gateway, submit proof within 7 days for an immediate 100% refund of the duplicated charge.</li>
          <li><strong>Defective or Corrupted Files:</strong> If a downloaded file is corrupted, unreadable, or missing components advertised on the product page, notify us within 7 days. If our engineering team cannot provide a functional replacement within 48 business hours, a full refund will be issued.</li>
          <li><strong>Material Misrepresentation:</strong> If the delivered asset fundamentally differs from the specifications, software compatibility, or features detailed on the official product listing.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'consulting-services',
    title: 'Consulting & Custom Engineering Projects',
    label: 'Custom Engagements',
    icon: Briefcase,
    content: (
      <>
        <p>Custom data consulting, business intelligence architecture, dashboard development, and automation engineering are governed by individual Statements of Work (SOW) or Service Agreements mutually executed prior to project kickoff.</p>
        <ul>
          <li><strong>Cancellation Prior to Commencement:</strong> If an engagement is cancelled in writing prior to any engineering or discovery work beginning, your retainer deposit will be refunded in full, minus third-party payment processing fees.</li>
          <li><strong>Milestone-Based Deliverables:</strong> In-progress projects are billed against mutually agreed milestones. Once a milestone deliverable is reviewed, signed off, or deployed to your tenant, payments for that milestone become non-refundable.</li>
          <li><strong>Unearned Retainers:</strong> For prepaid monthly retainers, unused hours cannot be carried over indefinitely but may be eligible for a prorated refund if notice is given 14 calendar days prior to the start of the next billing cycle.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'mentorship-advisory',
    title: '1-on-1 Strategy & Advisory Sessions',
    label: 'Advisory & Mentorship',
    icon: Calendar,
    content: (
      <>
        <p>Strategy consultations, technical code reviews, and one-on-one mentorship bookings represent reserved time slots on our calendar and require advance scheduling.</p>
        <ul>
          <li><strong>Rescheduling:</strong> You may reschedule your consultation at zero cost by providing at least 24 hours advance notice through your confirmation link or by emailing our team.</li>
          <li><strong>Advance Cancellations:</strong> Cancellations made at least 24 hours prior to the scheduled session time are eligible for a 100% full refund.</li>
          <li><strong>Late Cancellations &amp; No-Shows:</strong> Cancellations with less than 24 hours notice or missed appointments (no-shows after 15 minutes of scheduled start time) are strictly non-refundable due to the reserved specialist time.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'refund-timeline',
    title: 'Processing Timeline & Payment Gateways',
    label: 'Payment Gateways',
    icon: CreditCard,
    content: (
      <>
        <p>Approved refunds are processed through our PCI-DSS compliant payment gateways (Razorpay, Stripe, or PayPal) back to your original source payment instrument (Credit Card, Debit Card, Net Banking, UPI, or Wallet).</p>
        <p>Once a refund is approved by our billing desk:</p>
        <ul>
          <li>The refund authorization is initiated within <strong>24 business hours</strong>.</li>
          <li>Depending on your card issuer or banking partner, funds typically reflect on your bank or credit card statement within <strong>5 to 7 business days</strong>. UPI payments in India typically settle within 2 to 4 business days.</li>
          <li>Refund notifications and gateway ARN/RRN tracking numbers are emailed directly upon processing for your records.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'disputes-resolution',
    title: 'Chargebacks & Dispute Resolution Protocol',
    label: 'Fair Resolution',
    icon: AlertCircle,
    content: (
      <>
        <p>We believe in transparent, amicable resolutions. We strongly encourage all clients and customers to reach out to us directly at <a href="mailto:orders@dattasable.com">orders@dattasable.com</a> before initiating a bank chargeback or dispute.</p>
        <p>Bank chargeback processes are heavily delayed and often require 60 to 90 days for investigation. By contacting us directly, our billing desk can verify your order details and resolve eligible claims in less than 48 hours without administrative complications.</p>
      </>
    ),
  },
  {
    id: 'request-instructions',
    title: 'How to Submit a Refund Request',
    label: 'Instructions',
    icon: FileText,
    content: (
      <>
        <p>To submit a formal cancellation or refund request, please email our billing department at <a href="mailto:orders@dattasable.com">orders@dattasable.com</a> with the following details:</p>
        <ul>
          <li>Your full name and billing email address used during checkout.</li>
          <li>Order ID or payment transaction reference number (e.g., Razorpay/Stripe payment ID).</li>
          <li>The name of the digital product or service purchased.</li>
          <li>A clear explanation of the reason for your refund request, including screenshots or error logs if technical defects are encountered.</li>
        </ul>
        <div className={styles.highlightBox}>
          <p><strong>Response Guarantee:</strong> Our dedicated billing desk reviews all refund submissions and responds with a formal decision or diagnostic fix within 24 to 48 business hours.</p>
        </div>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <Receipt size={15} aria-hidden="true" /> Commercial transparency
          </div>
          <h1>
            Refund &amp; cancellation<br />
            <span>policy and guidelines.</span>
          </h1>
          <p className={styles.intro}>
            Clear terms and guaranteed resolutions for digital templates, custom consulting retainers, and 1-on-1 strategy sessions.
          </p>
          <div className={styles.updated}>
            <CalendarDays size={15} aria-hidden="true" />
            <span>Updated <time dateTime="2026-10-22">October 22, 2026</time></span>
            <span className={styles.divider} aria-hidden="true" />
            <span>Transparent terms. 7-day review window. 5–7 day payouts.</span>
          </div>
        </header>

        <div className={styles.contextNote}>
          <span className={styles.noteIcon}>
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div>
            <h2>Fair terms, built on mutual trust.</h2>
            <p>
              We stand behind the engineering quality of our dashboards, scripts, and advisory services. Because digital files are delivered irrevocably, our policy establishes exact criteria for duplicate charges, technical defects, and milestone cancellations.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="Refund policy sections">
              <span className={styles.navLabel}>On this page</span>
              <ol>
                {standards.map((standard, index) => (
                  <li key={standard.id}>
                    <a href={`#${standard.id}`}>
                      <span className={styles.navNumber}>{String(index + 1).padStart(2, '0')}</span>
                      <span>{standard.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={styles.sidebarNote}>
              <Mail size={18} aria-hidden="true" />
              <p>Questions about an existing purchase or charge?</p>
              <a href="#request-instructions">
                Submit an inquiry <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </aside>

          <div className={styles.standards}>
            {standards.map(({ id, title, label, icon: Icon, content }, index) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`} className={styles.standard}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className={styles.cardLabel}>{label}</span>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 id={`${id}-title`}>{title}</h2>
                <div>{content}</div>
              </section>
            ))}

            <section id="contact-desk" className={styles.contact} aria-labelledby="contact-desk-title">
              <div>
                <span className={styles.eyebrow}>Billing &amp; Customer Support</span>
                <h2 id="contact-desk-title">Need help with an order or invoice?</h2>
                <p>Send your payment receipt number and inquiry to our dedicated billing desk for expedited assistance.</p>
              </div>
              <a href="mailto:orders@dattasable.com" className={styles.contactButton}>
                Contact Billing Support <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
