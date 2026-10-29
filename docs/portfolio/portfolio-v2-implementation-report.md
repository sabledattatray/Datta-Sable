# Portfolio v2 — implementation and review report

Reviewed: 29 October 2026. Target: `/portfolio`.

## Result and review status

Implementation and validation completed locally. A feature branch (`codex/portfolio-v2`) had already been created under the original PRD before the user instructed that no further branches or pushes should occur. No further branch was created. The user subsequently authorized pushing the dashboard and portfolio updates to main, superseding the original pull-request delivery workflow.

The existing dashboard edits from the preceding task remain separate working-tree changes. They were not part of the portfolio redesign and must not accidentally be included in a portfolio-only commit.

## Audit and architecture

- Reviewed the website README, public-page redesign report, README audit/architecture notes, shared image/dialog components, portfolio metadata, data definitions, filtering, enquiry flow, sitemap and existing tests.
- Captured the live portfolio at desktop and mobile before implementation (`before-desktop.webp`, `before-mobile.png`).
- The original library has 19 records with nonconsecutive IDs. The three detailed legacy studies were dialogs, with no dedicated case-study URLs to preserve.
- Extended `app/portfolio/data.ts` instead of creating another project catalog. The same five typed flagship records power featured cards, library filters, dedicated case-study pages, metadata and sitemap entries.
- Server-rendered hero and featured components are passed through the existing client page as React slots. Existing stateful search, category/tool filtering, dialogs, pagination and enquiry handling remain in that client boundary.
- The package's requested `node_modules/next/dist/docs` directory is absent. Used the official Next.js 15 dynamic-route and metadata guides instead. Dynamic case-study params are awaited, and five routes are statically generated.

## Design changes and user refinements

- Homepage-style opening, retaining site typography, dark surfaces and signature lime branding with restrained cyan accents.
- Replaced the repeated hero screenshot with an editorial evidence index.
- Fabric Master is the wide flagship, followed by two balanced rows containing the other four projects.
- The default library contains the 19 established projects, rather than duplicating all five flagships below their featured section. Selecting Featured intentionally filters to those five.
- Removed the repeated standalone legacy-study cards. Their full dialogs remain accessible from matching library cards; Sales Pipeline was exercised in browser verification.
- Removed decorative count/experience strips from this opening.
- After user review, changed narrow thumbnail wells to full-width image frames. Screenshots fill a consistent 16:10 frame with top-centered cover positioning; original images remain available in case-study galleries and source links.
- Library previews also fill their cards. Desktop library uses three columns, tablet two, and mobile one. Supporting text and CTAs remain available without hover.
- Explicit statuses distinguish live tools, a local production-style project, an incomplete report-authoring project, and dashboard design references.
- No checkout, payment, authentication or publishing behavior was changed. A pre-existing certification-page anchor to `/portfolio` was changed to Next.js `Link` to resolve full-repository lint and retain the internal portfolio link.

## Project evidence and limitations

### Fabric Master

Live v4.0 homepage displays 11 tiers and 25 guides. Captured homepage, workspace, capacity wizard, architecture planner and cost calculator. README is older than the live platform; package source confirms React, TypeScript, Vite and Express. The suggested eight-tool count was not repeated because current navigation is broader. Estimates are independent planning guidance, not official Microsoft sizing or guarantees.

### Excel Dashboard Generator

Captured public homepage, Executive Overview using its built-in sample model, and the 32-template selector. Public interface exposes CSV/XLSX/XLS import and Excel workbook download. No private file was uploaded. Browser-processing claims are attributed to the app, not presented as an independent security audit. No public repository was verified, so there is no GitHub CTA.

### n8n automation platform

Reviewed README, performance document and actual ingestion workflow JSON. The repository reports eight workflows, 51 tests and a 1,792 rows/s benchmark measured locally. Those upstream tests were not rerun here. Default Power BI/AI integrations are mock/template adapters, and datasets are synthetic.

Visual inspection rejected README-linked canvas screenshots: they show account setup, not workflows. They are not shipped as proof. Instead, `n8n-ingestion-architecture.svg` is rendered from actual workflow node names, positions and connections, recorded in `n8n-ingestion-graph.json`. It is visibly classified as an architecture diagram, never as an n8n canvas screenshot. No credentials or internal adapter URLs are included in that graph artifact.

### Global analytics — 3M

README and architecture describe a verified SQL Server pipeline, 50-country dimensional model, 12/12 SQL checks, single-currency monetary measures and unreliable source customer identifiers. Page 01 canvas is reported laid out; pages 02–09 are still in authoring. Repository gallery assets are design mockups and labeled accordingly. No verified native model screenshot was available from the reviewed assets. This is distinct from the existing DuckDB/web World Business Intelligence entry, which remains in the library.

### Enterprise Power BI suite

The nine images are design blueprints; a compiled PBIX is not provided. README reconciles synthetic $12.84M revenue, 178,200 orders and 46,798 customer records. The 66 DAX measures are source-reviewed; Desktop execution remains pending. Financial figures are not client revenue and forecast scenario bands are not statistical confidence intervals.

## Image provenance and workflow

- `screenshot-manifest.json` records project ID, source URL, date, dimensions, classification and generated responsive variants.
- For downloaded repository design assets, original capture dates are unknown (`captureDate: null`); retrieval/review date is recorded separately. Fresh live captures have the actual capture date.
- Assets are optimized WebP. Next.js optimized images generate delivery sizes using responsive `sizes`; explicit 640/1280/1920 source variants are also generated.
- Shared `WorkImage` retains its error fallback; layout geometry reserves image space.
- Source screenshots were reviewed visually. Rejected n8n setup images were removed.
- `source-review.json` records reviewed README revisions. Claims link directly to public evidence.

Reproduction utilities:

1. `node scripts/portfolio-capture-sources.cjs` — live baseline and primary product captures.
2. `node scripts/portfolio-capture-projects.cjs` — secondary Fabric captures and public repository design assets.
3. `node scripts/portfolio-capture-excel.cjs` — actual Excel dashboard and template selector.
4. `node scripts/portfolio-render-architecture.cjs` — workflow-derived n8n diagram.
5. `node scripts/portfolio-check-links.cjs` — read-only public destination audit.
6. `node scripts/portfolio-verify.cjs` — responsive screenshots and functional browser assertions.
7. `node scripts/portfolio-review-layout.cjs` — measured card geometry, default-library count and original dialog preservation.

Browser scripts require Playwright plus an installed Microsoft Edge browser; `PLAYWRIGHT_MODULE` can point to a bundled Playwright module. They do not install software, authenticate to projects, upload private data or run terminal commands through a UI. Normal repo dependencies provide Sharp and TypeScript. Inspect new captures before publishing them.

## Validation actually executed

- Repository test suite: **235 passed, zero failed**. Includes five new portfolio evidence/catalog/media regressions and updated category/sitemap dependency fixtures. The existing enquiry concurrency/error test still passes without sending real messages.
- Targeted portfolio tests: **7 passed** after the final evidence-manifest adjustment.
- TypeScript: `npx tsc --noEmit --incremental false` passed.
- Full ESLint: zero errors, 352 existing warnings. Targeted new portfolio code has zero errors.
- Production Next.js build: passed in isolated `.next-portfolio-build`, including all five statically generated case-study paths.
- Subsequent thumbnail-only CSS refinements compiled in development and passed the final four-width browser checks. The production build above predates that last visual-only refinement.
- Post-build packaging audit: passed (205 traces, 406 browser chunks, original documents unmodified).
- Standard `npm run build` initially hit an existing Windows Prisma DLL lock held by the dev server. The successful isolated build used the already-generated Prisma client. It did not alter credentials or database schema.
- Hosted database was unavailable from the build environment. Existing blog/custom-page fallback behavior was exercised; this is not proof that database-backed production features were tested.
- Browser verification: all four requested widths (375, 768, 1440, 1920) have no horizontal overflow. Featured rendering, search, empty-result reset, multi-category/tool filters, five case-study status codes, headings, images, canonical URLs and CreativeWork schema passed. No browser page errors.
- Mobile navigation opens/closes. Keyboard focus reaches interactive content. Original Sales Pipeline case-study dialog opens and closes. These are basic keyboard checks, not a full independent WCAG audit.
- Public featured destinations and evidence sources: **23/23 reachable** in `link-audit.json`.
- Final screenshots: `after-*.webp`, `hero-*.webp`, and `featured-desktop.webp`. Browser assertions are in `browser-validation.json`; measured geometry and duplicate checks are in `layout-review.json`.
- No Lighthouse score is claimed: Lighthouse was not installed or run. Performance is supported by server rendering, optimized images, limited image preloading and no added animation library, not a measured 90+ result.

## Changed files

Portfolio: `app/portfolio/{data.ts,page.tsx,layout.tsx,PortfolioClientPage.tsx,Portfolio.module.css,[slug]/page.tsx}`.

Reusable view: `components/portfolio/{PortfolioShowcase.tsx,PortfolioV2.module.css}`.

Discoverability and tests: `app/sitemap.ts`, the existing `/portfolio` link in `app/certification/page.tsx`, `tests/portfolio-page.test.mjs`, `tests/portfolio-v2.test.mjs`, and the sitemap fixture in `tests/adsense-readiness.test.mjs`.

Media/evidence: `public/images/portfolio/`, `docs/portfolio/`, and `scripts/portfolio-*.cjs`.

## Deployment considerations

Keep the current production site unchanged. Review the image classifications, feature status and final desktop/mobile presentation before publishing. Do not accidentally include the preceding dashboard task's local changes in a portfolio-only review. Re-run the normal build in an environment without a locked Prisma engine and with the intended database connectivity. Commit/push and PR creation await the user's later instruction.
