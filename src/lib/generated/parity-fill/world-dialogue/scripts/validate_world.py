#!/usr/bin/env python3
"""Mochiichao world/dialogue/progression validator — STAGED, not wired into the game.

Decomp pattern it mirrors (shape only, no Pokemon data copied):
  FireRed data/maps/<Map>/map.json  -> header, connections, warp_events,
    object_events, coord_events (triggers), bg_events (signs)
  FireRed data/maps/<Map>/scripts.inc -> MapScripts: MAP_SCRIPT_ON_TRANSITION,
    MAP_SCRIPT_ON_FRAME_TABLE, plus per-object scripts, flag set/check
    (goto_if_set / setflag), badge flags FLAG_BADGE01_GET..08_GET.
  Mochiichao replacements: map.json -> Tiled JSON + mochiichao extension keys
    (mapScripts, scripts); scripts.inc -> the map's "scripts" table;
    badge flags -> dojo_N_badge Fragment flags (see progression.json).

Usage: python3 scripts/validate_world.py   (run from world-dialogue/)
Exit 0 = all hard checks pass (warnings about open slots do not fail).
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PASS = FAIL = WARN = 0
FAILURES, WARNINGS = [], []

def check(ok, label):
    global PASS, FAIL
    if ok: PASS += 1
    else: FAIL += 1; FAILURES.append(label)
    print(("PASS " if ok else "FAIL ") + label)

def warn(label):
    global WARN
    WARN += 1; WARNINGS.append(label)
    print("WARN " + label)

def load(p):
    return json.loads(Path(p).read_text())

def props(obj):
    return {p["name"]: p["value"] for p in obj.get("properties", [])}

def flag_names_from_condition(cond):
    # "NOT has_starter" or a bare flag name
    if not cond: return []
    return [cond.replace("NOT ", "").strip()]

def main():
    prog = load(ROOT / "progression" / "progression.json")
    known_flags = set(prog["flags"])
    dlg = load(ROOT / "dialogue" / "sample_dialogue.ink.json")
    knots = dlg["knots"]

    # Known map ids: the 16 in FullWorldMaps.ts (in-code, Region 1) + staged samples.
    known_maps = {"aeon_lab","sector_0","route_1","mochiiplex_1","binary_fields",
                  "dojo_1","binary_woods","cave_of_echoes","neon_city","scrap_junkyard",
                  "coral_approach","castagnoli_island","mauveville_arena","boot_bay",
                  "luigi_mansion","dojo_2"}
    future_maps = {"elite_chambers"}  # declared future dest; allowed, flagged as future

    map_files = sorted((ROOT / "maps").glob("*.json"))
    check(len(map_files) == 2, f"map files staged: {len(map_files)} (expected 2 samples)")
    all_dialogue_refs = set()

    for mf in map_files:
        m = load(mf)
        mid = m["id"]
        check(mid not in known_maps, f"{mid}: sample id is new (not colliding with in-code map)")
        known_maps.add(mid)
        w, h = m["width"], m["height"]
        check(w > 0 and h > 0, f"{mid}: width/height positive ({w}x{h})")
        tile_layers = [l for l in m["layers"] if l["type"] == "tilelayer"]
        check(len(tile_layers) >= 1, f"{mid}: has >=1 tilelayer")
        for tl in tile_layers:
            check(len(tl["data"]) == w * h,
                  f"{mid}: tilelayer '{tl['name']}' data length {len(tl['data'])} == {w*h}")
            check(all(isinstance(t, int) and 0 <= t <= 25 for t in tl["data"]),
                  f"{mid}: tilelayer '{tl['name']}' tile ids all in WorldConstants TILE range 0-25")
        check("playerStart" in m and 0 <= m["playerStart"]["x"] < w
              and 0 <= m["playerStart"]["y"] < h, f"{mid}: playerStart in bounds")
        scripts = m.get("scripts", {})
        for hook in ("on_transition", "on_frame"):
            for s in m.get("mapScripts", {}).get(hook, []):
                check(s in scripts, f"{mid}: mapScript {hook} '{s}' exists in scripts table")
                for f in scripts.get(s, {}).get("sets_flags", []) + scripts.get(s, {}).get("checks_flags", []):
                    check(f in known_flags, f"{mid}: mapScript '{s}' flag '{f}' in progression registry")
        objs = [o for l in m["layers"] if l["type"] == "objectgroup" for o in l["objects"]]
        ids = [o["id"] for o in objs]
        check(len(ids) == len(set(ids)), f"{mid}: object ids unique ({len(ids)} objects)")
        for o in objs:
            tx, ty = o.get("tileX"), o.get("tileY")
            check(tx is not None and 0 <= tx < w and 0 <= ty < h,
                  f"{mid}: object '{o['name']}' ({o['type']}) in bounds tile ({tx},{ty})")
            check(o["x"] == tx * 16 and o["y"] == ty * 16,
                  f"{mid}: object '{o['name']}' Tiled px ({o['x']},{o['y']}) == tile*16")
            pr = props(o)
            if "script" in pr:
                check(pr["script"] in scripts,
                      f"{mid}: object '{o['name']}' script '{pr['script']}' exists")
            if "dialogueKnot" in pr:
                all_dialogue_refs.add(pr["dialogueKnot"])
                check(pr["dialogueKnot"] in knots,
                      f"{mid}: object '{o['name']}' dialogueKnot '{pr['dialogueKnot']}' exists")
            if "blocked_dialogueKnot" in pr:
                all_dialogue_refs.add(pr["blocked_dialogueKnot"])
                check(pr["blocked_dialogueKnot"] in knots,
                      f"{mid}: gate '{o['name']}' blocked knot '{pr['blocked_dialogueKnot']}' exists")
            if o["type"] == "warp":
                dest = pr.get("dest_map")
                check(dest in known_maps or dest in future_maps,
                      f"{mid}: warp '{o['name']}' dest_map '{dest}' known or declared future")
                if dest in future_maps:
                    warn(f"{mid}: warp '{o['name']}' dest '{dest}' is a FUTURE map, not yet built")
            if o["type"] == "sign":
                check(bool(pr.get("text", "").strip()),
                      f"{mid}: sign '{o['name']}' has non-empty text")
            if o["type"] == "heal_point":
                check(pr.get("heals_party") is True,
                      f"{mid}: heal_point '{o['name']}' heals_party=true")
                check("dialogueKnot" in pr, f"{mid}: heal_point '{o['name']}' has dialogue")
            if o["type"] == "trigger":
                for f in flag_names_from_condition(pr.get("condition", "")):
                    check(f in known_flags, f"{mid}: trigger '{o['name']}' condition flag '{f}' known")
            if o["type"] == "gate":
                req = pr.get("requires_flags", "")
                req_list = [r.strip() for r in req.split(",")] if req else []
                check(len(req_list) >= 1, f"{mid}: gate '{o['name']}' has >=1 required flag")
                for f in req_list:
                    check(f in known_flags, f"{mid}: gate '{o['name']}' required flag '{f}' known")
                # Gate script must agree with the object-level flag list.
                gs = scripts.get(pr.get("script", ""), {})
                check(sorted(gs.get("requires_flags", [])) == sorted(req_list),
                      f"{mid}: gate '{o['name']}' script flag list matches object flag list")

    # ---- Dialogue graph (Ink pattern) ----
    check(len(knots) >= 1, f"dialogue: {len(knots)} knots")
    total_stitches = total_choices = total_lines = 0
    for kname, knot in knots.items():
        for sname, stitch in knot["stitches"].items():
            total_stitches += 1
            lines = stitch.get("lines", [])
            total_lines += len(lines)
            check(len(lines) >= 1, f"dialogue {kname}.{sname}: >=1 line")
            for ln in lines:
                check(bool(ln.get("text", "").strip()),
                      f"dialogue {kname}.{sname}: line text non-empty")
            choices = stitch.get("choices", [])
            total_choices += len(choices)
            terminates = stitch.get("exit") is True
            for c in choices:
                cond = c.get("condition", {})
                for f in ([cond["flag"]] if "flag" in cond else []) + cond.get("all_flags", []):
                    check(f in known_flags, f"dialogue {kname}.{sname}: choice flag '{f}' known")
                for f in c.get("setFlags", []):
                    check(f in known_flags, f"dialogue {kname}.{sname}: setFlags '{f}' known")
                if c.get("exit") is True:
                    terminates = True
                else:
                    t = c.get("target", {})
                    check(t.get("knot") in knots and t.get("stitch") in knots.get(t.get("knot"), {}).get("stitches", {}),
                          f"dialogue {kname}.{sname}: choice target {t.get('knot')}.{t.get('stitch')} exists")
                    all_dialogue_refs.add(t.get("knot"))
            check(terminates or len(choices) > 0,
                  f"dialogue {kname}.{sname}: terminates (exit) or offers a choice")
    print(f"INFO dialogue totals: {len(knots)} knots, {total_stitches} stitches, "
          f"{total_lines} lines, {total_choices} choices")
    for kname in knots:
        check(kname in all_dialogue_refs or kname in dlg.get("entries", []),
              f"dialogue knot '{kname}' reachable (entry, map ref, or choice target)")

    # ---- Progression wiring ----
    dojos = prog["dojos"]
    check(len(dojos) == 8, f"progression: 8 dojo slots (got {len(dojos)})")
    check([d["number"] for d in dojos] == list(range(1, 9)), "progression: dojo numbers 1-8 in order")
    check([d["badge_flag"] for d in dojos] == [f"dojo_{i}_badge" for i in range(1, 9)],
          "progression: dojo flags dojo_1_badge..dojo_8_badge in order")
    filled = [d for d in dojos if d["leader"]]
    check(len(filled) == 7, f"progression: dojo leaders filled 7/8 (Lin, Falk, Tetsu, Kenji, Phantom, Shizuku, Homura) — Dojo 8 still open")
    check([d["leader"] for d in dojos] == ["Master Lin", "Master Falk", "Tetsu", "Kenji", "Phantom", "Shizuku", "Homura", None],
          "progression: dojo leader names in order, Dojo 8 leader null, Phantom NOT Kage")
    for gate in prog["gates"]:
        req = gate["requires_flags"]
        check(all(f in known_flags for f in req), f"progression gate '{gate['gate']}' flags known")
    def gate_open(req, flags): return all(f in flags for f in req)
    vic = next(g for g in prog["gates"] if g["kind"] == "victory_route_gate")
    elite = next(g for g in prog["gates"] if g["kind"] == "elite_gate")
    seven = {f"dojo_{i}_badge" for i in range(1, 8)}
    eight = seven | {"dojo_8_badge"}
    check(not gate_open(vic["requires_flags"], seven), "GATE SIM: Victory Route BLOCKED with 7/8 dojo flags")
    check(gate_open(vic["requires_flags"], eight), "GATE SIM: Victory Route OPEN with 8/8 dojo flags")
    check(not gate_open(elite["requires_flags"], seven), "GATE SIM: Elite gate BLOCKED with 7/8 dojo flags")
    check(gate_open(elite["requires_flags"], eight), "GATE SIM: Elite gate OPEN with 8/8 dojo flags")
    check(not gate_open(vic["requires_flags"], set()), "GATE SIM: Victory Route BLOCKED with 0 flags")
    check(len(prog["elite_four"]) == 4, "progression: 4 Elite Four slots")
    check([e["name"] for e in prog["elite_four"]] == ["Umi", "Gin", "Hono", "Yoru"],
          "progression: Elite Four names locked Umi/Gin/Hono/Yoru, dialogue/teams still open")
    champ = prog["champion"]
    check(champ["holder"] is None and champ["status"] == "open_slot",
          "progression: Champion slot present but holder=null/open_slot (Mars resolution owed)")
    check(len(prog["syndicate_admins"]) == 10, "progression: 10 Syndicate admin slots")
    check(all(a["name"] is None for a in prog["syndicate_admins"]),
          "progression: admin names/themes/dialogue/placements all OPEN SLOT (none invented)")
    open_slots = (8 - len(filled)) + 4 + 1 + 10
    warn(f"OPEN SLOTS (Mars-only, counted not filled): {open_slots} "
         f"= dojo leaders {8-len(filled)}/8 + elite dialogue/teams 4/4 + champion 1/1 + admins 10/10")

    print(f"\nRESULT: {PASS} passed, {FAIL} failed, {WARN} warnings")
    if FAILURES:
        print("FAILURES:"); [print(" - " + f) for f in FAILURES]
    return 1 if FAIL else 0

if __name__ == "__main__":
    sys.exit(main())
