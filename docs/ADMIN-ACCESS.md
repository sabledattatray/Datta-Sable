# Admin access and password recovery

## Password changes

Open `/admin/settings`, enter the current password, then enter and confirm the new password. Passwords require at least 12 characters and at most 72 UTF-8 bytes (bcrypt's input limit). A successful change invalidates existing sessions; use the sign-in button shown after saving.

Accounts created through Google, GitHub, or LinkedIn should use email recovery to set their first local password. They do not have a current local password to verify.

## Email OTP recovery

Choose **Forgot your password?** on `/admin/login`, or open `/admin/login?mode=reset`. Enter the email address belonging to an existing `ADMIN` database user. Enter the emailed six-digit code, choose a new password, and sign in again.

- Codes expire after 10 minutes, are single-use, and allow five verification attempts.
- A replacement code invalidates the earlier code. Requests have a 60-second cooldown and a durable limit of five emails per account per hour.
- The database stores an HMAC of the code, never the plaintext code. `NEXTAUTH_SECRET` is required.
- Request responses deliberately do not identify whether an email belongs to an administrator. Check provider logs if no message arrives.
- A password change or reset increments `User.sessionVersion`. NextAuth checks the version on each session read to reject previously issued sessions.
- Authenticator MFA is not implemented; email recovery is not a second factor for regular sign-in.

## Deployment requirements

Generate the Prisma client and apply `20261022090000_admin_password_recovery` before deploying the new authentication code. The migration adds `User.sessionVersion` and `AdminPasswordReset`; it preserves existing users and passwords. Obtain explicit approval before applying migrations to production. This migration was approved and applied to the configured database during this change.

Recovery uses the existing email-delivery service:

- Resend: `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` (or `EMAIL_FROM`).
- SMTP alternative: `EMAIL_PROVIDER=smtp`, `EMAIL_FROM`, `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT` (465 or 587), `EMAIL_SERVER_USER`, and `EMAIL_SERVER_PASSWORD`.

Environment presence does not verify inbox delivery. Tests use a fake mail provider; they do not send codes or change the owner's password. Verify a real delivery through the recovery screen when ready.

## Local development

Run `npm run dev -- --port 3000` with network access to the configured PostgreSQL server. A sandboxed server may be unable to connect even when the database is healthy. Public typography already falls back to defaults during database outages; authentication requires a reachable database.

For sample-only design review, set `ADMIN_DESIGN_PREVIEW=1` in development and open `/admin-design-preview?view=management`. The preview route returns 404 outside development.
