# Admin workspace redesign

Implemented locally on 22 October 2026. No deployment, database migration, password reset, or live payment activation.

## Interface

- Rebuilt the shared admin shell using the site's existing theme tokens and font family. Default dark mode uses lime; light mode uses the site's blue accent.
- Organized navigation into Workspace, Commerce, Growth & Intelligence, People & Operations, and System. Existing destinations remain available.
- Added sidebar filtering and keyboard-accessible global menu search (Ctrl/Cmd+K).
- Fixed overlapping parent/child selection, active submenu expansion on route changes, and access to nested destinations when the sidebar is collapsed.
- Mobile navigation supports a backdrop, focus containment, Escape dismissal, focus restoration, and scroll locking. Opening the search dialog makes background content inert.
- Replaced the overview with a split hero, animated workspace illustration, linked metric cards, hourly traffic chart with accessible data table, quick actions, publication breakdown, recent content, and actual audit events.
- Motion respects reduced-motion preferences. Status and traffic numbers come from database reads; decorative motion never generates fake traffic.
- Aligned legacy management-screen palettes and primary-button contrast with theme defaults. Refined shared commerce cards, tabs, forms, and tables. Removed the public WhatsApp overlay from admin screens.

## Data and access

The new `/api/admin/overview` endpoint requires an authenticated ADMIN session and sends private/no-store and noindex headers. It reads existing Post, Project, User, Subscriber, ContactMessage, PageView, and AuditLog records only. It does not expose account details, audit payloads, IP addresses, or payment secrets.

Reads refresh every 60 seconds while the tab is visible, with manual refresh and pause/resume. Failed sources remain null; successful zero counts remain zero. Errors retain the last snapshot with a visible warning. The last five-minute count means recorded page views, not simultaneous visitors. Hourly buckets include the current partial hour.

The existing analytics and intelligence pages retain their own data services. Their previous reporting assumptions were not replaced as part of the visual theme alignment; only the new overview uses the new read-only metrics service.

## Local access

- Admin login: `http://localhost:3000/admin/login`. Google's existing registered local callback accepts port 3000. Local database connectivity was verified; passwords were not changed.
- Design-only preview: `http://localhost:3002/admin-design-preview`. Requires both development mode and `ADMIN_DESIGN_PREVIEW=1`; it uses explicitly labeled sample data and makes no admin metrics requests. It does not bypass authentication for any admin route or API.

## Validation

- TypeScript and targeted lint checks passed. Legacy admin files retain existing lint warnings; no lint errors were introduced.
- Eight focused tests cover navigation matching, empty/partial metric sources, serialization, privacy boundaries, and API authorization/error behavior.
- Full automated suite: 131 tests passed.
- Read-only integration check: all 12 metric queries completed against the existing database, including the 24 hourly buckets.
- Live anonymous API request returned 401. Google login at port 3000 reached Google's account chooser; the owner confirmed login succeeded.
- Desktop/light/mobile visual checks, menu expansion/collapse/filter/search, and Escape focus restoration were exercised in-browser.

Final authenticated verification: the owner signed in through Google on port 3000. The real overview loaded all 12 queries; manual refresh and pause/resume were checked. A pre-existing nested `<head>` hydration error was corrected by moving robots metadata into the server layout and keeping the existing client authentication gate in `AdminAccess`. Browser inspection confirmed no nested head and `noindex, nofollow` metadata.

Final production build: passed, including generation of all 333 pages. Full test suite rerun after the metadata fix: 131 passed. Existing lint warnings remain; no build or type errors.
