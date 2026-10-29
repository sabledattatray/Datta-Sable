# Resume generation system

The three resumes share canonical candidate, employment and project data under `data/`. The user confirmed DBS Mintek employment ended in **September 2026**. Senior MIS is the default public resume.

## Generate and validate

Use Python 3.12+ with `requirements.txt`. In Codex, use the Python executable returned by the workspace dependency loader.

1. Run `python scripts/generate_docx.py` from this folder.
2. Export matching PDFs with `powershell -File scripts/export_pdf.ps1` on Windows with Microsoft Word installed. The script runs a separate hidden Word instance, opens the generated files read-only and closes only its own documents. Alternatively, convert the DOCX files with LibreOffice headless if installed.
3. Run `python scripts/validate_outputs.py`. This compares the PDF text against the DOCX paragraphs and canonical employment bullets, checks two A4 pages, reading order, duplicate text overlays, bounds and hyperlinks, and renders every page to PNG using PDFium.
4. Inspect every preview at full size. An automated pass alone is not visual approval.
5. Run `python scripts/publish_local.py` only after visual inspection. It requires a passing validation report and publishes six files into `public/resumes/`, plus the Senior MIS PDF at the existing `public/Dattatray_Sable_Resume.pdf` path.

`output/`, `previews/` and `source/` are local-only. Original supplied and original website PDFs are preserved in `source/`; the input at `D:\Datta Sable\Resume\Dattatray_Sable_Senior_MIS_BI_Analyst_Resume.pdf` is never overwritten. Final public copies live under the website's existing static hosting, not in private ebook Blob storage.

## Release gates

Do not set a guessed employment end date. Keep professional responsibilities separate from independent portfolio projects. Do not add unverified certifications, production-tool experience or performance metrics. Update canonical JSON, regenerate every affected file, export again, validate and visually inspect before publishing. The LinkedIn URL is sourced consistently from existing project pages; LinkedIn returned HTTP 999 to the automated request, so live profile ownership was not independently verified.

The bundled `render_docx.py` was attempted, but LibreOffice is absent on this Windows machine. Native Word PDF export plus PDFium rendering was used instead; all PDFs therefore come from the editable DOCX masters rather than a separately authored approximation.
