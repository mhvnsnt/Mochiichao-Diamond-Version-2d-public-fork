#!/usr/bin/env bash
#
# lane-autostart.sh — restart-resilient lane supervisor
#
# STATUS (2026-10-22, friction-research task B): DESIGN PROPOSAL — NOT WIRED.
# No scheduler entry, no @reboot line, and no lane registrations are active.
# Wiring any of those requires OWNER APPROVAL (see CRONTAB-TEMPLATE.txt).
#
# PURPOSE
#   One scheduled invocation checks every enabled lane in the manifest and
#   (re)starts what is dead. It is meant to run from a restart-surviving
#   scheduler (the runtime scheduler cron, every ~5 min) and/or once per boot.
#
# DESIGN PRINCIPLES
#   1. flock(1) is the ONLY liveness authority. flock(2) locks are released by
#      the kernel when the holder dies or the machine reboots, so there is NO
#      stale-lock problem after an unclean restart. The lock FILE may persist;
#      the LOCK itself never survives a dead holder.
#   2. Single-instance is atomic: `flock -n` + launch in one step. If two
#      supervisors race, exactly one wins; the loser exits with $CONFLICT.
#   3. This script NEVER kills a live lane. A lane holding its lock is left
#      completely alone (no signals, no "cleanup"). Dead lanes are relaunched,
#      never "repaired in place".
#   4. Crash-loop protection: max restarts per lane per hour (manifest
#      column 5). Exceeded -> stop restarting, write <lane>.ESCALATE into the
#      state dir, keep logging. The main agent reads ESCALATE flags.
#   5. Watchdogs are supervised too: each lane may name a watchdog command
#      (manifest column 4). Watchdogs get their own flock-guarded lock and a
#      heartbeat file; a stale heartbeat + free lock = dead watchdog.
#   6. Minimal-environment discipline: lanes are launched with `env -i`,
#      explicit PATH/HOME, absolute workdir, stdin from /dev/null, stdout+stderr
#      to the per-lane log. (cron/@reboot give no login shell, no user env,
#      and a skeletal PATH.)
#
# MANIFEST: lanes.manifest — format, one lane per line:
#   name|workdir|command|watchdog_command|max_restarts_per_hour|enabled
#   # comment lines and blank lines are ignored. Empty watchdog_command = none.
#
# DIRECTORIES (all under $LANES_ROOT, default ~/workspace/agent-ops/lane-autostart)
#   locks/      per-lane flock lock files  (<name>.lock, <name>.watchdog.lock)
#   logs/       per-lane stdout/stderr logs (<name>.log) + autostart.log
#   state/      pid files, restart timestamps, *.ESCALATE flags
#   heartbeats/ <name>.watchdog.ts written by watchdogs (epoch seconds)
#
set -u

LANES_ROOT="${LANES_ROOT:-$HOME/workspace/agent-ops/lane-autostart}"
MANIFEST="${MANIFEST:-$LANES_ROOT/lanes.manifest}"
LOCK_DIR="$LANES_ROOT/locks"
LOG_DIR="$LANES_ROOT/logs"
STATE_DIR="$LANES_ROOT/state"
HEARTBEAT_DIR="$LANES_ROOT/heartbeats"

CONFLICT=20            # exit code when flock -n loses the race (nothing wrong)
STALE_HEARTBEAT=900    # seconds before a watchdog heartbeat counts as dead
RESTART_WINDOW=3600    # seconds; restart cap is per-lane per this window
SAFE_PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

mkdir -p "$LOCK_DIR" "$LOG_DIR" "$STATE_DIR" "$HEARTBEAT_DIR"

AUTOSTART_LOG="$LOG_DIR/autostart.log"
log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*" >>"$AUTOSTART_LOG"; }

# lock_held <lockfile> -> 0 if some LIVE process holds an exclusive flock, else 1
lock_held() {
    local lockfile="$1"
    # Probe: acquire non-blocking and immediately run `true`. If we CAN take
    # it, nobody alive holds it. The launch step below re-checks atomically,
    # so the tiny probe/launch window cannot double-start (launch uses -n).
    if flock -n "$lockfile" true 2>/dev/null; then
        return 1   # free -> holder dead or never started
    else
        return 0   # held -> live lane/watchdog running
    fi
}

# restarts_this_window <name> -> prints count of restarts in RESTART_WINDOW
restarts_this_window() {
    local name="$1" cutoff=$(( $(date +%s) - RESTART_WINDOW )) n=0
    local f="$STATE_DIR/$name.restarts"
    [[ -f "$f" ]] || { echo 0; return; }
    local tmp; tmp="$(mktemp)"
    while IFS= read -r ts; do
        if [[ "$ts" =~ ^[0-9]+$ ]] && (( ts >= cutoff )); then
            echo "$ts" >>"$tmp"; ((n++))
        fi
    done <"$f"
    mv "$tmp" "$f"
    echo "$n"
}

record_restart() { date +%s >>"$STATE_DIR/$1.restarts"; }

escalate() {
    local name="$1" why="$2"
    echo "$(date -u +%FT%TZ) $why" >"$STATE_DIR/$name.ESCALATE"
    log "ESCALATE lane=$name: $why"
}

launch_guarded() {
    # launch_guarded <name> <workdir> <command> <role>
    # Holds <name>[.<role>].lock for the child's ENTIRE lifetime via flock(1).
    local name="$1" workdir="$2" cmd="$3" role="$4"
    local suffix=""; [[ "$role" == "lane" ]] || suffix=".$role"
    local lock="$LOCK_DIR/$name$suffix.lock"
    local logf="$LOG_DIR/$name$suffix.log"
    if [[ ! -d "$workdir" ]]; then
        log "SKIP $role=$name: workdir missing: $workdir"; return 1
    fi
    # Atomic single-instance: flock -n either wins and holds the lock for the
    # lane's whole life, or fails with $CONFLICT (another live instance).
    # setsid detaches from any terminal/session; env -i enforces explicit env.
    # shellcheck disable=SC2086
    flock -n -E "$CONFLICT" "$lock" \
        setsid env -i HOME="$HOME" PATH="$SAFE_PATH" \
            bash -c "cd $(printf %q "$workdir") && exec $cmd" \
            </dev/null >>"$logf" 2>&1 &
    local w=$!
    echo "$w" >"$STATE_DIR/$name$suffix.pid"   # informational only; flock is the authority
    log "START $role=$name (flock wrapper pid=$w) workdir=$workdir log=$logf"
}

heartbeat_stale() {
    local name="$1" f="$HEARTBEAT_DIR/$name.watchdog.ts"
    [[ -f "$f" ]] || return 0        # absent heartbeat counts as stale
    local mtime now
    mtime="$(stat -c %Y "$f" 2>/dev/null || echo 0)"
    now="$(date +%s)"
    (( now - mtime > STALE_HEARTBEAT ))
}

handle_lane() {
    local name="$1" workdir="$2" cmd="$3" watchdog_cmd="$4" maxr="$5"
    local lane_lock="$LOCK_DIR/$name.lock"
    local wd_lock="$LOCK_DIR/$name.watchdog.lock"

    if lock_held "$lane_lock"; then
        log "OK lane=$name alive (lock held); nothing to do"
        # Lane alive — but is its watchdog alive?
        if [[ -n "$watchdog_cmd" ]]; then
            if lock_held "$wd_lock"; then
                log "OK watchdog=$name alive"
            elif heartbeat_stale "$name"; then
                log "WATCHDOG DEAD (stale heartbeat, free lock): relaunching watchdog=$name"
                launch_guarded "$name" "$workdir" "$watchdog_cmd" "watchdog" || true
            else
                log "NOTE watchdog=$name lock free but heartbeat fresh; leaving alone"
            fi
        fi
        return 0
    fi

    # Lane lock free -> lane dead (or never started). Crash-loop guard first.
    local n; n="$(restarts_this_window "$name")"
    if (( n >= maxr )); then
        escalate "$name" "restart cap hit: $n restarts in last ${RESTART_WINDOW}s (max $maxr); auto-restart paused"
        return 0
    fi
    log "DEAD lane=$name (lock free, restarts_this_window=$n/$maxr): relaunching"
    record_restart "$name"
    launch_guarded "$name" "$workdir" "$cmd" "lane" || true
    if [[ -n "$watchdog_cmd" ]] && ! lock_held "$wd_lock"; then
        # Watchdog also dead (matches the 2026-10-22 incident: lane died AND
        # its watchdog went absent). Relaunch it under its own lock.
        log "WATCHDOG ABSENT for lane=$name: relaunching alongside lane"
        launch_guarded "$name" "$workdir" "$watchdog_cmd" "watchdog" || true
    fi
}

[[ -f "$MANIFEST" ]] || { log "FATAL: manifest not found: $MANIFEST"; exit 2; }
log "=== lane-autostart run begin (manifest=$MANIFEST) ==="
while IFS= read -r line || [[ -n "$line" ]]; do
    # skip comments/blank lines
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    IFS='|' read -r name workdir cmd watchdog_cmd maxr enabled <<<"$line"
    [[ "${enabled//[[:space:]]/}" == "yes" ]] || { log "SKIP lane=$name (disabled)"; continue; }
    maxr="${maxr//[[:space:]]/}"; [[ "$maxr" =~ ^[0-9]+$ ]] || maxr=3
    handle_lane "$name" "$workdir" "$cmd" "$watchdog_cmd" "$maxr"
done <"$MANIFEST"
log "=== lane-autostart run end ==="
exit 0
