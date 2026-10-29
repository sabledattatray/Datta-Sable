import Image from 'next/image';
import { ArrowUpRight, Download } from 'lucide-react';
import styles from './MasterResume.module.css';

export default function MasterResume() {
  return <section className={styles.resume} aria-label="Master Professional Resume">
    <a className={styles.preview} href="/Dattatray_Sable_Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Preview the complete Master Professional Resume PDF"><Image src="/resume/master-preview.png" alt="First page of Dattatray Sable’s Master Professional Resume" width={595} height={842} sizes="(max-width: 600px) 220px, 280px"/><span>Preview complete PDF <ArrowUpRight size={13}/></span></a>
    <p className={styles.label}>MASTER PROFESSIONAL RESUME</p><h3>Senior MIS &amp; Business Intelligence Analyst</h3><p>MIS, Power BI, SQL, Advanced Excel and BFSI reporting, supported by independent technical projects.</p>
    <a className={styles.download} href="/Dattatray_Sable_Resume.pdf?download=1" download><Download size={15}/>Download resume PDF</a>
  </section>;
}
