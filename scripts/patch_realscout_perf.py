"""Remove blocking RealScout script + duplicate CSS; add deferred realscout-loader.js before </head>."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SCRIPT_PATTERNS = [
    re.compile(
        r'\s*<script\s+src="https://em\.realscout\.com/widgets/realscout-web-components\.umd\.js"[^>]*>\s*</script>\s*',
        re.I,
    ),
]

RS_STYLE = re.compile(
    r"\s*realscout-office-listings\s*\{[^}]*--rs-accent-color:\s*#[0-9a-fA-F]+;\s*\}\s*",
    re.M,
)

LOADER = '    <script src="assets/js/realscout-loader.js" defer></script>\n'

def patch_file(path: Path) -> bool:
    t = path.read_text(encoding="utf-8")
    if "em.realscout.com" not in t and "realscout-office-listings" not in t:
        return False
    orig = t
    for rx in SCRIPT_PATTERNS:
        t = rx.sub("", t)
    t = RS_STYLE.sub("\n", t)
    if "realscout-loader.js" not in t and "realscout-office-listings" in t:
        t = t.replace("</head>", LOADER + "</head>", 1)
    if t != orig:
        path.write_text(t, encoding="utf-8")
        return True
    return False


def main():
    n = 0
    for path in sorted(ROOT.glob("*.html")):
        if patch_file(path):
            print(path.name)
            n += 1
    print("patched", n, "files")


if __name__ == "__main__":
    main()
