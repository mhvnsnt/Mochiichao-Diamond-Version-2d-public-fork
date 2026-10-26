#!/bin/bash
# Second-recovery bake runner (2026-10-26): Dorowani segment, then Gabu.
# Detached via nohup+setsid; appends to the resume log. Prints
# ALL_BAKES_DONE only after BOTH Blender invocations exit.
cd ~/workspace/mochiichao-work/sprites-bake || exit 1
BLENDER=~/workspace/tools/blender-4.2.3-linux-x64/blender
echo "=== SECOND RECOVERY RELAUNCH (real) $(date -u +%FT%TZ) ===" >> sheets-rigged/bake_rigged_resume.log
"$BLENDER" -b --python bake_rigged_resume.py -- rigged/dorowani/v2-fixed/dorowani-v2-fixed.glb sheets-rigged/dorowani/renders dorowani >> sheets-rigged/bake_rigged_resume.log 2>&1
echo "DOROWANI_SEGMENT_EXIT=$? $(date -u +%FT%TZ)" >> sheets-rigged/bake_rigged_resume.log
"$BLENDER" -b --python bake_rigged_resume.py -- rigged/gabu/v2-fixed/gabu-v2-fixed-pass1.glb sheets-rigged/gabu/renders gabu >> sheets-rigged/bake_rigged_resume.log 2>&1
echo "GABU_SEGMENT_EXIT=$? $(date -u +%FT%TZ)" >> sheets-rigged/bake_rigged_resume.log
echo "ALL_BAKES_DONE $(date -u +%FT%TZ)" >> sheets-rigged/bake_rigged_resume.log
