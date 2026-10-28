# #30 — DOJO / BOSS FIGHT STRUCTURE → dojo encounter scripting format

**What was studied.** The gym/boss-battle architecture of the
reference games, publicly documented: a leader encounter is a
**scripted wrapper** around the battle system — an intro
sequence (dialogue + presentation), a fixed party definition, a
signature species the fight is remembered by, a badge/progress
reward, field conditions for the room, and a rematch state. The
battle itself is the shared system (#9/#10); the *encounter
script* is the per-boss data. Nothing here copies any game's
parties, dialogue, or numbers.

## Canon anchors (Region 1 circuit — SEASON-CANON-MAP)

- **8 dojos**; badges are **Fragments**. Masters in canon list
  order: **Lin / Falk / Tetsu / Kenji / Phantom / Shizuku /
  Homura** + **a Syndicate boss as Dojo 8's leader — name OPEN**
  (canon itself leaves it a gap; never filled here).
- Dojo **locations are OPEN** (Sideline G's route graph carries
  them unassigned) — the format takes a location pointer, the
  instance leaves it null.
- After the circuit: Victory Route → Elite Four (Umi/Gin/Hono/
  Yoru) → Champion Hex. Those are *not* dojos; the format's
  `tier` field (`dojo | elite | champion`) covers them without
  pretending they are the same beat.

## The native format — `dojo-encounter.schema.json`

One record per leader encounter:

- `encounterId`, `tier`, `leader: {name|null, nameStatus}`,
  `dojoIndex` (1–8 for tier dojo)
- `locationId` — pointer into the route graph (#11); null = OPEN
- `introScript` / `winScript` / `loseScript` — **pointers only**
  (dialogue-kit path/entry or Ink knot, per the event/flag
  architecture's dialogue pairing). Encounter files never embed
  dialogue text; writers own text, data owns structure.
- `party` — slots `[{speciesId, level: null, role:
  opener|core|signature}]`, all contents **OPEN**: canon gives
  no leader parties. Slots exist so a canon/balance pass fills
  a fixed shape, and `signatureSlot` names which slot the fight
  is remembered by (the documented boss-design slot) without
  asserting what fills it.
- `field` — room condition hooks `{fieldEffectId: null,
  weather: null}` joining the field/weather systems when canon
  sets them (List 6 #47's home, when built)
- `reward` — `{fragmentId (dojo tier), itemIds: [], flagSet:
  "progress.dojo-<n>-cleared"}` — the flag name is the #12
  architecture's namespace pattern; claiming the Fragment sets
  it, and Fragment count stays **derived, never stored** (#12/#14)
- `rematch` — `{available: bool|null, partyRef: null}` — rematch
  parties are separate records, never edits to the first-fight
  record (currency law: the first fight stays the historical
  truth of the season run)
- `showUse` — the show lane reads the same record for a dojo
  episode's skeleton (leader, signature slot, room) under the
  autonomous-action battle doctrine: the game's scripted party
  is the game's; the show fight is choreographed, not rolled.
  One record, two behaviours — lanes share data, not mechanics.

## Worked instance — `examples/region1-dojo-circuit.json`

All 8 dojo records + Elite Four + Champion as one circuit file:
names/order/tier from canon, every content field null/OPEN with
its flag named. It validates against the schema and is safe to
land as-is — a future canon pass fills values, never reshapes.

## Coverage — honest

- **Architecture: fully documented** (scripted leader wrapper,
  fixed party, signature slot, badge reward, rematch state are
  the public record of the reference systems).
- **Contents: names and order only.** Parties, levels, field
  effects, locations, and the Dojo 8 leader's name are OPEN by
  canon's own account — flagged in every record, filled nowhere.
