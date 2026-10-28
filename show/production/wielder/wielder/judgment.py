"""Full-standard self-judgment (Counter-addition #8): before OWNER_REVIEW,
the complete standard is assembled — machine clauses + advisory
measurers — likeness first, failures first, and written into the packet.
A passed side-metric never headlines a run whose core clause failed.
"""
from __future__ import annotations

ANCHOR_MEASURERS = ("frame1_anchor",)  # likeness first, by grading law


def _order(clauses: list[dict]) -> list[dict]:
    def key(c):
        anchor = 0 if c.get("measurer") in ANCHOR_MEASURERS or c.get("id") == "AC-03" else 1
        failed = 0 if c.get("status") != "PASS" else 1
        return (failed, anchor)
    return sorted(clauses, key=key)


def headline(manifest: dict) -> str:
    clauses = manifest.get("clauses", [])
    failed = [c for c in clauses if c.get("status") != "PASS"]
    if failed:
        first = _order(failed)[0]
        return f"CORE RESULT: FAIL — {first.get('id')} ({first.get('measurer')}) measured: {str(first.get('measured'))[:120]}"
    if (manifest.get("owner_gate") or {}).get("status") != "APPROVED":
        return "CORE RESULT: machine clauses PASS — owner gate has not ruled (not done)"
    return "CORE RESULT: clauses PASS and owner gate APPROVED (per manifest)"


def judgment_section(manifest: dict) -> str:
    lines = ["## Full-standard self-judgment (failures first, likeness first)", "",
             headline(manifest), ""]
    for c in _order(manifest.get("clauses", [])):
        lines.append(f"- {c.get('id')} [{c.get('measurer')}]: {c.get('status')} — "
                     f"measured: {str(c.get('measured'))[:160]} — threshold: {str(c.get('threshold'))[:100]}")
    pins = manifest.get("pinned_regressions_applied") or []
    if pins:
        lines.append(f"- Pinned regressions applied by the verifier: {pins}")
    return "\n".join(lines)
