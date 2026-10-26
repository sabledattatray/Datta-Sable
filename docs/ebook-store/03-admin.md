# Phase 3 — admin workflow

Open `/admin/ebooks` using an existing verified ADMIN account. Every API read/mutation also checks ADMIN on the server. The existing admin sidebar links to eBook studio.

1. Apply the additive migration in staging, then click **Seed missing categories & draft handbook**. Upserts preserve existing products/categories and do not publish the book. This operation was not run against the configured DB here.
2. Create or edit a draft: title, stable slug, description, INR price in integer paise, categories, author/edition/pages/language/version, contents, outcomes, audience, prerequisites, excluded files, included resources, SEO, license and update policy.
3. Upload the actual cover through existing media tooling and paste its supported local/public-Blob URL. Never upload the paid PDF into the public media library.
4. Save metadata, then upload the final PDF through the separate private-PDF form. It validates filename, MIME, `%PDF-` header and 4 MB size ceiling, computes SHA-256 and stores private Blob bytes. Upload resets approval/sales/publication so the file must be reviewed again. Keep previous private versions for existing orders.
5. Reopen the editor, verify file checksum/contents/page count/cover/licensing, select approved, delivery ready and sales enabled. Select PUBLISHED and confirm publication. The server rejects missing cover, approval, private asset or version match. eBook checkout still refuses live Razorpay keys.
6. Archive through the status selector. Slugs are immutable to preserve existing URLs; automatic redirect-on-rename is therefore unnecessary. Category deletion fails if books reference it; reassign first. Category SEO title and description can also be edited.

Studio shows draft/published counts, test/flag state, access mail queue totals, book/category management, masked buyer contacts, resend and reason-required entitlement revocation. Saving publication/assets/access revocation writes transaction-bound audit records. Existing commerce admin provides actual order/payment/refund/revenue/email/webhook screens; these are not duplicated. The generic product/upload APIs reject edits to registered eBooks, preventing bypass of eBook file approval.

Remaining QA: authenticated full editor/upload/publish/refund workflow with real private storage. No delegated staff roles, advanced date-filtered eBook-only revenue dashboard, full settings editor or download-history UI is claimed complete.

