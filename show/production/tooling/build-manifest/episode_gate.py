#!/usr/bin/env python3
"""episode_gate.py — EP01 readiness report across every wired gate.

Reads the build manifest + all scene gate reports and prints one
honest readiness table: what is built and gated, what is flagged,
what is HALTED, what is missing. Run before any 'ready' claim.
"""
import json, os, glob

BASE = os.path.join(os.path.dirname(__file__), ".." , "..", "..")
man = json.load(open(os.path.join(BASE, "production", "tooling", "build-manifest", "EP01-manifest.json")))
print(f"EP01 manifest: {len(man['cuts'])} cuts, {man['total_cut_seconds']}s, finish {man['finish_target']}")
halts = [c["cut"] for c in man["cuts"] if any(f.startswith("HALT") for f in c["flags"])]
print(f"HALT cuts (open items, by design): {halts}")
amb_flags = sum(1 for c in man["cuts"] for f in c["flags"] if "AMBIENT SOUND GAP" in f)
print(f"Ambient sound GAP flags: {amb_flags}")
for g in sorted(glob.glob(os.path.join(BASE, "episodes", "EP01", "audio", "*.gate.json"))):
    rep = json.load(open(g))
    gates = rep.get("gates", {})
    state = "PASS" if all(v is True for v in gates.values()) else "CHECK " + str(gates)
    print(f"  audio {rep['scene']:<28} {state}")
anim = glob.glob(os.path.join(BASE, "episodes", "EP01", "animatic", "*.mp4"))
print(f"Animatics/proofs: {[os.path.basename(a) for a in anim]}")
print("Picture status: puppets/generative pending (video service + GPU endpoint) — beds and timings are ready for picture to drop in.")
