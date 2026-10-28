# eBook store implementation report

**Latest status (28 October 2026):** [Premium guide release](11-premium-guide-release.md). Five original premium dark guides have been created, rendered and imported at ₹99 each, with approved private assets. The supplied Digital Marketing PDF is also imported as a separate upcoming title. See the release report for production verification; earlier phase reports describe historical implementation states.

Built inside the existing repository. **Not production-ready or live-enabled:** the configured database was unreachable, and an approved cover/PDF, private-store test, real test payment and mailbox verification remain required. Partial acceptance gates are explicitly recorded in [QA/release](07-qa-release.md).

## Report and evidence

1. [Repository audit / reuse / plan](00-audit.md)
2. [Schema, migration, permissions and rollback](01-schema-and-security.md)
3. [Storefront and responsive evidence](02-storefront.md)
4. [Admin workflow](03-admin.md)
5. [Razorpay setup and test/live controls](04-payments.md)
6. [Private PDF, guest access and retry behavior](05-delivery.md)
7. [SEO, analytics and existing policies](06-seo-analytics.md)
8. [Tests, acceptance matrix, release blockers and runbook](07-qa-release.md)

## Implemented files

| Paths | Purpose |
|---|---|
| `prisma/schema.prisma`, `prisma/migrations/20261026000100_ebook_store/migration.sql` | Additive profiles/categories/assets/tokens/grants/mail jobs and immutable purchased-file snapshot |
| `lib/ebooks/{validation,tokens,catalog,service,access,notifications}.ts` | Validation/seed, published-only queries, test readiness, guest identity/session and durable access email |
| `app/api/ebooks/[...path]/route.ts` | Admin CRUD/upload, guest verification, checkout, library, grants, downloads and worker |
| `app/ebooks/**`, `components/ebooks/**` | Editorial storefront/product, responsive CSS, reader flows, analytics and admin editor |
| `app/admin/ebooks/page.tsx`, `components/admin/navigation.ts` | Existing ADMIN shell integration |
| `lib/commerce/payments.ts`, `jobs.ts`, generic commerce API, Checkout.tsx | Shared guest-compatible orders, file snapshots, guest receipt links, eBook bypass protection and shared Checkout script loader |
| Navbar/Providers/root layout, middleware, analytics URL/optimizer/client wrapper | Gated nav, checkout CSP, private cache/referrer/noindex and telemetry protection |
| `app/sitemap.ts`, `vercel.json`, `.env.ebooks.example` | Published-only sitemap, authenticated daily worker fallback, non-secret setup template |
| `tests/ebooks.test.mjs` | 13 focused tests; combined repository suite: 195 passed, zero failed in recorded run |

Environment variable names and setup are in `.env.ebooks.example` (no credentials). Reuse existing verified Resend/SMTP settings. Never replace the existing currency allow-list wholesale when adding INR. No configured environment file, production credentials, published product, payment dashboard, email or database was modified.

Current local preview: `/ebooks`; admin studio: `/admin/ebooks`. Dev process has EBOOK_STORE_ENABLED=true; saved environment defaults are unchanged. The catalog correctly displays unavailable state without a reachable DB; it does not fabricate a product listing. Global nav remains behind its separate readiness gate.
