"""Remove empty <style></style> blocks left after RealScout CSS extraction."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Multiline empty style with optional whitespace
EMPTY_STYLE = re.compile(r"\s*<style>\s*</style>\s*", re.M)

for p in sorted(ROOT.glob("*.html")):
    t = p.read_text(encoding="utf-8")
    t2 = EMPTY_STYLE.sub("\n", t)
    t2 = re.sub(
        r'(<link rel="dns-prefetch" href="//em\.realscout\.com">)<style>\s*</style>',
        r"\1",
        t2,
    )
    if t2 != t:
        p.write_text(t2, encoding="utf-8")
        print(p.name)
