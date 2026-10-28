# #169 — RANGER HIDEOUTS → the personal space: tenure, decoration, visiting

**Seat in the doctrine:** three hideout-adjacent
systems exist, and this is the third, distinct from
both. #99's hideout grammar owns the **Syndicate
hideout as event space** — a beat sequence on the #12
architecture with an entrance-return contract. #119
owns the **rooms** any interior is made of. #169 owns
the **Ranger's own hideout**: a personal, persistent
space the Ranger keeps — not an encounter, not an
event — whose content is tenure, decoration, and who
may visit. A hideout instance needs #119's layout
beneath it; it needs #99's beats only if a story ever
stages one there.

**What was studied.** Personal-base systems in the
publicly documented record: a discoverable place in
the world that becomes the player's own — decorated
with placed objects, visited by friends under the
owner's terms, persistent across the whole game. The
architectural kit: the space is an ordinary interior
plus an ownership record; decoration is inventory
*placed*, never duplicated; visiting is a social rule,
not a teleport list. No base layouts, furniture sets,
or discovery mechanics are copied.

## Native spec — `mochiichao/ranger-hideout/v1` (fragment beside this doc)

- **The hideout record:** `{hideoutId, keeper (Ranger
  ref), interiorRef (a #119 interior record — its
  hostNode is the hideout's one entrance in the world),
  established (#12 fact ref — how/when it became
  theirs is history, recorded once), placements[],
  visiting}`. This record owns tenure + decoration +
  visiting and nothing else: layout is #119's, beats
  are #12's, the Ranger is the roster's.
- **Decoration is item-layer placement.** A placement
  is `{itemId, roomId, position}` — the item is a #31
  record (decor is already a named prize kind, #56's
  prize table rows reference item/decor ids), the room
  is one of the interior's rooms, the position is
  room-local data. Placing moves the item out of the
  Ranger's bag/storage into the room; removing returns
  it. **The item is never copied** — a placed item is
  an item that is *there*, and the placement record is
  the only trace of the arrangement. (This is an
  item-placement record on the hideout, not a new kind
  in #106: #106's `location` governs *individuals*, and
  gains no hideout value — see the care law next.)
- **A hideout is never a care location — the
  separation holds.** The Garden/centre/camp table
  (#132/#65/#134) is closed: kept Mochi reside in the
  Garden (#106 `location.kind: garden`), are treated
  at centres, rest at camp. **No individual's location
  may read `hideout`** — the value does not exist. A
  partner present with the Ranger is *presence*, under
  #58's follower binding (the partner is with the
  Ranger, wherever the Ranger is), not residence. The
  hideout writes no care axes, no bond, no honours, no
  dex state. If Mochi are ever to *live* at a hideout,
  that is a care-law revision for the owner — not a
  field this format smuggles in.
- **Discovery and visiting — the social grammar.**
  A hideout is found at its entrance in the world
  (the #119 hostNode). Visiting is by the keeper's
  terms: the record's `visiting` posture is a closed
  vocabulary `{private | invited | open}` (the value
  on any given hideout is content; which posture is
  the *default* for a new hideout is a PROPOSAL —
  `private` — flagged, not ruled). Another Ranger
  *learning of* a hideout is a social fact in #90/#93
  terms (you were told; you were brought) — the atlas
  (#137) never reveals a hideout the Ranger has not
  been given: a secret place is display-layer
  protected, the Leak rule applied socially, exactly
  as #163 seals a habitat. An uninvited discovery in
  fiction is a story event, never a system outcome.
- **Show lane:** a hideout is a standing set (bank
  reuse, #82) — and its `placements[]` are the
  set-dressing record: the show's continuity for the
  room *is* this data. A cushion moved between
  episodes is a continuity fact checked against the
  record, like any set state; the show never depicts
  the placement *system*, only the room it produces.

## Open slots (nothing invented)

Whether Ranger hideouts exist in canon at all · every
instance, entrance, and interior · the decor item
roster (items are #31 content — zero instanced
anywhere yet) · position grammar precision (tile vs
anchor points — a layout-lane call when an interior
exists to decorate) · the default visiting posture
(proposal above) · whether visiting Rangers' partners
interact with the room beyond presence (show texture,
not system).


**Landing note — List 28 #274 (2026-10-27):** fence seats are stocked and gated in this file's hideouts (274-UNDERWORLD-FENCES.md): a fence is a recurring room, and the laundering law is enforced by shape — no clean-record operation exists anywhere in the fence system.
