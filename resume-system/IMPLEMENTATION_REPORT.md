# Local resume management verification

Verified on 29 October 2026. **No production deployment, Git push, history rewrite, historical-file deletion or production storage write was performed for this implementation.**

## Completed behavior

The public About page presents one Master Professional Resume with a document preview and PDF download. Portfolio links to that same document. The existing `/Dattatray_Sable_Resume.pdf` URL serves only the active master and supports attachment downloads, HEAD and PDF range requests. The master DOCX remains editable and private.

All four profiles share verified candidate, experience and project JSON. The title is **Senior MIS & Business Intelligence Analyst**. The latest two employment locations are **Mumbai, Maharashtra, India**, as confirmed by the candidate. Email is **resume@dattasable.com**, graduation is **2005**, DBS Mintek ended **September 2026**, and the employment narrative remains historical. Fabric is identified as independent project experience.

`/admin/resumes` lists the master and three specialist profiles, updated timestamps and version history. It supports in-browser PDF.js previews, PDF/Word downloads, paired replacement uploads and explicit restoration confirmation. Both formats are verified in storage before activating a version. Prior versions are retained; outdated canonical facts cannot be restored silently.

The new APIs use the existing NextAuth and current database role checks. They do not rely on the client admin wrapper. Preview, download, HEAD and range requests all authenticate separately. Mutations verify origin and revision. Private responses disable browser/CDN caching and indexing. Private storage URLs are never returned to the UI. The legacy applicant-document endpoint cannot access the protected resume namespace.

## Document QA

Four editable DOCX files and four corresponding PDFs were generated from the canonical data. All PDFs have two A4 pages; all eight page renderings were inspected. They use the established navy/blue/slate/white palette, Aptos, 10 pt body text and a single-column layout.

Validation compares every DOCX paragraph and canonical employment bullet with PDF extraction, checks all employers/dates, the two corrected locations, contact details, page order, hyperlinks, duplicates, text overlays and bounds. All checks passed. Editable masters were converted directly with installed Word; LibreOffice is unavailable. No universal ATS score or guarantee is claimed.

The original supplied PDF, previous website file, pre-location-correction outputs and previous public specialist copies remain backed up. Six previous specialist assets and the old default were moved into `storage/resumes/legacy-public/`, not deleted. New local immutable versions are outside `public/` in `storage/resumes/files/`.

## Tests and local HTTP results

- **228 repository tests passed; zero failures.**
- **18 resume security/storage tests passed**, including anonymous and non-admin rejection, stale administrator role checks, logout denial, same-origin mutation checks, malformed files, size limits, revision conflicts, concurrent updates, integrity failures, old-fact restoration refusal, cross-profile restoration rejection, cloud-private access, conditional writes, production credential failure and blocking the legacy document path.
- TypeScript: no diagnostics. Focused lint: no errors or warnings after cleanup.
- Local optimized Next.js build completed in **compile mode**. Full production build/prerender is still a release checklist item.
- Packaging guard passed: **204 traces and 404 browser chunks checked**. It removed 72 private-document **references from generated trace metadata**, not files. The master fallback remains included. No private file references were found in browser bundles. Normal build scripts run this guard automatically. This handles the Windows path-glob exclusion mismatch observed during local compilation.

| Local request | Result |
|---|---|
| About and Portfolio | 200; no specialized download links |
| Default master PDF with download flag | 200; attachment; SHA-256 matches reviewed master |
| Admin resume metadata, signed out | 401; private no-store; noindex/noarchive |
| Private specialist Word/PDF request, signed out | 401; private no-store; noindex/noarchive |
| Admin page, signed out | No resume data; existing login/admin gate; no-store and noindex |
| Retired specialist `/resumes/*` PDF/DOCX URLs | 410; no-store; noindex/noarchive |
| Direct `storage/resumes/manifest.json` URL | 404 |
| Direct generated specialist output URL | 404 |

Machine-readable document and HTTP evidence is in `validation-results.json` and `local-http-verification.json`.

## Browser verification and screenshots

The actual About page was checked at desktop and 390 px mobile widths with no horizontal overflow. The actual admin component and route handlers were exercised in an isolated loopback fixture with a clearly labeled **simulated administrator**, rather than creating or bypassing a real website account.

Browser checks passed for listing, paired file replacement, retained version history, previous-version restoration, PDF page navigation, logout clearing the rendered canvas and denial of the old private URL after logout. PDF.js was added after the native embedded viewer displayed a blank panel in the in-app browser; its worker is served locally, with no external document viewer.

| Evidence | Local path |
|---|---|
| Public section, desktop | `previews/system/public-desktop.jpg` |
| Public section, mobile | `previews/system/public-mobile.jpg` |
| Admin component, desktop | `previews/system/admin-desktop.jpg` |
| Admin component, mobile | `previews/system/admin-mobile.jpg` |
| Private PDF viewer | `previews/system/admin-pdf-preview.jpg` |
| All eight resume pages | `previews/system/all-eight-pages.png` |

The fixture is not production authentication verification. Final testing with a real verified administrator and private cloud credentials remains necessary before release. No login bypass exists in the application.

## Remaining risks and release requirements

1. **Production is unchanged.** The older production release can still expose specialist copies until an approved replacement is deployed.
2. Files exist in public Git history, including specialist commit `dbf7c7b` and earlier default-resume history (`9b5207b`). Previous deployments, caches, clones and prior downloads cannot be recalled by a local move. No history or deployment was deleted.
3. Production private Blob data must be initialized through the protected manager after configuring the intended private store. Local files are intentionally excluded from deployment. The cloud adapter was tested with an isolated mock, not by modifying the real store.
4. A manual master replacement updates the complete public PDF, but its static presentation image must be regenerated alongside visible content changes.
5. Structural file checks and admin attestation do not replace the complete content/ATS/layout review for future externally authored files.
6. A failed optimistic write may retain unreferenced immutable documents. A crashed local writer may leave a lock. Neither condition triggers automatic historical-file deletion.

See **PRODUCTION_CHECKLIST.md** for the approval and release sequence, and **MODIFIED_FILES.md** for the resume-specific file inventory. Earlier unrelated ebook work remains intact in the workspace.
