# #68 — PLAYER TRADING / GIFT PROTOCOLS → trade-system spec (design only)

**Scope discipline first.** No live service, network feature, or
multiplayer mode exists for Mochiichao, and this spec builds none.
It is the **data architecture** a future trade system would use, so
that if the owner ever green-lights one, the save/registry layer
already speaks its language. Design only.

**Teardown (public documentation).** The reference trade systems are,
at the data layer, a **two-phase commit between two registries**:
(1) each side escrows a *record reference* (species id + the
individual's carried data — level, moves, held item, origin marks),
never a copy of game truth; (2) a fairness/validity check runs on the
pair (version compatibility, untradeable flags on story-critical
individuals, legality bounds); (3) the swap is atomic — both saves
write, or neither does — and both sides stamp **provenance**
(original keeper id, trade count, a "met far from home" marker that
later systems read for flavour and, in some designs, obedience/xp
modifiers); (4) gifts are the degenerate case: one side escrows,
no return record, often delivered through a code or event channel
with an expiry. Timed/link-cable and later online systems differ
only in transport. The kit taken: escrow-by-reference, atomic swap,
provenance stamps, gift-as-one-way-escrow. No protocol bytes, service
names, item/species data, or code are copied.

**Native format — `mochiichao/trade-record/v1`** (fragment beside
this doc). A trade record is a *proposal document* two save files
would exchange:

- `offer` / `request` — individual references: registry individual id
  (not species id alone), species id, level, move ids (display names
  resolve via the rename law at render time; ids stable), held-item
  id or null, `origin_keeper` stamp.
- `locks` — hard refusals evaluated before any swap: `story_locked`
  (a partnered/principal individual can never be escrowed — in our
  canon the partner bond is story load-bearing), `species_untradeable`
  (a per-species flag on the sheet; default false, canon sets true
  where it rules — slots exist, **values are OPEN**), egg/unhatched
  states, and version/skew mismatch.
- `provenance_out` — what the receiving save stamps on arrival:
  `previous_keepers[]` (append-only), `met_via: trade|gift`,
  `away_from_home: true`. The Mochiioteca reads provenance for its
  flavour line; completion states (#14) do **not** change hands —
  a traded-in species is *kept* in the receiver's registry only via
  the normal kept transition, so trades can never launder completion.
- `gift` variant — `request: null`, plus `channel` and `expires`
  fields; gift provenance stamps `met_via: gift`.

**Canon guardrails.** The show lane never trades: the two-lane law
keeps partner bonds narrative, and no episode mechanic depends on
this spec. Creature *welfare* framing is ours by design: the record
vocabulary is keeper/partner language, matching canon's Ranger/keeper
terms — the format deliberately has no ownership/price fields; a
trade is an exchange of *care*, recorded as provenance, which also
keeps the door shut on any in-format economy (economy is #20's
separate, in-game-only system).

**Wiring.** Consumes: registry individual records + species sheet
ids (species-data-system), #12 event-flag namespaces (a completed
trade fires `progress.trade_completed` — the flag shape exists, no
content asserted), #14 completion (read-only, as above). Produces:
nothing yet — the fragment is the interface a future build implements.

**Coverage.** Architecture: standard and fully documented at the
pattern level. Contents: format complete; every policy value
(untradeable species, gift channels, whether trades ever exist in
the shipped game) is OPEN — an owner product decision, not a spec gap.
