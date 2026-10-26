# Phase 0 — repository audit, 26 October 2026

Baseline: clean git working tree; npm test: 182 passed, 0 failed (46.6 seconds). No browser baseline captured before schema edits; existing UI is unchanged at that point.

Next.js 15.5.28, React 19, PostgreSQL, Prisma 5.22, NextAuth verified accounts/ADMIN role, CSS modules and existing site theme. Installed node_modules/next/dist/docs is absent; official route/page references consulted before coding. Existing commerce uses integer minor units, immutable order items, serializable transactions, unique payment/event/entitlement/outbox keys, Razorpay SDK, raw-body signed webhooks, durable receipt jobs, private Vercel Blob signed downloads, account purchases, admin products/orders/payments/refunds. Reuse all of these; add an EbookProfile rather than another product/order/payment system. Existing CRON_SECRET-authenticated /api/commerce/worker performs reconciliation and jobs; vercel.json schedules it daily. Email supports Resend or SMTP. Existing policy routes are reused. Existing analytics respects consent and excludes test transactions.

Plan: additive Prisma migration; eBook profile/categories/assets/access grants; server catalog and product routes; existing admin shell with eBook editor; test-only checkout and guest email verification; private PDF grants; sitemap and noindex controls; focused integration/security/regression checks and release documentation. Impacted areas: prisma, lib/ebooks, components/ebooks, app/ebooks, app/api/ebooks, existing commerce purchase safety, middleware, navigation and sitemap.

No production migration, webhook registration, credentials changes, external emails, publication or live payments are authorized by this implementation task. Missing approved cover/PDF and confirmed policy/tax decisions remain launch blockers. Final PDF and cover must be owner-reviewed uploads, not guessed from local files. Catalog remains empty until publication; feature flag defaults off. No fabricated cover, ratings, assets or payment evidence.

Rollback: disable EBOOK_STORE_ENABLED, roll back application commit; keep additive tables and financial records. Back up DB/private storage before deployment. Do not run destructive down migrations after purchases. Migration can be tested on disposable PostgreSQL/PGlite without touching configured data.

Official references:
- https://nextjs.org/docs/app/api-reference/file-conventions/route
- https://nextjs.org/docs/app/api-reference/file-conventions/page
- https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- https://razorpay.com/docs/webhooks/validate-test/

Current docs confirm server orders in integer minor units, signature input from original server order ID, captured payment/API verification, raw-body HMAC and event-ID deduplication. Refund capture does not change provider order paid status. Provider settlement is not proof of a particular buyer entitlement.
