# #27 — STATUS / AILMENT SYSTEMS → game status spec

**What was studied.** The status-condition architecture of the
creature-collector games, as documented publicly (Bulbapedia's
status-condition documentation and the decomp literature): two
condition classes — **persistent** conditions (one at a time,
survive the battle, shown in the party screen) and **volatile**
conditions (several may stack, battle-scoped, cleared on switch) —
plus the cure/prevention item hooks and an icon system that codes
each condition redundantly (glyph + colour) so state reads at
party-screen size. The architecture is a data shape; nothing here
copies any game's condition art or names as canon.

## The native spec — condition record

One record per condition, in the game core (`status-condition.schema.json`):

- `conditionId` — stable internal key (kebab); display name is a
  separate field per the rename law (display strings change, ids
  never do)
- `displayName` — **OPEN for the whole roster**: canon names no
  Mochiichao status conditions yet. The schema ships the slots;
  naming is an owner canon pass, not this teardown's.
- `class` — `persistent` | `volatile` (the documented two-class
  split; the exclusivity rule lives on persistent: max 1 per
  creature, enforced by the battle layer, not the record)
- `effect` — structured hooks, no prose mechanics:
  `{tick: {timing: end-of-turn|on-attempt|continuous, kind:
  damage-fraction|stat-stage|action-gate|accuracy, value: null},
  statStages: [], blocksActions: chance|null}` — every numeric
  `value` is `null` until a canon/balance source sets it; the
  schema fixes *where numbers live*, never what they are
- `cureBy` — item ids (joins #31) + `fullHealClears: bool`
- `icon` — the icon grammar below
- `animscriptHooks` — cue names the move-animscript format
  (battle-presentation #9) fires on apply/tick/cure; names are
  format-level, art is production's
- `status` — provenance per core convention (`OPEN` until canon
  locks the roster)

## Icon grammar

Conditions must read in three places at three sizes: battle HUD
(small), party screen (medium), Mochiioteca/bestiary (large).
Grammar, consistent with the colour system's redundant-coding
precedent (icon + colour, never colour alone):

- **Shape family = class**: persistent conditions get a filled
  disc badge; volatile get an open ring. Class reads before the
  specific condition does.
- **Glyph = condition**: one abstract glyph per condition
  (drawn natively at production; the schema stores `glyphId`,
  art lands with the HUD build)
- **Colour slot**: one hue per condition from the species
  four-slot discipline's accent register — never the ink
  `#101010`, never the alert red `#a03436` (reserved by canon:
  Dorowani/alerts/Rule burn-in only)
- **Text fallback**: 3-letter tag under the badge at medium+
  sizes; the tag is data (`icon.tag`), so localisation (#55's
  pipeline, when built) renames tags without touching art

## Wiring

- **Battle layer** — #10's battle UI flow RESOLUTION queue reads
  condition records for tick order and message/effect sequencing;
  the animscript format's `target_fx`/`screen` tracks carry the
  apply/tick cues named in `animscriptHooks`.
- **Items** — `cureBy` joins #31's item records by id; a cure item
  with no matching condition record is a data error (checker
  note in #31).
- **Show lane** — conditions are game-lane mechanics; the show
  expresses them as performance/FX states (state language
  Base/Bright/Guard/Overwhelm is *emotion*, not status — do not
  conflate; a show "condition" beat needs an owner ruling, OPEN).

## Coverage — honest

- **Architecture: fully documented.** The two-class split,
  exclusivity, tick timings and cure hooks are completely
  described in public documentation.
- **Our contents: zero locked.** No canon source names, numbers,
  or rosters any Mochiichao condition. This package delivers the
  record shape, the icon grammar, and the joins — the roster
  itself is an OPEN owner/balance pass, flagged in the schema
  header, not filled here.
