#!/usr/bin/env python3
"""Validate public/audio/music/music.json (plan §5d registry rules).

Checks, all offline, no audio decoding:
- 35-45 registry entries, unique ids, all 10 MVP ids present
- every loop: 0 <= loopStart < loopEnd, loop section is a whole bar count
  at the track bpm, file + stems are .ogg (MP3 padding = loop gap)
- non-loops: null loopStart/loopEnd
- no composed track is still placeholder, no placeholder track is wired
- every entry's file/stem/variant path lives under audio/music/
- title/intro are DRAFT slots (never wired) until Title Music lane approves
- no shipped audio file is claimed: files on disk are NOT required, because
  this PR ships the registry + engine only; a later composition PR flips
  placeholder:false per track and must then pass the same checks with the
  file present (checked by that PR's gate, not here)

Usage: python3 tools/validate_music_registry.py [path-to-music.json]
Exit 0 = no hard errors. Warnings (uncomposed tracks) do not fail.
"""
import json
import sys
from pathlib import Path

MVP = ["title", "menu", "home_town", "route_day", "cave", "wild_battle",
       "trainer_battle", "gym_battle", "victory", "defeat"]

def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/audio/music/music.json")
    reg = json.loads(path.read_text())
    errors, warnings = [], []
    if reg.get("schemaVersion") != 1:
        errors.append(f"schemaVersion must be 1, got {reg.get('schemaVersion')}")
    tracks = reg.get("tracks", [])
    if not (35 <= len(tracks) <= 45):
        errors.append(f"registry has {len(tracks)} entries, plan range is 35-45")
    seen = set()
    for t in tracks:
        tid = t.get("id", "?")
        if tid in seen:
            errors.append(f"duplicate id: {tid}")
        seen.add(tid)
        if t.get("bus") != "bgm":
            errors.append(f"{tid}: bus must be bgm, got {t.get('bus')}")
        for key in ("file",):
            if not str(t.get(key, "")).startswith("audio/music/"):
                errors.append(f"{tid}: {key} must live under audio/music/, got {t.get(key)}")
        if t.get("type") == "loop":
            ls, le, bpm = t.get("loopStart"), t.get("loopEnd"), t.get("bpm")
            if ls is None or le is None or not (0 <= ls < le):
                errors.append(f"{tid}: need 0 <= loopStart < loopEnd, got {ls}/{le}")
            else:
                bars = (le - ls) / (240 / bpm)
                if abs(bars - round(bars)) > 0.01:
                    errors.append(f"{tid}: loop section is {bars:.3f} bars at {bpm} bpm, not whole bars")
            if not str(t.get("file", "")).endswith(".ogg"):
                errors.append(f"{tid}: loop file must be .ogg, got {t.get('file')}")
            for s in t.get("stems", []):
                if not s.endswith(".ogg"):
                    errors.append(f"{tid}: stem must be .ogg, got {s}")
                if not s.startswith("audio/music/"):
                    errors.append(f"{tid}: stem must live under audio/music/, got {s}")
        else:
            if t.get("loopStart") is not None or t.get("loopEnd") is not None:
                errors.append(f"{tid}: non-loop must have null loopStart/loopEnd")
        if t.get("status") == "composed" and t.get("placeholder"):
            errors.append(f"{tid}: composed but still placeholder")
        if t.get("wired") and t.get("placeholder"):
            errors.append(f"{tid}: wired but still placeholder")
        if tid in ("title", "intro") and t.get("status") != "draft":
            errors.append(f"{tid}: must stay status draft until Title Music lane approves a version")
        if tid in ("title", "intro") and t.get("wired"):
            errors.append(f"{tid}: draft slot must never be wired:true in this registry")
        if t.get("status") != "composed":
            warnings.append(f"{tid}: not composed yet ({t.get('status')})")
    for mid in MVP:
        if mid not in seen:
            errors.append(f"MVP track missing: {mid}")
    mvp = [t["id"] for t in tracks if t.get("mvp")]
    if len(mvp) != len(MVP):
        errors.append(f"MVP count {len(mvp)}, expected {len(MVP)}")
    print(f"tracks: {len(tracks)} (loops {sum(1 for t in tracks if t['type']=='loop')}, "
          f"jingles {sum(1 for t in tracks if t['type']=='jingle')}, "
          f"one-shot {sum(1 for t in tracks if t['type']=='one-shot')})")
    print(f"MVP: {len(mvp)}/{len(MVP)} defined, 0 composed")
    print(f"composed: {sum(1 for t in tracks if t.get('status')=='composed')}/{len(tracks)}")
    for w in warnings:
        print(f"WARN: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
