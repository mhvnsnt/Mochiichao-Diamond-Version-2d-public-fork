# #207 — MOCHIIOTECA DISCOVERY STATES & REVEAL → two axes, one derivation

**Doctrine seat:** the OWNER NUMBERING RULING (Jamar,
2026-10-27): species take the next roster numbers **as
they are locked**, filling the empty roster in lock
order; locked-but-undiscovered species appear as
**silhouettes** in the Mochiioteca until discovered —
*lock state is global, discovery visibility is
per-Ranger (two axes)*. This package specifies the
presentation system that ruling runs on. The machinery
already exists in pieces: #197 is the lock act (numbers
assigned at lock, never before), #14 founded the dex
state machine as canon already implements it (unseen /
seen / kept over the registry + `DexView`), #1 founded
the two flag bitsets (`seen_bits` / `met_bits`) that
gate every field, and #3 founded the field-level gating
table and the derived silhouette asset. #207 founds
nothing new — it joins the two axes into **one
derivation** every surface reads, and specifies the
reveal moment. Where the commissioning brief's state
names and canon's disagree, canon's win (registered in
STAGING): canon's states are **unseen / seen / kept**.

**What was studied.** The reference games' dex
presentation (public record, per #3's teardown): the
core games mostly *withhold* — unseen entries are a
number and dashes, seen lifts name/art in the list
while the data page stays masked, owned unlocks the
full page. The filled silhouette as a discovery
presentation is the franchise's broadcast convention.
Mochiichao canon sits deliberately between the two
(#14: the game's own `DexView` shows the discovery
silhouette at unseen), and the owner's ruling settles
which side this project presents on: silhouette.

## Native spec — `mochiichao/discovery-states/v1` (fragment beside this doc)

- **Axis 1 — LOCK (global, #197).** A species is
  either *not on the roster* (no roster number; in the
  design-lane data its `id` is null) or *locked*
  (holds a number, with lock provenance on its
  record). This axis is the same for every Ranger and
  every surface. **An un-locked species has no dex
  slot at all** — the Mochiioteca cannot display,
  silhouette, or count what the roster does not hold
  (#14's rule: wave species do not count until they
  hold registry entries). The first locks under the
  ruling are verified in the design-lane data:
  048 Pupparmor, 049 Shieldane, 050 Bastihound,
  051 Flickfin, 052 Pikeperil, 053 Halberdrake, each
  carrying its lock provenance and the silhouette
  presentation note on the record.
- **Axis 2 — DISCOVERY (per-Ranger, #14 over #1).**
  For a locked species, a Ranger's state is derived
  from their two bitsets: **unseen** (neither bit),
  **seen** (seen bit), **kept** (seen + met bits —
  #3's MET tier under canon's word). Transitions come
  from exactly the three sources #14 verified: a
  spawn-table encounter (#7) marks seen; a successful
  keep marks kept; an event effect `mark_seen` (#12)
  covers scripted first meetings. No other system in
  this package or any other may move a discovery
  state.
- **The presentation matrix** (locked species,
  per Ranger — field gates from #3's table, art rule
  from #14 + the owner's ruling):

  | State | Slot | Art | Name | Data fields | Footprint | Cry |
  |---|---|---|---|---|---|---|
  | unseen | number shown | **silhouette** (derived ink asset, #3) | hidden | all masked | hidden | silent |
  | seen | number shown | full colour | shown | still masked | hidden | playable |
  | kept | number shown | full colour | shown | full record | shown (or blank if none) | playable |

  The withholding is **field-level**: each field is
  gated individually, exactly as #3's table gates
  them — an undiscovered species' name, bio, habitat,
  measurements, and cry do not exist *on any surface*
  for that Ranger. Withholding is a presentation
  derivation from the two bits; the species' real data
  is never edited, masked at rest, or duplicated.
- **The reveal moment.** The unseen → seen transition
  is a designed beat, in both lanes. *Game:* the
  silhouette fills to the full-colour design — the
  silhouette asset is derived from the species'
  marked-CURRENT cutout by #3's `discovery_assets.py`,
  so the reveal can only ever reveal the current
  design of record (current-version law applied to
  discovery: a superseded design's silhouette is a
  defect). *Show:* the reveal is a #149 screen event —
  `identify` class (the entry assembling, silhouette
  first) with `scan` at the registering moment, under
  #149's pacing law: light → assemble → settle, and
  assemble order is **silhouette before name before
  data, always**. The show's held "who's that" beat
  (#3 §1.2) is the same asset held longer — one asset
  set, two timings.
- **One derivation, every surface.** The device
  (#149 screens, #32 map/dex surfaces), the atlas
  (#137, and #198's regional dex views), promo
  (#156), and broadcast surfaces (#172) all read this
  derivation and no other. This is the Leak rule's
  sibling, stated plainly: the Leak rule keeps
  secret-layer *vocabulary* off surfaces; this rule
  keeps unrevealed canon *facts* off surfaces. A
  surface that names an undiscovered species — in a
  promo, a broadcast, a map label — is a defect of
  the same class as a Leak-rule breach, and #156's
  currency gate is its mechanical check on the promo
  side.

## Show lane

The discovery beat is show grammar as much as device
grammar: a first meeting in an episode is staged as
silhouette → reveal under the autonomous doctrine
(the creature is met, never summoned by the device),
and episode scripts reference dex states by the same
state names, so a script can never show a Ranger a
species their record hasn't met (#82 conservation
applied to knowledge, as #98 applies it to props).

## Wiring

Reads #197's lock records (axis 1) and #1's bitsets
(axis 2); state machine and transition sources are
#14's, unchanged; field gates and the silhouette
asset are #3's; the show presentation joins #149's
screen classes; consumers: #32, #137/#198, #156,
#172 — each cited at landing, none re-deriving.

## Coverage — honest

- **Architecture: fully documented and canon-verified**
  — the state machine is the game's own (#14), the
  bitsets and field gates are #1/#3, the lock axis is
  the owner's ruling already executing in the
  design-lane data (048–053 with provenance).
- **The one reconciliation this package makes** is
  registered, not hidden: #3's core-game table shows
  no art at UNSEEN (the core games withhold); #14's
  canon implementation shows the discovery silhouette
  at unseen, and the owner's 2026-10-27 ruling
  confirms silhouette presentation. Canon + ruling
  win; #3's field gates are unchanged.
- **Contents:** every species beyond the first six
  locks is a future lock act; reveal *durations* are
  production values, OPEN (#149's slot, inherited).

## Open slots (nothing invented)

Reveal timing values (production, per #149) · the
discovery presentation of species whose canon cutout
does not yet exist (a locked species with no design
of record cannot be silhouetted — the lock act's
problem, flagged for #197, not solved here) · whether
`mark_seen` may ever fire for a species before its
lock (ruled by construction: no slot exists to mark —
stated, not slotted).

---

**Landing notes — List 33 (2026-10-27), citing STAGING steps 1 and 8.**

(1) Reciprocal citations: #319 individual recognition (`world-systems/319-INDIVIDUAL-RECOGNITION.md`) extends this file's discovery read — recognition is a read over a Ranger's own meeting history, fame a fact in the world's public layer, never a stat and never a field on an individual record. #325 record portrait fidelity (`species-data/325-RECORD-PORTRAIT-FIDELITY.md`) lands beside this file and is gated by this file's tiers. (2) **Silhouette fence (step 8, citing #325):** silhouette assets resolve from SPECIES records only, never from individual records — individual truth is shown only at the tier that earned it.
