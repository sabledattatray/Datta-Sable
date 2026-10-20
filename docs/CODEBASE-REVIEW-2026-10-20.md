# Codebase review — 20 October 2026

Scope: repository-wide TypeScript/lint checks, dependency audit, API/server-action access review, authentication and verification, uploads, public article visibility and campaign regressions. This is not a claim that every possible defect has been eliminated. The owner requested an expedited handoff because of remaining usage.

## Implemented

- Require administrator access for company profile reads and topic-authority analysis.
- Normalize credential email lookup and registration inputs; validate password size; throttle registration and credentials attempts. Fail closed when administrator-role refresh or initial user persistence fails.
- Replace the mentorship console-only verification flow with Resend delivery. Store only hashed magic-link/OTP credentials, bind OTPs to email, claim credentials transactionally, reject OTP-as-token requests, rate-limit attempts and remove secret logging and debug response credentials. No real emails were sent during this review.
- Replace regex HTML filtering with parser-based sanitization; retain safe article formatting and vetted YouTube embeds. Use strict Mermaid rendering.
- Validate upload size, MIME, extension and file signatures. Disallow executable HTML/SVG uploads on the media endpoint. Use opaque filenames. Return a clear configuration failure on Vercel without persistent storage instead of attempting ephemeral writes. File signature checks are not antivirus scanning.
- Normalize and validate newsletter addresses, reuse the shared Prisma client and avoid returning raw database errors.
- Share public catalog visibility rules with the main sitemap: database drafts and placeholders suppress static copies.
- Require explicit admin seed credentials and preserve existing CMS content during general seeding unless SEED_UPDATE_CONTENT=1 is explicitly set. No seed or production database changes were run for this audit.
- Correct the lint command and ignore generated build output. Keep CommonJS allowed for actual Node scripts/tests. Add npm test to CI.
- Update dependencies, including Next.js 15.5.28, coordinated TipTap versions, bcrypt 6, Mermaid 12, sharp 0.35.5 and the official SheetJS 0.20.3 tarball. Patched PostCSS is overridden within major version 8. Nodemailer 10 is explicitly overridden for NextAuth's optional mail peer; the application does not use NextAuth's EmailProvider. The SMTP API used by this application remains type-compatible. Native bcrypt and sharp imports were checked.

## Checks

- TypeScript: pass.
- Repository lint: zero errors; 443 warnings remain, mainly existing unused variables and imports.
- Regression suite: 27 tests pass (10 audit regression tests plus 17 campaign tests). Tests use mocks and isolated storage, not live users.
- npm audit --omit=dev: zero known production dependency vulnerabilities at the time of the check; this is not a guarantee against unknown vulnerabilities.
- Production build: see final handoff for completion status.
- Campaign sending remains manual-only. Publishing and editing must create no campaign and send no provider request.

## Follow-up work identified, not represented as completed

- Some admin analytics are demonstration values. The SEO action endpoint currently reports work without doing it, and the learner weekly-project submission updates client state without persistence. These require functional product work and must not be treated as verified live metrics or durable submissions.
- Existing mentorship resumes can use public Blob URLs. Moving them to private storage requires a deliberate access-control and existing-file migration plan; existing files were not moved, deleted or exposed by this review.
- Image/news sitemap routes maintain separate visibility logic; extend the shared catalog rule there. The news sitemap also needs the two-day publication-date window from Google's current guidance.
- Rate limiting is instance-local, not a distributed abuse-control service.
- Manual live credential/OAuth, mentorship inbox-delivery and private document workflow checks remain necessary after deployment. No passwords, user records or production campaigns were changed to test them.

## Development

The development server was briefly stopped to update loaded native dependencies. It will be restarted on port 3015 after the production build. Environment secrets were not staged or committed.

Final verification: production build completed successfully before commit and push.
