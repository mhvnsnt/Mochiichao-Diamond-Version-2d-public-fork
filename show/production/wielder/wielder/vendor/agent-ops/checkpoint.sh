#!/usr/bin/env bash
# checkpoint.sh — worker progress checkpointing for restart resilience.
#
# Usage:
#   checkpoint.sh init TASK_ID --goal "..." [--repo R] [--branch B] [--agent-id ID] [--resume-prompt "..."]
#   checkpoint.sh beat TASK_ID                  # update heartbeat (call at least every ~10 min)
#   checkpoint.sh step TASK_ID "did X"          # append to steps_completed
#   checkpoint.sh next TASK_ID "do Y next"      # append to next_steps
#   checkpoint.sh path TASK_ID "/some/path"    # record a key file/dir path
#   checkpoint.sh decide TASK_ID "decision"    # record a decision (survives restarts)
#   checkpoint.sh block TASK_ID "reason"       # record a blocker (also sets status=stalled)
#   checkpoint.sh unblock TASK_ID             # clear blockers, back to running
#   checkpoint.sh status TASK_ID STATUS        # running|completed|failed|stalled
#   checkpoint.sh agent TASK_ID AGENT_ID       # record the worker's agent id
#   checkpoint.sh show TASK_ID                 # print checkpoint as JSON
#   checkpoint.sh list                         # list all checkpoints
#
# Checkpoints live in ~/workspace/agent-ops/checkpoints/<task_id>.json

set -u
DIR="$(cd "$(dirname "$0")" && pwd)/checkpoints"
mkdir -p "$DIR"

usage() { sed -n '2,17p' "$0"; exit 1; }

cmd="${1:-}"; shift || true
case "$cmd" in
  init)
    task="$1"; shift
    goal=""; repo=""; branch="main"; agent_id=""; resume_prompt=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --goal) goal="$2"; shift 2;;
        --repo) repo="$2"; shift 2;;
        --branch) branch="$2"; shift 2;;
        --agent-id) agent_id="$2"; shift 2;;
        --resume-prompt) resume_prompt="$2"; shift 2;;
        *) echo "unknown flag $1"; exit 1;;
      esac
    done
    [ -n "$task" ] && [ -n "$goal" ] || { echo "init needs TASK_ID and --goal"; exit 1; }
    python3 - "$DIR/$task.json" "$goal" "$repo" "$branch" "$agent_id" "$resume_prompt" <<'PYEOF'
import json, sys, datetime
path, goal, repo, branch, agent_id, resume_prompt = sys.argv[1:7]
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
data = {
    "task_id": path.rsplit("/", 1)[-1].replace(".json", ""),
    "agent_id": agent_id or None,
    "repo": repo or None,
    "branch": branch,
    "goal": goal,
    "status": "running",
    "spawned_at": now,
    "last_heartbeat": now,
    "steps_completed": [],
    "next_steps": [],
    "key_paths": [],
    "decisions": [],
    "blockers": [],
    "resume_prompt": resume_prompt or None,
}
tmp = path + ".tmp"
with open(tmp, "w") as f:
    json.dump(data, f, indent=2); f.write("\n")
import os; os.replace(tmp, path)
print("checkpoint created: " + path)
PYEOF
    ;;
  beat|step|next|path|decide|block|unblock|status|agent)
    task="$1"; arg2="${2:-}"
    [ -n "$task" ] || { echo "$cmd needs TASK_ID"; exit 1; }
    python3 - "$DIR/$task.json" "$cmd" "$arg2" <<'PYEOF'
import json, sys, os, datetime
path, cmd, arg = sys.argv[1], sys.argv[2], sys.argv[3]
if not os.path.exists(path):
    print("no checkpoint for task; run: checkpoint.sh init", file=sys.stderr); sys.exit(1)
with open(path) as f:
    data = json.load(f)
if "blockers" not in data:
    data["blockers"] = []
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
if cmd == "beat":
    data["last_heartbeat"] = now
elif cmd == "step":
    data["steps_completed"].append({"at": now, "step": arg})
    data["last_heartbeat"] = now
elif cmd == "next":
    if arg not in data["next_steps"]:
        data["next_steps"].append(arg)
    data["last_heartbeat"] = now
elif cmd == "path":
    if arg not in data["key_paths"]:
        data["key_paths"].append(arg)
elif cmd == "decide":
    data["decisions"].append({"at": now, "decision": arg})
    data["last_heartbeat"] = now
elif cmd == "block":
    data["blockers"].append({"at": now, "blocker": arg})
    data["status"] = "stalled"
    data["last_heartbeat"] = now
elif cmd == "unblock":
    data["blockers"] = []
    data["status"] = "running"
    data["last_heartbeat"] = now
elif cmd == "status":
    if arg not in ("running", "completed", "failed", "stalled"):
        print("status must be running|completed|failed|stalled", file=sys.stderr); sys.exit(1)
    data["status"] = arg
    data["last_heartbeat"] = now
elif cmd == "agent":
    data["agent_id"] = arg
tmp = path + ".tmp"
with open(tmp, "w") as f:
    json.dump(data, f, indent=2); f.write("\n")
os.replace(tmp, path)
print("ok: %s -> %s" % (data["task_id"], cmd))
PYEOF
    ;;
  show)
    task="$1"
    cat "$DIR/$task.json"
    ;;
  list)
    for f in "$DIR"/*.json; do
      [ -e "$f" ] || { echo "(no checkpoints)"; exit 0; }
      python3 - "$f" <<'PYEOF'
import json, sys, os
d = json.load(open(sys.argv[1]))
tid = d.get("task_id") or os.path.basename(sys.argv[1]).replace(".json", "")
hb = d.get("last_heartbeat") or d.get("heartbeat_at") or d.get("updated_at") or "?"
print("%-28s %-10s heartbeat=%s steps=%d next=%d blockers=%d" % (
    tid, d.get("status", "?"), hb,
    len(d.get("steps_completed", d.get("done", []))),
    len(d.get("next_steps", d.get("next", []))),
    len(d.get("blockers", []))))
PYEOF
    done
    ;;
  *) usage;;
esac
