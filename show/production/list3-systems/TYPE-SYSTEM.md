# #17 — TYPE-CHART + DAMAGE ARCHITECTURE → native type-system data model

**Teardown (public documentation, pret/decomp-documented shapes).** In the
reference games the type system is three separate artefacts, never one
blob: (1) the **effectiveness chart** — a flat list of (attacking,
defending, multiplier) triples, sparse: every pair not listed defaults
to ×1; multipliers are a closed small set (0, ½, 2, later ¼/×4 emerge
from dual-type products, never stored); (2) the **damage formula** — a
fixed integer pipeline (level term → base power → attack/defence ratio
→ a sequential multiplier chain: STAB, type effectiveness, weather,
item, random 0.85–1.00 applied **last**), with rounding rules fixed per
generation; (3) **move/species records reference types by id only** —
the chart can be rebalanced without touching a single species record.
That separation is the whole lesson.

**Native model — `type-chart.json` (fragment beside this doc).**

- Elements are the house vocabulary already in the intake template
  (TBD D6): `Aqua, Flame, Flora, Chrome, Core, Umbral, Mythic, Beast,
  Strike, Bug, Silk, Aero, Wind, Neon, Earth` — 15 ids. Note `Aero` and
  `Wind` both exist in the vocabulary today; whether they are one
  element or two is **OPEN (owner/lane, TBD D6)** — the chart file
  carries both rows untouched until ruled.
- Chart stored sparse: `matchups: [{atk, def, mult}]`, `mult ∈ {0, 0.5,
  2}` only; unlisted = 1. **The chart's contents are OPEN** — no
  matchup values are asserted in this package. Authoring happens once,
  from canon (signature moves, dojo themes, the Elite Four's element
  identities Umi/Gin/Hono/Yoru as anchors), in a dedicated owner pass.
  What this teardown fixes is the *shape*, deliberately.
- Damage pipeline is specified, not yet numerically locked:
  `dmg = floor_chain(base(level, power, atk, def)) × [stab 1.5] ×
  [chart product] × [field: weather/state modifiers from #19] ×
  [variance 0.85–1.00]`, integer floors after each stage, minimum 1 on
  a hit that isn't immune. Stat stage multipliers (±6, fraction table)
  specified as data, values flagged **PROPOSED** (standard reference
  fractions) until the game lane locks its numbers.
- Accuracy/evasion and critical stages live in the same file as named
  tables, not buried in code.

**Rename-law compliance.** Everything keys off stable internal ids:
moves by their `moves.json` ids (display names change, ids don't —
e.g. `AQUA_JET` carries display "Hydro Rush"; its element field is the
id `Aqua`), species by core id, elements by the ids above. No display
string appears anywhere in the model.

**Wiring.** Species `types[]` (core record) and move `type` fields are
the consumers; the battle UI flow (battle-presentation teardown) reads
effectiveness for its message queue ordering; #18 AI scoring reads the
chart product as its largest term; #19's weather states expose exactly
the modifier hooks this pipeline names. Show lane: the chart is
game-lane data — the show expresses it as skill/training per the
two-lane doctrine, never as on-screen numbers.

**Coverage.** Architecture: fully documented publicly, high
confidence. Contents: **zero matchups asserted** (owner pass owed);
damage constants PROPOSED, not locked. This is a data model + pipeline
spec, not a balance pass — saying so plainly.

**Landing note — List 26 (2026-10-27).** The contents this file left open are now asserted, by citation, under the Pokémon-base rule: the chart's matchups are filled by #249 (85 triples) and live in this file's fragment (`matchups` — the shape above is unchanged; the supersession of the shape-only stance *for contents* is recorded here and in #249's file, not overwritten in silence); the damage constants flagged PROPOSED are locked by #248; the stat-stage table is locked by #250. The authoring anchors named above stand as the chart's canon inputs. The element-vocabulary question (Aero vs Wind, TBD D6) is untouched and still open.
