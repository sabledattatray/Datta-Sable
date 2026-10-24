# Typography and mobile refinement — 24 October 2026

## Readability

- Shared body baseline: 16px, with a 14px minimum for ordinary labels, navigation, captions and controls. Existing larger type sizes remain. Chart labels have a separate scale.
- Converted undersized CSS declarations, inline React styles and arbitrary Tailwind sizes to the shared token across public pages, tools, dashboards, commerce and administration. Tailwind's small text utilities use the same readable minimum.
- Light primary/secondary text uses `#17212f` / `#475569`; dark secondary text uses `#b3bdcc`. Theme accent colors and display-heading gradients remain intact.
- Removed opacity-based fading from theme-muted labels and placeholders. Disabled controls and decorative artwork retain their appropriate treatments.
- Published typography settings now respect the body/label minimum on desktop and mobile. Legacy CMS caption styles receive a minimum only in their rendered copy; stored articles, large heading styles and literal code examples are preserved.
- Canvas charts use numeric font sizes and theme-aware label colors rather than CSS variable strings.

## Mobile layout

- At phone widths, text inputs, selects and textareas use 16px and at least 44px height.
- Home filters wrap; article cards grow with their content. Dashboard controls wrap, metrics stack, and narrow chart labels have a separate responsive treatment.
- Decorative overflow on the tools page is hidden at phone widths. Article code blocks retain local horizontal scrolling rather than forcing the entire page wider.
- Knowledge Index artwork and its captions have separate layout space. At widths up to 600px the artwork stacks below the editorial copy and library link; tablet layouts reserve room beside the copy. Caption bounds were checked at 320px, 480px, 600px and 768px with no overlap.
- Main pages were inspected at 320px, 390px and 768px. Home, tools, products, blog listing and contact had no page-wide horizontal overflow in the checked states. Article code samples can extend inside their dedicated scroll containers.

## Header and footer

- Mobile header uses a compact brand signature, a 44px theme control and a clear Menu button. Account access remains available inside the drawer.
- The inset menu has larger navigation rows, 44px submenu controls, readable descriptions, scrollable content, a pinned contact/account area, and reduced-motion support.
- Verified menu focus wrapping, background scroll lock, Escape dismissal and focus return. Drawer text fits at 320px, including expanded submenus.
- Desktop tagline stays on a single line and matches the wordmark width. This small branding signature has its own type size, separate from content typography. The measured desktop wordmark and tagline were both approximately 147.42px wide.
- Mobile/tablet footer uses a clear policies heading, two-column links, a full-width preferences control and separate copyright. Mobile policy targets are at least 48px high; bottom spacing accommodates the existing floating controls.

## Verification

- All 169 tests passed, including regressions for older typography settings and CMS captions.
- TypeScript passed. ESLint reported zero errors and 331 existing warnings.
- Production build passed in the isolated `.next-typography` directory with lint/type checks enabled. Database-dependent prerendering used the existing fallback behavior inside the network sandbox.
- Browser checks covered light and dark themes, the narrow mobile drawer, forms, footer targets, desktop logo alignment and key page layouts.
- Verification logs and light/dark menu/footer previews are in the ignored `scratch/audit-2026-10-24/` directory.

This review checks the shared styles and representative page states. Third-party embeds, every possible article, and authenticated admin datasets were not individually inspected on physical devices.

### Interactive hero and collection refinements
- Collection cards use full-width illustrated covers on phones, with larger visual motifs and comfortable chapter links.
- Trust cards use larger seals, consistent hierarchy, and responsive four/two/one-column layouts.
- Hero controls are compact, with optional appearance/channel controls in an expandable panel. The desktop hero fits the checked 1366 × 768 viewport.
- Revenue, Operations, and Pipeline share a stable chart stage and metric row sizing. Verified identical panel heights across all three views at widths 320, 390, 768, 1366, and 1920.
- Operations uses gradient completed bars, dashed planned targets, a matching legend, and an active-period highlight. A ResizeObserver sizes SVG coordinates to the actual plot width, keeping phone charts readable. Sparse mobile date ticks retain every data point's accessible label.
- Verified light/dark rendering and no horizontal page overflow at 390px. TypeScript and targeted ESLint pass after these changes.

### Follow-up polish
- Shared 1440px width and responsive gutters align boxed pages with the header. Measured matching edges at 320, 390, 768, 1100, 1488 and 1920px; decorative corners scale within tablet gutters.
- Donut summary uses a centered HTML overlay with a prominent count, stage label and short deals caption; smallest phones retain stage names in the adjacent legend.
- Mobile cookie consent uses concise copy, an inset compact panel and 44px action buttons.
- Added Emerald, Amber and Rose previews, with separate light/dark palettes. Six choices wrap into a three-column grid, or two columns on the narrowest phones. Preview colors remain scoped to the hero demo.
