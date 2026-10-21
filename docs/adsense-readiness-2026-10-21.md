# Content and workspace cleanup — 21 October 2026

Changes are in the local checkout. They must be deployed before Google sees them. This work reduces identifiable content and navigation problems; it does not certify policy compliance or guarantee AdSense approval. No Search Console removals, review submissions, account changes, or production deployments were performed.

## What was audited

- 285 public URL responses across the apex, Fabric, and Excel hosts, drawn from the submitted sitemap index, main/image sitemaps, the two subdomain sitemaps, static source routes, and one pass through knowledge/navigation links.
- All 106 `app/**/page.tsx` source paths, including private/admin and dynamic route definitions, plus 124 source-managed article and library entries. CMS overrides remain authoritative and may differ from the source fallback.
- Initial HTML status, title, canonical, robots metadata, approximate main-content words, headings, and repeated paragraphs. Forms, scripts, navigation, footers, and sidebars were excluded from text extraction where identifiable.
- Shared CSS cascade, workspace wrappers, knowledge-page actions, article correction pipeline, sitemap inclusion, and the existing article-only advertising gate.

The machine inventories are [live responses](audits/public-content-2026-10-21.json), [source entries](audits/source-content-2026-10-21.json), and [local verification](audits/local-readiness-2026-10-21.json). The live inventory describes production **before** this deployment. It is not a claim that every interactive control or every external-content originality question has been verified.

## Findings and disposition

| Finding | Action |
| --- | --- |
| Knowledge hub promoted two very short notes as substantial guides and mixed them with many unrelated destinations | Rebuilt around three task-based reading paths, expectations, practice steps, and clearly labelled short internal references |
| Context guide claimed abbreviations were always understood and guaranteed better reasoning | Replaced with an illustrative invoice-API task, protected constraints, evidence packet, baseline comparison, failure recovery, and explicit limits |
| Storytelling guide used sweeping authority claims and had little practical instruction | Added an evidence ledger, before/after example, tradeoffs, confidentiality checks, and publication checklist |
| Comparison page claimed fixed chains were categorically superior and advertised unavailable whitepapers | Replaced with a balanced decision table, worked invoice example, hybrid design, recovery/evaluation guidance, and real further-reading links |
| Seven short references lacked concrete application details | Added distinct worked examples, verification checklists, limitations, and relevant next steps |
| Template metadata assumed search value by default, leaving short entries indexable | All individual template entries now use `noindex, follow` and self-canonicals; the hub remains available |
| Featured templates promised tested CTR gains, used an unsupported churn statistic, or advertised schema while showing only meta text | Removed the claims, added evidence requirements, and supplied a real minimal SoftwareApplication JSON-LD vocabulary example with primary references and an appropriate related tool |
| Architecture/data-engineering reference directories inherited indexing | Added `noindex, follow`; retained visitor access |
| Three simulated dashboard showcases were still indexable | Added `noindex, follow`, corrected missing headings, and labelled generated demonstration values |
| Demo text claimed real Prisma/Redis pipelines, Power BI integrations, and measured performance that the embedded HTML did not establish | Replaced with descriptions of the actual local HTML demonstrations and practical validation examples |
| Repeated n8n benchmark claimed 250 workflows/second, lower latency, and 60% lower contention without supporting measurements | Exact-match editorial correction removes the three repeated stock paragraphs in source and matching CMS output; distinct future prose is preserved |
| Glossary and architecture examples asserted personal performance results without evidence | Replaced the identified percentages/outcomes with verification guidance and design-example labels |
| Utility crawl blocks prevented search crawlers from reading `noindex` | Removed `/tools` robots blocks; public page rules now remain readable to search and advertising crawlers |
| Global unlayered `* { margin: 0; padding: 0 }` overrode Tailwind v4 spacing | Moved reset into `@layer base`, restoring declared margins and padding |
| Workspace sections had inconsistent widths, gutters, typography, and decorative color accents | Added a shared theme-token wrapper to knowledge, glossary, tools/Open MIS, templates, chains, infrastructure, and Aura showcase; responsive gutters, readable headings, safe code overflow, and mobile sidebar treatment |
| Global `.card { position: relative }` displaced a sidebar carrying a sticky top offset | Restored explicit sticky positioning and top alignment, with static positioning on small screens |

The two expanded guides stay `noindex` during editorial review. Adding text does not automatically make a page worth indexing. The improved knowledge hub is indexable and now appears in the main sitemap. All excluded detail/reference/demo routes remain absent from the main sitemap. No public pages were deleted.

## How to interpret the counts

The live pass classified 158 pages for ordinary editorial review, 39 as already `noindex`, 16 as short initial-HTML review candidates, 66 as requiring JavaScript rendering review, and six as HTTP review candidates. These are workflow categories, not Google's quality ratings.

The 16 short candidates include contact, terms, cookies, navigation hubs, portfolio, certification, three demos, three templates, an unsubscribe screen, and a redirected certification alias. A concise contact or legal page serves a different purpose from a tutorial; it should not be padded simply to pass a word count. The unsubscribe screen now has `noindex, nofollow`.

The six 404s are retired recruitment routes and design previews, rather than sitemap destinations that need restoration. Keep intentionally removed pages returning genuine 404s. Do not redirect every retired URL to the homepage.

Repeated-paragraph matches include author biographies and related-article cards. Those are not automatically duplicate article bodies. The three identical automation paragraphs were inspected in their article context before removal. The scan is not a plagiarism or media-rights certification.

Some corrected source-fallback articles contain fewer than 300 extracted words but provide scoped worked examples and checks. They remain review candidates rather than being automatically removed based on length. Google's documentation does not prescribe the audit's 300-word triage value as an AdSense approval threshold.

## Separate subdomain work

All 51 Fabric and 15 Excel sitemap URLs returned HTTP 200 but no main text in the initial HTML extraction. The Fabric sample was confirmed to be a JavaScript application shell, not an HTTP error. This is **not proof that the rendered pages are empty or low value**. Google Search can render JavaScript, while initial HTML content is also useful for crawler accessibility.

These applications are not implemented in this checkout. Their content, styles, robots rules, and sitemaps were not changed. Before another approval request, inspect representative URLs using Search Console's live test and rendered HTML. Verify that each documentation/comparison page has topic-specific explanations, worked inputs/outputs, limitations, and working controls. Review the source projects separately; do not claim an apex-only code change fixes those hosts.

## Search Console and AdSense strategy

1. Deploy this checkout through the existing hosting workflow. Check the rendered production guides, theme colors, metadata, robots file, and sitemap after deployment.
2. Keep the useful workspace navigation. Removing links alone does not retire a URL or resolve content quality.
3. Let Google recrawl excluded pages and see their `noindex` directives. Do not simultaneously block those public URLs in robots.txt.
4. Avoid blanket Search Console Removals requests. That tool hides results for about six months and does not stop crawling or repair AdSense eligibility. Use it for a specific urgent removal need, not as a substitute for editorial work.
5. Keep ad serving off utility, reference, navigation, and simulated-demo pages. The existing loader permits ads only on published blog-detail routes when `NEXT_PUBLIC_ADSENSE_ENABLED=true`; this change does not enable advertising. Review placement and applicable consent configuration separately before enabling it.
6. Review originals, factual evidence, media/download rights, policy pages, account notices, and actual interactive behavior before requesting another AdSense review. No minimum word or article count guarantees acceptance.

## Verification and local environment

- Final full regression suite: 67 passed, zero failed, including the added exact-benchmark regression.
- TypeScript validation passed. Targeted ESLint completed with zero errors and existing unused-import warnings.
- An isolated Next.js production build completed successfully using `.next-audit`; it exercised the configured database-unavailable source fallback. The normal `npm run build` first encountered Windows `EPERM` because the running dev server held Prisma's engine DLL. No schema changed, so the existing generated client was used for the completed Next build.
- 26 local HTTP checks passed for response status, headings, robots metadata, advertising-script exclusion, crawler access, and sitemap inclusion/exclusion. These are not interactive or approval tests.
- Desktop browser inspection confirmed restored spacing and existing theme colors. Mobile rules were added for gutters, cards, buttons, and sticky sidebars; a complete device/browser matrix was not exercised.
- The original dev server ran with restricted network access. A check with normal access reached `db.prisma.io:5432`; the server was restarted with network access and a successful SystemSetting query was observed. The earlier failure should not be taken as evidence that the user's internet or database service was down.

## Official guidance

- [AdSense site readiness](https://support.google.com/adsense/answer/12176698?hl=en): valuable content, navigation, and crawler accessibility.
- [Ads on screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688?hl=en): no ads on low-value, unfinished, or behavioral screens.
- [Google's helpful-content questions](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): originality, completeness, evidence, and avoiding exaggerated headings.
- [Noindex and crawl accessibility](https://developers.google.com/search/docs/crawling-indexing/block-indexing): a crawler must access a page to read its directive.
- [Search Console Removals](https://support.google.com/webmasters/answer/9689846?hl=en): temporary search suppression, not a content-quality remedy.
- [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): distinguish initial HTML from rendered content.

This report supersedes earlier recommendations to block public `/tools` URLs. It does not change the historical audit records.

## Follow-up validation and subdomain implementation (21 October 2026)

The first main-site deployment was verified against production: 26 readiness checks passed. A broader initial-HTML audit inspected 280 distinct URLs across the main, image, Fabric, and Excel sitemaps; findings are recorded in `docs/audits/production-content-2026-10-21.json`. Short word counts are review signals, not Google's acceptance thresholds.

Follow-up changes are implemented in the three source repositories:

- Main: corrected exact legacy editorial passages about OneLake guarantees, hypothetical recovery examples, trial behavior, and Copilot eligibility. Contact submission now returns success only after durable database storage; optional audit-log failure does not invalidate a saved message. Database failure returns an actionable 503 instead of pretending a local fallback was delivered.
- Fabric: all 25 documentation URLs and original source bodies are retained. Twelve guides now include distinct practical exercises and official references; thirteen short references link to the relevant full guide, carry noindex, and are excluded from the sitemap. All 53 public routes (including references and policies) receive rendered HTML. Canonical URLs use the production host. Removed unsupported ratings and page-wide FAQ markup. Corrected Copilot/free-viewer licensing distinctions, pricing and performance guarantees, and an oversized-demand calculation that could wrap back to F2. Existing theme colors are retained.
- Excel: all 15 sitemap pages receive actual rendered application content. Added missing route headings; corrected simulated-data labels and unsupported cross-application compatibility promises. Removed automatic analytics loading until an appropriate consent implementation exists. Privacy text distinguishes local spreadsheet processing from hosting requests and support correspondence. Existing theme colors are retained.

Validation: main 71 automated tests and TypeScript passed; isolated Next production build passed using source fallbacks where the sandbox could not reach the database. Fabric production build, four readiness tests, and TypeScript passed. Excel production build, two readiness tests, TypeScript, and its existing suite (52 passed, one skipped) passed. Fabric guide spacing and Excel tool rendering were inspected in local browser previews. The first main-site production deployment passed 26 HTTP/metadata readiness checks. New subdomain deployments require a separate live check after push.

### AdSense account inspection

The signed-in account shows dattasable.com as Getting ready, ownership verified, review requested, and ads.txt Authorised. There is no rejection reason displayed. No new review request was submitted and no account settings were changed.

The European regulations message is published for **biexpert.online**, not dattasable.com. The account's "1 active" badge therefore does not establish consent coverage for this site. Configure and publish an appropriate message for dattasable.com before enabling advertising for visitors subject to Google's consent requirements. This is a consent/advertising readiness item, not evidence of a current rejection. Do not unpublish the existing site's message.

Remaining limitations: no approval can be guaranteed; no media-license or first-hand-experience certification is inferred from code review. Unknown SPA routes retain their pre-existing fallback behavior. No Search Console removals or blanket public AdSense crawler blocks were applied. Noindex controls Search indexing, not access by the AdSense crawler.

### Deployment verification

Pushed implementation commits: main `31f4884`, Fabric `f0cad35`, Excel `45601b6` (includes the static-rendering follow-up). GitHub's Vercel status reports successful deployments for all three. All 68 checked subdomain routes (53 Fabric, 15 Excel) now return HTTP 200, visible main text in initial HTML, primary headings, and canonical/robots metadata matching the built files. The live report is `docs/audits/subdomain-deployment-2026-10-21.json`; rerun with `node scripts/verify-subdomain-deployment.mjs` when the sibling source checkouts are present. The final Excel readiness suite has three passing tests, including a regression preventing hidden Suspense payloads from replacing visible page content. The main production readiness suite passes all 26 checks.

AdSense Policy centre was also inspected and displays "No current issues". This does not mean the pending site review is approved. Permission to create a separate consent message for dattasable.com was requested; account settings remain unchanged pending the user's answer.
