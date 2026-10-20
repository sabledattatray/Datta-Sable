# Release and account checks — 20 October 2026

These changes are local. They do not affect the site under Google's current review until deployed. Approval remains Google's decision; robots and sitemaps cannot compensate for low-value content.

## Deploy through Vercel

1. Review the source diff and revision inventory, deploy this checkout through the existing Vercel project, and confirm its production domain serves the new article titles and disclosures. This session has no authenticated Vercel connection or linked project configuration. No deployment has been attempted.
2. Keep NEXT_PUBLIC_ADSENSE_ENABLED unset or false while advertising consent and placement are unverified. Existing account metadata and ads.txt remain available for ownership checks. Confirm the publisher identifier in your AdSense account.
3. Check robots.txt, sitemap.xml, image-sitemap.xml, news-sitemap.xml, policy pages, redirects and a genuinely missing URL on production. Confirm draft/private pages remain excluded.

## www HTTPS — verified repaired

The live www hostname failed certificate hostname validation, while the apex worked. In the existing Vercel project, add both dattasable.com and www.dattasable.com under Domains. At your domain provider use the exact DNS values Vercel recommends for that project; do not guess an IP or CNAME. Preserve mail-related MX, SPF, DKIM and DMARC records. Wait for domain and certificate validation, then configure www to redirect permanently to https://dattasable.com. Test HTTPS directly on both names. An application redirect cannot repair a certificate mismatch before TLS negotiation.

See [Vercel domain instructions](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## AdSense and Search Console

- In AdSense, confirm site hostname, ownership, review status and Policy center details. Preserve the pending review; do not remove and re-add the site just because code changed.
- In Privacy & messaging, configure and publish an appropriate Google-certified CMP message for applicable regions before enabling advertising. This project's optional analytics banner is not a certified ad CMP. See [Google's CMP requirement](https://support.google.com/adsense/answer/13554116?hl=en).
- In Search Console inspect the live homepage and representative revised articles, confirm the submitted sitemap and review indexing/crawl errors. Inspect hosting access controls and logs for crawler failures.
- Review content/media rights and traffic quality. Do not encourage ad clicks or promise approval. Retain actual evidence before publishing measured outcomes.

## Editorial maintenance

37 revisions are source-controlled and guarded by original title and content hash. Future CMS edits bypass these replacements, so verify the rendered page after editing. CMS drafts/publication flags remain authoritative. Avoid restoring the historical generic body or bulk template. The dated original content inventory is retained as audit history.

Final verification: www now validates its HTTPS certificate and redirects to the apex. The real-CMS page checks passed after connectivity recovered. Production deployment and account checks remain external prerequisites.
