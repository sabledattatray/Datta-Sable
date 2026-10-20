# Public career campaign removal — 20 October 2026

The owner requested removal of all public recruitment campaigns. The following previously accessible routes now return genuine 404 responses after deployment:

- https://dattasable.com/careers
- https://dattasable.com/careers/collection-officer-mumbai
- https://dattasable.com/careers/collection-team-leader-mumbai
- https://dattasable.com/hiring
- https://dattasable.com/p/careers

Removed public navigation and HTML-sitemap links and the hiring redirect. The XML sitemap already excluded these URLs. The CMS alias is rejected before its database lookup and excluded from static params. Recruitment structured data and forms are no longer rendered by these pages. Existing CMS records, jobs, applicants, admin tools and API implementations are preserved; no database mutations or notifications were performed. Unreferenced source components remain recoverable in the repository.

Do not add a robots.txt block for these URLs: crawlers need to observe their 404 responses. In Search Console, use Removals > New request for the exact URLs above, or prefix removal for https://dattasable.com/careers (covering the three career URLs) plus exact requests for /hiring and /p/careers. Search Console removals are temporary; the actual 404 responses maintain withdrawal over time. See [Google removal guidance](https://developers.google.com/search/docs/crawling-indexing/remove-information).

Validation: production build passed. All 11 production HTTP/HTML checks passed, covering all five campaign routes, two query variants, navigation/HTML-sitemap link removal, XML sitemap exclusion and crawler access to the removed URLs. No forms or JobPosting metadata appeared on retired pages.
