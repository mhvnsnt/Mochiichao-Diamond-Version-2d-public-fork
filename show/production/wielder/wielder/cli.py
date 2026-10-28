"""WIELDER — a production Agentic AI system (autonomous multi-agent
production system) for the Mochiichao show.

Management surface (the manager dispatches, clears blockers, and reads
evidence through this CLI — no manager action requires editing code):

  wielder queue                 list the finish queue (columns + cards)
  wielder run-once [--card ID]  run one card through the full loop
  wielder runs                  recent runs from the SQLite ledger
  wielder status <run_id>       one run: state, transitions, tool calls
  wielder packet <run_id>       (re)generate + print the run's packet
  wielder resume <run_id>       resume a run paused at the owner gate
  wielder seats                 measured brain-seat availability
  wielder board-check           is the finish queue serving?
"""
from __future__ import annotations

import argparse
import json
import sys

from . import brain
from .graph import resume_run, run_card
from .ledger import Ledger
from .queue import Board
from .report import build_packet


def _board() -> Board:
    return Board()


def cmd_queue(_args) -> int:
    b = _board()
    for col in ["Backlog", "Ready", "Doing", "Verify", "Owner review", "Done"]:
        tasks = b.tasks_in(col)
        print(f"{col}: {len(tasks)}")
        for t in tasks:
            print(f"  #{t['id']} {t['title']}")
    return 0


def cmd_run_once(args) -> int:
    b = _board()
    ledger = Ledger()
    if args.card:
        card = None
        for col in ["Ready", "Backlog", "Doing", "Verify", "Owner review"]:
            for t in b.tasks_in(col):
                if int(t["id"]) == args.card:
                    card = t
        if card is None:
            print(f"card {args.card} not found")
            return 2
    else:
        card = b.first_ready_card()
        if card is None:
            print("no card in Ready — nothing to run (WIP=1, queue is the work source)")
            return 0
    result = run_card(ledger, b, card)
    run = ledger.get_run(result["run_id"])
    packet = build_packet(ledger, result["run_id"])
    print(json.dumps({"run_id": result["run_id"], "state": run["state"],
                      "blocker": run["blocker"], "manifest": run["manifest_path"],
                      "packet": str(packet),
                      "interrupted_at_owner_gate": "__interrupt__" in result["final"]}, indent=1))
    return 0


def cmd_runs(_args) -> int:
    for r in Ledger().list_runs():
        print(f"{r['run_id']}  {r['state']:<9} card #{r['card_id']} {r['card_title'][:60]}")
    return 0


def cmd_status(args) -> int:
    run = Ledger().get_run(args.run_id)
    print(json.dumps({k: run[k] for k in ("run_id", "card_id", "card_title", "target_id",
                                          "state", "blocker", "manifest_path",
                                          "manifest_sha256", "retries")}, indent=1))
    for t in run["transitions"]:
        print(f"  {t['ts']} {t['from'] or '∅'} → {t['to']}: {t['reason']}")
    for tc in run["tool_calls"]:
        print(f"  tool {tc['tool']} ok={bool(tc['ok'])} exit={tc['exit_code']}")
    return 0


def cmd_packet(args) -> int:
    packet = build_packet(Ledger(), args.run_id)
    print(packet.read_text())
    print(f"[packet at {packet}]")
    return 0


def cmd_resume(args) -> int:
    ledger = Ledger()
    result = resume_run(ledger, _board(), args.run_id)
    run = ledger.get_run(args.run_id)
    packet = build_packet(ledger, args.run_id)
    print(json.dumps({"run_id": args.run_id, "state": run["state"], "blocker": run["blocker"],
                      "packet": str(packet),
                      "interrupted_at_owner_gate": "__interrupt__" in result["final"]}, indent=1))
    return 0


def cmd_seats(_args) -> int:
    print(json.dumps(brain.seat_status(), indent=1))
    return 0


def cmd_run_queue(args) -> int:
    """No-idle topology (manager level): process Ready cards one at a
    time; a parked card never blocks the cards behind it."""
    b = _board()
    ledger = Ledger()
    done = 0
    while done < args.max:
        card = b.first_ready_card()
        if card is None:
            break
        before = {r["run_id"] for r in ledger.list_runs(50)}
        result = run_card(ledger, b, card)
        run = ledger.get_run(result["run_id"])
        build_packet(ledger, result["run_id"])
        print(json.dumps({"run_id": result["run_id"], "card": card["id"],
                          "state": run["state"], "blocker": run["blocker"]}))
        done += 1
        if result["run_id"] in before:
            break
    print(f"processed {done} card(s)")
    return 0


def cmd_pin_request(args) -> int:
    from .pinning import build_pin_request
    path = build_pin_request(Ledger(), args.run_id, args.defect_class, args.owner_words)
    print(f"pin request written: {path}")
    print("application stays with the gate lane (scorer separation): "
          "finish-gate/review/record_rejection.py, as its own commit")
    return 0


def cmd_rewind(args) -> int:
    """Time-travel surface: list the run's checkpoints (last verified
    states) from the graph's SQLite checkpointer."""
    from .graph import build_graph
    graph = build_graph(Ledger(), None)
    cfg = {"configurable": {"thread_id": args.run_id}}
    snaps = list(graph.get_state_history(cfg))
    for s in snaps:
        print(f"checkpoint {s.config['configurable'].get('checkpoint_id', '?')[:12]} "
              f"next={s.next} values_keys={sorted(s.values.keys()) if s.values else []}")
    print(f"{len(snaps)} checkpoint(s) for {args.run_id}")
    return 0


def cmd_board_check(_args) -> int:
    try:
        cols = _board().columns()
        print(f"board serving: columns {cols}")
        return 0
    except Exception as e:
        print(f"board NOT serving: {e}")
        return 1


def cmd_heartbeat(args) -> int:
    from .scheduler import heartbeat_cycle
    if args.once:
        out = heartbeat_cycle(Ledger(), _board(), max_cards=args.max)
        print(json.dumps(out, indent=1))
        return 0
    from .scheduler import heartbeat
    heartbeat(interval_seconds=args.interval)
    return 0


def cmd_digest(_args) -> int:
    """Memory digest — the file-convention equivalent: a Markdown digest
    of what the system has done and what is parked, generated from the
    ledger (check the record before claiming what is saved)."""
    from . import constitution as C
    led = Ledger()
    lines = ["# WIELDER DIGEST — generated from the run ledger", ""]
    for r in led.list_runs(30):
        lines.append(f"- {r['created_at']} {r['run_id']} [{r['state']}] card #{r['card_id']} "
                     f"{r['card_title']}" + (f" — blocker: {r['blocker']}" if r["blocker"] else ""))
    path = C.DATA / "DIGEST.md"
    path.write_text("\n".join(lines) + "\n")
    print(f"digest written: {path}")
    return 0


def cmd_artifacts(_args) -> int:
    from . import constitution as C
    from .tools import sha256_of
    runs_dir = C.DATA / "runs"
    if runs_dir.exists():
        for f in sorted(runs_dir.rglob("*")):
            if f.is_file():
                print(f"{f.relative_to(C.DATA)}  sha256 {sha256_of(f)}  {f.stat().st_size} B")
    return 0


def cmd_desktop(args) -> int:
    from . import desktop
    if args.action == "vnc":
        print(json.dumps(desktop.start_vnc_seat(), indent=1))
    else:
        print(json.dumps(desktop.self_provision(), indent=1))
    return 0


def cmd_delegate(args) -> int:
    from .delegate import delegate
    b = _board()
    card = None
    for col in ["Ready", "Backlog", "Doing", "Verify", "Owner review"]:
        for t in b.tasks_in(col):
            if int(t["id"]) == args.card:
                card = t
    if card is None:
        print(f"card {args.card} not found")
        return 2
    record = delegate(Ledger(), b, args.parent, card, args.scope)
    print(json.dumps(record, indent=1))
    return 0


OWNER_STANDING_CLASSES = ["browser-actions", "kaggle-browser", "staging-github-terabox",
                          "landing-lane-prs", "local-builds-renders"]


def cmd_grants(args) -> int:
    from . import authz
    if args.action == "seed":
        existing = {g["action_class"] for g in authz.list_grants() if not g["revoked_at"]}
        for cls in OWNER_STANDING_CLASSES:
            if cls not in existing:
                gid = authz.grant(cls, "*", granted_by="owner standing order 2026-10-28",
                                  note="Addendum 12 standing authorization; revocable at any time")
                print(f"granted #{gid}: {cls} (scope *)")
        return 0
    if args.action == "grant":
        gid = authz.grant(args.cls, args.scope or "*")
        print(f"granted #{gid}: {args.cls}")
        return 0
    if args.action == "revoke":
        authz.revoke(int(args.cls))
        print(f"revoked grant #{args.cls}")
        return 0
    for g in authz.list_grants():
        state = "REVOKED" if g["revoked_at"] else "active"
        print(f"#{g['id']} [{state}] {g['action_class']} scope={g['scope']} by {g['granted_by']} at {g['granted_at']}")
    print("never grantable (owner acts, provider design): " + ", ".join(authz.NEVER_GRANTABLE))
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="wielder", description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("queue").set_defaults(fn=cmd_queue)
    p = sub.add_parser("run-once"); p.add_argument("--card", type=int); p.set_defaults(fn=cmd_run_once)
    sub.add_parser("runs").set_defaults(fn=cmd_runs)
    p = sub.add_parser("status"); p.add_argument("run_id"); p.set_defaults(fn=cmd_status)
    p = sub.add_parser("packet"); p.add_argument("run_id"); p.set_defaults(fn=cmd_packet)
    p = sub.add_parser("resume"); p.add_argument("run_id"); p.set_defaults(fn=cmd_resume)
    sub.add_parser("seats").set_defaults(fn=cmd_seats)
    sub.add_parser("board-check").set_defaults(fn=cmd_board_check)
    p = sub.add_parser("run-queue"); p.add_argument("--max", type=int, default=3); p.set_defaults(fn=cmd_run_queue)
    p = sub.add_parser("pin-request"); p.add_argument("run_id"); p.add_argument("defect_class"); p.add_argument("owner_words"); p.set_defaults(fn=cmd_pin_request)
    p = sub.add_parser("rewind"); p.add_argument("run_id"); p.set_defaults(fn=cmd_rewind)
    p = sub.add_parser("heartbeat"); p.add_argument("--once", action="store_true"); p.add_argument("--max", type=int, default=3); p.add_argument("--interval", type=int, default=21600); p.set_defaults(fn=cmd_heartbeat)
    sub.add_parser("digest").set_defaults(fn=cmd_digest)
    sub.add_parser("artifacts").set_defaults(fn=cmd_artifacts)
    p = sub.add_parser("delegate"); p.add_argument("parent"); p.add_argument("--card", type=int, required=True); p.add_argument("--scope", default=""); p.set_defaults(fn=cmd_delegate)
    p = sub.add_parser("grants"); p.add_argument("action", nargs="?", default="list", choices=["list", "seed", "grant", "revoke"]); p.add_argument("cls", nargs="?"); p.add_argument("--scope"); p.set_defaults(fn=cmd_grants)
    p = sub.add_parser("desktop"); p.add_argument("action", nargs="?", default="status", choices=["status", "provision", "vnc"]); p.set_defaults(fn=cmd_desktop)
    args = ap.parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())
