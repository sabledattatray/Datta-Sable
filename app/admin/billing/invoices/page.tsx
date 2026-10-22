import Link from 'next/link';
import SalesPage from '@/components/commerce/SalesPage';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className={adminStyles.page}>
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Commerce & Financial Records
          </div>
          <h1 className={adminStyles.title}>
            Purchase <span className={adminStyles.titleAccent}>Receipts</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Review receipt delivery for recorded purchases. <Link href="/admin/orders" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>View orders and payment details</Link>.
          </p>
        </div>
      </div>
      <SalesPage tab="emails" />
    </div>
  );
}

