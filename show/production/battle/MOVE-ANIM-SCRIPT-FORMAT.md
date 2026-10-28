# MOVE ANIMATION SCRIPTING — TEARDOWN + NATIVE FORMAT (List 2, #9)

Sideline H, 2026-10-27. Scope: the **scripting structure** only. Move
stats, learnsets and the machine registry already exist and are NOT
rebuilt here (moves.json = 36 playable moves; the 352-move TM/HM
registry landed in PR #366; display names follow the rename law,
internal ids never change).

## What the teardown found (structure, from public documentation)

Across the documented battle-animation systems — the classic games'
decomp-documented animation routines and the modern community
choreography formats (Showdown's battle animations are AGPL and
reference-only for us, per the PR #366 catalogue verdict) — one
structural pattern repeats everywhere:

1. **An animation is a timed cue list, not a video.** A header names
   the move; the body is a sequence of cues on parallel tracks,
   addressed in frames: performer motion, target reaction, layered
   effect sprites (behind / in front), background swap, screen effects
   (flash, shake, palette pulse), camera moves, and sound cues — each
   cue with a start frame and a duration.
2. **The performer and the effect are separate tracks.** The creature's
   own motion (lunge, recoil, charge pose) is cued independently of
   the elemental effect layers, which is what lets one move be
   performed by many bodies: the effect choreography is shared, the
   body choreography is per-performer.
3. **Anchors, not coordinates.** Effects attach to named points on the
   performer/target (mouth, hands, centre-of-mass) so the same script
   lands on different sprites.
4. **A fixed beat grammar.** Anticipation → release → travel → impact
   → target reaction → settle. Durations flex; the beat order is the
   contract the battle system's message queue syncs against.

## The native format: `mochiichao/move-animscript/v1`

One JSON file per move. The base script carries the shared effect
choreography; each **performance** carries one anatomy's body
choreography against it. This is the ANATOMY-VARIANCE DOCTRINE made
into a file format: a move's animation depends on the performer's
shape, size, build and class, and the variance is logged per
move/species in the file itself — never assumed universal.

### Header

| field | rule |
|---|---|
| `schema` | `"mochiichao/move-animscript/v1"` |
| `move_id` | the stable internal id from moves.json (e.g. `AQUA_JET`) — never renamed |
| `display_name` | the current Mochiichao display name per the rename law (e.g. `Hydro Rush`) |
| `registry_anim_id` | read from moves.json at build time; `null` in drafts, never invented |
| `fps` | `24` (show timeline; the game lane retimes by ratio, beats unchanged) |
| `duration_frames` | total length of the base timeline |
| `beats` | the beat map: named beats with frame ranges (the sync contract) |

### Tracks (base script — shared by all performers)

`performer_fx` (elemental layers on the performer) · `projectile`
(travel layers) · `target_fx` (impact layers) · `background` ·
`screen` (flash/shake/palette) · `camera` · `audio` (cry/SFX cue ids —
cries resolve through the species sheet's cry spec) · `subtitle`
(show lane only; rationed per the subtitle law, default empty).

A cue: `{ "t": <start frame>, "dur": <frames>, "cue": <verb>,
"anchor": <anchor name>, "params": {…} }`. Cue verbs are a small
closed vocabulary: `spawn_layer, fade, scale, translate, rotate,
flash, shake, palette_pulse, bg_swap, cam_push, cam_pan, cam_cut,
sfx, cry, hold`.

### Anchors (closed vocabulary)

`centre` (centre of mass) · `mouth` · `hand_l` / `hand_r` · `forelimb`
· `tail_tip` · `dorsal` · `crown` · `whole_body` · `ground_contact`.
A performance may only reference anchors its anatomy profile declares
it has — the validator enforces this, which is what makes a limbless
performer impossible to script with hand cues by accident.

### Performance block (one per anatomy the move is scripted for)

| field | rule |
|---|---|
| `species` | species slug |
| `anatomy_profile.body_plan` | closed list: `biped_small, biped_large, quadruped, limbless_swimmer, serpentine, levitating, winged, sessile` |
| `anatomy_profile.size_class` | from the species sheet |
| `anatomy_profile.effector` | what emits/performs the move: anchor name |
| `anatomy_profile.anchors_available` | the anchors this body actually has |
| `anatomy_profile.class_flags` | e.g. `mythical` / `legendary` presentation tier (may extend beats, never change them) |
| `body_track` | this performer's own motion cues (same cue vocabulary) |
| `overrides` | retimes/substitutions against base tracks, each with `reason` |
| `variance_notes` | **mandatory, non-empty** — what differs from the base performance and the anatomical reason. This field IS the registry entry the doctrine requires |
| `no_variance_reason` | only legal instead of `overrides` when a body genuinely performs the base unchanged — also requires a reason |

### Worked example (in `examples/`)

`hydro-rush.animscript.json` — **Hydro Rush** (move_id `AQUA_JET`,
Mochii's locked signature) scripted twice:

- **Mochii** (`biped_small`): the water cloak gathers during a
  spin-hop anticipation; the dash is a corkscrew with the whole body
  as the projectile; impact burst anchors at `whole_body`.
- **Flickfin** (`limbless_swimmer` — the batch-001 A2 opener, a
  limbless minnow whose needle is part of its face): no hop exists, so
  anticipation becomes a schooling-flicker feint and a needle-first
  aim; the dash is a straight lance run with a spiral wake instead of
  a corkscrew; recovery cannot "return to stance," so the settle beat
  becomes a banking turn into a continuous swim loop; a staging flag
  records that an on-land performance needs the splash-puddle stage
  treatment.

Same beats, same effect layers, same duration — different bodies,
with every difference logged in `variance_notes`. Validate with
`tools/validate_animscript.py`.

## Coverage notes (honest)

- The cue-list/track/anchor structure is documented consistently
  across public decomp documentation and community format write-ups;
  confidence high.
- Exact per-game internal opcodes differ by generation and are
  deliberately NOT reproduced — this format is a native design at the
  structural level, which is all the pipeline needs.
- Showdown choreography was used as structural reference only
  (AGPL — no code, no data copied), consistent with the PR #366
  catalogue verdict.
