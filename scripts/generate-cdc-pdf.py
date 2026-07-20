#!/usr/bin/env python3
"""Génère le PDF du cahier des charges depuis le fichier Markdown."""
import pathlib
import markdown
from xhtml2pdf import pisa

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "docs" / "CAHIER-DES-CHARGES-IksaTech-LogiTrans.md"
PDF_PATH = ROOT / "docs" / "CAHIER-DES-CHARGES-IksaTech-LogiTrans.pdf"

CSS = """
@page {
  size: A4;
  margin: 1.8cm 1.6cm 2cm 1.6cm;
}
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 10pt;
  color: #1a1a1a;
  line-height: 1.45;
}
h1 {
  font-size: 20pt;
  color: #0f3d6e;
  border-bottom: 2px solid #0f3d6e;
  padding-bottom: 6px;
}
h2 {
  font-size: 14pt;
  color: #0f3d6e;
  margin-top: 18px;
  border-bottom: 1px solid #c5d5e8;
  padding-bottom: 4px;
}
h3 { font-size: 11pt; color: #1e5a96; margin-top: 14px; }
h4 { font-size: 10pt; color: #333; margin-top: 10px; }
p, li { margin: 4px 0; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 14px;
  font-size: 9pt;
}
th {
  background-color: #0f3d6e;
  color: #ffffff;
  padding: 6px 8px;
  text-align: left;
}
td {
  border: 1px solid #d0d0d0;
  padding: 5px 8px;
  vertical-align: top;
}
pre {
  font-family: Courier, monospace;
  font-size: 8.5pt;
  background-color: #f4f6f8;
  padding: 8px;
  border: 1px solid #dde3ea;
  white-space: pre-wrap;
}
hr { border: none; border-top: 1px solid #cccccc; margin: 16px 0; }
strong { color: #0f3d6e; }
"""


def main():
    md_text = MD_PATH.read_text(encoding="utf-8")
    body_html = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br"],
    )
    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>Cahier des charges - IksaTech LogiTrans</title>
  <style>{CSS}</style>
</head>
<body>{body_html}</body>
</html>"""

    with PDF_PATH.open("wb") as pdf_file:
        status = pisa.CreatePDF(html, dest=pdf_file, encoding="utf-8")

    if status.err:
        raise SystemExit(f"Erreur génération PDF (code {status.err})")

    size_kb = PDF_PATH.stat().st_size // 1024
    print(f"PDF généré : {PDF_PATH} ({size_kb} Ko)")


if __name__ == "__main__":
    main()
