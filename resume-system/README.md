# Resume management system

One public Master Professional Resume and three private role-specific profiles share the canonical files in `data/`. Confirmed facts include September 2026 for the DBS Mintek end date, Mumbai, Maharashtra, India for the latest two roles, resume@dattasable.com and B.Sc. graduation in 2005.

## Public and private boundaries

- About shows one master presentation preview and PDF download. Portfolio links to that same master.
- `/Dattatray_Sable_Resume.pdf` serves only the active master PDF. Its Word master stays private.
- `/admin/resumes` manages all four profiles with existing server-side administrator authorization, PDF previews, PDF/Word downloads, replacement pairs, history and restoration.
- Every metadata, file, HEAD/range and mutation request under `/api/admin/resumes` requires a current verified administrator. Storage URLs are never returned to browsers.
- Retired `/resumes/*` URLs return 410 locally. No specialist files remain under `public/`.
- Local files live in Git-ignored `storage/resumes/`. Production uses private Vercel Blob and never falls back to local disk.

## Generate and validate

Use the bundled Python returned by the workspace dependency loader, or Python 3.12+ with requirements.txt. Run commands from the repository root.

1. `python resume-system/scripts/generate_docx.py` generates four editable masters. Add `--profile=master` to rebuild only the master.
2. `powershell -File resume-system/scripts/export_pdf.ps1` exports matching PDFs with installed Word. The optional `-Name` parameter limits export. Only generated documents are opened in a separate hidden Word instance.
3. `python resume-system/scripts/validate_content.py` checks facts and current project copy.
4. `python resume-system/scripts/validate_outputs.py` checks all four pairs, extraction, dates, corrected Mumbai locations, links, duplication, dimensions and text bounds. Inspect all eight page images afterward.
5. `python resume-system/scripts/publish_local.py` copies only the master PDF and presentation image into `public/resume/`; it cannot publish specialized documents.
6. `node --conditions=react-server --import tsx scripts/init-private-resumes.ts` initializes local private storage, reads files back to verify checksums and preserves old versions. It refuses cloud/production mode and skips an already matching pair.

Output, previews and originals are local-only ignored folders. The bundled LibreOffice renderer was unavailable; installed Word exported the actual DOCX masters, and PDFium rendered the matching PDFs for inspection.

## Version behavior

Documents are immutable per UUID. Local writes use a lock and atomic manifest replacement; cloud writes use private blobs and ETag conditional manifest updates. Both formats must be stored and verified before changing the active version. Replacements and restorations record events. There is no deletion endpoint.

Each version records the canonical-data fingerprint. Versions with obsolete facts stay downloadable by admins but cannot be restored as active without preparing a reviewed updated pair. Replacements require administrator confirmation that both files match the verified information. Structural checks are automatic; externally prepared replacements still need the complete ATS/layout validation workflow.

Public master replacements update the complete PDF immediately. Regenerate the presentation image when its visible content changes.

## Local QA and production boundary

- `node --test tests/resume-management.test.mjs` tests actual handlers and storage with simulated sessions and isolated filesystem/Blob fixtures.
- `node scripts/resume-ui-fixture.mjs` runs the actual admin component and handlers on loopback port 3095 with an explicitly labeled simulated administrator. It adds no website login bypass and is not deployed. Stop it after QA.
- Dev/build scripts copy the locally hosted PDF.js worker. Viewer code loads only when an admin opens a PDF preview.
- The build ends with a packaging guard that removes private-document references from generated trace metadata, checks browser bundles and verifies the public fallback. This also covers the observed Windows trace-glob mismatch. Original document files are never modified by the guard.

Original supplied, former website and pre-location-correction files remain in `source/` and `storage/resumes/legacy-public/`. Git history and older deployments have not been rewritten or deleted. Review IMPLEMENTATION_REPORT.md and PRODUCTION_CHECKLIST.md before release. No production deployment is authorized by this local implementation.
