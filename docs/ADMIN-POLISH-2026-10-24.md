# Admin workspace polish — 24 October 2026

## Changes

- Refined the overview with a framed welcome panel, draft and enquiry shortcuts, six balanced metric cards, a separate subscriber count, accent icon panels, quieter shadows, and clearer publication and activity badges.
- Refined shared management cards, page headers, tables and tabs. Admin body copy uses the bundled Inter font while headings retain Syne. Replaced high-specificity heading overrides so page-specific typography can work.
- Improved small-screen spacing and retained contained horizontal scrolling for wide management tables. Search makes both the sidebar and main content inert while open.
- Missing publishing counts produce an unavailable indicator rather than a misleading percentage.
- Inbox fetch, mark-read and delete operations check HTTP success. Failed deletes retain the message and selection; duplicate pending deletes are ignored. Added visible failures, manual refresh, email search, keyboard-operable message buttons, encoded reply subjects, and earlier stacking of the detail layout.

## Verification

- All 174 tests passed, including regression checks for missing publication queries, failed inbox loading and read updates, and failed/pending/successful deletion.
- Targeted ESLint and TypeScript checks passed.
- Production compilation, lint, types and static generation passed using `next build` and the existing generated Prisma client in `.next-audit`. The normal build script's Prisma generation encountered a Windows native-library lock from the running dev server. Build-time database reads used the existing source fallbacks because outbound database access was restricted.
- Browser checked the existing development-only preview in light and dark themes. Overview layouts were checked at 320, 390, 768 and 1440 pixels with no document overflow. Management tables retained local horizontal scrolling.
- Sample article filters, empty search results, global menu search, mobile sidebar filtering and Escape focus restoration were exercised. No browser console errors were recorded at the end of the visual review.

The visual review uses explicitly labeled sample records, not a substitute for authenticated production workflow verification. No live inbox records were changed during testing. Hosted deployment status must be checked separately from local validation.
