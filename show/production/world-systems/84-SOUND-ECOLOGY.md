# #84 — BIOME SOUND ECOLOGY → GARDEN / FOREST SOUND-ECOLOGY TABLES

**What was studied.** How games build a place's *sound ecology*:
(1) **habitat sound palettes** — each biome owns a declared palette
of ambient sources (species calls, water, wind-through-X, insect
beds), and the mix is composed from the palette, never improvised
per scene; (2) **the inhabitants are the instruments** — in
creature games the ambient calls are the *local species'* cries,
placed by the same data that places the creatures (distance =
gain/reverb, time of day = who is awake); (3) **negative space as
a layer** — authored silence/absence is a palette entry with the
same standing as a sound (our canon already runs this: the Forest
bed is *engineered absence*); (4) **state-driven mixing** — palettes
crossfade by time/weather/state rather than cutting (the adaptive
music system's stem logic, applied to ecology: List 2 #13's
SCORE-STATE is the music sibling of this table).

**Pairing.** List 3 #22 (environmental sound systems) specifies
*how* beds are built and played (terrain footsteps, bed
construction). This package specifies *what a place sounds like* —
the per-biome palette tables those beds are built from. Canon
ground already on file (LIVING-WORLD): six location×time beds
exist as a system; the Forest bed is engineered absence — **no
birdsong from inside the Forest**; wind state (CALM/BREEZE/GUST)
moves picture and audio together; cry spot lists exist per episode.

## Native spec: `mochiichao/sound-ecology/v1`

### Table shape (one row per palette entry)

| field | meaning |
|---|---|
| `place` | location id (Garden / Gate / Pond / Dark Forest surface / Dark Forest depths / routes…) |
| `layer` | `bed` (continuous) · `resident` (a species' cry, placed) · `event` (one-shot class) · `absence` (an authored NOT-sound) |
| `source` | cry id / bed id / cycle id — must resolve to a real asset or a LIVING-WORLD cycle |
| `species` | for `resident` rows: the species whose cry sounds — **must be a species the spawn table (#7) places here** |
| `window` | time-of-day / weather / SCORE-STATE conditions |
| `placement` | distance band + direction grammar (near/mid/far, offscreen side) |
| `density` | calls per minute range — ecology, not a metronome |

### The binding law (roster-binding, audio form)

**A resident row may only name a species that the place's spawn
table stocks, in a window when that species is active.** The
Garden at dawn can sound of Mochii because Mochii live there; the
Forest's surface may carry Kittember (wild Kittember is canon
there); **the Forest's depths carry no resident rows at all** —
which is the data form of "what stopped moving" staying unanswered:
the table's emptiness *is* the dread, and any future row added to
the depths is a canon event, not a mix choice.

### Starter tables (structure + canon rows only)

**Garden** (care register; Mochiko's domain)

| layer | source | window | note |
|---|---|---|---|
| bed | Garden morning bed (exists, EP01 Scene 1) | morning | gated bed, canon |
| resident | Mochii cry | morning/day | Garden resident species |
| resident | Sproutle cry | dawn/day | garden-plant register |
| event | Gate bell (foley-first, exists in EP01 spot list) | on beat | not a loop |
| absence | — | night | Garden sleeps: resident rows off; bed thins to night register |

**Dark Forest — surface**

| layer | source | window | note |
|---|---|---|---|
| bed | hum bed (the Forest's humming surface, canon) | always | the surface *hums* — presence without inhabitants |
| resident | Kittember cry | dusk/night | wild Kittember is canon in the Forest |
| absence | birdsong | always | **no birdsong from inside — canon, engineered absence** |

**Dark Forest — depths**

| layer | source | window | note |
|---|---|---|---|
| absence | *everything* | always | the depths table is empty on purpose; SCORE-STATE: ABSENCE; the device hushes too (#81) |

**Pond / Gate** rows follow the same shape from their gated EP01
beds (Pond dusk bed exists; its emptying-across-the-stakeout
behaviour is already canon in the Scene 4 gate record) — full row
sets are lane fill work under this schema, from the beds that
exist, not new invention.

## Wiring

- **Spawn tables (#7):** resident rows validate against them —
  a row naming an unstocked species fails the gate (the audio form
  of the LIVING-WORLD roster-binding law for picture population).
- **Cry system (species-systems):** resident sources are sheet
  cries (V1 default); the cry synth can pre-render placed variants
  (distance = filter/gain) at mix time.
- **Adaptive music (#13):** ecology and score share state
  (SCORE-STATE + WIND-STATE); ABSENCE zeroes both — one switch,
  whole world quiet.
- **Environmental sound (#22):** beds named here are built/played
  by that system; footsteps stay #22's layer, below ecology.
- **Device (#81):** the device's chimes are *not* ecology — they
  duck under the bed and hush in the depths.

## Open slots (not invented)

- Full row sets for Gate, Pond, routes and later regions — lane
  fill from existing beds + spawn tables.
- Density numbers per row (ranges are mix decisions, set at the
  first full-episode mix, not here).
- Depths rows: **none, deliberately** — adding one is a canon
  event requiring an owner ruling.
