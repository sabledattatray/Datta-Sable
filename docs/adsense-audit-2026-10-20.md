# AdSense audit — 20 October 2026

Project: D:\Datta Sable\dattasable. Public site: https://dattasable.com.
Status: local fixes prepared; production deployment and account checks remain. Approval cannot be guaranteed. The user reports eight low-value-content rejections and a new review in progress; the exact historical rejection message was unavailable.

## Completion update

The follow-up fixes replace 37 known problematic article bodies with topic-specific, disclosed fictional examples. This covers all 23 generic duplicate articles, ten unsupported-outcome articles and four additional duplicated or mismatched guides. Original CMS records remain intact; replacements apply only to known original title/content hashes. See [revision inventory](adsense-editorial-revisions-2026-10-20.md). A scan of the 122 published records through the corrected pipeline found no repeated prose paragraph of the reviewed length across five or more articles, no missing local article images, and no article pair above the configured 70% smaller-body five-word overlap threshold after excluding code and disclosure. This is a scoped similarity check, not certification of external originality.

Homepage testimonials and unsupported promotional figures were removed. Portfolio dashboards are labelled demonstrations, with validation questions replacing asserted customer outcomes. The legacy bulk generator is disabled. The opaque GTM container was removed; Google consent defaults deny analytics and advertising storage/signals, with only analytics granted after opt-in. This does not replace a certified advertising CMP.

## Assessment

The strongest verified quality concern is repeated content, not an absence of article text. A read-only check found 122 published CMS articles. Two identical generic paragraphs occur in 59 articles; an identical claim of 55% lower latency and 40% CPU occurs in 26. A DP-600 study-companion page contains the SQL Server columnstore article. These findings could contribute to a low-value assessment; they do not establish Google's actual reason.

Google asks for useful, original content and a usable site. Adding bulk text, a particular article count, or a particular word count is not a substitute for that assessment. The previous Fix_adsense.md includes unofficial numeric targets and unsupported assumptions about commercial sites; do not treat those as Google requirements. See [Google's site-readiness guidance](https://support.google.com/adsense/answer/12176698?hl=en).

## What was checked

- All 156 URLs in the live main sitemap, plus policy and infrastructure endpoints: 164 initial HTTP checks, including one deliberate nonexistent control URL.
- 36 additional public navigation destinations. Eight returned 404; the deliberate control also returned a genuine 404.
- 122 public article pages returned 200 and contained article text in initial HTML. The smallest extracted article had 543 words; the largest had 16,700. These are measurements, not quality or approval scores.
- Live robots.txt, ads.txt, main/image/news sitemaps, canonicals, public policy pages, article/catalog publication logic, middleware/CSP, cookie controls, analytics initialization, homepage promotion labels and project build behavior.
- Read-only CMS article metadata/content analysis. No database records, publication states, accounts, campaigns or email queues were modified.
- Apex HTTP redirected to HTTPS. The www hostname failed certificate validation: ERR_TLS_CERT_ALTNAME_INVALID, certificate valid for dattasable.com but not www.dattasable.com.

## Implemented locally

| Area | Verified problem | Correction |
| --- | --- | --- |
| Crawler access | Public sections deliberately blocked for advertising crawlers; crawler-specific groups inconsistent | One shared rule group permits public content for general/search/ad crawlers and retains private-route exclusions |
| Indexing exclusions | robots blocking prevented discovery of existing noindex directives | Public utility URLs remain crawlable; existing page metadata controls search indexing |
| Main sitemap | Dead code, invented baseline modification dates, omitted editorial policy | Request-time generated authoritative article list, deduplicated URLs, real valid nonfuture article dates, editorial policy included; build-time DB fallback cannot freeze the sitemap |
| Image/news sitemaps | Static merging could revive drafts and stale versions | Use the same authoritative published catalog as public pages |
| Image XML | Raw image query parameters could break XML | Escape XML and reject non-HTTP image schemes |
| News | 30-day window and updatedAt treated as publication date; tutorials presented as news | Only explicit News category, original publication time within two days; removed news sitemap from index |
| Canonicals | Dashboard index, rider-ops and dynamic Excel showcase pages lacked canonicals | Added explicit canonical metadata |
| Missing pages | Current source redirected missing URLs to the homepage | Render a real not-found page; verify direct HTTP 404 without following a redirect |
| Broken links | Eight public linked destinations returned 404 | Six equivalent article aliases receive permanent redirects and direct content-link correction; nonexistent calculator/hub references become accurately labelled existing resources |
| Article quality | Seven reviewed stock paragraphs repeated widely, including a repeated unsupported benchmark | Remove those exact paragraphs and apply the documented article-specific revisions in the public content pipeline, with empty matching headings/TOC entries removed; original CMS records retained |
| Wrong article | DP-600 study-companion contains columnstore article | Public pipeline substitutes an original fictional Fabric practice exercise only while the known wrong-topic marker remains |
| Misleading freshness | Fixed Updated Today/Yesterday labels; mismatched link titles | Recent guides use real article titles, links and dates |
| False counts | Hard-coded series counts and weekly update claims | Neutral learning-path labels |
| Analytics | Decline merely saved a flag; trackers still loaded; audit/bot-specific script behavior | Optional analytics and first-party visit tracking load only after affirmative consent; footer reopens preferences; withdrawal reloads page |
| Privacy | Implied consent from browsing; advertising represented as active during application; stale CMS override | Source-managed disclosure describes actual controls, application status and third-party identifiers |
| Editorial disclosure | Unverifiable promises that every sentence, code sample and client claim was tested | Honest standards distinguish examples, AI assistance, measured evidence, client claims and corrections |
| Ads | Global ad runtime on private/utility/error pages; missing nonce | Account meta tag and ads.txt retain ownership verification. Ad serving defaults off; explicit flag enables nonce-bearing loader only on an actual published blog article |
| Build reliability | Parallel generation exhausted hosted DB connection limit | Single worker/page concurrency and React request-scoped query deduplication; no unnecessary article query in root layout when ads are disabled |

Robots rules do not create value or exempt public pages from AdSense assessment. Search noindex is also not an exemption from publisher policies. [Google robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro) explains that crawling and indexing are different mechanisms. The old update-robots script is now harmless and cannot reintroduce review-hiding blocks.

## Remaining actions before treating the site as ready

1. **Deploy and verify.** These source changes do not alter the currently reviewed live site until deployed. Recheck robots, account meta tag, sitemap XML, representative article text, redirects and cookie choices after deployment. Do not submit another review merely because local checks pass.
2. **Maintain article-specific editorial review.** The identified duplicate and unsupported-outcome clusters have now been rewritten locally (37 revisions). Before adding new material, verify facts/code and retain evidence for numerical or customer claims. The original inventory records historical findings; it is not the current public replacement text.
3. **Maintain evidence and provenance.** Unsupported article outcomes and homepage promotional figures have been replaced or removed; dashboard showcases explicitly describe demonstrations. Confirm underlying media/workbook rights and authorship. No external licenses or private client records were available to certify.
4. **Configure Google-certified advertising consent.** The new analytics banner is not a certified advertising CMP. Verify/publish an appropriate message in AdSense Privacy & messaging (or another Google-certified CMP) for EEA, UK and Switzerland, and assess other applicable visitor-region settings. The uninspected GTM container has been removed from this application. [Google CMP requirement](https://support.google.com/adsense/answer/13554116?hl=en).
5. **Repair www TLS at the hosting/domain provider.** Add www.dattasable.com to the site's domain/certificate configuration, then redirect it permanently to the apex HTTPS domain. DNS/TLS cannot be corrected by a Next.js route because certificate validation happens first. The apex was accessible; this finding does not prove it caused rejection.
6. **Check the AdSense account itself.** Confirm exact site hostname, ownership verification, publisher ID, review status and Policy center. The account was not connected. [Supported ownership methods](https://support.google.com/adsense/answer/7584263?hl=en-GB) include ads.txt and the account meta tag. Do not remove/re-add the site or interrupt the pending review just to apply code changes.
7. **Check Search Console and hosting controls.** Verify live URL inspection, the submitted sitemap, indexing exclusions, crawler logs and CDN/WAF behavior. Public HTTP requests cannot prove that verified Google crawler IPs receive the same responses or show historical Google crawl failures.
8. **Maintain policy compliance beyond this code audit.** Verify content/media rights, no deceptive/download bait, no invalid-traffic schemes, no ad-click encouragement and appropriate ad placement once enabled. Account traffic history, media licenses and every external fact were not independently verified. [AdSense program policies](https://support.google.com/adsense/answer/48182?hl=en).

## Ad-serving configuration

During review, leave NEXT_PUBLIC_ADSENSE_ENABLED unset or false. The account meta tag is ca-pub-4242010382827250 and public/ads.txt already contains pub-4242010382827250. These matched existing project/live identifiers; ownership must be confirmed in your account.

After approval and consent setup, set NEXT_PUBLIC_ADSENSE_ENABLED=true in the hosting build environment and redeploy. Next.js public environment values are embedded at build time. The loader is limited to real published article routes. Configure Auto ads/page exclusions and verify placement behavior in the account; the flag alone does not prove CMP or policy compliance. No active manual AdSense/SmartAdSense component usages were found in the current source.

Analytics choices use analytics-consent-v2; old cookie-consent flags are intentionally not carried forward because the old banner did not enforce them. Rejection keeps optional analytics off. Browser storage can retain previously placed cookies; users can clear them in browser settings. Policies now disclose this.

Privacy, cookie and editorial policy pages now use source-controlled text so stale CMS copies cannot silently override the controls. Maintain these policies through source changes or deliberately redesign their CMS workflow later.

## Validation

- Full test suite: **41 passed, 0 failed**.
- Final production build: **passed** on Next.js 15.5.28; existing lint warnings remain.
- Final production HTTP checks: **44 passed**, including all 37 revised article routes, homepage, workbook disclosures, policies, robots, sitemap inclusion, permanent alias and real 404. A further **24 infrastructure HTTP/HTML checks passed**, including ownership identifiers, tracker absence, canonicals and XML sitemaps. These sets overlap; they are not 68 unique URLs.
- Additional infrastructure checks and browser observations from the initial audit are retained in the original work log; they are not a claim of account access or live deployment.
- No changes were pushed or deployed. Google account, Search Console, hosting domain settings, media licenses, private claim evidence and traffic history were not independently verified.

See [release and account checklist](adsense-release-2026-10-20.md) for the remaining external steps.

## Final verification follow-up

The earlier Prisma connection failure did not recur: a fresh read-only query returned all 122 published articles, and both production HTTP suites passed against the real CMS connection. No credential or database mutation was needed. The root cause of the earlier outage was not established; ongoing database availability remains an operational dependency. Browser verification confirmed the revised SQL guide, reopening preferences and rejecting analytics. The preview was stopped after checks.

The user added www.dattasable.com in Vercel. A fresh public HTTPS request now validates its certificate and redirects to https://dattasable.com/. The earlier www certificate repair is complete. Source changes remain local; deployment and Google account/CMP/Search Console checks require authenticated access.

## Subsequent tools and thin-page review

At the owner’s request, /tools now has explicit crawl exclusions. This supersedes the earlier public-tool crawl setting above. A separate 242-URL review led to targeted noindex metadata, a services overview rewrite and removal of an advertised placeholder download. See [follow-up findings and verification](adsense-thin-pages-2026-10-20.md). Robots blocking and noindex are not AdSense policy exemptions.
