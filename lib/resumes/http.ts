import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ResumeError, privateHeaders } from './model';
import { CommerceError } from '@/lib/commerce/shared';

export function resumeError(error: unknown) {
  if (error instanceof ResumeError || error instanceof CommerceError) return NextResponse.json({ error: error.message }, { status: error.status, headers: privateHeaders });
  if (error instanceof ZodError) return NextResponse.json({ error: 'Check the resume profile, version and required fields.' }, { status: 400, headers: privateHeaders });
  console.error('Resume request failed.', error instanceof Error ? error.name : 'Unknown error');
  return NextResponse.json({ error: 'Resume management is temporarily unavailable. Check private storage and authentication configuration.' }, { status: 503, headers: privateHeaders });
}
export function documentResponse(req: Request, bytes: Buffer, contentType: string, filename: string, restricted = true) {
  const headers = new Headers(restricted ? privateHeaders : { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  headers.set('Content-Type', contentType); headers.set('Accept-Ranges', 'bytes');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Content-Security-Policy', "frame-ancestors 'self'");
  headers.set('Content-Disposition', `${new URL(req.url).searchParams.get('download') === '1' ? 'attachment' : 'inline'}; filename="${filename}"`);
  let start = 0, end = bytes.length - 1, status = 200;
  const range = req.headers.get('range');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) { headers.set('Content-Range', `bytes */${bytes.length}`); return new NextResponse(null, { status: 416, headers }); }
    start = match[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match[2]));
    end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= bytes.length) { headers.set('Content-Range', `bytes */${bytes.length}`); return new NextResponse(null, { status: 416, headers }); }
    status = 206; headers.set('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
  }
  headers.set('Content-Length', String(end - start + 1));
  return new NextResponse(req.method === 'HEAD' ? null : new Uint8Array(bytes.subarray(start, end + 1)), { status, headers });
}
