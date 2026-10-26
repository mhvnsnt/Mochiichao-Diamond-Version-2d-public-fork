#!/bin/bash
# Gabu single-frame chain (2026-10-26): one Blender process per frame so a
# silent kill loses at most one frame. Skip-if-on-disk still applies.
cd ~/workspace/mochiichao-work/sprites-bake || exit 1
BLENDER=~/workspace/tools/blender-4.2.3-linux-x64/blender
LOG=sheets-rigged/bake_rigged_resume.log
for T in gabu_hit_front_f1.png gabu_hit_front_f5.png gabu_hit_front_f10.png gabu_hit_front_f15.png gabu_faint_front_f1.png gabu_faint_front_f15.png gabu_faint_front_f30.png gabu_faint_front_f45.png gabu_attack_side_preview_f8.png gabu_attack_side_preview_f15.png gabu_attack_side_preview_f22.png; do
  echo "=== SINGLE $T $(date -u +%FT%TZ) ===" >> $LOG
  "$BLENDER" -b --python bake_gabu_single.py -- rigged/gabu/v2-fixed/gabu-v2-fixed-pass1.glb sheets-rigged/gabu/renders gabu "$T" >> $LOG 2>&1
  echo "SINGLE_EXIT $T $? $(date -u +%FT%TZ) count=$(ls sheets-rigged/gabu/renders/ | wc -l)" >> $LOG
done
echo "GABU_SINGLE_CHAIN_DONE $(date -u +%FT%TZ)" >> $LOG
