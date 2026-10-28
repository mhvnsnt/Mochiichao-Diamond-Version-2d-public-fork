"""Rules-registry check (Counter-addition #12): plans and task text are
checked against the compiled standing-law registry BEFORE execution.
Settled owner rulings are never re-litigated or re-asked; a banned term
fails the plan with the ruling cited.
"""
from __future__ import annotations

import json

from . import constitution as C

RULES = json.loads((C.WIELDER_HOME / "rules.json").read_text())


class RuleViolation(RuntimeError):
    pass


def check_text(text: str, context: str = "plan") -> list[str]:
    """Returns the list of settled rulings the text touches cleanly;
    raises RuleViolation on a banned term."""
    hits = []
    for banned, ruling in RULES["naming_laws"]["banned_terms"].items():
        if banned.lower() in text.lower():
            raise RuleViolation(f"{context}: banned term {banned!r} — settled ruling: {ruling}")
    for ruling in RULES["settled_rulings_never_relitigated"]:
        key = ruling.split(";")[0].split("—")[0].strip().lower()
        if key and key in text.lower():
            hits.append(ruling)
    return hits
