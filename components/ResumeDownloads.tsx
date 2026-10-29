import styles from './ResumeDownloads.module.css';

const resumes = [
  { title: 'Senior MIS & Reporting', file: 'Dattatray_Sable_Senior_MIS_Reporting_Analyst' },
  { title: 'Power BI & Business Intelligence', file: 'Dattatray_Sable_Power_BI_Business_Intelligence_Analyst' },
  { title: 'BFSI Risk & Collections', file: 'Dattatray_Sable_BFSI_Risk_Collections_Analytics' },
];

export default function ResumeDownloads() {
  return <details className={styles.downloads}>
    <summary>Choose a role-specific résumé</summary>
    <ul>{resumes.map(resume => <li key={resume.file}>
      <span>{resume.title}</span>
      <div>
        <a href={`/resumes/${resume.file}.pdf`} download aria-label={`Download ${resume.title} résumé as PDF`}>PDF</a>
        <a href={`/resumes/${resume.file}.docx`} download aria-label={`Download ${resume.title} résumé as Word document`}>Word</a>
      </div>
    </li>)}</ul>
  </details>;
}
