# Public-page redesign — 24 October 2026

## Contact

- Rebuilt the page with direct contact details, labeled profile links, a dedicated enquiry card, and a brief explanation of the next steps.
- Replaced the ambiguous icon-only OAuth block with LinkedIn/GitHub profile links. Optional account sign-in uses the existing public sign-in page and returns to `/contact`; the signed-in state fills empty name/email fields without locking edits. This does not change provider credentials or claim to repair an external OAuth configuration.
- Prevented concurrent submissions, retained drafts on failure, handled non-JSON errors, and added persistent confirmation and accessible feedback. Tests use mocked delivery; no real enquiry was submitted.

## Portfolio

- Added a compact introduction and an actual case-study cover preview, with clearly labeled illustrative provenance.
- Rebuilt featured studies and the searchable library as rectangular cards. Desktop library cards measured approximately 576 × 233 pixels; the smallest phone layout measured approximately 267 × 182 pixels.
- Preserved project notes, detailed case studies, demonstrations, résumé links, category/tool filtering, search, pagination, and the enquiry form. Project counts are derived from the existing records.
- Made enquiry styling self-contained so replacing shared styles cannot collapse the form. Added concurrent-submit protection and safe handling of non-JSON failures.

## Shared footer, branding and layout

- Reduced trust cards to compact horizontal layouts, with smaller badges and typography.
- Replaced the tall side-by-side footer panels with a shallow brand panel above a six-column desktop link directory. Desktop panels measured approximately 136 and 299 pixels high. Mobile groups use native keyboard-operable disclosure sections.
- Header, mobile drawer and footer now render the same `BrandLockup` component.
- Footer links share the same icon/label/arrow component in desktop and mobile menus. Final bottom padding is 24px plus any required phone safe area, replacing the earlier 88–110px spacing.
- Public pages using the shared header inherit a single outer frame matching the header's width and edges. Existing boxed wrappers do not apply a second gutter. Admin and standalone pages without the public header retain their layouts.
- The frame starts at 100px on desktop and 94px on mobile. Verified header-to-frame gaps are 22px and 16px respectively; content has its own inset below that boundary.
- Shared text tokens and public content roles now follow the approved portfolio scale: display titles up to 49px/600, section titles 27px/500, card titles 16px/600, body 13px/400, and supporting text 11px. Mobile roles step down, while inputs remain at least 16px to avoid phone focus zoom. The portfolio reference, brand signatures, compact footer variants, editable content and dialogs retain their deliberate local treatments.
- Published typography now uses compact 13px body and 11px control floors, so saving settings does not unexpectedly inflate the approved design. Font-family and color customization remains available.

## Start Here and homepage refinements

- Learning pathways use medium rectangular overviews, SVG concept maps, and native expandable reading sequences. Existing guide links remain available; opening a pathway also reveals its complete skills on narrow phones.
- The six-column certification matrix becomes labeled entries on phones and smaller tablets, keeping all six fields without horizontal scrolling. Fixed minimum widths in the starting-guide grid were also removed.
- The homepage headline has its own larger display scale, rather than inheriting a standard page-title size. Dashboard numerals use compact 22px desktop and 20px phone primary values; embedded dashboard typography is kept separate from marketing section headings.
- Removed the requested “Keep exploring” link from the homepage dashboard caption.

## Validation

- All 182 automated tests passed, including eight new contact/portfolio interaction regressions.
- Targeted lint and TypeScript checks passed.
- Final production build passed, including the Start Here pathways, responsive certification matrix, shared typography, footer icons and homepage refinements. Targeted lint/TypeScript checks and browser verification also passed.
- Browser checks confirmed shared edges and no overflow on Home, Contact, About, Blog, Services, Products, Tools and Privacy, plus Portfolio.
- Portfolio filtering, empty-result reset, pagination, case-study opening/closing and focus restoration were exercised. Mobile cards and the footer disclosure controls were checked down to 320px. Contact required-field validation was exercised without sending a message.
- Final build logs and screenshots are kept in ignored `scratch/` files. Production builds use the already generated Prisma client because Windows locks its native library while the development server runs. Build-time database reads may use the application's established fallbacks when network access is restricted.

Validation covers the local workspace and build. Real OAuth authorization and live message delivery were not completed during UI verification. A successful build does not establish that the hosted deployment has completed.
