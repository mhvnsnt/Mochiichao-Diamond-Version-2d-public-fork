"""Current-version resolver (Counter-addition #9): before any build or
submission step, each piece the run touches is resolved to its CURRENT
registered version, per piece and per use. A superseded piece is a hard
fail unless a written exception rides the run.
"""
from __future__ import annotations

from typing import Any

from . import methods as M


class VersionError(RuntimeError):
    pass


def resolve_run_pieces(target: dict[str, Any], exception: str | None = None) -> list[dict]:
    """Resolves the target's methods (always) and any target-declared
    `pieces` entries of the form {piece, registry_status} generically."""
    resolved = []
    for mid in target.get("method_ids", []):
        m = M.get_method(mid)
        if m["status"] != "Accepted":
            if not exception:
                raise VersionError(
                    f"method {mid} is {m['status']}, not the current Accepted method; "
                    "no written exception rides this run")
            resolved.append({"piece": mid, "kind": "method", "status": m["status"],
                             "exception": exception})
        else:
            resolved.append({"piece": mid, "kind": "method", "status": "Accepted (current)"})
    for piece in target.get("pieces", []):
        status = piece.get("registry_status", "unknown")
        if status not in ("current", "Accepted (current)"):
            if not exception:
                raise VersionError(
                    f"piece {piece.get('piece')} resolves to {status}, not current; "
                    "no written exception rides this run")
        resolved.append({"piece": piece.get("piece"), "kind": "piece", "status": status})
    return resolved
