"""Zero-trust advisory critic (Addendum 2.1c/2.1d). Advisory only: it
finds failure reasons; it cannot pass anything (Constitution #4).

Deterministic seat: failure reasons are generated from the verifier
manifest's own clause results — measured facts, not model opinion.
Negative sampling: the owner's real rejection cases are loaded as
fixtures and their ids recorded on every note. An LLM seat may replace
the wording generator behind the same schema and the same ban lint;
it can never change the routing, which reads the manifest only.
"""
from __future__ import annotations

import json
from pathlib import Path

from . import constitution as C
from .schemas import CriticNote

FIXTURES = C.WIELDER_HOME / "fixtures" / "rejection-cases.json"


def load_fixtures() -> list[dict]:
    return json.loads(FIXTURES.read_text())["cases"]


def review_manifest(manifest_result: dict) -> CriticNote:
    """Deterministic auditor pass over a read_manifest tool result."""
    fixtures = load_fixtures()
    reasons: list[str] = []
    if not manifest_result.get("exists"):
        reasons.append("No verifier manifest exists for the target — no evidence, no completion.")
    for clause in manifest_result.get("clauses", []):
        if clause.get("status") != "PASS":
            reasons.append(
                f"Clause {clause.get('id')} status {clause.get('status')} — "
                f"measured: {clause.get('measured')}")
    og = (manifest_result.get("owner_gate") or {}).get("status")
    if og and og != "APPROVED":
        reasons.append(f"Owner gate status is {og} — the owner's eye has not ruled.")
    return CriticNote(failure_reasons=reasons,
                      fixtures_consulted=[c["id"] for c in fixtures])
