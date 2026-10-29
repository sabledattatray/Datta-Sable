import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { documentResponse, resumeError } from '@/lib/resumes/http';
import { readManifest } from '@/lib/resumes/storage';
import { resumeFile } from '@/lib/resumes/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(req: Request) {
  try {
    // Only the master profile has a public entry point; request parameters cannot select another profile.
    const configured = process.env.NODE_ENV !== 'production' || process.env.RESUME_PRIVATE_BLOB_READ_WRITE_TOKEN || process.env.COMMERCE_BLOB_READ_WRITE_TOKEN;
    const active = configured ? (await readManifest()).manifest.active.master : undefined;
    const bytes = active ? (await resumeFile('master', active, 'pdf')).bytes : await readFile(path.join(process.cwd(), 'public/resume/master.pdf'));
    return documentResponse(req, bytes, 'application/pdf', 'Dattatray_Sable_Master_Professional_Resume.pdf', false);
  } catch (error) { return resumeError(error); }
}
export const HEAD = GET;
