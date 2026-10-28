# #117 — HM / FIELD-MOVE SYSTEMS → field technique system (Rare Moves in the overworld)

**What was studied.** The field-move architecture of the
reference games, as publicly documented: certain moves double
as overworld techniques — a gate in the world (a dark cave, a
blocked passage) tests two separate facts, *permission* (a
league token held) and *capability* (a party member who knows
the move performs it). Later generations publicly decoupled
the two — capability moved to dedicated ride/call systems —
which is the documented evidence that permission and
performance are separate layers. The kit taken: the gate
tests facts, a party member performs, and the performance is
an acted beat, not a menu deduction. No move lists, gate
placements, or text are copied.

## Canon anchors (all verified in the packages)

- **Rare Moves are the HM-equivalent class** (owner ruling,
  move-import programme), and the class test is rare-wins:
  a move that is Rare in *any* generation is Rare. The
  machine registry (352 moves, PR #366; joined by #101) is
  where the class lives; the core `moves.json` in
  `src/data/core/` is the smaller in-repo move set the audit
  verified (36/36).
- **#12 already seeds the namespace:** EVENT-FLAG-ARCHITECTURE
  defines `tech.*` — "techniques held (`tech.illuminate`).
  Booleans" — and the Cave of Echoes script pointer resolves
  differently with and without it.
- **#11 already tests it:** the route graph's gate kinds
  include `technique` — "the party must hold a technique
  (Illuminate)" — and the graph's own text records Illuminate
  as "the only technique gate canon has named so far."
- **#59 already classifies it:** PUZZLE-GATES' closed
  `lock_class` vocabulary has `technique` = "a named world
  technique (Illuminate class — Rare-Move-class in the game
  lane's machine system)."

## Native spec — `mochiichao/techniques/v1` (fragment beside this doc)

A technique is a registry row, never a new move:

- `techId` — `tech.<slug>`, the same slug as its #12 flag
  (`tech.illuminate` is the one canon row).
- `moveId` — join key into the machine registry; the row is
  only valid if the registry classes that move **Rare**
  (schema-level check, same enforcement style as #31's
  no-move-class rule: a General-class move in this registry
  is a data error).
- `gateKinds` — where the technique may be tested: route
  edges (#11 `technique` gates) and room gates (#59
  `technique` locks, #119 placement). The technique record
  does not place gates; graphs and interiors reference it.
- `performance` — the acted layer: performing a technique is
  a **move performance** and inherits the anatomy-variance
  doctrine wholesale. The performance record is a #9
  animscript reference (same beat map, per-anatomy blocks,
  mandatory `variance_notes`); a technique whose performer
  lacks the anatomy the performance cues is not performable
  by that individual — the validator rule #9 already
  enforces for battles applies here unchanged.

**Held vs performed — the two facts stay separate:**

- *Held* is #12's boolean: acquisition (the machine teaches
  the Rare Move, per the game lane's General/Rare machine
  system) sets `tech.<slug>`. #12 owns the namespace; this
  spec adds no second store.
- *Performed* is a live check at the gate: at use time, an
  eligible party member must know the move (learnset /
  registry join) and carry the anatomy its performance
  needs. Permission without a performer reads as the
  documented classic refusal, rendered through #23 strings.
- **Edge case registered, not resolved:** if the sole knowing
  individual leaves the party (trade #68, release #106), the
  `tech.*` boolean and the live check disagree. Options:
  (a) flag persists, performance simply unavailable until
  another knower joins (flag = the Ranger was *granted* the
  technique); (b) flag re-derives from party knowledge at
  load, like every other derived count. **OPEN** — owner /
  landing decision, flagged here and in STAGING.md rather
  than silently picked.

**Two-lane doctrine (canon):** the game lane performs
techniques as above. The show lane has no machines and no
technique menus — a Mochi who can Illuminate *can*, as
innate capability, and scripts reference the capability by
the same `techId` so the lanes can never drift on what the
technique is.

**The roster is OPEN.** Illuminate is the only technique
canon has named. Which other Rare Moves are field techniques
(traversal, clearing, revealing…) is an owner ruling per
move; the registry ships with one row. Inventing a technique
list here would be inventing canon — the fragment's roster
beyond Illuminate is an empty slot by design.

## Wiring

Reads #12 (`tech.*` namespace — no changes needed; the seed
is already there), #11 (gate kind `technique` — already
there), #59 (lock class — already there), the machine
registry via #101's join, #9 (performance records), #23
(all strings). Save impact: none new — `tech.*` already
rides #96's `flags` section.

## Coverage — honest

- **Architecture: fully documented** across two generations
  of the reference design (coupled and decoupled forms).
- **Contents: one canon row (Illuminate); the technique
  roster, the held/performed edge ruling, and all gate
  placements beyond the Cave of Echoes are OPEN.** The
  system's joins were verified against the real packages
  (#11/#12/#59 all name this system before it existed —
  this spec is their referent, not a new invention).
