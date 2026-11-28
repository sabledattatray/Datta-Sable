from pathlib import Path
import io
import re
import pdfplumber
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, DecodedStreamObject
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

SOURCE = Path(r'C:\Users\sable\Downloads\Dattatray_Sable_Master_Professional_Resume_Updated.pdf')
OUTPUT = Path('output/pdf/Dattatray_Sable_Resume_Projects_Six_Cards.pdf').resolve()

with pdfplumber.open(SOURCE) as source_pdf:
    page_text = source_pdf.pages[0].extract_words()
    heading_word = next(w for w in page_text if w['text'] == 'SELECTED' and w['top'] > 300)
    heading_top = heading_word['top']
    # Last original project ends with the Aarohan link; content top coordinate.
    section_bottom_top = 789.5

reader = PdfReader(str(SOURCE))
original = reader.pages[0]
page_width, page_height = float(original.mediabox.width), float(original.mediabox.height)
left, right = 48.0, page_width - 48.0
font_regular, font_bold = r'C:\Windows\Fonts\arial.ttf', r'C:\Windows\Fonts\arialbd.ttf'
pdfmetrics.registerFont(TTFont('ResumeRegular', font_regular))
pdfmetrics.registerFont(TTFont('ResumeBold', font_bold))
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=(page_width, page_height))
navy, blue = HexColor('#142B49'), HexColor('#2563A6')
body, pale, line = HexColor('#202124'), HexColor('#F4F8FC'), HexColor('#D2DFED')
def y(top): return page_height - top

# Cover the original card region, from below the original section divider.
c.setFillColor(HexColor('#FFFFFF'))
c.rect(42, y(section_bottom_top + 6), page_width - 84,
       section_bottom_top - heading_top - 16, fill=1, stroke=0)

# Five unique projects retained from the uploaded PDF.
cards = [('Enterprise Global Business Analytics', 'Independent SQL Server and Power BI portfolio project using a three-million-row demonstration dataset; covers data validation, fact and dimension modeling, DAX measures and business KPI dashboards. Dataset figures are illustrative, not employer results.', 'github.com/sabledattatray/enterprise-global-business-analytics-3m'), ('Enterprise Power BI Analytics Portfolio', 'Nine-page Power BI dashboard design reference on a synthetic 231,130-row retail dataset: star-schema model, 66 documented DAX measures, Power Query methods and automated data validation. Design references and illustrative data, not employer results.', 'github.com/sabledattatray/enterprise-power-bi-dashboard'), ('Excel Dashboard & Automation Platform', 'Independent browser-based Excel and CSV analytics project supporting dataset analysis, dashboard automation, KPI reporting and downloadable reports.', 'excel.dattasable.com'), ('Microsoft Fabric Engineering Workspace', 'Independent technical portfolio exploring Fabric analytics architecture, capacity planning and scenario modeling. Demonstrates project-based exposure rather than an employer implementation.', 'fabric.dattasable.com'), ('Fabric Master', 'Open-source Microsoft Fabric capacity-planning platform (TypeScript): SKU recommendation, cost estimation, growth forecasting and executive PDF reports.', 'github.com/sabledattatray/fabric-master'), ('Aarohan AI', 'Local-first AI assistant built in Python, FastAPI and PyTorch to run on consumer hardware, combining a SQLite rule engine, persistent memory, math verification and an output-verification gate, covered by 216 automated tests.', 'github.com/sabledattatray/aarohan-ai')]

gap_x, gap_y = 10, 7
card_w, card_h = (right-left-gap_x)/2, 88
start_top = heading_top + 20
for i, (title, desc, url) in enumerate(cards):
    col, row = i % 2, i // 2
    x0 = left + col * (card_w + gap_x)
    top = start_top + row * (card_h + gap_y)
    c.setFillColor(pale); c.setStrokeColor(line); c.setLineWidth(.65)
    c.roundRect(x0, y(top+card_h), card_w, card_h, 2, fill=1, stroke=1)
    c.setFillColor(blue); c.roundRect(x0, y(top+card_h), 3, card_h, 1.5, fill=1, stroke=0)
    tx = x0 + 10
    c.setFillColor(navy); c.setFont('ResumeBold', 9.4)
    c.drawString(tx, y(top+15), title)
    c.setFillColor(blue); c.setFont('ResumeBold', 7.4)
    c.drawString(tx, y(top+26), 'INDEPENDENT PORTFOLIO')
    c.setFillColor(body); c.setFont('ResumeRegular', 7.5)
    lines = simpleSplit(desc, 'ResumeRegular', 7.5, card_w-20)
    for j, text in enumerate(lines[:5]):
        c.drawString(tx, y(top+37+j*8.0), text)
    c.setFillColor(blue); c.setFont('ResumeRegular', 6.8)
    c.drawString(tx, y(top+card_h-5), url)

c.save(); buf.seek(0)
overlay = PdfReader(buf).pages[0]
# Replace the old project drawing block, preserving surrounding uploaded content.
original_data = original.get_contents().get_data()
heading_end = original_data.find(b'(SELECTED TECHNICAL PROJECTS) Tj T* ET')
if heading_end < 0:
    raise ValueError('Could not locate uploaded projects heading')
heading_end += len(b'(SELECTED TECHNICAL PROJECTS) Tj T* ET')
section_start = original_data.find(b'1 0 0 1 48 49.78976 cm', heading_end)
if section_start < 0:
    raise ValueError('Could not locate uploaded project cards')
section_end = original_data.find(b'Q\nQ\nQ', section_start)
if section_end < 0:
    raise ValueError('Could not locate original page footer')
overlay_data = overlay.get_contents().get_data()
# Match original card drawing origin (48, 49.78976) by wrapping overlay content.
overlay_data = overlay_data
combined = DecodedStreamObject(); combined.set_data(original_data[:section_start]+overlay_data+b'\n'+original_data[section_end:])
original[NameObject('/Contents')] = combined
page_resources = original[NameObject('/Resources')].get_object()
page_fonts = page_resources[NameObject('/Font')].get_object()
overlay_fonts = overlay[NameObject('/Resources')].get_object()[NameObject('/Font')].get_object()
for key, value in overlay_fonts.items():
    base = str(value.get_object().get('/BaseFont', ''))
    if 'ArialMT' in base and 'Bold' not in base:
        page_fonts[NameObject('/F4')] = value
        overlay_data = overlay_data.replace(b'/F2+0', b'/F4')
    elif 'Arial-BoldMT' in base:
        page_fonts[NameObject('/F5')] = value
        overlay_data = overlay_data.replace(b'/F3+0', b'/F5')
writer = PdfWriter()
writer.add_page(original)
writer.add_page(reader.pages[1])
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with OUTPUT.open('wb') as stream: writer.write(stream)
print(OUTPUT)





