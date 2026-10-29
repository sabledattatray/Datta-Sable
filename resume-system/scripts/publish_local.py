"""Copy the validated public master fallback only. Specialized files stay private."""
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
results = json.loads((ROOT / 'validation-results.json').read_text())
assert len(results) == 4 and all(r['checks'] == 'PASS' for r in results)
assert json.loads((ROOT / 'data/candidate.json').read_text())['dbs_end_date']
public = ROOT.parent / 'public'
target = public / 'resume'; target.mkdir(exist_ok=True)
manifest = []
source = ROOT / 'output/Dattatray_Sable_Master_Professional_Resume.pdf'
destination = target / 'master.pdf'
shutil.copy2(source, destination)
preview = ROOT / 'previews/Dattatray_Sable_Master_Professional_Resume/page-1.png'
shutil.copy2(preview, target / 'master-preview.png')
manifest.append({'path': '/Dattatray_Sable_Resume.pdf', 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'bytes': destination.stat().st_size})
(ROOT / 'publication-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Local public master PDF and presentation image updated. No specialized documents published.')
