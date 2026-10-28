"""Kanboard queue client — the finish queue is Wielder's work source.

Assembled from the board's own tooling: the JSON-RPC call pattern is
copied from finish-gate/board/seed_board.py (the owner's existing
system), not invented. Board: Kanboard 1.2.56 (MIT), self-hosted on
SQLite at 127.0.0.1:8899, localhost only. Credentials are the board's
documented local default (finish-gate/board/ADMIN-NOTE.txt), overridable
via WIELDER_BOARD_AUTH; never printed by this module.
"""
from __future__ import annotations

import base64
import json
import os
import sqlite3
import urllib.request
from pathlib import Path
from typing import Any, Optional

URL = "http://127.0.0.1:8899/jsonrpc.php"
PROJECT_ID = 1
BOARD_DB = Path.home() / "workspace/ep01-rebuild/finish-gate/board/kanboard/data/db.sqlite"


def _auth_header() -> str:
    raw = os.environ.get("WIELDER_BOARD_AUTH", "admin:admin")
    return "Basic " + base64.b64encode(raw.encode()).decode()


class Board:
    def __init__(self):
        self._id = 0

    def call(self, method: str, **params: Any) -> Any:
        self._id += 1
        req = urllib.request.Request(
            URL,
            data=json.dumps({"jsonrpc": "2.0", "id": self._id, "method": method, "params": params}).encode(),
            headers={"Content-Type": "application/json", "Authorization": _auth_header()},
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            out = json.loads(r.read())
        if "error" in out:
            raise RuntimeError(f"{method} -> {out['error']}")
        return out["result"]

    def columns(self) -> dict[str, int]:
        return {c["title"]: c["id"] for c in self.call("getColumns", project_id=PROJECT_ID)}

    def tasks_in(self, column_title: str) -> list[dict]:
        cols = self.columns()
        tasks = self.call("getAllTasks", project_id=PROJECT_ID, status_id=1)
        return [t for t in tasks if int(t["column_id"]) == cols[column_title]]

    def first_ready_card(self) -> Optional[dict]:
        ready = self.tasks_in("Ready")
        return ready[0] if ready else None

    def move(self, task_id: int, column_title: str) -> bool:
        cols = self.columns()
        return bool(self.call("moveTaskPosition", project_id=PROJECT_ID, task_id=task_id,
                              column_id=cols[column_title], position=1, swimlane_id=1))

    def comment(self, task_id: int, text: str) -> int:
        return self.call("createComment", task_id=task_id, user_id=1, content=text)

    def update_description(self, task_id: int, description: str) -> bool:
        task = self.call("getTask", task_id=task_id)
        return bool(self.call("updateTask", id=task_id, title=task["title"], description=description))

    def get_description(self, task_id: int) -> str:
        task = self.call("getTask", task_id=task_id)
        return task.get("description") or ""


class BoardSqlite:
    """Door 2 for board READS (multi-door router): the board's own SQLite
    data store, read-only, for when the PHP/API door is down. Writes never
    go through this door — a write needs the application, or it didn't
    happen in the board's own terms."""

    def __init__(self, db_path: Path = BOARD_DB):
        self.db_path = db_path

    def tasks_in(self, column_title: str) -> list[dict]:
        con = sqlite3.connect(f"file:{self.db_path}?mode=ro", uri=True)
        con.row_factory = sqlite3.Row
        rows = con.execute(
            "SELECT t.id, t.title, t.description FROM tasks t "
            "JOIN columns c ON c.id = t.column_id "
            "WHERE c.title = ? AND t.is_active = 1 AND t.project_id = ?",
            (column_title, PROJECT_ID)).fetchall()
        con.close()
        return [dict(r) for r in rows]

