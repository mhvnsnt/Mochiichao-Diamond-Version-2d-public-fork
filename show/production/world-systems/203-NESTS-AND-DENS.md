# #203 — NESTS & DENS → wild den sites as area content

**Seat in the doctrine:** areas (#7) carry spawn
tables; a den is a table's structure made visitable
— a place where the stocked species shelter, rest,
and are *read* before they are ever met. The
governing law is #84's roster-binding in structural
form. #84 (sound ecology) holds that a place may
only **sound** of species it stocks; a den may only
**house** species its area's table stocks. A den of
an unstocked species is not rare content — it is a
data error, and this package's derivations are
built so it cannot be expressed.

**What was studied.** Den/nest sites in the
publicly documented exploration record: sites whose
occupants follow the surrounding population, whose
discovery is geographic, and whose value to the
player is *information* — sign, sound, behaviour at
the den mouth — more than encounters. The kit
taken: occupancy as a consequence of the area's
population data, never a separate list that can
drift from it.

## Native spec — `mochiichao/nests-and-dens/v1` (fragment beside this doc)

- **The den record:** `{denId, areaId (#7 area),
  denKind, interiorSeat: null | #119 interior id}`.
  `denKind` is a small closed vocabulary of *form*
  words — `nest | den | burrow | roost` — naming the
  structure, never the species. **The record names
  no species at all.** Occupancy is **derived** at
  read time from the area's spawn table: the den
  shelters what the table stocks (filtered by any
  shelter class the table itself carries; where the
  table carries none, occupancy reads as the area's
  stock generally — a shelter of the place, not of
  a species). Stored occupancy would rot against
  the next table edit; derivation cannot.
- **Discovery is #137's, not a new store.** A den's
  discovery state (unknown / hinted / open) derives
  from #12 evidence under the atlas's grammar, like
  any atlas feature. A *hinted* den is one of the
  legitimate sources for #89's tracking reads and
  #160's `sign:` class — the sign points at a real
  place whose stock is the table's, or it points at
  nothing this package will certify.
- **A den is not an interior.** It becomes
  enterable only if #119 seats it — an interior
  record, in #119's home, citing the den. The seat
  is #119's act, proposed there, never assumed
  here. Most dens are never enterable: they are
  read from outside — sign on the ground, sound per
  #84, #152 behaviour staged at the den mouth.
- **The Forest wording — exact, and binding on
  every consumer:** the Dark Forest **has dens**.
  Of the depths, the record says only this: **the
  depths have none that are recorded.** That is an
  absence of record, not a recorded absence. The
  spec asserts no depths rule a future canon act
  would need to break, and asserts no depths
  content of any kind. Any stronger sentence — in
  either direction — misquotes this system. (The
  epistemic mirror of #163: there, records exist
  and leak nothing; here, there is nothing to
  leak.)
- **No capture guarantee.** Encounters at a den
  roll on #7/#38 exactly as anywhere else. A den
  changes what can be **read** — signs, stock,
  behaviour, mood of a place — never what must
  appear.

## Wiring (proposed)

Den records beside SPAWN-TABLES (#7's home).
Reads: #7 tables, #12 evidence via #137, #84 sound
grammar, #152 behaviour views. Writes: den records
only (no species, no occupancy, no discovery
state — all derived).

## Open slots (nothing invented)

Every den instance (sites are world content,
authored with their areas) · whether spawn tables
carry a shelter class at all (a proposal into #7's
home — its owner's call, and the general-stock
reading above is the honest default until then) ·
which dens, if any, #119 ever seats as interiors.
