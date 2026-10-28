#!/usr/bin/env bash
# lane-ckpt.sh — checkpoint wrapper implementing CHECKPOINT_PROTOCOL.md.
#
# A lane writes state every N minutes (beat) and on (re)start RESUMES from
# its checkpoint instead of starting over. Survives daemon restarts because
# the checkpoint is a file, not a process.
#
# Usage:
#   lane-ckpt.sh begin TASK_ID --goal "..." [checkpoint.sh init flags...]
#   lane-ckpt.sh beat TASK_ID
#   lane-ckpt.sh step TASK_ID "what you did"
#   lane-ckpt.sh next TASK_ID "what to do next"
#   lane-ckpt.sh decide TASK_ID "binding decision"
#   lane-ckpt.sh status TASK_ID completed|failed|stalled|running
#   lane-ckpt.sh resume TASK_ID     # read checkpoint, verify claims, print
#                                   # the resume plan. Exit 1 if missing/broken
#                                   # (then: do NOT guess — report to parent).
#
# All begin/beat/step/next/decide/status commands delegate to checkpoint.sh,
# so the schema is identical (atomic tmp+rename writes).

set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CKPT="$SCRIPT_DIR/checkpoint.sh"
CP_DIR="$SCRIPT_DIR/checkpoints"

usage() { sed -n '2,17p' "$0"; exit 1; }

cmd="${1:-}"; shift || true
case "$cmd" in
  begin|beat|step|next|path|decide|block|unblock|status|agent|show|list)
    # delegate to checkpoint.sh; 'begin' is an alias for 'init'
    [ "$cmd" = "begin" ] && cmd="init"
    exec "$CKPT" "$cmd" "$@"
    ;;
  resume)
    task="${1:-}"; [ -n "$task" ] || usage
    f="$CP_DIR/$task.json"
    [ -f "$f" ] || { echo "no checkpoint for '$task' — do NOT guess at prior state; report to the parent agent." >&2; exit 1; }
    python3 - "$f" <<'PYEOF'
import json, os, sys, datetime

path = sys.argv[1]
try:
    d = json.load(open(path))
except Exception as e:
    print("BROKEN checkpoint %s: %s — do NOT guess; report to parent." % (path, e), file=sys.stderr)
    sys.exit(1)

def parse(ts):
    try:
        return datetime.datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=datetime.timezone.utc)
    except Exception:
        return None

hb = parse(d.get("last_heartbeat") or "")
age = (datetime.datetime.now(datetime.timezone.utc) - hb).total_seconds()/60 if hb else None
print("=" * 70)
print("RESUME: %s  (status=%s, heartbeat_age=%s)" % (
    d.get("task_id", os.path.basename(path).replace(".json", "")),
    d.get("status", "?"),
    ("%.1f min" % age) if age is not None else "unknown"))
print("GOAL: %s" % d.get("goal", "(none)"))
if d.get("repo"): print("REPO: %s  branch=%s" % (d["repo"], d.get("branch", "main")))
print("=" * 70)

done = d.get("steps_completed", [])
print("\nALREADY DONE (%d) — do NOT redo; verify cheaply:" % len(done))
for s in done[-15:]:
    print("  - [%s] %s" % (s.get("at", "?"), s.get("step", s)))

nxt = d.get("next_steps", [])
print("\nCONTINUE FROM (%d):" % len(nxt))
for n in nxt[-10:]:
    print("  -> %s" % n)

print("\nKEY PATHS (verify each before continuing):")
ok_all = True
for p in d.get("key_paths", []):
    ep = os.path.expanduser(p)
    ok = os.path.exists(ep)
    ok_all = ok_all and ok
    print("  [%s] %s" % ("OK " if ok else "MISSING", p))
if not d.get("key_paths"):
    print("  (none recorded)")

dec = d.get("decisions", [])
if dec:
    print("\nBINDING DECISIONS (%d):" % len(dec))
    for x in dec[-8:]:
        print("  * [%s] %s" % (x.get("at", "?"), x.get("decision", x)))

blk = d.get("blockers", [])
if blk:
    print("\nBLOCKERS — resolve first (%d):" % len(blk))
    for b in blk[-5:]:
        print("  ! [%s] %s" % (b.get("at", "?"), b.get("blocker", b)))

if d.get("resume_prompt"):
    print("\nRESUME PROMPT: %s" % d["resume_prompt"])

print("\nNext: read %s, then IDEMPOTENCY.md, then continue." %
      os.path.join(os.path.dirname(path), "..", "RESUME_BRIEF_TEMPLATE.md"))
if not ok_all and d.get("key_paths"):
    print("WARNING: some key paths are missing — treat their steps as NOT done and redo them.")
sys.exit(0)
PYEOF
    ;;
  *) usage;;
esac
