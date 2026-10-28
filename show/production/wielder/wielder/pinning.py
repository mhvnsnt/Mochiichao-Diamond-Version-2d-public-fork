"""Regression pinning (Counter-addition #6): every owner rejection is
converted at intake into a pin REQUEST. Wielder cannot write the gate
set itself — scorer separation (Counter-addition #5) forbids the worker
holding a write path to gates. So the pinning node's output is a
pin-request artifact that the gate-owning lane applies with the
finish-gate's own review/record_rejection.py (which pins the clause
into gates/regressions.json as its own commit). A defect class reaches
the owner at most once: the request is generated automatically from the
run's evidence, not from a worker's memory.
"""
from __future__ import annotations

import json

from . import constitution as C
from .ledger import Ledger


def build_pin_request(ledger: Ledger, run_id: str, defect_class: str,
                      owner_words: str) -> str:
    run = ledger.get_run(run_id)
    req = {
        "kind": "regression-pin-request",
        "run_id": run_id,
        "target_id": run["target_id"],
        "defect_class": defect_class,
        "owner_words": owner_words,
        "manifest_path": run["manifest_path"],
        "manifest_sha256": run["manifest_sha256"],
        "apply_with": "finish-gate/review/record_rejection.py (gate lane, separate commit)",
    }
    out = C.DATA / "pins" / f"{run_id}-pin-request.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(req, indent=1))
    return str(out)
