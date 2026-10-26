# FACIAL + HAND ARTICULATION GRAMMAR — attack and reaction animations

- Order: Mars, 2026-10-26 ~08:26 CDT (standing requirement). Pilot GIFs (Mochii +
  Dreadtoise, approved 2026-10-26 ~08:23 CDT as good) must be IMPROVED this way, and the
  improvement rolls across ALL 51 creatures.
- Rule the grammar serves: different attacks must read differently from each other AND
  from reactions, by mouth + eyes + hands — not by VFX colour alone. A transform-only
  squash/tilt with a new particle colour does NOT satisfy this grammar.
- Grounded in: pilot manifests (`pilot/mochii/mochii.pilot-manifest.json`,
  `pilot/dreadtoise/dreadtoise.pilot-manifest.json`, 8 sets / 36 cells each) and the
  Pokemon-files research (`POKEMON-FILES-RESEARCH.md`): Pokemon's battler sprite never
  changes pose — hurt is one generic code treatment, attacks are shared-part scripts.
  Articulation states are therefore a MOCHII-ORIGINAL shared-parts library in Pokemon's
  architecture (named states reused across creatures, parameters tuned per creature),
  not a Pokemon copy. No invented stats: timings below reuse the pilot totals
  (attacks 790–1,160 ms, hurts 520–1,180 ms) and the treatments module beats
  (windup 250 / hitstop 90 / recoil 300 / recover 400 ms).

## 1. Mouth states (M)

| State | Visual | Used for |
|---|---|---|
| M-closed | resting mouth (kept from base cell) | idle, windup start, aim |
| M-grin | wide upward arc, teeth ticks | signature finish, recover, taunt |
| M-open-roar | dark mouth ellipse, 2 teeth | strike/impact of physical + signature |
| M-open-bite | ellipse + top tooth row, jaw wedge | heavy/finisher impact, bite moves |
| M-o-shock | small dark circle | hurt impact (flinch, knockback first frame) |
| M-grimace | zigzag / wavy line | windup strain, status wobble |
| M-frown | inverted arc, drooped corners | near-faint stagger, heavy recover |

## 2. Eye states (E)

| State | Visual | Used for |
|---|---|---|
| E-normal | base eyes kept | idle, windup start |
| E-narrowed | lid bar over top ~40% of each eye | windup, aim, charge (focus) |
| E-widened | white enlarged + larger pupil | strike, impact, hurt first frame |
| E-blink | full lid bar over each eye, 1 frame | recover, between beats (life) |
| E-glance | pupil shifted toward target (+3 px) | aim, follow-through, wobble |
| E-half | lid bar over top ~60% | near-faint stagger, heavy recover |
| E-dizzy | glance alternating L/R across frames | status wobble |

## 3. Hand states (H)

| State | Visual | Used for |
|---|---|---|
| H-folded | hands together at front (Mochii hurt canon — NEVER broken) | Mochii hurt base, guard |
| H-punch | fist circle forward + motion streaks | physical strike |
| H-claw-swipe | 3 white arc streaks from claw | physical strike (clawed creatures) |
| H-cast | glow orb at/between hands | special / signature charge, status cast |
| H-guard | fists raised beside face | hurt guard, windup chamber |
| H-grab | both fists forward together | grab / heavy windup |
| H-flail | fists up + out, apart | heavy knockback |
| H-droop | fists low at body sides | near-faint stagger |
| H-brace | claws/hands on weapon (Dreadtoise cannons) | signature barrage |
| H-none | no hand overlay (limbless/levitating creatures) | creatures without hands — mouth+eyes carry it |

## 4. Mapping: attack taxonomy -> articulation beats

Cell roles by position (5-cell attack: windup / lean / strike / impact-hold / recover;
6-cell: windup / charge / strike / impact / hold / recover):

| Attack set | Windup | Strike | Impact/hold | Recover |
|---|---|---|---|---|
| physical | E-narrowed, M-grimace, H-guard | E-widened, M-open-roar, H-punch/H-claw-swipe | E-widened, M-open-bite, H-punch | E-blink, M-grin |
| special/projectile | E-narrowed+E-glance, M-closed, H-cast | E-widened, M-open-roar, H-cast (release) | E-glance, M-o-shock→M-grin, H-cast | E-blink, M-closed |
| signature | E-narrowed, M-closed, H-brace/H-cast | E-widened, M-open-roar, H-brace | E-widened, M-open-bite, H-brace | E-blink, M-grin |
| heavy/finisher | E-narrowed, M-grimace, H-grab | E-widened, M-open-bite, H-punch | E-half, M-grimace, H-grab | E-blink, M-grin |
| status/utility (B-D) | E-narrowed, M-o-shock, H-cast | E-closed-blink, M-grin, H-cast | E-glance, M-grin, H-cast | E-normal, M-closed |

## 5. Mapping: hurt taxonomy -> articulation beats

Cell roles (3-cell hurt: impact / recoil / recover; 4-cell: impact / recoil / stagger / recover):

| Hurt set | Impact | Recoil | Stagger | Recover |
|---|---|---|---|---|
| light flinch | E-widened, M-o-shock, H-guard | E-narrowed, M-grimace, H-folded | — | E-blink, M-closed |
| heavy knockback | E-widened, M-o-shock, H-flail | E-half, M-open-roar (scream), H-flail | E-half, M-frown, H-droop | E-blink, M-closed |
| status wobble | E-dizzy, M-grimace, H-guard | E-dizzy, M-o-shock, H-flail | — | E-blink, M-closed |
| near-faint stagger | E-half, M-frown, H-droop | E-half, M-frown, H-droop | E-half, M-o-shock, H-droop | E-blink, M-closed |

Canon guardrails: Mochii hurt ALWAYS keeps arms folded front / hands together —
H-guard for Mochii = hands together raised to face, never apart. Dreadtoise ALWAYS
shows 2 cannons in every view — hand overlays never cover a cannon muzzle.
Creatures with no visible hands use H-none and carry the read on mouth + eyes only;
creatures with no visible mouth (mask/helmet) carry it on eyes + hands only.
If a base cell already shows the target state (e.g. Dreadtoise mouth already open),
the overlay REINFORCES it (teeth/edge) rather than redrawing the jaw.

## 6. How articulation is built (shared-parts, Pokemon architecture)

- Layer 1 — base cell (locked battle_front / hurt cell, unchanged underneath).
- Layer 2 — articulation overlay (procedural PIL shapes at 64 px: mouth ellipses,
  lid bars, fist circles, claw arcs, cast glows). Deterministic, likeness-safe.
- Layer 3 — generation (image generation, max 4 per response) ONLY where an overlay
  cannot carry the pose: open-jaw bite on a closed-mouth base, a hand pose the base
  anatomy lacks, a new head angle. Generated keyframes still go through the same
  state table and the same eye-check.
- Pilot pattern (this batch): Layer 2 only — it proves the grammar reads at GIF
  scale before spending generations on 51 creatures. B-D rollout may add Layer 3
  keyframes for creatures where the eye-check fails on overlays alone.
- Gate: a set passes only if, at 256 px GIF scale, mouth AND eyes AND (where the
  creature has them) hands visibly change between windup -> strike -> recover, and
  the hurt set visibly differs from the attack set of the same creature.

## 7. What this grammar does NOT do

- It does not change canon likeness (no new face, no new body, no colour change).
- It does not change timings, damage, or the 0-HP-between-turns rule.
- It does not replace the pilot sets: articulated cells are NEW files alongside
  the approved pilot cells, never overwrites.

## 8. Timing modes + per-creature anatomy (Mars rulings, 2026-10-26)

- IMPACT-MOMENTARY RULE (~09:13 CDT, Dreadtoise hurts v2 — placement APPROVED
  in the same message): articulation faces show ONLY momentarily at the moment
  of CONNECTION/impact — NOT before (windup) and NOT after (recover). Leaving
  an overlay on too long completely replaces the creature's whole face.
  Builder parameter: `IMPACT_FLASH_MS` (120ms cap inside an impact beat;
  base face resumes for the remainder of the beat; total set duration
  unchanged) + `IMPACT_ROLES = ('impact',)`.
- TIMING IS PER-CHARACTER / PER-SET (~09:15 CDT, Mochii attacks v2): the
  impact-momentary rule is NOT universal. Two modes, recorded per set in the
  manifest — never retime a mode-B set down to impact-only:
  - Mode A `impact`: overlay ONLY on the impact frame (Dreadtoise hurts).
  - Mode B `persistent`: overlay stays through the WHOLE phase — windup,
    strike, impact, recover (Mochii attacks: the longer duration "matches
    him the face better").
  - Mode `base`: no overlays — the set's face already changes on its own
    (Mochii hurts, per face-change detection).
- MOCHII ANATOMY (~09:14 CDT, Mochii attacks v2 — placement APPROVED as
  "really good, way better placed"): Mochii HAS NO TEETH — mouth overlays
  NEVER draw teeth on him (open-bite/open-roar/grin are toothless shapes).
  Eyes are BLACK discs with WHITE highlight inside — never white sclera.
  APPROVED and kept: the little squiggly (grimace) mouth + lowered
  (narrowed/half) eyes.
- FACE-CHANGE DETECTION (standing): before overlaying, detect per set
  whether the face already changes across its frames. Changing sets ship
  base art only; static sets get measured-anchor overlays.
- Verification gate for every retime batch: non-overlay cells pixel-identical
  to base; overlay cells differ only inside face boxes; Mochii cells carry
  zero new white pixels in the mouth box (teeth check, eye boxes excluded);
  Mode A overlay visibility <= 150ms per set.
