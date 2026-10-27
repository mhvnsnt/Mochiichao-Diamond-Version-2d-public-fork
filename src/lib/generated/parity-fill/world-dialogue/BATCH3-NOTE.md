# PR Batch 3 — World / dialogue / progression (data shapes, NOT live wiring)

Status: landed as data under `src/lib/generated/parity-fill/world-dialogue/`.
NOT imported by App.tsx or game code yet. Live wiring + playtest are later steps
(finish-first order: playtest LAST, after everything is finished).

## Counts (percentage rule: counts behind every %)

- Map schema: 1/1 (MAP-SCHEMA.md) + sample maps 2/2 (boot_harbor_gate_sample,
  victory_route_gate_sample). Validator: 173 passed, 0 failed, 2 warnings.
- Dialogue sample: 6/6 knots, 10/10 stitches, 14/14 lines, 11/11 choices.
  All dialogue written fresh for Mochiichao; no Pokemon dialogue copied verbatim,
  no Pokemon town/character names copied.
- Progression shape: flags 15/15, gates 4/4, dojo slots 8/8, Elite slots 4/4,
  Syndicate admin slots 10/10, Champion slot 1/1 present.
- Dojo leaders named: 7/8 = 88% (Master Lin, Master Falk in code + Tetsu Dojo 3,
  Kenji Dojo 4, Phantom Dojo 5, Shizuku Dojo 6, Homura Dojo 7 newly locked by
  parent task 2026-10-26). Dojo 8 leader: 0/1, still null/open (not named by
  this batch's task, not invented).
- Phantom is NOT Kage: Kage is a Pokemon name and is not used. Phantom is the
  Japanese samurai oni mask leader.
- Dojo 3-7 dialogue: 0/5, teams: 0/5, Fragment names: 0/5 (all open, not invented).
  In-code/locked for reference: Lin dialogue in_code + team in_code; Falk
  dialogue locked_approved + team locked (019/020/021).
- Elite Four names: 4/4 = 100% (Umi, Gin, Hono, Yoru, in that order).
  Elite dialogue: 0/4, Elite teams: 0/4 (open, not invented).
- Champion: 0/1 resolved. Holder null, status open_slot. The Hex vs Mythar
  conflict is UNRESOLVED and is NOT resolved here.
- Syndicate admins: 0/10 named (not in this batch's task; left null).

## Files

- maps/MAP-SCHEMA.md, maps/boot_harbor_gate_sample.json,
  maps/victory_route_gate_sample.json
- dialogue/dialogue-system.md, dialogue/sample_dialogue.ink.json
- progression/progression.json, progression/progression.ts
- scripts/validate_world.py (expectations updated for the Batch 3 locked names:
  leaders 7/8, Elite names Umi/Gin/Hono/Yoru; champion-null and admin-null
  checks unchanged)

## Held (not claimed done)

- Live wiring of maps/dialogue/progression into game code: 0% (data only).
- Dojo 8 leader, Dojo 3-7 dialogue/teams/Fragment names, Elite dialogue/teams,
  Champion resolution, Syndicate admins: all Mars-only, explicitly null.

## POST-BRIEF Mars decisions (2026-10-26 ~14:15 CDT) — NOT applied here, parent to confirm

These decisions landed in standing memory AFTER this batch's task brief (which
ordered the Champion slot left null and Dojo 8 unnamed). They are recorded
here, NOT silently applied, so the parent can authorize a follow-up delta PR:

- CHAMPION RESOLUTION (Mars 14:15): Champion Hex first, then Mythar at the
  end, Arceus-like. Mythar appears after Hex, says "I am Mythar. The end of
  all challengers.", is creature #331 but transforms Pokemon <-> human and
  battles, with mid-battle dialogue + sprite swap human <-> mochi. This batch
  still ships champion holder null per its brief; applying the two-stage
  Hex-then-Mythar shape is a follow-up, not done here.
- IWAO (Mars 14:15, SUPERSEDED 14:39): the 14:15 note said Iwao takes a
  Region 1 Earth-side slot. The 14:39 lock supersedes it: Iwao is MALE,
  dual dojo leader — FIRST Region 2 Dojo 3 Chrome (Goldenrod, Chrome
  Fragment, Gorokappa 034 Lv27 / Chromejaww 005 Lv27 / Mechapion 033 Lv28,
  reward 2300), THEN Region 3 Dojo 1 Core (Rustboro, Core Fragment, return
  fight, carryover species not yet picked). No locked Region 1 leader is
  displaced, and Iwao is NOT the Dojo 8 leader. NOT applied here: this batch
  is Region 1 progression shape only and leaves Dojo 8 leader null per its
  brief; Iwao's Region 2/3 dojos are a follow-up, not done here.
