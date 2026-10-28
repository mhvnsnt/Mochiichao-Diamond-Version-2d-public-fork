"""Claim linter (Counter-additions #1 and #10). Scans outgoing text —
reports, packets, board comments. A sentence carrying a completion
claim word (done / wired / proven / pass) is rejected unless the same
text carries a manifest id + sha256 to stand on. Two claim strings are
rejected outright unless a named hard blocker is attached:
'waiting on <service>' parking and 'only the owner can …' browser claims.
"""
from __future__ import annotations

import re

CLAIM_WORDS = re.compile(r"\b(done|wired|proven|pass|passed|complete|completed)\b", re.IGNORECASE)
MANIFEST_REF = re.compile(r"(evidence/\S+\.json|manifest\s+\S+).*?sha256:?\s*[0-9a-f]{16,}", re.IGNORECASE | re.DOTALL)
OWNER_ONLY = re.compile(r"only the (owner|user) can", re.IGNORECASE)
WAITING_ON = re.compile(r"waiting on [A-Z][A-Za-z]+", re.IGNORECASE)
HARD_BLOCKERS = ("physical act", "unshared credential", "payment card", "identity card")


class ClaimRejected(RuntimeError):
    pass


def lint(text: str) -> None:
    has_ref = bool(MANIFEST_REF.search(text))
    for sentence in re.split(r"(?<=[.!?])\s+", text):
        if CLAIM_WORDS.search(sentence) and not has_ref:
            raise ClaimRejected(
                f"claim without manifest id + hash: {sentence.strip()[:120]!r}")
    for pat, label in ((OWNER_ONLY, "owner-only claim"), (WAITING_ON, "waiting-on-service parking")):
        if pat.search(text) and not any(b in text.lower() for b in HARD_BLOCKERS):
            raise ClaimRejected(f"{label} without a named hard blocker: {text[:120]!r}")
    # Addendum 13 rejected-blocker rule: environment limits are
    # engineering inputs with counters (wielder/desktop.py). Stating
    # one as a blocker without an attempted desktop layer + evidence
    # is a rejected claim.
    for ph in ("headless", "no session bus", "needs a desktop", "needs a display", "gui only", "gui-only"):
        if ph in text.lower() and "desktop attempt evidence:" not in text.lower():
            raise ClaimRejected(
                f"environment blocker '{ph}' without a desktop-layer attempt — attempt "
                f"wielder.desktop self-provisioning and attach the evidence: {text[:120]!r}")
