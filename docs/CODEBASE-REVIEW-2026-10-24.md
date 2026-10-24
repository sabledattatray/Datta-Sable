# Project review — 24 October 2026

## Changes

- Session refresh now enforces password/session revocation and account deletion for environment-listed administrators. If the database lookup fails, stale privileges cannot authorize a request. This intentionally requires signing in again after a failed revocation check.
- Research citation validation rejects non-HTTPS URLs, unapproved hosts, credentials and custom ports before making requests. Redirects are followed manually with the same checks, a redirect limit and a timeout. Successful final responses are required; GET fallback bodies are released.
- MCP rejects malformed JSON-RPC envelopes with controlled errors. Initialization and tool discovery no longer require database schema writes, and schema initialization failures are caught without exposing internal exception messages.
- Public job-list requests no longer populate the database with sample vacancies. An empty database returns an empty list; the existing development-only failure preview remains.
- Dashboard accent buttons expose their selection through `aria-pressed` in a labeled group.
- Removed the unsupported `.eslintignore`; its exclusions were already present in the flat ESLint configuration.
- Upgraded Zod to 4.6.7 and adapted contact/application validation errors to its `issues` API. A dependency override also replaces Vercel CLI configuration's pinned vulnerable Zod version. Vercel Blob's declared minimum is now 2.8.2, matching the installed version.

## Validation

- All 167 tests passed, including five new regression tests for revocation, research redirects, empty job listings and malformed MCP envelopes.
- TypeScript `--noEmit` passed after the dependency migration.
- Production build passed using `NEXT_BUILD_DIR=.next-audit` with normal lint/type validation enabled. Build-only changes to tsconfig were removed afterward.
- ESLint reported no errors. Existing unused-code warnings remain; this review did not remove unused state, handlers or imports across the application.
- npm installation audit reported zero vulnerabilities after applying the dependency override.
- Browser verification confirmed the home page renders.
- HTTP smoke checks returned 200 for home, blog, tools, products, sign-in and contact. Anonymous access to the admin users API returned 403.
- A read-only `SELECT 1` succeeded outside the network sandbox. The restarted development server can reach the database, and `/api/health` returned 200.
- Git whitespace checks passed.

## Limits

The sandboxed production build completed using the application's existing database fallbacks because outbound database access was restricted there. The development server was subsequently restarted with network access and database connectivity verified. Payment-provider transactions, real email delivery, authenticated administrator workflows and external integrations were not exercised against live services. Successful checks do not establish that every possible application workflow is defect-free.

Local verification logs are in the ignored `scratch/audit-2026-10-24/` directory. The development server remains available at http://localhost:3000/.
