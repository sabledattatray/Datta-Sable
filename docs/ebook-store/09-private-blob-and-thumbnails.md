# Private Blob uploads, thumbnails and purchase controls

The existing `dattasable-products` store is verified private and connected to the `dattasable` project for Production/Preview with `COMMERCE_BLOB_*` variables. No token was rotated, revealed or committed.

Both owner-supplied PDFs were uploaded through the authorized Vercel dashboard into their product folders. Uploaded ETags match original PDF MD5 checksums; SHA-256, byte counts and filenames are registered in EbookAsset. Anonymous file requests returned HTTP 403 for both PDFs. Database attachment succeeded; books remain DRAFT, unapproved and sales-disabled, with deliveryReady=true. Existing orders/entitlements were preserved. Evidence is retained in ignored private storage.

Both first-page cover PNGs were uploaded separately to the existing PUBLIC media Blob store. Both image URLs returned HTTP 200 and matched the local originals by SHA-256. The database and import manifest now use those cover URLs. Full PDFs were never uploaded to the public store.

Book cards now show View book and Buy for INR 99, linking to the detail purchase panel. The purchase button remains visible on detail pages even while disabled for unapproved drafts, with a clear unavailable notice. This avoids silently hiding the purchase option without bypassing publication/payment validation.

Latest validation: previous full suite 201 passed; focused eBook suite 16 passed after thumbnail metadata changes; TypeScript checks had no diagnostics. Live checkout still requires final publication/content review and the live webhook configuration. Production deployment/publication was not performed automatically.
