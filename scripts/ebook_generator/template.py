CSS_STYLES = """
@page {
  size: A4 portrait;
  margin: 0;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  background: #080c14;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  text-rendering: optimizeLegibility;
}
.page {
  width: 210mm;
  height: 297mm;
  padding: 16mm 18mm 16mm 18mm;
  position: relative;
  page-break-after: always;
  page-break-inside: avoid;
  background: #080c14;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* COVER STYLING */
.cover-page {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.15), transparent 40%),
              radial-gradient(circle at 20% 80%, rgba(201, 243, 29, 0.12), transparent 45%),
              #080c14;
  position: relative;
}
.cover-page::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}
.cover-content {
  position: relative;
  z-index: 2;
  padding: 24mm 22mm;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cover-badge-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.cover-badge {
  background: rgba(201, 243, 29, 0.15);
  border: 1px solid rgba(201, 243, 29, 0.4);
  color: #c9f31d;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 6px 14px;
  border-radius: 9999px;
  text-transform: uppercase;
}
.cover-category {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: 9999px;
  text-transform: uppercase;
}
.cover-hero {
  margin-top: 30px;
  margin-bottom: auto;
}
.cover-series {
  font-size: 13px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 16px;
}
.cover-title {
  font-size: 38px;
  line-height: 1.15;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
.cover-title span {
  background: linear-gradient(135deg, #c9f31d 0%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cover-desc {
  font-size: 15px;
  line-height: 1.6;
  color: #cbd5e1;
  max-width: 580px;
  margin-bottom: 30px;
}
.cover-highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}
.cover-highlight-card {
  background: rgba(19, 28, 46, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px;
}
.cover-highlight-num {
  font-size: 20px;
  font-weight: 800;
  color: #c9f31d;
  margin-bottom: 4px;
}
.cover-highlight-text {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  font-weight: 500;
}
.cover-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  position: relative;
  z-index: 2;
}
.cover-author-title {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}
.cover-author-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}
.cover-author-role {
  font-size: 12px;
  color: #38bdf8;
  font-weight: 500;
}
.cover-edition-tag {
  text-align: right;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

/* HEADER & FOOTER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 7px;
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.page-header .accent {
  color: #c9f31d;
  font-weight: 700;
}
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 7px;
  font-size: 9.5px;
  color: #64748b;
}
.page-footer .page-num {
  color: #c9f31d;
  font-weight: 700;
  font-size: 10.5px;
}

/* INTERIOR CONTENT */
.page-body {
  flex: 1;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.chapter-badge {
  display: inline-block;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 6px;
  width: fit-content;
}
h1 {
  font-size: 19px;
  line-height: 1.25;
  color: #ffffff;
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
h2 {
  font-size: 13.5px;
  color: #38bdf8;
  margin-top: 10px;
  margin-bottom: 6px;
  font-weight: 600;
}
p {
  font-size: 11.5px;
  line-height: 1.55;
  color: #cbd5e1;
  margin-bottom: 8px;
}
ul, ol {
  margin-left: 16px;
  margin-bottom: 8px;
  font-size: 11.5px;
  line-height: 1.55;
  color: #cbd5e1;
}
li {
  margin-bottom: 3px;
}
li strong {
  color: #ffffff;
}

/* COMPONENTS */
.callout {
  border-radius: 6px;
  padding: 9px 12px;
  margin: 7px 0;
  font-size: 11px;
  line-height: 1.45;
}
.callout-summary {
  background: rgba(19, 28, 46, 0.8);
  border-left: 3px solid #38bdf8;
  color: #cbd5e1;
}
.callout-tip {
  background: rgba(201, 243, 29, 0.08);
  border-left: 3px solid #c9f31d;
  color: #e2e8f0;
}
.callout-warn {
  background: rgba(245, 158, 11, 0.08);
  border-left: 3px solid #f59e0b;
  color: #fde68a;
}
.callout-title {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  margin-bottom: 3px;
  display: block;
}
.callout-tip .callout-title { color: #c9f31d; }
.callout-warn .callout-title { color: #f59e0b; }
.callout-summary .callout-title { color: #38bdf8; }

.code-box {
  background: #05080f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 7px 0;
  overflow: hidden;
}
.code-header {
  background: #0d1424;
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 9.5px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', Consolas, monospace;
}
.code-dots {
  display: flex;
  gap: 4px;
}
.code-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.code-dot.red { background: #ef4444; }
.code-dot.yellow { background: #eab308; }
.code-dot.green { background: #22c55e; }
.code-body {
  padding: 9px 11px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 10px;
  line-height: 1.45;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-word;
}
.code-keyword { color: #38bdf8; font-weight: 600; }
.code-func { color: #c9f31d; }
.code-str { color: #34d399; }
.code-comment { color: #64748b; font-style: italic; }

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 7px 0;
}
.grid-card {
  background: #0e1526;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 9px;
}
.grid-card h3 {
  font-size: 11.5px;
  color: #c9f31d;
  margin-bottom: 4px;
  font-weight: 600;
}
.grid-card p {
  font-size: 10.5px;
  line-height: 1.45;
  margin-bottom: 0;
}

.table-box {
  width: 100%;
  border-collapse: collapse;
  margin: 7px 0;
  font-size: 10.5px;
}
.table-box th {
  background: #111a2e;
  color: #38bdf8;
  font-weight: 600;
  text-align: left;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.table-box td {
  padding: 5px 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  background: rgba(14, 21, 38, 0.6);
}
.table-box tr:nth-child(even) td {
  background: rgba(17, 26, 46, 0.9);
}

.diagram-box {
  background: #070b14;
  border: 1px dashed rgba(56, 189, 248, 0.35);
  border-radius: 6px;
  padding: 9px 12px;
  margin: 7px 0;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 9.5px;
  line-height: 1.45;
  color: #a5f3fc;
  white-space: pre;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px;
}
.checkbox-box {
  width: 13px;
  height: 13px;
  border: 1.5px solid #c9f31d;
  border-radius: 3px;
  margin-top: 1px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox-inner {
  width: 7px;
  height: 7px;
  background: #c9f31d;
  border-radius: 1px;
}
"""

def render_book_html(book_data):
    """Renders complete 22-page book HTML."""
    slug = book_data["slug"]
    title = book_data["title"]
    subtitle = book_data["subtitle"]
    category_name = book_data["category_name"]
    pages = book_data["pages"] # 21 items (page 2 to 22)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title} · Enterprise 2026 Edition</title>
<style>
{CSS_STYLES}
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover-page" id="cover">
  <div class="cover-content">
    <div class="cover-badge-row">
      <div class="cover-badge">2026 Enterprise Edition</div>
      <div class="cover-category">{category_name}</div>
    </div>
    
    <div class="cover-hero">
      <div class="cover-series">Datta Sable Technical Library</div>
      <div class="cover-title">{book_data["cover_title_formatted"]}</div>
      <div class="cover-desc">{subtitle}</div>
      
      <div class="cover-highlights">
        <div class="cover-highlight-card">
          <div class="cover-highlight-num">22</div>
          <div class="cover-highlight-text">Production Chapters & Architecture Blueprints</div>
        </div>
        <div class="cover-highlight-card">
          <div class="cover-highlight-num">100%</div>
          <div class="cover-highlight-text">Practical Code, Schemas & Frameworks</div>
        </div>
        <div class="cover-highlight-card">
          <div class="cover-highlight-num">2026</div>
          <div class="cover-highlight-text">Modern Enterprise Best Practices</div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <div class="cover-author-title">Independently Authored By</div>
        <div class="cover-author-name">Datta Sable</div>
        <div class="cover-author-role">Enterprise BI & Data Architect</div>
      </div>
      <div class="cover-edition-tag">
        Published: October 2026<br>
        dattasable.com/ebooks
      </div>
    </div>
  </div>
</div>
"""

    # PAGES 2 to 22
    for p_idx, page in enumerate(pages, start=2):
        chapter_badge = page.get("badge", f"Section {p_idx - 1}")
        page_h1 = page["h1"]
        header_title = page.get("header_title", title)
        
        html += f"""
<!-- PAGE {p_idx} -->
<div class="page" id="page-{p_idx}">
  <div class="page-header">
    <span>{header_title}</span>
    <span class="accent">{chapter_badge}</span>
  </div>
  
  <div class="page-body">
    <span class="chapter-badge">{chapter_badge}</span>
    <h1>{page_h1}</h1>
    {page["content_html"]}
  </div>
  
  <div class="page-footer">
    <span>Datta Sable · Enterprise 2026 Edition · dattasable.com</span>
    <span class="page-num">Page {p_idx} of 22</span>
  </div>
</div>
"""

    html += """
</body>
</html>
"""
    return html
