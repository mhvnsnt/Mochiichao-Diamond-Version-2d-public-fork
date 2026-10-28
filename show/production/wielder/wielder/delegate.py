"""Delegation to sub-workers — Wielder's equivalent of the platform's
subagent delegation (documented behaviour: a delegated worker gets the
outcome, exact known choices, constraints, and only the information it
needs; its result arrives as a handoff; an acceptance receipt is not
completion).

A Wielder delegation is a full child run of the same graph on a named
card, linked to its parent in data/delegations/. The child is graded by
the same verifier; the parent's packet cites the child's packet —
never the child's prose, because there is none: messages are schema
JSON and packets are generated from artifacts.
"""
from __future__ import annotations

import json

from . import constitution as C
from .graph import run_card
from .ledger import Ledger
from .queue import Board
from .report import build_packet


def delegate(ledger: Ledger, board: Board, parent_run_id: str, card: dict,
             scope_note: str) -> dict:
    result = run_card(ledger, board, card)
    child_id = result["run_id"]
    packet = build_packet(ledger, child_id)
    record = {"parent_run_id": parent_run_id, "child_run_id": child_id,
              "card_id": int(card["id"]), "scope": scope_note,
              "child_packet": str(packet),
              "child_state": ledger.get_run(child_id)["state"]}
    out = C.DATA / "delegations" / f"{child_id}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(record, indent=1))
    return record
