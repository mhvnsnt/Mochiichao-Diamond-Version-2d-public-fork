# #235 — INSCRIPTION & LORE FRAGMENTS → readable history in the world

**What was studied.** Inscriptions as a delivery
device in the publicly documented record: carved
plaques, memorial stones, ruin wall-text — history
that reaches the reader *in pieces, in place*, and
whose incompleteness is the point. Environmental
storytelling practice adds the discipline: a
fragment tells what its carver knew, where they
stood — never the whole truth, and never anything
the world's canon hasn't decided is knowable. The
kit taken: fragments as authored slots on real
places, read in place, bound by what canon
withholds.

## Canon anchors (verified in the packages)

- **#154 owns the ruins; #225 owns the memorials**
  (List 23, building in parallel — forward citation
  for #225; see STAGING). Inscriptions seat on
  both: a ruin's wall-text and a memorial's carved
  names are the same record class in two homes.
  #154's contents law holds entire — an inscription
  is remnant-class content; it is never an encounter
  and never a mechanism.
- **#149 owns device presentation.** The
  Mochiioteca's screen classes are closed
  (identify / map / scan / alert); inscription
  reading is *adjacent* to that system, not inside
  it: reading a stone is done with eyes, in the
  world. Where a device assists (a scan-class
  reading of a weathered text), the presentation
  borrows #149's discipline — light → assemble →
  settle — as a citation, not a new screen class.
- **The Leak rule binds translations.** The
  standing display-layer law: what a surface shows
  is the surface's own layer, never the layer
  beneath. Applied to inscriptions: a translation,
  rubbing, or device reading of a fragment
  **never names what canon withholds** — above all
  what stopped moving in the Dark Forest, which is
  unanswered by canon and stays unanswered on every
  stone in the world. An inscription may approach
  the Forest's edge in subject; its text may not
  cross into the withheld fact, and a fragment that
  appears to is either mistranslated in-fiction
  (an authored choice, recorded as one) or a data
  error.

## Native spec — `mochiichao/inscription/v1` (fragment beside this doc)

- **The inscription record**: `{inscriptionId,
  seat{kind: ruin | memorial, ref}, state, textRef,
  translationRefs[]}`. The record carries **no
  text** — `textRef` points at the content lane's
  authored text in its own home. All inscription
  text is owner/content-lane writing; **this
  package instances none, drafts none, and
  paraphrases none.**
- **`state ∈ {legible, weathered, fragmentary}`** —
  how much of the text the world still offers.
  State is a property of the stone, authored with
  it; reading a `fragmentary` inscription yields
  the fragment as authored (with its gaps *in* the
  text, written by the content lane), never a
  procedurally holed version of a whole text that
  exists somewhere complete. If the complete text
  doesn't exist in the content home, it doesn't
  exist.
- **Reading is an event with no payload but the
  reading.** Like #231's witnesses and #153's
  phenomena: having read an inscription may be
  recorded (a #191 journal entry is the player's
  own layer, and the natural home for it), but the
  world writes nothing — no flag unlocks, no door
  opens, no dex entry fills. Knowledge the *player*
  carries away is the payload, and it lives in the
  player.

## Show lane

An inscription in the show is read aloud or not at
all — a character reads, the subtitle law decides
whether the audience sees text (important-moment
material when the fragment matters), and #227's
provenance grammar is the peer system: a fragment
about a person or a Mochi is a tale told by stone.
The show's stones obey the same Leak rule; no
episode's inscription answers what canon hasn't.

## Wiring

Records seat in #154's site records and #225's
memorial records (proposals into both homes);
text lives in the content home by reference;
reading presentation cites #149; player-side notes
via #191. Lands beside 154-RUINS-AND-ANCIENT-SITES.

## Coverage — honest

- **Architecture: fully specified** — record,
  state vocabulary, reference-not-text discipline,
  Leak-rule application.
- **Contents: zero inscriptions instanced and
  zero words of inscription text written.** The
  world's history is the owner's canon to write;
  this package builds only the stones' shape.
