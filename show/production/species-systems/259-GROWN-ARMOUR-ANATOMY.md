# #259 — GROWN ARMOUR & HELM ANATOMY → one vocabulary for grown armour, so every system names the same parts

**The gap this fills.** Grown armour is everywhere in
the design work — Bastihound's plates and grown tower
shield, Budguard's leaf shield and bud helm,
Verdilance's bark torso — and every sheet describes it
in its own prose. The rig builders, the animscript
writers, and the coverage ledger each need to point
at *the shield* or *the helm* and mean the same thing.
This spec is the shared vocabulary: a small set of
part classes, and a per-species part record that names
which parts a body actually has.

**What was studied.** The reference record's craft
layer: production model sheets name parts once and
every department works to the names; creature-design
practice separates *armour* (grown protection) from
*equipment* (carried protection) at the vocabulary
level, because the two animate differently, break
differently, and are drawn differently. The kit taken:
name the grown parts as anatomy, in classes, and let
every consumer cite the names.

## Native spec — `mochiichao/grown-armour-parts/v1` (fragment beside this doc)

- **The part classes (closed):**
  - `shield` — a grown defensive surface, carried on
    a limb's line (Budguard's leaf disc; Bastihound's
    tower shield grown from the foreleg).
  - `helm` — a grown head covering: a bud, a crown, a
    crest-plate that is *part of the head*. Budguard's
    bud is a helm (owner's reading, 2026-10-27); a
    helm that opens at a later stage (Verdilance's
    crown) is a `crown`, the helm class that blooms.
  - `crown` — a helm whose form is an opened bloom or
    wide living brim (Verdilance's sunflower crown).
  - `plate` — a grown armour segment on the body
    (Bastihound's back plates; Verdilance's bark
    torso plating).
  - `shell` — a grown enclosure the body lives inside
    (a full torso shell, where a species has one).
  - `crest` — a grown display ridge or frill with no
    defensive claim (frills, sails, collars of leaf).
  - `weapon-part` — the grown weapon itself, named
    here so armour and weapon share one index; its
    *growth* is #258's record, not this one.
  A part that fits no class is a design conversation,
  not an eighth class coined in a sheet.
- **The part record** — per species, annexed to the
  sheet beside Anatomy notes: `{speciesId, parts[]}`,
  each part `{partId, class, growsFrom, stageFirst,
  stageLast (where a stage replaces it — the record
  points at #258 for how), notes}`. `partId` is
  species-scoped and stable (`<speciesId>.<class>-<n>`
  or the sheet's own short name where the sheet has
  already settled one — the sheet's name wins, as
  with every annex). `stageFirst` matters: Seedquire
  has no shield; the shield is born at Budguard. A
  consumer asking stage 1 for its shield must get
  "not yet," not stage 2's part.
- **The helm law, plainly:** a grown helm never comes
  off. There is no state, move, item, or scene verb
  that removes one. If a drawing shows the head
  without the helm, one of two things is true: it is
  a different species' anatomy (a pre-helm stage of
  the line, drawn correctly — Seedquire's seed cap is
  not a removed helm, it is an earlier body), or it is
  an **injury** — and injury is not a system anywhere
  in this programme. Battle states (#27/#182) are
  conditions, not wounds; nothing in any package
  tracks damage to a body part, and this vocabulary
  founds no exception. A story that wants a cracked
  helm writes it as that individual's history in
  prose (#80's deviation discipline — a ruled
  deviation on a named individual), never as a part
  state the vocabulary can express.
- **Who consumes the names.** Sheets cite part ids in
  Anatomy notes and DESIGN BRIEFs (new sheets; old
  sheets gain citations in the same distillation pass
  that owes #152/#258). Rigs (the #5/#6 family —
  rig teardown + templates) name their grown-armour
  bones/meshes by part id, so a shield-brace pose is
  built once per part, not once per artist's reading.
  Animscripts (#9) cue anchors against part ids — a
  shield-block performance anchors to the `shield`
  part, and #9's validator can refuse a cue for a
  part the stage doesn't have yet (via `stageFirst`).

## Show lane

The vocabulary is the board's shorthand: a storyboard
that says "helm" means the grown part, drawn as
anatomy in every cut — never as a hat the character
could set down. Continuity checks (#53's family) read
part presence per stage from this record, which is
what keeps a stage-2 shield out of a stage-1
flashback without anyone memorising the line.

## Wiring

Annex on the sheet; classes fixed here; read by the
design lane (briefs), the rig layer (#5/#6), #9
(anchor cues), #53-family continuity, #258 (the
weapon-part index join). Writes: nothing outside its
own annex.

## Open slots

None that are mechanics. Each species' actual parts
are sheet facts, written by the design lane; the
class list and record shape land complete.

## Coverage — honest

- Architecture: the class vocabulary and record
  shape, anchored on verified canon parts (A1's
  plates/shield, A3's shield/helm/crown/lance) —
  every class in the list has at least one canon
  instance except `shell` and `crest`, which are
  carried because the design vocabulary needs the
  words before a sheet reaches for them (named as
  carried, not instanced).
- Contents: part records per species are owed by the
  sheet pass; zero are fabricated here.
