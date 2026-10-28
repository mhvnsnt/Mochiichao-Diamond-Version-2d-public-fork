# DIALOGUE WIRING — REGION 1 MANIFEST (PR feature/dialogue-wiring-r1-1)

Every wired line traces: **template function + source → placed line**.
Sources: PL = dialogue template library PILOT-BATCH (P-##), SP = wiring-pass
supplement (S-##), both adapted from TAXONOMY skeletons measured on the
Gen 1–3 banks (reference only — no source wording carried, Adaptation Rule 1).
All wired text was verified verbatim against the two draft files at wiring
time; no line was reworded, and no pre-existing line in any file was altered
or deleted (additive-only, machine-checked per file: stripping the added
keys/entries reproduces the main-branch file exactly).

## Schema used (the target files' own ecosystem shape)

The wiring map NPC entries (`src/lib/wiring/maps/*.json`) carried no dialogue
fields at all (id/x/y/name/role only). Fields were added in the shapes the
game already uses elsewhere:

- `dialog: string[]` — standing/ambient/service text. Mirrors `dialog` on
  NPCs in `src/world/FullWorldMaps.ts`.
- `dialogAfter: string[]` — the state-swapped standing text (dojo guide
  after the badge; the guide skeleton's two-state shape).
- `battleDialog: {intro, defeat, after}` — the Ranger battle triple. Beat
  names follow the locked dialogue system's event stitches
  (intro / defeat / after in `src/lib/wiring/validate-dialogue.ts`).
- Signs appended as `{x, y, text}` entries in the file's existing `signs`
  array shape, at entrance-adjacent tiles.

The story spine was not touched: `region1-dialogue.json` and
`region1-truck-start.ink` are unchanged in this PR, and the locked
`ink-dialogue-locked-2026-10-26.json` is unchanged.

| # | Function | Source | Target file | NPC / object | Lines wired | Notes |
|---|---|---|---|---|---|---|
| 1 | F1 healer (first-home variant) | SP S-01 | src/lib/wiring/maps/sector0_house_1f.json | Your Mom (`mom_house`, heal) | 5 blocks (incl. the `[…]` rest beat) | Standing heal service for the home interior; the Sprint Boots gift stays spine (.ink) and is not duplicated. Outdoor `mom` in sector0.json left as-is. |
| 2 | F2 shop | PL P-06 | src/lib/wiring/maps/sector0.json | Shopkeeper (`shopkeeper`, shop) | 3 blocks | Block 3 is the set's drafted in-shop child bark, carried in the same set as drafted (speaker shift is in the source set). |
| 3 | F2 shop | PL P-04 | src/lib/wiring/maps/mochiiplex_1.json | Clerk (`shop_1`, shop) | 3 blocks | Greet / menu-position / farewell beats; extends the spine clerk's stock (Capture Cubes, Mend Patches, Mochi Cards). |
| 4 | F3 sign | PL P-08 | src/lib/wiring/maps/binary_woods.json | New sign at (30, 17), east entrance | 1 sign (3 lines) | The map had no signs; the plan authorises a fabric forest-entrance sign (the Silicon Town sign edit belongs to the canon sweep and was not touched). |
| 5 | F8 villain ambient | PL P-24 | src/lib/wiring/maps/binary_woods.json | Hacker Grunt (`hacker_grunt2`) | 3 blocks in `dialog` | Double-layer wording kept exactly as drafted; no other character decodes it. |
| 6 | F8/F5 villain battle triple | SP S-13 | src/lib/wiring/maps/binary_woods.json | Hacker Grunt (`hacker_grunt2`) | intro / defeat / after in `battleDialog` | Same NPC as row 5 (ambient + battle sets, as drafted). Defeat line's upward leak kept verbatim. |
| 7 | F5 Ranger triple | SP S-11 | src/lib/wiring/maps/binary_woods.json | Bug Catcher Mira (`trainer_bugcatcher_mira`) | intro / defeat / after | Map-named NPC; speaker and bug theme are the map file's own data. |
| 8 | F5 Ranger triple | PL P-17 | src/lib/wiring/maps/binary_woods.json | Woods Walker Tess (`trainer_woodswalker_tess`) | intro / defeat / after | Plan placement names Tess; the draft's speaker role matches. Tail-tip flame canon kept in the after line. |
| 9 | F6 dojo guide | PL P-20 | src/lib/wiring/maps/binary_fields.json | Dojo Acolyte (`dojo1_guard`, Champions Dojo door, Silicon Town) | 2 blocks in `dialog` (before) + 1 block in `dialogAfter` | The map's dojo-door NPC is the guide slot for Champions Dojo. Master Lin's creed is quoted by his guide, not re-authored (spine stays spine). |
| 10 | F3 plaque | SP S-06 | src/lib/wiring/maps/dojo_1.json | New sign at (6, 16), dojo entrance | 1 sign (2 lines) | Plaque placed in the dojo interior; binary_fields.json already carries a written Champions Dojo facility sign, which was not altered. |
| 11 | F5/F6 dojo underling triple | PL P-21 | src/lib/wiring/maps/dojo_2.json | Acolyte Gale (`dojo_acolyte_gale`) | intro / defeat / after | First underling inside the Aero Dojo door. Acolyte Skye carries no drafted set and was left unwired. Master Falk untouched (spine). |
| 12 | F3 plaque | SP S-05 | src/lib/wiring/maps/dojo_2.json | New sign at (4, 14), dojo entrance | 1 sign (2 lines) | Aero Dojo door plaque, as drafted. |
| 13 | F5 Ranger triple | SP S-12 | src/lib/wiring/maps/route_2.json | Road Walker (`route2_walker`) | intro / defeat / after | The route's only walker NPC. Note: its map `role` is `npc`, not `trainer` — the triple is wired to the named placement; flagging the role mismatch for review rather than changing the role field. |
| 14 | F4 ambient bark | PL P-15 | src/lib/wiring/maps/stoneport_city.json | Dockhand Juno (`dockhand_juno`) | 3 blocks | Far-pier occupation texture from the bystander's side, as drafted; nobody decodes anything. |
| 15 | F10 ferry | PL P-28 | src/lib/wiring/maps/coral_approach.json | Capt. Neri (`boat_captain`) | 4 blocks | Boot Bay's own map has no NPCs at all; Capt. Neri is the boat captain for the Castagnoli Island crossing (Coral Reef Approach → island), so the ferry set is wired to the crossing's operator. The mid-crossing gull-count gag is block 4. |
| 16 | F3 town sign | SP S-03 | src/lib/wiring/maps/neon_city.json | New sign at (17, 35), city entrance | 1 sign (2 lines) | Neon City had no signs. |
| 17 | F3 warning sign | SP S-07 | src/lib/wiring/maps/cave_of_echoes.json | New sign at (6, 1), cave mouth | 1 sign (3 lines) | The cave map had no signs; plaque sits at the entrance tile row. |
| 18 | F5 Ranger triple | PL P-16 | src/lib/wiring/maps/route_1.json | Youngster Jay (`trainer_youngster`) | intro / defeat / after | Jay's team is Sproutle (trainers-region1.ts R1-001), matching the set. The other route_1 trainers (Amy, Dan, Rick) have no drafted triples and were left unwired — their spine lines in region1-dialogue.json Beat 2 are untouched. |

## Counts by function
F1 1 · F2 2 · F3 5 · F4 1 · F5 4 · F6 2 · F7 0 · F8 2 · F9 0 ·
F10 1 · F11 0 · F12 0 — **TOTAL 18 line-sets wired across 13 files.**
Draft pool was 51 line-sets (P-01–P-30 + S-01–S-21); 33 not wired, below.

## Sweep dependency
Built on: [x] swept main (canon-sweep PR #371 merged) / [ ] current main +
ruled name list applied to added lines only (spine untouched either way).
All wired lines use swept display names (The Dark Forest, Champions Dojo,
Aero Dojo, Route Topaz / Route Emerald in referenced text, Mochiioteca class
names, Rangers — no "trainer" in any wired display line; creatures are never
given word-dialogue).

## P-27 — delivered as spec text (no game-data home exists)

P-27 (F9 system voice, Mochiioteca prompts) has no game-data home: there is
no system/UI strings file in the wiring data. Per the landing plan it ships
here as spec text for the engine lane, verbatim as drafted:

> *(first record)* "Recorded in the Mochiioteca."
> *(repeat)* "Already in the Mochiioteca. It remembers you too."
> *(gate check)* "Eight Fragments. The Victory Route gate will open."
> *(cocoon ready)* "The Cocoon keeper will want to see this one."

## Left unwired, with reasons

**No map / NPC exists in the wiring set (placement gap — not forced):**
- P-01, P-02 (Aeon Clinic keeper + patient) — no Aeon Clinic map or clinic
  NPC exists in `src/lib/wiring/maps/`; Silicon Town's heal slot is the
  MochiiPlex Center Nurse, and P-01's lines name the Aeon Clinic, so wiring
  them onto the nurse would mislabel the speaker.
- P-03, P-10, P-22, P-23, P-29, S-16, S-17 (Garden sets: night keeper, gate
  sign, Plaza keeper, Cocoon keeper, Circuit race day, Aeon Spire keeper,
  farm plot talk) — there are no garden map files in the wiring set; the
  garden lane on main is systems data only (`src/lib/garden-data.ts`,
  `src/lib/garden-wiring.ts` hold no NPC dialogue slots).
- P-26, S-18 (Mochiko Academy lessons) — no Academy map/NPC in the wiring set.
- P-09, S-21 (Iridescence Plateau ascent sign, Hall of Records keeper) — no
  plateau / victory-route map file exists in the wiring set.
- P-05, S-02 (Silicon Town Market stalls) — binary_fields.json has no market
  or stall NPC (its NPCs are the dojo guard, Town Girl, Old Man).
- P-11 (Route Topaz ledge walker) — route_1.json's NPCs are all battle
  trainers; there is no walker NPC to carry an ambient tutorial bark.
- P-12 (Route Emerald fisher) — route_2.json has no fisher NPC.
- P-13 (Neon City commuter) — neon_city.json's NPCs are the Data Astrologer
  and Cyber Shaman; no commuter NPC.
- P-14 (Dark Forest Listener) — binary_woods.json's NPCs are all battle
  trainers; no ambient walker NPC.
- P-18, S-20 (Gauntlet entrant triple, announcer + crowd) —
  mauveville_arena.json's only NPC is Champion MYTHAR (spine-class,
  untouched); no entrant, announcer, or crowd NPCs exist.
- P-19 (Sailor Ranger triple) — stoneport_city.json has no sailor NPC
  (Dockhand Juno carries P-15; the Harbour Guard's role does not match).
- P-25 (Far Pier Grunt triple) — no far-pier grunt NPC exists in
  stoneport_city.json (the Stoneport Docks Hacker Vex exists only in
  trainers-region1.ts, with no map entry).
- P-30 (Cave guide set) — cave_of_echoes.json has no guide NPC (Miner Cleff
  and Cave Runner Pike are battle trainers); the cave guide speaks in the
  spine (region1-dialogue.json Beat 5), which is read-only here.
- S-08 (Boot Harbor porch bark) — no porch/widow NPC in sector0 or its
  house maps.
- S-09 (Scrap Junkyard hand) — scrap_junkyard.json's only NPC is Junk
  Warlord Krix (boss; the draft itself authors no boss dialogue).
- S-10 (Reserve walker bark) — castagnoli_island.json's only NPC is Luigi
  Castagnoli (trainer/boss-class, untouched).
- S-14 (Aero Dojo guide) — dojo_2.json has no guide NPC (leader + two
  acolyte trainers only).
- S-15 (Chrome Gate guide) — dojo_3.json has no guide NPC (two acolytes +
  the Dojo Leader, whose lines are spine/owner-class).
- S-19 (Stoneport ferry gatekeeper) — no ferry gatekeeper NPC in
  stoneport_city.json; the Harbour Guard's guard role does not carry the
  ticket-check function, so it was not forced onto him.

**Already covered by a written sign (additive-only forbids replacing it):**
- P-07 (Route Topaz sign) — route_1.json already has a written sign,
  "ROUTE TOPAZ\nNorth to Silicon Town", at the south end.
- S-04 (Stoneport sign) — stoneport_city.json already has a written sign,
  "STONEPORT CITY\nHarbour, docks, and the road south to Neon City."

**Owner-class / spine-class (per the landing plan, stays unwired):**
- Dojo leader creeds and leader lines beyond the spine (Dojos 1–8) — not
  authored or altered here; Master Lin, Master Falk, and the Dojo 3 leader
  entries are untouched.
- Dojo 8 acolyte fabric — no Dojo 8 map exists in the wiring set, and the
  Syndicate-boss dojo is owner-class regardless.
- All other acolytes/underlings without a drafted set (Dojo 1
  Acolytes Ken/Ren/Shin/Ryu, Dojo 2 Acolyte Skye, Dojo 3 Acolytes Volt/Alloy)
  — no draft in the pool targets them; nothing was invented to fill them.

## Per-file before/after record

Every edited file: before = main-branch file (NPCs with no dialogue fields;
signs as listed), after = same file with only the additions in the table
above. Machine-verified for all 13 files: JSON parses after edit; removing
the added NPC keys and added sign entries reproduces the main file exactly
(zero altered or deleted pre-existing content, zero changed lines).
Files edited: sector0.json, sector0_house_1f.json, mochiiplex_1.json,
route_1.json, binary_fields.json, binary_woods.json, dojo_1.json,
dojo_2.json, route_2.json, stoneport_city.json, coral_approach.json,
neon_city.json, cave_of_echoes.json (all under src/lib/wiring/maps/).
