import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { CommerceError } from './shared';
export async function jsonBody(req: Request, max = 50000) {
  const text = await req.text();
  if (Buffer.byteLength(text) > max) throw new CommerceError('Request is too large.', 413);
  try { return JSON.parse(text); } catch { throw new CommerceError('Invalid JSON.'); }
}
export function errorResponse(error: unknown) {
  if (error instanceof CommerceError) return NextResponse.json({ error: error.message }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
  if (error instanceof ZodError) return NextResponse.json({ error: 'Check the submitted fields.' }, { status: 400 });
  console.error('Commerce operation failed.', error instanceof Error ? error.name : 'Unknown error');
  return NextResponse.json({ error: 'This operation is temporarily unavailable. Please retry later or contact support.' }, { status: 503 });
}
