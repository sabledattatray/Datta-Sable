# PDF and text validation

All three variants passed `scripts/validate_outputs.py` on 29 October 2026. Machine-readable results are in `validation-results.json`.

| Check | Senior MIS | Power BI / BI | BFSI |
|---|---|---|---|
| Two A4 pages | PASS | PASS | PASS |
| Editable DOCX opens and parses | PASS | PASS | PASS |
| Selectable PDF text | PASS | PASS | PASS |
| Every non-empty DOCX paragraph present in PDF | PASS | PASS | PASS |
| Every canonical employment bullet present exactly once | PASS | PASS | PASS |
| All four employers and contextual dates | PASS | PASS | PASS |
| Name once in main body; correct email; 2005 graduation | PASS | PASS | PASS |
| Correct section extraction order | PASS | PASS | PASS |
| No repeated long paragraphs or exact text overlays | PASS | PASS | PASS |
| No overlapping consecutive words or out-of-bounds characters | PASS | PASS | PASS |
| Embedded phone, email, website, LinkedIn and project links | PASS | PASS | PASS |
| No tables, hidden text or text boxes in main body | PASS | PASS | PASS |
| No old Gmail, Present, CASCO or unresolved date placeholder | PASS | PASS | PASS |

The exporter normalizes root hyperlinks with a trailing slash. Validation treats equivalent root URLs consistently.

Text extraction, paragraph checks, bounding-box checks and full visual review establish the tested properties, not a universal ATS guarantee. No ATS score is asserted. A prospective employer's parser may behave differently.
