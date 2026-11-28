from pathlib import Path
import io
import pdfplumber
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, ArrayObject
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

source = Path(r'C:\Users\sable\Downloads\Dattatray_Sable_Master_Professional_Resume_Updated.pdf')
output = Path('output/pdf/Dattatray_Sable_Resume_Projects_Cleaned.pdf').resolve()
with pdfplumber.open(source) as pdf:
    p = pdf.pages[0]
    heading = next(w for w in p.extract_words() if w['text'] == 'SELECTED' and w['top'] > 300)
    heading_y = heading['top']
    section_end = 788.5

reader = PdfReader(str(source))
page = reader.pages[0]
height = float(page.mediabox.height)
left, right = 48.0, float(page.mediabox.width) - 48.0
regular = r'C:\Windows\Fonts\arial.ttf'
bold = r'C:\Windows\Fonts\arialbd.ttf'
pdfmetrics.registerFont(TTFont('Carlito', regular))
pdfmetrics.registerFont(TTFont('Carlito-Bold', bold))
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=(float(page.mediabox.width), height))
navy, blue = HexColor('#142B49'), HexColor('#2563A6')
ink, fill, border = HexColor('#202124'), HexColor('#F4F8FC'), HexColor('#D2DFED')
def y(top_y):
    return height - top_y

c.setFillColor(HexColor('#FFFFFF'))
c.rect(42, y(section_end + 5), 511, section_end - heading_y + 10, stroke=0, fill=1)
c.setFont('Carlito-Bold', 10.5); c.setFillColor(navy)
c.drawString(left, y(heading_y + 9), 'SELECTED TECHNICAL PROJECTS')
c.setStrokeColor(border); c.setLineWidth(0.7)
c.line(left, y(heading_y + 16), right, y(heading_y + 16))

cards = [
 ('Enterprise Global Business Analytics', 'Independent SQL Server and Power BI portfolio project using a three-million-row demonstration dataset; covers data validation, fact and dimension modeling, DAX measures and business KPI dashboards. Dataset figures are illustrative, not employer results.', 'github.com/sabledattatray/enterprise-global-business-analytics-3m'),
 ('Excel Dashboard & Automation Platform', 'Independent browser-based Excel and CSV analytics project supporting dataset analysis, dashboard automation, KPI reporting and downloadable reports.', 'excel.dattasable.com'),
 ('Microsoft Fabric Engineering Workspace', 'Independent technical portfolio exploring Fabric analytics architecture, capacity planning and scenario modeling. Demonstrates project-based exposure rather than an employer implementation.', 'fabric.dattasable.com'),
 ('Aarohan AI', 'Local-first AI assistant built in Python, FastAPI and PyTorch to run on consumer hardware, combining a SQLite rule engine, persistent memory, math verification and an output-verification gate, covered by 216 automated tests.', 'github.com/sabledattatray/aarohan-ai'),
]
gap_x, gap_y = 10, 7
card_w, card_h = (right-left-gap_x)/2, 91
start_top = heading_y + 23
for i, (title, desc, link) in enumerate(cards):
    col, row = i % 2, i // 2
    x0 = left + col*(card_w+gap_x)
    t0 = start_top + row*(card_h+gap_y)
    c.setFillColor(fill); c.setStrokeColor(border); c.setLineWidth(0.65)
    c.roundRect(x0, y(t0+card_h), card_w, card_h, 2, stroke=1, fill=1)
    c.setFillColor(blue); c.roundRect(x0, y(t0+card_h), 3, card_h, 1.5, stroke=0, fill=1)
    tx=x0+10
    c.setFillColor(navy); c.setFont('Carlito-Bold',9.6); c.drawString(tx,y(t0+15),title)
    c.setFillColor(blue); c.setFont('Carlito-Bold',7.6); c.drawString(tx,y(t0+26),'INDEPENDENT PORTFOLIO')
    c.setFillColor(ink); c.setFont('Carlito',8.0)
    for j,line in enumerate(simpleSplit(desc,'Carlito',8.0,card_w-20)[:4]):
        c.drawString(tx,y(t0+39+j*10),line)
    c.setFillColor(blue); c.setFont('Carlito',7.6); c.drawString(tx,y(t0+card_h-8),link)

title, desc, link = cards[3]
t0, ch, cw = start_top+2*(card_h+gap_y), 56, right-left
c.setFillColor(fill); c.setStrokeColor(border); c.setLineWidth(0.65)
c.roundRect(left,y(t0+ch),cw,ch,2,stroke=1,fill=1)
c.setFillColor(blue); c.roundRect(left,y(t0+ch),3,ch,1.5,stroke=0,fill=1)
tx=left+10
c.setFillColor(navy); c.setFont('Carlito-Bold',9.6); c.drawString(tx,y(t0+14),title)
c.setFillColor(blue); c.setFont('Carlito-Bold',7.6); c.drawString(tx,y(t0+25),'INDEPENDENT PORTFOLIO')
c.setFillColor(ink); c.setFont('Carlito',8.0)
for j,line in enumerate(simpleSplit(desc,'Carlito',8.0,cw-20)[:2]): c.drawString(tx,y(t0+37+j*10),line)
c.setFillColor(blue); c.setFont('Carlito',7.6); c.drawString(tx,y(t0+ch-7),link)
c.save(); buf.seek(0)
# Append overlay resources/content explicitly; pypdf merge_page does not retain
# source subset fonts referenced by Form XObjects in this source PDF.
overlay = PdfReader(buf).pages[0]
# ReportLab subset-tags these embedded fonts. Rename overlay references to their
# registered base keys so they resolve to the exact same subset fonts as page 1.
ovfonts = overlay['/Resources']['/Font']
for key in list(ovfonts.keys()):
    font = ovfonts[key].get_object()
    base = str(font.get('/BaseFont', ''))
    if 'Carlito-Regular' in base:
        newkey = NameObject('/F2+0')
    elif 'Carlito-Bold' in base:
        newkey = NameObject('/F3+0')
    else:
        continue
    data = overlay.get_contents().get_data()
    import re
    oldname = key[1:].encode('ascii')
    newname = newkey[1:].encode('ascii')
    data = re.sub(rb'/' + re.escape(oldname) + rb'(?=\s)', b'/' + newname, data)
    # Replace reportlab's bold/regular font role mapping with the source's
    # corresponding Carlito subsets (ReportLab registers its own font order).
    if newkey == NameObject('/F2+0'):
        data = data.replace(b'/F2+0 Tf', b'/F3+0 Tf').replace(b'/F2+0  ', b'/F3+0  ')
    else:
        data = data.replace(b'/F3+0 Tf', b'/F2+0 Tf').replace(b'/F3+0  ', b'/F2+0  ')
    from pypdf.generic import DecodedStreamObject
    stream = DecodedStreamObject(); stream.set_data(data)
    overlay[NameObject('/Contents')] = stream
    # Drop reportlab font aliases and use original embedded font references.
    for oldkey in list(ovfonts.keys()):
        if 'Carlito' in str(ovfonts[oldkey].get_object().get('/BaseFont', '')):
            del ovfonts[oldkey]
    ovfonts[newkey] = page['/Resources']['/Font'][newkey]
old_content = page.get_contents().get_data()
new_content = overlay.get_contents().get_data()
from pypdf.generic import DecodedStreamObject
combined = DecodedStreamObject()
combined.set_data(old_content + b'\n' + new_content)
page[NameObject('/Contents')] = combined
resources = page[NameObject('/Resources')]
base_fonts = resources[NameObject('/Font')]
for k, v in overlay[NameObject('/Resources')][NameObject('/Font')].items():
    if k in ['/F2+0', '/F3+0']:
        base_fonts[NameObject(k)] = v
writer=PdfWriter(); writer.clone_document_from_reader(reader)
with output.open('wb') as f: writer.write(f)
print(output)


