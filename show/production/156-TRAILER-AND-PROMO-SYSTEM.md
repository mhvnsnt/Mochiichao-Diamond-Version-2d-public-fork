# #156 — TRAILER & PROMO ASSET SYSTEM → marketing built from what's current

**Seat in the doctrine:** the show and the game share
one asset world — Jamar's standing decision seats the
show inside the game repo so both pull from each other,
and marketing pulls from both (the pilot trailers and
vertical marketing cuts already live in the repo's
show-trailers home). Marketing is also where the
current-version law is most at risk: a trailer is
assembled fast, from whatever's at hand, and the
Dorowani lesson (composites built on a superseded still
instead of the current living piece) is exactly a promo
failure. This spec makes promo construction a *system*
with the law built in, rather than a folder of good
intentions.

**What was studied.** Trailer/promo production in the
publicly documented record: trailers are cut from a
*shot pool* with provenance (every shot knows its
source and version), formats derive from one master cut
(the vertical is a re-composition, not a re-edit from
scratch), and game/show cross-promotion works when both
sides draw on the same asset registry rather than
exporting at each other. The kit taken: a promo record
whose every shot cites a registry entry *and its
marked-current version*, with derived formats generated
from the master record.

## Native spec — `mochiichao/promo/v1` (format below; records live with the trailer assets)

- **A promo record:** `{promoId, kind ∈ {trailer,
  teaser, vertical, short, keyart}, master (for derived
  kinds, the promoId they derive from), shots[],
  audio, finish}` — each shot: `{piece (parts-catalog /
  clip-index ref), version (the registry's marked-
  CURRENT version id at build time), use}`. The build
  *stamps* the version it used; the registry stays the
  authority on what current means.
- **The currency gate (the law, mechanised).** A promo
  may only be built from pieces whose stamped version
  equals the registry's CURRENT version for that piece
  *for that use* (currency is per piece and per use —
  an older living version assigned to a different scene
  is a legitimate use, and the record says which use it
  serves). A build that reaches for a superseded version
  without a written exception on the record is a defect
  — this is the still-plate failure, named in the format
  so it can be checked, not remembered. Exceptions
  (a deliberate flashback variant, a teaser cut before
  the current piece lands) are written on the record
  with their reason, per the law's own terms.
- **Audio finish is the house finish.** Promo audio
  ships at the delivery spec's measured master values
  (#75: −14 LUFS ±0.5, ≤ −1 dBTP), voice work is real
  cast audio (never VOICE-SCRATCH — #75 already bars
  scratch from masters, and a trailer is a master), cries
  come from the synth (#2) with #155's layering grammar
  for any multi-creature moment, and music rides #13's
  stem system so a promo cut can re-time without
  re-composing.
- **Derived formats are records, not rescues.** The
  vertical/short of a trailer is a child record citing
  its master and re-composing from the *same stamped
  pieces* (reframe per use — vertical crops are a use,
  so a piece's vertical-safe variant, where the registry
  holds one, is the cited version). No derived cut may
  reach outside the master's shot pool for new pieces;
  new material means a new master.
- **The reuse path runs both ways, as established:**
  show bundles feed game marketing (species spotlights
  as store/listing assets), game art feeds show promo
  (CURRENT species art in trailers — the A1 line's locked
  finals are the standing example), and every flow is a
  citation, so a piece upgraded in one lane re-flags its
  promos in the other: a currency re-check is a query
  over promo records, not a memory.

## Open slots (nothing invented)

Channel/format targets and their exact specs (platform
requirements are external facts, recorded per release,
not canon) · promo cadence and campaign structure
(marketing decisions, owner's) · which pieces get
vertical-safe variants (production call per piece) ·
keyart composition rules (the brand guide's logo/type
chapter is OPEN in #74 and stays the authority when it
lands — this spec does not pre-empt it).
