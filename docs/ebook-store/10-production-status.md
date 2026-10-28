# Production verification — 28 October 2026

Resumed the interrupted production 404 investigation from the previous chat.

## Verified

- Vercel deployment `dpl_8FmrPKcHJPH3y11peTMeVSNTZdi8` is READY, targets production and has `dattasable.com` and `www.dattasable.com` assigned without an alias error.
- Its source is main commit `e0d6d45443826b1e92bac1e1dcf5f7ebc35554d9`, matching the local HEAD at verification.
- A public HTTPS request to `https://dattasable.com/ebooks` returned HTTP 200 with title `Practical eBooks for Data, Analytics & Technology | Datta Sable`. This closes the interrupted route-availability check; it does not establish checkout readiness.
- The prior task enabled `EBOOK_STORE_ENABLED` in production and initiated this redeployment before hitting its usage limit.
- Private PDF attachment and public cover uploads were completed previously; see [private Blob and thumbnails](09-private-blob-and-thumbnails.md). The storage blockers in earlier reports are superseded.

## Remaining launch work

1. Configure and verify the separate live Razorpay webhook and its production secret. Previous live API authentication does not verify webhook delivery.
2. Resolve Mastery's references to a companion ZIP and four CSV files absent from the supplied source folder; obtain the files or revise the source PDF before final approval.
3. Review and approve the final content, then publish the intended books. The last recorded database state is DRAFT, unapproved and sales-disabled; this check did not change that state.
4. Verify a complete server-confirmed purchase, receipt, guest/account library and authorized private PDF download. No real charge was made during this check.

No production configuration, product publication or payment state was changed during this verification.
