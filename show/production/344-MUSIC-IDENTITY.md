# #344 — MUSIC IDENTITY → a theme is who someone is, stated in music

**OWNER'S DIRECTION (Jamar, 2026-10-27):** music
**is** identity in this game. SA2's soundtrack
construction is the model (the Sonic catalogue,
List 30, documents it: character themes that state
identity, a finale theme that states the season's
point) — and our soundtrack is built on **our**
theme and identity, our notes entirely.

**The gap this fills.** The programme has sound
machinery — #84's sound ecology, #215's regional
beds (a place's layered soundscape, one library
both lanes), #72's instrument bank, the adaptive-
music teardown's machinery, #2's cry synth — and
no **identity layer**: nowhere is it written that
a person, a species, or a place *has* a theme,
what a theme is made of, or where the record
lives. Music currently happens *in* scenes; this
spec makes it belong to *subjects*. #345 builds
songs on top of it; this spec is the identity
record #345 composes from.

## Native spec — `mochiichao/music-identity/v1` (fragment beside this doc)

- **The theme record** (one per subject; three
  subject classes):
  - `subject` — a major human, a species, or a
    place, by ref to the subject's own record
    (casting/bible, species sheet, #215's region
    record). Themes attach to records; they never
    float free.
  - **`identityBrief`** — three musical facts, in
    words, that the theme must state:
    - for a **human**: *who they are · what they
      want · what they are hiding.* (The third
      fact is the SA2 lesson: a theme that only
      states the surface is a jingle; the hiding
      is where the harmony lives.)
    - for a **species**: the brief is **motif
      shape, not psychology** — the contour facts
      of its cry (#2's parameter block: base cry,
      pitch/length behaviour, attack/decay feel),
      because a species' cry **is** its theme-seed
      (below).
    - for a **place**: *what it is · what it was ·
      what it promises* — read against #215's bed
      layers, so a place's theme and its bed are
      one composition at two scales.
  - `motif` — the musical seed in data: interval/
    contour/rhythm facts a composer or the #72
    bank can realise. The motif is the identity;
    everything else is arrangement.
  - `versions[]` — every realisation of the theme,
    each with a **use class** (identity statement /
    battle arrangement / field arrangement / promo
    / finale reprise — the classes are data) and a
    **CURRENT marker**: the current-version law
    applies to themes exactly as to art — exactly
    one CURRENT version per theme per use class,
    superseded versions named and kept, and no
    lane quietly falls back to an older version
    (the law's currency refinement: an arrangement
    current for battle does not displace the one
    current for the field).
- **Creatures: motif-cries, never songs.** Voice
  law binds music too: a creature's theme-seed is
  its cry, and a creature never sings words, never
  performs its theme. The *orchestra* may carry a
  species' motif (an arrangement is the world's
  music about the creature); the creature's own
  voice stays #2's synth, cries only. A theme
  record for a species therefore contains no vocal
  version class at all — the schema refuses it,
  the same shape as #293's battle-stat fence.
- **Humans: themes may be vocal.** Humans speak;
  their identity themes are the subjects of #345's
  vocal construction. The theme record holds the
  brief and motif; #345's songs are versions
  *within* the record, not new identities.
- **Places: the bed grows a leitmotif.** #215's
  bed record gains a motif ref (proposed into
  #215's home, with citation): the place layer of
  the bed is arranged from the place's motif, so
  arriving somewhere *sounds like someone* — the
  region's identity stated before its scenery
  finishes loading. Phase/weather layers (#215's
  own) arrange around it; they never replace it.
- **Identity is versioned like art** — a theme
  whose subject's canon changes (a character's
  secret becomes the plot) gets a **new version**,
  with the supersession named; the old version
  stays the CURRENT truth of the earlier season's
  use class if the bible says so (per-use
  currency). A theme is never silently re-scored.

## Show lane

The bible/casting docs hold human theme records
beside the characters they name — a composer,
director, or #156 promo editor reads identity from
the same record. Casting a major human without a
theme brief is a bible gap of the same class as
casting one without a model sheet.

## Wiring

Records seat: humans → bible/casting docs;
species → sheet annex (motif derived from #2's
cry block); places → #215's bed record (motif ref
proposal lands there). Consumers: #345 (songs and
arrangements are versions here), #156 (promo cites
CURRENT versions — its currency gate already
demands exactly this), #215 (beds), #84 (ecology's
resident species sound may quote motifs at the
presentation layer, under #84's roster-binding).

## Open slots

Story/canon facts only: **which humans are major
enough to carry themes** (casting's call); every
actual brief's contents (who each character is,
wants, and hides — canon writing, entire); every
motif's notes. The format lands complete; zero
themes are instanced by this package.

## Coverage — honest

- **Architecture: fully specified** — the record,
  the three brief shapes, the motif seat, per-use
  versioning under the current-version law, the
  creature-vocal refusal.
- **Contents: zero** — no theme, brief, or motif
  is written for any subject here.
