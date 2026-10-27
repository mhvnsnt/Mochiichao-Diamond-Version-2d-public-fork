#!/bin/bash
# Gabu retry chain (2026-10-26): attempts ONLY frames missing from
# sheets-rigged/gabu/renders, up to 3 attempts each, one Blender per attempt.
# Pass number is $1 (default 1). Never runs while another Blender runs:
# caller must check pgrep -x blender first.
cd ~/workspace/mochiichao-work/sprites-bake || exit 1
# Persistent EGL: system libEGL vanishes on VM restarts (overlay reset).
# Use the verified persistent copy so restarts can't break EGL again.
export LD_LIBRARY_PATH=/home/hatch/workspace/tools/egl-real${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
BLENDER=~/workspace/tools/blender-4.2.3-linux-x64/blender
LOG=sheets-rigged/bake_rigged_resume.log
PASS=${1:-1}
EXPECTED="gabu_idle_front_f1.png gabu_idle_front_f16.png gabu_idle_front_f31.png gabu_idle_front_f46.png gabu_walk_front_f1.png gabu_walk_front_f8.png gabu_walk_front_f16.png gabu_walk_front_f23.png gabu_walk_side_f1.png gabu_walk_side_f8.png gabu_walk_side_f16.png gabu_walk_side_f23.png gabu_ready_front_f1.png gabu_ready_front_f15.png gabu_ready_front_f30.png gabu_attack_front_f1.png gabu_attack_front_f8.png gabu_attack_front_f15.png gabu_attack_front_f22.png gabu_attack_front_f30.png gabu_hit_front_f1.png gabu_hit_front_f5.png gabu_hit_front_f10.png gabu_hit_front_f15.png gabu_faint_front_f1.png gabu_faint_front_f15.png gabu_faint_front_f30.png gabu_faint_front_f45.png gabu_attack_side_preview_f8.png gabu_attack_side_preview_f15.png gabu_attack_side_preview_f22.png"
for T in $EXPECTED; do
  F="sheets-rigged/gabu/renders/$T"
  if [ -s "$F" ]; then continue; fi
  for ATT in 1 2 3; do
    echo "=== RETRY pass=$PASS att=$ATT $T $(date -u +%FT%TZ) ===" >> $LOG
    "$BLENDER" -b --python bake_gabu_single.py -- rigged/gabu/v2-fixed/gabu-v2-fixed-pass1.glb sheets-rigged/gabu/renders gabu "$T" >> $LOG 2>&1
    echo "RETRY_EXIT pass=$PASS att=$ATT $T $? $(date -u +%FT%TZ) count=$(ls sheets-rigged/gabu/renders/ | wc -l)" >> $LOG
    if [ -s "$F" ]; then break; fi
  done
done
echo "GABU_RETRY_CHAIN_DONE pass=$PASS $(date -u +%FT%TZ) count=$(ls sheets-rigged/gabu/renders/ | wc -l)" >> $LOG
