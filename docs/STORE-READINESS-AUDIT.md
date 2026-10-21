# Store readiness audit — 22 October 2026

The complete Production Readiness PRD was read before implementation. This report describes repository evidence, not inferred behaviour from screenshots.

| Area | Initial status | Evidence / action |
| --- | --- | --- |
| Architecture | Implemented | Next 15.5.28 App Router, React 19, strict TypeScript, Prisma 5.22/PostgreSQL, CSS modules/Tailwind 4, existing theme tokens. Installed Next docs are absent; official version-15 documentation was consulted. |
| Catalog | Partially implemented | Existing client search/category/technology/sort, but duplicate matching logic, clickable empty categories, no URL state or availability filter; database errors look like empty results. |
| Product accuracy | Defective | Static `PRODUCT_EXTRAS` fabricates included notebooks, course outcomes, version and future updates for the dummy ZIP; cards claim instant access. Remove unverified extras, preserve price and URL, explicitly distinguish test delivery. |
| Product metadata | Partially implemented | Existing product tables cover core fields; reuse SystemSetting for validated per-product editorial details/readiness rather than migrate the live schema or add competing tables. Default safely to TEST_ONLY. |
| Payments | Implemented / provider acceptance partial | Authoritative pricing, canonical provider fetch, HMAC checks, transactionally unique entitlement/outbox creation, replay protection and monotonic refund handling exist. Test keys only; no live activation. Existing tests cover financial paths. |
| Private downloads | Partially implemented | Owner + paid order + entitlement + active resource + delivery checks, two-minute signed URLs and logs exist. Add database-backed per-user rate limits and uniform private/no-store responses. Real private download and expiry need configured staging acceptance tests. |
| Authentication | Implemented | NextAuth JWT/OAuth/credentials; fresh DB verification and role checks for commerce. Review preserves existing login and admin architecture. |
| Admin | Partially implemented | Existing product/files/orders/payment/refund/email tools. Add explicit commercial readiness, validated editorial metadata and actionable setup diagnostics. Preserve archive buyer access. |
| Email | Partially implemented | Existing Resend/SMTP durable outbox with leases and uncertainty handling. Add idempotent refund confirmation, use orders support address. Inbox delivery cannot be inferred from provider acceptance. |
| SEO | Defective / partial | Published dummy included in sitemap, no test-product noindex, unescaped inline JSON, incomplete OG imagery/breadcrumbs. Keep indexable genuine products only; no invented offers/ratings. |
| Analytics | Defective | Existing GA4 installation and consent controls; commerce helper ignores consent, begin_checkout unused, purchase/refund absent. Reuse installation; allowlist parameters, consent gating, verified transaction tracking and test-traffic suppression. |
| UX/accessibility | Partial | Existing brand preserved. Unsupported modal samples, no focus management, some 320px overflow risks and non-native category buttons. Remove fabricated samples, use actual preview only, responsive/focus/reduced-motion fixes. |
| Accounts | Partial | Owner-filtered order/library routes exist; improve dates, delivery state, file availability, metadata and support, safe error/empty states. |
| Deployment | Not verifiable here | Vercel Hobby, daily cron + event/visit recovery. No infrastructure, live secret, DNS or provider-account changes authorized by this PRD. Commercial hosting and Razorpay approval remain external go-live gates. |

## Execution phases

1. Correct product truthfulness and test/live safety; preserve the $49 price and existing slug.
2. Unify catalog/readiness metadata and validated admin controls without live database migration.
3. Refine the existing storefront, account UX, accessible interactions and safe failure states.
4. Correct metadata, sitemap and consent-aware ecommerce telemetry.
5. Extend meaningful security/integration tests; type/lint/build and visual checks at the six PRD widths.
6. Record passed/unexecuted checks, deployment and rollback instructions. No production writes, deployment or account changes during this work.
