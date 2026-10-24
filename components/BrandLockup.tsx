import LogoIcon from './LogoIcon';
import styles from './BrandLockup.module.css';

/** Shared by the header, mobile drawer and footer to keep one brand signature. */
export default function BrandLockup() {
  return <span className={styles.lockup}><span className={styles.mark}><LogoIcon className={styles.icon} color="var(--accent)" /></span><span className={styles.wordmark}><strong>Datta Sable</strong><span>DATA / DESIGN / ENGINEERING</span></span></span>;
}
