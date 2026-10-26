# Phase 6 — SEO, analytics and policies

Published catalog/category/product content is server rendered. Product metadata uses a stable canonical, actual cover for Open Graph/Twitter when supplied, Book/Product and breadcrumb JSON-LD escaped against script injection. No fabricated reviews. Search/filter duplicates are noindex with catalog canonical. The main sitemap includes enabled published eBooks and nonempty active categories only; draft, library, access, checkout, order and download paths are excluded. Slugs cannot be changed through either admin API.

Existing consent-gated analytics infrastructure is preserved; test checkout produces no real purchase analytics. Private eBook paths are excluded from visit analytics and Google initialization; issued bearer tokens use fragments and POST bodies. Existing global tags might already have loaded on prior public pages; bearer tokens are therefore never issued in tracked route paths. Public eBook list, select and detail views use the existing consent-gated analytics functions. Test checkouts do not emit real purchase events. Dedicated download/refund events and durable server-side purchase-event deduplication remain a release gap. Do not claim exactly-once GA delivery from browser storage.

Policies link to existing `/terms`, `/privacy`, `/refund-policy`, `/delivery-policy` and `/contact` to avoid conflicting copies. Existing author/seller identity is reused. No GST/tax-invoice assertion was added. Qualified owner review of tax treatment, licensing, seller contact and refund rules is still required. Existing receipts explicitly say payment receipt, not tax invoice.

Product promotion URL: `https://dattasable.com/ebooks/power-bi-real-world-projects-2026?utm_source=linkedin&utm_medium=social&utm_campaign=powerbi_ebook_launch` after approved publication. Never promote the private Blob URL. No LinkedIn message was sent or published. Social preview validation awaits the actual cover and deployed staging product.

