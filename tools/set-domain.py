#!/usr/bin/env python3
"""Move the site to its own domain in one step.

    python3 tools/set-domain.py https://loni-ks.com/

Replaces the GitHub Pages address in the canonical link, Open Graph tags,
structured data, robots.txt, sitemap.xml and the redirect pages, makes the
404 page's links work from the domain root, and writes the CNAME file that
GitHub Pages needs. Run it once, then commit and push.
"""
import sys
from pathlib import Path

OLD = "https://ariongj.github.io/LoniKS/"
OLD_PATH = "/LoniKS/"

if len(sys.argv) != 2 or not sys.argv[1].startswith("https://") or not sys.argv[1].endswith("/"):
    sys.exit("Usage: python3 tools/set-domain.py https://example.com/   (https, with the final slash)")
new = sys.argv[1]
host = new.split("/")[2]

root = Path(__file__).resolve().parent.parent
files = [root / "index.html", root / "robots.txt", root / "sitemap.xml", root / "README.md"]
files += sorted(root.glob("*/index.html"))  # redirect pages for the old site's URLs

changed = 0
for f in files:
    s = f.read_text(encoding="utf-8")
    t = s.replace(OLD, new)
    if t != s:
        f.write_text(t, encoding="utf-8")
        changed += 1
        print("updated", f.relative_to(root))

# GitHub Pages serves 404.html for every missing path, so its links are absolute.
page404 = root / "404.html"
s = page404.read_text(encoding="utf-8")
t = s.replace(f'"{OLD_PATH}', '"/')
if t != s:
    page404.write_text(t, encoding="utf-8")
    changed += 1
    print("updated 404.html")

(root / "CNAME").write_text(host + "\n", encoding="utf-8")
print(f"wrote CNAME ({host}); {changed} files updated")
