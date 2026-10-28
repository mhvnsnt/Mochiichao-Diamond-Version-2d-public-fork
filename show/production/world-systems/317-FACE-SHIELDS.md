# #317 — GROWN FACE SHIELDS & MASK ANATOMY → the covered face gets its own part class

**The occasion (owner ruling, Jamar, 2026-10-27).**
Verdilance's species standard carries a grown
Digimon-knight/samurai **face shield** over the
mouth/muzzle — the Bastihound-class treatment, in the
menpo register — with everything else in the design
unchanged. Face coverings were already canon three
times over before this ruling (Bastihound's shield,
Wispkin's skull mask, and every helm in #259), but
#259's vocabulary has no class for a part whose whole
job is covering the *face*. This spec founds that
class, on #259's own record, in #259's own idiom.

**What was studied.** Production anatomy practice:
a face covering is named separately from headgear in
model-sheet work because it changes a different set
of downstream systems — expression staging, rig
weighting around the jaw line that is *not there*,
continuity checks ("is the shield present in this
cut?") — than a helm or crown does. The kit taken:
one class, forms named inside it, the helm law
extended over it unchanged.

## Native spec — `mochiichao/face-cover/v1` (fragment beside this doc)

- **The class (a proposal into #259's vocabulary,
  landing in #259's home per the `RIDDEN`
  precedent):** `face-cover` joins #259's closed
  class list. It carries a closed `form` field:
  - `muzzle-plate` — a grown plate over the whole
    muzzle, nose included. Canon instance:
    **Bastihound** (roster 050) — the locked final
    art runs the plate smooth and continuous over
    the whole muzzle; the earlier proof with the
    nose showing survives as a variant file, which
    is a file-currency fact, not an anatomy state.
  - `mouth-shield` — a menpo-class shield over the
    mouth/muzzle area, the face's upper read (eyes,
    brow, crown) left open. Canon instance:
    **Verdilance** (the owner's 2026-10-27 ruling;
    the masked proof is the current candidate art,
    the shield is the species standard from the
    ruling forward).
  - `full-mask` — a covering that *is* the face's
    whole presented surface. Canon instance:
    **Wispkin's** white cracked skull mask. Carried
    law, restated because this class is its home:
    **the crack is a protected flaw** — a feature of
    the mask as grown, reproduced in every
    generation (#325), never repaired, never
    widened, never treated as damage. Wispkin's
    maskless form is pre-mask flashback material
    only, not a state the living character enters.
- **The part record** is #259's, unchanged in shape:
  `{partId, class: face-cover, form, growsFrom,
  stageFirst, stageLast, notes}`, annexed to the
  sheet beside Anatomy notes. `growsFrom` names the
  anatomy the covering grows from (muzzle, jaw line,
  the face itself for a full mask) in the sheet's
  own words.
- **Stage rule.** A face shield arrives **with the
  stage whose sheet declares it** — `stageFirst` is
  the whole law. Verdilance's shield is a stage-3
  fact: Seedquire and Budguard carry no face-cover
  part, and asking stage 1 or 2 for one returns "not
  yet" (#259's stage discipline), never stage 3's
  shield drawn early. A line where an earlier stage
  grows a covering and a later stage replaces its
  form records both parts, `stageLast` pointing at
  #258's growth record for how.
- **The helm law, extended verbatim:** a grown face
  shield **never comes off**. There is no state,
  move, item, service, or scene verb that removes
  one, and therefore **there is no "unmasked state"
  for the species standard** — the vocabulary cannot
  express one. A drawing of the species without its
  shield is one of exactly two things: an earlier
  stage's body drawn correctly (which has no shield
  yet), or a **ruled deviation on a named
  individual** (#318 — the maskless Verdilance is
  precisely this, and his home is the register, not
  this vocabulary). Injury is not a system anywhere
  in this programme (#259), and a "broken shield"
  beat is a prose-history fact about an individual
  under #80's deviation discipline, never a part
  state.

## Show lane

The class is the board's shorthand, like #259's:
"face-cover" in a board note means the grown part,
drawn as anatomy in every cut. Continuity (#53's
family) reads face-cover presence per stage from
this record — which is what keeps a stage-3 shield
out of a stage-2 flashback and keeps Wispkin's crack
the same crack in episode 30 as in episode 3.

## Wiring

Proposal lands in #259's file (the class + the three
forms); part records annex on the sheets (Verdilance's
sheet gains its face-cover record in the design
lane's sheet pass — the R2 sheet predates the ruling,
registered in STAGING); read by rigs (#5/#6), #9
anchor cues, #53-family continuity, #320 (expression
staging keys off the form), #325 (fidelity renders
the part).

## Open slots

Story/canon facts only: **what Verdilance's shield
means in-world** is episode writing (#321 carries the
slot); which further species carry a face-cover part
is a sheet fact, decided line by line by the design
lane — zero are asserted here beyond the three canon
instances named.

## Coverage — honest

- Architecture: one class, three forms, the record
  shape and both laws carried over from #259
  verbatim — complete.
- Contents: two of three instances (Bastihound,
  Wispkin) verified against locked art/canon in this
  build; Verdilance's instance rests on the owner's
  2026-10-27 ruling with its masked proof in
  production — the manifest entry read at this build
  still showed the maskless candidate, so the masked
  file's landing is registered as a verification
  target in STAGING, not asserted here.
