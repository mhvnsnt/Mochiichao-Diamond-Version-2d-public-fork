# #190 — ITEM VAULT & INVENTORY ORGANISATION → the item peer of #106

**What was studied.** Item storage in the publicly
documented creature-game record: a bag with pockets for the
field, and a storage service (PC item storage, vaults,
depots) for everything else, with deposit/withdraw as the
only verbs. The documented failure mode the kit is chosen
against: key items stranded in storage soft-locking story
progress — later systems in the record simply exempt key
items from storage altogether. The kit taken: one-location
discipline for items, exactly as #106 wrote it for
individuals, plus a mechanical audit that makes the
soft-lock unrepresentable rather than merely discouraged.
No capacities, names, or text are copied.

## Canon anchors (verified in the packages)

- **#106 is the template, verbatim.** "One individual, one
  record, one location" — storage as a *view* over the
  roster filtered by `location.kind`, boxes as organisation
  not capacity fiction, views derived at read time. The
  vault is the same architecture one layer down.
- **#31's item layer is the vault's data.** Every item is
  one record — id, display name (a #23 lookup), `category`
  in the closed vocabulary `consumable | held | key | care
  | capture | material`, `useContext {field, battle, held}`,
  `price`, `stack {stackable, max}` — contents zero
  instanced. The vault stores *holdings of* those records,
  never new item data.
- **#132's service places are the vault's counters.** A
  vault is a service place record in #132's family (places
  are data; a centre may only cite a place that exists).

## Native spec — `mochiichao/item-vault/v1` (fragment beside this doc)

- **Holdings, one location.** A holding is
  `{itemId, count, location: bag | vault}`. A unit of an
  item is in the bag or in the vault — never both, never
  nowhere. A stack split across the two places is two
  holding rows; every inventory view (bag list, vault list,
  totals) is **derived at read time** over the rows, per
  the programme's derived law. Deposit and withdraw are
  transfers — counts move between rows — never copies:
  depositing cannot duplicate, withdrawing cannot create.
- **The vault as a place.** Vault access happens at a
  service place (centre-class, #132's record family) or
  wherever the world build seats a vault terminal — seats
  are place data, OPEN. The verbs at the counter are
  `deposit` and `withdraw`, recorded as service events in
  the place's idiom; the holdings rows are the only state.
- **Capacity is data.** Vault capacity — in distinct kinds,
  in total units, or uncapped — is a field on the vault
  record, `null` until the owner rules it (the #106/#132
  null-slot discipline: unset, not zero, not infinite).
- **The soft-lock audit (a validation rule, mechanical).**
  A `key`-category item may never be vault-locked away
  from a story that needs it:
  1. **At deposit time:** deposit of a key item is refused
     while any live gate, lock, or story fact (#11 graph
     edges, #59 locks, #12 flags) references that item id.
  2. **At data validation:** for every key item in the
     registry, *vault-resident ⇒ no active consumer* must
     hold in any authored world state; a world build that
     strands a needed key item fails validation, in the
     same idiom as #31's own consistency checks (every
     `cureBy` resolves; here, every key resolves to
     reachable).
  Key items are also non-stackable in effect: the audit
  treats each key item as a unique holding regardless of
  its `stack` fields.
- **Non-writes.** The vault never touches #106 (a different
  store under the same discipline), never writes story
  flags, never prices anything (values are #31/#20 data),
  and never destroys: there is no vault-side release verb —
  discarding is the bag's own business, in #31's terms.

## Show lane

#106's show echo applies unchanged: the show has no storage
UI — it has places things are kept. A vault in an episode is
a storehouse a Ranger visits, staged as a place; the
one-location discipline is the fiction's honesty (a thing
handed over is *there*, not also in the bag), not a menu.

## Wiring

Data: #31 (item records, categories). Discipline: #106
(one location, derived views). Places: #132 family.
Audit consumers: #11 / #59 / #12 (key-item references).

## Coverage — honest

- **Architecture: fully documented**, and deliberately a
  mirror of a system this programme already trusts.
- **Contents: zero holdings instanced;** capacity, vault
  seats, and any per-place limits are OPEN.
