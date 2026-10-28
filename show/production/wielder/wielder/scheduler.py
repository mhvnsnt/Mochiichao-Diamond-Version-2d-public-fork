"""Scheduled/background work — Wielder's equivalent of the platform's
scheduling (documented behaviour, ~/docs/scheduling-and-watching.md):
scheduled checks are POLLING, not watching; timing is loose; a run that
is interrupted resumes if it safely can, else is recorded as stopped
and the next cycle goes ahead. Wielder's heartbeat polls the finish
queue on an interval and processes Ready cards one at a time (WIP=1,
no-idle: a parked card never blocks the cycle).
"""
from __future__ import annotations

import time

from .graph import run_card
from .ledger import Ledger
from .queue import Board
from .report import build_packet


def heartbeat_cycle(ledger: Ledger, board: Board, max_cards: int = 3) -> list[dict]:
    out = []
    for _ in range(max_cards):
        card = board.first_ready_card()
        if card is None:
            break
        result = run_card(ledger, board, card)
        run = ledger.get_run(result["run_id"])
        build_packet(ledger, result["run_id"])
        out.append({"run_id": result["run_id"], "card_id": card["id"],
                    "state": run["state"], "blocker": run["blocker"]})
    return out


def heartbeat(interval_seconds: int = 21600, once: bool = False) -> None:
    """Default interval mirrors the standing 6h studio-orchestrator
    pattern. Timing is approximate by design (polling, not watching)."""
    ledger, board = Ledger(), Board()
    while True:
        heartbeat_cycle(ledger, board)
        if once:
            return
        time.sleep(interval_seconds)
