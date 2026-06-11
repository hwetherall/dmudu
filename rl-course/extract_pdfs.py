"""Extract text from rl-course PDFs into individual and combined markdown files."""

from __future__ import annotations

import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "markdown"
MASTER_PATH = ROOT / "RL-Course-Master.md"

# Footer/header noise from Daily Dose of DS PDF exports
NOISE_PATTERNS = [
    re.compile(r"^\d{1,2}/\d{1,2}/\d{2,4}, \d{1,2}:\d{2} [AP]M\s*$", re.MULTILINE),
    re.compile(r"^https://www\.dailydoseofds\.com/rl-course-part-\d+/\s*$", re.MULTILINE),
    re.compile(r"^\d+/\d+\s*$", re.MULTILINE),
    re.compile(r"^(\d+\s+min read|min read)\s*$", re.MULTILINE),
]

REPLACEMENTS = {
    "\ufffd": "'",
    "\u2019": "'",
    "\u2018": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2013": "-",
    "\u2014": "-",
    "\u2026": "...",
    "\u00a0": " ",
}


def slug_from_stem(stem: str) -> str:
    """Turn '1-Foundations of Reinforcement Learning' into a filename stem."""
    name = re.sub(r"^\d+-", "", stem).strip()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"\s+", "-", name)
    return name


def title_from_stem(stem: str) -> str:
    """Human-readable title without numeric prefix."""
    return re.sub(r"^\d+-", "", stem).strip()


def clean_text(text: str, doc_title: str | None = None) -> str:
    for old, new in REPLACEMENTS.items():
        text = text.replace(old, new)
    for pattern in NOISE_PATTERNS:
        text = pattern.sub("", text)
    if doc_title:
        # Drop repeated page header titles on their own line
        title_pattern = re.compile(
            rf"^\s*{re.escape(doc_title)}\s*$", re.MULTILINE | re.IGNORECASE
        )
        text = title_pattern.sub("", text)
    # Collapse excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf(pdf_path: Path) -> str:
    doc = fitz.open(pdf_path)
    doc_title = title_from_stem(pdf_path.stem)
    parts: list[str] = []
    for page in doc:
        page_text = page.get_text("text")
        if page_text.strip():
            parts.append(clean_text(page_text, doc_title))
    doc.close()
    return "\n\n".join(parts)


def pdf_files_in_order() -> list[Path]:
    return sorted(ROOT.glob("*.pdf"), key=lambda p: p.name)


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    pdfs = pdf_files_in_order()
    if not pdfs:
        raise SystemExit(f"No PDF files found in {ROOT}")

    master_sections: list[str] = [
        "# Reinforcement Learning Course",
        "",
        "Combined text extraction from all course PDFs, in order.",
        "",
        "---",
        "",
    ]

    for index, pdf_path in enumerate(pdfs, start=1):
        stem = pdf_path.stem
        title = title_from_stem(stem)
        print(f"Extracting ({index}/{len(pdfs)}): {pdf_path.name}")

        body = extract_pdf(pdf_path)
        md_filename = f"{index:02d}-{slug_from_stem(stem)}.md"
        md_path = OUTPUT_DIR / md_filename

        individual_md = f"# {title}\n\n*Source: `{pdf_path.name}`*\n\n{body}\n"
        md_path.write_text(individual_md, encoding="utf-8")

        master_sections.extend(
            [
                f"## Part {index}: {title}",
                "",
                f"*Source: `{pdf_path.name}`*",
                "",
                body,
                "",
                "---",
                "",
            ]
        )

    MASTER_PATH.write_text("\n".join(master_sections).rstrip() + "\n", encoding="utf-8")
    print(f"\nWrote {len(pdfs)} markdown files to {OUTPUT_DIR}")
    print(f"Wrote master file: {MASTER_PATH}")


if __name__ == "__main__":
    main()
