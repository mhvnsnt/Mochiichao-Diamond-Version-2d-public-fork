# #148 — BATTLE INTRO TRANSITIONS → from field to plate, in the area's own language

**Seat in the doctrine:** #128 made the battle plate a
versioned piece, selected per area/surface/world-state.
#battles don't begin on the plate, though — they begin
with the cut that takes the player *off* the field.
Reference games treat that cut as a signature (the flash,
the wipe, the shatter), and it is the one piece of battle
presentation every encounter shares. This spec makes the
transition a **grammar keyed to where and when the
encounter happens**, so arriving at a fight in the Dark
Forest feels different from arriving at one on Route
Topaz — and so the game's INTRO state (#10's battle UI
flow: INTRO → LIVING_FIELD → …) has a defined visual
contract instead of a placeholder.

**What was studied.** Encounter transitions in the
publicly documented record: the classic series' flash-and-
zoom, later entries' environment-matched wipes (water
ripples on water, leaf sweeps in grass), and the general
production principle that a transition is a *mask + a
motion + a sound*, each part independently keyed. The kit
taken: a closed vocabulary of transition shapes, keyed by
the same two facts #128 already selects on — the area/
surface (#7) and the world state (#19) — so plate and
transition can never disagree about where the battle is.

## Native spec — transition grammar over #128/#7/#19 (no new format id; records ride #128's plate entries)

- **A transition record** has three parts:
  `{mask, motion, sound}` — *mask*: the shape that covers
  the field (closed vocabulary: `flash`, `wipe`, `iris`,
  `scatter`, `ripple`, `still`); *motion*: the mask's
  direction/timing class; *sound*: a #51 SFX class ref
  (never a literal file). The record hangs off the plate
  entry it introduces — one home (#128's registry), so a
  plate version and its transition version together.
- **Keying.** Default transition derives from the plate's
  own selection keys (area + surface + #19 state). Area
  overrides are authored records, not code branches. Two
  standing special cases:
  - **Frost nights** (the named composite `night +
    frost-trace` from List 3's time/weather system): the
    transition carries the frost-trace mask variant —
    the same device the canon uses for the colour-shift,
    so the player learns one sign for one thing.
  - **The Dark Forest depths: `still`.** No flash, no
    wipe — the field simply *stops*, in keeping with the
    depths' engineered absence (#61's weather NONE, #128's
    empty depths plate slot, the Forest's withholding
    discipline generally). A depths transition that
    performs is a defect.
- **Encounter-kind variants** ride the same record:
  wild / Ranger / dojo / set-piece (#30/#99/#100 wrappers)
  may override `motion` and `sound` but never invent a
  new mask — the mask belongs to the place, the emphasis
  belongs to the encounter.
- **Show mirror.** The show cuts to battle on the same
  grammar: an episode's battle opening uses the area's
  mask class as its cut language (translated to picture
  editing, not UI), so game and show teach the same
  geography of danger. Staging joins #120's cue vocabulary
  rather than inventing a second one.

## Open slots (nothing invented)

The mask assignments per area/surface (the vocabulary is
closed; the assignments are authored work) · timing
values per motion class · whether set-piece encounters
(#99 admins, #100 gauntlet) earn a distinct `sound`
signature or stay place-keyed · the show's exact editorial
translation of `still` for depths-adjacent staging
(the camera-never-enters rule binds — depths staging
itself remains a Forest question, not this spec's).

No UNVERIFIED TARGET of its own: every join (#7, #19,
#51, #128, #10, #120) is a verified workspace spec. The
engine that *plays* a transition is the engine target
carried in Lists 13–14's registers — integration stays
spec-level until engine code exists.
