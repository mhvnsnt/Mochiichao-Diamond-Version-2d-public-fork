"""The upgrade loop (Addendum 7D), as a mechanism: every failure,
rejection, or capability gap Wielder hits becomes a queue card; where
the failure is an owner rejection it also becomes a regression-pin
request (wielder.pinning). Wielder may PROPOSE its own upgrades through
these cards — upgrades land through the same gates and scorer
separation as all other work. Wielder never edits its own gates,
thresholds, methods, or constitution.
"""
from __future__ import annotations

from typing import Optional

from .queue import Board


def propose_upgrade_card(board: Board, title: str, description: str,
                         column: str = "Backlog") -> Optional[int]:
    """Create the upgrade card on the finish queue. Returns the card id,
    or None if the board door is down (the proposal is then recorded in
    the run packet instead — a proposal is never silently dropped)."""
    try:
        cols = board.columns()
        return board.call("createTask", project_id=1, title=title,
                          column_id=cols[column], description=description)
    except Exception:
        return None
