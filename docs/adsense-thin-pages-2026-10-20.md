# Additional public-page review — 20 October 2026

Checked 242 deployed URLs (main sitemap, public source routes and one round of non-article navigation links); all returned HTTP 200. Extracted initial HTML without scripts, styles, navigation, header or footer. Client-rendered controls, iframe content and headings inside header elements can be missed by this extraction. Word counts below are triage observations, not Google approval thresholds. No account or content database records were changed.

## Changes

- Added exact /tools$ and /tools/ crawl exclusions for all crawler groups at the owner's request. Retained existing noindex metadata and sitemap exclusions. This blocks crawling, not policy assessment or guaranteed indexing removal. Google cannot read noindex on a blocked URL. Do not use this as a temporary approval-hiding tactic.
- Kept brief internal knowledge references crawlable, but marked nine static reference routes and the two short dynamic notes noindex, follow. They need topic-specific evidence and examples before being promoted as standalone search articles. These routes were already absent from the sitemap; they remain available to visitors.
- Marked the synthetic-data utility, live analytics shell and four dashboard demos noindex, follow. Their purpose is interaction or demonstration; the initial HTML was sparse. This is search hygiene, not an AdSense policy exemption. No advertisements are served on these utility routes by the configured article-only loader.
- Replaced the 56-word CMS services overview with a source-managed overview explaining service scope, validation and handover; CMS content was preserved. No invented business results or client metrics were added.
- Replaced two simulated PDF download alerts with an accurately labelled browser print action, and removed unsupported percentages from the patterns/standards references.

## Short internal references identified

| Route | Extracted words before changes |
| --- | ---: |
| /knowledge/comparisons | 141 |
| /knowledge/protocols | 151 |
| /knowledge/rfc/001-prompt-hardening | 205 |
| /knowledge/patterns | 143 |
| /knowledge/rfc/003-intent-mapping | 159 |
| /knowledge/rfc | 100 |
| /knowledge/rfc/002-execution-chains | 143 |
| /knowledge/standards | 204 |
| /knowledge/taxonomy | 186 |

The dynamic knowledge notes contain only short authored bodies surrounded by related links. Noindex is editorial triage; it does not itself improve their content. The broader architecture/data-engineering references and template library still need ongoing factual, originality and download-rights review. A scan is not a license or evidence certification.

## Short pages retained

Contact (78 words) offers a contact form. Cookie and terms pages provide supporting disclosures; Start Here is a navigation guide. They were not labelled low-value merely for being short. Two career URLs render the same recruitment campaign (243 words each): verify the campaign is current and differentiate or consolidate the job-specific details; this review did not invent job terms or change the application flow. Dashboard word counts do not establish that the actual interactive application lacks value.

Most tools had 267–1,303 extracted words plus UI controls; /tools/demo was the 41-word simulation outlier. A working tool can be useful without article-length text. No claim of full interactive tool testing is made here.

## Sources and deployment

[Google crawler access](https://support.google.com/adsense/answer/2381908?hl=en), [Google noindex and robots interaction](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Next.js 15 metadata](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata).

These follow-up changes need deployment before the live crawl rules and metadata change. This report supplements, rather than replaces, the earlier live verification.

## Download integrity finding

The advertised financial-blueprint.pbit file was only 64 bytes and contained “Power BI Template Placeholder”, despite a 4.86 MB listing. Removed that download card; did not fabricate a workbook. The two remaining downloadable examples exist, their displayed sizes now match their actual bytes, and their descriptions make configuration/testing requirements clear without unsupported performance promises. The internal RFC print/copy buttons now perform the labelled actions. Original files are preserved.

## Verification

Production build passed on Next.js 15.5.28. Existing regression suite: 41 passed, 0 failed. Follow-up production HTTP/HTML checks: 24 passed, covering tools robots rules, all 17 newly noindex routes, existing tools noindex, services content, template download links, sitemap exclusion and a revised indexable article. Existing lint warnings remain.

## Career follow-up

The owner subsequently requested withdrawal of all recruitment campaigns. The two duplicate job pages, careers hub and aliases are now retired in source. See [campaign removal](career-campaign-removal-2026-10-20.md) for the exact URLs and validation. This resolves the earlier recommendation to differentiate or consolidate those campaign pages.
