# Commerce setup and operations

## Current release boundaries

This implementation is TEST MODE ONLY. The server rejects non-`rzp_test_` keys, and the database migration adds a test-only order constraint. There is no live activation switch in this release. Do not remove these controls without a separate approved go-live change.

No migration, seed, real payment, refund, email send, DNS change, or deployment was performed during implementation. The existing blog redesign was committed and pushed separately as `8f1e497`.

## Architecture

- Next.js 15 App Router; Node.js API handler at `app/api/commerce/[...path]/route.ts`.
- Prisma 5 / PostgreSQL; additive `Commerce*` models. Existing users are reused. Account deletion sets historical order ownership to null; financial records do not cascade-delete.
- Signed-in, verified users only; guest checkout is intentionally excluded from the initial release.
- Existing admin shell and navigation: `/admin/payments`, `/admin/products`, `/admin/orders`, `/admin/orders/transactions`, `/admin/refunds`, `/admin/email-logs`.
- Customer routes: `/products`, `/products/[slug]`, `/account/orders`, `/account/orders/[id]`, `/account/purchases`, `/checkout/success`, `/checkout/failed`.
- Existing Resend API / SMTP transport is reused. Marketing campaigns retain their existing sender and idempotency namespace; commerce has a separate sender, namespace and database outbox.
- Private Vercel Blob storage is separate from public media. Only authorized purchases receive a two-minute signed download URL. Already-issued URLs can remain valid until expiry after revocation.

## Database rollout: explicit review required

The connected existing database was inspected read-only. Existing site and campaign tables are present; commerce tables and `_prisma_migrations` were absent. This is not proof that every existing column, default, index, and constraint matches the baseline.

Two migrations are provided:

1. `20261021000000_existing_baseline`: the existing schema, including `User.image` and campaign tables. It is for a new empty database, or for recording an existing matching schema as an already-applied baseline. **Do not execute this baseline SQL on an existing database.**
2. `20261021000100_commerce`: creates commerce tables, indexes and foreign keys; adds positive financial amount and test-mode constraints. No existing tables or records are dropped or rewritten.

Before applying to an existing environment:

1. Confirm the target database and obtain a verified backup/snapshot through the database provider.
2. Introspect the actual target read-only and compare against the baseline. Use `prisma db pull --print` with output redirected to a scratch file; do not overwrite the application schema. Resolve drift explicitly. Never use `db push`, `migrate reset`, or `--accept-data-loss` here.
3. On an isolated staging database, validate both migrations and the complete test flow first.
4. After review and explicit production migration/deployment approval, record the existing baseline as applied with `npx prisma migrate resolve --applied 20261021000000_existing_baseline`, then apply the commerce migration using `npx prisma migrate deploy`.
5. Run `npx prisma generate` and deploy the matching application build.

For a completely empty, isolated test database, both migrations can be applied normally with `prisma migrate deploy`. Never point a test command at the production URL.

Commerce tables are not created at request time. If they are unavailable, commerce pages fail closed and existing website routes remain independent.

## Required environment configuration

Set secrets in local `.env.local` or Vercel environment settings. Do not commit values.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Existing PostgreSQL connection for the intended environment |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | Existing authentication configuration |
| `RAZORPAY_KEY_ID` | Razorpay TEST key, beginning `rzp_test_` |
| `RAZORPAY_KEY_SECRET` | Matching test secret; server only |
| `RAZORPAY_WEBHOOK_SECRET` | Separate webhook secret; server only |
| `COMMERCE_TEST_CHECKOUT_ENABLED` | Default disabled; set `true` only for approved test checkout |
| `COMMERCE_APPROVED_CURRENCIES` | Explicit comma-separated currencies, e.g. `USD`; only after account/currency confirmation. No exchange rates are calculated |
| `COMMERCE_POLICIES_APPROVED` | Default disabled; `true` only after approved refund/delivery terms are published |
| `COMMERCE_SENDER_VERIFIED` | Default disabled; `true` only after sender/domain verification |
| `COMMERCE_EMAIL_FROM` | Preferred `Datta Sable <ds@dattasable.com>`; must be authorized by the provider |
| `COMMERCE_ADMIN_EMAIL` | Explicit receipt notification recipient |
| `COMMERCE_SITE_URL` | Trusted canonical origin for account/email links; HTTPS in production |
| `COMMERCE_BLOB_READ_WRITE_TOKEN` | Token for a separate PRIVATE Vercel Blob store |
| `CRON_SECRET` | Strong worker authorization secret |
| `EMAIL_PROVIDER` | Existing transport; defaults to Resend, or `smtp` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` / `EMAIL_FROM` | Existing Resend setup; sender override for commerce does not change marketing sender |
| `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD` | Existing SMTP alternative; use Resend for stronger retry idempotency |

No secret uses a `NEXT_PUBLIC_` prefix. Checkout receives only the public test key ID and an authorized order snapshot.

## Product readiness

After staging migrations, open `/admin/products` and choose **Create DP-700 draft if absent**. This idempotent action never overwrites an existing product. It prepares the PRD's USD 49 draft with planned contents, sales disabled and delivery not ready. It creates no fake files.

Upload actual approved PDF, ZIP, or XLSX resources privately (maximum 4 MB per file; split larger packages into resources); confirm delivery readiness; publish the product; and separately enable test sales. Publishing alone does not open checkout. Unpublishing or archiving prevents new sales while existing paid entitlements retain access to active, ready resources. The API checks publication, readiness, active resources, currency approval, policy publication, authentication and global test enablement.

An INR selling price must be explicitly approved and entered in paise. For example, the administrator enters the approved integer amount; the system never converts USD 49 automatically. Historical orders preserve their own displayed and charged prices/currencies.

Refund and delivery pages use approved published CMS pages with slugs `refund-policy` and `delivery-policy`. Without them, checkout is refused. Placeholder policy pages do not invent terms. Check existing terms/privacy content for commerce suitability before approval. These routes initially remain noindex pending policy review.

## Razorpay TEST dashboard setup

1. Select Test Mode and generate test keys. Do not put live keys into this build.
2. Verify merchant eligibility, intended business activity, international acceptance and supported currency before choosing the checkout currency.
3. Review the Orders API / automatic-capture settings. Authorization alone never grants access.
4. Add webhook URL `https://<staging-host>/api/commerce/webhook` and a separate webhook secret.
5. Subscribe to `payment.captured`, `payment.failed`, `refund.created`, `refund.processed`, `refund.failed`.
6. Ensure the webhook URL is reachable by Razorpay; configure staging deployment protection appropriately without exposing private admin routes.
7. Run successful, failed and cancelled test checkouts; inspect retries and refund events.

The signature is checked against the original raw request body. Event IDs are unique in storage. Acknowledgement follows durable persistence. Processing fetches canonical provider state, verifies amount/currency/order association and applies idempotent transactions. A late failure cannot downgrade paid access; a late capture cannot restore refunded access.

## Worker and recovery setup

Authenticated endpoint: `GET /api/commerce/worker` with `Authorization: Bearer <CRON_SECRET>`.

Checkout callbacks and webhook requests request a small immediate processing pass using Next.js `after`. This is a latency optimization, not a scheduler. Durable rows remain for recovery if the invocation ends.

The user confirmed Vercel Hobby. `vercel.json` configures one daily invocation at 03:17 UTC (08:47 India time), compatible with the Hobby daily limit. No deployment was performed; configure `CRON_SECRET` before deploying this schedule. Vercel Cron operates on production deployments, so use a separate test project if testing scheduled execution before approving any production deployment.

Immediate event-triggered processing handles normal receipts. Authorized order-status reads and admin sales reviews also trigger due work. The order screen continues limited polling while receipts are queued, allowing due backoff retries while a customer is present. A 45-second processing budget and small provider-call timeouts keep a batch bounded within the 60-second route duration. The daily job is an unattended recovery fallback, not the primary delivery mechanism. No new paid queue service or frequent cron is required.

Without traffic after a failure, recovery may wait for the daily job (and Hobby timing is approximate). Definite rejected sends can retry the next day without treating an already-rejected request as an accepted email. Ambiguous outcomes and expired sending leases remain held for operator review. No scheduler can guarantee exactly-once external email delivery after a lost acceptance response without provider reconciliation; the implementation favors avoiding duplicate receipts. The existing campaign worker remains separate.

- Webhook workers use database claims, leases, bounded retries and backoff. Stale processing leases can be reclaimed safely.
- Email workers claim durable jobs, retain provider IDs and distinguish queued, retrying, failed, uncertain and provider-accepted states.
- All test receipts are explicitly marked TEST MODE and state that no real payment was collected.
- Provider acceptance is not inbox delivery; delivery is not claimed without evidence.
- Ambiguous email sends or expired sending leases are held for administrator review. Resend idempotency expires after 24 hours. An unconfirmed attempt is not blindly resent after that window. Definite rejection resets the attempt window because the provider has not accepted a message.
- Manual resend requires explicit provider-log review and creates a separately audited delivery. It never resets the original accepted job.
- Transactional receipts are not marketing campaigns and are not suppressed by marketing unsubscribe preferences.

## Reconciliation and refunds

A failed/closed browser does not determine provider payment state. Customers can check or resume an existing pending order. New pending purchases for the same product are blocked while a previous one needs reconciliation.

If provider order creation times out before its ID is recorded, the pending internal order retains the ambiguity. Review Razorpay's receipt/internal order ID before taking any action; never simply create another order. This release deliberately requires operator investigation for that rare ambiguous initiation case rather than risking a duplicate charge.

Admin reconciliation fetches the order's provider payment history. Refund actions support full TEST refunds only and require an explicit confirmation. Unknown outcomes stay recorded for reconciliation. Refund history from the provider is recorded; a verified full refund revokes entitlements, while partial refunds remain recorded without automatically revoking all access. This behavior must match the approved refund/delivery policy before checkout is enabled.

## Sender / DNS setup

Use the existing Resend account if suitable. Verify `ds@dattasable.com` or its sender domain and perform customer/admin receipt tests. Review provider-requested SPF/DKIM records and DMARC alignment with the existing Hostinger configuration. Do not replace Hostinger MX records or add a second conflicting SPF record. DNS changes require a concrete reviewed configuration; none were made here.

## Testing and operational limits

Automated tests cover signature validation, missing/live configuration, replay/concurrency, server-owned snapshots, ownership, state transitions, refunds, transaction rollback, raw-body webhooks, additive migration/data preservation, outbox delivery, retries, ambiguity and worker claims. Tests use isolated fixtures/PGlite and never contact payment or email providers.

Real provider test payments, international/currency account support, email inbox delivery, private storage downloads, and scheduler invocations require configured staging credentials and remain manual acceptance tests. Do not declare production readiness based only on mocked tests.

## Rollback

Disable `COMMERCE_TEST_CHECKOUT_ENABLED` first. Revert the application deployment if necessary. Preserve commerce tables, order snapshots, webhook records and outbox jobs; do not reverse the schema by dropping tables. Continue monitoring accepted payments and queued jobs until reconciled. Coordinate any backup restore separately with the administrator; never overwrite newer financial or website records as a routine rollback.

## Separate go-live approval

Vercel Hobby is restricted to personal, non-commercial use. Selling products requires Vercel Pro/Enterprise or migration to a host that permits commercial use before activation. Review the current business/consulting site use with Vercel as well; withholding live checkout alone does not establish that all existing use qualifies for Hobby. Official references: https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines. No plan upgrade or paid service was purchased.

A later reviewed change is required to support live mode and remove the database test-only constraint. It must confirm merchant activation, currency and amount, actual materials, approved policies, verified sender, webhook processing, private downloads, scheduler reliability, real-operation authorization and production migration/deployment approval. No live payment or real refund is authorized by approval of the test implementation.
