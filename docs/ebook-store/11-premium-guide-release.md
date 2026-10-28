# Premium guide release — 28 October 2026

## Requested outcome

Fix the live empty eBook collection, add the supplied Digital Marketing PDF, and create five original, informative guides with a premium dark design for direct sale. The five new guides use the existing INR 99 price point.

## New books

| Title | Pages | Practical material |
|---|---:|---|
| SQL for Business Analytics | 15 | Complete miniature PostgreSQL dataset, joins, aggregation, windows, quality checks and reconciled monthly report |
| Advanced Excel & MIS Reporting | 14 | Six-row workbook dataset, formulas, mappings, quality controls, Power Query process, PivotTables and handoff |
| Python Automation for Analysts | 15 | Complete standard-library CSV reporting script, validation, Decimal arithmetic, atomic output and failure tests |
| Microsoft Fabric Foundations | 14 | Northstar architecture case, batch contracts, dimensional model, semantic measures, security and operating review |
| AI Productivity for Professionals | 14 | Evidence-based prompts, meeting/action cases, calculation checks, claim ledger, evaluation rubric and weekly-brief capstone |

All five contain original examples, exercises, answer notes, references, a contents page and readable dark pages with distinct accent colours. There are 72 pages and about 15,000 words across the collection. Listings state the actual page counts and PDF-only scope. No separate datasets, editable files, certificates or software licences are promised.

Authoring sources, full PDFs, backups and upload evidence remain in ignored private directories. Only first-page cover PNGs and public listing metadata belong in Git/deployment sources. `output/pdf/` is excluded from Git and deployment uploads; `storage/` and `scratch/` remain excluded.

## Existing and supplied titles

The supplied *The Complete Digital Marketing Playbook* has 152 actual pages, despite the 150-page filename. Its cover, category and INR 99 draft listing were added; its PDF is attached privately with delivery ready. Both original Power BI books retain their review state. The three explicitly selected upcoming titles can be discovered publicly, but cannot be purchased while draft. Arbitrary drafts, archived books and review-only titles remain excluded.

## Payment configuration

The existing live Razorpay account has an active webhook at `/api/commerce/webhook` for captured payments, failed payments and processed refunds. Production's live credential selection passed the existing live-route configuration check; the separate live-route secret is absent. The eBook module now permits explicit reuse of the existing generic endpoint only when `EBOOK_USE_ACTIVE_LIVE_WEBHOOK=true`, the active key is live and its webhook secret is configured. Test credentials cannot satisfy this path. The separate live webhook remains supported.

The owner explicitly requested direct sale of the five new guides. Production has `EBOOK_PAYMENT_MODE=live`, `EBOOK_LIVE_CHECKOUT_APPROVED=true`, `EBOOK_USE_ACTIVE_LIVE_WEBHOOK=true` and `EBOOK_STORE_NAV_ENABLED=true`. A cryptographically random server-only `EBOOK_ACCESS_SECRET` was configured for guest email access; supported currencies include both USD and INR. Per-book publication, approval and delivery flags, private assets, provider/email/policy configuration and server-side payment verification still apply. The purchase UI now checks shared checkout and guest-access configuration before displaying an available checkout.

## Validation evidence

- All 72 PDF pages rendered; contact sheets and representative full pages inspected. Corrected encoded operators and escaped-newline display issues before final upload.
- Every Python example passes syntax checks. The complete program returned 1,441.00 for the five-row sample. Duplicate ID, negative amount, NaN, excess precision, invalid headers and extra-column inputs all failed while preserving the previous output.
- Every complete SQL block executed in PGlite/PostgreSQL, including the setup, window functions, checks and final report. Expected totals: 630 revenue, 4 paid orders, 157.50 AOV; monthly totals 480 and 150.
- Full repository regression run: 203 passed, zero failed. TypeScript and focused lint passed.
- Uploaded ETags match the final PDFs' MD5 values. SHA-256, byte counts and page counts are recorded in the import manifest and private asset records. Anonymous requests returned HTTP 403 for each private PDF.
- The localhost products error was caused by the restricted server process being unable to reach the database. Restarting the dev server with network access restored real catalog reads; `/products` returned HTTP 200 without the catalog-error message.

No real payment was charged during preparation. A completed real customer purchase and receipt delivery are distinct from configuration, regression and file-integrity checks.

## Production verification

- Application deployment `dpl_GTRg8StnbDBJnpusRDhzXqyfir5W` (commit `16579385d108ce536177fa7e82d9793eb47b5ccb`) reached READY with both public domains assigned and no alias error.
- Published exactly the five new original guides at INR 99 with approved, version-matched private resources, delivery ready and sales enabled. They are featured; the existing three upcoming titles retain disabled draft status. Publication and file approval have transaction-bound audit entries and a private pre-release backup.
- All five public product URLs returned HTTP 200 with `available=true`, the live Razorpay notice and no upcoming-book notice.
- The browser displayed eight books: five with Buy for INR 99 links, three with Coming soon. The SQL purchase panel displayed live payment copy, the policy checkbox and guest-access/library link. No policy acceptance or real purchase was performed.
- Live evidence: [catalog](screenshots/premium-live-catalog.jpg), [SQL product page](screenshots/premium-live-sql.jpg).
- The final SQL PDF also checks NULL quantities explicitly; its SQL check was executed with an invalid NULL row and caught the defect. The final uploaded resource replaced the unpublished earlier resource; the earlier resource remains inactive for recovery.

The release's paid PDFs remain private. These checks establish publication, file integrity, configuration and UI availability; they do not claim a completed real charge, receipt-inbox verification or a real buyer's completed download.
