"""Standing Authorization Ledger (Addendum 12A) — the direct counter
to a managed assistant's read-only permissions, where the owner must
tap allow forever.

The owner grants lasting allows per action class × scope. Rules:
- a granted class NEVER prompts again;
- only a genuinely new class asks, once (in chat / via the manager);
- every use of a standing grant is written to the audit log
  (what, when, which grant);
- the owner can revoke any grant at any time (chat or CLI).

The ledger lives in Wielder's own SQLite (tables: grants, grant_uses)
and is mirrored readably in standing-authorizations.json in the
package. The HONEST EXCEPTION SET (Addendum 12D) can never be granted
away: payment approvals on external cards, provider identity checks,
and a credential the owner has never shared remain owner acts — by
those providers' design, not Wielder's.
"""
from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Optional

from . import constitution as C

NEVER_GRANTABLE = {
    "payment-approval": "payment approvals on external cards are the owner's act (provider design)",
    "identity-check": "provider identity checks are the owner's act (provider design)",
    "unshared-credential": "a credential the owner has never shared cannot be granted into existence",
}


class NotAuthorized(RuntimeError):
    pass


def _now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S%z")


def _db() -> sqlite3.Connection:
    C.DATA.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(C.DATA / "ledger.sqlite")
    con.executescript(
        """
        CREATE TABLE IF NOT EXISTS grants(
          id INTEGER PRIMARY KEY AUTOINCREMENT, action_class TEXT, scope TEXT,
          granted_by TEXT, granted_at TEXT, revoked_at TEXT, note TEXT);
        CREATE TABLE IF NOT EXISTS grant_uses(
          id INTEGER PRIMARY KEY AUTOINCREMENT, grant_id INTEGER,
          action_class TEXT, what TEXT, ts TEXT);
        """)
    return con


def grant(action_class: str, scope: str = "*", granted_by: str = "owner",
          note: str = "") -> int:
    if action_class in NEVER_GRANTABLE:
        raise NotAuthorized(f"{action_class} can never be granted: {NEVER_GRANTABLE[action_class]}")
    con = _db()
    cur = con.execute(
        "INSERT INTO grants(action_class,scope,granted_by,granted_at,note) VALUES (?,?,?,?,?)",
        (action_class, scope, granted_by, _now(), note))
    con.commit()
    gid = int(cur.lastrowid)
    con.close()
    _mirror()
    return gid


def revoke(grant_id: int) -> None:
    con = _db()
    con.execute("UPDATE grants SET revoked_at=? WHERE id=?", (_now(), grant_id))
    con.commit()
    con.close()
    _mirror()


def active_grant(action_class: str, scope: str = "*") -> Optional[dict]:
    con = _db()
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT * FROM grants WHERE action_class=? AND revoked_at IS NULL", (action_class,)).fetchall()
    con.close()
    for r in rows:
        if r["scope"] in ("*", scope):
            return dict(r)
    return None


def require(action_class: str, what: str, scope: str = "*") -> dict:
    """The enforcement point. Returns the grant (and logs the use), or
    raises NotAuthorized — the caller parks with that exact blocker.
    'Waiting on the owner' is a per-action state, never a system state."""
    g = active_grant(action_class, scope)
    if g is None:
        raise NotAuthorized(
            f"standing authorization not granted for class '{action_class}' — "
            "the owner grants it once (chat: `grant " + action_class + "`); "
            "this action parks, nothing else stops")
    con = _db()
    con.execute("INSERT INTO grant_uses(grant_id,action_class,what,ts) VALUES (?,?,?,?)",
                (g["id"], action_class, what, _now()))
    con.commit()
    con.close()
    return g


def list_grants() -> list[dict]:
    con = _db()
    con.row_factory = sqlite3.Row
    rows = [dict(r) for r in con.execute("SELECT * FROM grants ORDER BY id")]
    con.close()
    return rows


def _mirror() -> None:
    out = C.WIELDER_HOME / "standing-authorizations.json"
    out.write_text(json.dumps(
        {"grants": list_grants(), "never_grantable": NEVER_GRANTABLE,
         "note": "Mirror of the SQLite Standing Authorization Ledger. "
                 "Revoke in chat (`revoke <id>`) or via `wielder grants`."},
        indent=1))
