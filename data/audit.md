# Full-stack engineering audit — Datta Sable

**Date:** 15 October 2026 (Asia/Kolkata)  
**Repository:** https://github.com/sabledattatray/Datta-Sable  
**Revision:** `2df8af353c66c77227a319a7414fdcde2b759caf` (`main`)  
**Decision:** **Do not approve the audited revision for production until the critical findings are resolved.**

## Executive assessment

The application has a working Next.js/React foundation, a substantial content library, Prisma models, and mostly explicit authorization in admin handlers. Type checking, linting, and an optimized production build completed successfully in this environment. These checks do not establish production safety: the audit found an unauthenticated user-management API and a reproducible admin-session forgery when the authentication secret is omitted.

Other significant weaknesses concern document handling, mentorship authentication, default credentials, abuse controls, data-loss fallbacks, and dependency maintenance. Several administrative features report successful operations without executing them. Publishing uses competing static and database sources, so unpublishing a database article does not necessarily remove its public static copy.

**27 grouped findings:** 2 critical, 11 high, 12 medium, 2 low. Severity reflects engineering impact and prerequisites, not a formal CVSS calculation. Dependency scanner totals are separate and must not be added to this finding count.

## Scope, method, and confidence

This was a broad repository review with focused manual inspection of authentication, all API route authorization patterns, public inputs, uploads, database schema, content rendering, publishing, analytics, CI, SEO configuration, and selected frontend flows. Automated inventory found **44 API route files, 68 exported HTTP handlers, and 387 TypeScript/TSX/CSS files** under app/components/lib. Inventory coverage does not mean every UI interaction or every line was independently exercised.

Verification included TypeScript, lint, Prisma generation, production compilation, local production HTTP checks, browser DOM/screenshot sampling, npm security-advisory lookup, pure sanitizer/path checks, and a local synthetic-session check. No application source or package versions were changed. No database was configured, no real records were accessed or deleted, no live-site vulnerability requests were sent, and no emails or WhatsApp messages were sent by audit scripts.

Evidence labels used below:

- **Runtime verified:** reproduced against the local production server or with a pure deterministic check.
- **Code confirmed:** directly supported by source; the affected database-backed flow was not executed.
- **Conditional:** impact depends on configuration, infrastructure, data, or feature use.

The local server lacked `DATABASE_URL`, OAuth credentials, SMTP configuration, blob credentials, and an explicit authentication secret. Database-backed end-to-end tests, query plans, migrations against an existing database, real provider callbacks, delivery, backup restoration, concurrency/load testing, full WCAG evaluation, and field performance measurements remain unverified. This report is an engineering assessment, not a claim of exhaustive penetration testing or compliance certification.

## Verification results

### Architecture reviewed

| Layer | Implementation | Main trust boundary |
|---|---|---|
| Presentation | Next.js 15 App Router, React 19, Tailwind 4, MUI, Framer Motion, charts/editor components | CMS HTML/blocks and server data crossing into the browser |
| Server | 44 route files / 68 handlers, server-rendered pages, middleware headers | Anonymous requests versus user/admin operations |
| Identity | NextAuth v4, Credentials/OAuth, JWT sessions, DB roles and admin email configuration | Provider identity, session authenticity, current authorization |
| Persistence | Prisma 5.22, PostgreSQL schema, static TypeScript content | Publication precedence, relational consistency, personal data |
| Files | Vercel Blob plus public/private local filesystem fallbacks | User-controlled names/bytes versus executable/public/private storage |
| Messaging/telemetry | Nodemailer, WhatsApp integration, internal page views, Google integrations | Delivery guarantees, consent, token/query redaction |
| Delivery | npm lockfile, GitHub Actions, Next production build | Reproducible runtime, quality gates, secrets and migration lifecycle |

### Executed checks

| Check | Result | Interpretation |
|---|---|---|
| `npx --no-install tsc --noEmit` | Pass, exit 0 | Current source type-checks after Prisma generation |
| `npm run lint` | Pass, exit 0, numerous warnings | Mostly unused variables; several useful rules are disabled |
| `npx --no-install prisma generate` | Pass | Prisma Client 5.22.0 generated |
| `npm run build` | Pass with filesystem access | Initial concurrent dev run locked the Prisma DLL; sandbox retry hit inferred-root permissions; clean elevated build succeeded |
| Production start on port 3001 | Pass | Public page rendering works with static fallbacks |
| Local `/`, `/blog`, `/contact`, `/careers`, `/mentorship`, `/admin/login` | HTTP 200 | Rendering only; does not prove submission/auth flows work |
| Anonymous `/api/admin/blog` | HTTP 403 | Explicit route authorization works without the forged cookie |
| Anonymous `/api/admin/careers`, `/api/admin/documents` in production | HTTP 401 | Development bypass does not apply in production mode |
| Anonymous `/api/admin/users` | HTTP 500, Prisma configuration error | Request reaches DB without authorization; does not prove live data was exposed |
| Synthetic fallback-secret cookie, `/api/auth/session` | HTTP 200, role `ADMIN` | Session forgery verified locally |
| Same cookie, `/api/admin/blog` | HTTP 500 instead of 403 | Passed admin authorization, then failed at missing DB |
| `/api/health` | HTTP 503, DB DOWN | Expected given local configuration |
| `/api/jobs` with DB unavailable | HTTP 200 with sample jobs | Misleading fallback verified |
| `npm audit --json` | 59 affected package entries | 3 critical, 17 high, 37 moderate, 2 low; includes transitive/dev entries |
| Browser sample | Homepage DOM rendered; sampled log query returned no entries | Limited observation, not full interaction/accessibility certification |

Build output, HTTP samples, scanner output, route inventory, and synthetic-check results are retained alongside this report. No generated authentication cookie is retained.

## Critical findings

### AUD-01 — Anonymous users can list and delete users/subscribers

**Critical · Code confirmed; anonymous DB reachability runtime verified**  
**Location:** `app/api/admin/users/route.ts:6` and `:42`; `middleware.ts` matcher.

Neither GET nor DELETE checks a session or admin role. GET returns user identity/contact details and subscriber records. DELETE accepts a caller-supplied type/id and deletes the corresponding record. The admin UI's client-side redirect does not protect this API, and middleware excludes API paths. A connected database would make these operations available to anonymous callers unless an independently configured upstream control blocks them.

**Fix:** Require a shared server-side admin authorization helper before parsing input or querying data in both handlers. Validate deletion targets, protect against deleting the final administrator, log destructive actions, and return generic errors.

**Retest:** Anonymous and USER GET/DELETE return 401/403 without executing Prisma. Only ADMIN can operate on disposable test records. Confirm production routing provides no alternative unauthenticated entry point. No DELETE request was executed during this audit.

### AUD-02 — Missing authentication secret permits forged admin sessions

**Critical · Runtime verified locally · Conditional on missing/empty secret**  
**Location:** `lib/auth.ts:197`, JWT callback `:169–185`.

The configuration always falls back to a public, hard-coded secret, including in production. A synthetic JWT encrypted with that source-code value, carrying an ADMIN role and a recent role-check timestamp, was accepted by the local production session endpoint as an administrator. The protected blog API then passed its authorization check and reached the database. No actual account was needed for this local verification.

**Fix:** Require a strong deployment-specific secret and fail startup/configuration validation when it is missing. Rotate any environment that has used the fallback and invalidate its sessions. Require that privileged sessions map to a current authorized database identity; do not trust a timestamp in a potentially compromised token as the sole control.

**Retest:** Production refuses to start without a secret. A cookie generated with the former fallback is rejected after rotation. Unknown/deleted users cannot obtain privileged sessions. Evidence: `session-check.json`; reproduction script contains only the already-public fallback, never a real deployment secret.

## High findings

### AUD-03 — Locked dependencies include critical advisories

**High remediation priority · Scanner confirmed; exploitability varies**  
**Location:** `package-lock.json`, `package.json`.

The scan identifies critical package entries for **Next.js 15.5.15**, **next-auth 4.24.14**, and **tar 7.5.13** (tar also has additional installed paths). The full scan counts affected packages and propagated dependency effects, not 59 independently demonstrated exploits.

Next.js has reviewed advisories affecting Windows-hosted applications and AVIF image optimization. This checkout runs on Windows and enables AVIF, making these particularly relevant configurations to review. Actual remote exploitation was not attempted. The Auth.js email-normalization advisory is less directly relevant because this configuration uses Credentials/OAuth rather than the email provider. Tar issues depend on archive-processing paths; no public archive-extraction route was identified.

**Fix:** Update Next.js and related packages to supported patched releases, update Auth.js within a compatible release line, refresh Tiptap and transitive dependencies, and regenerate the lockfile with regression validation. Do not blindly apply force upgrades or scanner-suggested major downgrades. Re-run both full and production-only scans and document accepted residual risks.

**References:** [Windows advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36), [AVIF advisory](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [Auth.js advisory](https://github.com/advisories/GHSA-7rqj-j65f-68wh). Scanner ranges and all advisory URLs are in `dependencies.json`; assess the full list when selecting a patched target rather than treating one advisory's patch as sufficient for all advisories.

### AUD-04 — Applicant filenames can escape the upload directory

**High · Path calculation runtime verified; write path code confirmed**  
**Location:** `app/api/apply/route.ts:205–238`.

Resume, Aadhaar, photo, and portfolio filenames only replace whitespace. The supplied name is concatenated with a prefix and joined to the storage directory. Embedded separators and parent segments can escape that directory despite the prefix. A pure path calculation with `folder/../../../../audit-marker.txt` resolved to the project root; no file was written. The vulnerable write happens after a valid job lookup, so exploitation requires a functioning database and valid job ID.

**Fix:** Generate server-side random storage keys, derive extensions from verified allowed content, reject path separators, and enforce containment using resolved paths and `path.relative`. Apply the same storage abstraction to all four file types. Validate byte size before decoding and storing.

**Retest:** Traversal strings using Windows/POSIX separators cannot influence storage paths. Assert no file is created outside a temporary upload root in an isolated test environment.

### AUD-05 — Public mentorship uploads expose resumes and accept active content

**High · Code confirmed**  
**Location:** `app/api/mentorship/route.ts`, resume storage branch; `app/api/admin/upload/route.ts:16–54`.

Mentorship resume submission checks a 5 MB limit but does not enforce PDF type or inspect bytes. It preserves the supplied extension, writes into `public/uploads/resumes`, or publishes to Vercel Blob with `access: 'public'`. Resume URLs therefore bypass the protected applicant-document download route. The admin uploader also lacks size/type checks. HTML/SVG and other active content can be hosted under returned URLs, subject to hosting/browser behavior and security headers.

**Fix:** Store personal documents privately, use authorized downloads or short-lived signed URLs, verify file signatures and permitted extensions, enforce limits, scan uploads, and use generated names. Serve untrusted documents as downloads with restrictive headers. Restrict public media uploads to verified image types.

**Retest:** An unrelated/anonymous client cannot download a personal resume. HTML/SVG/disguised files and oversize files are rejected server-side. No live resume was uploaded or fetched in this audit.

### AUD-06 — OTPs can be used as cross-account magic-link tokens

**High · Code confirmed**  
**Location:** `app/api/mentorship/magic-link/route.ts:9–37`, `:87–107`; `prisma/schema.prisma`, MentorshipToken.

Magic links and six-digit OTPs share the same globally unique `token` field. Sending `{token: '<six digits>'}` uses a global token lookup with no email binding, so an active OTP can authenticate its owner through the magic-link branch. There is no attempt limiter, and both values use `Math.random`. The returned full request includes scalar fields such as internal mentor notes and related feedback. Deleting only the credential used leaves the sibling OTP/link active.

**Fix:** Separate credential types and bind OTP verification to a specific challenge and normalized email. Use cryptographic randomness, hashed stored credentials, tight distributed attempt limits, atomic challenge consumption, invalidation of sibling credentials, and an explicitly selected learner-safe response DTO.

**Retest:** An OTP never works as a link token, wrong-account OTPs fail, attempts lock out appropriately, concurrent/replayed requests fail, and mentor-only notes never appear in learner responses. Database-backed exploitation was not attempted.

### AUD-07 — Production mentorship login never sends the promised credentials

**High · Code confirmed**  
**Location:** `app/api/mentorship/magic-link/route.ts:109–131`; `next.config.ts:7`.

The generation branch creates credentials and logs them, but calls no email/SMS delivery service. Production responses omit credentials while claiming a link/code has been sent. Production console removal also removes the intended console-based fallback. Applicants cannot complete the normal login flow through this implementation.

**Fix:** Implement a real delivery service with explicit failure handling and rate limits. Keep credentials out of logs and return a generic request-accepted response only when delivery has been durably queued.

**Retest:** A production-configured test mailbox receives the correct expiring code/link; provider failure is observable and does not produce a misleading delivered message.

### AUD-08 — Deleted users retain existing JWT privileges

**High · Code confirmed**  
**Location:** `lib/auth.ts:169–185`.

On refresh, the JWT role is updated only if a user record exists. A missing record leaves the old ADMIN role intact. Database errors also preserve privileges. Deleting an administrator therefore does not revoke the existing token, and an outage can extend stale privileges beyond the intended 30-second check period.

**Fix:** Treat a missing identity as an invalid session. Define a deliberate privileged-session outage policy, add a revocation/session version mechanism, and centralize current-user authorization for sensitive operations.

**Retest:** A token from a deleted/demoted user loses admin access within the documented revocation interval; DB failures behave according to the explicit policy.

### AUD-09 — HTML rendering lacks a reliable sanitization boundary

**High · Code and pure sanitizer checks confirmed; browser execution not attempted**  
**Location:** `components/BlogPostContent.tsx:361`; `lib/sanitize.ts:1`; `components/editor/BlockRenderer.tsx`; `components/SchemaScript.tsx:14`.

Legacy blog HTML is inserted directly. The shared sanitizer is a regular-expression filter, not a parser/allowlist: the audit confirmed it preserves a `javascript:` URL and a YouTube iframe with a `srcdoc` attribute. JSON-LD is also emitted using raw JSON.stringify without escaping `<`, which can terminate script markup if values contain closing-script text. Most CMS content requires admin access, so this is primarily a compromised-admin/content-import defense gap rather than a demonstrated anonymous injection route. CSP may block individual payloads but is not a substitute for safe markup handling.

**Fix:** Use a maintained parser-based sanitizer with explicit tags, attributes, URL protocols, and iframe policies; apply it consistently to every CMS rendering path. Escape `<` in JSON-LD serialization. Keep preview behavior consistent with published rendering.

**Retest:** A maintained XSS fixture corpus is safely rendered in previews, blocks, legacy articles, custom pages, and JSON-LD. Test CSP separately in production mode.

### AUD-10 — Development mode bypasses sensitive admin authorization

**High · Code confirmed; conditional on dev-server exposure**  
**Location:** `app/api/admin/careers/route.ts:10`; `app/api/admin/documents/route.ts:10`.

Both helpers authorize every caller when NODE_ENV is development. This exposes applicant listings, applicant updates, and personal-document retrieval to anyone who can reach a development server with real data. The earlier Next.js dev output advertised a LAN URL. Production mode correctly returned 401 in local checks; this is specifically a development-mode exposure.

**Fix:** Remove implicit bypasses; use normal authorization with disposable local identities/data. Bind development to loopback when remote access is unnecessary.

**Retest:** Anonymous requests are denied in development and production, including when the development database contains seeded applicants.

### AUD-11 — Expensive/public write flows lack effective abuse and size controls

**High · Code confirmed**  
**Location:** `app/api/auth/register/route.ts`; `lib/auth.ts`, Credentials authorize; `app/api/mentorship/route.ts`; `app/api/newsletter/subscribe/route.ts`; `app/api/track/route.ts`; `lib/security.ts:6`.

Registration/password verification have no application attempt limits. Several public database-write/upload routes have none either. Existing contact/application limits use a per-process LRU with only 500 keys and the raw forwarded header, making consistency and identity dependent on deployment topology. Applicant base64 fields have no server-side decoded-size/type bounds; parsing/decoding can consume substantial memory and storage. Proxy limits may reduce exposure but were not inspected.

**Fix:** Enforce platform/body limits and application byte/string/array bounds, validate before expensive work, use a shared distributed limiter keyed by trusted proxy identity plus account/challenge, and add abuse monitoring. Implement consistent 400/413/429 responses.

**Retest:** Limits hold across two instances and hostile forwarded headers; oversized and malformed input does not allocate/decode unbounded content; login guessing is throttled.

### AUD-12 — Contact submission can report success after losing the message

**High · Code confirmed; deployment dependent**  
**Location:** `app/api/contact/route.ts:34–48`, fallback response; `app/api/admin/messages/route.ts:13`.

If Prisma fails, contact submission writes to a local JSON file. The write helper catches errors without reporting failure, and the route still returns 201. On read-only/ephemeral hosting the message can disappear. The admin list reads only Prisma and never reads this fallback file, so even a successful fallback write is invisible there. A root-level `messages.json` is also not ignored by the current .gitignore, creating an accidental commit risk for contact data.

**Fix:** Use durable storage/queueing and acknowledge only durable acceptance. Return a clear retryable failure otherwise. Remove the split store or provide a deliberate durable reconciliation path; keep personal data outside source control.

**Retest:** Database and filesystem failures never produce an accepted-but-lost message; accepted messages appear in admin views or a durable retry queue.

### AUD-13 — Seed defaults are weak and seeded admin roles are overwritten at login

**High · Code confirmed; conditional on seeding/configuration**  
**Location:** `scripts/create-admin.ts:10–23`; `lib/auth.ts:114–143`; README installation instructions.

The seed script has a fixed default admin email/password and resets the password on every upsert. Login independently derives role from plural `ADMIN_EMAILS`, overwriting the seeded DB role. The seed uses singular `ADMIN_EMAIL`. Following the documented seed path can therefore create predictable credentials and then unexpectedly demote the seeded administrator unless a separate environment variable is configured.

**Fix:** Require explicitly supplied strong seed credentials, refuse default production credentials, avoid resetting an existing password as part of routine content seeding, and choose one documented role-authority model. Separate content seeding from administrator provisioning.

**Retest:** Re-running content setup cannot reset credentials; administrator role survives intended logins; missing provisioning inputs fail clearly.

## Medium findings

### AUD-14 — Static fallback defeats database unpublishing/deletion

**Code confirmed · `lib/blog-posts.ts:40–50`, `:55–70`, `:89`**

Static posts are always inserted into listings, and individual lookups fall back to static content even when a matching DB record exists with `published: false`. Deleting the DB copy similarly exposes the static copy. This undermines editorial takedowns and draft visibility expectations.

**Fix:** Define precedence and tombstone/unpublish behavior explicitly. An existing unpublished DB record should suppress a matching static slug. **Retest:** Publish, unpublish, delete, and restore a static-backed slug; verify listing, article, RSS, sitemap, and categories agree.

### AUD-15 — Public jobs GET writes sample openings and hides outages

**Runtime/code confirmed · `app/api/jobs/route.ts`, GET**

When there are no OPEN jobs, GET inserts default openings—even if existing jobs were intentionally closed. Concurrent first reads can create duplicates. On DB errors, it returns sample jobs with HTTP 200 in all environments; these fallback objects lack persistent job IDs and cannot support valid applications.

**Fix:** Move seeding to an explicit script. Return empty openings when closed and a deliberate unavailable state on DB failure. **Retest:** Closing all jobs stays closed after GET; concurrent reads never write; unavailable jobs cannot be submitted as real openings.

### AUD-16 — Count-based application IDs collide under concurrency/deletion

**Code confirmed · `app/api/apply/route.ts:242–243`; Applicant.applicationId unique constraint**

Two submissions can observe the same count and produce the same ID, causing one to fail. Deleting records can also reuse an existing count-based identifier. The year is hard-coded to 2026.

**Fix:** Use an atomic database sequence or unique opaque ID with a separate human display format. **Retest:** Parallel submissions and deletions never cause duplicate IDs; the displayed year follows the intended rule.

### AUD-17 — Multi-step mentorship changes are not atomic

**Code confirmed · `app/api/mentorship/route.ts`, request/progress creation; `app/api/admin/mentorship/route.ts`, PUT**

Creating an application and nine progress records uses separate writes. Updates reset progress, add feedback, and update the main record separately. Failures leave partially initialized applications, partially reset progress, or feedback saved with an otherwise rejected update. Resetting completion also leaves completedAt values behind.

**Fix:** Use Prisma transactions/nested writes for related state, clear completion dates appropriately, and reconcile/clean up uploaded objects on failed creation. **Retest:** Inject a failure mid-operation; either all intended database changes commit or none do.

### AUD-18 — Applicant listing overfetches identity documents and lacks pagination

**Code confirmed · `app/api/admin/careers/route.ts:48`; `prisma/schema.prisma`, Applicant/PageView models**

The list query returns every scalar applicant field, including base64 documents, addresses and other identity information, for all matching rows. This needlessly enlarges responses and the sensitive-data footprint in the browser. Analytics queries also aggregate growing tables without explicit secondary indexes; the schema has no declared `@@index` entries. Existing production indexes were not inspected, so query-plan impact is unmeasured.

**Fix:** Select a minimal list DTO, fetch documents separately, paginate, and add indexes based on actual filters/plans (for example PageView.createdAt/url and applicant lookup/sort paths). **Retest:** List responses contain no base64 documents, remain bounded, and meet a measured query/response budget on realistic data.

### AUD-19 — Analytics stores query strings and publicly exposes top paths

**Code confirmed · `components/AnalyticsTracker.tsx:21–35`; `app/api/track/route.ts`; `app/api/analytics/public/route.ts`**

Tracking records the entire pathname/query and full referrer. Magic links use query-string tokens, and other pages can carry personal identifiers. Public top-pages analytics can expose captured query values if such URLs reach the top set. Anonymous callers can also inject arbitrary URL values and generate unlimited page-view writes. Unsalted truncated IP hashes should not be treated as proof of anonymization.

**Fix:** Strip queries/fragments or allowlist harmless parameters before both transmission and persistence, redact referrers, exclude sensitive flows, bound/validate URLs, rate-limit collection, and publish only safe aggregated paths. Define retention and privacy controls separately. **Retest:** A synthetic secret in any query/referrer never reaches storage or public analytics.

### AUD-20 — Newsletter lacks a complete subscription/delivery lifecycle

**Code confirmed · `app/api/newsletter/subscribe/route.ts`; `lib/mail.ts`, notifySubscribersOfNewPost; `app/api/admin/blog/route.ts`**

Subscribe only checks for an `@`, does not normalize email or confirm ownership, and has no unsubscribe state/endpoint in the inspected API inventory. New-post mail includes all registered users regardless of subscription choice. It launches every send concurrently, and publishing does not await durable delivery scheduling, risking dropped or partially delivered batches on serverless hosting. Templates promise unsubscribe without implementing a link.

**Fix:** Implement validated/normalized confirmed subscriptions and signed unsubscribe links, separate registration from newsletter consent, and use a bounded durable delivery queue with deduplication/retries. **Retest:** Unsubscribed/unconfirmed users receive no broadcast; delivery survives process termination and retry without duplicate mail. Legal compliance was not assessed.

### AUD-21 — Administrative actions falsely report completed work

**Code confirmed · `app/api/admin/seo-actions/route.ts:19–39`; `app/api/dashboard/stats/route.ts`**

SEO actions return fixed counts and success messages without rebuilding links, writing metadata, generating FAQs, or calling an indexing service. Dashboard stats are fixed mock values. Operators can believe work completed or rely on fabricated operational metrics.

**Fix:** Implement measurable operations with job status/results, or clearly disable and label unfinished features. **Retest:** Every success is tied to an observable state change or durable queued job; unavailable actions cannot claim success.

### AUD-22 — Blog lists serialize full article bodies into large responses

**Runtime/code confirmed · `app/blog/page.tsx:35–58`; `components/BlogList.tsx:57–102`; `lib/blog-posts.ts:31`**

The production `/blog` response was **3,379,672 bytes uncompressed**, while `/` was **840,871 bytes** in local HTTP samples. The list passes every complete article to a client component and analyzes content to infer difficulty. Search/filter/sort work repeats over the full collection. Shared initial JS was 103 kB in build output; selected dashboard routes exceeded 540 kB total initial JS. These byte sizes are not network-compressed transfer sizes or Core Web Vitals scores.

**Fix:** Select compact list metadata, precompute difficulty/search metadata, paginate/search on the server, avoid serializing blocks/content into cards, and lazy-load large chart/editor dependencies. Root-layout request headers also make many public routes dynamic; evaluate intentional caching separately from nonce requirements. **Retest:** Compare production response bytes and mobile lab/field measurements under representative conditions; verify real-user scripts are included in performance tests (PerformanceOptimizer currently skips Lighthouse/PageSpeed).

### AUD-23 — CI masks failures and has no meaningful automated test gate

**Code confirmed · `.github/workflows/ci.yml`, lint/build steps; `package.json`, scripts**

Lint failure is swallowed with `|| echo`, and build has `continue-on-error: true`. The pipeline can appear green when code fails to build. There is no test script or dedicated automated application test suite found in the source inventory. TypeScript/lint passing did not catch the confirmed access-control failures. CI also builds with repository secrets rather than an isolated disposable database/configuration, limiting safe fork validation.

**Fix:** Make lint, types, tests, and build blocking. Add targeted authorization/session/upload/publishing tests and an isolated DB fixture. Include dependency checks with an explicit risk policy. **Retest:** Deliberately failing each gate makes the workflow fail; anonymous-admin and fallback-secret regression fixtures run on PRs without production credentials.

### AUD-24 — Crawl directives and sitemap disagree; freshness labels are static

**Code confirmed · `public/robots.txt`; `app/sitemap.ts`; `components/home/RecentlyUpdated.tsx:10–22`; `app/blog/page.tsx:23`**

The sitemap includes dashboard URLs that default robots rules disallow. More-specific Bing/AI crawler groups allow all paths and do not inherit the default disallows, so crawler policy differs by agent. Recently updated content uses hard-coded Today/Yesterday/This Week labels rather than modification dates; some labels describe topics different from their link destinations. The blog index is explicitly noindex, which may be intentional but deserves a documented search strategy.

**Fix:** Decide which public routes should be crawled/indexed and make robots, metadata, canonicals and sitemaps consistent. Generate freshness labels from verified content metadata and correct destinations. **Retest:** Parse directives per user agent, check sitemap URLs against them and rendered metadata, and verify date labels against stored timestamps. No search-ranking or AdSense outcome is guaranteed by this audit.

### AUD-25 — Mobile sign-in state has no rendered destination; drawer accessibility is incomplete

**Code confirmed; full keyboard/mobile behavior unverified · `components/MobileMenuDrawer.tsx:156–164`; `components/Navbar.tsx:17`; `components/MobileMenu.tsx`**

The SIGN IN action closes the drawer and sets isLoginOpen, but Navbar never renders a login modal or navigates based on that state. The drawer source also lacks a complete dialog/focus-management pattern and keyboard Escape handling. This can leave the sign-in action inert and keyboard focus behind the visual overlay. Other components may manage parts of focus, but no such integration is visible in this path.

**Fix:** Navigate to the intended auth route or render the existing auth modal. Use an accessible dialog implementation with an explicit label, focus trap, Escape close, and focus restoration. **Retest:** Verify sign-in at mobile breakpoints, keyboard-only operation, screen reader labeling, focus restoration, and zoom/reflow. Do not consider the sampled desktop screenshot a WCAG pass.

## Low findings

### AUD-26 — Setup and database lifecycle are not reproducible from documentation

**Code confirmed · README setup; `package.json`; `prisma/`; AGENTS.md**

README refers to an absent .env.example, omits a supported runtime declaration, and recommends db push rather than a versioned migration deployment process. No prisma/migrations directory exists. CI specifies Node 20 while local verification used Node 24.15.0/npm 11.12.1. The repository's agent note refers to bundled Next documentation that is absent from this installed Next.js version. The root-inference warning selected an unrelated parent lockfile, making local/build behavior environment-dependent.

**Fix:** Add a secret-free environment template, startup validation, documented prerequisite/service setup, pinned/supported runtime guidance, migration history/deployment commands and an explicit tracing root where appropriate. **Retest:** A fresh checkout can install, migrate a disposable database, provision an admin safely and launch using only documented steps. Existing deployment backups/restore procedures were unavailable for review.

### AUD-27 — Security headers, logging, and error handling need one policy

**Code/runtime confirmed · `next.config.ts:7`, headers(); `middleware.ts`, response headers; public/admin error catches**

Configuration and middleware set conflicting X-Frame-Options and Referrer-Policy values; production CSP retains unsafe-eval. Global production console removal removes diagnostic errors as well as debug output, while several API catches return raw exception text (users leakage reproduced locally). This combination suppresses operator evidence while disclosing internal detail to clients.

**Fix:** Centralize headers, reduce CSP allowances after testing integrations, preserve structured redacted error telemetry and correlation IDs, and return stable generic client errors. **Retest:** Inspect effective page/API headers in production, exercise failure paths, and verify operators receive actionable logs without exposing secrets/internal schema details to clients.

## Remediation order and acceptance gates

| Order | Work package | Suggested owner | Release evidence |
|---|---|---|---|
| 1 — Immediate | AUD-01/02: protect user APIs, require/rotate secret, revoke stale sessions | Backend/security | Anonymous/USER denial, fallback cookie rejection, deleted-user revocation |
| 2 — Before production | AUD-03/04/05/06/10/11/13: patch dependencies, secure files/OTP, remove bypass/default credentials, bound input | Full-stack/backend | Clean reviewed advisory baseline, upload/auth abuse regression tests |
| 3 — Before enabling workflows | AUD-07/12/14–17/20/21: durable delivery/storage, authoritative publishing, safe IDs/transactions, truthful actions | Backend/product | Disposable DB + test-mailbox workflow runs and injected-failure tests |
| 4 — Reliability gate | AUD-18/19/23/26/27: minimal data, privacy-safe analytics, blocking CI, migrations/config/logging | Backend/platform | Bounded API DTOs, query plans, CI negative tests, restore/config drill |
| 5 — Frontend quality | AUD-22/24/25: payload reduction, crawl consistency, accessible working mobile auth | Frontend/SEO | Production performance measurements, route/crawl checks, keyboard/mobile verification |

Small code changes may close individual issues quickly, but no reliable total effort estimate is possible until a disposable database, service configuration, and intended publishing/role/consent policies are available. Treat the first two packages as release blockers rather than cosmetic cleanup.

## Existing strengths to preserve

- TypeScript strict mode is enabled and currently passes.
- Most admin mutation routes explicitly require ADMIN before querying or mutating.
- Credential passwords use bcrypt; email verification tokens use crypto.randomUUID and expiry.
- Prisma is the primary query interface; reviewed dynamic values in the tracking raw SQL fallback use parameter binding. No confirmed SQL-injection finding was established by this review.
- The health endpoint correctly returns 503 for database unavailability.
- Several public pages intentionally retain readable static content during database failure.
- Security headers, nonce handling, and upload utilities already provide places to consolidate stronger shared controls.

## Remaining validation required for a release decision

1. Run normal-user/admin/deleted-user session tests against a disposable PostgreSQL database with configured providers; include concurrent revocation and failed role lookups.
2. Exercise registration, verification resend/recovery, mentorship delivery/login, career application/document retrieval, contact, publication, and newsletter unsubscribe end-to-end with test identities.
3. Validate upload rejection, private-download authorization, concurrency, transaction rollback, body limits and distributed rate limits in the intended hosting environment.
4. Run migration/backup restoration and query-plan checks with representative, sanitized data; verify object-storage lifecycle and personal-data retention/deletion.
5. Test mobile browsers, keyboard/screen-reader interaction, real-user performance, production CSP, and external chart/advertising/OAuth integrations. Existing README Lighthouse claims were not independently substantiated.
6. Review hosting/WAF/IAM/secret configuration and production dependency reachability. No claim is made about controls outside the checkout.

## Evidence index

| Artifact | Contents |
|---|---|
| `build.log` | Successful production build, warnings, and route JS sizes |
| `dependencies.json` | Unmodified npm audit JSON; advisory ranges, paths and suggested fixes |
| `http.json` | Local production status/size samples and limited API error bodies |
| `source-checks.json` | Full route/method/auth-reference inventory plus pure sanitizer/path checks |
| `audit-checks.ts` | Reproducible inventory and non-writing sanitizer/path probe |
| `session-check.json` | Synthetic session role and protected endpoint status; no cookie retained |
| `session-check.cjs` | Local read-only fallback-secret verification; restrict to disposable/local targets |
| `production-server.log` | Production-start warnings and local-runtime diagnostic output |

The inventory's sessionReference flag is a source-search aid, not a security verdict. Public cohorts/resources and topic-authority GET handlers also lack session checks; unlike the users API they do not expose the same user-management capability. Decide whether those reads are intentionally public and reflect that decision in route naming and tests.

**Audit-only delivery:** findings and evidence are added under audit/. Existing application code, dependencies, database, and remote repository were not modified by this audit.

The temporary production server was stopped after verification. The development server was restored on port 3001, bound to loopback (`127.0.0.1`) for local use.
