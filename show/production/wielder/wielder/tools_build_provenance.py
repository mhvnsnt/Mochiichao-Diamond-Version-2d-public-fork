#!/usr/bin/env python3
"""Provenance-manifest generator: hashes every vendored + gap-fill file
in this package and prints the manifest body. If a piece is not in the
manifest with a hash, it is not claimed as part of Wielder."""
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def sha(p: Path) -> str:
    h = hashlib.sha256()
    h.update(p.read_bytes())
    return h.hexdigest()

for section, sub in (("VENDORED — owner's earlier agent system (donor), literal carry-over", "vendor"),
                     ("GAP-FILL — Wielder wiring written for this assembly", "")):
    print(f"\n### {section}\n")
    base = ROOT / sub if sub else ROOT
    for p in sorted(base.rglob("*")):
        if p.is_file() and "__pycache__" not in str(p) and "data" not in p.parts and p.name != "tools_build_provenance.py":
            if not sub and (p.name.startswith("tools_build") or "vendor" in p.parts):
                continue
            print(f"| `{p.relative_to(ROOT)}` | sha256 {sha(p)} | {p.stat().st_size} B |")
