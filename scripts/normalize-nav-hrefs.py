"""One-off: replace legacy index.html# anchor hrefs with split-page URLs."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPLS = [
    ('href="index.html#properties"', 'href="homes-for-sale.html"'),
    ('href="index.html#neighborhoods"', 'href="neighborhoods.html"'),
    ('href="index.html#schools"', 'href="community.html"'),
    ('href="index.html#about"', 'href="community.html"'),
    ('href="index.html#booking"', 'href="schedule.html"'),
]

def main() -> None:
    for p in ROOT.rglob("*.html"):
        if "node_modules" in p.parts:
            continue
        t = p.read_text(encoding="utf-8")
        orig = t
        for a, b in REPLS:
            t = t.replace(a, b)
        if t != orig:
            p.write_text(t, encoding="utf-8")
            print(p.relative_to(ROOT))

if __name__ == "__main__":
    main()
