# Phase 7 — QA and release status

This is an implemented, feature-gated module awaiting integration/launch inputs, not a production release approval.

## Evidence

- Baseline `npm test`: 182 passed, zero failures.
- Latest full suite: **195 passed, 0 failed**. Current exact full-suite output: `test-results.txt` (run `npm test`). New tests are in `tests/ebooks.test.mjs` and include disposable PostgreSQL/PGlite migration execution, draft price, publication/test gates, email link replay/expiry, pagination, privacy, paid download/snapshot authorization, revoked/expired/refunded/exhausted grants, concurrent use failure, CSRF and anonymous admin denial. Existing commerce tests cover capture/refund/webhook idempotency and generic admin ownership.
- `npx prisma generate`: succeeded; no real DB migration executed. Prisma client needed a brief dev-server restart because Windows locks its loaded engine DLL.
- `npx tsc --noEmit --pretty false`: no diagnostics in the completed checks.
- Focused ESLint: new eBook files had no diagnostics; touched middleware has two pre-existing unused-variable warnings.
- Isolated production build: `$env:NEXT_BUILD_DIR='.next-ebook-build'; npx next build` (first build also ran via `npm run build`). Completed build included all new routes. Existing pages logged unreachable configured database/fallback warnings. See final report for any later build limitations.
- `browser-checks.json` and real screenshots: actual localhost storefront widths 320/375/768/1024/1440 had no horizontal overflow; library/access/admin-auth/error views at 375 also had none. Anonymous grant returned 401; cross-origin checkout returned 403. Light theme was also checked at 375/1440; `theme-keyboard-checks.json` records one main landmark, one H1 and keyboard focus moving from search to category. This is desktop Chromium at mobile viewport sizes, not physical-device testing.

## Acceptance gate matrix

| Area | Status / remaining gate |
|---|---|
| Existing product/order/payment reuse | Implemented; original tests retained |
| Additive migration / taxonomy seed | Migration tested on disposable DB; apply and seed configured DB still blocked |
| Published-only catalog/search/pagination | Implemented; populated real DB browser QA pending |
| Actual cover/final 33-page PDF | Owner input required; not fabricated or copied from local drafts |
| Price 9900 paise | Seed, server checkout and automated validation; provider test transaction pending |
| One entitlement/customer receipt | Existing serializable/upsert flow; mocked concurrency evidence; real capture pending |
| Guest verification/library | Implemented and expiry/replay tested; real mailbox E2E pending |
| Private storage/grants/snapshots | Code/tests pass; real private Blob and purchased-PDF test pending |
| Admin create/edit/upload/publish/categories | Implemented; authenticated browser workflow pending |
| Orders/refunds/reconciliation | Existing admin reused; added eBook pending fallback; provider E2E pending |
| Fine-grained delegated staff roles | ADMIN-only capability mapping; delegated assignment UI deferred |
| Advanced eBook analytics/settings | Partial; dedicated funnel/settings/dashboard gaps listed in phase docs |
| Preview PDF/scheduled publish | Not implemented; no preview or scheduling claims |
| Accessibility / themes | Semantic controls/focus/responsive code; full contrast/screen-reader audit pending |
| SEO/sitemap/social | Implemented; real cover/deployed share validation pending |
| Performance p75 targets | Not measured; require representative deployed traffic/lab runs |
| Policies/tax/sender/backups | Owner operational review required |
| Live payments / deployment | Not enabled; explicit owner approval required |

## Staging and release runbook

1. Back up database and private store. Review/apply migration in staging and regenerate Prisma client. Keep both eBook flags off initially.
2. Configure `.env.ebooks.example` variable names in hosting secrets. EBOOK_ACCESS_SECRET must be random and at least 32 characters. Keep Razorpay in test mode; preserve existing approved currencies when adding INR rather than removing USD from existing products.
3. Confirm real private Blob store, verified existing sender, policy publication, INR merchant support, and CRON_SECRET scheduler auth. Register test webhooks as described in phase 4. Increase job frequency for timely retry/reconciliation; the daily Hobby fallback is not a delivery SLA.
4. Seed through ADMIN studio. Upload/review final PDF and actual cover. Verify checksum, licensing, 33 pages, five walkthroughs, exclusions and the exact 9900-paise amount. Publish only after review. Enable EBOOK_STORE_ENABLED for staging; leave global navigation gate off until readiness QA.
5. Reproduce buyer flow: catalog → product → verify guest email or sign in → accept policies → Razorpay test checkout → provider-confirmed capture → library → grant → private PDF. Repeat cancelled, forged callback, amount/currency mismatch, duplicate/racing webhook, failed email, expired/reused grant, refund and revoked cases. Verify one customer receipt, one entitlement and no public PDF access.
6. Complete populated viewport screenshots, keyboard/screen-reader/contrast checks, social preview/sitemap checks, E2E and regression against Products/blog/auth/admin/analytics. Resolve the partial items above. Enable EBOOK_STORE_NAV_ENABLED only after review.
7. Obtain explicit owner go/no-go for production deployment/live payments. The current eBook code intentionally refuses live keys; enabling real purchases requires a separate reviewed change. No production deployment was attempted.

Rollback immediately by disabling both flags and restoring previous app release. Retain financial records and historical files. Reconcile provider payments before any manual retry/refund; never delete orders to clear a failed checkout. Wrong-email/duplicate-payment/access complaints go through existing contact/support and audited admin tools after identity verification.

