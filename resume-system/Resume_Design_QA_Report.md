# Design QA

All eight final pages were rendered at 1.5× PDF scale and visually inspected individually. All four profiles occupy exactly two A4 portrait pages.

- Single-column reading order, white background, 17 mm margins.
- Aptos typography: 21 pt name; 10.5 pt role and section headings; 10 pt body; 9–9.5 pt secondary metadata and hyperlinks; 8 pt pagination only.
- Line spacing 1.1; navy #142B49 headings, blue #2563A6 role/links, dark #1F2937 body and light #D8E1EB rules.
- Standard body paragraphs and native bullets; no photographs, icons, skill ratings, tables or floating text boxes.
- Only pagination in the footer. Candidate identity and contacts remain in the main body.
- Reviewed all margins, headings, job/date alignment, bullet wrapping, page breaks, bottom-of-page education, whitespace and clickable links. No clipped text, blank third pages, orphan headings or visible overlaps were found.
- Colors use dark tonal values with strong contrast on white; meaning is also conveyed by wording and typography, not color alone. Physical grayscale print output was not tested.

The bundled `render_docx.py` failed because LibreOffice is absent. That failure was diagnosed before switching to the installed Microsoft Word 16 PDF exporter. The PDFs were exported directly from the editable DOCX masters, then rendered with PDFium. This is a documented renderer substitution, not a separately generated PDF layout.

Previews and old source files are kept outside the final application documents in ignored local folders. Original files have been preserved.

Current local revision also includes the public Master Professional Resume and the candidate-confirmed Mumbai, Maharashtra, India locations for the latest two roles. All eight latest page renderings remain two-page documents and passed visual/text checks.
