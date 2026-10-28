"""WIELDER chat — the owner-facing pillar (Chainlit, Apache-2.0).

Architecture rule: the chat is a front-end on the SAME gated system.
A chat message becomes a queue card / a run under the constitution —
never an unguarded side-channel. What the owner sees here: his words,
Wielder's run states (from the ledger), and evidence packets. The
owner gate is presented in chat: Approve/Deny invoke the finish-gate's
OWN recording scripts (the owner's act through his interface —
record_verdict.py / record_rejection.py), after which the manager
resumes the run and the verifier re-issues the manifest.

Conversation history persists in Wielder's own SQLite (data/chat.sqlite).
Attachments are hashed into the run's provenance lock.

Run: chainlit run wielder/chat.py --host 127.0.0.1 --port 8897
"""
from __future__ import annotations

import asyncio
import json
import re
import sqlite3
import subprocess
import time
from pathlib import Path

import chainlit as cl

from . import constitution as C
from .graph import run_card
from .ledger import Ledger
from .queue import Board
from .report import build_packet
from .scrub import scrub
from .tools import sha256_of

CHAT_DB = C.DATA / "chat.sqlite"


def _db() -> sqlite3.Connection:
    C.DATA.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(CHAT_DB)
    con.execute("CREATE TABLE IF NOT EXISTS turns(id INTEGER PRIMARY KEY AUTOINCREMENT,"
                " role TEXT, text TEXT, ts TEXT)")
    return con


def _log_turn(role: str, text: str) -> None:
    con = _db()
    con.execute("INSERT INTO turns(role,text,ts) VALUES (?,?,?)",
                (role, text, time.strftime("%Y-%m-%dT%H:%M:%S%z")))
    con.commit()
    con.close()


def _history(limit: int = 20) -> list[tuple[str, str]]:
    con = _db()
    rows = con.execute("SELECT role,text FROM turns ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    con.close()
    return list(reversed(rows))


@cl.on_chat_start
async def on_start():
    led = Ledger()
    runs = led.list_runs(5)
    state = "\n".join(f"- {r['run_id']} [{r['state']}] card #{r['card_id']} {r['card_title']}"
                      for r in runs) or "- no runs yet"
    await cl.Message(
        content=("**WIELDER** — production Agentic AI system for the Mochiichao show.\n\n"
                 "Say `run` to pull the next Ready card, `run card <id>` for a specific card, "
                 "`queue` for the finish queue, or describe new work and it becomes a queue card. "
                 "Nothing here is done until the finish-gate verifier's manifest says so.\n\n"
                 f"Recent runs:\n{state}")).send()
    for role, text in _history(6):
        if role == "owner":
            await cl.Message(content=f"**You (earlier):** {text}", author="history").send()


async def _run_and_report(card: dict):
    led, board = Ledger(), Board()
    await cl.Message(content=f"Running card #{card['id']}: {card['title']}").send()
    result = await asyncio.to_thread(run_card, led, board, card)
    run = led.get_run(result["run_id"])
    packet = build_packet(led, result["run_id"])
    summary = packet.read_text().splitlines()[2] if packet.exists() else ""
    actions = []
    if run["state"] == "PARKED" and "owner gate" in (run["blocker"] or ""):
        actions = [cl.Action(name="approve", payload={"run_id": result["run_id"],
                                                       "target_id": run["target_id"]},
                             label="Approve (owner verdict)"),
                   cl.Action(name="deny", payload={"run_id": result["run_id"],
                                                   "target_id": run["target_id"]},
                             label="Deny + pin regression")]
    await cl.Message(
        content=(f"Run {result['run_id']} — state **{run['state']}**\n"
                 f"{summary}\nBlocker: {run['blocker'] or 'none'}\n"
                 f"Packet: `{packet}`"),
        actions=actions).send()
    _log_turn("wielder", f"run {result['run_id']} state {run['state']} blocker {run['blocker']}")


@cl.on_message
async def on_message(message: cl.Message):
    text = (message.content or "").strip()
    _log_turn("owner", text)
    files = message.elements or []
    attachments = []
    for el in files:
        p = Path(getattr(el, "path", "") or "")
        if p.exists():
            dest = C.DATA / "chat-uploads" / p.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(p.read_bytes())
            attachments.append({"path": str(dest), "sha256": sha256_of(dest)})
    board = Board()
    if text.lower() == "grants":
        from . import authz as _a
        lines = [f"#{g['id']} [{'REVOKED' if g['revoked_at'] else 'active'}] {g['action_class']} "
                 f"scope={g['scope']}" for g in _a.list_grants()]
        lines.append("Grant with `grant <class>`, revoke with `revoke <id>`. "
                     "Never grantable (owner acts): " + ", ".join(_a.NEVER_GRANTABLE))
        await cl.Message(content="\n".join(lines) or "no grants recorded").send()
        return
    gm = re.match(r"grant ([\w\-]+)", text.lower())
    if gm:
        from . import authz as _a
        try:
            gid = _a.grant(gm.group(1), "*")
            await cl.Message(content=f"Standing authorization granted: #{gid} {gm.group(1)} (scope *). "
                                     "It will not prompt again; every use is audit-logged.").send()
        except Exception as e:
            await cl.Message(content=f"Cannot grant: {e}").send()
        return
    rm = re.match(r"revoke (\d+)", text.lower())
    if rm:
        from . import authz as _a
        _a.revoke(int(rm.group(1)))
        await cl.Message(content=f"Grant #{rm.group(1)} revoked.").send()
        return
    m = re.search(r"run card (\d+)", text.lower())
    if text.lower() == "queue":
        cols = []
        for col in ["Backlog", "Ready", "Doing", "Verify", "Owner review", "Done"]:
            tasks = board.tasks_in(col)
            cols.append(f"**{col}**: " + (", ".join(f"#{t['id']} {t['title']}" for t in tasks) or "—"))
        await cl.Message(content="\n".join(cols)).send()
        return
    if m or text.lower() == "run":
        card = None
        if m:
            for col in ["Ready", "Backlog", "Doing", "Verify", "Owner review"]:
                for t in board.tasks_in(col):
                    if int(t["id"]) == int(m.group(1)):
                        card = t
        else:
            card = board.first_ready_card()
        if card is None:
            await cl.Message(content="No matching card is available to run.").send()
            return
        if attachments:
            card = {**card, "description": (card.get("description") or "") +
                    f"\nAttachments (provenance): {json.dumps(attachments)}"}
        await _run_and_report(card)
        return
    # Any other owner message becomes a queue card — the chat is not a
    # side-channel: work enters through the queue, under the constitution.
    cols = board.columns()
    cid = board.call("createTask", project_id=1, title=scrub(text)[:120],
                     column_id=cols["Backlog"],
                     description=f"From Wielder chat. Attachments: {json.dumps(attachments)}")
    await cl.Message(content=f"Added as queue card #{cid} (Backlog). It runs when it reaches "
                             "Ready and is pulled — under the same gates as everything else.").send()


@cl.action_callback("approve")
async def on_approve(action: cl.Action):
    """The owner's verdict, recorded through the gate's own script.
    The gate change then needs its own commit (gate lane) before a
    verify run can certify — the chat says so plainly."""
    tid = action.payload["target_id"]
    out = subprocess.run(["python3", str(C.FINISH_GATE / "review/record_verdict.py"),
                          tid, "APPROVED", "via Wielder chat (owner)"],
                         capture_output=True, text=True)
    await cl.Message(content=(f"Owner verdict recorded for {tid}: {out.stdout.strip()} "
                              f"{out.stderr.strip()}\nNext: the gate lane commits that change on "
                              "its own; then `wielder resume " + action.payload["run_id"] + "` "
                              "re-verifies and routes.")).send()


@cl.action_callback("deny")
async def on_deny(action: cl.Action):
    tid = action.payload["target_id"]
    out = subprocess.run(["python3", str(C.FINISH_GATE / "review/record_rejection.py"),
                          tid, "owner_gate", "Rejected by the owner via Wielder chat"],
                         capture_output=True, text=True)
    await cl.Message(content=(f"Rejection recorded for {tid} and pinned as a regression: "
                              f"{out.stdout.strip()} {out.stderr.strip()}")).send()
