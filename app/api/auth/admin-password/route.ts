import { NextResponse } from 'next/server';
import { resetRequestInput, resetPasswordInput } from '@/lib/admin/password-policy';
import { requestAdminPasswordReset, resetAdminPassword, RESET_MESSAGE } from '@/lib/admin/password-recovery';
import { rateLimit } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const respond = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  try {
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return respond({ error: 'Invalid request origin.' }, 403);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(`admin-password:${ip}`, 10)) return respond({ error: 'Too many attempts. Please wait a minute.' }, 429);
    const body = await request.json();
    if (body?.action === 'request') {
      const input = resetRequestInput.safeParse(body);
      if (!input.success) return respond({ error: 'Enter a valid email address.' }, 400);
      await requestAdminPasswordReset(input.data.email);
      return respond({ success: RESET_MESSAGE });
    }
    if (body?.action === 'reset') {
      const input = resetPasswordInput.safeParse(body);
      if (!input.success) return respond({ error: input.error.issues[0].message }, 400);
      const result = await resetAdminPassword(input.data.email, input.data.code, input.data.newPassword);
      return respond(result, 'error' in result ? 400 : 200);
    }
    return respond({ error: 'Invalid request.' }, 400);
  } catch (error) {
    if (error instanceof SyntaxError) return respond({ error: 'Invalid request.' }, 400);
    console.error('Admin password recovery unavailable. Check database migrations and email configuration.');
    return respond({ error: 'Password recovery is temporarily unavailable. Please try again shortly or contact your site administrator.' }, 503);
  }
}
