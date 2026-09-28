"""Build docs/3D-World-Documentation.pdf from docs/DOCUMENTATION.md.

Requires: pip install markdown playwright && python -m playwright install chromium
Usage (project root): python scripts/build_docs_pdf.py
"""
import pathlib
import markdown
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
docs = root / "docs"
body = markdown.markdown((docs / "DOCUMENTATION.md").read_text(encoding="utf-8"),
                         extensions=["tables", "fenced_code", "toc"])
css = """
@page { size: A4; margin: 18mm 16mm; }
body { font: 10.5pt/1.5 'Segoe UI', Arial, sans-serif; color: #1c2420; }
h1 { font-size: 22pt; color: #14532d; border-bottom: 3px solid #4ade80; padding-bottom: 6px; }
h2 { font-size: 15pt; color: #14532d; margin-top: 22px; border-bottom: 1px solid #d5ded8; padding-bottom: 3px; page-break-after: avoid; }
h3 { font-size: 12pt; color: #1f6b3d; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 9.5pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { background: #14532d; color: #fff; text-align: left; }
th, td { border: 1px solid #c9d4cd; padding: 4px 7px; vertical-align: top; }
tr:nth-child(even) td { background: #f3f8f5; }
code { font-family: Consolas, monospace; background: #eef3ef; padding: 1px 4px; border-radius: 3px; font-size: 9.3pt; }
pre { background: #0f1f15; color: #e6f4ea; padding: 10px 12px; border-radius: 6px; page-break-inside: avoid; }
pre code { background: none; color: inherit; padding: 0; }
img { max-width: 100%; border: 1px solid #c9d4cd; border-radius: 6px; margin: 6px 0; page-break-inside: avoid; }
hr { border: 0; border-top: 1px solid #d5ded8; }
"""
html = f"<!doctype html><html><head><meta charset='utf-8'><title>My First 3D World Documentation</title><style>{css}</style></head><body>{body}</body></html>"
page_html = docs / "_build.html"
page_html.write_text(html, encoding="utf-8")
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(page_html.as_uri())
        pg.pdf(path=str(docs / "3D-World-Documentation.pdf"), format="A4", print_background=True,
               display_header_footer=True,
               header_template="<span></span>",
               footer_template="<div style='font-size:8px;width:100%;text-align:center;color:#666'>My First 3D World &middot; page <span class='pageNumber'></span> of <span class='totalPages'></span></div>",
               margin={"top": "18mm", "bottom": "18mm", "left": "16mm", "right": "16mm"})
        b.close()
finally:
    page_html.unlink(missing_ok=True)
print("wrote", docs / "3D-World-Documentation.pdf")
