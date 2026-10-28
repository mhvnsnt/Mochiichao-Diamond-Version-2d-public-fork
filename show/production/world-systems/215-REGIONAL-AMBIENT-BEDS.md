# #215 — REGIONAL AMBIENT BEDS → a region sounds like where and when it is

**Doctrine seat:** three verified layers meet here.
#75 founded the house audio finish (the measured
−14 LUFS / −1 dBTP delivery law; MUS stems + **beds
archived per #13's manifest**) — the show's beds
already exist as archived production assets with a
manifest home. #84 founded sound ecology: a place's
species sound obeys roster-binding (resident rows
name only species the place's tables stock, in
active windows). #142 founded the regional climate
record (one weight/exclusion record per region over
#61's weather machine). What has never been
specified is the **bed as a system**: the region-
level soundscape record the game plays and the show
draws from — one library, keyed by region, phase,
and weather. This package specifies it. It records
no audio and mixes nothing; it defines the bed
record and its laws.

**What was studied.** Ambient soundscape practice
in the publicly documented record (games' regional
music/ambience keyed to place and time-of-day;
film/TV bed discipline under delivery specs):
a bed is layered — a place layer that identifies
where you are, a time layer that says when, and
event layers that come and go — and a library is
shared across every product that visits the place.

## Native spec — `mochiichao/regional-ambient-beds/v1` (fragment beside this doc)

- **The bed record** (one per region, the audio
  face of #142's climate record — it joins the
  climate record's region keying rather than
  founding a second regional registry):
  ```
  { regionId, layers: {
      place:   <bed stem id — the region's ground sound>,
      phase:   { dawn|day|dusk|night: <stem id | delta id> },
      weather: { <weather state>: <layer id | null> },
      species: [ <resident-row refs, per #84> ] },
    finish: "#75 house finish" }
  ```
  Phase keys are **#19's** (dawn/day/dusk/night —
  the world clock's own names; the bed follows the
  clock the world runs on). Weather keys are #61's
  states as #142's climate admits them for the
  region (a weather layer the climate excludes does
  not exist for that region), realised through
  #73's weather FX. Species content rides #84's
  resident rows verbatim — the bed names no species
  itself.
- **Layer law.** Place is always present; phase
  colours it; weather rides over it; species rows
  sound only inside their stocked windows (#84).
  A bed is a mix of stems from #13's manifest —
  the record points at stems, never at audio this
  package supplies.
- **The Dark Forest — the standing special case
  (design law).** The Forest's bed is two beds:
  - **Surface:** mist and hum — the canon surface
    character (the season canon map's mist/humming
    surface): a low, even bed with the depths'
    quiet audible *inside* it as its floor.
  - **Depths:** **near-silence.** The depths bed is
    defined by withholding: no species rows (the
    depths table stocks nothing, so #84's law
    yields silence by arithmetic, not by exception),
    no weather layer (the depths' weather is NONE —
    #142's hard exclusion), phase layers flattened
    toward identity (the depths do not brighten at
    dawn). What remains is room tone at the edge of
    hearing and the surface's hum, distant. A depths
    bed that *performs* — swells, themes, startles —
    is a defect of the same class as #148's
    performing depths transition.
- **One library, both lanes.** The show draws the
  same beds (archived per #13's manifest, delivered
  under #75's finish — the stems chapter already
  requires beds archived per episode); the game's
  bed records point at the same stem ids. A region
  sounds the same in the game and in the show
  because it is the same library — beds are
  construction kit, shared by construction.

## Show lane

Covered by the one-library rule: episode mixes
draw the regional bed stems under #75's per-episode
sheet; an episode set in the depths mixes the
depths bed and nothing else — the show's Forest
silence is the game's, measured the same way.

## Wiring

Bed records join #142's climate records at landing
(one region keying, cited both ways); stems read
#13's manifest; delivery reads #75; species rows
read #84; weather layers read #61 via #142 + #73;
phase reads #19. No stem is created by this
package; a region without stems renders the record
honestly empty (silence is a valid bed state, and
in one region it is the canon one).

## Coverage — honest

- **Architecture: fully specified** over verified
  layers (finish, manifest, ecology, climate,
  clock).
- **Contents: no region's stems are asserted.**
  Region 1's bed exists as show production (EP01
  beds are measured facts under #75) — its game-side
  bed *record* is a landing act of pointing, not a
  composition this package performs. Regions 2–5
  bed records wait on their stems and their #142
  climates (OPEN there).

## Open slots (nothing invented)

Every region's stem inventory beyond the show's
existing Forest/Region 1 production beds (audio
production) · per-region phase-delta choices
(production) · the exact near-silence floor for the
depths bed (a measured production value — set when
the depths bed is first mixed, under #75's
tolerances) · weather-layer stem set per region
(waits on #142's climates for Regions 2–5).

---

**Landing proposal — List 32 (2026-10-27), citing STAGING step 5.**

**Cold spot as a localised bed state (citing #313).** `battle/313-GHOST-SPECTACLE.md` PROPOSES the cold spot into this file's bed vocabulary: a localised state of a region bed, the first beat of a haunting (presence before form). It is a proposal recorded here, not an existing field: beds written without it are conforming until this file's own pass adopts it, and no landing may describe it as an existing field before then. Reciprocal reads: #308 (bed ducking under thunder), #310 (post-impact hole), #312 (wind beds), #314 and #315 (bed swells) cite this file's beds.

**PROPOSAL from List 35 #344 (registered at its landing, 2026-10-27; STAGING step 8):** the bed record above gains a place-motif ref — the place layer of the bed is arranged from the place's motif, per `show/production/344-MUSIC-IDENTITY.md` (fragment `show/production/music-identity-fragment.json`). Proposed here, in this file's home, with citation; until this home accepts it, the motif ref is SPEC-LEVEL. Species motif annexes and human theme records do not land here — they live beside the species sheets and in the bible/casting docs respectively, per #344.

**PROPOSAL from List 36 #355 (registered at its landing, 2026-10-27; STAGING step 7 check, performed):** the bed record's field list in this file was checked at List 36 landing — it holds place / phase / weather / species layers and NO battle-segment override seat. A battle-segment override seat (for the bed drop under a staged theft/rescue throw) is therefore proposed into this file, citing `show/production/battle/355-THEFT-THROW-STAGED.md`. Until this home accepts it, the seat is SPEC-LEVEL. Note for the coordinator: List 35's build also appends a #344 proposal to this file — apply List 35 first, then this note after it.
