/** Local initialization only. Never connects to cloud or changes production. */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listResumes, replaceResume } from '../lib/resumes/service';
import { checksum } from '../lib/resumes/files';

async function main() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production' || process.env.RESUME_STORAGE_BACKEND === 'blob') throw new Error('This initializer is strictly local. Import through authenticated admin uploads for cloud storage.');
  const files = [
    ['master', 'Dattatray_Sable_Master_Professional_Resume'],
    ['senior_mis', 'Dattatray_Sable_Senior_MIS_Reporting_Analyst'],
    ['power_bi_analyst', 'Dattatray_Sable_Power_BI_Business_Intelligence_Analyst'],
    ['bfsi_analytics', 'Dattatray_Sable_BFSI_Risk_Collections_Analytics'],
  ] as const;
  for (const [profile, stem] of files) {
    const pdf = await readFile(path.join('resume-system/output', `${stem}.pdf`));
    const docx = await readFile(path.join('resume-system/output', `${stem}.docx`));
    const current = await listResumes();
    if (current.profiles.find(p => p.id === profile)?.versions.some(v => v.files.pdf.sha256 === checksum(pdf) && v.files.docx.sha256 === checksum(docx))) { console.log(`${profile}: already preserved.`); continue; }
    await replaceResume({ profile, revision: current.revision, actor: 'local-migration', note: 'Verified canonical resume imported into protected storage; original files preserved.', verified: true, pdf, docx });
    console.log(`${profile}: private PDF/DOCX pair stored and checksum verified.`);
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Initialization failed.'); process.exitCode = 1; });
