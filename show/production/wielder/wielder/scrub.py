"""First-person scrubbing (Addendum 2.1b): task text is rewritten into
objective third-person instructions before it reaches any worker node,
so authorship anchoring ("fix this code I wrote") cannot bias a run.
Deterministic regex rules; covered by tests.
"""
from __future__ import annotations

import re

_RULES: list[tuple[str, str]] = [
    # validation/praise openers are stripped entirely
    (r"^(great|good|nice|excellent|perfect)[.!]?\s+", ""),
    # first-person authorship anchoring
    (r"\bI wrote\b", "the author wrote"),
    (r"\bI built\b", "the author built"),
    (r"\bI made\b", "the author made"),
    (r"\bI created\b", "the author created"),
    (r"\bmy code\b", "the code under review"),
    (r"\bmy show\b", "the show"),
    (r"\bmy episode\b", "the episode"),
    (r"\bmy file\b", "the file"),
    (r"\bmy\b", "the"),
    (r"\bI\b", "the operator"),
    (r"\bme\b", "the operator"),
    (r"\bwe need\b", "the task requires"),
    (r"\bplease\b", ""),
]


def scrub(text: str) -> str:
    out = text or ""
    for pat, rep in _RULES:
        out = re.sub(pat, rep, out, flags=re.IGNORECASE if pat.startswith("^") else 0)
    return re.sub(r"\s{2,}", " ", out).strip()
