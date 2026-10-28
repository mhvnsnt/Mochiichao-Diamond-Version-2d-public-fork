#!/usr/bin/env bash
# lane-worktree.sh — one worktree + one branch per lane.
#
# Prevents the shared-checkout clobbers of 2026-10-19 (a gap-audit lane
# committed onto another lane's branch; one lane's uncommitted work was
# stashed/restored by another).
#
# Registry: $LANE_GUARD_STATE_DIR/lanes.json (defaults to the agent-ops dir
# containing this script). Writes are atomic (tmp + rename).
#
# Usage:
#   lane-worktree.sh spawn LANE_ID --repo <path-or-url> [--branch NAME]
#                  [--base REF] [--dir PATH] [--agent-id ID]
#   lane-worktree.sh release LANE_ID
#   lane-worktree.sh list
#   lane-worktree.sh check PATH [--lane LANE_ID]   # exit 1 if PATH is inside
#                                                  # ANOTHER lane's worktree
#   lane-worktree.sh exec LANE_ID -- <cmd...>      # run cmd inside the lane's
#                                                  # own worktree (refuses to
#                                                  # run inside a foreign lane)
#
# A lane that must write into a repo MUST call `check` (or `exec`) first.
# check exits 0 = allowed, 1 = refused.

set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="${LANE_GUARD_STATE_DIR:-$SCRIPT_DIR}"
REG="$STATE_DIR/lanes.json"
DEFAULT_ROOT="$HOME/workspace/agent-ops-worktrees"

usage() { sed -n '2,25p' "$0"; exit 1; }

init_reg() {
  if [ ! -f "$REG" ]; then
    tmp="$REG.tmp-$$"
    printf '{"lanes":[]}\n' > "$tmp"
    mv "$tmp" "$REG"
  fi
}

# canon PATH -> absolute, no trailing slash (realpath -m: resolves even if missing)
canon() { realpath -m "$1" 2>/dev/null || echo "$1"; }

# read lanes into $LINES of "lane_id|worktree|branch|status"
load_lanes() {
  python3 - "$REG" <<'PYEOF'
import json, sys
reg = sys.argv[1]
try:
    data = json.load(open(reg))
except Exception:
    print("broken lanes registry: " + reg, file=sys.stderr); sys.exit(2)
for l in data.get("lanes", []):
    print("%s|%s|%s|%s" % (l.get("lane_id",""), l.get("worktree",""),
                            l.get("branch",""), l.get("status","")))
PYEOF
}

# save_lane <json-blob>: upsert lane entry, atomic
save_lane() {
  python3 - "$REG" <<'PYEOF'
import json, os, sys, datetime
reg = sys.argv[1]
blob = json.loads(os.environ["LANE_BLOB"])
data = json.load(open(reg))
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
kept, found = [], False
for l in data.get("lanes", []):
    if l["lane_id"] == blob["lane_id"]:
        blob.setdefault("created_at", l.get("created_at", now))
        kept.append(blob); found = True
    else:
        kept.append(l)
if not found:
    blob.setdefault("created_at", now)
    kept.append(blob)
data["lanes"] = kept
tmp = reg + ".tmp-%d" % os.getpid()
with open(tmp, "w") as f:
    json.dump(data, f, indent=2); f.write("\n")
os.replace(tmp, reg)
print("registry updated: " + blob["lane_id"])
PYEOF
}

cmd="${1:-}"; shift || true
case "$cmd" in
  spawn)
    lane="${1:-}"; shift || true
    [ -n "$lane" ] || usage
    repo=""; branch=""; base="HEAD"; dir=""; agent_id=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --repo) repo="$2"; shift 2;;
        --branch) branch="$2"; shift 2;;
        --base) base="$2"; shift 2;;
        --dir) dir="$2"; shift 2;;
        --agent-id) agent_id="$2"; shift 2;;
        *) echo "unknown flag $1"; exit 1;;
      esac
    done
    [ -n "$repo" ] || { echo "spawn needs --repo"; exit 1; }
    branch="${branch:-lane/$lane}"
    dir="$(canon "${dir:-$DEFAULT_ROOT/$lane}")"
    init_reg
    # refuse: lane already active
    while IFS='|' read -r lid wt br st; do
      if [ "$lid" = "$lane" ] && [ "$st" = "active" ]; then
        echo "REFUSED: lane '$lane' already active at $wt (release it first)" >&2; exit 1
      fi
      # refuse: target dir is (or is inside) another lane's active worktree
      if [ "$st" = "active" ] && [ -n "$wt" ] && [ "$lid" != "$lane" ]; then
        cwt="$(canon "$wt")"
        case "$dir" in "$cwt"|"$cwt"/*)
          echo "REFUSED: '$dir' is inside active lane '$lid' worktree ($cwt)" >&2; exit 1;;
        esac
      fi
      # refuse: another lane already owns this branch on this repo
      if [ "$st" = "active" ] && [ "$br" = "$branch" ] && [ "$lid" != "$lane" ]; then
        echo "REFUSED: branch '$branch' already owned by active lane '$lid'" >&2; exit 1
      fi
    done < <(load_lanes)
    [ -e "$dir" ] && { echo "REFUSED: dir already exists: $dir"; exit 1; }
    git -C "$repo" worktree add "$dir" -b "$branch" "$base" || exit 1
    LANE_BLOB="$(python3 - "$lane" "$repo" "$dir" "$branch" "$base" "$agent_id" <<'PYEOF'
import json, sys
lane, repo, wt, br, base, aid = sys.argv[1:7]
print(json.dumps({"lane_id": lane, "repo": repo, "worktree": wt,
                  "branch": br, "base": base,
                  "agent_id": aid or None, "status": "active"}))
PYEOF
)" save_lane
    # an active worktree is a protected path — reapers must never touch it
    "$SCRIPT_DIR/guard-paths.sh" add "$dir" --kind active-worktree --owner "$lane" \
      --note "lane worktree (auto-registered)" >/dev/null || true
    echo "lane '$lane' ready: $dir on branch $branch"
    ;;
  release)
    lane="${1:-}"; shift || true
    [ -n "$lane" ] || usage
    init_reg
    entry="$(while IFS='|' read -r lid wt br st; do
      [ "$lid" = "$lane" ] && [ "$st" = "active" ] && { echo "$wt"; break; }; done < <(load_lanes))"
    [ -n "$entry" ] || { echo "no active lane '$lane'"; exit 1; }
    cwt="$(canon "$entry")"
    repo="$(cd "$cwt" 2>/dev/null && git rev-parse --git-common-dir 2>/dev/null | xargs -I{} sh -c 'cd {}/.. && pwd' 2>/dev/null || true)"
    git worktree remove "$cwt" 2>/dev/null || { echo "worktree remove failed for $cwt (may have uncommitted work — resolve manually, NOT with --force)"; exit 1; }
    LANE_BLOB="$(python3 - "$lane" <<'PYEOF'
import json, sys
print(json.dumps({"lane_id": sys.argv[1], "status": "released"}))
PYEOF
)" save_lane
    "$SCRIPT_DIR/guard-paths.sh" remove "$cwt" >/dev/null || true
    echo "lane '$lane' released; worktree $cwt removed (protected-path unregistered)"
    ;;
  list)
    init_reg
    python3 - "$REG" <<'PYEOF'
import json, sys
for l in json.load(open(sys.argv[1])).get("lanes", []):
    print("%-24s %-8s branch=%-28s worktree=%s" % (
        l.get("lane_id"), l.get("status"), l.get("branch"), l.get("worktree")))
PYEOF
    ;;
  check)
    path="${1:-}"; shift || true
    [ -n "$path" ] || usage
    lane=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --lane) lane="$2"; shift 2;;
        *) echo "unknown flag $1"; exit 1;;
      esac
    done
    init_reg
    cpath="$(canon "$path")"
    while IFS='|' read -r lid wt br st; do
      [ "$st" = "active" ] || continue
      [ -n "$wt" ] || continue
      [ -n "$lane" ] && [ "$lid" = "$lane" ] && continue  # own lane: fine
      cwt="$(canon "$wt")"
      case "$cpath" in "$cwt"|"$cwt"/*)
        echo "REFUSED: $path is inside active lane '$lid' worktree ($cwt), branch $br" >&2
        echo "Use 'lane-worktree.sh spawn' to get your own worktree first." >&2
        exit 1;;
      esac
    done < <(load_lanes)
    echo "ALLOWED: $path is not inside another lane's worktree"
    ;;
  exec)
    lane="${1:-}"; shift || true
    [ -n "$lane" ] || usage
    [ "${1:-}" = "--" ] && shift
    [ $# -gt 0 ] || { echo "exec needs a command after --"; exit 1; }
    init_reg
    wt=""
    while IFS='|' read -r lid w br st; do
      [ "$lid" = "$lane" ] && [ "$st" = "active" ] && { wt="$w"; break; }
    done < <(load_lanes)
    [ -n "$wt" ] || { echo "no active lane '$lane' — spawn it first"; exit 1; }
    cwt="$(canon "$wt")"
    [ -d "$cwt" ] || { echo "lane '$lane' worktree missing on disk: $cwt"; exit 1; }
    echo "exec in lane '$lane' worktree ($cwt): $*"
    cd "$cwt" && "$@"
    ;;
  *) usage;;
esac
