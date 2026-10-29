"""Publish only validated resumes to existing and role-specific website paths."""
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
results = json.loads((ROOT / 'validation-results.json').read_text())
assert len(results) == 3 and all(r['checks'] == 'PASS' for r in results)
assert json.loads((ROOT / 'data/candidate.json').read_text())['dbs_end_date']
public = ROOT.parent / 'public'
target = public / 'resumes'; target.mkdir(exist_ok=True)
manifest = []
for row in results:
    for suffix in ['.pdf', '.docx']:
        source = ROOT / 'output' / (row['file'] + suffix)
        destination = target / source.name
        shutil.copy2(source, destination)
        manifest.append({'path': '/resumes/' + source.name, 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'bytes': destination.stat().st_size})
default = ROOT / 'output/Dattatray_Sable_Senior_MIS_Reporting_Analyst.pdf'
shutil.copy2(default, public / 'Dattatray_Sable_Resume.pdf')
(ROOT / 'publication-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Published six validated files; existing /Dattatray_Sable_Resume.pdf now serves the Senior MIS version.')
