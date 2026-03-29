from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAIN = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">'
DEFER = """    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></noscript>"""

for p in sorted(ROOT.glob("*.html")):
    if p.name == "index.html":
        continue
    t = p.read_text(encoding="utf-8")
    if PLAIN not in t:
        continue
    p.write_text(t.replace(PLAIN, DEFER, 1), encoding="utf-8")
    print(p.name)
