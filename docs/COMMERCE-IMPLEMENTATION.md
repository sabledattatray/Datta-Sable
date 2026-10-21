# Commerce implementation status

## Catalog rollout — 21 October 2026

After the user's request to fix the public catalog, the connected database was checked read-only and a verified private record snapshot was saved under the ignored `storage/backups/` directory (29 existing tables, 11,236 records). The existing marketing foreign-key update action was reflected in the baseline and Prisma schema; the database constraint itself was preserved. A second schema comparison found no baseline drift.

The existing baseline was recorded as already applied, without executing its SQL. The additive commerce migration was applied in a transaction, creating 11 commerce tables. The DP-700 product was published as an upcoming listing with `salesEnabled=false` and `deliveryReady=false`; no materials, payment, email or live checkout were created. All original tables retained at least their prior record counts, and all 122 published blogs remained present.

The public catalog and product detail URLs both returned HTTP 200 with the product visible; the database fallback disappeared and checkout remained unavailable. The initial implementation limitations below describe the earlier handoff; database migration and product creation have now been completed as described here. Real provider acceptance testing remains pending.

## Delivered locally

- Additive Prisma commerce schema and two reviewed-in-staging migration files (existing baseline plus commerce addition).
- Digital product administration; an idempotent administrator action prepares the DP-700 draft without overwriting an existing product or creating files.
- Authenticated test checkout with authoritative prices, immutable snapshots, persistent initiation limits, duplicate-attempt protection, signature verification and canonical provider reconciliation.
- Durable raw-body-verified webhook inbox, event deduplication, monotonic payment/refund handling and transactional entitlements/outbox writes.
- Separate customer/admin transactional receipts using the existing transport, retry/backoff, acceptance tracking, uncertainty review and audited manual resend.
- Protected order history, purchases and short-lived private download links.
- Integrated sales administration, customer/product/order search, currency-separated totals, refund review, webhook review and email logs.
- Hobby-compatible recovery: event-triggered jobs, authenticated order/admin visits and one daily Vercel recovery invocation. No new paid queue service.
- Default-disabled checkout, test-only SDK credentials and a database test-mode constraint. No live activation path.

## File map

| Area | Files |
|---|---|
| Commerce domain | `lib/commerce/{shared,config,access,http,payments,jobs,format}.ts` |
| Database | `prisma/schema.prisma`, `prisma/migrations/20261021000000_existing_baseline/migration.sql`, `prisma/migrations/20261021000100_commerce/migration.sql`, migration lock |
| HTTP endpoints | `app/api/commerce/[...path]/route.ts` |
| Public catalog | `app/products/page.tsx`, `app/products/[slug]/page.tsx` |
| Customer area | `app/account/layout.tsx`, `app/account/orders/page.tsx`, `app/account/orders/[id]/page.tsx`, `app/account/purchases/page.tsx` |
| Checkout result screens | `app/checkout/{success,failed}/page.tsx` |
| Admin routes | `app/admin/payments/page.tsx`, `app/admin/products/page.tsx`, `app/admin/orders/page.tsx`, `app/admin/orders/transactions/page.tsx`, `app/admin/refunds/page.tsx`, `app/admin/email-logs/page.tsx` |
| Shared commerce UI | `components/commerce/{Checkout,OrderStatus,SalesAdmin,SalesPage,SignInNotice,StoreShell,PurchasePolicy}.tsx`, `Commerce.module.css` |
| Approved CMS policy integration | `app/refund-policy/page.tsx`, `app/delivery-policy/page.tsx` |
| Existing integrations extended | `components/LoginModal.tsx` (optional return URL), `lib/email-delivery.ts` (separate transactional sender/idempotency namespace), `app/admin/AdminDashboardWrapper.tsx` (sales navigation), `middleware.ts` (scoped checkout CSP) |
| Dependencies/scheduler | `package.json`, `package-lock.json` (official Razorpay SDK), `vercel.json` (daily recovery only) |
| Tests | `tests/commerce.test.mjs` |
| Setup and operation | `docs/COMMERCE-SETUP.md` |

The original `docs/PRD-RAZORPAY-PAYMENTS.md` remains unchanged. The previous blog work was separately pushed to `main` as `8f1e497`; commerce changes remain local and are not deployed.

## Verification

The automated suite has 106 passing tests, including 32 commerce scenarios. It exercises isolated PGlite migrations, data preservation, financial constraints, raw-body signatures, authorization, tampering, callbacks, capture/refund ordering, concurrent verification, outbox claims, known failures, unknown acceptance outcomes and Hobby daily recovery.

TypeScript and targeted commerce ESLint checks pass. Existing repository lint warnings remain. Production dependency audit reports zero known vulnerabilities. A branded TEST receipt was visually checked at desktop and mobile widths; no email was sent.

Production build output and final operational status should be reported with the implementation handoff; automated tests are not a substitute for provider acceptance testing.

## Not performed / awaiting configuration

- No connected database migration or product seed was applied. Only isolated test databases were created and changed.
- No production deployment, DNS change, live payment, real refund, external email send or private resource upload occurred.
- Razorpay test credentials and merchant/currency approval are not available locally; actual gateway scenarios remain unexecuted.
- Actual sender/domain verification, inbox delivery, private Blob downloads and scheduled invocation need configured staging tests.
- Actual study materials must be supplied, reviewed and uploaded by the administrator. No package content has been fabricated.
- Refund/delivery policy wording requires administrator approval and publication in the CMS. Existing policy placeholders do not enable checkout.
- Existing-table baseline verification and production migration/deployment require separate review and approval.

## Before commercial operation

Vercel Hobby is restricted to personal, non-commercial use. Move to Pro/Enterprise or a commercially permitted host before accepting live purchases; review the existing site's business use as well. See Vercel's official Hobby and fair-use documentation linked in `COMMERCE-SETUP.md`.

Live mode requires a separately approved code/database change, account activation, confirmed currency/price, complete resources, approved policies, sender verification, provider tests, download authorization tests, scheduler/recovery verification and deployment approval. This release is not declared production-ready.
