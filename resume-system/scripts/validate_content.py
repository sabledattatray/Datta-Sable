"""Block publication if critical facts drift or website employment stays current."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
candidate = json.loads((ROOT / 'data/candidate.json').read_text())
jobs = json.loads((ROOT / 'data/experience.json').read_text())
status = json.loads((ROOT / 'data/verification_status.json').read_text())
assert candidate['dbs_end_date'] == jobs[0]['end'] == 'September 2026'
assert status['dbs_end_date']['status'] == 'VERIFIED'
assert candidate['email'] == 'resume@dattasable.com'
assert candidate['education']['year'] == 2005
assert [j['employer'] for j in jobs] == ['DBS Mintek Pvt. Ltd.', 'SASCO', 'Kissht Finance Ltd.', 'HDFC Bank Ltd.']
assert all(j['start'] and j['end'] and j['end'] != 'Present' for j in jobs)
for relative in ['components/AboutContent.tsx', 'Datta_Sable_Resume.md', 'PROFILE_README.md', 'scripts/sync-static-pages-to-db.ts']:
    text = (ROOT.parent / relative).read_text(encoding='utf-8')
    for unsupported in ['2025 — Present', '2025 – Present', '2025—PRES', 'CURRENT CHAPTER', 'CASCO', 'reducing manual effort by 40%', '100% audit compliance', 'sabledattatray@gmail.com']:
        assert unsupported not in text, f'{relative}: outdated claim {unsupported}'
assert (ROOT / 'source/original-supplied.pdf').exists()
assert (ROOT / 'source/original-website.pdf').exists()
print('Canonical facts, historical employment, current project copy and preserved originals: PASS')
