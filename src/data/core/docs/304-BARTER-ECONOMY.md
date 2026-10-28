# #304 — BARTER ECONOMY → prices are the world's opinion of you, itemised

**The floor.** #20 founded the economy: one unnamed
currency, integer-only, faucets and sinks, prices
that live on the item record — and two laws this spec
must honour while it deepens things: **no second
currency without an owner ruling, and no dynamic
pricing.** #118 built the shops on top: stock as
data, availability derived from progress, the item's
own price read at the counter. List 28 then made
prices *personal* (#269's bands discount and
surcharge; #270's town terms sit beyond them). What
none of that yet builds is the **barter depth** the
essence statement's kin are famous for: Fallout's
and Skyrim's economies where what you carry, who you
are, and who you're selling *to* all move the number
— and where the fence across the alley runs a
different economy entirely, in the same street.

**Read #20's law before this spec's prices.** "No
dynamic pricing" in #20 means what its context says:
no floating market simulation — no supply curves, no
prices that wander while you sleep. The item's price
on its record stays the economy's anchor, exactly
as #118 reads it. What this spec adds is a
**standing modifier applied once, at the counter,
from facts about the people at it** — the #269 shape
List 28 already landed, completed here into the full
trade read. The anchor never moves; the *terms*
are personal. If the two ever appear to conflict at
landing, this paragraph is the reconciliation, and
STAGING carries it as a registered clarification.

## Native spec — `mochiichao/barter/v1` (fragment beside this doc)

- **The trade read (every transaction, in order).**
  1. **Base** — the item record's price (#20), read
     through the shop's stock record (#118). Selling
     prices derive from the same anchor by #118's
     standing ratio data (the sell-back fraction is
     shop data, Pokémon's half being the base fill).
  2. **The counter's opinion** — the seller's group
     read: a town shop reads its town's #270 standing
     toward the Ranger (its terms class: welcome /
     standard / cold / refused, placed on #271 as
     #270 prescribes); a lone trader reads #269's
     visible-signs rule (first impressions from the
     band). `refused` is a real outcome of trade, not
     a softlock: refused shops are #270 facts with
     #275 roads back, and the spine's critical goods
     live at #132's service counters, which answer
     under service discipline, not barter.
  3. **Morale's personal terms** — #269's per-step
     price adjustment (band-capped) applies inside
     the counter's opinion: the ladder moves the
     number a few points either way; it never
     overrides a refusal or manufactures a welcome.
  4. **The goods themselves** — condition and
     provenance are data on the item instance where
     the item system carries them; a thing's *story*
     is never a price term in an honest shop — and is
     the **whole** price term at a fence (below).
  The read is displayed whole at the counter (the
  #180 honesty law at economic scale: the player sees
  the anchor, the terms, and the final number — no
  invisible bends in money either).
- **Fences run the mirror economy (#274's counters,
  this spec's arithmetic).** A fence pays for what a
  shop won't touch and asks nothing: **provenance is
  not read at a fence** — that is the fence's entire
  product. The terms invert: the underworld's read
  (#270's swapped tallies) prices the payout, #269's
  bad-side bands improve it step by step (#271's
  fence seat), and the shining bands are refused
  exactly as a villain is refused at an honest shop.
  A fence's payout fraction is *better than honest
  sell-back for stolen goods and worse for clean
  ones* (data, shaped here): fencing your own honest
  goods is a fool's trade, and the arithmetic says so
  without a line of dialogue.
- **Selling what isn't yours is possible, and it is
  a deed with witnesses.** Nothing in the trade read
  blocks a stolen item or a stolen Mochi (#268's
  records) from being offered: shops that *would*
  know the goods (the victim's own town, a marked
  individual's home counter) read provenance through
  the record (#80/#31 carry the theft stamp; #274's
  law — the record never launders — binds here too),
  and a sale of stolen goods before witnesses is a
  #272 report opportunity and a #269 deed (#269's
  table already prices both: selling a stolen Mochi
  to a fence is −6; goods, −2 per transaction).
  Barter does not police; the *world* polices,
  through the systems that already exist. That
  separation is the spec's spine.
- **Barter proper — goods for goods.** Where a
  counter accepts trade-in (data on the shop), value
  is reckoned in the one currency and settled in
  goods + remainder: **no second currency is
  founded** (#20's law quoted in), no barter-only
  scrip, no token economy. A wild-side trader who
  takes berries for tools is running the same read
  with a goods-settlement flag — the arithmetic is
  one, the settlement is presentation.
- **The currency runs unnamed.** Its name is the
  owner's standing slot (#20) and this spec does not
  touch it: every figure here keys `currency`, every
  display string is a #23 lookup waiting on the same
  word the whole economy waits on.

## Show lane

Prices are worldbuilding the audience can hear: a
shopkeeper's number tells a room's whole story about
the lead before a greeting lands. #276's mirror
carries the ladder's economics as tone; episodes
never quote this spec's fractions.

## Wiring

Anchor + stock: #20/#118. Opinions: #270 (group
terms) + #269/#271 (personal terms, fence mirror).
Provenance: #80/#31 theft stamps, #268 (what stolen
means), #274 (the fence counters themselves —
commissioned subject, STAGING). Witness cost: #272.
Roads back: #275. Service counters exempt by class:
#132. Display: #23 + #180's honesty law.

## Open slots

**The currency's name — the owner's slot, standing
since #20, untouched here by design.** Shop-by-shop
terms tuning, payout fractions, and which counters
accept trade-in are data. No mechanic is open: the
read order, the mirror, and the witness rule are
filled in full.

## Coverage — honest

- System: complete. Contents: no shop's terms are
  authored here; the read stands ready over #118's
  (still largely open) inventories.
