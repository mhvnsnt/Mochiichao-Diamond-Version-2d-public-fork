#!/usr/bin/env bash
# guard-paths.sh — protected-paths list consulted by ALL cleanup/reaper tooling.
#
# 2026-10-19 lesson: a cleanup lane DELETED a 93%-complete Tekken 5 ISO
# download and trampled in-progress work. A reaper must NEVER delete,
# quarantine, or "tidy" a protected path. It must ASK the owning lane or
# the parent agent instead.
#
# Registry: $LANE_GUARD_STATE_DIR/protected-paths.json (defaults to the
# agent-ops dir). Writes are atomic (tmp + rename).
#
# Kinds: download-in-progress | sacred-manifest | active-worktree |
#        active-scratch | store-verified | other
#
# Usage:
#   guard-paths.sh check PATH         # exit 0 + ALLOWED | exit 1 + PROTECTED
#   guard-paths.sh check-tree PATH    # also refuses when PATH CONTAINS a
#                                     # protected path (for directory deletes)
#   guard-paths.sh add PATH --kind K --owner O [--note N]   # idempotent
#   guard-paths.sh remove PATH
#   guard-paths.sh list
#
# Reaper contract (CloudDog and friends): before deleting/moving ANY path,
# run `guard-paths.sh check-tree <path>`. Exit 1 means hands off — log and
# skip. No exceptions, no "it's probably fine".

set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="${LANE_GUARD_STATE_DIR:-$SCRIPT_DIR}"
REG="$STATE_DIR/protected-paths.json"
KINDS="download-in-progress sacred-manifest active-worktree active-scratch store-verified other"

usage() { sed -n '2,24p' "$0"; exit 1; }

init_reg() {
  if [ ! -f "$REG" ]; then
    tmp="$REG.tmp-$$"
    printf '{"paths":[]}\n' > "$tmp"
    mv "$tmp" "$REG"
  fi
}

# expand leading ~ and $HOME, then canonicalize (realpath -m works for
# missing paths)
canon() {
  local p="$1"
  case "$p" in "~") p="$HOME";;
               "~"/*) p="$HOME/${p#\~/}";; esac
  case "$p" in "\$HOME") p="$HOME";;
               "\$HOME"/*) p="$HOME/${p#\$HOME/}";; esac
  realpath -m "$p" 2>/dev/null || echo "$p"
}

# emit "path|kind|owner|note" lines
load_paths() {
  python3 - "$REG" <<'PYEOF'
import json, sys, os
reg = sys.argv[1]
home = os.environ.get("HOME", "")
def expand(p):
    if p == "~" or p.startswith("~/"): return home + p[1:]
    return os.path.expandvars(p)
try:
    data = json.load(open(reg))
except Exception:
    print("broken protected-paths registry: " + reg, file=sys.stderr); sys.exit(2)
for e in data.get("paths", []):
    print("%s|%s|%s|%s" % (expand(e.get("path","")), e.get("kind","other"),
                            e.get("owner",""), e.get("note","")))
PYEOF
}

# is_protected <canon-path> <mode:check|check-tree>
# exit 0 + print reason when protected
is_protected() {
  local target="$1" mode="$2"
  while IFS='|' read -r ppath kind owner note; do
    [ -n "$ppath" ] || continue
    cp="$(canon "$ppath")"
    case "$target" in
      "$cp"|"$cp"/*)
        echo "PROTECTED: $1 (kind=$kind owner=$owner) ${note:+— $note}"; return 0;;
    esac
    if [ "$mode" = "check-tree" ]; then
      case "$cp" in "$target"|"$target"/*)
        echo "PROTECTED: $1 contains protected path $ppath (kind=$kind owner=$owner) ${note:+— $note}"; return 0;;
      esac
    fi
  done < <(load_paths)
  return 1
}

cmd="${1:-}"; shift || true
case "$cmd" in
  check|check-tree)
    [ $# -ge 1 ] || usage
    init_reg
    reason="$(is_protected "$(canon "$1")" "$cmd")" && { echo "$reason" >&2; exit 1; }
    echo "ALLOWED: $1"
    ;;
  add)
    path="${1:-}"; shift || true
    [ -n "$path" ] || usage
    kind="other"; owner=""; note=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --kind) kind="$2"; shift 2;;
        --owner) owner="$2"; shift 2;;
        --note) note="$2"; shift 2;;
        *) echo "unknown flag $1"; exit 1;;
      esac
    done
    case " $KINDS " in *" $kind "*) ;; *)
      echo "kind must be one of: $KINDS"; exit 1;; esac
    init_reg
    GUARD_PATH="$path" GUARD_KIND="$kind" GUARD_OWNER="$owner" GUARD_NOTE="$note" \
    python3 - "$REG" <<'PYEOF'
import json, os, sys, datetime
reg = sys.argv[1]
p, k, o, n = (os.environ.get("GUARD_PATH",""), os.environ.get("GUARD_KIND","other"),
              os.environ.get("GUARD_OWNER",""), os.environ.get("GUARD_NOTE",""))
data = json.load(open(reg))
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
kept, found = [], False
for e in data.get("paths", []):
    if e.get("path") == p:
        e.update({"kind": k or e.get("kind"), "owner": o or e.get("owner"),
                  "note": n or e.get("note"), "added_at": e.get("added_at", now)})
        kept.append(e); found = True
    else:
        kept.append(e)
if not found:
    kept.append({"path": p, "kind": k, "owner": o, "note": n, "added_at": now})
data["paths"] = kept
tmp = reg + ".tmp-%d" % os.getpid()
with open(tmp, "w") as f:
    json.dump(data, f, indent=2); f.write("\n")
os.replace(tmp, reg)
print("protected: %s (%s)" % (p, k))
PYEOF
    ;;
  remove)
    [ $# -ge 1 ] || usage
    init_reg
    GUARD_PATH="$1" python3 - "$REG" <<'PYEOF'
import json, os, sys
reg = sys.argv[1]
p = os.environ["GUARD_PATH"]
data = json.load(open(reg))
before = len(data.get("paths", []))
data["paths"] = [e for e in data["paths"] if e.get("path") != p]
if len(data["paths"]) == before:
    print("not protected (no entry): " + p); sys.exit(0)
tmp = reg + ".tmp-%d" % os.getpid()
with open(tmp, "w") as f:
    json.dump(data, f, indent=2); f.write("\n")
os.replace(tmp, reg)
print("unprotected: " + p)
PYEOF
    ;;
  list)
    init_reg
    python3 - "$REG" <<'PYEOF'
import json, sys, os
reg = sys.argv[1]
for e in json.load(open(reg)).get("paths", []):
    print("%-58s %-20s owner=%-18s %s" % (e.get("path"), e.get("kind"),
          e.get("owner") or "-", e.get("note") or ""))
PYEOF
    ;;
  *) usage;;
esac
