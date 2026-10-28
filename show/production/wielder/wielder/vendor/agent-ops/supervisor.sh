#!/usr/bin/env bash
# supervisor.sh — post-restart triage for agent work.
#
# Scans ~/workspace/agent-ops/checkpoints/*.json and reports:
#   HEALTHY   status=running, heartbeat fresh
#   STALE     status=running, heartbeat older than --stale-minutes (probably died in a restart)
#   COMPLETED status=completed
#   FAILED    status=failed
#
# For every STALE task it prints a ready-to-paste re-spawn brief.
#
# Usage:
#   supervisor.sh [--stale-minutes N] [--json]
#
# Honest limits: heartbeat staleness is a heuristic. A worker inside one long
# tool call may look stale while alive; a dead worker's checkpoint may look
# fresh if it beat right before dying. This reports — the parent agent decides.

set -u
DIR="$(cd "$(dirname "$0")" && pwd)/checkpoints"
STALE_MIN=30
AS_JSON=0
while [ $# -gt 0 ]; do
  case "$1" in
    --stale-minutes) STALE_MIN="$2"; shift 2;;
    --json) AS_JSON=1; shift;;
    *) echo "unknown flag $1"; exit 1;;
  esac
done

python3 - "$DIR" "$STALE_MIN" "$AS_JSON" <<'PYEOF'
import json, os, sys, glob, datetime

d, stale_min, as_json = sys.argv[1], int(sys.argv[2]), sys.argv[3] == "1"
now = datetime.datetime.now(datetime.timezone.utc)

def parse(ts):
    try:
        return datetime.datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=datetime.timezone.utc)
    except Exception:
        return None

def heartbeat_of(t):
    # canonical field first, then alternates from other checkpoint writers
    for k in ("last_heartbeat", "heartbeat_at", "updated_at", "started_at", "started", "spawned_at"):
        hb = parse(t.get(k, "") or "")
        if hb:
            return hb, k
    return None, None

tasks = []
for f in sorted(glob.glob(os.path.join(d, "*.json"))):
    try:
        t = json.load(open(f))
    except Exception as e:
        tasks.append({"task_id": os.path.basename(f), "broken": str(e)})
        continue
    t["_file"] = f
    hb, hb_field = heartbeat_of(t)
    age_min = (now - hb).total_seconds() / 60 if hb else 999999
    status = t.get("status", "running")
    # normalize alternate statuses
    if status == "paused":
        bucket = "PAUSED"
    elif status == "done":
        bucket = "COMPLETED"
    elif status == "running" and age_min > stale_min:
        bucket = "STALE"
    elif status == "running":
        bucket = "HEALTHY"
    else:
        bucket = status.upper()
    t["_bucket"] = bucket
    t["_age_min"] = round(age_min, 1)
    t["_hb_field"] = hb_field
    tasks.append(t)

if as_json:
    print(json.dumps(tasks, indent=2))
    sys.exit(0)

def respawn_block(t):
    tid = t.get("task_id") or os.path.basename(t.get("_file", "?")).replace(".json", "")
    lines = []
    lines.append("=" * 70)
    lines.append("RE-SPAWN BRIEF: %s  (stale %.0f min, last beat %s)" % (
        tid, t["_age_min"], t.get("last_heartbeat") or t.get("heartbeat_at") or t.get("updated_at") or "?"))
    lines.append("=" * 70)
    lines.append("")
    lines.append("FIRST: read the checkpoint file:")
    lines.append("  ~/workspace/agent-ops/checkpoints/%s.json" % tid)
    lines.append("Then read ~/workspace/agent-ops/RESUME_BRIEF_TEMPLATE.md")
    lines.append("and follow it. Do NOT redo completed steps.")
    lines.append("")
    if t.get("resume_prompt"):
        lines.append("TASK: %s" % t["resume_prompt"])
    else:
        lines.append("TASK: %s" % t.get("goal", "(no goal recorded)"))
    if t.get("repo"):
        lines.append("REPO: %s (branch %s)" % (t["repo"], t.get("branch", "main")))
    done = t.get("steps_completed", [])
    if done:
        lines.append("")
        lines.append("ALREADY DONE (do not repeat):")
        for s in done[-12:]:
            lines.append("  - [%s] %s" % (s.get("at", "?"), s.get("step", s)))
    nxt = t.get("next_steps", [])
    if nxt:
        lines.append("")
        lines.append("CONTINUE FROM:")
        for n in nxt:
            lines.append("  -> %s" % n)
    paths = t.get("key_paths", [])
    if paths:
        lines.append("")
        lines.append("KEY PATHS:")
        for p in paths:
            lines.append("  %s" % p)
    dec = t.get("decisions", [])
    if dec:
        lines.append("")
        lines.append("DECISIONS TO HONOR:")
        for x in dec[-8:]:
            lines.append("  * %s" % x.get("decision", x))
    blk = t.get("blockers", [])
    if blk:
        lines.append("")
        lines.append("BLOCKERS (resolve these first):")
        for b in blk:
            lines.append("  ! [%s] %s" % (b.get("at", "?"), b.get("blocker", b)))
    lines.append("")
    return "\n".join(lines)

order = ["STALE", "FAILED", "STALLED", "PAUSED", "HEALTHY", "COMPLETED"]
by_bucket = {}
for t in tasks:
    by_bucket.setdefault(t.get("_bucket", "?"), []).append(t)

print("agent-ops supervisor — %s (stale threshold: %d min)" % (
    now.strftime("%Y-%m-%dT%H:%M:%SZ"), stale_min))
print("-" * 70)
total = len(tasks)
stale = len(by_bucket.get("STALE", []))
print("tasks: %d | stale: %d | healthy-running: %d | completed: %d | failed: %d" % (
    total, stale, len(by_bucket.get("HEALTHY", [])),
    len(by_bucket.get("COMPLETED", [])), len(by_bucket.get("FAILED", []))))
print("")

for b in order:
    group = by_bucket.get(b, [])
    if not group:
        continue
    print("## %s (%d)" % (b, len(group)))
    for t in group:
        if t.get("broken"):
            print("  !! %s — unreadable checkpoint: %s" % (t["task_id"], t["broken"]))
            continue
        tid = t.get("task_id") or os.path.basename(t.get("_file", "?")).replace(".json", "")
        print("  - %-26s age=%6.1fm steps=%d next=%d blockers=%d repo=%s" % (
            tid, t["_age_min"], len(t.get("steps_completed", t.get("done", []))),
            len(t.get("next_steps", t.get("next", []))), len(t.get("blockers", [])),
            t.get("repo") or "-"))
        for b in t.get("blockers", [])[-3:]:
            print("      BLOCKED: %s" % b.get("blocker", b))
    print("")

stale_group = by_bucket.get("STALE", [])
if stale_group:
    print()
    print(">>> RE-SPAWN THESE %d TASK(S). Paste each brief into a fresh subagent." % len(stale_group))
    print()
    for t in stale_group:
        if not t.get("broken"):
            print(respawn_block(t))
            print()
else:
    print("No stale tasks. Nothing to re-spawn.")
PYEOF
