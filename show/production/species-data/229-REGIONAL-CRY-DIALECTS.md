# #229 — REGIONAL CRY DIALECTS → the same species, sounding of its home

**What was studied.** Dialect in the publicly
documented record, taken two ways: real-world
bioacoustics (birdsong and whale-song dialects —
regional variants of one species' signal, mutually
intelligible, locally flavoured) and accent work in
animation sound design, where a variant is produced
by *colouring* a locked voice print, never by
recasting the voice. The kit taken: dialect is a
parameter colour on an identity, keyed to where the
individual comes from.

## Canon anchors (verified in the packages)

- **#2 owns the voice.** Cry synthesis renders from
  per-species parameter blocks with a seed, "so
  noise is reproducible render-to-render"; the
  pilot parameters were "drafted to the locked
  identities" in the SHOW-BIBLE. A dialect system
  that re-parameterised the base would fork the
  identity — so dialect must live *downstream* of
  the base render, as a transform on it.
- **#95's identity floor is binding.** The SFX
  variation engine's rule: variation may colour a
  sound but never carry it across the floor where
  it stops being *that species'* sound. Dialect is
  a variation class under the same floor: **a
  dialect is colour, not a new voice** — any
  dialect transform whose output fails the floor
  test against the base render is a data error.
- **#80 owns origin.** The individual record
  carries provenance (where and how this individual
  was met — the #168 stamp family and its kin).
  Dialect keys off the individual's *origin region*
  read from that record: a Dorowani raised from an
  egg in another region sounds of where it grew,
  because origin on the record is where the
  individual is *from* in the biographical sense
  the record already keeps. (Where the record's
  provenance is a trade stamp chain, the earliest
  origin is the key — later keepers do not re-voice
  a creature. This follows the record's own
  append-only logic; it is a read rule, not new
  data.)
- **#136 owns comprehension (show lane).**
  Comprehension is staged fluency with a `gist`
  level (valence only) below finer reads. Dialect
  meets it as a fixed interaction, stated below.

## Native spec — `mochiichao/cry-dialect/v1` (fragment beside this doc)

- **The dialect record** (one per species × region
  where a dialect exists): `{speciesId, regionId,
  colour{…}, status}`. `colour` is a bounded
  transform block in #2's parameter vocabulary —
  the same parameter names the base block uses,
  each with a *delta range*, never replacement
  values. The base render is computed first, the
  colour applied second, the identity floor checked
  third; a render that fails the floor is refused,
  not shipped.
- **No dialect is the default.** A species with no
  dialect record for a region renders its base cry
  there — absence of a record means absence of a
  dialect, never an implied one. Which species have
  dialects in which regions is species-data work;
  this package instances none.
- **Dialect is origin-locked, not location-live.**
  An individual's dialect follows its origin for
  life; travelling does not retune it, and a wild
  individual's dialect is therefore evidence of
  where it grew — a fact #102-class range reading
  and #152 behaviour may *use*, but no system may
  rewrite.
- **Comprehension interaction (show grammar,
  stated once, binding on #136's staging):** a
  dialect cry is **gist-readable across regions** —
  valence and intention class (#136's closed
  vocabulary) survive the colour — while **nuance
  is local**: the fine distinctions a fluent local
  read catches are available only to listeners
  fluent in that region's dialect. A listener's
  staged fluency (#136) therefore has two seats —
  species fluency and dialect familiarity — and a
  script stages a missed nuance, never a missed
  gist, when a foreign dialect is misread. Getting
  this backwards (gist lost, nuance kept) is a
  staging error under #136, flagged at script
  review.

## Game lane

Dialect renders wherever cries render (#155's mix
classes inherit it unchanged — a layered cry is
layered *after* colour, so a chorus of one species
from two regions sounds like what it is). The
Mochiioteca's cry playback (#149's identify class)
plays the *individual's* rendered cry, dialect
included — the device reports the creature in front
of it, not the species template.

## Wiring

Transform layer over #2's renderer; floor test
shared with #95; key read from #80; comprehension
interaction cited into #136's home per the proposal
discipline. Lands in the species-systems home
beside CRY-SYNTH.

## Coverage — honest

- **Architecture: fully specified** — transform
  order, floor test, origin key, comprehension
  interaction.
- **Contents: zero dialects instanced;** every
  species × region colour block is species-data
  work, and every delta range value is OPEN.
