import { NextResponse } from 'next/server';
import { z } from 'zod';
import { customer, sameOrigin } from '@/lib/commerce/access';
import { privateHeaders, profileId, ResumeError } from '@/lib/resumes/model';
import { listResumes, replaceResume, restoreResume, resumeFile } from '@/lib/resumes/service';
import { documentResponse, resumeError } from '@/lib/resumes/http';
import { mimeTypes } from '@/lib/resumes/files';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;
type Context = { params: Promise<{ path?: string[] }> };
export async function GET(req: Request, context: Context) {
  try {
    await customer(true); // Session revocation and live database role checked on every request, including ranges.
    const path = (await context.params).path || [];
    if (!path.length) return NextResponse.json(await listResumes(), { headers: privateHeaders });
    if (path.length !== 2 || path[1] !== 'file') throw new ResumeError('Not found.', 404);
    const profile = profileId.parse(path[0]), url = new URL(req.url);
    const format = z.enum(['pdf', 'docx']).parse(url.searchParams.get('format') || 'pdf');
    const id = url.searchParams.has('version') ? z.string().uuid().parse(url.searchParams.get('version')) : undefined;
    const { bytes } = await resumeFile(profile, id, format);
    return documentResponse(req, bytes, mimeTypes[format], `Dattatray_Sable_${profile}.${format}`);
  } catch (error) { return resumeError(error); }
}
export const HEAD = GET;
export async function POST(req: Request, context: Context) {
  try {
    const actor = await customer(true); sameOrigin(req);
    if (((await context.params).path || []).length) throw new ResumeError('Not found.', 404);
    if (req.headers.get('content-type')?.startsWith('multipart/form-data')) {
      const length = Number(req.headers.get('content-length'));
      if (length > 9 * 1024 * 1024) throw new ResumeError('Upload exceeds the maximum request size.', 413);
      const form = await req.formData(), pdf = form.get('pdf'), docx = form.get('docx');
      if (!(pdf instanceof File) || !(docx instanceof File) || !pdf.name.toLowerCase().endsWith('.pdf') || !docx.name.toLowerCase().endsWith('.docx')) throw new ResumeError('Upload both PDF and DOCX files.');
      if (pdf.size > 4 * 1024 * 1024 || docx.size > 4 * 1024 * 1024) throw new ResumeError('Each file must be at most 4 MB.', 413);
      await replaceResume({ profile: profileId.parse(form.get('profile')), revision: z.string().max(100).parse(form.get('revision')), actor: actor.id, note: z.string().trim().min(1).max(300).parse(form.get('note')), verified: form.get('verified') === 'true', pdf: Buffer.from(await pdf.arrayBuffer()), docx: Buffer.from(await docx.arrayBuffer()) });
    } else {
      const raw = await req.text(); if (Buffer.byteLength(raw) > 4096) throw new ResumeError('Request too large.', 413);
      const input = z.object({ action: z.literal('restore'), profile: profileId, version: z.string().uuid(), revision: z.string().max(100) }).parse(JSON.parse(raw));
      await restoreResume({ ...input, actor: actor.id });
    }
    return NextResponse.json({ saved: true }, { headers: privateHeaders });
  } catch (error) { return resumeError(error); }
}
