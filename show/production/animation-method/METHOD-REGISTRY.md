# METHOD REGISTRY — which animation method is usable, right now

**READ THIS FIRST.** This file is the single place that says which
animation method is the usable one for the Mochiichao show. Before
building, rigging, or animating anything, an agent checks this
registry and uses the method marked **CURRENT / USABLE**. Using a
superseded method — silently, or because it was the one in an old
file — is a regression and an error, the same class as building on
a superseded asset under the current-version law.

---

## ⬛ CURRENT / USABLE METHOD

### The Industry Method — v1 (2026-10-28)

- **The method:** part-separated puppet construction (one drawing
  per body part, peg hierarchy, drawn-overlap joints, hair as its
  own part over the head) + substitution-drawing sets for every
  shape a deformer cannot honestly produce (legs/feet, hands,
  mouths, eyes) + cycles authored pose-to-pose, **contacts first**,
  on an exposure chart + travel **derived from the drawn stride** +
  all verification on the **rendered drawings**, never on the
  skeleton. Deformers are a garnish inside a part, never the
  structure.
- **The spec:** `CORRECTED-METHOD.md` in this folder, including
  Addendum §A (intake gate, joint inventory, frame-exact rendering,
  built chibi models, action coverage, defect disposition).
- **The evidence it works:** the Mochiko walk proof built under it
  (workspace `ep01-ed-gag/work/v6-industry/`) passed every drawn
  gate the old method failed: contact lift 0 at both contacts,
  support stick 0.0 px/slot, support in 8 of 8 poses with no flight,
  drawn knee fold in the pixels, silhouettes differing 28–40% per
  step. Gate 8 (the owner's eye) remains a standing production
  gate, and the profile model-sheet flag from that proof remains
  open — neither changes this method's status as the usable one;
  they are production gates the method itself requires.
- **Why it is current:** owner-ordered industry-method programme
  (2026-10-28), after the single-mesh method failed three owner
  viewings in a row (see `WALK-DIAGNOSIS-LOG.md`).
- **Supersedes:** the Single-Mesh Deform Method (below) — entirely,
  for all characters, all productions.

## ⬛ SUPERSEDED — DO NOT USE

### The Single-Mesh Deform Method (the v1–v4 ED-gag era)

One grid skin over the whole body, bone/deformer posing, no
substitution drawings, travel set before stride, QC measured on the
skeleton. **Retired 2026-10-28.** Its failure record is
`WHAT-WE-DO-WRONG.md` (defects 1–5) and
`WHAT-WE-DO-WRONG-ADDENDUM.md` (defects 6–11). Existing mesh rigs
are reference/provenance only; no new animation is authored on
them. Bone-only "fixes" to a walk are a named non-solution: the
bones were right three times; the drawing was wrong.

### The Whole-Sprite Transform Method (the pilot / Storyboard Draft 1 era)

Whole-image bob/tilt/zoom over stills. **Retired by owner verdict**
(rejected pilot trailers; EP01 master reclassified as Storyboard
Draft 1). Never animation, at any length, under any gate.

---

## ⬛ THE UPGRADE RULE (owner, 2026-10-28 — standing)

In the owner's words in substance: *log the newest method as the
usable method, every time we upgrade methods, and make it obvious
for yourself and the agents, so we never regress.*

1. **Every method upgrade gets a registry entry here, at the
   moment it lands** — a new version block at the top of this file,
   marked **CURRENT / USABLE**, naming the version it supersedes.
2. The superseded version's block is re-marked **SUPERSEDED — DO
   NOT USE** in the same commit. Two methods may never both read
   as usable.
3. **Currency is per method and per use, like every other piece:**
   an older method may stay assigned to a named, written exception
   (a deliberate throwback segment, a legacy repair) — the
   exception and its reason are written next to that use. The one
   move that is always wrong is quietly falling back to a
   superseded method because it was nearer to hand.
4. A method becomes CURRENT on evidence, not on enthusiasm: a
   gated proof build under it, measured on rendered frames, with
   the owner's eye gate as the final gate for production use.
5. Any document, plan, or agent brief that names a method names
   its registry version. If a brief and this registry disagree,
   the registry wins and the brief is corrected.
6. Diagnosis findings that change the method (new defects, spec
   corrections found in practice) land as dated addenda to the
   method spec **and** a dated line in this registry's change log
   below — a future agent reading only this file must still see
   that the method moved.

## Change log

- **2026-10-28 — Registry created; Industry Method v1 marked
  CURRENT / USABLE.** Single-Mesh Deform Method and Whole-Sprite
  Transform Method marked SUPERSEDED. Same landing adds:
  `WALK-DIAGNOSIS-LOG.md` (how the backwards walk was figured out,
  as a standing protocol), `YU-YU-HAKUSHO-ENDING-STUDY.md` (the ED
  reference study, with corrections), and
  `WHAT-WE-DO-WRONG-ADDENDUM-2.md` (gaps 12–21, with their gates —
  several of those gates are now part of what "using the current
  method" means for group shots, faces, music sync, and the ED
  slot; they land as method obligations in that addendum until the
  next method version folds them into the spec proper).

---

## ⬛ THE ED-CREDITS STANDARD (owner, 2026-10-28 — standing)

An ending-credit piece is allowed to take **less work** than a
story scene: fewer drawings, a lower drawing rate (on 3s — 8
drawings per second — is the house ED timing), loops, pans, held
poses. It is **not** allowed to take a lower standard.

An ED piece is production-grade when, at whatever drawing rate it
uses: its art is finished (no placeholder drawings), its contacts
plant and stick, its held poses are strong enough to read as
silhouettes, its timing varies on purpose (accents on 2s, a few
frames on 1s at the exact hit), the camera/background do honest
motion work, the cuts and beats land on the song, and every
character's personality is in their chart, not in their fluidity.
That is how the reference endings the format descends from were
actually made — see `YU-YU-HAKUSHO-ENDING-STUDY.md`. **Low FPS was
never the amateur part. Missing craft was.** A piece that fails
those checks is not "ED effort level"; it is unfinished, and it
does not ship as an ending.
