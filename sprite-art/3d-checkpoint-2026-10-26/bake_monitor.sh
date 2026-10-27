#!/bin/bash
# Bake-watch monitor (read-only): polls resume log + render dirs every 20 min,
# appends a progress line to bake_monitor.log, exits when ALL_BAKES_DONE
# appears or after 14h. Never touches Blender.
BASE=~/workspace/mochiichao-work/sprites-bake/sheets-rigged
LOG=$BASE/bake_rigged_resume.log
MON=$BASE/bake_monitor.log
for i in $(seq 1 42); do
  sleep 1200
  if grep -q '^ALL_BAKES_DONE' "$LOG" 2>/dev/null; then
    echo "$(date -u +%FT%TZ) ALL_BAKES_DONE seen: D=$(ls $BASE/dorowani/renders/ 2>/dev/null | wc -l) G=$(ls $BASE/gabu/renders/ 2>/dev/null | wc -l) last=$(grep RENDERED $LOG | tail -1)" >> "$MON"
    echo "MONITOR_DONE D=$(ls $BASE/dorowani/renders/ 2>/dev/null | wc -l) G=$(ls $BASE/gabu/renders/ 2>/dev/null | wc -l)"
    exit 0
  fi
  echo "$(date -u +%FT%TZ) poll $i: D=$(ls $BASE/dorowani/renders/ 2>/dev/null | wc -l) G=$(ls $BASE/gabu/renders/ 2>/dev/null | wc -l) last=$(grep RENDERED $LOG | tail -1) blender=$(pgrep -f bake_rigged_resume | head -1)" >> "$MON"
done
echo "MONITOR_TIMEOUT_14H D=$(ls $BASE/dorowani/renders/ 2>/dev/null | wc -l) G=$(ls $BASE/gabu/renders/ 2>/dev/null | wc -l)"
