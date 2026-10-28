"""WIELDER run ledger — SQLite state/audit of record (fixes donor-system
defects D3 schema drift and D6 prose-only persistence).

One ledger, stdlib sqlite3. Every state transition is a row; illegal
transitions raise. This ledger plus per-run trace files are Wielder's
telemetry of record (Langfuse self-host is an optional mirror — see
PROVENANCE.md for its status).
"""
from __future__ import annotations

import json
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Any, Optional

from . import constitution as C


class IllegalTransition(RuntimeError):
    pass


def _now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S%z")


class Ledger:
    def __init__(self, path: Optional[Path] = None):
        self.path = Path(path) if path else C.DATA / "ledger.sqlite"
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(self.path)
        self.db.executescript(
            """
            CREATE TABLE IF NOT EXISTS runs(
              run_id TEXT PRIMARY KEY, card_id INTEGER, card_title TEXT,
              target_id TEXT, state TEXT, blocker TEXT,
              manifest_path TEXT, manifest_sha256 TEXT,
              retries INTEGER DEFAULT 0,
              created_at TEXT, updated_at TEXT);
            CREATE TABLE IF NOT EXISTS transitions(
              id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT,
              from_state TEXT, to_state TEXT, reason TEXT, ts TEXT);
            CREATE TABLE IF NOT EXISTS tool_calls(
              id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, tool TEXT,
              payload_json TEXT, ok INTEGER, exit_code INTEGER,
              result_json TEXT, raw_output TEXT, ts TEXT);
            CREATE TABLE IF NOT EXISTS inputs(
              id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, kind TEXT,
              path TEXT, sha256 TEXT, bytes INTEGER, ts TEXT);
            CREATE TABLE IF NOT EXISTS failures(
              id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, target_id TEXT,
              defect_class TEXT, fix_class TEXT, ts TEXT);
            """
        )
        self.db.commit()

    def open_run(self, card_id: int, card_title: str, target_id: Optional[str]) -> str:
        run_id = "W-" + uuid.uuid4().hex[:12]
        self.db.execute(
            "INSERT INTO runs(run_id,card_id,card_title,target_id,state,retries,created_at,updated_at)"
            " VALUES (?,?,?,?,'IDLE',0,?,?)",
            (run_id, card_id, card_title, target_id, _now(), _now()),
        )
        self.db.execute(
            "INSERT INTO transitions(run_id,from_state,to_state,reason,ts) VALUES (?,NULL,'IDLE','run opened',?)",
            (run_id, _now()),
        )
        self.db.commit()
        return run_id

    def state_of(self, run_id: str) -> str:
        row = self.db.execute("SELECT state FROM runs WHERE run_id=?", (run_id,)).fetchone()
        if not row:
            raise KeyError(run_id)
        return row[0]

    def transition(self, run_id: str, to_state: str, reason: str) -> None:
        cur = self.state_of(run_id)
        if to_state not in C.LEGAL_TRANSITIONS[cur]:
            raise IllegalTransition(f"{cur} -> {to_state} is not a legal transition")
        self.db.execute("UPDATE runs SET state=?, updated_at=? WHERE run_id=?", (to_state, _now(), run_id))
        self.db.execute(
            "INSERT INTO transitions(run_id,from_state,to_state,reason,ts) VALUES (?,?,?,?,?)",
            (run_id, cur, to_state, reason, _now()),
        )
        self.db.commit()

    def log_tool(self, run_id: str, tool: str, payload: dict, ok: bool,
                 exit_code: Optional[int], result: dict, raw_output: str) -> None:
        self.db.execute(
            "INSERT INTO tool_calls(run_id,tool,payload_json,ok,exit_code,result_json,raw_output,ts)"
            " VALUES (?,?,?,?,?,?,?,?)",
            (run_id, tool, json.dumps(payload), 1 if ok else 0, exit_code,
             json.dumps(result)[:8000], raw_output[:8000], _now()),
        )
        self.db.commit()

    def set_outcome(self, run_id: str, manifest_path: Optional[str] = None,
                    manifest_sha256: Optional[str] = None, blocker: Optional[str] = None,
                    retries: Optional[int] = None, target_id: Optional[str] = None) -> None:
        sets, vals = [], []
        for col, val in (("manifest_path", manifest_path), ("manifest_sha256", manifest_sha256),
                         ("blocker", blocker), ("retries", retries), ("target_id", target_id)):
            if val is not None:
                sets.append(f"{col}=?")
                vals.append(val)
        if sets:
            vals.append(run_id)
            self.db.execute(f"UPDATE runs SET {', '.join(sets)}, updated_at=? WHERE run_id=?"
                            .replace(", updated_at=?", ", updated_at=?"), (*vals[:-1], _now(), run_id))
            self.db.commit()

    def get_run(self, run_id: str) -> dict[str, Any]:
        cols = [d[0] for d in self.db.execute("SELECT * FROM runs LIMIT 0").description]
        row = self.db.execute("SELECT * FROM runs WHERE run_id=?", (run_id,)).fetchone()
        if not row:
            raise KeyError(run_id)
        out = dict(zip(cols, row))
        out["transitions"] = [dict(zip(["id", "run_id", "from", "to", "reason", "ts"], r)) for r in
                              self.db.execute("SELECT * FROM transitions WHERE run_id=? ORDER BY id", (run_id,))]
        out["tool_calls"] = [dict(zip(["id", "run_id", "tool", "payload", "ok", "exit_code", "result", "raw_output", "ts"], r)) for r in
                             self.db.execute("SELECT * FROM tool_calls WHERE run_id=? ORDER BY id", (run_id,))]
        out["inputs"] = self.inputs_of(run_id)
        return out

    def record_input(self, run_id: str, kind: str, path: str, sha256: str, nbytes: int) -> None:
        """Input provenance lock (Counter-addition #2): the exact inputs of
        a run, hashed at run start; downstream gates compare against this."""
        self.db.execute(
            "INSERT INTO inputs(run_id,kind,path,sha256,bytes,ts) VALUES (?,?,?,?,?,?)",
            (run_id, kind, path, sha256, nbytes, _now()))
        self.db.commit()

    def inputs_of(self, run_id: str) -> list[dict]:
        return [dict(zip(["id", "run_id", "kind", "path", "sha256", "bytes", "ts"], r)) for r in
                self.db.execute("SELECT * FROM inputs WHERE run_id=? ORDER BY id", (run_id,))]

    def record_failure(self, run_id: str, target_id: str, defect_class: str, fix_class: str) -> int:
        self.db.execute(
            "INSERT INTO failures(run_id,target_id,defect_class,fix_class,ts) VALUES (?,?,?,?,?)",
            (run_id, target_id, defect_class, fix_class, _now()))
        self.db.commit()
        return self.count_failures(target_id, fix_class)

    def count_failures(self, target_id: str, fix_class: str) -> int:
        """Three-strikes class-change rule (Counter-addition #7)."""
        row = self.db.execute(
            "SELECT COUNT(*) FROM failures WHERE target_id=? AND fix_class=?",
            (target_id, fix_class)).fetchone()
        return int(row[0])

    def list_runs(self, limit: int = 20) -> list[dict[str, Any]]:
        cols = [d[0] for d in self.db.execute("SELECT * FROM runs LIMIT 0").description]
        return [dict(zip(cols, r)) for r in
                self.db.execute("SELECT * FROM runs ORDER BY created_at DESC LIMIT ?", (limit,))]
