> **STATUS: owner-reviewed names locked 2026-10-27.** Final signature table:
> Mochii HYDRO RUSH (canon AQUA_JET) / Kittember FIRE STREAM (already original,
> unchanged) / Sproutle LEAF BLAST (canon RAZOR_LEAF) / Wispkin DARK WAVE
> (canon SHADOW_PULSE) / Dorowani WATER ORB / Gabu TREMOR. Batch-1 landing:
> display names renamed in `src/data/core/moves.json`, internal ids unchanged
> (rename-on-use law). Final owner resolution (2026-10-27) SUPERSEDES this
> draft's earlier "Water Orb has no moves.json entry / stats owner-TBD" state:
> Water Orb replaces the AQUA_SHOT entry's display name (stats inherited:
> WATER Special 40/100/25, id AQUA_SHOT stable), and Tremor replaces the
> EARTH_TREMOR entry's display name (GROUND Physical 100/100/10, id
> EARTH_TREMOR stable). The analysis and addenda below are the record of how
> the table was reached.

# CANON SIGNATURE ATTACKS — per-species mapping from game data

Draft for owner review (2026-10-27). NO repo commits. Nothing in this file invents a move, a stat, or an assignment: every pick is cited to a game-data file, and every place the data runs out is marked OWNER CALL / TBD in the open.

**Owner law being applied (Jamar, 2026-10-27):** Water Orb is Dorowani's alone. No other character gets a Water Orb or a shared attack template — each species' signature attack comes from game canon for that species.

## Sources used (repo: mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start)

- `src/data/core/moves.json` — 36 moves, ids/names/values verbatim from `src/lib/moves.ts`.
- `src/data/core/learnsets.json` — level-up learnsets for species 001–047 (12/47 verified from species.ts; the rest self-flagged "provisional baseline" in the file's own `source` field — flagged per species below). TM/egg/tutor tables are empty for all 47 ("owed, not invented").
- `src/data/core/species.json` — canonical 47 roster (id/name/elements/stats) from `src/lib/global_roster.json`.
- `src/lib/species.ts` — SPECIES_DB; the source the core files were converted from, and the ONLY file that carries entries for Dorowani (147) and Gabu (148).
- `show/production/rigs/builds/<species>/RIG-NOTES.md` — what each rig's signature animation actually does.

**Type note:** species.json uses show element names (Aqua / Flame / Flora / Chrome / Umbral / Beast); moves.json and species.ts use battle types (WATER / FIRE / GRASS / STEEL / GHOST / DARK). STAB below is judged on the species.ts battle type ↔ move type match, which is unambiguous for all six.

**"Orb" check (asked for explicitly):** NO move in moves.json has "orb" in its id, name, or description. The only ball-shaped attack descriptions in the data are AQUA_SHOT ("A small ball of water hurled at the foe") and SHADOW_PULSE ("Shadow ball that may cause flinch"). **Water Orb exists only as owner canon** (the Dorowani making_something avatar animation, PR #345) — it has no moves.json entry, and its stats are owner-TBD.

---

## 1. MOCHII — species 001

- **Type:** Aqua (species.json) / WATER (species.ts). Dex: "A small, water-based creature that bounces to move."
- **Canon pool** (`learnsets.json` 001, source: species.ts verified — not provisional):
  - L1 TACKLE — NORMAL Physical, 40 / acc 100 / PP 35
  - L5 QUICK_ATTACK — NORMAL Physical, 40 / acc 100 / PP 30, priority +1
  - L8 AQUA_SHOT — WATER Special, 40 / acc 100 / PP 25
  - L15 AQUA_JET — WATER Physical, 40 / acc 100 / PP 20, **priority +1**
- **Uniqueness check:** AQUA_JET is learned by **Mochii alone** — 1 of 47 species in learnsets.json. AQUA_SHOT is shared by 11 species (the whole Aqua family + Razorgater). AQUA_JET's own `anim` key in moves.json points at AQUA_SHOT (shared animation asset in the game data).
- **SIGNATURE PICK: AQUA_JET** — the only move in the entire game data that belongs to Mochii and nobody else, and it is STAB. Its description fits the species' canon locomotion ("Moves first with a coating of water"; Mochii "bounces to move"). Highest-power STAB is a tie at 40 (AQUA_SHOT = AQUA_JET), so the tie is broken by exclusivity, per the preference order.
- **Rig read (squash_hop, 1.6s):** PARTIAL. The squash-and-stretch hop sells the launch/anticipation and a water-coat FX layer can wrap the body mid-hop, but Aqua Jet is a *forward, moves-first dash* and the deform animation travels vertically — the hit itself needs a forward translation on the composite layer (or a future dash variant of the rig anim). The motion does not need replacing; it needs travel added in the shot.

## 2. DOROWANI — held-out species 147

- **Verified gap (checked 2026-10-27 against the files themselves):** "Dorowani" appears **nowhere** in `src/data/core/species.json`, `src/data/core/learnsets.json`, or `src/lib/global_roster.json`. The 47-species core data simply does not contain him.
- **Where he does exist:** `src/lib/species.ts`, SPECIES_DB entry `"147"` — held out of the roster conversion ("147 Dorowani, 148 Gabu — Mars numbers owed. NOT added here."). That entry gives: types [WATER] (comment in the file: water type "verified from sprite-art notes"; the stat block is explicitly "filled from Pokemon code by Mars's fill-from-source rule, not from a Mochiichao source (none exists)"); description "A blue water creature with long arms and red fins, built for swimming."; learnset = `[...BASIC_MOVES]` = TACKLE (L1) + QUICK_ATTACK (L5) only — and the file's own header states BASIC_MOVES learnsets are "neutral defaults, NOT canon."
- **So the game data assigns Dorowani NO canon attack move.** His signature is therefore not a data question at all:
- **SIGNATURE: WATER ORB — owner canon** (Jamar, 2026-10-27; PR #345). The making_something avatar animation IS the attack: a water orb formed in the hands and thrown/blasted. **Stats: OWNER-TBD — never invented.** It is not AQUA_SHOT / AQUA_CANNON / HYDRO_SURGE / AQUA_JET; those are separate moves in moves.json and none of them is his. (For FX reference only, the WATER family in moves.json runs: Aqua Shot 40 → Aqua Jet 40 priority → Aqua Cannon 90 → Hydro Surge 120.)
- **Rig read (water_orb_charge, 2.6s):** EXACT by construction. RIG-NOTES: "crouch + both arms gather inward and hold in front of the lower belly, the Water Orb charge pose; the orb itself is an FX/prop layer, the rig supplies the pose." The deform motion IS the canon attack's delivery motion.

## 3. GABU — held-out species 148 — **OWNER CALL**

- **Verified gap:** Same status as Dorowani — absent from species.json / learnsets.json / global_roster.json. Present only in `src/lib/species.ts` SPECIES_DB `"148"`.
- **What that entry actually says (quoted substance):** types [NORMAL] with the file's own comment: *"Type filled as NORMAL by default: no source assigns Gabu an element yet (not in global_roster, not in any Pokemon game). NORMAL is the absence-of-type default, not a canon claim — replace it the moment Mars assigns Gabu an element."* Stats are a borrowed first-stage pattern (file says so). Description: "A teal, spiky creature with a wide mouth and a tan belly, built for charging in." Learnset = BASIC_MOVES only (TACKLE / QUICK_ATTACK), which the file header explicitly calls NOT canon.
- **Conclusion: the game data contains NO canon attack, element, or signature for Gabu.** Picking one for him from moves.json would be invention, so this slot is **OWNER CALL**. For the owner's decision only, the nearest data points (none of these is assigned to Gabu anywhere):
  - CRUNCH — DARK Physical, 80 / acc 100 / PP 15, "Crunches with fangs." In core learnsets it belongs to Chromejaww (005) alone. It is the only bite move in moves.json, and Gabu's rig signature is a jaw chomp with a "wide mouth" design — the motion match is exact, the canon assignment does not exist.
  - BODY_SLAM_MOVE (Body Slam) — NORMAL Physical, 85 / acc 100 / PP 15, "Slams foe with full body." Matches "built for charging in" and his (default, non-canon) NORMAL typing — but it is learned by **zero** species in the level-up data.
  - 12 of the 36 moves in moves.json are learned by nobody via level-up (AQUA_CANNON, BODY_SLAM_MOVE, DARK_PULSE_MOVE, FIRE_PUNCH_MOVE, INFERNO_WAVE, NIGHT_SLASH_MOVE, PETAL_BARRAGE, POISON_JAB, SPARK_SHOT, THUNDER_BOLT, WILD_CHARGE, WING_ASSAULT) — unassigned inventory the owner can draw from when he assigns Gabu an element and a move in the data.
- **Rig read (jaw_chomp, 1.4s):** The MOTION is ready for a bite-class signature (jaw opens, snaps shut, head dip) — whichever move the owner assigns, if it is a chomp/crunch, the deform delivers it with an impact FX layer. Known shortfall already in RIG-NOTES: the chomp reads subtle because the canon muzzle is fused/front-facing; a true open-mouth read needs the v2 pieces pass. The blocker for Gabu is canon assignment, not animation.

## 4. KITTEMBER — species 010

- **Type:** Beast/Flame (species.json) / FIRE (species.ts). Dex: "A fiery little feline."
- **Canon pool** (`learnsets.json` 010, source: species.ts verified — not provisional):
  - L1 TACKLE — 40 / L5 QUICK_ATTACK — 40
  - L6 EMBER_TOSS — FIRE Special, 40 / acc 100 / PP 25, 10% burn
  - L14 FIRE_STREAM — FIRE Special, **90** / acc 100 / PP 15, 10% burn, "A sustained jet of fire"
- **Uniqueness check:** FIRE_STREAM is learned by **Kittember alone** — 1 of 47. Its own evolutions (Pyropaw 011, Manticlaw 012) top out at EMBER_TOSS in the provisional baselines; EMBER_TOSS itself is shared by 6 species (the whole Flame family).
- **SIGNATURE PICK: FIRE_STREAM** — unique to Kittember in all of the game data AND its highest-power STAB (90). Cleanest pick of the six.
- **Rig read (tail_flame_wave, 2.2s):** DELIVERS. Canon already fixes Kittember's flame to the tail tip; a tail wave lays the stream's path, and the FIRE_STREAM jet FX issues from the tail-tip flame along the wave — body motion and FX agree. No different motion needed.

## 5. SPROUTLE — species 038

- **Type:** Flora/Chrome (species.json) / GRASS at this stage (species.ts; the STEEL/Chrome half arrives at Shellguard 039).
- **Canon pool** (`learnsets.json` 038, source: species.ts verified — not provisional):
  - L1 TACKLE — 40 / L5 QUICK_ATTACK — 40
  - L6 VINE_LASH — GRASS Physical, 45 / acc 100 / PP 25
  - L14 RAZOR_LEAF — GRASS Physical, **55** / acc 95 / PP 25, high critical-hit rate, "Launches sharp leaves"
- **Uniqueness check:** RAZOR_LEAF is learned by **Sproutle alone** — 1 of 47. VINE_LASH is shared (038 / 039 / 041 Pixilite). Sproutle learns NO Chrome/STEEL move at this stage in any file (its line's first steel move, METAL_STRIKE, appears at the Shellguard/Dreadtoise stage; the line tops out at SOLAR_BLAST, GRASS 120 — stage attribution differs between species.ts (039) and core learnsets.json (040), noted for the record; it does not affect Sproutle's own pool).
- **SIGNATURE PICK: RAZOR_LEAF** — unique to Sproutle in the data and its highest-power STAB at this stage.
- **Rig read (sprout_wiggle, 1.8s):** DELIVERS. The sprout bone sits at the helmet-dome top where the canon art carries its sprout/leaf marks; a quick sprout shake is the natural launch beat for a volley of sharp-leaf FX projectiles. Motion + FX layer = the canon attack; no different motion needed.

## 6. WISPKIN — species 042

- **Type:** Umbral (species.json) / DARK (species.ts). Dex text: null in species.json ("description owed" in species.ts); apiSearchTags in species.ts: "floating dark wisp / shadowy soul ghost". Evolves to Duskfiend (043) at L28.
- **Canon pool** (`learnsets.json` 042 — **flagged in the file itself as "provisional-baseline (TACKLE/QUICK_ATTACK + first-element move; full level-up table owed)"**; species.ts gives Wispkin BASIC_MOVES only):
  - L1 TACKLE — 40 / L5 QUICK_ATTACK — 40
  - L8 SHADOW_PULSE — GHOST Special, **80** / acc 100 / PP 15, may flinch, "Shadow ball that may cause flinch"
- **Uniqueness check:** SHADOW_PULSE is shared by 3 species (Oblivirex 009, Wispkin 042, Duskfiend 043) — it is the Umbral family's element move, not a Wispkin exclusive. It is, however, the ONLY elemental/signature-class move attached to Wispkin anywhere in the game data, and his highest-power move by a factor of two.
- **SIGNATURE PICK: SHADOW_PULSE** — with the provisional flag attached: the pick is as firm as the data gets, but Wispkin's full level-up table is still owed by the data's own admission, so if that table ever lands and adds a Wispkin-only move, this pick should be re-run. One FX-relevant note: SHADOW_PULSE's own description is a shadow *ball* projectile — its shape language is its own (umbral, flinch-carrying), and per owner law it is not a Water Orb variant or template.
- **Rig read (float_idle / float_up / mask_tilt_left):** PARTIAL, and honestly so. The float set gives hover, sway, and a rise (float_up, 2.4s — the EP01 cut-23 float-up), and mask tilt is his expression channel; none of the three is a throwing/releasing motion. Read: float_up works as the gather/charge beat (rise + smoke gather), and the pulse itself is entirely an FX-layer projectile — the rig supplies presence and charge, not the release. If a dedicated release motion is ever wanted, it is a new rig animation, not a relabel of float_up.

---

## Summary table

| Species | Data status | Signature attack | Move data (moves.json) | Why this one |
|---|---|---|---|---|
| Mochii (001) | Verified learnset | **AQUA_JET** | WATER Physical 40, acc 100, PP 20, priority +1 | Learned by Mochii alone (1/47); STAB |
| Dorowani (147) | Held out of core data; no canon move in any file | **WATER ORB** (owner canon, PR #345) | No moves.json entry — stats OWNER-TBD | Owner canon; his alone |
| Gabu (148) | Held out of core data; element unassigned ("not a canon claim" per species.ts) | **OWNER CALL** — no canon pick exists | Nearest unassigned/kin data: CRUNCH (DARK Phys 80, belongs to 005 in data), BODY_SLAM_MOVE (NORMAL Phys 85, learned by nobody) | Data runs out; assigning one would be invention |
| Kittember (010) | Verified learnset | **FIRE_STREAM** | FIRE Special 90, acc 100, PP 15, 10% burn | Learned by Kittember alone (1/47); top STAB |
| Sproutle (038) | Verified learnset | **RAZOR_LEAF** | GRASS Physical 55, acc 95, PP 25, high crit | Learned by Sproutle alone (1/47); top STAB |
| Wispkin (042) | Provisional-baseline learnset (file-flagged) | **SHADOW_PULSE** | GHOST Special 80, acc 100, PP 15, may flinch | Only elemental move attached to Wispkin anywhere; shared with 009/043 |

## FX-design reference — elemental families in moves.json (for later FX work)

- **WATER:** Aqua Shot 40 (ball) → Aqua Jet 40 (+1 priority dash) → Aqua Cannon 90 (pressurized blast; learned by nobody) → Hydro Surge 120 (only AquariiOS 003, L45).
- **FIRE:** Ember Toss 40 → Fire Punch 75 (nobody) → Fire Stream 90 → Inferno Wave 110 (nobody).
- **GRASS:** Vine Lash 45 → Razor Leaf 55 → Petal Barrage 80 (nobody) → Solar Blast 120 (Sproutle's line, top stage).
- **GHOST/DARK (Umbral):** Night Slash 70 (nobody) → Shadow Pulse 80 → Dark Pulse 80 (nobody) → Munch 80 (dark, fangs; Chromejaww 005).
- **STEEL (Chrome):** Iron Barrage 35×2–5 → Metal Strike 50 → Flash Cannon 80 — none learned by Sproutle at stage 038.

## Open items for the owner

1. **Gabu:** element + signature move assignment (data explicitly waits on it — species.ts: "replace it the moment Mars assigns Gabu an element").
2. **Water Orb:** game-data entry + stats (owner-TBD since PR #345).
3. **Wispkin:** full level-up table is owed by the data itself; SHADOW_PULSE pick carries the provisional flag until then.
4. No other conflicts: no species shares another's pick; the three exclusive picks (Aqua Jet / Fire Stream / Razor Leaf) are each learned by exactly one species in the entire data set.


## OWNER DECISION ADDENDUM (2026-10-27)

Gabu's open slot is FILLED by the owner: his signature attack is **LEAF BLAST**, modeled on Razor Leaf. Element/stats: not yet set by the owner (do not silently borrow Razor Leaf's 55/95/high-crit — those are Sproutle's canon numbers for RAZOR_LEAF itself). Production note: Gabu's existing rig signature is jaw_chomp, which does not deliver a leaf volley — Leaf Blast delivery (shell/back-origin leaves + FX layer, or a new rig pose) is an open production question, flagged not solved. Animation sourcing per owner: reference Razor Leaf's animation language (timing, volley pattern) and/or create original FX — a mix; construction-kit rule applies (technique/reference yes, Pokemon asset files no).


## OWNER DECISION ADDENDUM 2 (2026-10-27, supersedes Addendum 1's Gabu assignment)

- Addendum 1's Gabu = Leaf Blast is RETRACTED by the owner ('my bad actually').
- **Sproutle = LEAF BLAST** — the game's own name for the Razor-Leaf-class signature (canon learnset move: RAZOR_LEAF, Sproutle-exclusive). Animation: Razor Leaf animation language as reference + original Mochiichao FX (construction-kit rule).
- **Wispkin = DARK WAVE** (underlying canon move: SHADOW_PULSE).
- **Dorowani = WATER ORB** (unchanged).
- **Gabu = earthquake-class move**, name being chosen by the owner from synonyms — PENDING. His jaw_chomp rig motion does not deliver it; a ground-slam pose/FX delivery is the open production note now (chomp remains a separate animation).
- Mochii = AQUA_JET, Kittember = FIRE_STREAM stand as mapped.


## OWNER DECISION ADDENDUM 3 (2026-10-27)

- **Kittember = FIRE_STREAM** — CONFIRMED by owner, name unchanged.
- **Mochii** — underlying canon move stays AQUA_JET; owner is renaming it. Provisional: **Aqua Dash** (owner's coinage, not final). Alternatives offered: Aqua Rush / Aqua Surge / Hydro Rush. PENDING owner pick.

- **Gabu = TREMOR** — owner pick locked (2026-10-27; simplified from his tapped 'Terra Tremor' — 'just call it Tremor'). Earthquake-class; ground-slam delivery (shell-backed stomp + FX ground wave) is the production read; jaw_chomp stays a separate non-signature animation.

- **Mochii = HYDRO RUSH** — owner pick locked (2026-10-27; underlying canon move AQUA_JET). SIGNATURE TABLE COMPLETE: Mochii HYDRO RUSH / Kittember FIRE STREAM / Sproutle LEAF BLAST / Wispkin DARK WAVE / Dorowani WATER ORB / Gabu TREMOR.
- Owner standing directive same day: rename-on-use — every Pokemon-named move gets a Mochiichao name in game canon + game code as moves are attached/used in show and game.
