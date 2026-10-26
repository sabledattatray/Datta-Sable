# Owner-supplied books and live-payment update — 26 October 2026

This update supersedes earlier phase reports saying the database is unreachable or eBooks are restricted to test mode.

## Completed

- Owner supplied two PDFs from `C:/Users/sable/Downloads/Ebooks` and set **both prices to INR 99**.
- Inspected the first-page covers and extracted metadata/contents: Real-World Projects has 33 pages; Mastery has 16. Rendered the actual first-page covers to `public/images/ebooks/`. Full PDFs remain in ignored, deployment-excluded `storage/ebooks/imports/`, never `/public`.
- Checked original file sizes and SHA-256 hashes. The two PDF files total **331,709 bytes**. Catalog metadata and review notes are in `content/ebooks/import-catalog.json`; no paid-PDF bytes or download URLs are included there.
- Rechecked the configured database outside the network sandbox: it is reachable. Previous connectivity failures were sandbox-related. Migration status showed only `20261026000100_ebook_store` pending.
- Backed up relevant existing catalog/order-item values privately under ignored `storage/ebooks/backups/`, then successfully ran `npx prisma migrate deploy`. This applied only the new additive eBook migration.
- Ran `npx tsx scripts/import-owner-ebooks.ts --apply --catalog-only`. **Both books now exist as DRAFT database records at 9900 paise**. No sales, delivery or PDF approval flags were enabled. Verified original user/blog/order/payment/entitlement counts and all previous order-item values were preserved. The initial remote transaction timed out and rolled back; retry with an explicit 60-second transaction timeout succeeded.
- Added local-development-only previews so the owner can inspect both draft listings/details/categories immediately. Production does not expose these local drafts. Development drafts are clearly labeled, non-purchasable and noindex on product/category pages.
- Owner explicitly requested real Razorpay payments. Existing live credentials passed a read-only Razorpay API authentication check with **HTTP 200**. No provider orders, payments or refunds were created.
- Added eBook-specific `EBOOK_PAYMENT_MODE=live` and owner approval in local environment; retained existing default test gateway keys/settings. INR was added to the existing currency allow-list without removing USD.
- Payment verification, reconciliation, provider refunds and receipts now respect each persisted order's test/live mode. Cross-mode verification is rejected. Live receipts/refund confirmations no longer claim that no real money moved. Live refunds require explicit LIVE confirmation.
- Added a separate raw-body signed `/api/commerce/webhook/live` path using `RAZORPAY_LIVE_WEBHOOK_SECRET`. Existing test webhook/configuration remains separate. API keys and webhook secrets are never printed or committed.
- Full regression run: **201 passed, 0 failed**; output in `test-results-owner-import-live.txt`. Type checking and focused lint completed without diagnostics. Includes live credential selection, mode-specific callback HMAC, cross-mode rejection, live receipt labeling, imported-draft metadata and production exclusion tests.

## Still required before accepting payment

1. Choose/configure private PDF storage. The existing Blob adapter is ready but its private token is absent. Both files together require only about 332 KB of file storage; Blob usage is separate from deployment assets. Do not copy paid PDFs into public assets.
2. Owner suggested Google Drive and supplied folder `1tvjl3Z01nllmb5143W_WPfqfM7qSEkEM`. Read-only access using the existing server service account returned **403 SERVICE_DISABLED / accessNotConfigured**: the Drive API is disabled for Google Cloud project `gen-lang-client-0544770816`. No Drive files or sharing settings were changed, and no Drive uploads were attempted. Drive delivery is not yet integrated or activated. If choosing Drive, enable that API, keep General access Restricted and share the folder with `ai-content-bot@gen-lang-client-0544770816.iam.gserviceaccount.com`. The website must serve files after authorization rather than expose public Drive links.
3. Configure/register the separate live webhook secret and HTTPS live endpoint in Razorpay, then verify webhook delivery. Live authentication success is not evidence that webhook registration works.
4. Import the actual private assets and review the final contents before publishing. **Mastery refers to a companion ZIP and four CSV files not provided in the source folder.** Its listing states PDF only and records that missing material; resolve the references or supply the original companion files before publication.
5. Verify a complete server-confirmed purchase, receipt, guest/account library and private PDF delivery. No real charge or end-to-end live purchase was attempted.

The original `scripts/import-owner-ebooks.ts` defaults to validation only. `--apply --catalog-only` safely saves disabled drafts. Full `--apply` uses the configured private Blob adapter, validates source hashes and refuses to overwrite an already published book. Historical file resources remain intact.

References reviewed: https://razorpay.com/docs/payments/dashboard/account-settings/api-keys/ and https://razorpay.com/docs/webhooks/validate-test/; Drive guidance: https://developers.google.com/workspace/drive/api/guides/manage-downloads ; Blob usage: https://vercel.com/docs/vercel-blob/usage-and-pricing .
