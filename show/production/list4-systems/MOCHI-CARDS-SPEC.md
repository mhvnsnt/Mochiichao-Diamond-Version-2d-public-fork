# #36 — TRADING-CARD FRAME GRAMMAR → Mochi Cards spec

**What was studied.** Trading-card frame grammar as a
documented layout system across the genre: a card is a fixed
anatomy — name band, art window, type/category line, body text
zone (abilities/effects), stat block, collector number, rarity
mark, set mark — where every zone's position is grammar the
reader learns once and then reads at speed. The yield is a
native frame + data spec. **Display name is canon: "Mochi
Cards"** (display-sweep ruling: Data Cards → Mochi Cards; the
name existed in the game first — this spec gives the physical/
print line its format under that name).

## Status of the thing itself

No Mochi Cards set, card list, rarity ladder, or game rules
exist in canon. This package specifies the **frame grammar and
the data record** a future set would be printed from — the
same posture as #31 (schema + joins, contents OPEN). It does
not invent a card game.

## The frame grammar (print anatomy, top → bottom)

1. **Name band** — display name (rename-law string, never the
   internal id) + stage/line marker slot
2. **Art window** — the species' approved art (style spec of
   record; lustre variant art permitted *as the variant
   printing* — the #15 palette-variant system is the art
   source, identity locks unchanged)
3. **Type line** — the species' type/description data, joined
   from species.json by id (never retyped onto the card record)
4. **Body zone** — effect/ability text slots `{textRef}` —
   pointers to text records, so a wording fix is one edit
   (dialogue/text systems own text; cards own layout)
5. **Stat block** — values joined from species data at print
   time; the card record stores **no stats** (single source of
   truth — a balance change reprints, never contradicts)
6. **Footer** — collector number `MC-<set>-<nnn>`, rarity mark
   slot, set mark slot, illustrator credit line (house rule:
   credit is data, printed from the record)

## The data record — `mochi-card.schema.json`

`{cardId, speciesId (join), printing: standard|lustre,
textRefs: [], rarity: null, setId: null, number: null,
illustrator: null, status}` — rarity ladder and set structure
are **OPEN** (owner decisions when a set is real); the slots
are fixed now so a set designed later lands in a stable shape.

## Wiring

- **Species data** — name/type/stats/art all join from the
  species record + bundle manifest (#15); a card can never
  disagree with the game about what a species is.
- **Toy-read (#35)** — card art uses the same approved art the
  toy-read test certifies; no card-specific redraws.
- **Move system** — if a future set prints move cards, they
  join moves.json by id under the rename law (display names
  from the registry, ids stable). Flagged as a possibility the
  schema tolerates, not a plan.

## Coverage — honest

- **Grammar: fully documented** as genre layout practice.
- **Contents: none.** No set, no rarities, no rules, no card
  list — all OPEN. The deliverable is a frame, a record shape,
  and the joins that keep a future set honest against the
  game's own data.
